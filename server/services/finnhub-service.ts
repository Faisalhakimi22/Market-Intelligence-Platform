import fetch from 'node-fetch';

/**
 * Finnhub API service for retrieving real-time market data and news
 * 
 * Finnhub offers real-time market data including news, economic calendar,
 * company profiles, industry trends, and financial statements.
 */
class FinnhubService {
  private baseUrl: string = 'https://finnhub.io/api/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Get real-time news for a company
   * @param symbol - The stock symbol to get news for
   */
  async getCompanyNews(symbol: string) {
    try {
      // Calculate date range for last 7 days
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      // Format dates as YYYY-MM-DD
      const fromDate = lastWeek.toISOString().split('T')[0];
      const toDate = today.toISOString().split('T')[0];
      
      const url = `${this.baseUrl}/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${this.apiKey}`;
      console.log(`Fetching company news for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Finnhub API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching company news:', error);
      throw error;
    }
  }
  
  /**
   * Get industry news by sector
   */
  async getMarketNews() {
    try {
      const url = `${this.baseUrl}/news?category=general&token=${this.apiKey}`;
      console.log('Fetching market news');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Finnhub API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching market news:', error);
      throw error;
    }
  }
  
  /**
   * Get company industry classification and information
   * @param symbol - The stock symbol to look up
   */
  async getCompanyProfile(symbol: string) {
    try {
      const url = `${this.baseUrl}/stock/profile2?symbol=${symbol}&token=${this.apiKey}`;
      console.log(`Fetching company profile for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Finnhub API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }
  }
  
  /**
   * Get industry peers for a specific company
   * @param symbol - The stock symbol to find peers for
   */
  async getPeers(symbol: string) {
    try {
      const url = `${this.baseUrl}/stock/peers?symbol=${symbol}&token=${this.apiKey}`;
      console.log(`Fetching industry peers for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Finnhub API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching peers:', error);
      throw error;
    }
  }
  
  /**
   * Get company recommendations and investor sentiment
   * @param symbol - The stock symbol to get recommendations for
   */
  async getRecommendations(symbol: string) {
    try {
      const url = `${this.baseUrl}/stock/recommendation?symbol=${symbol}&token=${this.apiKey}`;
      console.log(`Fetching recommendations for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Finnhub API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  /**
   * Get upcoming economic calendar events
   */
  async getEconomicCalendar() {
    try {
      // Get economic events for next month
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setDate(nextMonth.getDate() + 30);
      
      // Format dates as YYYY-MM-DD
      const fromDate = today.toISOString().split('T')[0];
      const toDate = nextMonth.toISOString().split('T')[0];
      
      const url = `${this.baseUrl}/calendar/economic?from=${fromDate}&to=${toDate}&token=${this.apiKey}`;
      console.log('Fetching economic calendar');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Finnhub API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      throw error;
    }
  }
}

// Check for API key in environment
const apiKey = process.env.FINNHUB_API_KEY || '';
if (!apiKey) {
  console.warn('WARNING: FINNHUB_API_KEY environment variable is not set');
}

export const finnhubService = new FinnhubService(apiKey);
