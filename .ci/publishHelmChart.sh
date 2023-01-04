PACKAGE_VERSION=$(jq .version -r package.json)

helm package --app-version $PACKAGE_VERSION --version $PACKAGE_VERSION ./helmChart

HELM_PATH="./connector-helm-chart-$PACKAGE_VERSION.tgz"
REGISTRY="oci://ghcr.io/nmshd"

echo "deploying '$HELM_PATH' to oci REGISTRY '$REGISTRY'"

helm push $HELM_PATH $REGISTRY
