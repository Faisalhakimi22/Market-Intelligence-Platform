import OpenAI from 'openai';

interface MarketTrend {
  name: string;
  growth: string;
  direction: string;
}

interface IndustryInsights {
  title: string;
  description: string;
  trends: MarketTrend[];
  optimalTimeToEnter?: string;
}

class OpenRouterService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
    });
  }

  private async queryOpenRouter(prompt: string) {
    try {
      const headers = {
        "HTTP-Referer": "https://marketinsight-ai.replit.app",
        "X-Title": "MarketInsight AI"
      };
      
      const completion = await this.client.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert market analyst providing accurate and detailed market intelligence. Return answers as structured JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      }, { headers });

      const content = completion.choices[0].message.content;
      return content ? JSON.parse(content) : {};
    } catch (error: any) {
      console.error('Error querying OpenRouter API:', error);
      throw new Error(`OpenRouter API Error: ${error.message}`);
    }
  }

  async getIndustryInsights(industry: string): Promise<IndustryInsights> {
    const prompt = `Provide comprehensive market intelligence about the ${industry} industry in JSON format. Include:
    1. A title summarizing the key market opportunity
    2. A detailed description of this opportunity (150-200 words)
    3. An array of the top 3 market trends, each with a name, growth percentage, and direction (up/down)
    4. The optimal quarter to enter this market (Q1-Q4 2024 or Q1 2025)

    Format the response as valid JSON with these fields: title, description, trends (array of objects with name, growth, direction), and optimalTimeToEnter.`;

    return await this.queryOpenRouter(prompt);
  }

  async getCompetitorAnalysis(industry: string, competitorName?: string): Promise<any> {
    const prompt = competitorName
      ? `Provide a detailed analysis of ${competitorName} in the ${industry} industry. Include their market position, strengths, weaknesses, and current strategies.`
      : `Identify and analyze the top 3 competitors in the ${industry} industry. For each, provide their market position, strengths, weaknesses, and current strategies.`;

    return await this.queryOpenRouter(prompt);
  }

  async getMarketOpportunities(industry: string): Promise<any> {
    const prompt = `Identify and analyze 3 emerging market opportunities in the ${industry} industry. For each opportunity, provide a title, description, estimated market size, growth potential, and key success factors.`;

    return await this.queryOpenRouter(prompt);
  }

  async getMarketForecasts(industry: string): Promise<any> {
    const prompt = `Provide market forecasts for the ${industry} industry for the next 2 years. Include projected market size, growth rates, emerging trends, potential disruptions, and recommendations for businesses.`;

    return await this.queryOpenRouter(prompt);
  }

  async getTrendAnalysis(industry: string): Promise<any> {
    const prompt = `Analyze the current trends in the ${industry} industry. Identify the top 5 trends, their impact on the market, and their expected trajectory over the next 12-24 months.`;

    return await this.queryOpenRouter(prompt);
  }
}

// Use environment variable for the API key
const apiKey = process.env.OPENROUTER_API_KEY || '';
if (!apiKey) {
  console.warn('WARNING: OPENROUTER_API_KEY environment variable is not set');
}

export const openRouterService = new OpenRouterService(apiKey);
