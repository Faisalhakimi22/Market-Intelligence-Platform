import { spawn } from 'child_process';
import path from 'path';

/**
 * Google Trends service for retrieving search interest data
 * Uses the pytrends Python library via child process
 */
class GoogleTrendsService {
  /**
   * Get interest over time for a list of keywords
   * 
   * @param keywords - Array of keywords to track interest for
   * @param period - Time period ('today 1-m', 'today 3-m', 'today 12-m', 'today 5-y', 'all')
   * @returns Promise with time series data of search interest
   */
  async getInterestOverTime(keywords: string[], period: string = 'today 12-m') {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'google_trends.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [
          scriptPath,
          'get_interest_over_time',
          JSON.stringify(keywords),
          period
        ]);
        
        let dataString = '';
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
          reject(new Error(`Error getting interest over time: ${data}`));
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
      console.error('Error in getInterestOverTime:', error);
      throw error;
    }
  }
  
  /**
   * Get related queries for a keyword
   * 
   * @param keyword - Keyword to find related queries for
   * @param period - Time period ('today 1-m', 'today 3-m', 'today 12-m', 'today 5-y', 'all')
   * @returns Promise with related search queries
   */
  async getRelatedQueries(keyword: string, period: string = 'today 12-m') {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'google_trends.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [
          scriptPath,
          'get_related_queries',
          keyword,
          period
        ]);
        
        let dataString = '';
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
          reject(new Error(`Error getting related queries: ${data}`));
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
      console.error('Error in getRelatedQueries:', error);
      throw error;
    }
  }
  
  /**
   * Get related topics for a keyword
   * 
   * @param keyword - Keyword to find related topics for
   * @param period - Time period ('today 1-m', 'today 3-m', 'today 12-m', 'today 5-y', 'all')
   * @returns Promise with related topics
   */
  async getRelatedTopics(keyword: string, period: string = 'today 12-m') {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'google_trends.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [
          scriptPath,
          'get_related_topics',
          keyword,
          period
        ]);
        
        let dataString = '';
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
          reject(new Error(`Error getting related topics: ${data}`));
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
      console.error('Error in getRelatedTopics:', error);
      throw error;
    }
  }
  
  /**
   * Get trending searches for a region
   * 
   * @param geo - Geographic region (e.g., 'US', 'GB')
   * @returns Promise with current trending searches
   */
  async getTrendingSearches(geo: string = 'US') {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'google_trends.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [
          scriptPath,
          'get_trending_searches',
          geo
        ]);
        
        let dataString = '';
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
          reject(new Error(`Error getting trending searches: ${data}`));
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
      console.error('Error in getTrendingSearches:', error);
      throw error;
    }
  }
  
  /**
   * Get interest for industry-related keywords
   * 
   * @param industryKeywords - Array of keywords related to an industry
   * @param period - Time period ('today 1-m', 'today 3-m', 'today 12-m', 'today 5-y', 'all')
   * @param region - Geographic region (e.g., 'US', 'GB')
   * @returns Promise with industry trend data
   */
  async getIndustryInterest(industryKeywords: string[], period: string = 'today 12-m', region: string = 'US') {
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'google_trends.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [
          scriptPath,
          'get_industry_interest',
          JSON.stringify(industryKeywords),
          period,
          region
        ]);
        
        let dataString = '';
        
        pythonProcess.stdout.on('data', (data) => {
          dataString += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
          reject(new Error(`Error getting industry interest: ${data}`));
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
      console.error('Error in getIndustryInterest:', error);
      throw error;
    }
  }
}

export const googleTrendsService = new GoogleTrendsService();
