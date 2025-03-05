set -e
set -x

if [ -z "$VERSION" ]; then
    echo "The environment variable 'VERSION' must be set."
    exit 1
fi

for dir in ./packages/*; do
    cd $dir
    npm version $VERSION --no-git-tag-version
    npx enhanced-publish --if-possible --use-preid-as-tag
    cd ../../
done

# wait for npmjs to update its indices because the connector types are used by the docker build of the connector
sleep 60
