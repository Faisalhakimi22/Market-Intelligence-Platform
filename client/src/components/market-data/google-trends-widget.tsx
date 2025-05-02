import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Plus, X, Search, TrendingUp, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { queryClient } from '@/lib/queryClient';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GoogleTrendsWidgetProps {
  initialKeywords?: string[];
}

interface TrendData {
  keywords: string[];
  data: {
    date: string;
    values: { [keyword: string]: number };
  }[];
  periodDisplay: string;
}

interface RelatedData {
  relatedQueries: { query: string; value: number }[];
  relatedTopics: { topic: string; value: number }[];
}

export default function GoogleTrendsWidget({ initialKeywords = ['artificial intelligence'] }: GoogleTrendsWidgetProps) {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [inputKeyword, setInputKeyword] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today 12-m');
  const [activeTab, setActiveTab] = useState('trends');
  const [focusKeyword, setFocusKeyword] = useState(initialKeywords[0] || '');
  
  // Query for trend data
  const { data: trendData, isLoading, isError, refetch } = useQuery<TrendData>({
    queryKey: [`/api/google-trends/interest/${keywords.join(',')}/${selectedPeriod}`],
    enabled: keywords.length > 0,
  });
  
  // Query for related data (only for the focus keyword)
  const { data: relatedData, isLoading: isLoadingRelated } = useQuery<RelatedData>({
    queryKey: [`/api/google-trends/related/${focusKeyword}/${selectedPeriod}`],
    enabled: activeTab === 'related' && focusKeyword.length > 0,
  });
  
  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKeyword && !keywords.includes(inputKeyword) && keywords.length < 5) {
      const newKeywords = [...keywords, inputKeyword];
      setKeywords(newKeywords);
      setInputKeyword('');
      if (!focusKeyword) setFocusKeyword(inputKeyword);
      
      // Invalidate the query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: [`/api/google-trends/interest/${newKeywords.join(',')}/${selectedPeriod}`] });
    }
  };
  
  const removeKeyword = (keyword: string) => {
    const newKeywords = keywords.filter(k => k !== keyword);
    if (newKeywords.length > 0) {
      setKeywords(newKeywords);
      if (focusKeyword === keyword) {
        setFocusKeyword(newKeywords[0]);
      }
      
      // Invalidate the query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: [`/api/google-trends/interest/${newKeywords.join(',')}/${selectedPeriod}`] });
    }
  };
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // Invalidate both queries to trigger refetches
    queryClient.invalidateQueries({ queryKey: [`/api/google-trends/interest/${keywords.join(',')}/${period}`] });
    if (focusKeyword) {
      queryClient.invalidateQueries({ queryKey: [`/api/google-trends/related/${focusKeyword}/${period}`] });
    }
  };
  
  // Set a keyword as the focus for related data
  const setKeywordFocus = (keyword: string) => {
    setFocusKeyword(keyword);
    if (activeTab === 'related') {
      queryClient.invalidateQueries({ queryKey: [`/api/google-trends/related/${keyword}/${selectedPeriod}`] });
    }
  };
  
  // Generate random colors for keywords
  const getColorForKeyword = (keyword: string) => {
    // Simple hash function for the keyword
    const hash = keyword.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Choose from a set of nice colors to ensure readability
    const colors = [
      'rgb(99, 102, 241)', // Indigo
      'rgb(239, 68, 68)',  // Red
      'rgb(34, 197, 94)',  // Green
      'rgb(249, 115, 22)', // Orange
      'rgb(14, 165, 233)'  // Sky blue
    ];
    return colors[hash % colors.length];
  };
  
  // Prepare chart data
  const chartData = {
    labels: trendData?.data.map(item => new Date(item.date).toLocaleDateString()) || [],
    datasets: keywords.map(keyword => {
      const color = getColorForKeyword(keyword);
      return {
        label: keyword,
        data: trendData?.data.map(item => item.values[keyword]) || [],
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.5)'),
        tension: 0.2,
        pointRadius: 0.5,
        pointHoverRadius: 4,
      };
    }),
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} (relative interest)`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Relative interest (0-100)'
        },
        min: 0,
        max: 100
      },
    },
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-end">
        <form onSubmit={addKeyword} className="flex-1 flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Add a keyword or topic"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              disabled={keywords.length >= 5}
            />
          </div>
          <Button 
            type="submit" 
            disabled={inputKeyword.length === 0 || keywords.includes(inputKeyword) || keywords.length >= 5}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
        
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={() => handlePeriodChange('today 3-m')} className={selectedPeriod === 'today 3-m' ? 'bg-primary text-primary-foreground' : ''}>
            3M
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePeriodChange('today 12-m')} className={selectedPeriod === 'today 12-m' ? 'bg-primary text-primary-foreground' : ''}>
            1Y
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePeriodChange('today 5-y')} className={selectedPeriod === 'today 5-y' ? 'bg-primary text-primary-foreground' : ''}>
            5Y
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {keywords.map(keyword => (
          <Badge 
            key={keyword} 
            variant="outline"
            style={{ borderColor: getColorForKeyword(keyword) }}
            className={`cursor-pointer ${focusKeyword === keyword ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => setKeywordFocus(keyword)}
          >
            {keyword}
            <button
              className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                removeKeyword(keyword);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trends" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends Over Time
          </TabsTrigger>
          <TabsTrigger value="related" className="flex items-center">
            <List className="h-4 w-4 mr-2" />
            Related Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : isError ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <p className="text-red-500">Error loading trend data. Please try different keywords.</p>
                </div>
              </CardContent>
            </Card>
          ) : trendData ? (
            <div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Data shows relative search interest (0-100) for the selected time period: {trendData.periodDisplay || selectedPeriod}
                </p>
              </div>
              <div className="h-[300px] w-full relative">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          ) : null}
        </TabsContent>
        
        <TabsContent value="related" className="mt-4">
          {isLoadingRelated ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : !focusKeyword ? (
            <div className="text-center py-10">
              <p>Please select a keyword to see related data.</p>
            </div>
          ) : relatedData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Related Queries for "{focusKeyword}"
                  </h3>
                  {relatedData.relatedQueries.length === 0 ? (
                    <p className="text-muted-foreground">No related queries available.</p>
                  ) : (
                    <ul className="space-y-2">
                      {relatedData.relatedQueries.map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <span>{item.query}</span>
                          <Badge variant="outline">{item.value}%</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Related Topics for "{focusKeyword}"
                  </h3>
                  {relatedData.relatedTopics.length === 0 ? (
                    <p className="text-muted-foreground">No related topics available.</p>
                  ) : (
                    <ul className="space-y-2">
                      {relatedData.relatedTopics.map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <span>{item.topic}</span>
                          <Badge variant="outline">{item.value}%</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
