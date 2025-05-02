import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, TrendingUp, LineChart, Calculator } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import DashboardLayout from "@/layouts/dashboard-layout";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { DemandForecast } from "@/components/forecasting/demand-forecast";
import { ModelComparison } from "@/components/forecasting/model-comparison";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function ForecastingPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("demand-forecast");
  const [selectedIndustry, setSelectedIndustry] = useState<number | null>(null);
  const [industries, setIndustries] = useState<Array<{id: number, name: string}>>([]);
  const { toast } = useToast();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) setLocation('/auth');
  }, [user, setLocation]);
  
  // Load industries
  useEffect(() => {
    if (user) {
      fetch('/api/industries')
        .then(res => res.json())
        .then(data => {
          setIndustries(data);
          // Select first industry by default
          if (data.length > 0 && !selectedIndustry) {
            setSelectedIndustry(data[0].id);
          }
        })
        .catch(err => {
          console.error('Error loading industries:', err);
          toast({
            title: "Error",
            description: "Failed to load industry data",
            variant: "destructive",
          });
        });
    }
  }, [user]);
  
  const breadcrumbItems = [
    { label: "Dashboard", link: "/" },
    { label: "Forecasting", link: "/forecasting" },
  ];
  
  return (
    <DashboardLayout>
      <div className="px-4 md:px-6 py-4 md:py-6 space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Market Forecasting</h1>
            <p className="text-muted-foreground">
              Predict market trends and analyze future opportunities with AI-powered forecasting models
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={selectedIndustry?.toString() || ""}
              onValueChange={(value) => setSelectedIndustry(parseInt(value))}
            >
              <SelectTrigger className="w-[200px]" disabled={industries.length === 0}>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id.toString()}>
                    {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => setLocation('/')}>
              Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="demand-forecast" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demand-forecast" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Demand Forecast</span>
              <span className="sm:hidden">Forecast</span>
            </TabsTrigger>
            <TabsTrigger value="model-comparison" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Model Comparison</span>
              <span className="sm:hidden">Models</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="demand-forecast" className="py-4">
            <div className="grid grid-cols-1 gap-6">
              {selectedIndustry ? (
                <DemandForecast 
                  industryId={selectedIndustry} 
                  title="Market Demand Forecast"
                />
              ) : (
                <div className="bg-muted/40 rounded-lg p-6 text-center">
                  <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                  <h3 className="text-lg font-medium mb-2">Select an Industry</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose an industry from the dropdown above to view its demand forecast
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="model-comparison">
            <div className="grid grid-cols-1 gap-6 py-4">
              <ModelComparison />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}