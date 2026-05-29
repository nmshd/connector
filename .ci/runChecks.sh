set -e
set -x

npm ci

echo "=== BEFORE ==="
npm ls --all

npm run build:ci --workspaces --if-present

echo "=== AFTER ==="
npm ls --all

# linting
npm run lint:tsc
npm run lint:eslint
npm run lint:prettier

# auditing
npx license-check
npx better-npm-audit audit --exclude 1112030
