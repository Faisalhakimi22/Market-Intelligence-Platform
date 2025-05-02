import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Yahoo Finance service for retrieving stock and market data
 * Uses yfinance Python package via Node.js child process
 */
class YahooFinanceService {
  /**
   * Get stock data for a specific symbol
   * @param symbol - The stock symbol (e.g., AAPL, MSFT)
   * @param period - Time period for historical data (e.g., 1d, 1mo, 3mo, 1y, max)
   */
  async getStockData(symbol: string, period: string = '1mo') {
    try {
      const { stdout, stderr } = await execAsync(`python scripts/yahoo_finance.py stock ${symbol} ${period}`);
      
      if (stderr) {
        console.error('Error executing Yahoo Finance script:', stderr);
        throw new Error('Failed to fetch stock data');
      }
      
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Yahoo Finance stock data error:', error);
      throw new Error('Failed to fetch stock data');
    }
  }
  
  /**
   * Get market summary including major indices
   */
  async getMarketSummary() {
    try {
      const { stdout, stderr } = await execAsync('python scripts/yahoo_finance.py market');
      
      if (stderr) {
        console.error('Error executing Yahoo Finance script:', stderr);
        throw new Error('Failed to fetch market summary');
      }
      
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Yahoo Finance market summary error:', error);
      throw new Error('Failed to fetch market summary');
    }
  }
  
  /**
   * Get industry sector performance
   */
  async getIndustryPerformance() {
    try {
      const { stdout, stderr } = await execAsync('python scripts/yahoo_finance.py sectors');
      
      if (stderr) {
        console.error('Error executing Yahoo Finance script:', stderr);
        throw new Error('Failed to fetch industry performance');
      }
      
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Yahoo Finance industry performance error:', error);
      throw new Error('Failed to fetch industry performance');
    }
  }
  
  /**
   * Search for stocks based on query
   * @param query - Search query string
   * @param limit - Maximum number of results to return
   */
  async searchStocks(query: string, limit: number = 10) {
    try {
      const { stdout, stderr } = await execAsync(`python scripts/yahoo_finance.py search "${query}" ${limit}`);
      
      if (stderr) {
        console.error('Error executing Yahoo Finance script:', stderr);
        throw new Error('Failed to search stocks');
      }
      
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Yahoo Finance stock search error:', error);
      throw new Error('Failed to search stocks');
    }
  }
}

export const yahooFinanceService = new YahooFinanceService();
