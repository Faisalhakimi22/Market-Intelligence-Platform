import { alphaVantageService } from './alpha-vantage-service';
import { financialModelingPrepService } from './financial-modeling-prep-service';
import { finnhubService } from './finnhub-service';

/**
 * Unified Market Data Service
 * 
 * This service integrates multiple external market data APIs and provides
 * a simplified interface for the application to access real market data.
 */
class MarketDataService {
  constructor() {
    // Initialize any required service configurations
  }

  /**
   * Get comprehensive company profile information
   * @param symbol - Stock symbol to look up
   */
  async getCompanyProfile(symbol: string) {
    try {
      // Try multiple sources to ensure we get data
      let profile = {};
      let success = false;
      
      try {
        const finnhubProfile = await finnhubService.getCompanyProfile(symbol);
        if (finnhubProfile && Object.keys(finnhubProfile).length > 0) {
          profile = { ...profile, ...finnhubProfile };
          success = true;
        }
      } catch (error) {
        console.log('Finnhub profile fetch failed, trying next source');
      }
      
      try {
        const fmpProfile = await financialModelingPrepService.getCompanyProfile(symbol);
        if (fmpProfile && Array.isArray(fmpProfile) && fmpProfile.length > 0) {
          profile = { ...profile, ...fmpProfile[0] };
          success = true;
        }
      } catch (error) {
        console.log('Financial Modeling Prep profile fetch failed, trying next source');
      }
      
      try {
        const avOverview = await alphaVantageService.getCompanyOverview(symbol);
        if (avOverview && Object.keys(avOverview).length > 0) {
          profile = { ...profile, ...avOverview };
          success = true;
        }
      } catch (error) {
        console.log('Alpha Vantage overview fetch failed');
      }
      
      if (!success) {
        throw new Error(`Could not retrieve company profile for ${symbol} from any data source`);
      }
      
      return profile;
    } catch (error) {
      console.error('Error in getCompanyProfile:', error);
      throw error;
    }
  }

  /**
   * Get industry peers and competitors
   * @param symbol - Stock symbol to find competitors for
   */
  async getCompetitors(symbol: string) {
    try {
      // Try multiple sources to ensure we get data
      let competitors = [];
      let success = false;
      
      try {
        const finnhubPeers = await finnhubService.getPeers(symbol);
        if (finnhubPeers && Array.isArray(finnhubPeers) && finnhubPeers.length > 0) {
          competitors = finnhubPeers;
          success = true;
        }
      } catch (error) {
        console.log('Finnhub peers fetch failed, trying next source');
      }
      
      try {
        const fmpPeers = await financialModelingPrepService.getCompanyPeers(symbol);
        if (fmpPeers && Array.isArray(fmpPeers) && fmpPeers.length > 0) {
          // Merge with existing competitors if we have any
          if (success) {
            const existingSymbols = new Set(competitors);
            for (const peer of fmpPeers) {
              if (!existingSymbols.has(peer)) {
                competitors.push(peer);
              }
            }
          } else {
            competitors = fmpPeers;
            success = true;
          }
        }
      } catch (error) {
        console.log('Financial Modeling Prep peers fetch failed');
      }
      
      if (!success) {
        throw new Error(`Could not retrieve competitors for ${symbol} from any data source`);
      }
      
      // Get detailed info for each competitor
      const competitorDetails = [];
      const processedCompetitors = competitors.slice(0, 5); // Limit to 5 competitors
      
      for (const competitorSymbol of processedCompetitors) {
        try {
          const details = await this.getBasicCompanyInfo(competitorSymbol);
          competitorDetails.push(details);
        } catch (error) {
          console.log(`Could not get details for competitor ${competitorSymbol}`);
        }
      }
      
      return competitorDetails;
    } catch (error) {
      console.error('Error in getCompetitors:', error);
      throw error;
    }
  }

