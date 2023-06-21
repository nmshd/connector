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

echo "pushing tag '$BUILD_NUMBER' and '$COMMIT_HASH'"

REPO="ghcr.io/nmshd/connector"

TAGS="-t $REPO:$BUILD_NUMBER -t $REPO:$COMMIT_HASH"

OUTPUT="$(DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect $REPO:${PACKAGE_VERSION} 2>&1)" || true
if [[ $OUTPUT =~ (no such manifest: ghcr.io/nmshd/connector:) ]] || [[ $OUTPUT == "manifest unknown" ]]; then # manifest not found -> push
    echo "pushing tag '${BASE_TAG}' and '${PACKAGE_VERSION}'"

    TAGS="$TAGS -t $REPO:$BASE_TAG -t $REPO:$PACKAGE_VERSION"
elif [[ $OUTPUT =~ (\{) ]]; then # manifest found -> ignore
    echo "image '$PACKAGE_VERSION' already exists"
else # other error
    echo $OUTPUT
fi

docker buildx build --push \
    --platform linux/amd64,linux/arm64,linux/arm/v7 \
    $TAGS \
    --build-arg COMMIT_HASH=$COMMIT_HASH \
    --build-arg BUILD_NUMBER=$BUILD_NUMBER \
    --build-arg PACKAGE_VERSION=$PACKAGE_VERSION .
