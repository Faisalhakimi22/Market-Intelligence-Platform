import vite from "vite";
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
  
  // Get the root path - in production this will be handled differently
  const rootPath = process.env.NODE_ENV === 'production' 
    ? path.resolve(__dirname, "../public") 
    : path.resolve(__dirname, "../client");
  
  const viteServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: rootPath,
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
      const indexPath = path.resolve(rootPath, "index.html");
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
  
  // In server-only deployment on Railway, we won't serve static files
  // This function will handle API requests only
  log("Server-only mode active");
  
  // Add a route to let clients know this is a server-only deployment
  app.get("/api/deployment-info", (req, res) => {
    res.json({
      mode: "server-only",
      environment: process.env.NODE_ENV || "production",
      version: process.env.npm_package_version || "1.0.0"
    });
  });
  
  // In server-only mode, we'll respond with API information for non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    // Return a simple JSON indicating this is a server-only deployment
    res.status(200).json({
      message: "This is a server-only deployment. Frontend routes are not available.",
      apiBase: "/api",
      documentation: "/api/docs", // You might want to add API documentation here
      status: "online"
    });
  });
  
  log("API routes configured for server-only mode");
}

// Re-export vite as default to satisfy the import in other files
export default vite;

// Need to import express for the static middleware
import express from "express";