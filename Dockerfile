# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source
COPY backend/ ./

# Build TypeScript
RUN npm run build

# Expose the same port the app listens on in production
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
