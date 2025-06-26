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

# Copy package.json and package-lock.json for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Debug: Verify what was copied
RUN echo "=== Files copied to production stage ===" && \
    find . -name "*.html" -o -name "*.js" | grep -v node_modules | head -10

# Copy server.js and any other production files
COPY server.js ./
COPY post-build.js ./

# Add a simple health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http=require('http'); http.get('http://localhost:' + (process.env.PORT || 3000) + '/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "server.js"]
