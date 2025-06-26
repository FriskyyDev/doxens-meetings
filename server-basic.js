const http = require('http');

const port = process.env.PORT || 3000;

console.log('Starting basic HTTP server...');
console.log('Port:', port);
console.log('Environment:', process.env.NODE_ENV);

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Basic Server</title></head>
      <body>
        <h1>Basic HTTP Server Running!</h1>
        <p>Port: ${port}</p>
        <p>URL: ${req.url}</p>
        <p>Method: ${req.method}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on 0.0.0.0:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  server.close(() => process.exit(0));
});

console.log('Server setup complete');
