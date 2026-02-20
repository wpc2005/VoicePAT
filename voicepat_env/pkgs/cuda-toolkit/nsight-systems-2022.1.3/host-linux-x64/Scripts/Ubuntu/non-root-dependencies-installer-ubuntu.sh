#!/bin/bash

install_dir=$1
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
temp_folders=()
already_installed=()
ubuntu_codename=$(grep "^UBUNTU_CODENAME=" /etc/os-release | awk -F= '{print $2}')
ubuntu_verison=$(grep "^VERSION_ID=" /etc/os-release | awk -F= '{print $2}' | tr -d '"')
echo "Current system architecture: $NSYS_ARCH" >/dev/tty

trap exit_func INT

function cleanup_temp_files() {
    for temp_folder in "${temp_folders[@]}"; do
        rm -rf "$temp_folder"
    done
    temp_folders=()
}

function exit_func() {
    cleanup_temp_files
    exit
}

function contains_element() {
    local e match=$1
    shift
    for e; do [[ "$e" == "$match" ]] && return 0; done
    return 1
}

function replace_in_file() {
    local old=$1
    local new=$2
    local file_to_replace=$3
    sed -i -e "s@$old@$new@g" "$file_to_replace"
}

function replace_abs_path_in_file() {
    local path=$1
    local file_to_replace=$2
    replace_in_file "$path" "$install_dir$path" "$file_to_replace"
}

function replace_system_dirs() {
    local file_to_replace=$1

    local abs_paths_to_replace
    abs_paths_to_replace=("/etc/" "/var/lib/" "/usr/")
    for path in "${abs_paths_to_replace[@]}"; do
        replace_abs_path_in_file "$path" "$file_to_replace"
    done

    local replace_paths_exceptions
    replace_paths_exceptions=("/usr/share/debconf")
    for path in "${replace_paths_exceptions[@]}"; do
        replace_in_file "$install_dir$path" "$path" "$file_to_replace"
    done
}

