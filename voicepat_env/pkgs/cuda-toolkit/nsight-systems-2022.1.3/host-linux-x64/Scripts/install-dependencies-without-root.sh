#!/bin/bash

if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    echo "Error: This script needs to be sourced. Please run as 'source ${BASH_SOURCE[0]} install-directory-param'" >&2
    exit 1
fi

if [ -z "$1" ]; then
    echo "Error: This script needs to be called with install directory parameter.\
        Please run as 'source ${BASH_SOURCE[0]} install-directory-param'" >&2
    exit 1
fi

install_dir=$1
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# shellcheck source=/dev/null
source "$script_dir/setup-dependencies-environment.sh" "$install_dir"

if [ "$NSYS_OS_RELEASE" = "Ubuntu" ]; then
    # shellcheck source=/dev/null
    source "$script_dir"/Ubuntu/non-root-dependencies-installer-ubuntu.sh "$install_dir"
elif [ "$NSYS_OS_RELEASE" = "CentOS Linux" ]; then
    # shellcheck source=/dev/null
    source "$script_dir"/CentOS/non-root-dependencies-installer-centos.sh "$install_dir"
else
    echo "Unsupported OS for non-root dependencies installer: $NSYS_OS_RELEASE" >/dev/tty
fi
