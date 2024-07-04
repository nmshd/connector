#!/usr/bin/env bash

source .env
CONNECTORPATH=$(pwd)

if [ -z "$RUNTIME_PATH" ]; then
    echo "Please provide the path via the .env in the root folder file"
    exit 1
fi

currentPackageName=$(jq .name package.json 2>/dev/null | tr -d '"') || ""
if [ -z "$currentPackageName" ] || [ "$currentPackageName" != "@nmshd/connector" ]; then
    echo "Please run this script from the root of the connector"
    exit 1
fi

## declare an array variable
declare -a arr=("consumption" "content" "iql" "runtime" "transport")

## now loop through the above array
for package in "${arr[@]}"; do
    cd "$RUNTIME_PATH/packages/$package" || exit
    packageName=$(jq .name package.json | tr -d '"')
    # printf "Copying $packageName to $currentPackageName \n"
    cp dist $CONNECTORPATH/node_modules/$packageName -r
    cp src $CONNECTORPATH/node_modules/$packageName -r

    cd $CONNECTORPATH || exit
done
echo "Runtime updated"
