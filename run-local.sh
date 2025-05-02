#!/bin/bash

# Set up environment (example - modify as needed)
echo "Setting up environment..."

# Check for Node.js and npm
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js (v16+)"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm"
    exit 1
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python (v3.8+)"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Check for Python dependencies
echo "Making sure Python dependencies are installed..."
pip3 install pandas pytrends requests yfinance

# Check for .env file
if [ ! -f ".env" ]; then
    echo "Creating sample .env file..."
    echo "# Database connection
DATABASE_URL=postgresql://username:password@localhost:5432/market_intelligence

# API Keys
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FINANCIAL_MODELING_PREP_API_KEY=your_financial_modeling_prep_key
FINNHUB_API_KEY=your_finnhub_key
OPENROUTER_API_KEY=your_openrouter_key
PERPLEXITY_API_KEY=your_perplexity_key" > .env
    echo "Please edit the .env file with your actual credentials"
fi

# Run the application
echo "Starting the application..."
npm run dev
