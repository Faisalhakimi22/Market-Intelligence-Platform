import DashboardLayout from "@/layouts/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { Industry } from "@shared/schema";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndustrySelector } from "@/components/dashboard/industry-selector";
import { AIInsightsSummary } from "@/components/dashboard/ai-insights-summary";
import { MarketGrowthChart } from "@/components/dashboard/market-growth-chart";
import { OpportunitiesWidget } from "@/components/dashboard/opportunities-widget";
import { CompetitorsWidget } from "@/components/dashboard/competitors-widget";
import { ForecastWidget } from "@/components/dashboard/forecast-widget";
import { AlertsWidget } from "@/components/dashboard/alerts-widget";
import { RegionalMap } from "@/components/dashboard/regional-map";
import { InvestmentOpportunities } from "@/components/dashboard/investment-opportunities";
import { RiskAssessment } from "@/components/dashboard/risk-assessment";
import { MarketSentimentAnalysis } from "@/components/dashboard/market-sentiment";
import { TrendingTopics } from "@/components/dashboard/trending-topics";
import { useInView } from "react-intersection-observer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Globe,
  Target,
  AlertTriangle,
  Share2,
  Download,
  RefreshCcw,
  Filter,
  Calendar,
  MessageSquare,
  Users
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ViewSwitcher } from "@/components/dashboard/view-switcher";
import { TimeRangeFilter } from "@/components/dashboard/time-range-filter";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [activeIndustryId, setActiveIndustryId] = useState(null);
  const [viewMode, setViewMode] = useState("comprehensive");
  const [timeRange, setTimeRange] = useState("6m");
  const [currentTab, setCurrentTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dynamic refs for scroll animations
  const [topSectionRef, topSectionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [middleSectionRef, middleSectionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [bottomSectionRef, bottomSectionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Fetch industries
  const { data: industries, isLoading: isLoadingIndustries } = useQuery({
    queryKey: ["/api/industries"],
    staleTime: 300000, // 5 minutes
  });
  
  // Fetch market data based on active industry and time range
  const { data: marketData, isLoading: isLoadingMarketData, refetch: refetchMarketData } = useQuery({
    queryKey: ["/api/market-data", activeIndustryId, timeRange],
    enabled: !!activeIndustryId,
    staleTime: 600000, // 10 minutes
  });
  
  // Fetch real-time alerts
  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ["/api/alerts", activeIndustryId],
    enabled: !!activeIndustryId,
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Compute alert severity
  const alertSeverity = useMemo(() => {
    if (!alerts || alerts.length === 0) return "low";
    const highPriorityAlerts = alerts.filter(alert => alert.priority === "high");
    if (highPriorityAlerts.length > 2) return "critical";
    if (highPriorityAlerts.length > 0) return "high";
    return "medium";
  }, [alerts]);
  
  // Set active industry once data is loaded
  useEffect(() => {
    if (industries && industries.length > 0 && !activeIndustryId) {
      // Find the first active industry or default to the first one
      const activeIndustry = industries.find(i => i.isActive) || industries[0];
      setActiveIndustryId(activeIndustry.id);
    }
  }, [industries, activeIndustryId]);
  
  // Toggle industry active state
  const handleIndustryToggle = (industryId) => {
    setActiveIndustryId(industryId);
  };
  
  // Refresh data handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchMarketData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };
  
  // Get current active industry name
  const activeIndustryName = useMemo(() => {
    if (!industries || !activeIndustryId) return "Loading...";
    const industry = industries.find(i => i.id === activeIndustryId);
    return industry ? industry.name : "Unknown Industry";
  }, [industries, activeIndustryId]);
  
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
        
        {/* Header section with controls */}
        <div 
          ref={topSectionRef}
          className="flex flex-col gap-4 mb-6"
        >
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col">
              <motion.h1 
                className="text-3xl font-bold text-gradient-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                Market Intelligence Hub
              </motion.h1>
              <motion.p
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Real-time insights for {activeIndustryName}
              </motion.p>
            </div>
            
            <div className="flex items-center gap-3">
              <TimeRangeFilter 
                value={timeRange} 
                onChange={setTimeRange} 
              />
              
              <ViewSwitcher 
                value={viewMode} 
                onChange={setViewMode} 
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter size={16} />
                    <span className="hidden md:inline">Filters</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Market Size</DropdownMenuItem>
                  <DropdownMenuItem>Growth Rate</DropdownMenuItem>
                  <DropdownMenuItem>Competitive Landscape</DropdownMenuItem>
                  <DropdownMenuItem>Technology Trends</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className={`${isRefreshing ? "animate-spin" : ""}`}
              >
                <RefreshCcw size={18} />
              </Button>
            </div>
          </motion.div>
          
          {/* Industry Selection Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={topSectionInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <IndustrySelector 
              industries={industries || []} 
              isLoading={isLoadingIndustries}
              activeIndustryId={activeIndustryId}
              onToggle={handleIndustryToggle}
            />
          </motion.div>
        </div>
        
        {/* Tabs Navigation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={topSectionInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="w-full md:w-auto flex overflow-x-auto hide-scrollbar">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span>Trends</span>
              </TabsTrigger>
              <TabsTrigger value="competitors" className="flex items-center gap-2">
                <Users size={16} />
                <span>Competitors</span>
              </TabsTrigger>
              <TabsTrigger value="regional" className="flex items-center gap-2">
                <Globe size={16} />
                <span>Regional</span>
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Sentiment</span>
                <Badge className="ml-1 bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">New</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Tab Content */}
            {currentTab === "overview" && (
              <>
                {/* AI Insights Summary */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <AIInsightsSummary 
                    industryId={activeIndustryId} 
                    className="glass-card-premium shadow-blue-glow border border-opacity-20 border-blue-300"
                  />
                </motion.div>
                
                {/* Dashboard Grid */}
                <div ref={middleSectionRef}>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate={middleSectionInView ? "show" : "hidden"}
                  >
                    {/* Market Growth Trends */}
                    <motion.div 
                      variants={itemVariants}
                      className="col-span-1 md:col-span-6 lg:col-span-8 group"
                      whileHover={{ 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="relative h-full overflow-hidden cyberpunk-card">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-900/20"></div>
                        <div className="absolute inset-0 border border-cyan-500/20 rounded-xl"></div>
                        <div className="corner-accent top-0 left-0"></div>
                        <div className="corner-accent top-0 right-0"></div>
                        <MarketGrowthChart 
                          timeRange={timeRange}
                          industryId={activeIndustryId}
                          className="p-4 backdrop-blur-sm transition-all duration-300 h-full" 
                        />
                      </div>
                    </motion.div>
                    
                    {/* Key Opportunities */}
                    <motion.div 
                      variants={itemVariants}
                      className="col-span-1 md:col-span-6 lg:col-span-4 relative group" 
                      whileHover={{ 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="neo-glass-card relative h-full overflow-hidden">
                        <div className="animated-border"></div>
                        <OpportunitiesWidget 
                          industryId={activeIndustryId} 
                          timeRange={timeRange}
                          className="p-4 h-full"
                        />
                      </div>
                    </motion.div>
                    
                    {/* Competitive Intelligence */}
                    <motion.div 
                      variants={itemVariants}
                      className="col-span-1 md:col-span-3 lg:col-span-4 group"
                      whileHover={{ 
                        scale: 1.01, 
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
                    
                    {/* Risk Assessment - NEW */}
                    <motion.div 
                      variants={itemVariants}
                      className="col-span-1 md:col-span-3 lg:col-span-4 group" 
                      whileHover={{ 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="neo-glass-card relative overflow-hidden border border-red-300/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 to-orange-900/10"></div>
                        <RiskAssessment 
                          industryId={activeIndustryId}
                          className="p-4 relative z-10"
                        />
                      </div>
                    </motion.div>
                    
                    {/* Market Forecast */}
                    <motion.div 
                      variants={itemVariants}
                      className="col-span-1 md:col-span-3 lg:col-span-4 group" 
                      whileHover={{ 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="neo-glass-card relative overflow-hidden">
                        <div className="tech-pattern"></div>
                        <ForecastWidget 
                          industryId={activeIndustryId}
                          timeRange={timeRange}
                          className="p-4 relative z-10"
                        />
                      </div>
                    </motion.div>
                    
                    {/* Market Alerts */}
                    <motion.div 
                      variants={itemVariants}
                      className="col-span-1 md:col-span-3 lg:col-span-8 group"
                      whileHover={{ 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className={`neural-card relative overflow-hidden ${
                        alertSeverity === "critical" ? "alert-critical-pulse" : 
                        alertSeverity === "high" ? "alert-high-pulse" : ""
                      }`}>
                        <AlertsWidget 
                          industryId={activeIndustryId}
                          className="p-4 relative z-10"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </>
            )}
            
            {currentTab === "trends" && (
              <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
                {/* Trending Topics - NEW */}
                <div className="col-span-1 md:col-span-6 lg:col-span-12">
                  <div className="neo-glass-card overflow-hidden">
                    <TrendingTopics 
                      industryId={activeIndustryId}
                      timeRange={timeRange}
                      className="p-4"
                    />
                  </div>
                </div>
                
                {/* Market Sentiment Analysis - NEW */}
                <div className="col-span-1 md:col-span-6 lg:col-span-8">
                  <div className="holographic-card">
                    <MarketSentimentAnalysis 
                      industryId={activeIndustryId}
                      timeRange={timeRange}
                      className="p-4"
                    />
                  </div>
                </div>
                
                {/* Investment Opportunities - NEW */}
                <div className="col-span-1 md:col-span-6 lg:col-span-4">
                  <div className="cyberpunk-card">
                    <InvestmentOpportunities 
                      industryId={activeIndustryId}
                      className="p-4"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {currentTab === "competitors" && (
              <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
                <div className="col-span-1 md:col-span-6 lg:col-span-12">
                  <div className="neo-glass-card p-4">
                    <h3 className="text-xl font-bold mb-4">Competitive Landscape</h3>
                    {/* Enhanced competitors visualization would go here */}
                    <div className="aspect-video bg-gray-100/10 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Comprehensive competitor analysis visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentTab === "regional" && (
              <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
                {/* Regional Market Map - NEW */}
                <div className="col-span-1 md:col-span-6 lg:col-span-12">
                  <div className="holographic-card">
                    <RegionalMap 
                      industryId={activeIndustryId}
                      className="p-4" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {currentTab === "sentiment" && (
              <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
                <div className="col-span-1 md:col-span-6 lg:col-span-12">
                  <div className="neural-card p-4">
                    <h3 className="text-xl font-bold mb-4">Market Sentiment Analysis</h3>
                    <div className="aspect-video bg-gray-100/10 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Detailed sentiment analysis dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Stats Overview Row */}
        <div ref={bottomSectionRef}>
          <motion.div 
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={bottomSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
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
                  scale: 1.03, 
                  transition: { duration: 0.2 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={bottomSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
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
        </div>

        {/* Footer with quick actions */}
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={bottomSectionInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="backdrop-blur-md bg-white/5 rounded-full px-6 py-3 border border-gray-200/20 flex gap-4">
            <motion.button
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-white/10 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={16} />
              <span>Export</span>
            </motion.button>
            <motion.button
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-white/10 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={16} />
              <span>Share</span>
            </motion.button>
            <motion.button
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-white/10 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar size={16} />
              <span>Schedule</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
