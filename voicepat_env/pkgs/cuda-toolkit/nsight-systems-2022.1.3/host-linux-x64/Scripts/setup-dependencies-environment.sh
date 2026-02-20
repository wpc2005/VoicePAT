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
NSYS_OS_RELEASE=$(awk -F= '/^NAME/{print $2}' /etc/os-release | tr -d '"')
export NSYS_OS_RELEASE
if [ "$NSYS_OS_RELEASE" = "Ubuntu" ]; then
    NSYS_ARCH=$(uname -m)
elif [ "$NSYS_OS_RELEASE" = "CentOS Linux" ]; then
    NSYS_ARCH=$(rpm --eval '%{_arch}')
fi
export NSYS_ARCH

# if fontconfig no exists, then it should be at least installed via dependencies installer
if [ ! -x "$(command -v fc-list)" ]; then
    export FONTCONFIG_FILE=$install_dir/etc/fonts/fonts.conf
    export FONTCONFIG_PATH=$install_dir/etc/fonts/
fi

export PATH=$install_dir/usr/sbin:$install_dir/usr/bin:$install_dir/bin${PATH:+:$PATH}
export LD_LIBRARY_PATH=$install_dir/lib:$install_dir/lib64:$install_dir/usr/lib:$install_dir/usr/lib64${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
export LD_LIBRARY_PATH=$install_dir/usr/lib/$NSYS_ARCH-linux-gnu:$install_dir/usr/lib64/$NSYS_ARCH-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
export LD_LIBRARY_PATH=$install_dir/lib/$NSYS_ARCH-linux-gnu:$install_dir/lib64/$NSYS_ARCH-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
