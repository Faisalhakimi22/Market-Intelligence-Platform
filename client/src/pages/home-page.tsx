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
      <div className="px-4 md:px-6 py-6 bg-shapes relative">
        {/* Add subtle animated background gradient */}
        <div className="absolute inset-0 bg-animated-gradient -z-10 opacity-30"></div>
        
        {/* Industry Selection Bar */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4 text-gradient-primary">Market Intelligence Dashboard</h1>
          <IndustrySelector 
            industries={industries || []} 
            isLoading={isLoadingIndustries}
            activeIndustryId={activeIndustryId}
            onToggle={handleIndustryToggle}
          />
        </div>
        
        {/* AI Insights Summary */}
        <div className="mb-6">
          <AIInsightsSummary 
            industryId={activeIndustryId} 
            className="glass-card-premium shadow-blue-glow"
          />
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Market Growth Trends */}
          <MarketGrowthChart 
            className="col-span-1 md:col-span-2 glass-card hover-lift transition-all duration-300" 
          />
          
          {/* Key Opportunities */}
          <OpportunitiesWidget 
            industryId={activeIndustryId} 
            className="glass-card hover-lift transition-all duration-300"
          />
          
          {/* Competitive Intelligence */}
          <CompetitorsWidget 
            industryId={activeIndustryId} 
            className="col-span-1 md:col-span-2 glass-card hover-lift transition-all duration-300 animated-gradient-border" 
          />
          
          {/* Forecast Widget */}
          <ForecastWidget 
            className="glass-card hover-lift transition-all duration-300"
          />
          
          {/* Market Alerts */}
          <AlertsWidget 
            className="lg:col-span-2 glass-card hover-lift transition-all duration-300"
          />
        </div>
        
        {/* Stats Overview Row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Market Size", value: "$8.4B", change: "+14%", isUp: true },
            { title: "Growth Rate", value: "22.5%", change: "+3.2%", isUp: true },
            { title: "Competitors", value: "37", change: "+5", isUp: true },
            { title: "Opportunities", value: "12", change: "+3", isUp: true }
          ].map((stat, index) => (
            <div key={index} className="glass-panel p-4 rounded-lg hover-lift transition-all duration-300">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <span className={`text-sm ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
