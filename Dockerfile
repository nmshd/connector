FROM dhi.io/node:24.21.0-dev@sha256:b240a2ea0a4e7d9086a3bc1a37f456e0ecd7af9137d8f6c86186d49a27e473d7 AS builder

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

FROM dhi.io/node:24.21.0-dev@sha256:b240a2ea0a4e7d9086a3bc1a37f456e0ecd7af9137d8f6c86186d49a27e473d7 AS installer

ARG VERSION

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/

RUN npm --prefix packages/types version --no-git-tag-version $VERSION

RUN npm ci --omit=dev

FROM dhi.io/node:24.21.0@sha256:fc75a57136e16cc157941bad176abf7e0bc2fe74e388780d971e26241404d925

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
