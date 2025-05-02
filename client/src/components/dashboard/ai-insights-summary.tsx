import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiInsight } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  RocketIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  LineChartIcon, 
  CalendarIcon, 
  RefreshCcw 
} from "lucide-react";

interface AIInsightsSummaryProps {
  industryId: number | null;
}

export function AIInsightsSummary({ industryId }: AIInsightsSummaryProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: insight, isLoading, refetch } = useQuery<AiInsight>({
    queryKey: [industryId ? `/api/industries/${industryId}/insights` : null],
    enabled: !!industryId,
  });
  
  const handleRefresh = async () => {
    if (!industryId) return;
    setIsRefreshing(true);
    try {
      // Request live data from the API
      const response = await fetch(`/api/industries/${industryId}/insights?live=true`);
      const data = await response.json();
      
      if (!response.ok) {
        // Handle API errors
        if (data.error === 'PERPLEXITY_AUTH_ERROR' || data.error === 'OPENROUTER_AUTH_ERROR') {
          alert('Cannot generate insights: AI API key is invalid or missing. Please contact the administrator.');
        } else {
          alert(`Error: ${data.message || 'Failed to generate insights'}`);
        }
      } else {
        // Success - refresh the data
        await refetch();
      }
    } catch (error) {
      console.error('Error refreshing insights:', error);
      alert('Failed to connect to the server. Please try again later.');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  
  if (isLoading) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-lg shadow-sm overflow-hidden text-white">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-6 bg-white/20 rounded w-1/3"></div>
            <div className="h-4 bg-white/20 rounded w-1/4"></div>
            <div className="h-24 bg-white/10 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-white/10 rounded-lg"></div>
              <div className="h-32 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!insight && industryId) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-lg shadow-sm overflow-hidden text-white">
        <CardContent className="p-4 md:p-6 text-center">
          <RocketIcon className="h-12 w-12 mx-auto mb-4 text-blue-100" />
          <h2 className="text-xl font-semibold mb-2">No AI Insights Available</h2>
          <p className="mb-4 text-blue-100">We don't have insights for this industry yet.</p>
          <Button 
            variant="secondary"
            onClick={handleRefresh}
          >
            {isRefreshing ? 'Generating...' : 'Generate Insights'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!insight) return null;
  
  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-lg shadow-sm overflow-hidden text-white">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center">
              <RocketIcon className="text-2xl mr-2" />
              <h2 className="text-lg font-semibold">AI-Generated Insights</h2>
            </div>
            <p className="mt-1 text-blue-100">Last updated: {insight.lastUpdated}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1 text-blue-100 hover:text-white focus:outline-none rounded" 
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-blue-50 text-sm font-medium uppercase tracking-wider mb-2">Key Market Opportunity</p>
          <p className="text-white font-medium">{insight.title}</p>
          <p className="mt-1 text-blue-100">{insight.description}</p>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-blue-100 uppercase">Confidence</p>
              <p className="text-white font-medium">{insight.confidence}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-blue-100 uppercase">Market Readiness</p>
              <p className="text-white font-medium">{insight.marketReadiness}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-blue-100 uppercase">Competition</p>
              <p className="text-white font-medium">{insight.competition}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm flex-1">
            <div className="flex items-center justify-between">
              <p className="text-blue-50 text-sm font-medium uppercase tracking-wider">Market Trends</p>
              <LineChartIcon className="text-success-500 text-xl" />
            </div>
            <ul className="mt-2 space-y-2">
              {(() => {
                if (Array.isArray(insight.trends)) {
                  return insight.trends.map((trend: {name: string; growth: string; trend: string}, index: number) => (
                    <li key={index} className="flex items-center text-sm">
                      {trend.trend === 'up' ? (
                        <ArrowUpIcon className="text-success-500 mr-2 h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="text-error-500 mr-2 h-4 w-4" />
                      )}
                      <span>{trend.name} ({trend.growth})</span>
                    </li>
                  ));
                }
                return null;
              })()}
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm flex-1">
            <div className="flex items-center justify-between">
              <p className="text-blue-50 text-sm font-medium uppercase tracking-wider">Opportunity Timeline</p>
              <CalendarIcon className="text-xl" />
            </div>
            <div className="mt-2 flex items-center space-x-1">
              <div className="h-2 rounded-l-full bg-white/30 flex-1"></div>
              <div className="h-2 bg-white/40 flex-1"></div>
              <div className="h-2 bg-white/70 flex-1"></div>
              <div className="h-2 rounded-r-full bg-white/90 flex-1"></div>
            </div>
            {insight.timeline && typeof insight.timeline === 'object' && (
              <>
                <div className="mt-2 flex justify-between text-xs">
                  {/* Using a simpler approach to render quarters */}
                  {typeof insight.timeline === 'object' && 'quarters' in insight.timeline &&
                    Array.isArray((insight.timeline as any).quarters) &&
                    (insight.timeline as any).quarters.map((quarter: string, index: number) => (
                      <span key={index}>{quarter}</span>
                    ))}
                </div>
                <p className="mt-2 text-sm">
                  Optimal market entry window: <span className="font-medium">
                    {typeof insight.timeline === 'object' && 'optimalEntry' in insight.timeline ? 
                      String((insight.timeline as any).optimalEntry) : 'Not available'}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="secondary"
            onClick={() => {
              // Placeholder for detailed analysis view
              alert('Full analysis will be available in the next update.');
            }}
          >
            View Full Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
