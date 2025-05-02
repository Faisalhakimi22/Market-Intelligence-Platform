import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertIndustrySchema, insertOpportunitySchema, insertCompetitorSchema, insertAlertSchema, insertAiInsightSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Industries API
  app.get("/api/industries", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      const industries = await storage.getIndustries(req.user.id);
      res.json(industries);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/industries", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      try {
        const validatedData = insertIndustrySchema.parse({
          ...req.body,
          userId: req.user.id
        });
        const industry = await storage.createIndustry(validatedData);
        res.status(201).json(industry);
      } catch (err) {
        if (err instanceof ZodError) {
          const validationError = fromZodError(err);
          return res.status(400).json({ message: validationError.message });
        }
        throw err;
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.patch("/api/industries/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const industryId = parseInt(req.params.id);
      const industry = await storage.getIndustry(industryId);
      
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      
      if (industry.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this industry" });
      }
      
      const updatedIndustry = await storage.updateIndustry(industryId, req.body);
      res.json(updatedIndustry);
    } catch (error) {
      next(error);
    }
  });

  // Opportunities API
  app.get("/api/industries/:id/opportunities", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const industryId = parseInt(req.params.id);
      const industry = await storage.getIndustry(industryId);
      
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      
      if (industry.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to view this industry's opportunities" });
      }
      
      const opportunities = await storage.getOpportunities(industryId);
      res.json(opportunities);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/industries/:id/opportunities", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const industryId = parseInt(req.params.id);
      const industry = await storage.getIndustry(industryId);
      
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      
      if (industry.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to add opportunities to this industry" });
      }
      
      try {
        const validatedData = insertOpportunitySchema.parse({
          ...req.body,
          industryId
        });
        const opportunity = await storage.createOpportunity(validatedData);
        res.status(201).json(opportunity);
      } catch (err) {
        if (err instanceof ZodError) {
          const validationError = fromZodError(err);
          return res.status(400).json({ message: validationError.message });
        }
        throw err;
      }
    } catch (error) {
      next(error);
    }
  });

  // Competitors API
  app.get("/api/industries/:id/competitors", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const industryId = parseInt(req.params.id);
      const industry = await storage.getIndustry(industryId);
      
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      
      if (industry.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to view this industry's competitors" });
      }
      
      const competitors = await storage.getCompetitors(industryId);
      res.json(competitors);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/industries/:id/competitors", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const industryId = parseInt(req.params.id);
      const industry = await storage.getIndustry(industryId);
      
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      
      if (industry.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to add competitors to this industry" });
      }
      
      try {
        const validatedData = insertCompetitorSchema.parse({
          ...req.body,
          industryId
        });
        const competitor = await storage.createCompetitor(validatedData);
        res.status(201).json(competitor);
      } catch (err) {
        if (err instanceof ZodError) {
          const validationError = fromZodError(err);
          return res.status(400).json({ message: validationError.message });
        }
        throw err;
      }
    } catch (error) {
      next(error);
    }
  });

  // AI Insights API
  app.get("/api/industries/:id/insights", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const industryId = parseInt(req.params.id);
      const industry = await storage.getIndustry(industryId);
      
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      
      if (industry.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to view this industry's insights" });
      }
      
      const insights = await storage.getAiInsight(industryId);
      if (!insights) {
        return res.status(404).json({ message: "No insights available for this industry" });
      }
      
      res.json(insights);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/industries/:id/insights", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const industryId = parseInt(req.params.id);
      const industry = await storage.getIndustry(industryId);
      
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      
      if (industry.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to add insights to this industry" });
      }
      
      try {
        const validatedData = insertAiInsightSchema.parse({
          ...req.body,
          industryId
        });
        const insight = await storage.createAiInsight(validatedData);
        res.status(201).json(insight);
      } catch (err) {
        if (err instanceof ZodError) {
          const validationError = fromZodError(err);
          return res.status(400).json({ message: validationError.message });
        }
        throw err;
      }
    } catch (error) {
      next(error);
    }
  });

  // Alerts API
  app.get("/api/alerts", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const alerts = await storage.getAlerts(req.user.id);
      res.json(alerts);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/alerts", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      try {
        const validatedData = insertAlertSchema.parse({
          ...req.body,
          userId: req.user.id
        });
        const alert = await storage.createAlert(validatedData);
        res.status(201).json(alert);
      } catch (err) {
        if (err instanceof ZodError) {
          const validationError = fromZodError(err);
          return res.status(400).json({ message: validationError.message });
        }
        throw err;
      }
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
