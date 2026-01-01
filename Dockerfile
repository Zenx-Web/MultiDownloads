# Use Node.js LTS
FROM node:20-bookworm-slim

# Install ffmpeg/ffprobe for metadata probing (no browsers, no cookies, no automation)
RUN apt-get update && apt-get install -y \
  ffmpeg \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend package files first
COPY backend/package*.json ./

# Install dependencies (includes dev deps for TypeScript build)
RUN npm ci && npm cache clean --force

# Copy ALL backend source files
COPY backend/ ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

# Create temp directory
RUN mkdir -p /app/temp && chmod 777 /app/temp

# Fly.io will use internal_port from fly.toml
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Health check for Fly.io
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the API process by default (workers run via a separate process/command)
CMD ["node", "dist/api.js"]
