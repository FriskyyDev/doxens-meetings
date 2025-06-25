const webpack = require('webpack');

module.exports = (config, options, targetOptions) => {
  console.log('Custom webpack config applied!');
  
  // Initialize resolve if it doesn't exist
  if (!config.resolve) {
    config.resolve = {};
  }
  
  if (!config.resolve.fallback) {
    config.resolve.fallback = {};
  }
  
  // Simply disable the Node.js modules that sql.js tries to use
  config.resolve.fallback.fs = false;
  config.resolve.fallback.path = false;
  config.resolve.fallback.crypto = false;
  
  console.log('Fallbacks set:', config.resolve.fallback);
  
  return config;
};
