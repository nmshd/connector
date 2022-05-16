export DATABASE_CONNECTION_STRING="mongodb://localhost:27018/?readPreference=primary&appname=connector_test&ssl=false"

docker compose -f test/docker-compose.test.yml up -d mongo
