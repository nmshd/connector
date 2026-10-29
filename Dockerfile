FROM dhi.io/node:24.22.2-dev@sha256:b1d6cd9f72304d1b5085ed2485b4a8bfcb51247b1b81e96b5cd3113b386a8fc5 AS builder

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

FROM dhi.io/node:24.22.2-dev@sha256:b1d6cd9f72304d1b5085ed2485b4a8bfcb51247b1b81e96b5cd3113b386a8fc5 AS installer

ARG VERSION

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/

RUN npm --prefix packages/types version --no-git-tag-version $VERSION

RUN npm ci --omit=dev

FROM dhi.io/node:24.22.2@sha256:24fa6258b891ef66e6c3b7ed82daad550b81cdfcd76f6cc64eee4d2478366747

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=5 CMD [ "node", "/usr/app/dist/healthcheck.js" ]
LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

WORKDIR /usr/app

COPY --from=builder /usr/app/package.json ./
COPY package-lock.json ./
COPY packages/types/package.json packages/types/

COPY --from=builder /usr/app/dist/ dist/
COPY --from=builder /usr/app/packages/types/dist packages/types/dist/
COPY --from=installer /usr/app/node_modules/ node_modules/

ENTRYPOINT ["node", "/usr/app/dist/index.js"]
CMD ["start"]
