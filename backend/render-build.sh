#!/bin/bash

# Install system dependencies
echo "Installing system dependencies..."

# Install FFmpeg
apt-get update
apt-get install -y ffmpeg

# Install Python for yt-dlp
apt-get install -y python3 python3-pip

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Build TypeScript
echo "Building TypeScript..."
npm run build

echo "Build complete!"
