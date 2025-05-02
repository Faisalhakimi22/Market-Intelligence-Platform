# Market Intelligence Platform

## Overview

The Market Intelligence Platform is an AI-powered solution designed for entrepreneurs and startup founders to analyze market data, identify business opportunities, track industry trends, evaluate competitors, forecast demand, and assess risks. By combining real-time market data with advanced AI analysis, this platform helps new business ventures succeed in competitive markets through data-driven insights.

![Market Intelligence Platform](https://github.com/yourusername/market-intelligence-platform/raw/main/screenshots/dashboard.png)

## Key Features

- **Real-time Market Data Integration**: Seamlessly connects with multiple data sources including Alpha Vantage, Financial Modeling Prep, Finnhub, Yahoo Finance, and Google Trends
- **AI-Powered Analysis**: Leverages OpenRouter API for sophisticated market trend analysis and opportunity identification
- **Competitor Intelligence**: Monitors and analyzes competitor activities, market positioning, and strategies
- **Opportunity Detection**: Identifies potential market opportunities based on trend analysis and user interest patterns
- **Time-Series Forecasting**: Utilizes advanced ARIMA and linear regression models for accurate demand trend predictions
- **Interactive Dashboards**: Presents complex market data through intuitive and interactive visualization components
- **Mobile-Responsive Design**: Ensures seamless experiences across all devices with responsive design principles

## Technology Stack

### Frontend
- React.js with TypeScript
- TanStack Query for data fetching and cache management
- Chart.js and Recharts for data visualization
- Tailwind CSS with shadcn/ui components for styling
- Wouter for client-side routing

### Backend
- Node.js with Express.js
- PostgreSQL database with Drizzle ORM
- Passport.js for authentication
- OpenRouter API integration for AI-powered insights

### Data Integration
- Alpha Vantage API for financial market data
- Financial Modeling Prep API for company financial analysis
- Finnhub API for real-time market updates
- Yahoo Finance integration via Python's yfinance library
- Google Trends integration via Python's pytrends library

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL database
- API keys for:
  - Alpha Vantage
  - Financial Modeling Prep
  - Finnhub
  - OpenRouter or Perplexity

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/market-intelligence-platform.git
   cd market-intelligence-platform
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Install Python dependencies:
   ```bash
   pip install pandas pytrends requests yfinance
   ```

4. Set up environment variables by creating a `.env` file in the project root:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/market_intelligence
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   FINANCIAL_MODELING_PREP_API_KEY=your_financial_modeling_prep_key
   FINNHUB_API_KEY=your_finnhub_key
   OPENROUTER_API_KEY=your_openrouter_key
   PERPLEXITY_API_KEY=your_perplexity_key
   ```

5. Set up the database schema:
   ```bash
   npm run db:push
   ```

### Running Locally

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

### Deployment

The project is configured for deployment on Vercel:

1. Create a new project on Vercel
2. Link it to your GitHub repository
3. Configure the environment variables in the Vercel dashboard
4. Deploy the project

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Page layout components
│   │   ├── lib/          # Utility functions and configuration
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Entry point for the React application
├── scripts/              # Python scripts for data integration
├── server/               # Backend Express application
│   ├── services/         # Service modules for external APIs
│   ├── auth.ts           # Authentication setup
│   ├── db.ts             # Database configuration
│   ├── index.ts          # Main server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite server configuration
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and types
└── vercel.json           # Vercel deployment configuration
```

## Features in Detail

### Market Analysis
The platform provides comprehensive market analysis based on real-time data from multiple sources, including stock market information, industry trends, and economic indicators.

### Competitor Intelligence
Track and analyze competitors with detailed profiles, market positioning, growth trends, and recent activities. This helps entrepreneurs understand the competitive landscape and identify potential advantages.

### Opportunity Detection
Using AI and trend analysis, the platform identifies potential business opportunities based on market gaps, growing search interest, and emerging consumer demands.

### Forecasting
Advanced time-series forecasting using ARIMA and linear regression models helps predict future market trends and demand patterns with increased accuracy.

### Data Integrations
Seamlessly integrates with multiple data sources to provide a comprehensive view of market conditions without requiring manual data collection or analysis.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Alpha Vantage API for financial market data
- Financial Modeling Prep for company financial data
- Finnhub for real-time market updates
- Yahoo Finance for stock market data
- Google Trends for search interest data
- OpenRouter and Perplexity for AI-powered insights
