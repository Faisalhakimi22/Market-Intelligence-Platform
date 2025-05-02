import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StockData {
  stockData: {
    shortName: string;
    longName?: string;
    sector?: string;
    industry?: string;
    marketCap?: number;
    previousClose?: number;
    open?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
  };
  history: {
    Date: string;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
  }[];
  trends?: any[];
}

interface YahooFinanceWidgetProps {
  initialSymbol?: string;
}

export default function YahooFinanceWidget({ initialSymbol = 'AAPL' }: YahooFinanceWidgetProps) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [searchSymbol, setSearchSymbol] = useState(initialSymbol);
  const [period, setPeriod] = useState('1mo');
  const { toast } = useToast();
  
  const { data, isLoading, isError, error } = useQuery<StockData>({
    queryKey: [`/api/yahoo/stock/${symbol}`, period],
    enabled: !!symbol,
  });
  
  const handleSearch = () => {
    if (!searchSymbol) {
      toast({
        title: 'Error',
        description: 'Please enter a stock symbol',
        variant: 'destructive',
      });
      return;
    }
    
    setSymbol(searchSymbol.toUpperCase());
  };
  
  const formatLargeNumber = (num?: number) => {
    if (!num) return 'N/A';
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };
  
  const getPriceChange = () => {
    if (!data?.history || data.history.length < 2) return { value: 0, percent: 0 };
    
    const latest = data.history[data.history.length - 1].Close;
    const previous = data.history[data.history.length - 2].Close;
    const change = latest - previous;
    const percentChange = (change / previous) * 100;
    
    return {
      value: change,
      percent: percentChange
    };
  };
  
  const priceChange = getPriceChange();
  const isPriceUp = priceChange.value >= 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Yahoo Finance Stock Data</CardTitle>
            <CardDescription>Real-time stock data via yfinance</CardDescription>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter stock symbol"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="w-40"
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
            Error loading stock data: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">{data.stockData.shortName || symbol}</h3>
                <p className="text-muted-foreground">{data.stockData.sector} &bull; {data.stockData.industry}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${data.history[data.history.length - 1]?.Close.toFixed(2) || 'N/A'}
                </div>
                <div className={`flex items-center ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                  {isPriceUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {priceChange.value.toFixed(2)} ({priceChange.percent.toFixed(2)}%)
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
              <div className="bg-background p-2 rounded-md">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="font-medium">{formatLargeNumber(data.stockData.marketCap)}</div>
              </div>
              <div className="bg-background p-2 rounded-md">
                <div className="text-sm text-muted-foreground">Open</div>
                <div className="font-medium">${data.stockData.open?.toFixed(2) || 'N/A'}</div>
              </div>
              <div className="bg-background p-2 rounded-md">
                <div className="text-sm text-muted-foreground">52W High</div>
                <div className="font-medium">${data.stockData.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}</div>
              </div>
              <div className="bg-background p-2 rounded-md">
                <div className="text-sm text-muted-foreground">52W Low</div>
                <div className="font-medium">${data.stockData.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}</div>
              </div>
            </div>
            
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="Date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`$${value.toFixed(2)}`, '']}
                    labelFormatter={(label) => {
                      const d = new Date(label);
                      return d.toLocaleDateString();
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Close"
                    name="Price"
                    stroke="#60a5fa"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Volume"
                    name="Volume"
                    stroke="#d946ef"
                    yAxisId={1}
                    hide={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">No data available</div>
        )}
      </CardContent>
      <CardFooter className="justify-between flex-wrap">
        <div className="text-muted-foreground text-sm">
          Data period:
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5d">5 Days</SelectItem>
            <SelectItem value="1mo">1 Month</SelectItem>
            <SelectItem value="3mo">3 Months</SelectItem>
            <SelectItem value="6mo">6 Months</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="2y">2 Years</SelectItem>
            <SelectItem value="5y">5 Years</SelectItem>
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
}
