PACKAGE_VERSION=$(jq .version -r package.json)

helm package --app-version $PACKAGE_VERSION --version $PACKAGE_VERSION ./helmChart

path="./connector-helm-chart-$PACKAGE_VERSION.tgz"
registry="oci://ghcr.io/nmshd"

echo "deploying '$path' to oci registry '$registry'"

helm push $path $registry
