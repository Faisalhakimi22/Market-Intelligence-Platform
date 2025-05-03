// Step 1: Verify your database connection in .env
// Make sure your .env file has the correct DATABASE_URL pointing to Railway

// Step 2: Create a script to run the migration
// Add this to your package.json scripts section:
// "migrate:railway": "drizzle-kit push:pg --config=drizzle.config.ts"

// Step 3: Run the migration command
// npm run migrate:railway

// Here's a complete script you can save as migrate-railway.ts
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Load environment variables
config();

async function main() {
  console.log('Starting Railway migration...');
  
  // Get DATABASE_URL from environment variables
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('Error: DATABASE_URL is not defined in environment variables');
    process.exit(1);
  }
  
  console.log('Connecting to database...');
  
  // Create connection
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);
  
  // Run migrations
  console.log('Running migrations...');
  
  try {
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);