function pkg_file_list() {
    local curl_cmd
    local libcurl_lib_path
    local libcurl_system_possible_lib_paths
    libcurl_system_possible_lib_paths=("/usr/lib/x86_64-linux-gnu"
        "/usr/lib64"
        "/usr/lib"
        "/usr/lib32"
    )
    if [ -x "$(which curl)" ]; then
        for libcurl_poss_path in "${libcurl_system_possible_lib_paths[@]}"; do
            if [ -e "$libcurl_poss_path/libcurl.so.4" ]; then
                curl_cmd=curl
                libcurl_lib_path=${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
                break
            fi
        done
    fi
    if [ -z "$curl_cmd" ]; then
        if [ -f "$install_dir/usr/bin/curl" ]; then
            if dpkg -l | grep -qw libcurl4; then
                libcurl_lib_path=${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
            else
                libcurl_file=$(find "$install_dir" -name "libcurl.so.4")
                if [ -n "$libcurl_file" ]; then
                    libcurl_lib_path=$(dirname "${libcurl_file}")${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
                fi
            fi
            if [ -n "$libcurl_lib_path" ]; then
                curl_cmd=$install_dir/usr/bin/curl
            fi
        fi
    fi
    if [ -n "$curl_cmd" ]; then
        export LD_LIBRARY_PATH=$libcurl_lib_path${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
        local packages_host
        if grep -qFx 'ID=ubuntu' /etc/os-release
        then
            packages_host=https://packages.ubuntu.com
        else
            packages_host=https://packages.debian.org
        fi
        local curl_res
        curl_res=$($curl_cmd -s --capath "$install_dir/etc/ssl/certs" \
        --cacert "$install_dir/etc/ssl/certs/ca-certificates.crt" \
        "$packages_host/$ubuntu_codename/$(dpkg --print-architecture)/$1/filelist" |
            sed -n -e '/<pre>/,/<\/pre>/p' |
            sed -e 's/<[^>]\+>//g' -e '/^$/d')
        echo "${curl_res[@]}"
    fi
}

# force cache update with our installed dir
function update_fonts_cache() {
    if [ -e "$install_dir/etc/fonts/fonts.conf" ]; then
        if [ -e "$install_dir/usr/bin/fc-cache" ]; then
            local conf_path
            conf_path=$install_dir/etc/fonts/fonts.conf
            replace_in_file "conf.d" "$install_dir/etc/fonts/conf.d" "$conf_path"
            replace_abs_path_in_file "/usr/share/fonts" "$conf_path"
            "$install_dir/usr/bin/fc-cache" -sfv
        fi
    fi
}

function local_download_install() {
    local pkg_name=$1
    local random_folder
    random_folder=$install_dir/$(tr -dc 'a-zA-Z0-9' <'/dev/urandom' | fold -w 16 | head -n 1)
    mkdir -p "$random_folder"
    chmod 777 "$random_folder"
    temp_folders+=("$random_folder")
    (cd "$random_folder" && apt -qq download "$pkg_name")
    echo "installing: $pkg_name" >/dev/tty

    random_folder_postinst=$install_dir/$(tr -dc 'a-zA-Z0-9' <'/dev/urandom' | fold -w 16 | head -n 1)
    mkdir -p "$random_folder_postinst"
    chmod 777 "$random_folder_postinst"

    local packages_cnt
    packages_cnt=$(find "$random_folder" -maxdepth 1 -type f -name "*.deb" | wc -l)
    if [ "$packages_cnt" != 0 ]
    then
        # extract pre and post install scripts
        dpkg -e "$random_folder"/*.deb "$random_folder_postinst"
        # run pre install script
        if [ -e "$random_folder_postinst/preinst" ]; then
            replace_system_dirs "$random_folder_postinst/preinst"
            export DPKG_MAINTSCRIPT_NAME=$pkg_name
            export DPKG_MAINTSCRIPT_PACKAGE=preinst
            # shellcheck disable=SC2030
            (export DPKG_MAINTSCRIPT_NAME=$pkg_name && export DPKG_MAINTSCRIPT_PACKAGE=postinst &&
                cd "$random_folder_postinst" && ./preinst install)
        fi
        # extract package
        dpkg -x "$random_folder"/*.deb "$install_dir"
        # run post install script
        if [ -e "$random_folder_postinst/postinst" ]; then
            replace_system_dirs "$random_folder_postinst/postinst"
            # shellcheck disable=SC2031
            (export DPKG_MAINTSCRIPT_NAME=$pkg_name && export DPKG_MAINTSCRIPT_PACKAGE=postinst &&
                cd "$random_folder_postinst" && ./postinst configure)
        fi
    fi
}

# Check that the package is already installed and if not, then install
function check_local_installed_install() {
    local pkg_name=$1
    # shellcheck disable=SC2076
    if [[ ! " ${already_installed[*]} " =~ " ${pkg_name} " ]]; then
        local without_check=$2
        local pkg_files
        if [ "$without_check" = false ]; then
            mapfile -t pkg_files < <(pkg_file_list "$pkg_name")
        fi
        if [ ${#pkg_files[@]} -eq 0 ]; then
            local_download_install "$pkg_name"
        else
            for pkg_file in "${pkg_files[@]}"; do
                local full_pkg_file
                full_pkg_file=$install_dir/$pkg_file
                if [ ! -f "$full_pkg_file" ]; then
                    local_download_install "$pkg_name"
                    break
                fi
            done
        fi
        already_installed+=("$pkg_name")
    fi
}

function install_package_dependecies() {
    local pkg_name=$1
    local without_check=$2
    # shellcheck disable=SC2076
    if [[ ! " ${already_installed[*]} " =~ " ${pkg_name} " ]]; then
        if ! dpkg -l | grep -qw "$pkg_name"; then
            local pkg_deps
            pkg_deps=$(apt-cache depends "$pkg_name" | grep -E 'Depends'\
                | cut -d ':' -f 2,3 | sed -e s/'<'/''/ -e s/'>'/''/)
            for dep_pkg_name in $pkg_deps; do
                install_package_dependecies "$dep_pkg_name" "$without_check"
            done
            check_local_installed_install "$pkg_name" "$without_check"
        else
            echo "Package is already installed in system: $pkg_name" >/dev/tty
            already_installed+=("$pkg_name")
        fi
    fi
}

# dowload and install prerequisites for the installer
function download_prereqs() {
    local prereq_packages=(libexpat1 libexpat1-devlibkrb5-3 libsasl2-2
        ca-certificates libcurl4 curl)
    for pkg_name in "${prereq_packages[@]}"; do
        install_package_dependecies "$pkg_name" true
    done

    # restoring symlinks
    local lib_folders
    lib_folders=("/usr/lib/" "/lib/" "/usr/lib/$NSYS_ARCH-linux-gnu/")
    local bin_folders
    bin_folders=("/usr/bin/" "/bin/")
    local share_folders
    share_folders=("/usr/share/")
    declare -A replace_folders
    replace_folders=(["/lib/"]="${lib_folders[@]}" ["/usr/lib/"]="${lib_folders[@]}"
        ["/bin/"]="${bin_folders[@]}" ["/usr/bin/"]="${bin_folders[@]}"
        ["/usr/share/"]="${share_folders[@]}")

    for folder in "${!replace_folders[@]}"; do
        # shellcheck disable=SC2206
        local alt_folders=(${replace_folders[$folder]})
        for alt_folder in "${alt_folders[@]}"; do
            declare -a links_array
            readarray -t links_array < <(find "$install_dir" -xtype l 2>/dev/null)
            for link in "${links_array[@]}"; do
                local link_target
                link_target=$(readlink "$link")
                if [ ! -e "${link_target}" ]; then
                    local new_target
                    # shellcheck disable=SC2001
                    new_target=$(echo "$link_target" | sed "s@${folder}@${install_dir}${alt_folder}@g")
                    if [ -e "${new_target}" ]; then
                        echo "Restoring link ($link) from: $link_target to $new_target" >/dev/tty
                        ln -Tfs "$new_target" "$link"
                    fi
                fi
            done
        done
    done

    local update_certs_script
    update_certs_script=$install_dir/usr/sbin/update-ca-certificates
    if [ -e "$update_certs_script" ]; then
        replace_system_dirs "$update_certs_script"
    fi
    update-ca-certificates
}

echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

download_prereqs
readarray -t deps_list <"$script_dir/packages.list"
version_packages_file=$script_dir/packages_$ubuntu_verison.list
if [ -e "$version_packages_file" ]; then
    readarray -t version_deps_list <"$script_dir/packages.list"
    deps_list+=("${version_deps_list[@]}")
fi
for pkg_name in "${deps_list[@]}"; do
    check_local_installed_install "$pkg_name" false
done
update_fonts_cache
cleanup_temp_files
