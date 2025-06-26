const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Verify that the dist directory exists
const distPath = path.join(__dirname, 'dist/meeting-scheduler/browser');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(distPath)) {
  console.error(`ERROR: Dist directory not found at ${distPath}`);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error(`ERROR: index.html not found at ${indexPath}`);
  process.exit(1);
}

console.log(`✅ Verified dist files exist at ${distPath}`);

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
app.use(express.static(path.join(__dirname, 'dist/meeting-scheduler/browser')));

// Handle Angular routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/meeting-scheduler/browser/index.html'));
});

// Use the PORT environment variable provided by Railway, or default to 3000
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Serving files from: ${path.join(__dirname, 'dist/meeting-scheduler/browser')}`);
});
