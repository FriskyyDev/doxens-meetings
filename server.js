const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

console.log('🚀 Starting server...');
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- PWD:', process.env.PWD);
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// List contents of current directory
console.log('Contents of current directory:');
try {
  const files = fs.readdirSync(__dirname);
  console.log(files);
} catch (err) {
  console.error('Error reading current directory:', err);
}

// Check for dist directory
const distPath = path.join(__dirname, 'dist/meeting-scheduler/browser');
console.log('Looking for dist path:', distPath);

if (!fs.existsSync(distPath)) {
  console.error(`ERROR: Dist directory not found at ${distPath}`);
  console.log('Available directories in dist:');
  try {
    const distRoot = path.join(__dirname, 'dist');
    if (fs.existsSync(distRoot)) {
      const distContents = fs.readdirSync(distRoot, { withFileTypes: true });
      distContents.forEach(item => {
        console.log(`  ${item.isDirectory() ? '[DIR]' : '[FILE]'} ${item.name}`);
        if (item.isDirectory()) {
          const subDir = path.join(distRoot, item.name);
          try {
            const subContents = fs.readdirSync(subDir);
            console.log(`    Contents: ${subContents.join(', ')}`);
          } catch (e) {
            console.log(`    Error reading subdirectory: ${e.message}`);
          }
        }
      });
    } else {
      console.log('No dist directory found at all');
    }
  } catch (err) {
    console.error('Error examining dist directory:', err);
  }
  // Don't exit, let's try to serve what we can
}

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files from the dist directory
const staticPath = path.join(__dirname, 'dist/meeting-scheduler/browser');
if (fs.existsSync(staticPath)) {
  console.log(`✅ Setting up static file serving from: ${staticPath}`);
  app.use(express.static(staticPath));
} else {
  console.log('⚠️ Static files directory not found, serving basic response');
  app.get('/', (req, res) => {
    res.send('<h1>Server is running but static files not found</h1><p>Check build process</p>');
  });
}

// Handle Angular routing - serve index.html for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist/meeting-scheduler/browser/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.log(`Index file not found at: ${indexPath}`);
    res.status(404).send('<h1>404 - Application not found</h1><p>Build files missing</p>');
  }
});

// Use the PORT environment variable provided by Railway, or default to 3000
const port = process.env.PORT || 3000;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Serving files from: ${path.join(__dirname, 'dist/meeting-scheduler/browser')}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
