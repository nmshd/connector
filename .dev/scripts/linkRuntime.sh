#!/usr/bin/env bash

# Switch to Connector root dir, regardless of where this script is executed
# from.
CONNECTORPATH="$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")"
cd "$CONNECTORPATH"

[ -f .env ] && source "$CONNECTORPATH/.env"
if [ -z "$RUNTIME_PATH" ]; then
	echo "\$RUNTIME_PATH not set but required."
	exit 1
fi

if ! type "entr" >/dev/null; then
	echo "'entr' not found. Please install it via your package manager."
	exit 1
fi

_copyRuntime() {
	sleep 2
	printf "Copying runtime ..."

	find "$RUNTIME_PATH/packages/" -maxdepth 1 -mindepth 1 -type d | while read runtimePkgPath; do
		pkgName="$(jq -r .name "$runtimePkgPath/package.json")"
		mkdir -p "$CONNECTORPATH/node_modules/$pkgName"
		cp -r "$runtimePkgPath/dist" "$runtimePkgPath/src" "$CONNECTORPATH/node_modules/$pkgName"
	done
	echo "done!"
}

case "$1" in
	"") find $RUNTIME_PATH/packages/*/dist | entr -dd -r -s "$0 _copyRuntime" ;;

	*) "$@" ;;
esac
