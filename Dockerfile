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

# Copy server.js and any other production files
COPY server.js ./
COPY post-build.js ./

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
