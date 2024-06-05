helm package --app-version $VERSION --version $VERSION ./helmChart

HELM_PATH="./connector-helm-chart-$VERSION.tgz"
REGISTRY="oci://ghcr.io/nmshd"

echo "deploying '$HELM_PATH' to oci REGISTRY '$REGISTRY'"

helm push $HELM_PATH $REGISTRY
