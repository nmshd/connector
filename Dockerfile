FROM node:18.10.0 as builder
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

FROM node:18.10.0-alpine
ENV NODE_CONFIG_ENV=prod
RUN apk add --no-cache tini

RUN mkdir -p /var/log/connector
RUN chown -R node:node /var/log/connector

RUN mkdir -p /usr/app
RUN chown -R node:node /usr/app

USER node

WORKDIR /usr/app

COPY --chown=node:node config config
COPY --chown=node:node package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --chown=node:node --from=builder /usr/app/dist/ dist/

LABEL org.opencontainers.image.source = "https://github.com/nmshd/cns-connector"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "/usr/app/dist/index.js"]
