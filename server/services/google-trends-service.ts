import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Google Trends service for retrieving keyword interest and trend data
 * Uses pytrends Python package via Node.js child process
 */
class GoogleTrendsService {
  /**
   * Get interest over time for keywords
   * @param keywords - Array of keywords to track
   * @param period - Time period (e.g., 'today 5-y', 'today 12-m', 'today 3-m', 'today 1-m')
   */
  async getInterestOverTime(keywords: string[], period: string = 'today 12-m') {
    try {
      const keywordsString = keywords.join(',');
      const { stdout, stderr } = await execAsync(`python scripts/google_trends.py interest "${keywordsString}" "${period}"`);
      
      if (stderr) {
        console.error('Error executing Google Trends script:', stderr);
        throw new Error('Failed to fetch interest over time');
      }
      
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Google Trends interest over time error:', error);
      throw new Error('Failed to fetch interest over time');
    }
  }
  
  /**
   * Get related queries for a keyword
   * @param keyword - Keyword to find related queries for
   * @param period - Time period (e.g., 'today 5-y', 'today 12-m', 'today 3-m', 'today 1-m')
   */
  async getRelatedQueries(keyword: string, period: string = 'today 12-m') {
    try {
      const { stdout, stderr } = await execAsync(`python scripts/google_trends.py related_queries "${keyword}" "${period}"`);
      
      if (stderr) {
        console.error('Error executing Google Trends script:', stderr);
        throw new Error('Failed to fetch related queries');
      }
      
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Google Trends related queries error:', error);
      throw new Error('Failed to fetch related queries');
    }
  }
  
  /**
   * Get related topics for a keyword
   * @param keyword - Keyword to find related topics for
   * @param period - Time period (e.g., 'today 5-y', 'today 12-m', 'today 3-m', 'today 1-m')
   */
  async getRelatedTopics(keyword: string, period: string = 'today 12-m') {
    try {
      const { stdout, stderr } = await execAsync(`python scripts/google_trends.py related_topics "${keyword}" "${period}"`);
      
      if (stderr) {
        console.error('Error executing Google Trends script:', stderr);
        throw new Error('Failed to fetch related topics');
      }
      
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Google Trends related topics error:', error);
      throw new Error('Failed to fetch related topics');
    }
  }
  
  /**
   * Get trending searches for a region
   * @param geo - Geographic region (e.g., 'US', 'GB', 'FR', etc.)
   */
  async getTrendingSearches(geo: string = 'US') {
    try {
      const { stdout, stderr } = await execAsync(`python scripts/google_trends.py trending "${geo}"`);
      
      if (stderr) {
        console.error('Error executing Google Trends script:', stderr);
        throw new Error('Failed to fetch trending searches');
      }
      
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Google Trends trending searches error:', error);
      throw new Error('Failed to fetch trending searches');
    }
  }
  
  /**
   * Get interest for industry-related keywords
   * @param industryKeywords - Array of industry-related keywords
   * @param period - Time period (e.g., 'today 5-y', 'today 12-m', 'today 3-m', 'today 1-m')
   * @param region - Geographic region (e.g., 'US', 'GB', 'FR', etc.)
   */
  async getIndustryInterest(industryKeywords: string[], period: string = 'today 12-m', region: string = 'US') {
    try {
      const keywordsString = industryKeywords.join(',');
      const { stdout, stderr } = await execAsync(`python scripts/google_trends.py industry "${keywordsString}" "${period}" "${region}"`);
      
      if (stderr) {
        console.error('Error executing Google Trends script:', stderr);
        throw new Error('Failed to fetch industry interest');
      }
      
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Google Trends industry interest error:', error);
      throw new Error('Failed to fetch industry interest');
    }
  }
}

export const googleTrendsService = new GoogleTrendsService();
