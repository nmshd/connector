#!/usr/bin/env bash
set -e

if [ -z "$(which jq)" ]; then
    echo "jq could not be found"
    exit 1
fi

case "$VERSION" in
*-alpha*) BASE_TAG=alpha ;;
*-beta*) BASE_TAG=beta ;;
*-rc*) BASE_TAG=rc ;;
*) BASE_TAG=latest ;;
esac

echo "pushing tag '$BUILD_NUMBER' and '$COMMIT_HASH'"

REPO="ghcr.io/nmshd/connector"

TAGS="-t $REPO:$BUILD_NUMBER -t $REPO:$COMMIT_HASH"

OUTPUT="$(DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect $REPO:${VERSION} 2>&1)" || true
if [[ $OUTPUT =~ (no such manifest: ghcr.io/nmshd/connector:) ]] || [[ $OUTPUT == "manifest unknown" ]]; then # manifest not found -> push
    echo "pushing tag '${BASE_TAG}' and '${VERSION}'"

    TAGS="$TAGS -t $REPO:$BASE_TAG -t $REPO:$VERSION"
elif [[ $OUTPUT =~ (\{) ]]; then # manifest found -> ignore
    echo "image '$VERSION' already exists"
else # other error
    echo $OUTPUT
fi

docker buildx build --push --provenance=true --sbom=true \
    --platform linux/amd64,linux/arm64 \
    $TAGS \
    --build-arg COMMIT_HASH=$COMMIT_HASH \
    --build-arg BUILD_NUMBER=$BUILD_NUMBER \
    --build-arg VERSION=$VERSION .
