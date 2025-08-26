#!/bin/bash
set -e

PACKAGE="@keycloakify/angular-email"
LOCAL_PATH="$(pwd)/dist/angular-email"

echo "🔹 Removing $PACKAGE from dependencies..."
npm uninstall $PACKAGE

echo "🔹 Installing remaining dependencies..."
npm install

npm run build

echo "🔹 Re-adding $PACKAGE to dependencies..."

npm install "file:/$LOCAL_PATH"

echo "🔹 Re-installing all dependencies..."
npm install

echo "✅ Done!"
