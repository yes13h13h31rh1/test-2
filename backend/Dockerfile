# Backend Dockerfile for Render.com
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY backend/tsconfig.json ./
COPY backend/src ./src

# Build TypeScript
RUN npm install typescript -g
RUN tsc

# Expose port
EXPOSE 10000

# Start server
CMD ["node", "dist/index.js"]
