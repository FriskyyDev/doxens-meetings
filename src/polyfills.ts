// Polyfill for Node.js modules required by sql.js

(function(globalScope: any) {
  // Mock Node.js 'fs' module
  globalScope.require = globalScope.require || function(module: string) {
    if (module === 'fs') {
      return {
        readFileSync: function() { throw new Error('fs.readFileSync not available in browser'); },
        existsSync: function() { return false; },
        constants: {}
      };
    }
    if (module === 'path') {
      return {
        join: function() { return Array.prototype.join.call(arguments, '/'); },
        resolve: function() { return Array.prototype.join.call(arguments, '/'); },
        dirname: function(p: string) { return p.split('/').slice(0, -1).join('/') || '/'; },
        basename: function(p: string) { return p.split('/').pop() || ''; }
      };
    }
    if (module === 'crypto') {
      return {
        randomBytes: function(size: number) {
          const bytes = new Uint8Array(size);
          if (globalScope.crypto && globalScope.crypto.getRandomValues) {
            globalScope.crypto.getRandomValues(bytes);
          } else {
            for (let i = 0; i < size; i++) {
              bytes[i] = Math.floor(Math.random() * 256);
            }
          }
          return bytes;
        }
      };
    }
    throw new Error(`Module '${module}' not found`);
  };
})(typeof window !== 'undefined' ? window : (globalThis as any));
