#!/bin/bash
# Ensure we're in the server directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing server dependencies..."
npm install

# Install type definitions
echo "Installing type definitions..."
npm install --save-dev @types/bcrypt @types/jsonwebtoken @types/dotenv

# Build the server
echo "Building server..."
npx tsc

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Server build successful!"
else
  echo "Server build failed!"
  exit 1
fi 