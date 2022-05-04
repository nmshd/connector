set -e
set -x

if [ -z "$(which jq)" ]; then
    echo "jq could not be found"
    exit 1
fi

cd packages/sdk

PACKAGE_VERSION=$(jq .version package.json -cr)

case "$PACKAGE_VERSION" in
*-alpha*) npx enhanced-publish --if-possible --tag alpha ;;
*-beta*) npx enhanced-publish --if-possible --tag beta ;;
*-rc*) npx enhanced-publish --if-possible --tag next ;;
*) npx enhanced-publish --if-possible ;;
esac
