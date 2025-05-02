import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calculator } from "lucide-react";
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
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

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

interface ModelComparisonData {
  data: TimeSeriesDataPoint[];
  models: ForecastResult[];
}

interface ModelComparisonProps {
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

const DATA_POINTS_OPTIONS = [
  { value: '12', label: '12 Points' },
  { value: '24', label: '24 Points' },
  { value: '36', label: '36 Points' },
];

export function ModelComparison({ title = "Forecasting Model Comparison" }: ModelComparisonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelData, setModelData] = useState<ModelComparisonData | null>(null);
  const [interval, setInterval] = useState('month');
  const [periods, setPeriods] = useState('6');
  const [dataPoints, setDataPoints] = useState('24');
  const [selectedTab, setSelectedTab] = useState('model-0');
  
  const { toast } = useToast();
  
  async function loadModelComparison() {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest(
        'GET', 
        `/api/forecast/models?interval=${interval}&periods=${periods}&dataPoints=${dataPoints}`
      );
      const data = await response.json();
      setModelData(data);
      
      // Reset to first tab when loading new data
      if (data.models && data.models.length > 0) {
        setSelectedTab(`model-0`);
      }
    } catch (err) {
      console.error('Error loading forecast models:', err);
      setError(err instanceof Error ? err.message : 'Failed to load forecasting models');
      toast({
        title: "Error loading models",
        description: err instanceof Error ? err.message : 'Failed to load forecasting models',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Prepare chart data for a specific model
  const getChartDataForModel = (modelIndex: number) => {
    if (!modelData || !modelData.models || modelData.models.length <= modelIndex) {
      return { datasets: [] };
    }
    
    const model = modelData.models[modelIndex];
    
    return {
      datasets: [
        // Historical data
        {
          label: 'Historical Data',
          data: modelData.data.map(point => ({
            x: new Date(point.timestamp),
            y: point.value,
          })),
          borderColor: 'rgba(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.2,
        },
        // Forecast data
        {
          label: 'Forecast',
          data: model.forecast.map(point => ({
            x: new Date(point.timestamp),
            y: point.value,
          })),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderDash: [5, 5],
          pointRadius: 4,
          pointStyle: 'triangle',
          tension: 0.2,
        },
        // Upper bound (confidence interval)
        ...((model.upperBound && model.lowerBound) ? [
          {
            label: 'Upper Bound',
            data: model.upperBound.map(point => ({
              x: new Date(point.timestamp),
              y: point.value,
            })),
            borderColor: 'rgba(255, 159, 64, 0.8)',
            backgroundColor: 'rgba(255, 159, 64, 0.3)',
            borderDash: [3, 3],
            pointRadius: 0,
            fill: '+1', // Fill to the dataset below
            tension: 0.2,
          },
          {
            label: 'Lower Bound',
            data: model.lowerBound.map(point => ({
              x: new Date(point.timestamp),
              y: point.value,
            })),
            borderColor: 'rgba(255, 159, 64, 0.8)',
            backgroundColor: 'rgba(255, 159, 64, 0.0)',
            borderDash: [3, 3],
            pointRadius: 0,
            fill: false,
            tension: 0.2,
          }
        ] : []),
      ],
    };
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
          text: 'Value',
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
        },
      },
    },
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Comparing different forecasting models</CardDescription>
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
          <CardDescription>Comparing different forecasting models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-destructive mb-2">Error loading forecasting models</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadModelComparison}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Initial state - no data yet
  if (!modelData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Comparing different time-series forecasting models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Data Points</label>
              <Select value={dataPoints} onValueChange={setDataPoints}>
                <SelectTrigger>
                  <SelectValue placeholder="Data Points" />
                </SelectTrigger>
                <SelectContent>
                  {DATA_POINTS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Interval</label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger>
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
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Forecast Periods</label>
              <Select value={periods} onValueChange={setPeriods}>
                <SelectTrigger>
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
          
          <div className="flex justify-center">
            <Button 
              onClick={loadModelComparison} 
              className="w-full md:w-auto" 
              size="lg"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Compare Forecasting Models
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Comparing different time-series forecasting models</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Data Points</label>
            <Select value={dataPoints} onValueChange={setDataPoints}>
              <SelectTrigger>
                <SelectValue placeholder="Data Points" />
              </SelectTrigger>
              <SelectContent>
                {DATA_POINTS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Interval</label>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger>
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
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Forecast Periods</label>
            <Select value={periods} onValueChange={setPeriods}>
              <SelectTrigger>
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
        
        <Button 
          onClick={loadModelComparison} 
          className="w-full mb-6" 
          variant="outline"
        >
          <Calculator className="mr-2 h-4 w-4" />
          Recalculate Models
        </Button>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full border-b">
            {modelData.models.map((model, index) => (
              <TabsTrigger 
                key={`model-${index}`} 
                value={`model-${index}`} 
                className="flex-1"
              >
                {model.modelName}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {modelData.models.map((model, index) => (
            <TabsContent key={`model-${index}`} value={`model-${index}`}>
              <div className="h-60 md:h-80">
                <Line 
                  data={getChartDataForModel(index)} 
                  options={chartOptions} 
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="bg-muted/50 p-2 rounded">
                  <span className="text-muted-foreground">Model:</span>{' '}
                  <span className="font-medium">{model.modelName}</span>
                </div>
                <div className="bg-muted/50 p-2 rounded">
                  <span className="text-muted-foreground">RMSE:</span>{' '}
                  <span className="font-medium">
                    {model.rmse?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || 'N/A'}
                  </span>
                </div>
                <div className="bg-muted/50 p-2 rounded">
                  <span className="text-muted-foreground">MAPE:</span>{' '}
                  <span className="font-medium">
                    {model.mape ? `${model.mape.toLocaleString('en-US', { maximumFractionDigits: 2 })}%` : 'N/A'}
                  </span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}