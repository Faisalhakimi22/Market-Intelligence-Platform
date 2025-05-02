import { users, industries, marketTrends, opportunities, competitors, alerts, aiInsights } from "@shared/schema";
import type { User, InsertUser, Industry, InsertIndustry, MarketTrend, InsertMarketTrend, Opportunity, InsertOpportunity, Competitor, InsertCompetitor, Alert, InsertAlert, AiInsight, InsertAiInsight } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

export interface IStorage {
  sessionStore: session.SessionStore;
  
  // User related
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Industry related
  getIndustries(userId: number): Promise<Industry[]>;
  getIndustry(id: number): Promise<Industry | undefined>;
  createIndustry(industry: InsertIndustry): Promise<Industry>;
  updateIndustry(id: number, industry: Partial<InsertIndustry>): Promise<Industry | undefined>;
  
  // Market trends
  getMarketTrends(industryId: number): Promise<MarketTrend[]>;
  createMarketTrend(trend: InsertMarketTrend): Promise<MarketTrend>;
  
  // Opportunities
  getOpportunities(industryId: number): Promise<Opportunity[]>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  
  // Competitors
  getCompetitors(industryId: number): Promise<Competitor[]>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  
  // Alerts
  getAlerts(userId: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  
  // AI Insights
  getAiInsight(industryId: number): Promise<AiInsight | undefined>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  updateAiInsight(industryId: number, insight: Partial<InsertAiInsight>): Promise<AiInsight | undefined>;

  // Password handling
  hashPassword(password: string): Promise<string>;
  comparePasswords(supplied: string, stored: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private industries: Map<number, Industry>;
  private marketTrends: Map<number, MarketTrend>;
  private opportunities: Map<number, Opportunity>;
  private competitors: Map<number, Competitor>;
  private alerts: Map<number, Alert>;
  private aiInsights: Map<number, AiInsight>;
  
  sessionStore: session.SessionStore;
  currentId: {
    users: number;
    industries: number;
    marketTrends: number;
    opportunities: number;
    competitors: number;
    alerts: number;
    aiInsights: number;
  };

  constructor() {
    this.users = new Map();
    this.industries = new Map();
    this.marketTrends = new Map();
    this.opportunities = new Map();
    this.competitors = new Map();
    this.alerts = new Map();
    this.aiInsights = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    this.currentId = {
      users: 1,
      industries: 1,
      marketTrends: 1,
      opportunities: 1,
      competitors: 1,
      alerts: 1,
      aiInsights: 1
    };
  }

  // User related methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Industry related methods
  async getIndustries(userId: number): Promise<Industry[]> {
    return Array.from(this.industries.values()).filter(
      (industry) => industry.userId === userId,
    );
  }

  async getIndustry(id: number): Promise<Industry | undefined> {
    return this.industries.get(id);
  }

  async createIndustry(industry: InsertIndustry): Promise<Industry> {
    const id = this.currentId.industries++;
    const newIndustry: Industry = { ...industry, id };
    this.industries.set(id, newIndustry);
    return newIndustry;
  }

  async updateIndustry(id: number, industry: Partial<InsertIndustry>): Promise<Industry | undefined> {
    const existingIndustry = this.industries.get(id);
    if (!existingIndustry) return undefined;
    
    const updatedIndustry = { ...existingIndustry, ...industry };
    this.industries.set(id, updatedIndustry);
    return updatedIndustry;
  }

  // Market trends methods
  async getMarketTrends(industryId: number): Promise<MarketTrend[]> {
    return Array.from(this.marketTrends.values()).filter(
      (trend) => trend.industryId === industryId,
    );
  }

  async createMarketTrend(trend: InsertMarketTrend): Promise<MarketTrend> {
    const id = this.currentId.marketTrends++;
    const newTrend: MarketTrend = { ...trend, id };
    this.marketTrends.set(id, newTrend);
    return newTrend;
  }

  // Opportunities methods
  async getOpportunities(industryId: number): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values()).filter(
      (opportunity) => opportunity.industryId === industryId,
    );
  }

  async createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity> {
    const id = this.currentId.opportunities++;
    const newOpportunity: Opportunity = { ...opportunity, id };
    this.opportunities.set(id, newOpportunity);
    return newOpportunity;
  }

  // Competitors methods
  async getCompetitors(industryId: number): Promise<Competitor[]> {
    return Array.from(this.competitors.values()).filter(
      (competitor) => competitor.industryId === industryId,
    );
  }

  async createCompetitor(competitor: InsertCompetitor): Promise<Competitor> {
    const id = this.currentId.competitors++;
    const newCompetitor: Competitor = { ...competitor, id };
    this.competitors.set(id, newCompetitor);
    return newCompetitor;
  }

