import type { Config } from "drizzle-kit";

export default {
  schema: "../shared/schema.ts",     // Go up one level to shared/ folder
  out: "./drizzle",                  // Folder for migration files
  dialect: "postgresql",             
  driver: "pg-node",                 
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
