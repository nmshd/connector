FROM node:23.6.0 AS builder
ARG COMMIT_HASH
ARG BUILD_NUMBER
ARG VERSION

WORKDIR /usr/app
COPY package.json package-lock.json tsconfig.json ./
COPY packages/connector/package.json packages/connector/tsconfig.json packages/connector/
COPY .ci .ci

RUN npm ci
COPY src src
COPY packages/connector/src packages/connector/src

RUN npm run build --ws
RUN .ci/writeBuildInformation.sh

FROM node:23.6.0-alpine
RUN apk add --no-cache tini
RUN apk add libcap && setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/node && apk del libcap

RUN mkdir -p /var/log/enmeshed-connector && chown -R node:node /var/log/enmeshed-connector

WORKDIR /usr/app

COPY config config
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/app/dist/ dist/

LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

USER node

ENTRYPOINT ["/sbin/tini", "--", "node", "/usr/app/dist/index.js"]
CMD ["start"]
