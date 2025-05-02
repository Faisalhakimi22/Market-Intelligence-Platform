import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, Search, TrendingUp, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrendData {
  date: string;
  [keyword: string]: string | number;
}

interface GoogleTrendsWidgetProps {
  initialKeywords?: string[];
}

export default function GoogleTrendsWidget({ initialKeywords = ['artificial intelligence', 'machine learning'] }: GoogleTrendsWidgetProps) {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [period, setPeriod] = useState('today 12-m');
  const { toast } = useToast();
  
  const { data, isLoading, isError, error } = useQuery<{ status: string; data: TrendData[] }>({
    queryKey: [`/api/trends/interest?keywords=${keywords.join(',')}&period=${period}`],
    enabled: keywords.length > 0,
  });
  
  const handleAddKeyword = () => {
    if (!newKeyword) {
      toast({
        title: 'Error',
        description: 'Please enter a keyword',
        variant: 'destructive',
      });
      return;
    }
    
    if (keywords.includes(newKeyword)) {
      toast({
        title: 'Error',
        description: 'Keyword already exists',
        variant: 'destructive',
      });
      return;
    }
    
    if (keywords.length >= 5) {
      toast({
        title: 'Error',
        description: 'Maximum 5 keywords allowed to avoid rate limits',
        variant: 'destructive',
      });
      return;
    }
    
    setKeywords([...keywords, newKeyword]);
    setNewKeyword('');
  };
  
  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };
  
  // Random color generator for lines
  const getLineColor = (index: number) => {
    const colors = ['#60a5fa', '#f97316', '#8b5cf6', '#10b981', '#f43f5e'];
    return colors[index % colors.length];
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <CardTitle>Google Trends Insights</CardTitle>
            <CardDescription>Track interest over time via Google Trends</CardDescription>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add keyword or topic"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="w-40 md:w-60"
            />
            <Button size="sm" onClick={handleAddKeyword}>
              <TrendingUp className="h-4 w-4 mr-1" />
              Add
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
            Error loading trend data: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : data?.data ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <div 
                  key={keyword} 
                  className="bg-background text-sm rounded-full px-3 py-1 flex items-center gap-1"
                  style={{ borderBottom: `2px solid ${getLineColor(index)}` }}
                >
                  <span>{keyword}</span>
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().substr(2)}`;
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                    label={{ value: 'Interest', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip
                    formatter={(value: any) => [value, '']}
                    labelFormatter={(label) => {
                      const d = new Date(label);
                      return d.toLocaleDateString();
                    }}
                  />
                  <Legend />
                  {keywords.map((keyword, index) => (
                    <Line
                      key={keyword}
                      type="monotone"
                      dataKey={keyword}
                      name={keyword}
                      stroke={getLineColor(index)}
                      dot={false}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-sm text-center text-muted-foreground">
              Interest over time: 0-100 (relative interest where 100 is peak popularity)
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p>No trend data available</p>
            <p className="text-sm text-muted-foreground mt-1">Add keywords to see Google Trends data</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between flex-wrap">
        <div className="text-muted-foreground text-sm flex gap-1 items-center">
          <Sparkles className="h-4 w-4" />
          <span>Data powered by Google Trends</span>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36 md:w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today 1-m">Past month</SelectItem>
            <SelectItem value="today 3-m">Past 3 months</SelectItem>
            <SelectItem value="today 12-m">Past year</SelectItem>
            <SelectItem value="today 5-y">Past 5 years</SelectItem>
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
}
