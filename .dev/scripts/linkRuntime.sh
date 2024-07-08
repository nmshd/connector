#!/usr/bin/env bash

# full path stripped of three path segments
CONNECTORPATH="$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")"

[ -f .env ] && source $CONNECTORPATH/.env

if [ -z "$RUNTIME_PATH" ]; then
    echo "Please provide the path via the .env in the root folder file"
    exit 1
fi

currentPackageName=$(jq -r .name package.json 2>/dev/null) || ""
if [ -z "$currentPackageName" ] || [ "$currentPackageName" != "@nmshd/connector" ]; then
    echo "Please run this script from the root of the connector"
    exit 1
fi

if ! type "entr" >/dev/null; then
    echo "entr not found pls install it"
fi

_copyRuntime() {
    echo "updating runtime"
    sleep 2
    ## now loop through the above array
    for package in consumption content iql runtime transport; do
        cd "$RUNTIME_PATH/packages/$package" || exit
        packageName=$(jq .name package.json | tr -d '"')
        # printf "Copying $packageName to $currentPackageName \n"
        cp dist $CONNECTORPATH/node_modules/$packageName -r
        cp src $CONNECTORPATH/node_modules/$packageName -r

        cd $CONNECTORPATH || exit
    done
    echo "Runtime updated"
}

# At the beginning of your script, add a check for a specific argument to run _copyRuntime
if [ "$1" = "run_copyRuntime" ]; then
    _copyRuntime
    exit 0
fi

# entr cannnot run functions in the current file so we call the file again with an extra argument
find $RUNTIME_PATH/packages/*/dist | entr -dd -r -s "$0 run_copyRuntime"
