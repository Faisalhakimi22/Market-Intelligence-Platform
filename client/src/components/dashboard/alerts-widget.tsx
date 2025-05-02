import { useQuery } from "@tanstack/react-query";
import { Alert } from "@shared/schema";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertTriangle, Eye, LineChart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface AlertsWidgetProps {
  className?: string;
}

export function AlertsWidget({ className }: AlertsWidgetProps) {
  const { user } = useAuth();
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    enabled: !!user,
  });

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 border-b dark:border-gray-700 flex flex-row items-center justify-between space-y-0">
        <h3 className="font-medium">Market Alerts</h3>
        <Button 
          variant="link" 
          className="text-primary-600 dark:text-primary-400 text-xs hover:underline"
        >
          Configure alerts
        </Button>
      </CardHeader>
      
      {isLoading ? (
        <CardContent className="p-0">
          <div className="divide-y dark:divide-gray-700">
            <AlertSkeleton />
            <AlertSkeleton />
            <AlertSkeleton />
          </div>
        </CardContent>
      ) : alerts && alerts.length > 0 ? (
        <>
          <div className="divide-y dark:divide-gray-700">
            {alerts.slice(0, 3).map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
          
          <CardFooter className="p-4 border-t dark:border-gray-700 text-center">
            <Button 
              variant="link" 
              className="w-full text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all alerts ({alerts.length})
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No market alerts found</p>
          <Button variant="secondary">Set up alerts</Button>
        </CardContent>
      )}
    </Card>
  );
}

function AlertItem({ alert }: { alert: Alert }) {
  // Map alert types to icon components
  const getAlertIcon = (iconType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "alert": <AlertTriangle className="text-xl" />,
      "eye": <Eye className="text-xl" />,
      "chart": <LineChart className="text-xl" />
    };
    
    return iconMap[iconType] || <AlertTriangle className="text-xl" />;
  };
  
  // Map impact to color classes
  const getImpactColor = (impact: string) => {
    const impactColorMap: Record<string, string> = {
      "High Impact": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      "Medium Impact": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      "Opportunity": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      "Low Impact": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    };
    
    return impactColorMap[impact] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };
  
  // Map alert type to icon background color
  const getIconBgColor = (type: string) => {
    const typeBgColorMap: Record<string, string> = {
      "Regulatory Change": "bg-red-100 dark:bg-red-900/30 text-red-500",
      "Competitor Activity": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500",
      "Market Opportunity": "bg-green-100 dark:bg-green-900/30 text-green-500"
    };
    
    return typeBgColorMap[type] || "bg-gray-100 dark:bg-gray-800 text-gray-500";
  };
  
  return (
    <div className="p-4 flex items-start hover:bg-gray-50 dark:hover:bg-gray-700/30">
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
        getIconBgColor(alert.type)
      )}>
        {getAlertIcon(alert.iconType)}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{alert.title}</h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">{alert.timeAgo}</span>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {alert.description}
        </p>
        <div className="mt-2 flex items-center">
          <span className={cn(
            "px-2 py-0.5 text-xs rounded-full",
            getImpactColor(alert.impact)
          )}>
            {alert.impact}
          </span>
          <Button 
            variant="link" 
            className="ml-3 text-xs text-primary-600 dark:text-primary-400 hover:underline px-0 py-0 h-auto"
          >
            View details
          </Button>
        </div>
      </div>
    </div>
  );
}

function AlertSkeleton() {
  return (
    <div className="p-4 flex items-start">
      <Skeleton className="flex-shrink-0 w-10 h-10 rounded-full" />
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-3/4" />
        <div className="mt-2 flex items-center">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="ml-3 h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
