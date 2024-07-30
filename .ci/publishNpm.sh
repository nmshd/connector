set -e
set -x

if [ -z "$VERSION" ]; then
	echo "The environment variable 'VERSION' must be set."
	exit 1
fi

cd packages/sdk
npm version $VERSION
npx enhanced-publish --if-possible --use-preid-as-tag

cd packages/admin-cli
npm version $VERSION
npx enhanced-publish --if-possible --use-preid-as-tag
