#!/bin/sh
# Define colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

npx ng build angular-email
node projects/angular-email/bin/esbuild.config.js
node projects/angular-email/node/esbuild.config.js
npx tsc -p projects/angular-email/node/tsconfig.json

echo "${GREEN}Build Complete!${NC}"