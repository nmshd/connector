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

ENV TINI_VERSION=v0.19.0
ADD --chmod=755 https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /usr/local/bin/tini

RUN mkdir -p /var/log/enmeshed-connector && chown -R node:node /var/log/enmeshed-connector

WORKDIR /usr/app

COPY config config
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/app/dist/ dist/

LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

USER node

ENTRYPOINT ["/usr/local/bin/tini", "--", "node", "/usr/app/dist/index.js"]
CMD ["start"]
