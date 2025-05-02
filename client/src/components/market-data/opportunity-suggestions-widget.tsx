import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, Lightbulb, TrendingUp, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Opportunity {
  type: string;
  name: string;
  growth: string | number;
  source: string;
  description: string;
}

interface OpportunitySuggestionsWidgetProps {
  initialIndustry?: string;
}

export default function OpportunitySuggestionsWidget({ initialIndustry = 'Technology' }: OpportunitySuggestionsWidgetProps) {
  const [industry, setIndustry] = useState(initialIndustry);
  
  // Industry options for select dropdown
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Entertainment',
    'Food & Beverage',
    'Real Estate',
    'Transportation'
  ];
  
  // Query for opportunity suggestions based on industry
  const { data: opportunities, isLoading, isError } = useQuery<Opportunity[]>({
    queryKey: [`/api/opportunities/suggestions/${industry}`],
    enabled: !!industry
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Opportunity Insights</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered market opportunity suggestions based on search trends and user interest.
          </p>
        </div>
        
        <div className="w-full sm:w-56">
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <p className="text-red-500">Error loading opportunities. Please try a different industry.</p>
            </div>
          </CardContent>
        </Card>
      ) : opportunities && opportunities.length > 0 ? (
        <div className="space-y-4">
          {opportunities.map((opp, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                      <h4 className="text-lg font-medium">{opp.name}</h4>
                    </div>
                    <div className="flex items-center bg-green-50 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded">
                      <TrendingUp className="h-3.5 w-3.5 mr-1" />
                      {typeof opp.growth === 'number' ? `${opp.growth}%` : opp.growth}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{opp.description}</p>
                  
                  <div className="flex justify-between items-center pt-2 text-xs text-gray-500 border-t">
                    <div>
                      <span className="font-medium">Source:</span> {opp.source}
                    </div>
                    <div className="flex items-center">
                      <Search className="h-3 w-3 mr-1" />
                      <span className="font-medium">Trend Category:</span> {opp.type}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <p className="text-muted-foreground">No opportunity suggestions available for {industry}. Try a different industry.</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-end">
        <p className="text-xs text-muted-foreground italic">
          Opportunity suggestions powered by Google Trends and OpenRouter AI. Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
