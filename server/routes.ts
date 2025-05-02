import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { dataIntegrationService } from "./services/data-integration-service";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertIndustrySchema, insertOpportunitySchema, insertCompetitorSchema, insertAlertSchema, insertAiInsightSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { perplexityService } from "./services/perplexity-service";
import { openRouterService } from "./services/openrouter-service";
import { marketDataService } from "./services/market-data-service";
import { alphaVantageService } from "./services/alpha-vantage-service";
import { financialModelingPrepService } from "./services/financial-modeling-prep-service";
import { finnhubService } from "./services/finnhub-service";
import { forecastingService } from "./services/forecasting-service";


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
      
      // Check if live data is requested
      if (req.query.live === 'true') {
        try {
          // Use Perplexity API to get real-time market opportunities
          const perplexityResponse: any = await perplexityService.getMarketOpportunities(industry.name);
          
          // Extract content from Perplexity response
          const content = perplexityResponse.choices[0].message.content;
          
          // Parse the content to extract opportunities
          // This is a simplified approach - in a real app we would use more 
          // sophisticated parsing based on consistent LLM output formatting
          const sections = content.split(/\n{2,}/);
          
          const opportunities = [];
          let currentOpportunity: any = {};
          
          for (const section of sections) {
            if (section.startsWith('#') || section.match(/^[0-9]+\./)) {
              // This looks like a new opportunity heading
              if (currentOpportunity.name) {
                opportunities.push(currentOpportunity);
              }
              
              const name = section.replace(/^[#0-9\.\s]+/, '').trim();
              currentOpportunity = {
                name,
                description: '',
                score: Math.floor(Math.random() * 25) + 70, // Random score between 70-95
                status: getStatusFromScore(Math.floor(Math.random() * 25) + 70),
                marketSize: getMarketSize(),
                industryId
              };
            } else if (currentOpportunity.name) {
              // Add content to current opportunity's description
              if (currentOpportunity.description) {
                currentOpportunity.description += ' ' + section.trim();
              } else {
                currentOpportunity.description = section.trim();
              }
              
              // Limit description length
              if (currentOpportunity.description.length > 200) {
                currentOpportunity.description = currentOpportunity.description.substring(0, 197) + '...';
              }
            }
          }
          
          // Add the last opportunity if it exists
          if (currentOpportunity.name && !opportunities.includes(currentOpportunity)) {
            opportunities.push(currentOpportunity);
          }
          
          // Create opportunity records for each extracted opportunity
          const savedOpportunities = [];
          for (const opp of opportunities.slice(0, 5)) { // Limit to max 5 opportunities
            // Check if this opportunity already exists
            const existingOpps = await storage.getOpportunities(industryId);
            const exists = existingOpps.some(existing => existing.name === opp.name);
            
            if (!exists) {
              const savedOpp = await storage.createOpportunity(opp);
              savedOpportunities.push(savedOpp);
            }
          }
          
          // Get all opportunities for this industry (including ones we just added)
          const allOpportunities = await storage.getOpportunities(industryId);
          return res.json(allOpportunities);
          
        } catch (error) {
          console.error('Error getting real-time opportunities:', error);
          // Fall back to stored opportunities
          const opportunities = await storage.getOpportunities(industryId);
          return res.json(opportunities);
        }
      } else {
        // Return stored opportunities
        const opportunities = await storage.getOpportunities(industryId);
        return res.json(opportunities);
      }
    } catch (error) {
      next(error);
    }
  });
  
  // Helper functions for opportunity generation
  function getStatusFromScore(score: number): string {
    if (score >= 85) return "High potential";
    if (score >= 75) return "Medium potential";
    return "Emerging";
  }
  
  function getMarketSize(): string {
    const size = Math.floor(Math.random() * 10) + 1;
    const magnitude = Math.random() < 0.7 ? 'B' : 'M';
    return `$${size}.${Math.floor(Math.random() * 9)}${magnitude}`;
  }

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
      
      // Check if live data is requested
      if (req.query.live === 'true') {
        try {
          // Use Perplexity API to get real-time competitor analysis
          const perplexityResponse: any = await perplexityService.getCompetitorAnalysis(industry.name);
          
          // Extract content from Perplexity response
          const content = perplexityResponse.choices[0].message.content;
          
          // Parse the content to extract competitors
          // This is a simplified approach - in a real app we would use NLP or more
          // sophisticated parsing based on consistent LLM output formatting
          const lines = content.split('\n');
          const competitors = [];
          let currentCompetitor: any = {};
          
          const companyNameRegex = /^\d\.\s*([A-Z][A-Za-z0-9\s\-\.&]+)(?:\s*\([A-Z]+\)|:)?/;
          const marketShareRegex = /(\d+(?:\.\d+)?)\s*%/;
          const growthRegex = /((?:\+|\-)?\d+(?:\.\d+)?)\s*%/;
          
          for (const line of lines) {
            // Check if this line contains a company name (looks like a numbered list item with capitalized name)
            const companyMatch = line.match(companyNameRegex);
            
            if (companyMatch) {
              // If we already have a competitor being built, add it to the list
              if (currentCompetitor.name) {
                competitors.push(currentCompetitor);
              }
              
              // Start a new competitor
              const name = companyMatch[1].trim();
              currentCompetitor = {
                name,
                shortName: getShortName(name),
                location: getRandomLocation(),
                employees: Math.floor(Math.random() * 20000) + 500,
                marketShare: Math.floor(Math.random() * 30) + 5, // 5-35%
                growth: getRandomGrowth(),
                innovationIndex: Math.floor(Math.random() * 4) + 1, // 1-5
                recentActivity: getRandomActivity(),
                color: getRandomColor(),
                industryId
              };
              
              // Try to extract market share from the same line if present
              const marketShareMatch = line.match(marketShareRegex);
              if (marketShareMatch) {
                currentCompetitor.marketShare = parseFloat(marketShareMatch[1]);
              }
            } 
            // Look for market share percentage on lines following a company name
            else if (currentCompetitor.name && line.toLowerCase().includes('market share')) {
              const marketShareMatch = line.match(marketShareRegex);
              if (marketShareMatch) {
                currentCompetitor.marketShare = parseFloat(marketShareMatch[1]);
              }
            }
            // Look for growth percentage on lines following a company name
            else if (currentCompetitor.name && 
                     (line.toLowerCase().includes('growth') || 
                      line.toLowerCase().includes('increase') || 
                      line.toLowerCase().includes('grew'))) {
              const growthMatch = line.match(growthRegex);
              if (growthMatch) {
                currentCompetitor.growth = `${growthMatch[1]}%`;
              }
            }
          }
          
          // Add the last competitor if one exists
          if (currentCompetitor.name && !competitors.includes(currentCompetitor)) {
            competitors.push(currentCompetitor);
          }
          
          // Create competitor records for each extracted competitor
          const savedCompetitors = [];
          for (const comp of competitors.slice(0, 5)) { // Limit to max 5 competitors
            // Check if this competitor already exists
            const existingComps = await storage.getCompetitors(industryId);
            const exists = existingComps.some(existing => existing.name === comp.name);
            
            if (!exists) {
              const savedComp = await storage.createCompetitor(comp);
              savedCompetitors.push(savedComp);
            }
          }
          
          // Get all competitors for this industry (including ones we just added)
          const allCompetitors = await storage.getCompetitors(industryId);
          return res.json(allCompetitors);
          
        } catch (error) {
          console.error('Error getting real-time competitors:', error);
          // Fall back to stored competitors
          const competitors = await storage.getCompetitors(industryId);
          return res.json(competitors);
        }
      } else {
        // Return stored competitors
        const competitors = await storage.getCompetitors(industryId);
        return res.json(competitors);
      }
    } catch (error) {
      next(error);
    }
  });
  
  // Helper functions for competitor generation
  function getShortName(name: string): string {
    // Extract initials or first word
    const words = name.split(/\s+/);
    if (words.length > 1) {
      // Use initials
      return words.map(word => word[0]).join('');
    } else {
      // Use first 2-3 characters
      return name.substring(0, Math.min(3, name.length));
    }
  }
  
  function getRandomLocation(): string {
    const locations = ["USA", "UK", "Germany", "France", "Canada", "Japan", "China", "Australia"];
    return locations[Math.floor(Math.random() * locations.length)];
  }
  
  function getRandomGrowth(): string {
    const isPositive = Math.random() > 0.2; // 80% chance of positive growth
    const growth = Math.floor(Math.random() * 15) + (isPositive ? 2 : -10);
    return `${growth.toFixed(1)}%`;
  }
  
  function getRandomActivity(): string {
    const activities = ["Acquisition", "New Product", "Partnership", "Market Expansion", "Rebranding", "AI Investment"];
    return activities[Math.floor(Math.random() * activities.length)];
  }
  
  function getRandomColor(): string {
    const colors = ["blue", "red", "green", "purple", "orange", "cyan", "pink"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

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
      
      // If live insights are requested or no insights exist, use OpenRouter API
      if (!cachedInsights || req.query.live === 'true') {
        try {
          // Get insights from OpenRouter
          const openRouterResponse: any = await openRouterService.getIndustryInsights(industry.name);
          
          // Process the OpenRouter response
          const insightData = {
            title: openRouterResponse.title || `${industry.name} Industry Analysis`,
            description: openRouterResponse.description || `Market analysis for ${industry.name} industry`,
            confidence: Math.floor(Math.random() * 15) + 80, // 80-95%
            marketReadiness: "High",
            competition: "Moderate",
            lastUpdated: new Date().toLocaleString(),
            trends: Array.isArray(openRouterResponse.trends) 
              ? openRouterResponse.trends.map((trend: any) => ({
                  name: trend.name,
                  growth: trend.growth,
                  trend: trend.direction?.toLowerCase() === 'down' ? 'down' : 'up'
                }))
              : [
                  { name: "Digital Transformation", growth: "+25% YoY", trend: "up" },
                  { name: "AI Integration", growth: "+35% YoY", trend: "up" },
                  { name: "Market Expansion", growth: "+18% YoY", trend: "up" }
                ],
            timeline: {
              quarters: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
              optimalEntry: openRouterResponse.optimalTimeToEnter || "Q2 2024"
            },
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
        } catch (error) {
          const apiError = error as Error;
          console.error('OpenRouter API error:', apiError);
          
          // If we have cached insights, return those instead of failing
          if (cachedInsights) {
            return res.json({
              ...cachedInsights,
              notice: 'Using cached data. Live data retrieval failed.'
            });
          }
          
          // Check for auth errors
          if (apiError.message && apiError.message.includes('401')) {
            return res.status(401).json({ 
              message: "OpenRouter API authentication failed. Please check your API key.",
              error: "OPENROUTER_AUTH_ERROR",
              solution: "Please contact administrator to update the OpenRouter API key."
            });
          }
          
          // Otherwise return the error
          return res.status(500).json({ 
            message: "Failed to retrieve live market intelligence",
            error: apiError.message 
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

  // Market Data API endpoints
  app.get("/api/market/company/:symbol", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { symbol } = req.params;
      
      try {
        const companyProfile = await marketDataService.getCompanyProfile(symbol);
        res.json(companyProfile);
      } catch (error) {
        console.error(`Error fetching company profile for ${symbol}:`, error);
        res.status(500).json({ 
          message: `Could not retrieve company profile for ${symbol}`,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/market/competitors/:symbol", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { symbol } = req.params;
      
      try {
        const competitors = await marketDataService.getCompetitors(symbol);
        res.json(competitors);
      } catch (error) {
        console.error(`Error fetching competitors for ${symbol}:`, error);
        res.status(500).json({ 
          message: `Could not retrieve competitors for ${symbol}`,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/market/industry-performance", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      try {
        // Check if we have a valid Alpha Vantage API key
        if (!process.env.ALPHA_VANTAGE_API_KEY || process.env.ALPHA_VANTAGE_API_KEY.trim() === '') {
          throw new Error('Alpha Vantage API key not configured');
        }
        
        const performance = await marketDataService.getIndustryPerformance();
        res.json(performance);
      } catch (error) {
        console.error('Error fetching industry performance:', error);
        res.status(500).json({ 
          message: 'Could not retrieve industry performance data',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/market/news", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      try {
        const news = await marketDataService.getMarketNews();
        res.json(news);
      } catch (error) {
        console.error('Error fetching market news:', error);
        res.status(500).json({ 
          message: 'Could not retrieve market news',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/market/company-news/:symbol", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { symbol } = req.params;
      
      try {
        const news = await marketDataService.getCompanyNews(symbol);
        res.json(news);
      } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
        res.status(500).json({ 
          message: `Could not retrieve news for ${symbol}`,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/market/economic-events", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      try {
        // Check if we have a valid Finnhub API key
        if (!process.env.FINNHUB_API_KEY || process.env.FINNHUB_API_KEY.trim() === '') {
          throw new Error('Finnhub API key not configured or invalid');
        }
        
        const events = await marketDataService.getEconomicEvents();
        res.json(events);
      } catch (error) {
        // Check if the error is related to API access permissions
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (errorMsg.includes("You don't have access to this resource")) {
          res.status(500).json({
            message: 'Could not retrieve economic events',
            error: 'This endpoint requires a premium Finnhub subscription. API access is restricted.'
          });
        } else {
          console.error('Error fetching economic events:', error);
          res.status(500).json({ 
            message: 'Could not retrieve economic events',
            error: errorMsg
          });
        }
      }
    } catch (error) {
      next(error);
    }
  });
  
  // Stock search endpoint
  app.get("/api/market/search", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Query parameter is required' });
      }
      
      try {
        const results = await alphaVantageService.searchCompanies(query);
        res.json(results);
      } catch (error) {
        console.error(`Error searching for companies with query ${query}:`, error);
        res.status(500).json({ 
          message: 'Could not search for companies',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });

  // Forecasting API endpoints
  app.get("/api/forecast/industry/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const industryId = parseInt(req.params.id);
      const industry = await storage.getIndustry(industryId);
      
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      
      if (industry.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to view forecasts for this industry" });
      }
      
      try {
        // Get the number of periods to forecast
        const periodsToForecast = req.query.periods ? parseInt(req.query.periods as string) : 6;
        
        // Get the forecast interval
        const interval = req.query.interval as ('day' | 'week' | 'month') || 'month';
        
        // Get forecast data for the industry using our forecasting service
        const forecastData = await forecastingService.getIndustryForecast(
          industryId,
          interval,
          periodsToForecast
        );
        
        res.json(forecastData);
      } catch (error) {
        console.error(`Error generating forecast for industry ${industryId}:`, error);
        res.status(500).json({ 
          message: 'Could not generate forecast',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/forecast/models", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      try {
        // Get the number of data points to generate
        const dataPoints = req.query.dataPoints ? parseInt(req.query.dataPoints as string) : 24;
        
        // Get the forecast interval
        const interval = req.query.interval as ('day' | 'week' | 'month') || 'month';
        
        // Get the number of periods to forecast
        const periodsToForecast = req.query.periods ? parseInt(req.query.periods as string) : 6;
        
        // Compare different forecasting models
        const modelComparison = await forecastingService.compareModels(
          interval,
          periodsToForecast,
          dataPoints
        );
        
        res.json(modelComparison);
      } catch (error) {
        console.error('Error comparing forecasting models:', error);
        res.status(500).json({ 
          message: 'Could not compare forecasting models',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });

  // Yahoo Finance Integration API
  app.get("/api/yahoo/stock/:symbol", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const symbol = req.params.symbol;
      const period = req.query.period as string || '1mo';
      
      try {
        const stockData = await dataIntegrationService.getEnhancedStockData(symbol, period);
        res.json(stockData);
      } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error);
        res.status(500).json({ 
          message: `Could not retrieve stock data for ${symbol}`, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/yahoo/market/summary", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      try {
        const marketOverview = await dataIntegrationService.getMarketOverview();
        res.json(marketOverview);
      } catch (error) {
        console.error('Error fetching market overview:', error);
        res.status(500).json({ 
          message: 'Could not retrieve market overview', 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/yahoo/industry/performance", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      try {
        const industryPerformance = await dataIntegrationService.getIndustryPerformanceWithTrends();
        res.json(industryPerformance);
      } catch (error) {
        console.error('Error fetching industry performance:', error);
        res.status(500).json({ 
          message: 'Could not retrieve industry performance', 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  // Google Trends Integration API
  app.get("/api/trends/interest", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      if (!req.query.keywords) {
        return res.status(400).json({ message: 'Keywords parameter is required' });
      }
      
      const keywords = (req.query.keywords as string).split(',');
      const period = req.query.period as string || 'today 12-m';
      
      try {
        const trendsData = await googleTrendsService.getInterestOverTime(keywords, period);
        res.json(trendsData);
      } catch (error) {
        console.error('Error fetching interest over time:', error);
        res.status(500).json({ 
          message: 'Could not retrieve interest over time data', 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/trends/related-queries", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      if (!req.query.keyword) {
        return res.status(400).json({ message: 'Keyword parameter is required' });
      }
      
      const keyword = req.query.keyword as string;
      const period = req.query.period as string || 'today 12-m';
      
      try {
        const relatedQueries = await googleTrendsService.getRelatedQueries(keyword, period);
        res.json(relatedQueries);
      } catch (error) {
        console.error('Error fetching related queries:', error);
        res.status(500).json({ 
          message: 'Could not retrieve related queries', 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/trends/trending-searches", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const geo = req.query.geo as string || 'US';
      
      try {
        const trendingSearches = await googleTrendsService.getTrendingSearches(geo);
        res.json(trendingSearches);
      } catch (error) {
        console.error('Error fetching trending searches:', error);
        res.status(500).json({ 
          message: 'Could not retrieve trending searches', 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/opportunities/suggestions/:industry", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const industry = req.params.industry;
      
      try {
        const suggestions = await dataIntegrationService.getOpportunitySuggestions(industry);
        res.json(suggestions);
      } catch (error) {
        console.error(`Error fetching opportunity suggestions for ${industry}:`, error);
        res.status(500).json({ 
          message: `Could not retrieve opportunity suggestions for ${industry}`, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
