import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

interface ForecastResult {
  forecast: TimeSeriesDataPoint[];
  upperBound?: TimeSeriesDataPoint[];
  lowerBound?: TimeSeriesDataPoint[];
  modelName: string;
  rmse?: number;
  mape?: number;
}

interface ForecastData {
  industry: string;
  historicalData: TimeSeriesDataPoint[];
  forecast: ForecastResult;
}

interface DemandForecastProps {
  industryId: number;
  title?: string;
}

const INTERVAL_OPTIONS = [
  { value: 'month', label: 'Monthly' },
  { value: 'week', label: 'Weekly' },
  { value: 'day', label: 'Daily' },
];

const PERIOD_OPTIONS = [
  { value: '3', label: '3 Periods' },
  { value: '6', label: '6 Periods' },
  { value: '12', label: '12 Periods' },
];

export function DemandForecast({ industryId, title = "Demand Forecast" }: DemandForecastProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [interval, setInterval] = useState('month');
  const [periods, setPeriods] = useState('6');
  
  const { toast } = useToast();
  
  async function loadForecast() {
    if (!industryId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest(
        'GET', 
        `/api/forecast/industry/${industryId}?interval=${interval}&periods=${periods}`
      );
      const data = await response.json();
      setForecastData(data);
    } catch (err) {
      console.error('Error loading forecast:', err);
      setError(err instanceof Error ? err.message : 'Failed to load forecast data');
      toast({
        title: "Error loading forecast",
        description: err instanceof Error ? err.message : 'Failed to load forecast data',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    if (industryId) {
      loadForecast();
    }
  }, [industryId, interval, periods]);
  
  // Prepare chart data when forecast data is available
  const chartData = {
    datasets: [
      // Historical data
      {
        label: 'Historical Data',
        data: forecastData?.historicalData.map(point => ({
          x: new Date(point.timestamp),
          y: point.value,
        })) || [],
        borderColor: 'rgba(53, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2,
      },
      // Forecast data
      {
        label: 'Forecast',
        data: forecastData?.forecast.forecast.map(point => ({
          x: new Date(point.timestamp),
          y: point.value,
        })) || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
        pointRadius: 4,
        pointStyle: 'triangle',
        tension: 0.2,
      },
      // Upper bound (confidence interval)
      {
        label: 'Upper Bound',
        data: forecastData?.forecast.upperBound?.map(point => ({
          x: new Date(point.timestamp),
          y: point.value,
        })) || [],
        borderColor: 'rgba(255, 159, 64, 0.8)',
        backgroundColor: 'rgba(255, 159, 64, 0.3)',
        borderDash: [3, 3],
        pointRadius: 0,
        fill: '+1', // Fill to the dataset below
        tension: 0.2,
      },
      // Lower bound (confidence interval)
      {
        label: 'Lower Bound',
        data: forecastData?.forecast.lowerBound?.map(point => ({
          x: new Date(point.timestamp),
          y: point.value,
        })) || [],
        borderColor: 'rgba(255, 159, 64, 0.8)',
        backgroundColor: 'rgba(255, 159, 64, 0.0)',
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false,
        tension: 0.2,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: interval === 'day' ? 'day' as const : 
                interval === 'week' ? 'week' as const : 'month' as const,
          displayFormats: {
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy',
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Market Size',
        },
        min: 0, // Ensure y-axis starts at 0
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const date = new Date(tooltipItems[0].parsed.x);
            return date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          },
          label: (tooltipItem: any) => {
            return `${tooltipItem.dataset.label}: $${tooltipItem.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
          },
        },
      },
    },
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Industry market size forecast</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Industry market size forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-destructive mb-2">Error loading forecast data</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadForecast}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {forecastData?.industry} market size forecast
              {forecastData?.forecast.modelName && ` (${forecastData.forecast.modelName})`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Interval" />
              </SelectTrigger>
              <SelectContent>
                {INTERVAL_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={periods} onValueChange={setPeriods}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Periods" />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
        
        {forecastData?.forecast.rmse && forecastData?.forecast.mape && (
          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
            <div className="bg-muted/50 p-2 rounded">
              <span className="text-muted-foreground">RMSE:</span>{' '}
              <span className="font-medium">
                {forecastData.forecast.rmse.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <span className="text-muted-foreground">MAPE:</span>{' '}
              <span className="font-medium">
                {forecastData.forecast.mape.toLocaleString('en-US', { maximumFractionDigits: 2 })}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}