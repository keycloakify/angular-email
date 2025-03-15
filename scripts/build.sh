#!/bin/sh
# Define colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

npx ng build angular-email
npx tsc -p projects/angular-email/bin/tsconfig.json
mv dist/angular-email/bin/build.js dist/angular-email/bin/build.mjs
rm -rf projects/angular-email/node/dist
node projects/angular-email/node/esbuild.config.js
npx tsc -p projects/angular-email/node/tsconfig.json
mkdir dist/angular-email/node
cp -a projects/angular-email/node/dist/. dist/angular-email/node/
# Use jq to modify the package.json
jq --argjson newExport "{\"./node\": {\"types\": \"./node/index.d.ts\", \"import\": \"./node/index.js\", \"require\": \"./node/index.cjs\", \"default\": \"./node/index.cjs\"}}" '
  .exports += $newExport
' dist/angular-email/package.json > dist/angular-email/package.tmp.json && mv dist/angular-email/package.tmp.json dist/angular-email/package.json

echo "${GREEN}Build Complete!${NC}"