import React from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import YahooFinanceWidget from '@/components/market-data/yahoo-finance-widget';
import GoogleTrendsWidget from '@/components/market-data/google-trends-widget';
import OpportunitySuggestionsWidget from '@/components/market-data/opportunity-suggestions-widget';
import { Database, TrendingUp, Lightbulb } from 'lucide-react';

export default function DataIntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Integrations</h2>
          <p className="text-muted-foreground">
            Explore real-time market data from multiple sources.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="yahoo" className="mt-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="yahoo" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Stock Data</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trend Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Opportunities</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="mt-4">
          <TabsContent value="yahoo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yahoo Finance Integration</CardTitle>
                <CardDescription>
                  Real-time stock and market data powered by the yfinance Python library.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This integration uses the Yahoo Finance API via the yfinance Python library to provide real-time stock data,
                  company information, and historical price charts without requiring an API key.
                </p>
                <YahooFinanceWidget initialSymbol="AAPL" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Google Trends Integration</CardTitle>
                <CardDescription>
                  Track keyword interest over time using Google Trends data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This integration uses the unofficial Google Trends API via the pytrends Python library to track
                  keyword popularity and identify emerging trends. This is valuable for opportunity detection and
                  market research.
                </p>
                <GoogleTrendsWidget initialKeywords={['artificial intelligence', 'machine learning']} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Insights</CardTitle>
                <CardDescription>
                  AI-powered market opportunity detection using search trend data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This feature combines Google Trends data with AI analysis to identify potential market opportunities
                  in various industries. It looks for rapidly growing search queries and related topics that may
                  indicate emerging market demands or shifts in consumer interest.
                </p>
                <OpportunitySuggestionsWidget initialIndustry="Technology" />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </DashboardLayout>
  );
}
