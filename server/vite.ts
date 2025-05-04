import { Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// For ESM compatibility
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple log function
export function log(message: string) {
  console.log(`[server] ${message}`);
}

// Function to serve static files in production
export function serveStatic(app: Express) {
  // Determine static directory - if we have a client build, serve it
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    
    // Serve index.html for any non-API routes (SPA fallback)
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
    
    log('Serving static client build');
  } else {
    log('No static client build found');
  }
}

// Dummy setupVite function for development - will only be used in dev mode
export async function setupVite(app: Express, server: any) {
  log('Vite setup not available in production');
  return { app, server };
}