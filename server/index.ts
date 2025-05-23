import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware for API server
app.use((req, res, next) => {
  // Allow requests from the frontend in production
  const allowedOrigins = [
    process.env.FRONTEND_URL || "https://your-frontend-domain.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// Logging middleware for API routes
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });
  next();
});

// Root route handler - shows API is running
app.get('/', (req, res) => {
  res.status(200).json({
    message: "RisNetOptimizer API Server",
    status: "running",
    version: "1.0.0",
    endpoints: ["/api/health"]
  });
});

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Register API routes
(async () => {
  const server = await registerRoutes(app);
  
  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });
  
  // Setup Vite in development mode, serve static in production
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  // 404 handler - must be after all other routes
  app.use((req, res) => {
    res.status(404).json({
      status: "error",
      message: `Cannot ${req.method} ${req.path}`
    });
  });
  
  // Listen on port from environment or fallback to 5000
  const port = process.env.PORT || 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`Server running on port ${port} in ${process.env.NODE_ENV || 'production'} mode`);
    }
  );
})();