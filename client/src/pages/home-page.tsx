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
  
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };
  
  return (
    <DashboardLayout>
      <div className="px-4 md:px-6 py-6 bg-shapes relative min-h-screen overflow-hidden">
        {/* Particle background effect */}
        <div className="particle-container absolute inset-0 -z-10"></div>
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-animated-gradient -z-10 opacity-30"></div>
        
        {/* Futuristic decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse delay-700"></div>
        
        {/* Theme toggle & header section */}
        <div className="flex justify-between items-center mb-6">
          <motion.h1 
            className="text-2xl font-bold text-gradient-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Market Intelligence Dashboard
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neo-brutalism-button px-3 py-2 rounded-lg flex items-center gap-2"
            onClick={toggleTheme}
          >
            <span className="text-sm font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            <span className={`w-6 h-6 rounded-full ${theme === 'dark' ? 'bg-yellow-400' : 'bg-indigo-900'} flex items-center justify-center`}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </motion.button>
        </div>
        
        {/* Industry Selection Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <IndustrySelector 
            industries={industries || []} 
            isLoading={isLoadingIndustries}
            activeIndustryId={activeIndustryId}
            onToggle={handleIndustryToggle}
          />
        </motion.div>
        
        {/* AI Insights Summary */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AIInsightsSummary 
            industryId={activeIndustryId} 
            className="glass-card-premium shadow-blue-glow border border-opacity-20 border-blue-300 dark:border-blue-600"
          />
        </motion.div>
        
        {/* Dashboard Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Market Growth Trends */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-2 group"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <div className="relative h-full overflow-hidden cyberpunk-card">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-900/20"></div>
              <div className="absolute inset-0 border border-cyan-500/20 rounded-xl"></div>
              <div className="corner-accent top-0 left-0"></div>
              <div className="corner-accent top-0 right-0"></div>
              <MarketGrowthChart 
                className="col-span-1 md:col-span-2 p-4 backdrop-blur-sm transition-all duration-300 h-full" 
              />
            </div>
          </motion.div>
          
          {/* Key Opportunities */}
          <motion.div 
            variants={itemVariants}
            className="relative group" 
            whileHover={{ 
              scale: 1.02,
              rotateY: 5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="neo-glass-card relative h-full overflow-hidden">
              <div className="animated-border"></div>
              <OpportunitiesWidget 
                industryId={activeIndustryId} 
                className="p-4 h-full"
              />
            </div>
          </motion.div>
          
          {/* Competitive Intelligence */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-2 group"
            whileHover={{ 
              scale: 1.02, 
              transition: { duration: 0.2 }
            }}
          >
            <div className="holographic-card h-full">
              <CompetitorsWidget 
                industryId={activeIndustryId} 
                className="p-4 h-full" 
              />
            </div>
          </motion.div>
          
          {/* Forecast Widget */}
          <motion.div 
            variants={itemVariants}
            className="group" 
            whileHover={{ 
              scale: 1.03,
              rotateX: 3,
              transition: { duration: 0.2 }
            }}
          >
            <div className="neo-glass-card relative overflow-hidden">
              <div className="tech-pattern"></div>
              <ForecastWidget 
                className="p-4 relative z-10"
              />
            </div>
          </motion.div>
          
          {/* Market Alerts */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 group"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <div className="neural-card relative overflow-hidden">
              <AlertsWidget 
                className="p-4 relative z-10"
              />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Stats Overview Row */}
        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {[
            { title: "Market Size", value: "$8.4B", change: "+14%", isUp: true, icon: "📈" },
            { title: "Growth Rate", value: "22.5%", change: "+3.2%", isUp: true, icon: "🚀" },
            { title: "Competitors", value: "37", change: "+5", isUp: true, icon: "🥊" },
            { title: "Opportunities", value: "12", change: "+3", isUp: true, icon: "💎" }
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="glass-panel p-4 rounded-lg overflow-hidden relative group"
              whileHover={{ 
                scale: 1.05, 
                transition: { duration: 0.2 }
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.isUp ? 'from-green-500/5 to-blue-500/10' : 'from-red-500/5 to-orange-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{stat.icon}</div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">{stat.value}</p>
                <span className={`text-sm px-2 py-1 rounded ${stat.isUp ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} flex items-center`}>
                  {stat.isUp ? '▲ ' : '▼ '}
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer with quick actions */}
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div className="backdrop-blur-md bg-white/5 dark:bg-black/20 rounded-full px-6 py-3 border border-gray-200/20 dark:border-gray-700/20 flex gap-4">
            {['Export', 'Share', 'Print', 'Settings'].map((action, index) => (
              <motion.button
                key={action}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-white/10 dark:hover:bg-black/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {action}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
