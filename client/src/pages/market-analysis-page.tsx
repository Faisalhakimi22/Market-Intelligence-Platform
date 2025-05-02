import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MarketNews, IndustryPerformance, EconomicEvents } from "@/components/market-data";

// Sample data for demonstration - this would come from the API in a real app
const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1000 },
  { name: 'Aug', value: 1200 },
  { name: 'Sep', value: 1300 },
  { name: 'Oct', value: 1100 },
  { name: 'Nov', value: 1400 },
  { name: 'Dec', value: 1600 },
];

export default function MarketAnalysisPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Market Analysis</h2>
          <p className="text-gray-500 dark:text-gray-400">Comprehensive market trend analysis and growth indicators</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <IndustryPerformance />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <MarketNews />
          </div>
          <div>
            <EconomicEvents />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <h3 className="font-medium mb-2">Healthcare Technology Integration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    AI analysis indicates 73% growth potential in telemedicine solutions with integrated diagnostic AI capabilities in rural healthcare markets.
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Confidence: High (92%)</span>
                    <span>Market Readiness: High</span>
                    <span>Competition: Moderate</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md dark:border-gray-700">
                  <h3 className="font-medium mb-2">Remote Patient Monitoring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Growth in remote monitoring solutions has increased by 34% YoY, driven by healthcare provider adoption and insurance reimbursement models.
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Confidence: Medium (78%)</span>
                    <span>Market Readiness: Medium</span>
                    <span>Competition: High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}