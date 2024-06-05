COMMIT_HASH=c
BUILD_NUMBER=b
VERSION=v

docker build --no-cache --progress=plain \
    --tag ghcr.io/nmshd/connector:prod \
    --build-arg COMMIT_HASH=$COMMIT_HASH \
    --build-arg BUILD_NUMBER=$BUILD_NUMBER \
    --build-arg VERSION=$VERSION .
