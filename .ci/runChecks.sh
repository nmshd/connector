set -e
set -x

npm ci
npm run build:ci --workspaces --if-present

# linting
npm run lint:tsc
npm run lint:eslint
npm run lint:prettier

# auditing
# exclude @sphereon/kmp-mdoc-core, credentials-context, and sjcl from license checks due to known false-positive findings
npx license-check --ignoreRegex "@nmshd/.*|@sphereon/kmp-mdoc-core@0\.2\..*|credentials-context@2\..*|sjcl@1\..*"
npx better-npm-audit audit --exclude 1112030,1120821,1120792
