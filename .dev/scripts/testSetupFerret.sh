export DATABASE_CONNECTION_STRING="mongodb://localhost:27019"
export NMSHD_TEST_BASEURL="http://localhost:8090"
export NMSHD_TEST_CLIENTID="test"
export NMSHD_TEST_CLIENTSECRET="test"

docker compose -p connector-tests -f test/compose.yml up -d ferret
docker compose -p connector-test-backbone -f .dev/compose.backbone.yml up -d
