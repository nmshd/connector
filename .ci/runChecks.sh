set -e
set -x

npm ci
npm run build:ci --workspaces --if-present

# linting
npm run lint:tsc
npm run lint:eslint
npm run lint:prettier

# remove this block
npm ls --all > before.txt

npm run build:ci --workspaces --if-present

npm ls --all > after.txt
diff before.txt after.txt

# auditing
npx license-check
npx better-npm-audit audit --exclude 1112030
