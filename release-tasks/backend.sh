# /bin/bash

# move to backend/
cd backend

yarn migrate:up

yarn build

rm -rf src/

