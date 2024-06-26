if [ -z "$VERSION" ]; then
    echo "The environment variable 'VERSION' must be set."
    exit 1
fi

helm package --app-version $VERSION --version $VERSION ./helmChart

HELM_PATH="./connector-helm-chart-$VERSION.tgz"
REGISTRY="oci://ghcr.io/nmshd"

echo "deploying '$HELM_PATH' to oci REGISTRY '$REGISTRY'"

helm push $HELM_PATH $REGISTRY
