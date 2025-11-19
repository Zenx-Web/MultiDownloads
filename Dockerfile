# Use Node.js LTS
FROM node:20-alpine

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

# Expose port 8080
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
