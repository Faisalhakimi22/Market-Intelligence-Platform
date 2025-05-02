import fetch from 'node-fetch';

/**
 * Alpha Vantage API service for retrieving market data
 * 
 * Alpha Vantage provides real-time and historical stock market data, 
 * forex data, cryptocurrency data, technical indicators, and economic data.
 */
class AlphaVantageService {
  private baseUrl: string = 'https://www.alphavantage.co/query';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Fetches stock market data for a symbol
   * @param symbol - The stock symbol to get data for (e.g., AAPL, MSFT)
   */
  async getStockData(symbol: string) {
    try {
      const url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
      console.log(`Fetching stock data for symbol: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Alpha Vantage API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  }
  
  /**
   * Fetches sector performance data
   * Returns performance of all sectors in the market
   */
  async getSectorPerformance() {
    try {
      const url = `${this.baseUrl}?function=SECTOR&apikey=${this.apiKey}`;
      console.log('Fetching sector performance data');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Alpha Vantage API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching sector performance:', error);
      throw error;
    }
  }
  
  /**
   * Fetches economic indicator data
   * @param indicator - The economic indicator (GDP, INFLATION, etc.)
   */
  async getEconomicIndicator(indicator: string) {
    try {
      const url = `${this.baseUrl}?function=${indicator}&interval=annual&apikey=${this.apiKey}`;
      console.log(`Fetching economic indicator data for: ${indicator}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Alpha Vantage API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching economic indicator:', error);
      throw error;
    }
  }
  
  /**
   * Search for companies matching a keyword
   * @param keywords - Search terms for finding companies
   */
  async searchCompanies(keywords: string) {
    try {
      const url = `${this.baseUrl}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${this.apiKey}`;
      console.log(`Searching companies with keywords: ${keywords}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Alpha Vantage API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
  }

  /**
   * Gets company overview data including fundamentals
   * @param symbol - The stock symbol to get data for
   */
  async getCompanyOverview(symbol: string) {
    try {
      const url = `${this.baseUrl}?function=OVERVIEW&symbol=${symbol}&apikey=${this.apiKey}`;
      console.log(`Fetching company overview for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Alpha Vantage API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching company overview:', error);
      throw error;
    }
  }
}

// Check for API key in environment
const apiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
if (!apiKey) {
  console.warn('WARNING: ALPHA_VANTAGE_API_KEY environment variable is not set');
}

export const alphaVantageService = new AlphaVantageService(apiKey);
