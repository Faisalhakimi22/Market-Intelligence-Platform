import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertIndustrySchema, insertOpportunitySchema, insertCompetitorSchema, insertAlertSchema, insertAiInsightSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { perplexityService } from "./services/perplexity-service";


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
      
      // First try to get cached insights
      const cachedInsights = await storage.getAiInsight(industryId);
      
      // If live insights are requested or no insights exist, use Perplexity API
      if (!cachedInsights || req.query.live === 'true') {
        try {
          const perplexityResponse = await perplexityService.getIndustryInsights(industry.name);
          
          // Extract content from Perplexity response
          const content = perplexityResponse.choices[0].message.content;
          const citations = perplexityResponse.citations || [];
          
          // Create new insight or update existing one
          const insightData = {
            title: `${industry.name} Industry Analysis`,
            content: content,
            sources: citations.join('\n'),
            industryId
          };
          
          let insight;
          if (cachedInsights) {
            // Update existing insight
            insight = await storage.updateAiInsight(industryId, insightData);
          } else {
            // Create new insight
            insight = await storage.createAiInsight(insightData);
          }
          
          return res.json(insight);
        } catch (perplexityError) {
          console.error('Perplexity API error:', perplexityError);
          
          // If we have cached insights, return those instead of failing
          if (cachedInsights) {
            return res.json({
              ...cachedInsights,
              notice: 'Using cached data. Live data retrieval failed.'
            });
          }
          
          // Otherwise return the error
          return res.status(500).json({ 
            message: "Failed to retrieve live market intelligence",
            error: perplexityError.message 
          });
        }
      }
      
      // Return cached insights if available and live data not requested
      if (cachedInsights) {
        return res.json(cachedInsights);
      }
      
      return res.status(404).json({ message: "No insights available for this industry" });
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
