import DashboardLayout from "@/layouts/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { Industry } from "@shared/schema";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IndustrySelector } from "@/components/dashboard/industry-selector";
import { AIInsightsSummary } from "@/components/dashboard/ai-insights-summary";
import { MarketGrowthChart } from "@/components/dashboard/market-growth-chart";
import { OpportunitiesWidget } from "@/components/dashboard/opportunities-widget";
import { CompetitorsWidget } from "@/components/dashboard/competitors-widget";
import { ForecastWidget } from "@/components/dashboard/forecast-widget";
import { AlertsWidget } from "@/components/dashboard/alerts-widget";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, LayoutGridIcon, BarChartIcon, AlertTriangleIcon, TrendingUpIcon } from "lucide-react";

export default function HomePage() {
  const [activeIndustryId, setActiveIndustryId] = useState<number | null>(null);
  const { theme, setTheme } = useTheme();
  
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 260,
        damping: 20
      } 
    }
  };
  
  return (
    <DashboardLayout>
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden">
        {/* Header Bar */}
        <motion.div 
          className="flex justify-between items-center pt-6 px-8 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Market Intelligence
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Get real-time insights into your market performance
            </p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700 font-medium flex items-center gap-2"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </motion.button>
          </div>
        </motion.div>
        
        <div className="px-8">
          {/* Industry Selection Bar */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <IndustrySelector 
              industries={industries || []} 
              isLoading={isLoadingIndustries}
              activeIndustryId={activeIndustryId}
              onToggle={handleIndustryToggle}
            />
          </motion.div>
          
          {/* Main Content Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {/* Top Row - AI Insights Summary */}
            <motion.div variants={itemVariants}>
              <div className="p-6 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl shadow-lg">
                <AIInsightsSummary 
                  industryId={activeIndustryId} 
                  className="text-white" 
                />
              </div>
            </motion.div>
            
            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <motion.div 
                variants={itemVariants} 
                className="lg:col-span-2 space-y-6"
              >
                {/* Market Growth Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Market Growth Trends</h2>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-md font-medium text-slate-600 dark:text-slate-300">Monthly</button>
                      <button className="px-3 py-1 text-sm rounded-md font-medium text-slate-600 dark:text-slate-300">Quarterly</button>
                      <button className="px-3 py-1 text-sm rounded-md font-medium text-slate-600 dark:text-slate-300">Yearly</button>
                    </div>
                  </div>
                  <div className="p-5">
                    <MarketGrowthChart className="h-72" />
                  </div>
                </div>

                {/* Competitive Intelligence */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <LayoutGridIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Competitive Intelligence</h2>
                  </div>
                  <div className="p-5">
                    <CompetitorsWidget 
                      industryId={activeIndustryId} 
                      className="h-full" 
                    />
                  </div>
                </div>
              </motion.div>
              
              {/* Right Column */}
              <motion.div 
                variants={itemVariants} 
                className="space-y-6"
              >
                {/* Key Opportunities */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <BarChartIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Key Opportunities</h2>
                  </div>
                  <div className="p-5">
                    <OpportunitiesWidget 
                      industryId={activeIndustryId} 
                      className="h-full"
                    />
                  </div>
                </div>
                
                {/* Forecast Widget */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <TrendingUpIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Market Forecast</h2>
                  </div>
                  <div className="p-5">
                    <ForecastWidget 
                      className="h-full"
                    />
                  </div>
                </div>
                
                {/* Market Alerts */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <AlertTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Market Alerts</h2>
                  </div>
                  <div className="p-5">
                    <AlertsWidget 
                      className="h-full"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Stats Overview Row */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2"
            >
              {[
                { title: "Market Size", value: "$8.4B", change: "+14%", isUp: true, color: "blue" },
                { title: "Growth Rate", value: "22.5%", change: "+3.2%", isUp: true, color: "emerald" },
                { title: "Competitors", value: "37", change: "+5", isUp: true, color: "violet" },
                { title: "Opportunities", value: "12", change: "+3", isUp: true, color: "amber" }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <div className="flex items-end justify-between mt-2">
                    <p className={`text-2xl font-semibold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                      {stat.value}
                    </p>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      stat.isUp 
                        ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' 
                        : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30'
                    }`}>
                      {stat.isUp ? '▲ ' : '▼ '}
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Footer with quick actions */}
          <motion.div 
            className="mt-8 pb-8 flex flex-wrap justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Last updated: Today at 14:35 PM
            </div>
            
            <div className="flex gap-3 mt-4 sm:mt-0">
              {['Export Report', 'Share Dashboard', 'Print View', 'Settings'].map((action, index) => (
                <button
                  key={action}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
