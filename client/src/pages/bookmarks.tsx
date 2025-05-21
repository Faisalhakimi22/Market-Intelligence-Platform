import React from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { motion } from "framer-motion";
import { Bookmark, Star, FileText, TrendingUp, BarChart3, Calendar } from "lucide-react";

export default function BookmarksPage() {
  const bookmarkedItems = [
    { 
      id: 1, 
      title: "Q3 Market Analysis Report", 
      type: "Report", 
      dateAdded: "3 days ago", 
      category: "Market Analysis",
      icon: FileText
    },
    { 
      id: 2, 
      title: "Competitor Landscape", 
      type: "Dashboard", 
      dateAdded: "1 week ago", 
      category: "Competitors",
      icon: BarChart3
    },
    { 
      id: 3, 
      title: "Revenue Forecast 2024", 
      type: "Forecast", 
      dateAdded: "2 weeks ago", 
      category: "Forecasting",
      icon: TrendingUp
    },
    { 
      id: 4, 
      title: "Market Trends Analysis", 
      type: "Report", 
      dateAdded: "3 weeks ago", 
      category: "Market Analysis",
      icon: FileText
    },
    { 
      id: 5, 
      title: "Quarterly Business Review", 
      type: "Report", 
      dateAdded: "1 month ago", 
      category: "Reports",
      icon: Calendar
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Bookmarks</h1>
            <p className="text-muted-foreground">Your saved reports, analyses and dashboards</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="h-10 rounded-lg bg-secondary/40 border border-border/30 px-3 text-sm">
              <option>All Items</option>
              <option>Reports</option>
              <option>Dashboards</option>
              <option>Forecasts</option>
            </select>
            
            <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm">
              New Collection
            </button>
          </div>
        </motion.div>
        
        {/* Bookmarks List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-border/50 bg-card overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/30 bg-secondary/20 text-sm text-muted-foreground font-medium">
            <div className="col-span-6">Item</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Added</div>
          </div>
          
          <div className="divide-y divide-border/20">
            {bookmarkedItems.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * idx }}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/10 cursor-pointer group"
              >
                <div className="col-span-6 flex items-center">
                  <div className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center mr-3 text-muted-foreground">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate pr-4">{item.title}</p>
                  </div>
                  <Star className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">{item.type}</div>
                <div className="col-span-2 text-sm">
                  <span className="bg-secondary/40 rounded-full px-2 py-1 text-xs">
                    {item.category}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">{item.dateAdded}</div>
              </motion.div>
            ))}
          </div>
          
          {bookmarkedItems.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Bookmark reports, dashboards, and analyses to access them quickly from this page.
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Collections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Market Research", count: 5, color: "bg-blue-500" },
              { name: "Competitor Analysis", count: 3, color: "bg-purple-500" },
              { name: "Presentations", count: 2, color: "bg-amber-500" }
            ].map((collection, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * idx + 0.3 }}
                className="rounded-xl border border-border/50 bg-card p-4 hover:bg-secondary/10 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${collection.color} flex items-center justify-center text-white`}>
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground">{collection.count} items</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 