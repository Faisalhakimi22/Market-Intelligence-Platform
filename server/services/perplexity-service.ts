import fetch from 'node-fetch';

type PerplexityMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

interface PerplexityOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  search_domain_filter?: string[];
  search_recency_filter?: string;
  stream?: boolean;
}

export class PerplexityService {
  private apiKey: string;
  private baseUrl: string = 'https://api.perplexity.ai/chat/completions';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async queryPerplexity(messages: PerplexityMessage[], options: PerplexityOptions = {}) {
    const defaultOptions = {
      model: "llama-3.1-sonar-small-128k-online",
      temperature: 0.2,
      max_tokens: 1024,
      search_domain_filter: [],
      search_recency_filter: "month",
      stream: false,
    };
    
    const requestOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: requestOptions.model,
          messages,
          temperature: requestOptions.temperature,
          max_tokens: requestOptions.max_tokens,
          search_domain_filter: requestOptions.search_domain_filter,
          search_recency_filter: requestOptions.search_recency_filter,
          stream: requestOptions.stream,
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Perplexity API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error querying Perplexity API:', error);
      throw error;
    }
  }
  
  async getIndustryInsights(industry: string) {
    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a market intelligence expert providing concise, data-driven insights for entrepreneurs and business leaders. Focus on current market trends, competitive landscape, opportunities, and risks. Use up-to-date information and include specific metrics where available."
      },
      {
        role: "user",
        content: `Provide a comprehensive analysis of the current state of the ${industry} industry. Include:
        1. Major market trends and recent developments
        2. Key growth opportunities and white spaces
        3. Significant challenges and risks
        4. Technological innovations and disruptions
        5. Regulatory changes affecting the industry
        Format the response as detailed paragraphs with headings.
        `
      }
    ];
    
    return this.queryPerplexity(messages, {
      temperature: 0.2,
      search_recency_filter: "month"
    });
  }
  
  async getCompetitorAnalysis(industry: string, competitorName?: string) {
    const competitorQuery = competitorName ? 
      `Analyze ${competitorName} in the ${industry} industry:` : 
      `Identify and analyze the top 5 companies in the ${industry} industry:`;
    
    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a competitive intelligence expert with deep knowledge of market dynamics, company strategies, and industry analysis. Provide detailed, data-driven insights about competitors."
      },
      {
        role: "user",
        content: `${competitorQuery}
        1. Market position and share (with percentages if available)
        2. Key strengths and weaknesses
        3. Recent strategic moves and acquisitions
        4. Growth rate and financial performance indicators
        5. Primary products/services and their differentiation
        Format as a structured analysis with specific metrics where possible.
        `
      }
    ];
    
    return this.queryPerplexity(messages, {
      temperature: 0.2,
      search_recency_filter: "month"
    });
  }
  
  async getMarketOpportunities(industry: string) {
    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a strategic business consultant who specializes in identifying valuable market opportunities. Focus on providing actionable insights backed by market data and trends."
      },
      {
        role: "user",
        content: `Identify 5 specific high-potential business opportunities in the ${industry} industry:
        1. Describe each opportunity in detail
        2. Estimate market size and growth potential
        3. Outline the target customer segments
        4. Explain why this is timely now
        5. Suggest a potential business model
        6. List key challenges to overcome
        Format as 5 separate opportunities, each with a clear name/title and structured analysis.
        `
      }
    ];
    
    return this.queryPerplexity(messages, {
      temperature: 0.3,
      search_recency_filter: "month"
    });
  }
  
  async getMarketForecasts(industry: string) {
    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a market forecasting expert who specializes in predicting industry trends using data-driven analysis and pattern recognition. Provide forward-looking insights with statistical backing where possible."
      },
      {
        role: "user",
        content: `Provide a market forecast for the ${industry} industry:
        1. Project growth rate over the next 1-3 years with specific percentages
        2. Identify key drivers of growth or contraction
        3. Predict upcoming trends that will shape the industry
        4. Highlight potential disruptive factors or risks
        5. Suggest how market participants should prepare strategically
        Format as a comprehensive forecast with clear sections and quantitative predictions where possible.
        `
      }
    ];
    
    return this.queryPerplexity(messages, {
      temperature: 0.2,
      search_recency_filter: "month"
    });
  }
  
  async getTrendAnalysis(industry: string) {
    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a trend analyst who specializes in identifying and explaining meaningful patterns across industries. Focus on evidence-based insights and provide context about the significance of each trend."
      },
      {
        role: "user",
        content: `Analyze the most significant current trends in the ${industry} industry:
        1. Identify 5-7 key trends with specific examples
        2. For each trend, explain:
           - What's driving this trend
           - Current stage of adoption (early, mainstream, mature)
           - Expected longevity and future direction
           - Impact on business models and operations
           - Companies successfully capitalizing on this trend
        Format as separate trend sections with clear headings and structured analysis.
        `
      }
    ];
    
    return this.queryPerplexity(messages, {
      temperature: 0.2,
      search_recency_filter: "month"
    });
  }
}

// Create a singleton instance with the API key
const apiKey = process.env.PERPLEXITY_API_KEY || '';
if (!apiKey) {
  console.warn('PERPLEXITY_API_KEY not set. Real-time market intelligence will not function properly.');
}

export const perplexityService = new PerplexityService(apiKey);
