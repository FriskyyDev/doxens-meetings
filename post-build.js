const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists
const distPath = path.join(__dirname, 'dist/meeting-scheduler');

if (fs.existsSync(distPath)) {
  console.log('✅ Build output directory exists');
  
  // List files in the dist directory
  const files = fs.readdirSync(distPath);
  console.log('📁 Files in dist directory:', files);
  
  // Check if index.html exists
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found');
  } else {
    console.error('❌ index.html not found in dist directory');
    process.exit(1);
  }
} else {
  console.error('❌ Build output directory not found');
  process.exit(1);
}

console.log('🚀 Post-build checks completed successfully');
