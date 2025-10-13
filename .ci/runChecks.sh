set -e
set -x

npm ci
npm run build:ci --workspaces --if-present

# linting
npm run lint:tsc
npm run lint:eslint
npm run lint:prettier

# auditing
npx license-check --ignoreRegex "@nmshd/connector|@sphereon/kmp-mdoc-core@0\.2\..*|credentials-context@2\..*|sjcl@1\..*"
npx better-npm-audit audit
