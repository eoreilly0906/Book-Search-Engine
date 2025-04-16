#!/bin/bash
# Exit on error
set -e

# Ensure we're in the server directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing server dependencies..."
npm install

# Install TypeScript globally if not already installed
echo "Installing TypeScript..."
npm install -g typescript

# Install type definitions
echo "Installing type definitions..."
npm install --save-dev @types/bcrypt @types/jsonwebtoken @types/dotenv

# Build the server
echo "Building server..."
if ! ./node_modules/.bin/tsc; then
    echo "Server build failed"
    exit 1
fi

echo "Server build completed successfully" 