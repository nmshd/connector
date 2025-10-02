FROM node:24.9.0@sha256:a2ed436bacdcc9dd543202a327bbce2519c43e3755a41a186f8f51c037ef3342 AS builder

ARG COMMIT_HASH
ARG BUILD_NUMBER
ARG VERSION

WORKDIR /usr/app
COPY package.json package-lock.json tsconfig.json tsconfig.publish.json ./
COPY packages/types/package.json packages/types/tsconfig.json packages/types/
COPY *.tgz ./
COPY .ci .ci

RUN npm i --force
COPY src src
COPY packages/types/src packages/types/src

RUN npm run build:ci --ws

FROM node:24.9.0-slim@sha256:0cce74a5708f603925e2bf01929da8d71e92b5e2493fcfb662d5a8ffed2d8ef1

ARG VERSION

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=5 CMD [ "node", "/usr/app/dist/healthcheck.js" ]
LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

RUN apt-get update && apt-get -qq install -y --no-install-recommends tini && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/
COPY *.tgz ./

RUN cd packages/types && npm version --no-git-tag-version $VERSION

RUN npm i --omit=dev --force

COPY --from=builder /usr/app/dist/ dist/
COPY --from=builder /usr/app/packages/types/dist packages/types/dist/

USER node

ENTRYPOINT ["/usr/bin/tini", "--", "node", "/usr/app/dist/index.js"]
CMD ["start"]
