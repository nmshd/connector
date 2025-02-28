FROM node:23.8.0 AS builder

ARG COMMIT_HASH
ARG BUILD_NUMBER
ARG VERSION

WORKDIR /usr/app
COPY package.json package-lock.json tsconfig.json tsconfig.publish.json ./
COPY packages/connector-types/package.json packages/connector-types/tsconfig.json packages/connector-types/
COPY .ci .ci

RUN npm ci
COPY src src
COPY packages/connector-types/src packages/connector-types/src

RUN npm run build:ci --ws
RUN .ci/writeBuildInformation.sh

FROM node:23.8.0-slim

ARG VERSION

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=5 CMD [ "node", "/usr/app/dist/healthcheck.js" ]
LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

RUN apt-get update && apt-get -qq install -y --no-install-recommends tini && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/log/enmeshed-connector && chown -R node:node /var/log/enmeshed-connector

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/connector-types/package.json packages/connector-types/

RUN cd packages/connector-types && npm version --no-git-tag-version $VERSION

RUN npm ci --omit=dev

COPY --from=builder /usr/app/dist/ dist/
COPY --from=builder /usr/app/packages/connector-types/dist packages/connector-types/dist/

USER node

ENTRYPOINT ["/usr/bin/tini", "--", "node", "/usr/app/dist/index.js"]
CMD ["start"]
