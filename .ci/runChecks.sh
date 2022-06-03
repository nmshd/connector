set -e
set -x

npm ci
npx run build --workspaces

# linting
npm run lint:eslint
npm run lint:prettier

# auditing
npx license-check --ignoreRegex @nmshd/connector
npx better-npm-audit audit --exclude 1070404
