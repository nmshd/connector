#!/usr/bin/env bash
set -e

if [ -z "$(which jq)" ]; then
    echo "jq could not be found"
    exit 1
fi

PACKAGE_VERSION=$(jq .version -r package.json)

case "$PACKAGE_VERSION" in
*-alpha*) BASE_TAG=alpha ;;
*-beta*) BASE_TAG=beta ;;
*-rc*) BASE_TAG=rc ;;
*) BASE_TAG=latest ;;
esac

docker build \
    --tag ghcr.io/nmshd/connector:$BUILD_NUMBER \
    --tag ghcr.io/nmshd/connector:$COMMIT_HASH \
    --tag ghcr.io/nmshd/connector:$BASE_TAG \
    --tag ghcr.io/nmshd/connector:$PACKAGE_VERSION \
    --build-arg COMMIT_HASH=$COMMIT_HASH \
    --build-arg BUILD_NUMBER=$BUILD_NUMBER \
    --build-arg PACKAGE_VERSION=$PACKAGE_VERSION .

echo "pushing tag '$BUILD_NUMBER'"
docker push ghcr.io/nmshd/connector:$BUILD_NUMBER

echo "pushing tag '$COMMIT_HASH'"
docker push ghcr.io/nmshd/connector:$COMMIT_HASH

OUTPUT="$(DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect ghcr.io/nmshd/connector:${PACKAGE_VERSION} 2>&1)" || true
if [[ $OUTPUT =~ (no such manifest: ghcr.io/nmshd/connector:) ]] || [[ $OUTPUT == "manifest unknown" ]]; then # manifest not found -> push
    echo "pushing tag '${BASE_TAG}'"
    docker push ghcr.io/nmshd/connector:$BASE_TAG

    echo "pushing tag '$PACKAGE_VERSION'"
    docker push ghcr.io/nmshd/connector:$PACKAGE_VERSION
elif [[ $OUTPUT =~ (\{) ]]; then # manifest found -> ignore
    echo "image '$PACKAGE_VERSION' already exists"
else # other error
    echo $OUTPUT
fi
