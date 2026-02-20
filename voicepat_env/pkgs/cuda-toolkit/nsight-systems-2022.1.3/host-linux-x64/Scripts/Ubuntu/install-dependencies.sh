#!/bin/bash

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ubuntu_verison=$(grep "^VERSION_ID=" /etc/os-release | awk -F= '{print $2}' | tr -d '"')

apt-get update
# shellcheck disable=SC2046
DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y $(cat "$script_dir/packages.list")
version_packages_file=$script_dir/packages_$ubuntu_verison.list
if [ -e "$version_packages_file" ]; then
    # shellcheck disable=SC2046
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y $(cat "$version_packages_file")
fi
