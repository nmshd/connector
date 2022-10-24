set -e
set -x

cd packages/sdk
npx enhanced-publish --if-possible --use-preid-as-tag
