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
import { TrendingUp, Users, Target, Bell, BarChart2, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";

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

  // Get current industry name for display
  const currentIndustry = industries?.find(i => i.id === activeIndustryId)?.name || "Loading...";
  
  return (
    <DashboardLayout>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="px-6 py-8 relative z-10">
          {/* Header Section with Breadcrumb and Refresh */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <div className="flex items-center text-xs text-slate-400 mb-2">
                <span>Dashboard</span>
                <span className="mx-2">/</span>
                <span className="text-white">{currentIndustry}</span>
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">
                Market Intelligence Hub
              </h1>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <button className="flex items-center text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-md border border-slate-700 transition-all duration-200">
                <RefreshCw size={14} className="mr-2" />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
          
          {/* Industry Selection with modern design */}
          <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="h-6 w-1 bg-blue-500 rounded-full mr-3"></div>
              <h2 className="text-lg font-semibold text-white">Industry Focus</h2>
            </div>
            <IndustrySelector 
              industries={industries || []} 
              isLoading={isLoadingIndustries}
              activeIndustryId={activeIndustryId}
              onToggle={handleIndustryToggle}
            />
          </div>
          
          {/* Stats Overview Cards - Now at the top for immediate insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { title: "Market Size", value: "$8.4B", change: "+14%", isUp: true, icon: <BarChart2 size={18} /> },
              { title: "Growth Rate", value: "22.5%", change: "+3.2%", isUp: true, icon: <TrendingUp size={18} /> },
              { title: "Competitors", value: "37", change: "+5", isUp: true, icon: <Users size={18} /> },
              { title: "Opportunities", value: "12", change: "+3", isUp: true, icon: <Target size={18} /> }
            ].map((stat, index) => (
              <div key={index} className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/50 shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 rounded-lg bg-slate-700/50">
                    {stat.icon}
                  </div>
                  <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.isUp ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {stat.isUp ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-sm text-slate-400 font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
          
          {/* AI Insights Section with glowing effect */}
          <div className="mb-8">
            <AIInsightsSummary 
              industryId={activeIndustryId} 
              className="bg-gradient-to-r from-blue-900/40 to-violet-900/40 backdrop-blur-sm border border-blue-700/30 rounded-xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
            />
          </div>
          
          {/* Main Dashboard Grid - Redesigned with consistency */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Market Growth Trends */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg hover:border-slate-600/80 transform hover:-translate-y-1 transition-all duration-300">
                <div className="p-5 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp size={18} className="text-blue-400" />
                      <h3 className="font-semibold text-white">Market Growth Trends</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600">Weekly</button>
                      <button className="px-2 py-1 text-xs rounded bg-blue-600 text-white">Monthly</button>
                      <button className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600">Yearly</button>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <MarketGrowthChart />
                </div>
              </div>
            </div>
            
            {/* Key Opportunities */}
            <div>
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg h-full hover:border-slate-600/80 transform hover:-translate-y-1 transition-all duration-300">
                <div className="p-5 border-b border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <Target size={18} className="text-emerald-400" />
                    <h3 className="font-semibold text-white">Key Opportunities</h3>
                  </div>
                </div>
                <div className="p-5">
                  <OpportunitiesWidget industryId={activeIndustryId} />
                </div>
              </div>
            </div>
            
            {/* Competitive Intelligence */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg hover:border-slate-600/80 transform hover:-translate-y-1 transition-all duration-300">
                <div className="p-5 border-b border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <Users size={18} className="text-purple-400" />
                    <h3 className="font-semibold text-white">Competitive Landscape</h3>
                  </div>
                </div>
                <div className="p-5">
                  <CompetitorsWidget industryId={activeIndustryId} />
                </div>
              </div>
            </div>
            
            {/* Forecast Widget */}
            <div>
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg h-full hover:border-slate-600/80 transform hover:-translate-y-1 transition-all duration-300">
                <div className="p-5 border-b border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <BarChart2 size={18} className="text-amber-400" />
                    <h3 className="font-semibold text-white">Market Forecast</h3>
                  </div>
                </div>
                <div className="p-5">
                  <ForecastWidget />
                </div>
              </div>
            </div>
          </div>
          
          {/* Market Alerts - Full width at bottom */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg hover:border-slate-600/80 transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-5 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell size={18} className="text-red-400" />
                  <h3 className="font-semibold text-white">Market Alerts & Notifications</h3>
                </div>
                <span className="bg-red-600/30 text-red-400 text-xs px-2 py-1 rounded-full">4 New</span>
              </div>
            </div>
            <div className="p-5">
              <AlertsWidget />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
