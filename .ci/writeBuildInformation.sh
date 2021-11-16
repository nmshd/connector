#!/usr/bin/env bash
set -e

if [ -z "$PACKAGE_VERSION" ]; then
    echo "The environment variable 'PACKAGE_VERSION' must be set."
    exit 1
fi

if [ -z "$BUILD_NUMBER" ]; then
    echo "The environment variable 'BUILD_NUMBER' must be set."
    exit 1
fi

if [ -z "$COMMIT_HASH" ]; then
    echo "The environment variable 'COMMIT_HASH' must be set."
    exit 1
fi

DATE=$(date -u --iso-8601=seconds)

TARGET_FILE="./dist/buildInformation.js"

echo "Writing the following properties into $TARGET_FILE"
echo "  - VERSION: $PACKAGE_VERSION"
echo "  - BUILD_NUMBER: $BUILD_NUMBER"
echo "  - COMMIT_HASH: $COMMIT_HASH"
echo "  - DATE: $DATE"

sed -i "s/{{version}}/$PACKAGE_VERSION/" $TARGET_FILE
sed -i "s/{{build}}/$BUILD_NUMBER/" $TARGET_FILE
sed -i "s/{{commit}}/$COMMIT_HASH/" $TARGET_FILE
sed -i "s/{{date}}/$DATE/" $TARGET_FILE
