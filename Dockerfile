FROM node:23.6.1 AS builder
ARG COMMIT_HASH
ARG BUILD_NUMBER
ARG VERSION

WORKDIR /usr/app
COPY package.json package-lock.json tsconfig.json ./
COPY .ci .ci

RUN npm ci
COPY src src

RUN npm run build
RUN .ci/writeBuildInformation.sh

FROM node:23.6.1-slim

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=5 CMD ["node","-e",'require("http").get("http://localhost/health", res => process.exit(res.statusCode === 200 ? 0 : 1))']
LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

RUN apt-get update && apt-get -qq install -y --no-install-recommends tini && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/log/enmeshed-connector && chown -R node:node /var/log/enmeshed-connector

WORKDIR /usr/app

COPY config config
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/app/dist/ dist/

USER node

ENTRYPOINT ["/usr/bin/tini", "--", "node", "/usr/app/dist/index.js"]
CMD ["start"]
