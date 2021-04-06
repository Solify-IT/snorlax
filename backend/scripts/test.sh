source .env.test

docker-compose exec postgres psql snorlax $PGUSER -c "DROP DATABASE IF EXISTS ${PGDATABASE};"
docker-compose exec postgres psql snorlax $PGUSER -c "CREATE DATABASE ${PGDATABASE};"

yarn before:test
yarn jest $*

docker-compose exec postgres psql snorlax $PGUSER -c "DROP DATABASE IF EXISTS ${PGDATABASE};"
