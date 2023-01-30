set -e
set -x

npm ci
npm run build:ci --workspaces --if-present

# linting
npm run lint:tsc
npm run lint:eslint
npm run lint:prettier

# auditing
npx license-check --ignoreRegex @nmshd/connector
npx better-npm-audit audit --exclude 1088907
