#!/bin/sh

# Startup script for Railway deployment
echo "Starting application..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "Checking dist directory:"
ls -la dist/meeting-scheduler/browser/ || echo "No dist directory found"

echo "Starting server..."
exec npm start
