export DATABASE_CONNECTION_STRING="mongodb://localhost:27019"

docker compose -p connector-tests -f test/compose.yml up -d ferret
docker compose -p connector-test-backbone -f .dev/compose.backbone.yml up -d
