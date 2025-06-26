const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

console.log('🚀 Starting Angular app server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || 3000);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeVersion: process.version
  });
});

// Serve static files from the Angular build output
const staticPath = path.join(__dirname, 'dist/meeting-scheduler/browser');
console.log('Static files path:', staticPath);

if (fs.existsSync(staticPath)) {
  console.log('✅ Found Angular build files, serving static content');
  app.use(express.static(staticPath));
} else {
  console.log('⚠️ Angular build files not found, serving fallback');
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head><title>Build Error</title></head>
        <body>
          <h1>Angular build files not found</h1>
          <p>Expected path: ${staticPath}</p>
          <p>Please check the build process</p>
        </body>
      </html>
    `);
  });
}

// Handle Angular routing - serve index.html for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <html>
        <head><title>404</title></head>
        <body>
          <h1>404 - Application not found</h1>
          <p>index.html not found at: ${indexPath}</p>
        </body>
      </html>
    `);
  }
});

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`Serving files from: ${staticPath}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
