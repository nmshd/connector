set -e
set -x

npx lerna bootstrap
npx lerna run build:ci

# linting
npm run lint:eslint
npm run lint:prettier

# auditing
npx license-check --ignoreRegex @nmshd/connector
npx better-lerna-audit --exclude 1070480,1081004,1084485,1084488,1081673,1084765
