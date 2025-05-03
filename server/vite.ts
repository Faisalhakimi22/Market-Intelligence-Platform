import vite from "vite";
import { createServer as createViteServer } from "vite";
import { Application } from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import fs from "fs";

// Logger function that can be imported by other modules
export const log = (message: string) => {
  console.log(`[server] ${message}`);
};

// Setup Vite in development mode
export async function setupVite(app: Application, server: http.Server) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  const viteServer = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: path.resolve(__dirname, "../client"),
  });
  
  // Use Vite's connect middleware
  app.use(viteServer.middlewares);
  
  // Serve index.html for any routes not starting with /api
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    
    if (url.startsWith("/api")) {
      return next();
    }
    
    try {
      // Read index.html from client directory
      const indexPath = path.resolve(__dirname, "../client/index.html");
      let template = fs.readFileSync(indexPath, "utf-8");
      
      // Apply Vite HTML transforms
      template = await viteServer.transformIndexHtml(url, template);
      
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      viteServer.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
  
  log("Vite dev server started");
  return server;
}

// Serve static files in production
export function serveStatic(app: Application) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDistPath = path.resolve(__dirname, "../client/dist");
  
  // Serve static assets from the client/dist directory
  app.use(express.static(clientDistPath));
  
  // Fallback for SPA routing - serve index.html for all non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
  
  log("Static files being served");
}

// Re-export vite as default to satisfy the import in other files
export default vite;

// Need to import express for the static middleware
import express from "express";