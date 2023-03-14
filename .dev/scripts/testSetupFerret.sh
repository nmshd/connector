export DATABASE_CONNECTION_STRING="mongodb://localhost:27019"

docker compose -p connector-tests -f test/docker-compose.yml up -d ferret
