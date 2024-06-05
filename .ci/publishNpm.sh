set -e
set -x

cd packages/sdk
npm version $VERSION
npx enhanced-publish --if-possible --use-preid-as-tag
