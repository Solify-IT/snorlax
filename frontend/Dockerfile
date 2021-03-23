FROM node:14.16.0-alpine3.11

RUN apk add --no-cache git python make g++

RUN mkdir -p /app
WORKDIR /app
COPY package.json ./

COPY .env ./

RUN source .env
RUN yarn install

COPY src ./src
COPY public ./public

COPY tsconfig.json ./

CMD ["yarn", "start"]
