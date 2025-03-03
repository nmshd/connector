FROM node:23.8.0 AS builder
ARG COMMIT_HASH
ARG BUILD_NUMBER
ARG VERSION

WORKDIR /usr/app
COPY package.json package-lock.json tsconfig.json tsconfig.publish.json ./
COPY .ci .ci

RUN npm ci
COPY src src

RUN npm run build:ci
RUN .ci/writeBuildInformation.sh

FROM node:23.8.0-slim

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=5 CMD [ "node", "/usr/app/dist/healthcheck.js" ]
LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

RUN apt-get update && apt-get -qq install -y --no-install-recommends tini && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/app/dist/ dist/

USER node

ENTRYPOINT ["/usr/bin/tini", "--", "node", "/usr/app/dist/index.js"]
CMD ["start"]
