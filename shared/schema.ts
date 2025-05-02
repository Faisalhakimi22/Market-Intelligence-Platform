import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").default("Analyst"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  isActive: boolean("is_active").default(false),
  userId: integer("user_id").references(() => users.id),
});

export const marketTrends = pgTable("market_trends", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  growthRate: text("growth_rate").notNull(),
  trend: text("trend").notNull(), // up or down
  industryId: integer("industry_id").references(() => industries.id),
});

export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  score: integer("score").notNull(),
  status: text("status").notNull(), // High potential, Medium potential, Emerging
  marketSize: text("market_size").notNull(),
  industryId: integer("industry_id").references(() => industries.id),
});

export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  location: text("location").notNull(),
  employees: integer("employees").notNull(),
  marketShare: integer("market_share").notNull(),
  growth: text("growth").notNull(),
  innovationIndex: integer("innovation_index").notNull(), // 1-5
  recentActivity: text("recent_activity"),
  color: text("color").notNull(),
  industryId: integer("industry_id").references(() => industries.id),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // Regulatory Change, Competitor Activity, Market Opportunity
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: text("impact").notNull(), // High, Medium, Low
  iconType: text("icon_type").notNull(),
  timeAgo: text("time_ago").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: integer("confidence").notNull(),
  marketReadiness: text("market_readiness").notNull(),
  competition: text("competition").notNull(),
  lastUpdated: text("last_updated").notNull(),
  industryId: integer("industry_id").references(() => industries.id),
  trends: json("trends").notNull(),
  timeline: json("timeline").notNull(),
});

// Export insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertIndustrySchema = createInsertSchema(industries).omit({ id: true });
export const insertMarketTrendSchema = createInsertSchema(marketTrends).omit({ id: true });
export const insertOpportunitySchema = createInsertSchema(opportunities).omit({ id: true });
export const insertCompetitorSchema = createInsertSchema(competitors).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true });
export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({ id: true });

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertIndustry = z.infer<typeof insertIndustrySchema>;
export type InsertMarketTrend = z.infer<typeof insertMarketTrendSchema>;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;

export type User = typeof users.$inferSelect;
export type Industry = typeof industries.$inferSelect;
export type MarketTrend = typeof marketTrends.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type Competitor = typeof competitors.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
// Define the types for the JSON fields in aiInsights
type InsightTrend = {
  name: string;
  growth: string;
  trend: string;
};

type Timeline = {
  quarters: string[];
  optimalEntry: string;
};

type AiInsightBase = typeof aiInsights.$inferSelect;

// Extend the base type with more specific types for the JSON fields
export type AiInsight = Omit<AiInsightBase, 'trends' | 'timeline'> & {
  trends: MarketTrend[];
  timeline: Timeline;
};
