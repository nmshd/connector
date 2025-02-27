#!/usr/bin/env bash

set -e

if [ -z "$VERSION" ]; then
    echo "The environment variable 'VERSION' must be set."
    exit 1
fi

npm ci

npm run build:ci
.ci/writeBuildInformation.sh

zip -r "connector-$VERSION.zip" dist package.json package-lock.json
