PACKAGE_VERSION=$(jq .version -r package.json)

helm package --app-version $PACKAGE_VERSION --version $PACKAGE_VERSION ./helmChart

path="./enmeshed-connector-$PACKAGE_VERSION.tgz"
registry="oci://ghcr.io/nmshd"

echo "deploying '$path' to oci registry '$registry'"

helm push $path $registry
