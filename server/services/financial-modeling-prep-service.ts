import fetch from 'node-fetch';

/**
 * Financial Modeling Prep API service for retrieving company financial data
 * 
 * Financial Modeling Prep offers data on financial statements, stock prices,
 * company profiles, financial ratios, market indices, and more.
 */
class FinancialModelingPrepService {
  private baseUrl: string = 'https://financialmodelingprep.com/api/v3';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Get company profile information
   * @param symbol - The stock symbol to look up
   */
  async getCompanyProfile(symbol: string) {
    try {
      const url = `${this.baseUrl}/profile/${symbol}?apikey=${this.apiKey}`;
      console.log(`Fetching company profile for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Financial Modeling Prep API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }
  }
  
  /**
   * Get company financial ratios
   * @param symbol - The stock symbol to look up
   */
  async getFinancialRatios(symbol: string) {
    try {
      const url = `${this.baseUrl}/ratios/${symbol}?apikey=${this.apiKey}`;
      console.log(`Fetching financial ratios for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Financial Modeling Prep API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching financial ratios:', error);
      throw error;
    }
  }
  
  /**
   * Get company financial statements (income statement, balance sheet, cash flow)
   * @param symbol - The stock symbol to look up
   * @param statement - The statement type ('income-statement', 'balance-sheet-statement', 'cash-flow-statement')
   */
  async getFinancialStatements(symbol: string, statement: string) {
    try {
      const url = `${this.baseUrl}/${statement}/${symbol}?apikey=${this.apiKey}`;
      console.log(`Fetching ${statement} for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Financial Modeling Prep API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${statement}:`, error);
      throw error;
    }
  }
  
  /**
   * Get industry analysis data for a specific company
   * @param symbol - The stock symbol to find peers for
   */
  async getCompanyPeers(symbol: string) {
    try {
      const url = `${this.baseUrl}/company-peer/${symbol}?apikey=${this.apiKey}`;
      console.log(`Fetching company peers for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Financial Modeling Prep API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching company peers:', error);
      throw error;
    }
  }
  
  /**
   * Get industry classification data
   */
  async getIndustries() {
    try {
      const url = `${this.baseUrl}/stock-screener?apikey=${this.apiKey}`;
      console.log('Fetching industry classification data');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Financial Modeling Prep API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching industries:', error);
      throw error;
    }
  }
  
  /**
   * Get basic market data (stock price, etc.)
   * @param symbol - The stock symbol to get market data for
   */
  async getMarketData(symbol: string) {
    try {
      const url = `${this.baseUrl}/quote/${symbol}?apikey=${this.apiKey}`;
      console.log(`Fetching market data for: ${symbol}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Financial Modeling Prep API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }
}

// Check for API key in environment
const apiKey = process.env.FINANCIAL_MODELING_PREP_API_KEY || '';
if (!apiKey) {
  console.warn('WARNING: FINANCIAL_MODELING_PREP_API_KEY environment variable is not set');
}

export const financialModelingPrepService = new FinancialModelingPrepService(apiKey);
