import React from "react";
import DashboardLayout from "../home-page";
import { motion } from "framer-motion";

export default function MarketAnalysisPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-3xl font-bold">Market Analysis</h1>
          <p className="text-muted-foreground">Track trends and analyze market movements</p>
        </motion.div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Filters */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Region</label>
                  <select className="w-full h-10 px-3 rounded-lg text-sm bg-secondary/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mt-1">
                    <option>All Regions</option>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Asia Pacific</option>
                    <option>Latin America</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Timeframe</label>
                  <select className="w-full h-10 px-3 rounded-lg text-sm bg-secondary/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mt-1">
                    <option>Last 12 Months</option>
                    <option>Last 6 Months</option>
                    <option>Last 3 Months</option>
                    <option>Year to Date</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Market Segment</label>
                  <select className="w-full h-10 px-3 rounded-lg text-sm bg-secondary/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mt-1">
                    <option>All Segments</option>
                    <option>Enterprise</option>
                    <option>SMB</option>
                    <option>Consumer</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full bg-primary text-primary-foreground rounded-lg py-2">
                  Apply Filters
                </button>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
              <div className="space-y-3">
                {[
                  { name: "Market Size", value: "$4.2B" },
                  { name: "CAGR", value: "14.3%" },
                  { name: "Market Share", value: "22%" },
                  { name: "YoY Growth", value: "+12.7%" }
                ].map((metric, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm text-muted-foreground">{metric.name}</span>
                    <span className="text-sm font-medium">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 rounded-xl border border-border/50 bg-card p-6 h-[600px] overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5"></div>
            <h2 className="text-lg font-semibold mb-4 relative z-10">Market Trend Analysis</h2>
            
            {/* Tabs */}
            <div className="flex gap-4 border-b border-border/30 mb-6 relative z-10">
              {["Overview", "Competitive", "Growth", "Segments"].map((tab, idx) => (
                <button 
                  key={idx} 
                  className={`text-sm px-2 py-2 border-b-2 transition-all ${idx === 0 ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Chart */}
            <div className="h-80 w-full flex items-end gap-1 justify-between relative z-10">
              {Array.from({ length: 24 }, (_, i) => {
                const height = 30 + Math.random() * 60;
                return (
                  <div key={i} className="h-full flex-1 flex flex-col justify-end">
                    <div 
                      className={`bg-gradient-to-t ${i > 12 ? 'from-purple-500/80 to-indigo-500/40' : 'from-blue-500/70 to-teal-500/30'} rounded-sm`} 
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex gap-6 justify-center mt-4 text-sm text-muted-foreground relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500"></div>
                <span>Previous Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <span>Current Period</span>
              </div>
            </div>
            
            {/* Data Table */}
            <div className="mt-8 border border-border/30 rounded-lg overflow-hidden relative z-10">
              <table className="min-w-full divide-y divide-border/30">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Growth</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customers</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border/20">
                  {["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023"].map((period, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20">
                      <td className="px-4 py-3 text-sm font-medium">{period}</td>
                      <td className="px-4 py-3 text-sm">${(800 + Math.floor(Math.random() * 300)).toLocaleString()}k</td>
                      <td className="px-4 py-3 text-sm text-green-500">+{(5 + Math.floor(Math.random() * 15))}%</td>
                      <td className="px-4 py-3 text-sm">{(1200 + Math.floor(Math.random() * 800)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
} 
