#!/bin/bash

install_dir=$1
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
temp_folders=()
checked_pkgs=()
echo "Current system architecture: $NSYS_ARCH" >/dev/tty

mkdir -p "$install_dir"

trap cleanup_temp_files INT

function cleanup_temp_files() {
    for temp_folder in "${temp_folders[@]}"; do
        rm -rf "$temp_folder"
    done
    temp_folders=()
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

function get_package_manager() {
    local package_manager
    package_manager=$(which dnf 2>/dev/null)
    if [ -z "$package_manager" ]; then
        package_manager=$(which yum)
        if [ -z "$package_manager" ]; then
            echo "yum and dnf package managers are no exist. To continue, you need to install one of them." >/dev/tty
        fi
    fi
    echo "$package_manager"
}

function is_package_installed_global() {
    local pkg_name=$1
    echo "Checking installation of $pkg_name" >/dev/tty
    for full_pkg_name in "${checked_pkgs[@]}"; do
        if [[ "$full_pkg_name" == "${pkg_name}*" ]]; then
            checked_pkgs+=("$full_pkg_name")
            echo "Package is installed: $pkg_name" >/dev/tty
            return 0
        fi
    done
    local package_manager
    package_manager=$(get_package_manager)
    if [ -z "$package_manager" ]; then
        echo "Package manager not found" >/dev/tty
        return 1
    fi
    local command
    command="$package_manager list installed $pkg_name 2>&1 | grep -i 'error'"
    local output
    output=$(eval "$command")
    if [ -n "$output" ]; then
        return 1
    else
        checked_pkgs+=("$pkg_name")
        echo "Package is installed on the system: $pkg_name" >/dev/tty
        return 0
    fi
}

# yumutils is necessary for this implementation of the installer
function check_install_yumutils() {
    local repoquery
    repoquery=$(which repoquery 2>/dev/null)
    if [ -z "$repoquery" ]; then
        echo "Downloading which and yum-utils" >/dev/tty
        local random_folder
        random_folder=$install_dir/$(tr -dc 'a-zA-Z0-9' <'/dev/urandom' | fold -w 16 | head -n 1)
        temp_folders+=("$random_folder")
        local pkg_name
        pkg_name=which
        mapfile -t which_packages < <("$script_dir/dependency_resolver" "$random_folder" "$pkg_name" false "${checked_pkgs[@]}")
        if ((${#which_packages[@]})); then
            readarray -t which_installed < <("$script_dir"/rpm_extract "$install_dir" "${which_packages[@]}")
            if ((!${#which_installed[@]})); then
                echo "Failed to install which. To continue, you need to install this package." >/dev/tty
            fi
        fi
        echo "Downloaded which" >/dev/tty
        pkg_name=yum-utils
        mapfile -t yum_utils_packages < <("$script_dir/dependency_resolver" "$random_folder" "$pkg_name" false "${checked_pkgs[@]}")
        if ((${#yum_utils_packages[@]})); then
            readarray -t installed < <("$script_dir"/rpm_extract "$install_dir" "${yum_utils_packages[@]}")
            if ((${#installed[@]})); then
                repoquery=$(which repoquery 2>/dev/null)
            else
                echo "Failed to install yum-utils. To continue, you need to install this package." >/dev/tty
            fi
        fi
    fi
    echo "Downloaded yum-utils: $repoquery" >/dev/tty
    echo "$repoquery"
}

function repoquery_with_arch() {
    local repoquery
    repoquery=$(which repoquery 2>/dev/null)
    local package_manager
    package_manager=$(get_package_manager)
    if [[ "$package_manager" == *yum ]]; then
        echo "$repoquery --archlist=$NSYS_ARCH,noarch"
    elif [[ "$package_manager" == *dnf ]]; then
        echo "$repoquery --arch=$NSYS_ARCH,noarch"
    fi
}

function repoquery_list_files() {
    local repoquery
    repoquery=$(repoquery_with_arch)
    local package_manager
    package_manager=$(get_package_manager)
    if [[ "$package_manager" == *yum ]]; then
        echo "$repoquery -q -l --plugins"
    elif [[ "$package_manager" == *dnf ]]; then
        echo "$repoquery -l"
    fi
}

function local_download_install() {
    local pkg_name=$1
    echo "installing package: $pkg_name" >/dev/tty
    local random_folder
    random_folder=$install_dir/$(tr -dc 'a-zA-Z0-9' <'/dev/urandom' | fold -w 16 | head -n 1)
    mkdir "$random_folder"
    temp_folders+=("$random_folder")
    repoquery=$(repoquery_with_arch)
    if [ -n "$repoquery" ]; then
        local dep_pkgs
        mapfile -t dep_pkgs < <("$script_dir/dependency_resolver" "$random_folder" "$pkg_name" false "${checked_pkgs[@]}")
        if ((${#dep_pkgs[@]})); then
            shopt -s nullglob
            local rpm_files
            rpm_files=("$random_folder"/*.rpm)
            shopt -u nullglob
            if ((${#dep_pkgs[@]})); then
                local installed
                readarray -t installed < <("$script_dir/rpm_extract" "$install_dir" "${rpm_files[@]}")
                if [ ${#installed[@]} -eq 0 ]; then
                    echo "Failed to install $pkg_name. To continue, you need to install $pkg_name package." >/dev/tty
                fi
            else
                echo "Failed to download $pkg_name. To continue, you need to install $pkg_name package." >/dev/tty
            fi
        else
            echo "Package $pkg_name already installed." >/dev/tty
        fi
    else
        echo "Failed to install yum-utils. To continue, you need to install this package." >/dev/tty
    fi
}

function get_not_installed_package_deps() {
    local dep_pkgs
    mapfile -t dep_pkgs < <("$script_dir/dependency_resolver" "$install_dir" "$1" true "${checked_pkgs[@]}")
    echo "${dep_pkgs[@]}"
}

function pkg_file_list() {
    local repoquery
    repoquery=$(repoquery_with_arch)
    local dep_pkgs
    dep_pkgs=("$@")
    local pkg_files
    pkg_files=()
    if [ ! -z "$repoquery" ]; then
        repoquery_list_files=$(repoquery_list_files)
        for dep_pkg in "${dep_pkgs[@]}"; do
            if is_package_installed_global "$dep_pkg"; then
                echo "Package is already installed: $dep_pkg" >/dev/tty
            else
                # shellcheck disable=SC2076
                if [[ ! " ${checked_pkgs[*]} " =~ " ${dep_pkg} " ]]; then
                    local cur_dep_pkg_files
                    mapfile -t cur_dep_pkg_files < <($repoquery_list_files "$dep_pkg" 2>/dev/null)
                    pkg_files+=("${cur_dep_pkg_files[@]}")
                fi
            fi
        done
        mapfile -t cur_dep_pkg_files < <("$repoquery_list_files" "$1" 2>/dev/null)
        pkg_files+=("${cur_dep_pkg_files[@]}")
    else
        echo "Failed to install $1. To continue, you need to install yum-utils package." >/dev/tty
    fi
    echo "${pkg_files[@]}"
}

function check_installed() {
    local need_error=$1
    shift
    local pkg_files=("$@")
    if [ ${#pkg_files[@]} -eq 0 ]; then
        echo "install"
    else
        for pkg_file in "${pkg_files[@]}"; do
            full_pkg_file=$install_dir/$pkg_file
            if [ ! -e "$full_pkg_file" ]; then
                if [ ! -e "$pkg_file" ]; then
                    if [ "$need_error" -eq "1" ]; then
                        echo "Package file not exists: '$full_pkg_file'" >/dev/tty
                        exit 1
                    fi
                    echo "install"
                fi
            fi
        done
    fi
}

function check_local_installed_install() {
    local pkg_name=$1
    if is_package_installed_global "$pkg_name"; then
        echo "The package $pkg_name is already installed" >/dev/tty
    else
        if contains_element "${pkg_name}" "${checked_pkgs[@]}"; then
            echo "Package already exists: $pkg_name" >/dev/tty
        else
            local dep_pkgs
            mapfile -t dep_pkgs < <(get_not_installed_package_deps "$pkg_name")
            local pkg_files
            mapfile -t pkg_files < <(pkg_file_list ${dep_pkgs[@]})
            local need_install
            need_install=$(check_installed "0" ${pkg_files[@]})
            if [ -n "$need_install" ]; then
                local_download_install $pkg_name
            fi
            echo "Checking for succesfull installation: $pkg_name" >/dev/tty
            succesfully_installed=$(check_installed "1" ${pkg_files[@]})
            if [ -z "$succesfully_installed" ]; then
                if [ -n "$need_install" ]; then
                    echo "Succesfully installed package: $pkg_name" >/dev/tty
                else
                    echo "Package is already installed: $pkg_name" >/dev/tty
                fi
                for dep_pkg in "${dep_pkgs[@]}"; do
                    dep_pkg_rpm_name=$(basename -- "$dep_pkg")
                    dep_pkg_name=${dep_pkg_rpm_name%.*}
                    checked_pkgs+=("$dep_pkg_name")
                done
                checked_pkgs+=("$pkg_name")
                mapfile -t checked_pkgs < <(echo "${checked_pkgs[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' ')
            else
                echo "Error while installing package $pkg_name occured: " >/dev/tty
            fi
        fi
    fi
}

repoquery=$(check_install_yumutils)
if [ -n "$repoquery" ]; then
    repoquery=$(repoquery_with_arch)
    readarray -t installed_on_system < <($repoquery -a --installed --qf="%{name}-%{version}-%{release}.%{arch}" 2>/dev/null)
    checked_pkgs+=("${installed_on_system[@]}")
    readarray -t deps_list <"$script_dir/packages.list"
    for pkg_name in "${deps_list[@]}"; do
        check_local_installed_install "$pkg_name"
    done
fi
update_fonts_cache

cleanup_temp_files
