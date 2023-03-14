export DATABASE_CONNECTION_STRING="mongodb://localhost:27018/?readPreference=primary&appname=connector_test&ssl=false"

docker compose -p connector-tests -f test/docker-compose.yml up -d mongo
