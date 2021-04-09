source .env.test

docker-compose exec postgres psql snorlax $PGUSER -c "DROP DATABASE IF EXISTS ${PGDATABASE};" > /dev/null 2>&1
docker-compose exec postgres psql snorlax $PGUSER -c "CREATE DATABASE ${PGDATABASE};" > /dev/null 2>&1

yarn before:test > /dev/null 2>&1
yarn jest --coverage $*

docker-compose exec postgres psql snorlax $PGUSER -c "DROP DATABASE IF EXISTS ${PGDATABASE};" > /dev/null 2>&1
