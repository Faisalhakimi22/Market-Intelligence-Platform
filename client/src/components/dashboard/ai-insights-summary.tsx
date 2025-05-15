import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiInsight } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  Calendar, 
  RefreshCw,
  Brain,
  ExternalLink,
  AlertCircle
} from "lucide-react";

interface AIInsightsSummaryProps {
  industryId: number | null;
  className?: string;
}

export function AIInsightsSummary({ industryId, className = "" }: AIInsightsSummaryProps) {
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
  
  // Loading state with improved animation
  if (isLoading) {
    return (
      <Card className={`${className} overflow-hidden text-white`}>
        <CardContent className="p-0">
          <div className="p-6 relative">
            {/* Pulsating background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-md bg-white/20" />
                <Skeleton className="h-6 w-48 rounded bg-white/20" />
              </div>
              <Skeleton className="h-4 w-40 rounded bg-white/15" />
              <Skeleton className="h-24 rounded-lg bg-white/10" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-36 rounded-lg bg-white/10" />
                <Skeleton className="h-36 rounded-lg bg-white/10" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Empty state with enhanced visual appeal
  if (!insight && industryId) {
    return (
      <Card className={`${className} overflow-hidden text-white`}>
        <CardContent className="p-0">
          <div className="p-6 text-center relative overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-blue-600/30 animate-gradient"></div>
            
            <div className="relative z-10">
              <div className="inline-flex p-4 rounded-full bg-blue-500/20 backdrop-blur-sm mb-4">
                <Brain className="h-10 w-10 text-blue-200" />
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
                AI Insights Awaiting
              </h2>
              <p className="mb-6 text-blue-200 max-w-md mx-auto">
                We haven't generated market intelligence insights for this industry yet. Generate them now to unlock powerful AI-driven recommendations.
              </p>
              <Button 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 font-medium px-6 py-2 rounded-lg shadow-glow transition-all duration-300"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <span className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Market Data...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Insights
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!insight) return null;
  
  // Determine the opportunity level indicator color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-emerald-400";
    if (confidence >= 60) return "text-amber-400";
    return "text-red-400";
  };
  
  return (
    <div className={`${className} relative overflow-hidden group`}>
      {/* Subtle animation effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-xl blur-lg group-hover:blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
      
      <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-2xl rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 h-20 w-20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-2xl rounded-full -ml-10 -mb-10"></div>
        
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white">AI Market Intelligence</h2>
                  <p className="text-sm text-slate-400">
                    Last updated: {insight.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
            <Button 
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all duration-200"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="mt-6 bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
            <div className="flex items-center mb-3">
              <div className="h-6 w-1 bg-blue-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-white">Key Market Opportunity</h3>
            </div>
            <p className="text-white font-medium mb-2">{insight.title}</p>
            <p className="text-slate-300 text-sm">{insight.description}</p>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-slate-800/70 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Confidence</p>
                <div className="flex items-center justify-center">
                  <div className={`text-lg font-bold ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}%
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-violet-500 h-1 rounded-full" 
                    style={{ width: `${insight.confidence}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-slate-800/70 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Market Readiness</p>
                <p className="text-lg font-bold text-white">{insight.marketReadiness}</p>
              </div>
              <div className="bg-slate-800/70 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Competition</p>
                <p className="text-lg font-bold text-white">{insight.competition}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md bg-slate-800">
                    <BarChart2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h3 className="ml-2 font-medium text-white">Market Trends</h3>
                </div>
              </div>
              <ul className="space-y-3">
                {(() => {
                  if (Array.isArray(insight.trends)) {
                    return insight.trends.map((trend: {name: string; growth: string; trend: string}, index: number) => (
                      <li key={index} className="flex items-center">
                        <div className={`p-1 rounded-md ${trend.trend === 'up' ? 'bg-emerald-900/30' : 'bg-red-900/30'} mr-2`}>
                          {trend.trend === 'up' ? (
                            <TrendingUp className="text-emerald-400 h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="text-red-400 h-3.5 w-3.5" />
                          )}
                        </div>
                        <div>
                          <span className="text-sm text-slate-300">{trend.name}</span>
                          <span className={`ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${
                            trend.trend === 'up' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'
                          }`}>
                            {trend.growth}
                          </span>
                        </div>
                      </li>
                    ));
                  }
                  return null;
                })()}
              </ul>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md bg-slate-800">
                    <Calendar className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="ml-2 font-medium text-white">Opportunity Timeline</h3>
                </div>
              </div>
              
              {insight.timeline && typeof insight.timeline === 'object' && (
                <>
                  <div className="relative mt-2 pt-6">
                    <div className="flex items-center">
                      <div className="h-2 rounded-l-full bg-blue-900/50 flex-1"></div>
                      <div className="h-2 bg-indigo-700/50 flex-1"></div>
                      <div className="h-2 bg-violet-600/50 flex-1"></div>
                      <div className="h-2 rounded-r-full bg-purple-500/50 flex-1"></div>
                    </div>
                    
                    {/* Timeline markers */}
                    <div className="flex justify-between absolute top-0 left-0 right-0">
                      {typeof insight.timeline === 'object' && 'quarters' in insight.timeline &&
                        Array.isArray((insight.timeline as any).quarters) &&
                        (insight.timeline as any).quarters.map((quarter: string, index: number) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            (insight.timeline as any).optimalEntry === quarter 
                              ? 'bg-purple-500 border-purple-300' 
                              : 'bg-slate-600 border-slate-500'
                          }`}></div>
                          <span className="text-xs mt-1 text-slate-400">{quarter}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <div className="p-1.5 rounded-md bg-purple-900/30 mr-2">
                      <AlertCircle className="h-3.5 w-3.5 text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-300">
                      Optimal entry: <span className="text-white font-medium">
                        {typeof insight.timeline === 'object' && 'optimalEntry' in insight.timeline ? 
                          String((insight.timeline as any).optimalEntry) : 'Not available'}
                      </span>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-glow-blue transition-all duration-300 flex items-center"
              onClick={() => {
                // Placeholder for detailed analysis view
                alert('Full analysis will be available in the next update.');
              }}
            >
              <span>View Full Analysis</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
