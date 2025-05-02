import { yahooFinanceService } from './yahoo-finance-service';
import { googleTrendsService } from './google-trends-service';

/**
 * Data Integration Service combines data from multiple sources
 * to provide comprehensive market intelligence
 */
class DataIntegrationService {
  /**
   * Get stock data with enhanced trends information
   * @param symbol - Stock symbol (e.g., AAPL, MSFT)
   * @param period - Time period for historical data
   */
  async getEnhancedStockData(symbol: string, period: string = '1mo') {
    try {
      // Get stock data from Yahoo Finance
      const stockData = await yahooFinanceService.getStockData(symbol, period);
      
      if (stockData.status !== 'success') {
        throw new Error(`Failed to fetch stock data for ${symbol}`);
      }
      
      let companyName = '';
      if (stockData.info && stockData.info.shortName) {
        companyName = stockData.info.shortName;
      }
      
      // Get related Google Trends data if we have company name
      let trendsData = null;
      if (companyName) {
        try {
          const trends = await googleTrendsService.getInterestOverTime([companyName], 'today 12-m');
          if (trends.status === 'success') {
            trendsData = trends.data;
          }
        } catch (error) {
          console.error(`Google Trends error for ${companyName}:`, error);
          // Continue even if trends data fails
        }
      }
      
      return {
        status: 'success',
        stockData: stockData.info,
        history: stockData.history,
        trends: trendsData
      };
    } catch (error) {
      console.error('Enhanced stock data error:', error);
      throw error;
    }
  }
  
  /**
   * Get industry performance with trend insights
   */
  async getIndustryPerformanceWithTrends() {
    try {
      // Get industry performance data from Yahoo Finance
      const industryPerformance = await yahooFinanceService.getIndustryPerformance();
      
      if (industryPerformance.status !== 'success') {
        throw new Error('Failed to fetch industry performance');
      }
      
      // Extract industry names
      const industryNames = industryPerformance.data.map(sector => sector.sector);
      
      // Get Google Trends data for industries
      let trendsData = null;
      try {
        // Limit to 5 industries to avoid exceeding Google Trends limits
        const limitedIndustries = industryNames.slice(0, 5);
        const trends = await googleTrendsService.getIndustryInterest(limitedIndustries, 'today 12-m', 'US');
        if (trends.status === 'success') {
          trendsData = trends.data;
        }
      } catch (error) {
        console.error('Google Trends industry interest error:', error);
        // Continue even if trends data fails
      }
      
      return {
        status: 'success',
        date: industryPerformance.date,
        performance: industryPerformance.data,
        trends: trendsData
      };
    } catch (error) {
      console.error('Industry performance with trends error:', error);
      throw error;
    }
  }
  
  /**
   * Get market overview combining multiple data sources
   */
  async getMarketOverview() {
    try {
      // Get market summary from Yahoo Finance
      const marketSummary = await yahooFinanceService.getMarketSummary();
      
      if (marketSummary.status !== 'success') {
        throw new Error('Failed to fetch market summary');
      }
      
      // Get trending searches as additional market insight
      let trendingSearches = null;
      try {
        const trending = await googleTrendsService.getTrendingSearches('US');
        if (trending.status === 'success') {
          trendingSearches = trending.data;
        }
      } catch (error) {
        console.error('Trending searches error:', error);
        // Continue even if trending searches fails
      }
      
      return {
        status: 'success',
        date: new Date().toISOString().split('T')[0],
        indices: marketSummary.data,
        trendingSearches: trendingSearches
      };
    } catch (error) {
      console.error('Market overview error:', error);
      throw error;
    }
  }
  
  /**
   * Get opportunity suggestions based on market data and trends
   * @param industry - Industry to focus on
   */
  async getOpportunitySuggestions(industry: string) {
    try {
      // Get related queries for the industry from Google Trends
      const relatedQueries = await googleTrendsService.getRelatedQueries(industry, 'today 12-m');
      
      if (relatedQueries.status !== 'success') {
        throw new Error(`Failed to fetch related queries for ${industry}`);
      }
      
      // Get related topics for the industry from Google Trends
      const relatedTopics = await googleTrendsService.getRelatedTopics(industry, 'today 12-m');
      
      if (relatedTopics.status !== 'success') {
        throw new Error(`Failed to fetch related topics for ${industry}`);
      }
      
      // Combine data to identify opportunity areas
      const opportunities = [];
      
      // Process rising queries if available
      if (relatedQueries.data.rising && relatedQueries.data.rising.length > 0) {
        for (const query of relatedQueries.data.rising) {
          opportunities.push({
            type: 'trending_query',
            name: query.query,
            growth: query.value,
            source: 'Google Trends'
          });
        }
      }
      
      // Process rising topics if available
      if (relatedTopics.data.rising && relatedTopics.data.rising.length > 0) {
        for (const topic of relatedTopics.data.rising) {
          if (topic.topic_title) {
            opportunities.push({
              type: 'trending_topic',
              name: topic.topic_title,
              growth: topic.value,
              source: 'Google Trends'
            });
          }
        }
      }
      
      return {
        status: 'success',
        industry,
        date: new Date().toISOString().split('T')[0],
        opportunities
      };
    } catch (error) {
      console.error('Opportunity suggestions error:', error);
      throw error;
    }
  }
}

export const dataIntegrationService = new DataIntegrationService();
