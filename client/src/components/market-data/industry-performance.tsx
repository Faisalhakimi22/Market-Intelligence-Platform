import { useIndustryPerformance } from "@/hooks/use-market-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

export function IndustryPerformance() {
  const { data: sectors, isLoading, error } = useIndustryPerformance();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Industry Performance</CardTitle>
          <CardDescription>Real-time sector performance data</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Industry Performance</CardTitle>
          <CardDescription>Real-time sector performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-destructive mb-2">Error loading sector data</p>
            <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Industry Performance</CardTitle>
        <CardDescription>Real-time sector performance data</CardDescription>
      </CardHeader>
      <CardContent>
        {sectors && Array.isArray(sectors) && sectors.length > 0 ? (
          <div className="grid gap-2">
            {sectors.map((sector: any, index: number) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div className="font-medium">{sector.name}</div>
                <div className="flex items-center gap-1">
                  <span 
                    className={`font-mono ${sector.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {sector.performance > 0 ? '+' : ''}{sector.performance.toFixed(2)}%
                  </span>
                  {sector.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted-foreground">No sector data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
