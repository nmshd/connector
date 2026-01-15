FROM dhi.io/node:24.12.0-dev@sha256:7aaf36e50a3b73acc6eec2dec8317239769929ddcf6f792c91c2ab79a3a4634d AS builder

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

FROM dhi.io/node:24.12.0-dev@sha256:7aaf36e50a3b73acc6eec2dec8317239769929ddcf6f792c91c2ab79a3a4634d AS installer

ARG VERSION

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/

RUN npm --prefix packages/types version --no-git-tag-version $VERSION

RUN npm ci --omit=dev

FROM dhi.io/node:24.12.0@sha256:e805d972f53c2db92cab8c56242ba8609736e461ef16d4073d52d5404263bbc9

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=5 CMD [ "node", "/usr/app/dist/healthcheck.js" ]
LABEL org.opencontainers.image.source="https://github.com/nmshd/connector"

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/

COPY --from=builder /usr/app/dist/ dist/
COPY --from=builder /usr/app/packages/types/dist packages/types/dist/
COPY --from=installer /usr/app/node_modules/ node_modules/

ENTRYPOINT ["node", "/usr/app/dist/index.js"]
CMD ["start"]
