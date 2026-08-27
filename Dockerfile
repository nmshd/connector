FROM dhi.io/node:24.19.0-dev@sha256:d622ee76f018e4857d4531b97205be6f09ba47b28d30212894b197caf45416d1 AS builder

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

FROM dhi.io/node:24.19.0-dev@sha256:d622ee76f018e4857d4531b97205be6f09ba47b28d30212894b197caf45416d1 AS installer

ARG VERSION

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/
COPY patches patches

RUN npm --prefix packages/types version --no-git-tag-version $VERSION

RUN npm ci --omit=dev

FROM dhi.io/node:24.19.0@sha256:187b69dc9cd3d7ba76dd6ba98c3ebe5c106f75307ceaa0f97a8f8cbdbfac22e9

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
