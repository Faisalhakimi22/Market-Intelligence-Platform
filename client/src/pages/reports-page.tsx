import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Eye } from "lucide-react";

const reports = [
  {
    id: 1,
    title: "Healthcare Market Analysis Q1 2024",
    date: "March 31, 2024",
    type: "Market Analysis",
    pages: 24
  },
  {
    id: 2,
    title: "Telemedicine Opportunity Deep Dive",
    date: "February 15, 2024",
    type: "Opportunity Analysis",
    pages: 18
  },
  {
    id: 3,
    title: "Competitor Intelligence Report - Healthcare",
    date: "January 25, 2024",
    type: "Competitor Analysis",
    pages: 32
  },
  {
    id: 4,
    title: "AI in Healthcare - Trend Analysis",
    date: "January 10, 2024",
    type: "Trend Analysis",
    pages: 15
  },
  {
    id: 5,
    title: "Q4 2023 Market Forecast Report",
    date: "December 20, 2023",
    type: "Market Forecast",
    pages: 26
  }
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Reports</h2>
            <p className="text-gray-500 dark:text-gray-400">Access and manage analytical reports</p>
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.pages}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Market Analysis Template</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive market analysis with trends and opportunities</p>
                  </div>
                  <Button variant="outline" size="sm">Use</Button>
                </div>
                
                <div className="p-4 border rounded-md dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Competitor Intelligence Template</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">In-depth analysis of market competitors</p>
                  </div>
                  <Button variant="outline" size="sm">Use</Button>
                </div>
                
                <div className="p-4 border rounded-md dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Market Forecast Template</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Predictive market analysis and growth projections</p>
                  </div>
                  <Button variant="outline" size="sm">Use</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Report Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-center text-muted-foreground">Analytics visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}