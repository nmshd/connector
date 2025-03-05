#!/usr/bin/env bash

set -e

if [ -z "$VERSION" ]; then
    echo "The environment variable 'VERSION' must be set."
    exit 1
fi

rm -rf packages
jq --indent 4 -M ".dependencies.\"@nmshd/connector-types\" = \"$VERSION\"" package.json >package.out.json && mv package.out.json package.json

npm i

npm run build:ci
.ci/writeBuildInformation.sh

zip -r "connector-$VERSION.zip" dist package.json package-lock.json
