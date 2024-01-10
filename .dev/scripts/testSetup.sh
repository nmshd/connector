export DATABASE_CONNECTION_STRING="mongodb://localhost:27018/?readPreference=primary&appname=connector_test&ssl=false"
export NMSHD_TEST_BASEURL="http://localhost:8090"
export NMSHD_TEST_CLIENTID="test"
export NMSHD_TEST_CLIENTSECRET="test"

docker compose -p connector-tests -f test/compose.yml up -d mongo
docker compose -p connector-test-backbone --env-file .dev/compose.backbone.env -f .dev/compose.backbone.yml up -d
