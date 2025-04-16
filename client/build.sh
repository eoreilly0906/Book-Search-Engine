#!/bin/bash
# Ensure we're in the client directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing client dependencies..."
npm install

# Build the client
echo "Building client..."
npx vite build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Client build successful!"
else
  echo "Client build failed!"
  exit 1
fi 