import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { CompetitorsWidget } from "@/components/dashboard/competitors-widget";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function CompetitorIntelligencePage() {
  const [activeIndustryId, setActiveIndustryId] = useState<number>(1); // Default to Healthcare industry

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Competitor Intelligence</h2>
          <p className="text-gray-500 dark:text-gray-400">Analysis of market competitors and strategic positioning</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <CompetitorsWidget industryId={activeIndustryId} className="" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Competitor Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">HealthTech Inc.</h3>
                    <Badge variant="outline">New Product</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Launched AI-powered diagnostic platform targeting rural healthcare providers.
                  </p>
                  <div className="text-xs text-gray-500">2 days ago</div>
                </div>
                
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">MediData Systems</h3>
                    <Badge variant="outline">Strategic Partnership</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Announced partnership with major cloud provider for AI healthcare solutions.
                  </p>
                  <div className="text-xs text-gray-500">1 week ago</div>
                </div>
                
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">CareSync</h3>
                    <Badge variant="outline">Acquisition</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Acquired telemedicine startup Telehealth Solutions for $120M.
                  </p>
                  <div className="text-xs text-gray-500">2 weeks ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Competitive Advantage Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <h3 className="font-medium mb-2">Technology Adoption</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Your position: <span className="font-medium">Medium-High</span>
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your organization ranks in the top 30% for technology adoption compared to competitors.</p>
                </div>
                
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <h3 className="font-medium mb-2">Market Innovation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Your position: <span className="font-medium">Medium</span>
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your organization ranks in the mid-range for innovation compared to competitors.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}