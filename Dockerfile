FROM node:16.13.0 as builder
ARG COMMIT_HASH
ARG BUILD_NUMBER

WORKDIR /usr/app
COPY package.json package-lock.json tsconfig.json ./
COPY .ci .ci

RUN npm ci
COPY src src

RUN apt update && apt upgrade -y && apt install jq -y
RUN npm install -g npm-run-all typescript
RUN npm run build
RUN .ci/writeBuildInformation.sh

FROM node:16.13.0-alpine
ENV NODE_CONFIG_ENV=prod
WORKDIR /usr/app
COPY config config
COPY package.json package-lock.json ./

RUN npm ci --production

COPY --from=builder /usr/app/dist/ dist/
ENTRYPOINT node ./dist/index.js
