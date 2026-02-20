#!/bin/bash

sudo_location=$(command -v sudo) 

user=$(id -un 2>/dev/null || true)
sudo_cmd=""
if [ "$user" != "root" ]; then
	if [ -n "$sudo_location" ]; then
		sudo_cmd='sudo'
	else
		cat >&2 <<-'EOF'
            Error: "sudo" is not installed.
			If you don't have root access, please use install-dependencies-without-root.sh
		EOF
		exit 1
	fi
fi

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
NSYS_OS_RELEASE=$(awk -F= '/^NAME/{print $2}' /etc/os-release | tr -d '"')

if [ "$NSYS_OS_RELEASE" = "Ubuntu" ]; then
    $sudo_cmd "$script_dir"/Ubuntu/install-dependencies.sh
elif [ "$NSYS_OS_RELEASE" = "CentOS Linux" ]; then
    $sudo_cmd "$script_dir"/CentOS/install-dependencies.sh
else
    echo "Unsupported OS for dependencies installer: $NSYS_OS_RELEASE" >/dev/tty
fi
