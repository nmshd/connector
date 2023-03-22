FROM node:18.15.0 as builder
ARG COMMIT_HASH
ARG BUILD_NUMBER
ARG PACKAGE_VERSION

WORKDIR /usr/app
COPY package.json package-lock.json tsconfig.json ./
COPY .ci .ci

RUN npm ci
COPY src src

RUN npm run build
RUN .ci/writeBuildInformation.sh

FROM node:18.15.0-alpine
ENV NODE_CONFIG_ENV=prod
RUN apk add --no-cache tini
RUN apk add libcap && setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/node && apk del libcap

RUN mkdir -p /var/log/enmeshed-connector && chown -R node:node /var/log/enmeshed-connector

WORKDIR /usr/app

COPY config config
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/app/dist/ dist/

LABEL org.opencontainers.image.source = "https://github.com/nmshd/cns-connector"

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "/usr/app/dist/index.js"]
