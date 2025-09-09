FROM node:24.7.0@sha256:9f756c50a38aea7d680761fbcf254693f131a5c6f73692c543d992cb93b93c4f AS builder

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

FROM node:24.7.0-slim@sha256:0104d9447ea3ddf7373643be7f9915fc7b7c896e41d0d33229338e457217cd78

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
