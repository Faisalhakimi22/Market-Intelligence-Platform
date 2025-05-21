import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { OpportunitiesWidget } from "@/components/dashboard/opportunities-widget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Lightbulb, 
  Star, 
  BarChart2, 
  Filter, 
  Download, 
  Share2, 
  Users, 
  Zap, 
  PieChart, 
  Search,
  ArrowRight,
  Globe
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function OpportunitiesPage() {
  const [activeIndustryId, setActiveIndustryId] = useState<number>(1); // Default to Healthcare industry
  const [filterActive, setFilterActive] = useState(false);
  const [sortBy, setSortBy] = useState("potential");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample industries data
  const industries = [
    { id: 1, name: "Healthcare", count: 14, icon: "🏥" },
    { id: 2, name: "Fintech", count: 9, icon: "💰" },
    { id: 3, name: "E-commerce", count: 11, icon: "🛒" },
    { id: 4, name: "Education", count: 7, icon: "🎓" },
    { id: 5, name: "Clean Energy", count: 6, icon: "⚡" },
    { id: 6, name: "Agriculture", count: 8, icon: "🌱" },
  ];

  // Sample opportunities data
  const opportunities = [
    {
      id: 1,
      title: "Telemedicine Platform",
      description: "AI-powered remote diagnostics platform combining real-time analysis with medical professional oversight.",
      industry: "Healthcare",
      potentialScore: 87,
      marketSize: "$4.2B",
      growthRate: "+34% YoY",
      confidenceScore: 89,
      competitionLevel: "Medium",
      tags: ["AI", "Remote Care", "Diagnostics"],
      gapScore: 85,
      badge: "High Potential",
      badgeColor: "from-green-400 to-blue-500",
      readiness: 72
    },
    {
      id: 2,
      title: "Predictive Patient Analytics",
      description: "Machine learning system for predicting patient outcomes and treatment effectiveness.",
      industry: "Healthcare",
      potentialScore: 79,
      marketSize: "$2.8B",
      growthRate: "+28% YoY",
      confidenceScore: 76,
      competitionLevel: "Medium-High",
      tags: ["Predictive Analytics", "ML", "Patient Care"],
      gapScore: 73,
      badge: "Medium Potential",
      badgeColor: "from-blue-400 to-indigo-500",
      readiness: 65
    },
    {
      id: 3,
      title: "Medical IoT Security Platform",
      description: "Comprehensive security solution for medical IoT devices with real-time threat detection.",
      industry: "Healthcare",
      potentialScore: 82,
      marketSize: "$3.5B",
      growthRate: "+31% YoY",
      confidenceScore: 84,
      competitionLevel: "Low",
      tags: ["IoT", "Security", "Healthcare"],
      gapScore: 65,
      badge: "High Potential",
      badgeColor: "from-green-400 to-blue-500",
      readiness: 58
    }
  ];

  // Sample gaps data
  const marketGaps = [
    {
      id: 1,
      title: "Rural Healthcare Access",
      description: "43% of rural healthcare providers report insufficient technology solutions for patient monitoring and diagnostics.",
      percentage: 85,
      rating: "Very High",
      industry: "Healthcare"
    },
    {
      id: 2,
      title: "Predictive Analytics for Patient Outcomes",
      description: "Only 27% of healthcare providers utilize advanced predictive analytics for patient outcome optimization.",
      percentage: 73,
      rating: "High",
      industry: "Healthcare"
    },
    {
      id: 3,
      title: "Medical IoT Security",
      description: "68% of medical IoT devices lack adequate security measures according to industry standards.",
      percentage: 65,
      rating: "Medium-High",
      industry: "Healthcare"
    }
  ];

  // Sort opportunities
  const sortedOpportunities = [...opportunities].sort((a, b) => {
    if (sortBy === "potential") return b.potentialScore - a.potentialScore;
    if (sortBy === "readiness") return b.readiness - a.readiness;
    if (sortBy === "confidence") return b.confidenceScore - a.confidenceScore;
    return 0;
  });

  const industry = industries.find(ind => ind.id === activeIndustryId);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Market Opportunities
            </h1>
            <p className="text-muted-foreground">
              Discover and analyze high-potential business opportunities powered by ForecastroAI
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search opportunities</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={filterActive ? "secondary" : "outline"} 
                    size="sm" 
                    className="h-9 rounded-lg"
                    onClick={() => setFilterActive(!filterActive)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter opportunities</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 rounded-lg">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export opportunities data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button size="sm" className="h-9 rounded-lg">
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate New
            </Button>
          </div>
        </div>
        
        {/* Industry Selection */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/40 shadow-sm">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                Industry Focus
              </h2>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {industries.length} Industries
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustryId(ind.id)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300 ${
                    activeIndustryId === ind.id
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/40 hover:border-primary/40 hover:bg-secondary/20"
                  }`}
                >
                  {activeIndustryId === ind.id && (
                    <div className="absolute top-2 right-2">
                      <Star className="h-3 w-3 text-primary fill-primary" />
                    </div>
                  )}
                  <span className="text-xl mb-1">{ind.icon}</span>
                  <span className="font-medium text-sm">{ind.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{ind.count} opps</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="opportunities" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="bg-card/50 backdrop-blur-sm border border-border/40">
              <TabsTrigger value="opportunities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                <Lightbulb className="h-4 w-4 mr-2" />
                Opportunities
              </TabsTrigger>
              <TabsTrigger value="gaps" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                <TrendingUp className="h-4 w-4 mr-2" />
                Market Gaps
              </TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                <BarChart2 className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card/50 backdrop-blur-sm border border-border/40 text-sm rounded-md p-1 px-2 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="potential">Potential Score</option>
                <option value="readiness">Market Readiness</option>
                <option value="confidence">Confidence Score</option>
              </select>
            </div>
          </div>
          
          <TabsContent value="opportunities" className="space-y-6 mt-6">
            {/* OpportunitiesWidget for future integration */}
            {/* <OpportunitiesWidget industryId={activeIndustryId} className="" /> */}
            
            {/* Top Opportunity Highlight */}
            <div className="relative overflow-hidden p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white">
                      Top Opportunity
                    </Badge>
                    <Badge variant="outline" className="bg-background/50">
                      {industry?.name}
                    </Badge>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3">
                    {opportunities[0].title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-4 max-w-3xl">
                    {opportunities[0].description} This opportunity leverages growing demand for accessible healthcare in rural and underserved areas, creating significant market potential.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border/30">
                      <h4 className="text-xs uppercase text-muted-foreground font-medium mb-1">Market Size</h4>
                      <p className="font-semibold text-lg">{opportunities[0].marketSize}</p>
                    </div>
                    <div className="bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border/30">
                      <h4 className="text-xs uppercase text-muted-foreground font-medium mb-1">Growth Rate</h4>
                      <p className="font-semibold text-lg text-green-500">{opportunities[0].growthRate}</p>
                    </div>
                    <div className="bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border/30">
                      <h4 className="text-xs uppercase text-muted-foreground font-medium mb-1">Confidence</h4>
                      <p className="font-semibold text-lg">{opportunities[0].confidenceScore}%</p>
                    </div>
                    <div className="bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border/30">
                      <h4 className="text-xs uppercase text-muted-foreground font-medium mb-1">Competition</h4>
                      <p className="font-semibold text-lg">{opportunities[0].competitionLevel}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opportunities[0].tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-background/70 backdrop-blur-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button>
                      Full Analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="w-full md:w-48 flex-shrink-0">
                  <div className="bg-background/70 backdrop-blur-sm rounded-lg border border-border/30 p-4 flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-3">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 animate-pulse"></div>
                      <div className="absolute inset-3 rounded-full bg-background flex items-center justify-center">
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                          {opportunities[0].potentialScore}%
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-center">Potential Score</p>
                    <div className="w-full mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Market Readiness</span>
                      <span>{opportunities[0].readiness}%</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary to-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${opportunities[0].readiness}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Other Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOpportunities.slice(1).map((opportunity) => (
                <Card key={opportunity.id} className="overflow-hidden border-border/40 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">{opportunity.title}</CardTitle>
                        <CardDescription className="mt-1">{opportunity.industry}</CardDescription>
                      </div>
                      <Badge className={`bg-gradient-to-r ${opportunity.badgeColor} text-white`}>
                        {opportunity.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {opportunity.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-xs uppercase text-muted-foreground font-medium mb-1">Market Size</h4>
                        <p className="font-medium">{opportunity.marketSize}</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase text-muted-foreground font-medium mb-1">Growth Rate</h4>
                        <p className="font-medium text-green-500">{opportunity.growthRate}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Potential Score</span>
                        <span className="font-medium">{opportunity.potentialScore}%</span>
                      </div>
                      <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-blue-500 h-1.5 rounded-full" 
                          style={{ width: `${opportunity.potentialScore}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {opportunity.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-secondary/50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Share2 className="h-3.5 w-3.5 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                        View Details
                        <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="gaps" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Market Gap Analysis</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {industry?.name}
                  </Badge>
                </div>
                <CardDescription>
                  Identified gaps in the market based on demand-supply analysis and competitive landscape
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {marketGaps.map((gap) => (
                    <div key={gap.id} className="p-4 rounded-lg border border-border/40 bg-card/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{gap.title}</h3>
                        <Badge variant="secondary" className="bg-secondary/70">
                          {gap.rating}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {gap.description}
                      </p>
                      <div className="w-full bg-secondary/30 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${gap.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>Gap Score</span>
                        <span className="font-medium">{gap.percentage}%</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
                          Generate Ideas
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Users className="h-3.5 w-3.5 mr-1.5" />
                          Competitors
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gap Opportunity Matrix</CardTitle>
                <CardDescription>
                  Visual representation of market gaps and their relationship to business opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Interactive matrix visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence Insights</CardTitle>
                <CardDescription>
                  AI-generated insights based on market data analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-500/20 p-1.5 rounded-full">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <h3 className="font-medium">Growth Opportunity</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The telemedicine sector is experiencing accelerated growth (34% YoY) due to increased adoption in rural areas and regulatory changes favoring remote healthcare solutions.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-500/20 p-1.5 rounded-full">
                        <Users className="h-4 w-4 text-blue-500" />
                      </div>
                      <h3 className="font-medium">Competitive Landscape</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The market for AI-powered diagnostic tools is surprisingly fragmented with no dominant player holding more than 15% market share, creating opportunity for new entrants with advanced technology.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-500/20 p-1.5 rounded-full">
                        <Zap className="h-4 w-4 text-amber-500" />
                      </div>
                      <h3 className="font-medium">Market Prediction</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ForecastroAI predicts a 42% increase in demand for integrated healthcare solutions that combine telemedicine with remote monitoring devices over the next 24 months.
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" className="mt-6 w-full">
                  Generate Comprehensive Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
