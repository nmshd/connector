set -e
set -x

npm ci

npm ls --all > before.txt # remove this

npm run build:ci --workspaces --if-present

npm ls --all > after.txt # remove this
diff before.txt after.txt # remove this

# linting
npm run lint:tsc
npm run lint:eslint
npm run lint:prettier

# auditing
npx license-check
npx better-npm-audit audit --exclude 1112030
