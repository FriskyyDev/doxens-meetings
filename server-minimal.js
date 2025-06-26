const express = require('express');
const app = express();

console.log('🚀 Minimal server starting...');
console.log('Environment PORT:', process.env.PORT);
console.log('Node version:', process.version);

// Simple health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple root endpoint
app.get('/', (req, res) => {
  res.send('<h1>Server is running!</h1><p>This is a test deployment</p>');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
});

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

console.log('Server setup complete');
