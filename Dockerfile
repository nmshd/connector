FROM node:24.8.0@sha256:3357ef4c358ae0f92e943fe51c0c8dfaaadb5d4ee3f989121f54b1aabab39009 AS builder

ARG COMMIT_HASH
ARG BUILD_NUMBER
ARG VERSION

WORKDIR /usr/app
COPY package.json package-lock.json tsconfig.json tsconfig.publish.json ./
COPY packages/types/package.json packages/types/tsconfig.json packages/types/
COPY .ci .ci

RUN npm ci
COPY src src
COPY packages/types/src packages/types/src

RUN npm run build:ci --ws
RUN .ci/writeBuildInformation.sh

FROM node:24.8.0-slim@sha256:f36ed6d02276ecf5e97c8fa676aee66056d8d10c3ee53f1ca65e12f8070f14db

ARG VERSION

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=5 CMD [ "node", "/usr/app/dist/healthcheck.js" ]
LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

RUN apt-get update && apt-get -qq install -y --no-install-recommends tini && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/

RUN cd packages/types && npm version --no-git-tag-version $VERSION

RUN npm ci --omit=dev

COPY --from=builder /usr/app/dist/ dist/
COPY --from=builder /usr/app/packages/types/dist packages/types/dist/

USER node

ENTRYPOINT ["/usr/bin/tini", "--", "node", "/usr/app/dist/index.js"]
CMD ["start"]
