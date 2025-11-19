# Use Node.js LTS with FFmpeg support
FROM node:20-bullseye-slim

# Install FFmpeg and Python for yt-dlp
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend package files first
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy ALL backend source files (including latest changes)
COPY backend/ ./

# Build TypeScript from latest source
RUN npm run build

# Railway dynamically assigns PORT - don't hardcode
EXPOSE ${PORT:-8080}

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
