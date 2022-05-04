set -e
set -x

if [ -z "$(which jq)" ]; then
    echo "jq could not be found"
    exit 1
fi

VERSION=$(jq .version package.json -cr)

case "$VERSION" in
*-alpha*) npx lerna publish from-package --yes --no-verify-access --dist-tag alpha ;;
*-beta*) npx lerna publish from-package --yes --no-verify-access --dist-tag beta ;;
*-rc*) npx lerna publish from-package --yes --no-verify-access --dist-tag next ;;
*) npx lerna publish from-package --yes --no-verify-access ;;
esac
