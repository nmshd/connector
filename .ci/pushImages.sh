docker push dockerhub.js-soft.com/nmshd-connector:dev
docker push dockerhub.js-soft.com/nmshd-connector:$BITBUCKET_BUILD_NUMBER

OUTPUT=$(DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect dockerhub.js-soft.com/nmshd-connector:${PACKAGE_VERSION} 2>&1)

if [[ $OUTPUT =~ (no such manifest: dockerhub.js-soft.com/nmshd-connector:) ]]; then # manifest not found -> push
    docker push dockerhub.js-soft.com/nmshd-connector:${PACKAGE_VERSION}
elif  [[ $OUTPUT =~ (\{) ]]; then # manifest found -> ignore
    echo "image '$PACKAGE_VERSION' already exists"
else # other error
    echo $OUTPUT
fi