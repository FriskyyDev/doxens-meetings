# Multi-stage build for Angular application

# Build stage
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build

# Debug: Show what was built
RUN echo "=== Build completed, checking output ===" && \
    find dist -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -20

# Production stage
FROM node:18-alpine AS production

# Set the working directory inside the container
WORKDIR /app

# First, let's copy and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Debug: Verify what was copied
RUN echo "=== Files copied to production stage ===" && \
    find . -name "*.html" -o -name "*.js" | grep -v node_modules | head -10

# Copy server files
COPY server.js ./
COPY server-minimal.js ./
COPY post-build.js ./
COPY Procfile ./

# Create a startup script that's very explicit
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Starting with direct node command..."' >> /app/start.sh && \
    echo 'echo "PORT: $PORT"' >> /app/start.sh && \
    echo 'echo "NODE_ENV: $NODE_ENV"' >> /app/start.sh && \
    echo 'exec node server-minimal.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose the port the app runs on
EXPOSE 3000

# Use the explicit startup script
CMD ["/app/start.sh"]
