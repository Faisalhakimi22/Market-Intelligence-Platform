import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ui/theme-provider";
import Chart from "chart.js/auto";

interface MarketGrowthChartProps {
  className?: string;
}

export function MarketGrowthChart({ className }: MarketGrowthChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const [timeframe, setTimeframe] = useState<"1M" | "3M" | "6M" | "1Y">("3M");
  const { theme } = useTheme();
  
  // Simulate data loading
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
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
    
    // Different data based on timeframe
    const monthsData: Record<string, { labels: string[], healthcareData: number[], aiData: number[] }> = {
      "1M": {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        healthcareData: [45, 47, 52, 54],
        aiData: [40, 42, 45, 48]
      },
      "3M": {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        healthcareData: [34, 38, 42, 45, 43, 48, 50, 54, 59],
        aiData: [25, 28, 32, 36, 40, 45, 48, 52, 58]
      },
      "6M": {
        labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        healthcareData: [30, 34, 38, 42, 44, 46, 52, 56, 62],
        aiData: [22, 25, 30, 34, 38, 42, 46, 50, 56]
      },
      "1Y": {
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        healthcareData: [25, 28, 30, 34, 38, 42, 45, 48, 52, 56, 60, 65],
        aiData: [18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 62]
      }
    };
    
    const selectedData = monthsData[timeframe];
    
    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: selectedData.labels,
        datasets: [
          {
            label: "Healthcare Tech",
            data: selectedData.healthcareData,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.3,
            fill: true
          },
          {
            label: "AI Integration",
            data: selectedData.aiData,
            borderColor: "#8B5CF6",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: "circle"
            }
          },
          tooltip: {
            mode: "index",
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
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
  }, [chartRef, theme, isLoading, timeframe]);
  
  const handleTimeframeChange = (newTimeframe: "1M" | "3M" | "6M" | "1Y") => {
    setTimeframe(newTimeframe);
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 border-b dark:border-gray-700 flex flex-row items-center justify-between space-y-0">
        <h3 className="font-medium">Market Growth Trends</h3>
        <div className="flex space-x-2">
          <Button 
            variant={timeframe === "1M" ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => handleTimeframeChange("1M")}
          >
            1M
          </Button>
          <Button 
            variant={timeframe === "3M" ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => handleTimeframeChange("3M")}
          >
            3M
          </Button>
          <Button 
            variant={timeframe === "6M" ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => handleTimeframeChange("6M")}
          >
            6M
          </Button>
          <Button 
            variant={timeframe === "1Y" ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => handleTimeframeChange("1Y")}
          >
            1Y
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="h-[300px] w-full">
              <canvas ref={chartRef}></canvas>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Healthcare Tech</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-medium">+24.8%</p>
                  <span className="text-success-500 text-sm flex items-center">
                    <ArrowUpIcon className="h-4 w-4 mr-1" /> 6.2%
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">AI Integration</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-medium">+32.1%</p>
                  <span className="text-success-500 text-sm flex items-center">
                    <ArrowUpIcon className="h-4 w-4 mr-1" /> 8.4%
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}
