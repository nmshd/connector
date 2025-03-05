COMMIT_HASH=c
BUILD_NUMBER=b
VERSION=1.0.0-beta.1

docker build --no-cache --progress=plain \
    --tag ghcr.io/nmshd/connector:prod \
    --build-arg COMMIT_HASH=$COMMIT_HASH \
    --build-arg BUILD_NUMBER=$BUILD_NUMBER \
    --build-arg VERSION=$VERSION .
