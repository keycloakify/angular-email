#!/bin/bash
set -e

# @keycloakify/angular-email is a `link:` dependency to dist/angular-email:
# install, build the library, then install again so its bin gets linked.

echo "🔹 Installing dependencies..."
pnpm install

pnpm build

echo "🔹 Re-linking dist/angular-email..."
pnpm install

echo "✅ Done!"
