FROM node:14.16.0-alpine3.11

RUN apk add --no-cache git python make g++

RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock ./

COPY .env ./

RUN source .env
RUN yarn install

COPY src ./src
COPY ./tests ./
COPY ./scripts ./


COPY tsconfig.json ./

# Add docker-compose-wait tool
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

CMD ["yarn", "dev"]
