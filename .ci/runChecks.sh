set -e
set -x

npx lerna bootstrap
npx lerna run build:ci

# linting
npm run lint:eslint
npm run lint:prettier

# auditing
npx license-check --ignoreRegex @nmshd/connector
npx better-lerna-audit