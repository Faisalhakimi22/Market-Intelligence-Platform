import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Opportunity {
  type: string;
  name: string;
  growth: string | number;
  source: string;
}

interface OpportunitySuggestionsWidgetProps {
  initialIndustry?: string;
}

export default function OpportunitySuggestionsWidget({ initialIndustry = 'Technology' }: OpportunitySuggestionsWidgetProps) {
  const [industry, setIndustry] = useState(initialIndustry);
  const [searchIndustry, setSearchIndustry] = useState(initialIndustry);
  const { toast } = useToast();
  
  const { data, isLoading, isError, error, refetch } = useQuery<{ status: string; industry: string; opportunities: Opportunity[] }>({
    queryKey: [`/api/opportunities/suggestions/${industry}`],
    enabled: !!industry,
  });
  
  const handleSearch = () => {
    if (!searchIndustry) {
      toast({
        title: 'Error',
        description: 'Please enter an industry name',
        variant: 'destructive',
      });
      return;
    }
    
    setIndustry(searchIndustry);
  };
  
  const getGrowthBadge = (growth: string | number) => {
    let numericGrowth: number;
    
    if (typeof growth === 'string') {
      // Handle 'Breakout' or other special cases
      if (growth === 'Breakout') return <Badge className="bg-blue-600">Breakout 🚀</Badge>;
      
      // Try to parse numeric value from string
      const match = growth.match(/(\d+)/);
      numericGrowth = match ? parseInt(match[1]) : 0;
    } else {
      numericGrowth = growth as number;
    }
    
    if (numericGrowth > 4000) return <Badge className="bg-blue-600">Breakout 🚀</Badge>;
    if (numericGrowth > 1000) return <Badge className="bg-green-600">Very High 📈</Badge>;
    if (numericGrowth > 500) return <Badge className="bg-green-500">High</Badge>;
    if (numericGrowth > 200) return <Badge className="bg-yellow-500">Medium</Badge>;
    return <Badge className="bg-stone-500">Low</Badge>;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <CardTitle>Market Opportunity Insights</CardTitle>
            <CardDescription>AI-powered opportunity detection from Google Trends</CardDescription>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter industry"
              value={searchIndustry}
              onChange={(e) => setSearchIndustry(e.target.value)}
              className="w-40 md:w-60"
            />
            <Button size="sm" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center p-4 text-destructive">
            Error loading opportunity data: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : data?.opportunities && data.opportunities.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-xl font-medium flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Opportunities in {data.industry}
            </h3>
            
            <div className="grid gap-4">
              {data.opportunities.map((opportunity, index) => (
                <div key={index} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium flex items-center gap-2">
                        <span className="text-primary">{opportunity.name}</span>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {opportunity.type === 'trending_query' ? 'Rising Search Query' : 'Trending Topic'}
                      </p>
                    </div>
                    <div>
                      {getGrowthBadge(opportunity.growth)}
                    </div>
                  </div>
                  <div className="mt-3 text-sm flex justify-between items-center">
                    <span className="text-muted-foreground">{opportunity.source}</span>
                    <Button variant="ghost" size="sm" className="text-primary">
                      <span>Research</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p>No opportunity suggestions available</p>
            <p className="text-sm text-muted-foreground mt-1">Try searching for a different industry</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between flex-wrap">
        <div className="text-muted-foreground text-sm flex gap-1 items-center">
          <TrendingUp className="h-4 w-4" />
          <span>Based on rising search trends and topics</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
