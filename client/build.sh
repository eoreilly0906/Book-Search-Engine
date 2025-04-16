#!/bin/bash
# Exit on error
set -e

# Ensure we're in the client directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing client dependencies..."
npm install

# Ensure @vitejs/plugin-react is installed
echo "Ensuring Vite React plugin is installed..."
npm install --save-dev @vitejs/plugin-react

# Build the client
echo "Building client..."
if ! ./node_modules/.bin/vite build; then
    echo "Client build failed"
    exit 1
fi

echo "Client build completed successfully" 