  /**
   * Get basic company information (for competitors list)
   * @param symbol - Stock symbol to look up
   */
  private async getBasicCompanyInfo(symbol: string) {
    try {
      // Try multiple sources to ensure we get data
      try {
        const marketData = await financialModelingPrepService.getMarketData(symbol);
        if (marketData && Array.isArray(marketData) && marketData.length > 0) {
          const data = marketData[0] as any;
          return {
            symbol: data.symbol,
            name: data.name,
            price: data.price,
            change: data.change,
            changesPercentage: data.changesPercentage
          };
        }
      } catch (error) {
        console.log('Financial Modeling Prep market data fetch failed, trying next source');
      }
      
      try {
        const stockData = await alphaVantageService.getStockData(symbol) as any;
        if (stockData && stockData['Global Quote']) {
          const data = stockData['Global Quote'] as any;
          return {
            symbol: data['01. symbol'],
            name: symbol, // Alpha Vantage doesn't provide company name in this endpoint
            price: parseFloat(data['05. price']),
            change: parseFloat(data['09. change']),
            changesPercentage: parseFloat(data['10. change percent'].replace('%', ''))
          };
        }
      } catch (error) {
        console.log('Alpha Vantage stock data fetch failed');
      }
      
      // If we couldn't get detailed info, return a basic object with just the symbol
      return {
        symbol: symbol,
        name: symbol,
        price: null,
        change: null,
        changesPercentage: null
      };
    } catch (error) {
      console.error(`Error getting basic info for ${symbol}:`, error);
      // Return minimal info rather than failing
      return {
        symbol: symbol,
        name: symbol,
        price: null,
        change: null,
        changesPercentage: null
      };
    }
  }

  /**
   * Get industry performance metrics
   */
  async getIndustryPerformance() {
    try {
      const sectorData = await alphaVantageService.getSectorPerformance() as any;
      
      if (!sectorData || Object.keys(sectorData).length === 0) {
        throw new Error('No sector performance data available');
      }
      
      // Transform the data into a more usable format
      const sectors = [];
      
      // Alpha Vantage provides performance for different time periods
      const timeFrames = [
        'Rank A: Real-Time Performance',
        'Rank B: 1 Day Performance',
        'Rank C: 5 Day Performance',
        'Rank D: 1 Month Performance',
        'Rank E: 3 Month Performance',
      ];
      
      const selectedTimeFrame = timeFrames[0]; // Use real-time performance by default
      
      if (sectorData[selectedTimeFrame]) {
        const sectorPerformance = sectorData[selectedTimeFrame] as Record<string, string>;
        
        for (const [sector, performance] of Object.entries(sectorPerformance)) {
          const performanceValue = parseFloat((performance).replace('%', ''));
          sectors.push({
            name: sector,
            performance: performanceValue,
            trend: performanceValue >= 0 ? 'up' : 'down'
          });
        }
      }
      
      return sectors;
    } catch (error) {
      console.error('Error in getIndustryPerformance:', error);
      throw error;
    }
  }

  /**
   * Get latest market news
   */
  async getMarketNews() {
    try {
      const news = await finnhubService.getMarketNews() as any[];
      
      if (!news || !Array.isArray(news) || news.length === 0) {
        throw new Error('No market news available');
      }
      
      // Return the 10 most recent news items
      return news.slice(0, 10).map(item => ({
        id: item.id,
        title: item.headline,
        summary: item.summary,
        source: item.source,
        url: item.url,
        datetime: new Date(item.datetime * 1000).toISOString(),
        related: item.related,
        image: item.image || null
      }));
    } catch (error) {
      console.error('Error in getMarketNews:', error);
      throw error;
    }
  }

  /**
   * Get company-specific news
   * @param symbol - Stock symbol to get news for
   */
  async getCompanyNews(symbol: string) {
    try {
      const news = await finnhubService.getCompanyNews(symbol) as any[];
      
      if (!news || !Array.isArray(news) || news.length === 0) {
        throw new Error(`No news available for ${symbol}`);
      }
      
      // Return the 5 most recent company news items
      return news.slice(0, 5).map(item => ({
        id: item.id,
        title: item.headline,
        summary: item.summary,
        source: item.source,
        url: item.url,
        datetime: new Date(item.datetime * 1000).toISOString(),
        related: item.related,
        image: item.image || null
      }));
    } catch (error) {
      console.error(`Error in getCompanyNews for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get upcoming economic events
   */
  async getEconomicEvents() {
    try {
      const events = await finnhubService.getEconomicCalendar() as any;
      
      if (!events || !events.economicCalendar || !Array.isArray(events.economicCalendar.events)) {
        throw new Error('No economic events available');
      }
      
      // Return the 10 most significant upcoming events
      return events.economicCalendar.events
        .filter((event: any) => event.impact === 'high') // Filter to high-impact events
        .slice(0, 10)
        .map((event: any) => ({
          id: `${event.country}-${event.time}-${event.event}`,
          country: event.country,
          event: event.event,
          impact: event.impact,
          datetime: event.time,
          estimate: event.estimate,
          actual: event.actual,
          previous: event.prev
        }));
    } catch (error) {
      console.error('Error in getEconomicEvents:', error);
      throw error;
    }
  }
}

export const marketDataService = new MarketDataService();
