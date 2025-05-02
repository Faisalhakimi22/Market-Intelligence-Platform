import DashboardLayout from "@/layouts/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { Industry } from "@shared/schema";
import { useEffect, useState } from "react";
import { IndustrySelector } from "@/components/dashboard/industry-selector";
import { AIInsightsSummary } from "@/components/dashboard/ai-insights-summary";
import { MarketGrowthChart } from "@/components/dashboard/market-growth-chart";
import { OpportunitiesWidget } from "@/components/dashboard/opportunities-widget";
import { CompetitorsWidget } from "@/components/dashboard/competitors-widget";
import { ForecastWidget } from "@/components/dashboard/forecast-widget";
import { AlertsWidget } from "@/components/dashboard/alerts-widget";

export default function HomePage() {
  const [activeIndustryId, setActiveIndustryId] = useState<number | null>(null);
  
  // Fetch industries
  const { data: industries, isLoading: isLoadingIndustries } = useQuery<Industry[]>({
    queryKey: ["/api/industries"],
  });
  
  // Set active industry once data is loaded
  useEffect(() => {
    if (industries && industries.length > 0 && !activeIndustryId) {
      // Find the first active industry or default to the first one
      const activeIndustry = industries.find(i => i.isActive) || industries[0];
      setActiveIndustryId(activeIndustry.id);
    }
  }, [industries, activeIndustryId]);
  
  // Toggle industry active state
  const handleIndustryToggle = (industryId: number) => {
    setActiveIndustryId(industryId);
  };
  
  return (
    <DashboardLayout>
      <div className="px-4 md:px-6 py-6">
        {/* Industry Selection Bar */}
        <IndustrySelector 
          industries={industries || []} 
          isLoading={isLoadingIndustries}
          activeIndustryId={activeIndustryId}
          onToggle={handleIndustryToggle}
        />
        
        {/* AI Insights Summary */}
        <AIInsightsSummary industryId={activeIndustryId} />
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Market Growth Trends */}
          <MarketGrowthChart className="col-span-1 md:col-span-2" />
          
          {/* Key Opportunities */}
          <OpportunitiesWidget industryId={activeIndustryId} />
          
          {/* Competitive Intelligence */}
          <CompetitorsWidget industryId={activeIndustryId} className="col-span-1 md:col-span-2" />
          
          {/* Forecast Widget */}
          <ForecastWidget />
          
          {/* Market Alerts */}
          <AlertsWidget className="lg:col-span-2" />
        </div>
      </div>
    </DashboardLayout>
  );
}
