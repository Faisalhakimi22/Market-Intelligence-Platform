<div align="center">


# 📊 Market Intelligence Platform

</div>

![React](https://img.shields.io/badge/React-18-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)
![Express](https://img.shields.io/badge/Express-4.21-000000.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169e1.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-API-412991.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**Enterprise-grade market intelligence platform with AI-powered insights, real-time data integrations, and advanced forecasting for entrepreneurs and startup founders**

[Features](#-key-features) • [Demo](#-platform-overview) • [Installation](#-installation) • [Architecture](#-architecture) • [Tech Stack](#-technology-stack) • [Deployment](#-deployment)

</div>

---

## 📋 Overview

The **Market Intelligence Platform** is a comprehensive full-stack web application designed to empower entrepreneurs and startup founders with **real-time market data**, **AI-powered business insights**, and **predictive analytics**. Built with modern technologies including React, TypeScript, Express.js, and PostgreSQL, the platform aggregates data from multiple trusted sources (Alpha Vantage, Yahoo Finance, Google Trends, Finnhub) and leverages AI to identify business opportunities, analyze competitors, and forecast market trends.

Unlike traditional market research tools that rely on static or outdated information, this platform continuously updates its insights using live data feeds, AI analysis (OpenRouter API), and time-series forecasting models (ARIMA, linear regression) to provide actionable intelligence.

### 🎯 Why This Platform?

- **For Entrepreneurs**: Discover validated business opportunities based on market gaps and trending searches
- **For Startups**: Monitor competitors, track market trends, and make data-driven strategic decisions
- **For Investors**: Analyze market conditions, sector performances, and growth projections
- **For Product Teams**: Identify consumer demands, emerging trends, and unfulfilled market needs

---

## ✨ Key Features

### 1. 📊 Market Analysis Dashboard
- **Real-time market indices** (S&P 500, NASDAQ, Dow Jones, etc.)
- **Sector performance tracking** across multiple industries
- **Economic indicators** (GDP, inflation, unemployment rates)
- **Interactive charts** with Chart.js and Recharts
- **Custom date range analysis** and historical comparisons

### 2. 🕵️ Competitor Intelligence
- **Automated competitor monitoring** from multiple data sources
- **Market positioning analysis** and competitive landscape mapping
- **Growth trend tracking** with visual comparisons
- **Strategy detection** through news and financial data
- **Alerts for competitor activities** and market movements

### 3. 🎯 AI-Powered Opportunity Detection
- **OpenRouter AI integration** for intelligent analysis
- **Business opportunity scoring** based on market gaps and trends
- **Google Trends integration** for search interest patterns
- **Feasibility assessment** and impact predictions
- **Prioritized opportunity lists** with actionable recommendations

### 4. 📈 Time-Series Forecasting
- **ARIMA models** for advanced trend prediction
- **Linear regression** for demand and growth projections
- **Visual forecast charts** with confidence intervals
- **Multiple prediction horizons** (short-term, long-term)
- **Accuracy validation** and error metrics

### 5. 🔗 Data Integrations Hub
- **Yahoo Finance Widget**: Live stock data, price charts, company financials
- **Google Trends Widget**: Real-time search interest for multiple keywords
- **Alpha Vantage**: Financial market data and technical indicators
- **Finnhub**: Real-time market news and updates
- **Financial Modeling Prep**: Company financial statements and analysis

### 6. 🔔 Smart Alerts System
- **Custom alert creation** for market changes and competitor activities
- **Real-time notifications** via WebSocket connections
- **Alert history tracking** and management
- **Configurable thresholds** for different metrics

### 7. 📄 Reports Generation
- **Comprehensive market reports** with insights and visualizations
- **Export functionality** (PDF, CSV - planned)
- **Customizable templates** for different stakeholders
- **Automated data aggregation** from all platform modules

### 8. 🔐 Secure Authentication
- **Passport.js local authentication** with session management
- **Role-based access control** (planned)
- **Secure password hashing** and validation
- **Session persistence** with PostgreSQL store

---

## 🎬 Platform Overview

### Dashboard
The main dashboard provides a bird's-eye view of market conditions with:
- Real-time market indices and sector performances
- Recent opportunities and competitor activities
- Quick access to all platform modules
- Personalized insights based on user preferences

### Market Analysis
Deep dive into specific market segments with:
- Interactive charts and data visualizations
- Historical trend analysis and comparisons
- Key metrics and performance indicators
- Export capabilities for stakeholder presentations

### Competitor Intelligence
Monitor the competitive landscape with:
- Automated competitor tracking and analysis
- Growth metrics and market positioning
- News monitoring and sentiment analysis
- Strategic insights and recommendations

### Opportunities
Discover and evaluate business opportunities:
- AI-generated opportunity suggestions
- Market gap identification and scoring
- Trending search analysis from Google Trends
- Feasibility assessments and risk evaluations

### Forecasting
Predict future market trends with:
- ARIMA time-series forecasting models
- Linear regression for growth projections
- Visual forecast charts with confidence intervals
- Scenario modeling and sensitivity analysis

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** database (Neon DB recommended)
- **API Keys** for data sources (see Configuration section)
- **Python** 3.8+ (for data integration scripts)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Faisalhakimi22/Market-Intelligence-Platform.git
cd Market-Intelligence-Platform
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..

# Install Python dependencies (for data scripts)
pip install -r requirements.txt  # If requirements.txt exists
# Or manually: pip install yfinance pytrends requests
```

3. **Configure environment variables**
```bash
# Create .env file in the root directory
cp .env.example .env

# Edit .env with your credentials:
# DATABASE_URL=postgresql://user:password@host:port/dbname
# OPENROUTER_API_KEY=your_openrouter_key
# ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
# FINNHUB_API_KEY=your_finnhub_key
# FMP_API_KEY=your_fmp_key
# SESSION_SECRET=your_session_secret
```

4. **Set up the database**
```bash
# Run database migrations with Drizzle ORM
npm run db:push
```

5. **Start the development servers**
```bash
# Start both client and server in development mode
npm run dev

# Or start them separately:
# Terminal 1 (Server):
cd server
npm run dev

# Terminal 2 (Client):
cd client
npm run dev
```

6. **Access the application**
```
Frontend: http://localhost:5173
Backend API: http://localhost:3000
```

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  React 18 + TypeScript + TanStack Query + Wouter            │
│  TailwindCSS + shadcn/ui + Radix UI + Chart.js              │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/REST API
┌────────────────────┴────────────────────────────────────────┐
│                      API Layer (Express.js)                  │
│  Authentication (Passport.js) + Session Management          │
│  RESTful Endpoints + WebSocket Server                       │
└────────────┬───────────────────────┬────────────────────────┘
             │                       │
┌────────────┴───────────┐  ┌───────┴──────────────────────┐
│   Data Integration      │  │   AI/ML Services             │
│   Alpha Vantage         │  │   OpenRouter API             │
│   Yahoo Finance         │  │   ARIMA Forecasting          │
│   Google Trends         │  │   Linear Regression          │
│   Finnhub               │  │   ml-matrix                  │
│   Financial Modeling    │  │   simple-statistics          │
└────────────┬───────────┘  └───────┬──────────────────────┘
             │                       │
┌────────────┴───────────────────────┴────────────────────────┐
│              Storage Layer (PostgreSQL + Neon)               │
│  Users | Industries | Market Trends | Opportunities         │
│  Competitors | Alerts | AI Insights | Reports               │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure
```
Market-Intelligence-Platform/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── dashboard/      # Dashboard-specific components
│   │   │   ├── forecasting/    # Forecasting charts & models
│   │   │   ├── market-data/    # Market data visualizations
│   │   │   ├── navigation/     # Navigation & layout
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Layout components
│   │   ├── lib/                # Utility functions & API client
│   │   ├── pages/              # Page components (routes)
│   │   │   ├── home-page.tsx
│   │   │   ├── market-analysis-page.tsx
│   │   │   ├── competitor-intelligence-page.tsx
│   │   │   ├── opportunities-page.tsx
│   │   │   ├── forecasting-page.tsx
│   │   │   ├── data-integrations-page.tsx
│   │   │   ├── alerts-page.tsx
│   │   │   └── reports-page.tsx
│   │   └── shared/             # Shared types & schemas
│   └── package.json
├── server/                      # Express backend
│   ├── services/               # Business logic & data services
│   ├── shared/                 # Shared types & schemas
│   ├── auth.ts                 # Authentication logic
│   ├── db.ts                   # Database connection
│   ├── routes.ts               # API route definitions
│   ├── index.ts                # Server entry point
│   └── package.json
├── scripts/                     # Data integration scripts
│   ├── yahoo_finance.py        # Yahoo Finance data fetching
│   └── google_trends.py        # Google Trends data fetching
├── package.json                # Root package.json
├── drizzle.config.ts           # Drizzle ORM configuration
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
└── REPORT.md                   # Detailed project report
```

---

## 🛠️ Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI library for component-based architecture |
| **TypeScript** | 5.6 | Type safety and improved developer experience |
| **Wouter** | 3.7 | Lightweight client-side routing |
| **TanStack Query** | 5.75 | Data fetching, caching, and state management |
| **TailwindCSS** | 4.1 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Pre-built accessible UI components |
| **Radix UI** | Latest | Unstyled, accessible component primitives |
| **Chart.js** | 4.4 | Interactive data visualization library |
| **Recharts** | 2.15 | Composable charting library built on React |
| **Framer Motion** | 11.13 | Animation library for smooth transitions |
| **Vite** | 5.4 | Fast build tool and dev server |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime for backend |
| **Express.js** | 4.21 | Web framework for REST API |
| **TypeScript** | 5.6 | Type-safe backend development |
| **Drizzle ORM** | 0.39 | Type-safe SQL ORM for PostgreSQL |
| **PostgreSQL** | Latest | Relational database (Neon hosted) |
| **Passport.js** | 0.7 | Authentication middleware |
| **express-session** | 1.18 | Session management |
| **WebSocket (ws)** | 8.18 | Real-time bidirectional communication |
| **Zod** | 3.24 | Schema validation and type inference |

### Data Integration & AI
| Technology | Purpose |
|------------|---------|
| **OpenRouter API** | AI-powered market analysis and insights |
| **Alpha Vantage** | Financial market data and stock information |
| **Yahoo Finance** | Stock data, company financials (Python) |
| **Google Trends** | Search interest patterns and trending topics (Python) |
| **Finnhub** | Real-time market news and updates |
| **Financial Modeling Prep** | Company financial statements and metrics |
| **ml-matrix** | Matrix operations for ML models |
| **simple-statistics** | Statistical analysis and calculations |

### Development & Deployment
- **esbuild** - Fast JavaScript bundler
- **tsx** - TypeScript execution engine
- **Drizzle Kit** - Database migrations and schema management
- **Railway / Vercel** - Cloud deployment platforms
- **Replit** - Development environment (optional)

---

## 📊 Features in Detail

### Market Analysis Dashboard

The dashboard aggregates data from multiple sources to provide:

**Real-Time Market Indices**
- S&P 500, NASDAQ, Dow Jones, Russell 2000
- International indices (FTSE, DAX, Nikkei, etc.)
- Cryptocurrency markets (Bitcoin, Ethereum, etc.)
- Commodity prices (Gold, Oil, Silver, etc.)

**Sector Performance**
- Technology, Healthcare, Finance, Energy, Consumer sectors
- Sector-specific ETF tracking
- Historical performance comparisons
- Relative strength indicators

**Interactive Visualizations**
- Line charts for trend analysis
- Candlestick charts for price movements
- Volume indicators and technical analysis
- Custom date range selection

### Competitor Intelligence

**Automated Monitoring**
- Track up to 10+ competitors simultaneously
- Automated data collection from financial APIs
- News aggregation and sentiment analysis
- Social media monitoring (planned)

**Analysis Features**
- Market share estimation and trends
- Revenue and growth comparisons
- Product launch tracking
- Pricing strategy analysis
- SWOT analysis generation (AI-powered)

**Alerts**
- Stock price movements
- News mentions
- Product releases
- Strategic partnerships or acquisitions

### AI-Powered Opportunity Detection

**OpenRouter Integration**
- Prompt engineering for market gap identification
- Business opportunity scoring algorithms
- Feasibility assessment based on market data
- Risk analysis and mitigation strategies

**Google Trends Analysis**
- Multi-keyword trend comparison
- Geographic interest patterns
- Related query discovery
- Seasonal trend identification

**Opportunity Scoring**
- Market size estimation
- Growth potential rating
- Competition level assessment
- Entry barrier analysis
- Overall opportunity score (0-100)

### Time-Series Forecasting

**ARIMA Implementation**
- Autoregressive Integrated Moving Average models
- Automatic parameter selection (p, d, q)
- Seasonal ARIMA for cyclical data
- Model validation and error metrics (RMSE, MAE)

**Linear Regression**
- Simple linear regression for trend lines
- Multiple regression for complex relationships
- R-squared goodness-of-fit analysis
- Residual analysis and diagnostics

**Forecast Visualization**
- Historical data with forecast overlay
- Confidence intervals (95%, 99%)
- Multiple scenario projections
- Interactive chart controls

---

## 🔧 Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# API Keys
OPENROUTER_API_KEY=sk-or-v1-your-key-here
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
FINNHUB_API_KEY=your-finnhub-key
FMP_API_KEY=your-fmp-key

# Authentication
SESSION_SECRET=your-random-secret-key-min-32-chars

# Environment
NODE_ENV=development
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### API Key Setup

1. **OpenRouter API** (for AI analysis)
   - Sign up at https://openrouter.ai/
   - Generate API key in dashboard
   - Cost: Pay-as-you-go (typically $0.001-0.01 per request)

2. **Alpha Vantage** (for stock data)
   - Sign up at https://www.alphavantage.co/support/#api-key
   - Free tier: 5 API calls per minute, 500 per day

3. **Finnhub** (for market news)
   - Sign up at https://finnhub.io/register
   - Free tier: 60 API calls per minute

4. **Financial Modeling Prep** (for company financials)
   - Sign up at https://site.financialmodelingprep.com/developer/docs
   - Free tier: 250 API calls per day

### Database Setup

**Using Neon (Recommended)**
```bash
# 1. Create account at https://neon.tech/
# 2. Create new project
# 3. Copy connection string to DATABASE_URL
# 4. Run migrations:
npm run db:push
```

**Using Local PostgreSQL**
```bash
# 1. Install PostgreSQL locally
# 2. Create database:
createdb market_intelligence

# 3. Update DATABASE_URL in .env:
DATABASE_URL=postgresql://localhost:5432/market_intelligence

# 4. Run migrations:
npm run db:push
```

---

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# This will:
# 1. Build the React frontend (Vite) → dist/public/
# 2. Bundle the Express backend (esbuild) → dist/index.js
```

### Deployment Options

#### Option 1: Railway (Recommended for Full-Stack)

1. **Create Railway account** at https://railway.app/
2. **Connect GitHub repository**
3. **Add environment variables** in Railway dashboard
4. **Deploy automatically** on git push

```bash
# railway.json is already configured
# Just connect the repo and deploy
```

#### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel)**
```bash
cd client
vercel deploy --prod
```

**Backend (Railway)**
```bash
# Deploy server separately on Railway
# Update FRONTEND_URL in backend .env
```

#### Option 3: Docker Deployment

```dockerfile
# Dockerfile (create this)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```bash
docker build -t market-intelligence .
docker run -p 3000:3000 --env-file .env market-intelligence
```

### Environment-Specific Configuration

**Development**
```bash
NODE_ENV=development
npm run dev
```

**Production**
```bash
NODE_ENV=production
npm run build
npm start
```

---

## 📖 API Documentation

### Authentication Endpoints

```typescript
POST   /api/register          // Create new user account
POST   /api/login             // Login with credentials
POST   /api/logout            // Logout current user
GET    /api/user              // Get current user info
```

### Market Data Endpoints

```typescript
GET    /api/market/indices    // Get market indices data
GET    /api/market/sectors    // Get sector performances
GET    /api/market/stocks/:symbol // Get specific stock data
GET    /api/market/trends     // Get market trends
```

### Competitor Intelligence Endpoints

```typescript
GET    /api/competitors       // Get all tracked competitors
POST   /api/competitors       // Add new competitor
GET    /api/competitors/:id   // Get competitor details
PUT    /api/competitors/:id   // Update competitor
DELETE /api/competitors/:id   // Remove competitor
```

### Opportunities Endpoints

```typescript
GET    /api/opportunities     // Get all opportunities
POST   /api/opportunities/generate // Generate new opportunities (AI)
GET    /api/opportunities/:id // Get opportunity details
PUT    /api/opportunities/:id // Update opportunity score
```

### Forecasting Endpoints

```typescript
POST   /api/forecast/arima    // Generate ARIMA forecast
POST   /api/forecast/linear   // Generate linear regression forecast
GET    /api/forecast/history  // Get historical forecasts
```

### Alerts Endpoints

```typescript
GET    /api/alerts            // Get user alerts
POST   /api/alerts            // Create new alert
PUT    /api/alerts/:id        // Update alert
DELETE /api/alerts/:id        // Delete alert
```

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run type checking
npm run check

# Lint code
npm run lint  # Add to package.json if needed
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write descriptive commit messages
- Update documentation for new features
- Test thoroughly before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**MIT License Summary**:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Provided "as is" without warranty

---

## 🙏 Acknowledgments

- **[Alpha Vantage](https://www.alphavantage.co/)** - Financial market data API
- **[OpenRouter](https://openrouter.ai/)** - AI model aggregation platform
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM for PostgreSQL
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL hosting

---

## 📞 Contact & Support

**Faisal Hakimi**  
- GitHub: [@Faisalhakimi22](https://github.com/Faisalhakimi22)
- Email: faisalhakimi22@gmail.com
- LinkedIn: [Your LinkedIn Profile]

### Reporting Issues
- Open an issue on [GitHub Issues](https://github.com/Faisalhakimi22/Market-Intelligence-Platform/issues)
- Include: 
  - Detailed description
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots (if applicable)

### Feature Requests
- Open a discussion on [GitHub Discussions](https://github.com/Faisalhakimi22/Market-Intelligence-Platform/discussions)
- Describe the feature and use case
- Explain why it would be valuable

---

## 🗺️ Roadmap

### Q1 2025 (Current)
- [x] Core market analysis dashboard
- [x] AI-powered opportunity detection
- [x] Time-series forecasting (ARIMA + Linear Regression)
- [x] Data integrations (Yahoo Finance, Google Trends, etc.)
- [x] Authentication and user management
- [ ] WebSocket real-time updates
- [ ] Export functionality (PDF, CSV, Excel)

### Q2 2025
- [ ] Mobile-responsive PWA
- [ ] Advanced sentiment analysis (news & social media)
- [ ] Industry-specific intelligence modules
- [ ] Customizable dashboard widgets
- [ ] Collaboration features (team workspaces)
- [ ] API rate limiting and caching improvements

### Q3 2025
- [ ] Mobile apps (iOS & Android with React Native)
- [ ] Machine learning personalization
- [ ] Scenario modeling and simulation
- [ ] Integration marketplace
- [ ] White-label solutions for enterprises

### Q4 2025
- [ ] Advanced ML models (LSTM, Prophet)
- [ ] Multi-language support (i18n)
- [ ] Third-party API ecosystem
- [ ] Premium subscription tiers
- [ ] Enterprise deployment options (on-premise)

---

## 📚 Additional Resources

- **[Project Report](REPORT.md)** - Comprehensive project documentation
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- **[API Documentation]** - Full API reference (coming soon)
- **[User Guide]** - End-user documentation (coming soon)

---

<div align="center">

**⭐ Star this repository if you find it useful!**

**Made with ❤️ by [Faisal Hakimi](https://github.com/Faisalhakimi22)**

*Empowering entrepreneurs with data-driven market intelligence*

</div>
