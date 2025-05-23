import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { AlertsWidget } from "@/components/dashboard/alerts-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Filter, Settings } from "lucide-react";

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gradient-primary">Alerts & Notifications</h2>
            <p className="text-muted-foreground">Stay updated with real-time market intelligence</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="glass-input hover:shadow-soft">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="glass-input hover:shadow-soft">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" className="nav-link">All Alerts</TabsTrigger>
              <TabsTrigger value="regulatory" className="nav-link">
                Regulatory
                <Badge variant="secondary" className="ml-2">1</Badge>
              </TabsTrigger>
              <TabsTrigger value="competitor" className="nav-link">
                Competitor
                <Badge variant="secondary" className="ml-2">1</Badge>
              </TabsTrigger>
              <TabsTrigger value="opportunity" className="nav-link">
                Opportunity
                <Badge variant="secondary" className="ml-2">1</Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <AlertsWidget className="glass-card hover-lift" />
            </TabsContent>
            <TabsContent value="regulatory">
              <Card className="glass-card hover-lift">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md dark:border-gray-700 bg-shapes">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center mr-3 glow-purple">
                            <Bell className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <h3 className="font-medium">Regulatory Change Alert</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              FDA announces new guidelines for AI-powered medical diagnostics that may impact product certification timelines.
                            </p>
                          </div>
                        </div>
                        <Badge className="shadow-soft">High Impact</Badge>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                        <Button variant="outline" size="sm" className="glass-input hover:glow-blue">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="competitor">
              <Card className="glass-card hover-lift">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md dark:border-gray-700 bg-shapes">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 glow-blue">
                            <Bell className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Competitor Activity</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              HealthTech Inc. announced a strategic partnership with major cloud provider for AI healthcare solutions.
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="shadow-soft">Medium Impact</Badge>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Yesterday</span>
                        <Button variant="outline" size="sm" className="glass-input hover:glow-blue">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="opportunity">
              <Card className="glass-card hover-lift">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md dark:border-gray-700 bg-shapes">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3 glow-blue">
                            <Bell className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Market Opportunity</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Rural healthcare providers show 43% increase in technology adoption budgets for 2024, creating new market opportunities.
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-500 shadow-soft">Opportunity</Badge>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                        <Button variant="outline" size="sm" className="glass-input hover:glow-blue">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="glass-card-premium card-3d">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Alert Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="regulatory-alerts">Regulatory Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts about regulatory changes</p>
                  </div>
                  <Switch id="regulatory-alerts" defaultChecked className="glow-blue" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="competitor-alerts">Competitor Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts about competitor activities</p>
                  </div>
                  <Switch id="competitor-alerts" defaultChecked className="glow-blue" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="market-alerts">Market Opportunity Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts about new market opportunities</p>
                  </div>
                  <Switch id="market-alerts" defaultChecked className="glow-blue" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="trend-alerts">Market Trend Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts about emerging market trends</p>
                  </div>
                  <Switch id="trend-alerts" defaultChecked className="glow-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card-premium card-3d">
            <CardHeader>
              <CardTitle className="text-gradient-secondary">Notification Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked className="glow-purple" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="platform-notifications">Platform Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts within the platform</p>
                  </div>
                  <Switch id="platform-notifications" defaultChecked className="glow-purple" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mobile-notifications">Mobile Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts on your mobile device</p>
                  </div>
                  <Switch id="mobile-notifications" className="glow-purple" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="slack-notifications">Slack Integration</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts in your Slack workspace</p>
                  </div>
                  <Switch id="slack-notifications" className="glow-purple" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
