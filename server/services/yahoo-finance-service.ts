import { spawn } from 'child_process';
import path from 'path';

/**
 * Yahoo Finance service for retrieving stock and market data
 * Uses the yfinance Python library via child process
 */
class YahooFinanceService {
  /**
   * Get stock data for a specific symbol
   * 
   * @param symbol - Stock symbol like 'AAPL', 'MSFT'
   * @param period - Time period for data ('1d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
   * @returns Promise with stock data including price history and company info
   */
  async getStockData(symbol: string, period: string = '1mo') {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'yahoo_finance.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [
          scriptPath,
          'get_stock_data',
          symbol,
          period
        ]);
        
        let dataString = '';
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
          reject(new Error(`Error getting stock data: ${data}`));
        });
        
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            return reject(new Error(`Process exited with code ${code}`));
          }
          
          try {
            const result = JSON.parse(dataString);
            resolve(result);
          } catch (error) {
            reject(new Error(`Error parsing Python output: ${error.message}`));
          }
        });
      });
    } catch (error) {
      console.error('Error in getStockData:', error);
      throw error;
    }
  }
  
  /**
   * Get market summary information (major indices)
   * 
   * @returns Promise with current market indices data
   */
  async getMarketSummary() {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'yahoo_finance.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [
          scriptPath,
          'get_market_summary'
        ]);
        
        let dataString = '';
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
          reject(new Error(`Error getting market summary: ${data}`));
        });
        
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            return reject(new Error(`Process exited with code ${code}`));
          }
          
          try {
            const result = JSON.parse(dataString);
            resolve(result);
          } catch (error) {
            reject(new Error(`Error parsing Python output: ${error.message}`));
          }
        });
      });
    } catch (error) {
      console.error('Error in getMarketSummary:', error);
      throw error;
    }
  }
  
  /**
   * Get performance by industry sector
   * 
   * @returns Promise with sector performance data
   */
  async getIndustryPerformance() {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'yahoo_finance.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [
          scriptPath,
          'get_industry_performance'
        ]);
        
        let dataString = '';
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
          reject(new Error(`Error getting industry performance: ${data}`));
        });
        
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            return reject(new Error(`Process exited with code ${code}`));
          }
          
          try {
            const result = JSON.parse(dataString);
            resolve(result);
          } catch (error) {
            reject(new Error(`Error parsing Python output: ${error.message}`));
          }
        });
      });
    } catch (error) {
      console.error('Error in getIndustryPerformance:', error);
      throw error;
    }
  }
  
  /**
   * Search for stocks based on query
   * 
   * @param query - Search term to find matching stocks
   * @param limit - Maximum number of results to return
   * @returns Promise with matching stock symbols and company names
   */
  async searchStocks(query: string, limit: number = 10) {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'yahoo_finance.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [
          scriptPath,
          'search_stocks',
          query,
          limit.toString()
        ]);
        
        let dataString = '';
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
          reject(new Error(`Error searching stocks: ${data}`));
        });
        
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            return reject(new Error(`Process exited with code ${code}`));
          }
          
          try {
            const result = JSON.parse(dataString);
            resolve(result);
          } catch (error) {
            reject(new Error(`Error parsing Python output: ${error.message}`));
          }
        });
      });
    } catch (error) {
      console.error('Error in searchStocks:', error);
      throw error;
    }
  }
}

export const yahooFinanceService = new YahooFinanceService();
