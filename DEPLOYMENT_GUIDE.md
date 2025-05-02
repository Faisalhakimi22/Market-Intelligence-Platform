# Deployment Guide for Market Intelligence Platform

## Deploying to Vercel

This guide will walk you through deploying the Market Intelligence Platform to Vercel.

### Prerequisites

- A Vercel account (you can sign up at https://vercel.com)
- A GitHub, GitLab, or Bitbucket account where your project is hosted
- API keys for all the required services

### Step 1: Prepare Your Repository

Ensure your repository contains all the necessary configuration files:
- `vercel.json` (already included in the project)
- `package.json` with proper build scripts

### Step 2: Set Up a New Project on Vercel

1. Log in to your Vercel account
2. Click "New Project"
3. Import your GitHub, GitLab, or Bitbucket repository
4. Select the repository containing the Market Intelligence Platform

### Step 3: Configure Project Settings

1. In the "Configure Project" page:
   - **Build and Output Settings**: The defaults should work as they're defined in `vercel.json`
   - **Root Directory**: Leave as `.` (project root)

2. Configure Environment Variables:
   - Click "Environment Variables"
   - Add each of the following environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `ALPHA_VANTAGE_API_KEY`: Your Alpha Vantage API key
     - `FINANCIAL_MODELING_PREP_API_KEY`: Your Financial Modeling Prep API key
     - `FINNHUB_API_KEY`: Your Finnhub API key
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `PERPLEXITY_API_KEY`: Your Perplexity API key

3. Advanced Settings (optional):
   - Enable "Preview Deployments" if you want to test changes in pull requests
   - Configure "Custom Domains" if you want to use your own domain

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Once deployed, Vercel will provide a URL where your application is accessible

### Step 5: Set Up PostgreSQL Database

You'll need a PostgreSQL database for your application. Options include:

1. **Vercel Postgres**: If available in your region
   - Go to "Storage" in your Vercel dashboard
   - Create a new Postgres database
   - Vercel will automatically add the connection details to your environment variables

2. **Neon Database** (recommended):
   - Sign up at https://neon.tech
   - Create a new project
   - Get the connection string
   - Update the `DATABASE_URL` environment variable in your Vercel project

3. **Other providers**:
   - Supabase, Railway, or any PostgreSQL provider
   - Make sure to update the connection string in your Vercel environment variables

### Step 6: Initialize the Database Schema

After deploying, you need to initialize your database schema:

1. Navigate to your Vercel project dashboard
2. Go to "Deployments" tab
3. Select your latest deployment
4. Click on "Functions" or "Serverless Functions"
5. Find and click on "Console"
6. Run the command: `npx drizzle-kit push`

Alternatively, you can run this command locally with your production database URL to initialize the schema before deploying.

### Step 7: Verify Deployment

1. Visit your deployed application URL
2. Create an account and log in
3. Test all the major features to ensure everything is working as expected

### Continuous Deployment

Vercel will automatically deploy updates when you push changes to your repository's main branch. To take advantage of this:

1. Make changes to your code locally
2. Commit and push to your repository
3. Vercel will automatically build and deploy the changes

### Troubleshooting

- **Application Error**: Check the Vercel logs for specific error messages
- **Database Connection Issues**: Verify your DATABASE_URL is correct and the database is accessible
- **API Integration Errors**: Ensure all API keys are correctly set in the environment variables
- **Build Failures**: Check the build logs for compilation or dependency errors

### Server-Side Logging

To view logs from your application:

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Logs"
4. You can filter logs by production, preview, or development environments

### Conclusion

Your Market Intelligence Platform should now be successfully deployed on Vercel. The platform is configured for both the frontend and backend to work seamlessly together in a serverless environment.

For any additional help, refer to the Vercel documentation at https://vercel.com/docs or reach out to support.
