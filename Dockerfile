FROM node:24.0.2@sha256:8de41dd3ced665c49a1d7a0801f146fc88cd58ce53350fac59e5bd59c9ee8950 AS builder

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

FROM node:24.0.2-slim@sha256:e35e2147b987b1d1d00cbe53a00075439bd953f38e485c33b5d770650d7c2060

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
