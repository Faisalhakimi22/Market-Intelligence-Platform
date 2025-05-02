import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Competitor } from "@shared/schema";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Filter, Star, StarHalf, RefreshCcw } from "lucide-react";

interface CompetitorsWidgetProps {
  industryId: number | null;
  className?: string;
}

export function CompetitorsWidget({ industryId, className }: CompetitorsWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: competitors, isLoading, refetch } = useQuery<Competitor[]>({
    queryKey: [industryId ? `/api/industries/${industryId}/competitors` : null],
    enabled: !!industryId,
  });
  
  const handleRefresh = async () => {
    if (!industryId) return;
    setIsRefreshing(true);
    try {
      // Request live data from the API
      await fetch(`/api/industries/${industryId}/competitors?live=true`)
        .then(res => res.json())
        .then(() => refetch());
    } catch (error) {
      console.error('Error refreshing competitors:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 border-b dark:border-gray-700 flex flex-row items-center justify-between space-y-0">
        <h3 className="font-medium">Competitive Intelligence</h3>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Healthcare Technology</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mr-1"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-48 w-full" />
          </div>
        ) : competitors && competitors.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Market Share</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Growth</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Innovation Index</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Activity</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {competitors.map((competitor) => (
                <CompetitorRow key={competitor.id} competitor={competitor} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No competitor data available</p>
            <Button variant="secondary" size="sm">Add Competitors</Button>
          </div>
        )}
      </div>
      
      {competitors && competitors.length > 0 && (
        <CardFooter className="p-4 border-t dark:border-gray-700 flex justify-end">
          <Button variant="link" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View detailed competitor analysis
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function CompetitorRow({ competitor }: { competitor: Competitor }) {
  // Color mapping based on the competitor.color field
  const getBgColor = (color: string) => {
    const colorMap: Record<string, string> = {
      "blue": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      "purple": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      "red": "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      "green": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      "yellow": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
    };
    
    return colorMap[color] || "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
  };
  
  // Activity type to color mapping
  const getActivityBadgeColor = (activity: string) => {
    const activityMap: Record<string, string> = {
      "New Product": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "Acquisition": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      "AI Investment": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "Partnership": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
    };
    
    return activityMap[activity] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };
  
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-medium", getBgColor(competitor.color))}>
            {competitor.shortName}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium">{competitor.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{competitor.location} · {competitor.employees.toLocaleString()} employees</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${competitor.marketShare}%` }}></div>
        </div>
        <div className="text-xs mt-1">{competitor.marketShare}%</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <ArrowUpIcon className="text-success-500 mr-1 h-4 w-4" />
          <span>{competitor.growth}</span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => {
            if (i < Math.floor(competitor.innovationIndex)) {
              return <Star key={i} className="text-warning-500 h-4 w-4 fill-current" />;
            } else if (i === Math.floor(competitor.innovationIndex) && competitor.innovationIndex % 1 !== 0) {
              return <StarHalf key={i} className="text-warning-500 h-4 w-4 fill-current" />;
            } else {
              return <Star key={i} className="text-gray-300 dark:text-gray-600 h-4 w-4" />;
            }
          })}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        <span className={cn("px-2 py-1 text-xs rounded-full", getActivityBadgeColor(competitor.recentActivity || ""))}>
          {competitor.recentActivity}
        </span>
      </td>
    </tr>
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
