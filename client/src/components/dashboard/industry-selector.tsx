import { useMutation } from "@tanstack/react-query";
import { Industry } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PlusIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndustrySelectorProps {
  industries: Industry[];
  isLoading: boolean;
  activeIndustryId: number | null;
  onToggle: (industryId: number) => void;
}

export function IndustrySelector({ industries, isLoading, activeIndustryId, onToggle }: IndustrySelectorProps) {
  const updateIndustryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Industry> }) => {
      const res = await apiRequest("PATCH", `/api/industries/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/industries"] });
    }
  });
  
  const handleToggle = (industry: Industry) => {
    updateIndustryMutation.mutate({
      id: industry.id,
      data: { isActive: !industry.isActive }
    });
    onToggle(industry.id);
  };
  
  const colorMap: Record<string, string> = {
    "primary-400": "bg-primary-400 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    "secondary-500": "bg-secondary-500 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300",
    "success-500": "bg-success-500 text-success-700 dark:bg-success-900/30 dark:text-success-300"
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Industry Focus</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Select industries to analyze</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-28 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </>
            ) : (
              <>
                {industries.map((industry) => (
                  <Button
                    key={industry.id}
                    variant="outline"
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium",
                      industry.id === activeIndustryId
                        ? industry.color && colorMap[industry.color] || "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                    onClick={() => handleToggle(industry)}
                  >
                    {industry.name} {industry.id === activeIndustryId && <CheckIcon className="h-4 w-4 ml-1" />}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> Add More
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
