import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Search, TrendingUp, Info, Activity } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface YahooFinanceWidgetProps {
  initialSymbol?: string;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  currency: string;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  historicalData: {
    date: string;
    close: number;
  }[];
}

export default function YahooFinanceWidget({ initialSymbol = 'AAPL' }: YahooFinanceWidgetProps) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [searchInput, setSearchInput] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1mo');
  const [dataTab, setDataTab] = useState('chart');
  
  // Query for stock data
  const { data: stockData, isLoading, isError, refetch } = useQuery<StockData>({
    queryKey: [`/api/yahoo-finance/stock/${symbol}/${selectedPeriod}`],
    enabled: !!symbol,
  });
  
  // Query for stock search
  const { data: searchResults, isLoading: isSearching } = useQuery<{ symbol: string; name: string }[]>({
    queryKey: [`/api/yahoo-finance/search/${searchInput}`],
    enabled: searchInput.length > 2, // Only search when at least 3 chars typed
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.length > 0) {
      setSymbol(searchInput.toUpperCase());
      setSearchInput('');
    }
  };
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    queryClient.invalidateQueries({ queryKey: [`/api/yahoo-finance/stock/${symbol}/${period}`] });
  };
  
  // Prepare chart data
  const chartData = {
    labels: stockData?.historicalData?.map(item => new Date(item.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: symbol,
        data: stockData?.historicalData?.map(item => item.close) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => {
            return `$${value}`;
          },
        },
      },
    },
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={searchInput.length === 0}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">1 Day</SelectItem>
            <SelectItem value="5d">5 Days</SelectItem>
            <SelectItem value="1mo">1 Month</SelectItem>
            <SelectItem value="3mo">3 Months</SelectItem>
            <SelectItem value="6mo">6 Months</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="2y">2 Years</SelectItem>
            <SelectItem value="5y">5 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <p className="text-red-500">Error loading data for {symbol}. Please try a different symbol.</p>
            </div>
          </CardContent>
        </Card>
      ) : stockData ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold">{stockData.name} ({stockData.symbol})</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">${stockData.price.toFixed(2)}</span>
                <span 
                  className={`text-sm font-medium ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.percentChange.toFixed(2)}%)
                </span>
              </div>
            </div>
            
            <div className="flex gap-2 self-end sm:self-auto">
              <Button variant="outline" size="sm" onClick={() => setDataTab('chart')} className={dataTab === 'chart' ? 'bg-primary text-primary-foreground' : ''}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Chart
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDataTab('details')} className={dataTab === 'details' ? 'bg-primary text-primary-foreground' : ''}>
                <Info className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>
          </div>
          
          {dataTab === 'chart' ? (
            <div className="h-[300px] w-full relative">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Open</Label>
                    <span className="font-medium">${stockData.open.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>High</Label>
                    <span className="font-medium">${stockData.high.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Low</Label>
                    <span className="font-medium">${stockData.low.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Volume</Label>
                    <span className="font-medium">{stockData.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Market Cap</Label>
                    <span className="font-medium">${(stockData.marketCap / 1000000000).toFixed(2)}B</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Currency</Label>
                    <span className="font-medium">{stockData.currency}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center">
                      <Activity className="h-4 w-4 mr-1" />
                      Performance ({selectedPeriod})
                    </Label>
                    <span 
                      className={`font-medium ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {stockData.change >= 0 ? '+' : ''}{stockData.percentChange.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Based on historical data from Yahoo Finance. Past performance is not indicative of future results.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
