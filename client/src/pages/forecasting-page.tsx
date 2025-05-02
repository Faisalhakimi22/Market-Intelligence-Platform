import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { ForecastWidget } from "@/components/dashboard/forecast-widget";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Sample data for demonstration
const forecastData = [
  { month: 'Jan', actual: 40, predicted: 30, pessimistic: 25, optimistic: 35 },
  { month: 'Feb', actual: 30, predicted: 25, pessimistic: 20, optimistic: 30 },
  { month: 'Mar', actual: 60, predicted: 65, pessimistic: 55, optimistic: 75 },
  { month: 'Apr', actual: 80, predicted: 85, pessimistic: 75, optimistic: 95 },
  { month: 'May', actual: 70, predicted: 75, pessimistic: 65, optimistic: 85 },
  { month: 'Jun', actual: 90, predicted: 95, pessimistic: 85, optimistic: 105 },
  { month: 'Jul', actual: null, predicted: 105, pessimistic: 95, optimistic: 115 },
  { month: 'Aug', actual: null, predicted: 120, pessimistic: 110, optimistic: 130 },
  { month: 'Sep', actual: null, predicted: 130, pessimistic: 120, optimistic: 140 },
  { month: 'Oct', actual: null, predicted: 110, pessimistic: 100, optimistic: 120 },
  { month: 'Nov', actual: null, predicted: 140, pessimistic: 130, optimistic: 150 },
  { month: 'Dec', actual: null, predicted: 160, pessimistic: 150, optimistic: 170 },
];

export default function ForecastingPage() {
  const [timeframe, setTimeframe] = useState("1-year");
  
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Market Forecasting</h2>
          <p className="text-gray-500 dark:text-gray-400">Predictive analysis and growth projections</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <ForecastWidget className="" />
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Healthcare Market Growth Forecast</CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6-month">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="2-year">2 Years</SelectItem>
                    <SelectItem value="5-year">5 Years</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={forecastData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36}/>
                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Actual" />
                    <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Predicted" />
                    <Line type="monotone" dataKey="pessimistic" stroke="#f97316" strokeWidth={2} dot={{ r: 0 }} strokeDasharray="5 5" name="Pessimistic" />
                    <Line type="monotone" dataKey="optimistic" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 0 }} strokeDasharray="5 5" name="Optimistic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Predicted Growth Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary-500 mb-2">+27.3%</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Annual growth rate for telemedicine market over the next 12 months</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Size Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary-500 mb-2">$6.8B</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Projected market size for healthcare AI solutions by end of next year</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Forecast Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary-500 mb-2">86%</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Confidence score based on historical data and market indicators</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}