#!/bin/bash

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

if [ "$(command -v dnf)" ]; then
    package_manager=dnf
elif [ "$(command -v yum)" ]; then
    package_manager=yum
else
    echo "Only dnf and yum package managers are supported.";
    exit 1;
fi;

# shellcheck disable=SC2046
$package_manager install -y $(cat "$script_dir/packages.list")
