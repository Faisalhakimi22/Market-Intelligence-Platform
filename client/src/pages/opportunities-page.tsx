import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { OpportunitiesWidget } from "@/components/dashboard/opportunities-widget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function OpportunitiesPage() {
  const [activeIndustryId, setActiveIndustryId] = useState<number>(1); // Default to Healthcare industry

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Market Opportunities</h2>
          <p className="text-gray-500 dark:text-gray-400">Discover and analyze potential business opportunities</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <OpportunitiesWidget industryId={activeIndustryId} className="" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Deep Dive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 border rounded-lg dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">Telemedicine Platform</h3>
                  <Badge className="bg-gradient-to-r from-green-400 to-blue-500">High Potential</Badge>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  AI-powered remote diagnostics platform combining real-time analysis with medical professional oversight.
                  This opportunity leverages growing demand for accessible healthcare in rural and underserved areas.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Market Size</h4>
                    <p className="font-medium">$4.2B</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Growth Rate</h4>
                    <p className="font-medium">+34% YoY</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Confidence Score</h4>
                    <p className="font-medium">89%</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Competition Level</h4>
                    <p className="font-medium">Medium</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="default">Full Analysis</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <h3 className="font-medium mb-2">Rural Healthcare Access</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    43% of rural healthcare providers report insufficient technology solutions for patient monitoring and diagnostics.
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Market Gap: <span className="font-medium">Very High</span></p>
                </div>
                
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <h3 className="font-medium mb-2">Predictive Analytics for Patient Outcomes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Only 27% of healthcare providers utilize advanced predictive analytics for patient outcome optimization.
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Market Gap: <span className="font-medium">High</span></p>
                </div>
                
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <h3 className="font-medium mb-2">Medical IoT Security</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    68% of medical IoT devices lack adequate security measures according to industry standards.
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Market Gap: <span className="font-medium">Medium-High</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}