  // Alerts methods
  async getAlerts(userId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.userId === userId,
    );
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.currentId.alerts++;
    const newAlert: Alert = { ...alert, id };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  // AI Insights methods
  async getAiInsight(industryId: number): Promise<AiInsight | undefined> {
    return Array.from(this.aiInsights.values()).find(
      (insight) => insight.industryId === industryId,
    );
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const id = this.currentId.aiInsights++;
    const newInsight: AiInsight = { ...insight, id };
    this.aiInsights.set(id, newInsight);
    return newInsight;
  }

  // Password handling
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  async comparePasswords(supplied: string, stored: string): Promise<boolean> {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  }
}

export const storage = new MemStorage();

// Initialize with some example data for demo purposes
(async () => {
  // Create a demo user if none exists
  if ((await storage.getUserByUsername("demo")) === undefined) {
    const hashedPassword = await storage.hashPassword("password123");
    await storage.createUser({
      username: "demo",
      password: hashedPassword,
      name: "Alex Morgan",
      email: "alex@example.com",
      role: "Enterprise Analyst"
    });
    
    // Create some initial industries for the demo user
    const healthcareIndustry = await storage.createIndustry({
      name: "Healthcare",
      color: "primary-400",
      isActive: true,
      userId: 1
    });
    
    const techIndustry = await storage.createIndustry({
      name: "Technology",
      color: "secondary-500",
      isActive: true,
      userId: 1
    });
    
    const eduIndustry = await storage.createIndustry({
      name: "Education",
      color: "success-500",
      isActive: false,
      userId: 1
    });
    
    // Create AI Insights for healthcare
    await storage.createAiInsight({
      title: "Healthcare Technology Integration",
      description: "AI analysis indicates 73% growth potential in telemedicine solutions with integrated diagnostic AI capabilities in rural healthcare markets.",
      confidence: 92,
      marketReadiness: "High",
      competition: "Moderate",
      lastUpdated: "Today, 11:45 AM",
      industryId: healthcareIndustry.id,
      trends: [
        { name: "Remote patient monitoring", growth: "+34% YoY", trend: "up" },
        { name: "AI-powered diagnostics", growth: "+28% YoY", trend: "up" },
        { name: "Traditional medical hardware", growth: "-12% YoY", trend: "down" }
      ],
      timeline: {
        quarters: ["Q4 2023", "Q1 2024", "Q2 2024", "Q3 2024"],
        optimalEntry: "Q1 2024"
      }
    });
    
    // Create opportunities
    await storage.createOpportunity({
      name: "Telemedicine Platform",
      description: "AI-powered remote diagnostics",
      score: 89,
      status: "High potential",
      marketSize: "$4.2B",
      industryId: healthcareIndustry.id
    });
    
    await storage.createOpportunity({
      name: "Health Data Analytics",
      description: "Predictive patient outcomes",
      score: 76,
      status: "Medium potential",
      marketSize: "$2.8B",
      industryId: healthcareIndustry.id
    });
    
    await storage.createOpportunity({
      name: "Medical IoT Security",
      description: "Device protection systems",
      score: 63,
      status: "Emerging",
      marketSize: "$1.5B",
      industryId: healthcareIndustry.id
    });
    
    // Create competitors
    await storage.createCompetitor({
      name: "HealthTech Inc.",
      shortName: "HT",
      location: "USA",
      employees: 10500,
      marketShare: 28,
      growth: "12.4%",
      innovationIndex: 4,
      recentActivity: "New Product",
      color: "blue",
      industryId: healthcareIndustry.id
    });
    
    await storage.createCompetitor({
      name: "MediData Systems",
      shortName: "MD",
      location: "Germany",
      employees: 8200,
      marketShare: 21,
      growth: "8.7%",
      innovationIndex: 4,
      recentActivity: "Acquisition",
      color: "purple",
      industryId: healthcareIndustry.id
    });
    
    await storage.createCompetitor({
      name: "CareSync",
      shortName: "CS",
      location: "Canada",
      employees: 5800,
      marketShare: 16,
      growth: "15.2%",
      innovationIndex: 3,
      recentActivity: "AI Investment",
      color: "red",
      industryId: healthcareIndustry.id
    });
    
    // Create alerts
    await storage.createAlert({
      type: "Regulatory Change",
      title: "Regulatory Change Alert",
      description: "FDA announces new guidelines for AI-powered medical diagnostics that may impact product certification timelines.",
      impact: "High Impact",
      iconType: "alert",
      timeAgo: "2 hours ago",
      userId: 1
    });
    
    await storage.createAlert({
      type: "Competitor Activity",
      title: "Competitor Activity",
      description: "HealthTech Inc. announced a strategic partnership with major cloud provider for AI healthcare solutions.",
      impact: "Medium Impact",
      iconType: "eye",
      timeAgo: "Yesterday",
      userId: 1
    });
    
    await storage.createAlert({
      type: "Market Opportunity",
      title: "Market Opportunity",
      description: "Rural healthcare providers show 43% increase in technology adoption budgets for 2024, creating new market opportunities.",
      impact: "Opportunity",
      iconType: "chart",
      timeAgo: "2 days ago",
      userId: 1
    });
  }
})();
