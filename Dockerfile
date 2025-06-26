# Single-stage build - simpler approach
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first for better caching
COPY package*.json ./

# Install ALL dependencies (we need them for the build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build

# Remove dev dependencies to save space
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 3000

# Use node directly - no shell scripts, no complexity
CMD ["node", "server-basic.js"]
