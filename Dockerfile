FROM dhi.io/node:24.19.0-dev@sha256:dfbe5b95d1fcf228c70dcb17bcbd46b790d87bac938b272bb4df40be37d7867b AS builder

ARG COMMIT_HASH
ARG BUILD_NUMBER
ARG VERSION

WORKDIR /usr/app
COPY package.json package-lock.json tsconfig.json tsconfig.publish.json ./
COPY packages/types/package.json packages/types/tsconfig.json packages/types/
COPY .ci .ci
COPY patches patches

RUN npm ci
COPY src src
COPY packages/types/src packages/types/src

RUN npm run build:ci --ws
RUN .ci/writeBuildInformation.sh

FROM dhi.io/node:24.19.0-dev@sha256:dfbe5b95d1fcf228c70dcb17bcbd46b790d87bac938b272bb4df40be37d7867b AS installer

ARG VERSION

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/
COPY patches patches

RUN npm --prefix packages/types version --no-git-tag-version $VERSION

RUN npm ci --omit=dev

FROM dhi.io/node:24.19.0@sha256:bf96f6c2ac657a3378b36917d7afbd8f8ad49ffe41af8d115c98ea5d124aecec

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
