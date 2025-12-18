FROM dhi.io/node:25.2.0-dev@sha256:4c4c2404d8456661e0dc2aa72d67b010d5257359a8218c977d808323dbcdc878 AS builder

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

FROM dhi.io/node:25.2.0-dev@sha256:4c4c2404d8456661e0dc2aa72d67b010d5257359a8218c977d808323dbcdc878 AS installer

ARG VERSION

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/

RUN npm --prefix packages/types version --no-git-tag-version $VERSION

RUN npm ci --omit=dev

FROM dhi.io/node:25.2.0@sha256:c1f02c8108ebce76999fc0f809f535c5702c3e54fe2af1561c9ab6bc271712e8

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=5 CMD [ "node", "/usr/app/dist/healthcheck.js" ]
LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/

COPY --from=builder /usr/app/dist/ dist/
COPY --from=builder /usr/app/packages/types/dist packages/types/dist/
COPY --from=installer /usr/app/node_modules/ node_modules/

USER node

ENTRYPOINT ["node", "/usr/app/dist/index.js"]
CMD ["start"]
