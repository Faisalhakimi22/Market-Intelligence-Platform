import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ui/theme-provider";
import { InfoIcon } from "lucide-react";
import Chart from "chart.js/auto";

interface ForecastWidgetProps {
  className?: string;
}

export function ForecastWidget({ className }: ForecastWidgetProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const [forecastType, setForecastType] = useState<"Conservative" | "Moderate" | "Aggressive">("Moderate");
  const { theme } = useTheme();
  
  // Simulate data loading
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!chartRef.current || isLoading) return;
    
    const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    
    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    // Create new chart
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    
    // Different data based on forecast type
    const forecastData: Record<string, { 
      historical: number[], 
      forecast: number[], 
      upperBound: number[], 
      lowerBound: number[],
      confidence: number,
      growth: number,
      risk: string
    }> = {
      "Conservative": {
        historical: [42, 45, 48, 51, 54, 57, null, null, null, null, null, null],
        forecast: [null, null, null, 51, 54, 57, 60, 63, 66, 69, 72, 75],
        upperBound: [null, null, null, 52, 56, 60, 64, 68, 72, 76, 80, 84],
        lowerBound: [null, null, null, 50, 52, 54, 56, 58, 60, 62, 64, 66],
        confidence: 90,
        growth: 28.1,
        risk: "Low"
      },
      "Moderate": {
        historical: [42, 45, 48, 51, 54, 57, null, null, null, null, null, null],
        forecast: [null, null, null, 51, 55, 59, 63, 68, 72, 76, 79, 83],
        upperBound: [null, null, null, 53, 58, 63, 69, 75, 81, 86, 90, 95],
        lowerBound: [null, null, null, 49, 52, 55, 58, 61, 64, 67, 69, 72],
        confidence: 82,
        growth: 37.8,
        risk: "Medium"
      },
      "Aggressive": {
        historical: [42, 45, 48, 51, 54, 57, null, null, null, null, null, null],
        forecast: [null, null, null, 51, 56, 62, 68, 74, 80, 87, 94, 102],
        upperBound: [null, null, null, 54, 60, 68, 76, 84, 92, 100, 108, 118],
        lowerBound: [null, null, null, 48, 52, 56, 60, 64, 68, 73, 78, 84],
        confidence: 68,
        growth: 58.2,
        risk: "High"
      }
    };
    
    const selectedData = forecastData[forecastType];
    
    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        datasets: [
          {
            label: "Historical Data",
            data: selectedData.historical,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.3,
            fill: true,
            pointRadius: 4
          },
          {
            label: "Forecast",
            data: selectedData.forecast,
            borderColor: "#8B5CF6",
            borderDash: [5, 5],
            backgroundColor: "rgba(139, 92, 246, 0.05)",
            tension: 0.3,
            fill: true,
            pointRadius: 0
          },
          {
            label: "Upper Bound",
            data: selectedData.upperBound,
            borderColor: "rgba(139, 92, 246, 0.3)",
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderDash: [2, 2],
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: "Lower Bound",
            data: selectedData.lowerBound,
            borderColor: "rgba(139, 92, 246, 0.3)",
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderDash: [2, 2],
            tension: 0.3,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: "index",
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: gridColor
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    
    setChartInstance(newChart);
    
    return () => {
      newChart.destroy();
    };
  }, [chartRef, theme, isLoading, forecastType]);
  
  // Risk color mapping
  const getRiskColor = (risk: string) => {
    const riskColorMap: Record<string, string> = {
      "Low": "text-success-500",
      "Medium": "text-warning-500",
      "High": "text-error-500"
    };
    return riskColorMap[risk] || "text-warning-500";
  };
  
  // Get the forecast data
  const getForecastData = () => {
    const forecastData: Record<string, { 
      confidence: number,
      growth: number,
      risk: string
    }> = {
      "Conservative": {
        confidence: 90,
        growth: 28.1,
        risk: "Low"
      },
      "Moderate": {
        confidence: 82,
        growth: 37.8,
        risk: "Medium"
      },
      "Aggressive": {
        confidence: 68,
        growth: 58.2,
        risk: "High"
      }
    };
    
    return forecastData[forecastType];
  };
  
  const handleForecastTypeChange = (type: "Conservative" | "Moderate" | "Aggressive") => {
    setForecastType(type);
  };
  
  const forecastData = getForecastData();
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 border-b dark:border-gray-700 flex flex-row items-center justify-between space-y-0">
        <h3 className="font-medium">12-Month Forecast</h3>
        <div className="flex space-x-2">
          <Button 
            variant={forecastType === "Conservative" ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => handleForecastTypeChange("Conservative")}
          >
            Conservative
          </Button>
          <Button 
            variant={forecastType === "Moderate" ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => handleForecastTypeChange("Moderate")}
          >
            Moderate
          </Button>
          <Button 
            variant={forecastType === "Aggressive" ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => handleForecastTypeChange("Aggressive")}
          >
            Aggressive
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <div className="h-[300px] w-full">
              <canvas ref={chartRef}></canvas>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Predicted Growth</p>
                <p className="font-medium">+{forecastData.growth.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                <p className="font-medium">{forecastData.confidence}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Risk Level</p>
                <p className={cn("font-medium", getRiskColor(forecastData.risk))}>{forecastData.risk}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm">AI Confidence Level</p>
                <div className="flex items-center text-sm">
                  <InfoIcon className="text-gray-400 mr-1 h-4 w-4" />
                  <span>Based on 43 variables</span>
                </div>
              </div>
              <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-success-500 rounded-full" style={{ width: `${forecastData.confidence}%` }}></div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
