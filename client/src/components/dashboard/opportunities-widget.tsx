import { useQuery } from "@tanstack/react-query";
import { Opportunity } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface OpportunitiesWidgetProps {
  industryId: number | null;
  className?: string;
}

export function OpportunitiesWidget({ industryId, className }: OpportunitiesWidgetProps) {
  const { data: opportunities, isLoading } = useQuery<Opportunity[]>({
    queryKey: [industryId ? `/api/industries/${industryId}/opportunities` : null],
    enabled: !!industryId,
  });
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 border-b dark:border-gray-700 flex flex-row items-center justify-between space-y-0">
        <h3 className="font-medium">Key Opportunities</h3>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : opportunities && opportunities.length > 0 ? (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
            <div className="mt-4 text-center">
              <Button variant="link" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                View all opportunities
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No opportunities found</p>
            <Button variant="secondary" size="sm">Add New Opportunity</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  // Map status to color classes
  const statusColorMap: Record<string, string> = {
    "High potential": "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300",
    "Medium potential": "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    "Emerging": "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300"
  };
  
  // Map score to color classes
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success-500";
    if (score >= 70) return "text-primary-500";
    return "text-warning-500";
  };
  
  return (
    <div className="relative p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{opportunity.name}</h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{opportunity.description}</p>
        </div>
        <div className={cn("relative w-12 h-12", getScoreColor(opportunity.score))}>
          <div className="absolute inset-0" style={{
            background: `conic-gradient(currentColor ${opportunity.score}%, transparent 0)`,
            borderRadius: "9999px",
            mask: "radial-gradient(white 55%, transparent 0)",
            WebkitMask: "radial-gradient(white 55%, transparent 0)"
          }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">{opportunity.score}%</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center text-xs">
        <span className={cn("px-2 py-1 rounded-full", statusColorMap[opportunity.status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300")}>
          {opportunity.status}
        </span>
        <span className="ml-2 text-gray-500 dark:text-gray-400">Market size: {opportunity.marketSize}</span>
      </div>
    </div>
  );
}
