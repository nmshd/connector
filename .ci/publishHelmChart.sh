export HELM_EXPERIMENTAL_OCI=1

cd helmChart

output=$(helm package . -d charts)
path=${output##*:}
registry="oci://ghcr.io/nmshd"

echo "deploying '$path' to oci registry '$registry'"

helm push $path $registry
