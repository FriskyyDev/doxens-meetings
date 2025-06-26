const express = require('express');
const app = express();

// Get port from environment or default to 3000
const port = process.env.PORT || 3000;

console.log('🚀 Starting minimal server...');
console.log('Port:', port);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Basic root route
app.get('/', (req, res) => {
  console.log('GET / - serving basic response');
  res.send(`
    <html>
      <head><title>Test Server</title></head>
      <body>
        <h1>Server is running!</h1>
        <p>Port: ${port}</p>
        <p>Time: ${new Date().toISOString()}</p>
        <p>Node version: ${process.version}</p>
      </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  console.log('GET /health - health check');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: port,
    nodeVersion: process.version
  });
});

// Catch all route
app.get('*', (req, res) => {
  console.log(`GET ${req.path} - catch all`);
  res.send(`<h1>Path: ${req.path}</h1><p><a href="/">Go home</a></p>`);
});

// Start server with explicit binding to 0.0.0.0
console.log(`Binding to 0.0.0.0:${port}`);
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server successfully started on 0.0.0.0:${port}`);
  console.log(`Server address:`, server.address());
});

server.on('listening', () => {
  console.log('Server listening event fired');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  }
  process.exit(1);
});

// Handle shutdown gracefully
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);
  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
    console.log('Server closed successfully');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Keep process alive and log periodically
setInterval(() => {
  console.log(`Server still running at ${new Date().toISOString()}`);
}, 30000);

console.log('Server initialization complete');
