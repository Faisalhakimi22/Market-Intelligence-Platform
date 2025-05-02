import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BarChartHorizontal, 
  UserSearch, 
  LightbulbIcon, 
  LineChart, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

const NavItem = ({ icon, label, active, onClick, badge }: NavItemProps) => (
  <a 
    href="#" 
    onClick={(e) => { 
      e.preventDefault(); 
      onClick && onClick();
    }}
    className={cn(
      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
      active 
        ? "bg-primary-500 text-white" 
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    )}
  >
    <span className="mr-3 text-lg">{icon}</span>
    {label}
    {badge && (
      <Badge variant="destructive" className="ml-auto">
        {badge}
      </Badge>
    )}
  </a>
);

const IndustryItem = ({ name, color, active, onClick }: { name: string; color: string; active?: boolean; onClick?: () => void; }) => (
  <a 
    href="#" 
    onClick={(e) => { 
      e.preventDefault(); 
      onClick && onClick();
    }}
    className={cn(
      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
      active 
        ? "bg-gray-100 dark:bg-gray-700" 
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    )}
  >
    <span className={`w-2 h-2 mr-3 bg-${color} rounded-full`}></span>
    {name}
  </a>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Sidebar */}
      <aside 
        className={cn(
          "w-full md:w-64 md:flex-shrink-0 md:fixed md:h-full md:overflow-y-auto bg-white dark:bg-gray-800 shadow-lg md:shadow-md z-10 transition-all",
          isSidebarOpen 
            ? "h-screen fixed inset-0 z-40" 
            : "h-auto relative hidden md:block"
        )}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-md bg-primary-500 flex items-center justify-center text-white">
              <LightbulbIcon className="h-5 w-5" />
            </div>
            <span className="font-heading font-semibold text-lg">MarketInsight AI</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="h-full flex flex-col">
          {/* Logo and Brand (desktop) */}
          <div className="hidden md:flex items-center space-x-3 p-4 border-b dark:border-gray-700">
            <div className="h-8 w-8 rounded-md bg-primary-500 flex items-center justify-center text-white">
              <LightbulbIcon className="h-5 w-5" />
            </div>
            <span className="font-heading font-semibold text-lg">MarketInsight AI</span>
          </div>
          
          {/* User Profile */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-2 overflow-y-auto">
            <div className="space-y-1">
              <NavItem 
                icon={<LayoutDashboard />} 
                label="Dashboard" 
                active={true} 
              />
              <NavItem 
                icon={<BarChartHorizontal />} 
                label="Market Analysis" 
              />
              <NavItem 
                icon={<UserSearch />} 
                label="Competitor Intelligence" 
              />
              <NavItem 
                icon={<LightbulbIcon />} 
                label="Opportunities" 
              />
              <NavItem 
                icon={<LineChart />} 
                label="Forecasting" 
              />
              <NavItem 
                icon={<FileText />} 
                label="Reports" 
              />
              <NavItem 
                icon={<Bell />} 
                label="Alerts" 
                badge={3}
              />
            </div>
            
            <div className="mt-8 pt-4 border-t dark:border-gray-700">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Industry Focus
              </h3>
              <div className="mt-1 space-y-1">
                <IndustryItem name="Healthcare" color="primary-400" active={true} />
                <IndustryItem name="Technology" color="secondary-500" />
                <IndustryItem name="Education" color="success-500" />
              </div>
            </div>
          </nav>
          
          {/* Settings and Theme Toggle */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-heading font-semibold">Market Intelligence Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="relative flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full">
                <span className="sr-only">Search</span>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full">
                <span className="sr-only">Notifications</span>
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive"></span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full"
                onClick={handleLogout}
              >
                <span className="sr-only">Log out</span>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
