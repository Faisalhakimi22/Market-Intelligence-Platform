import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bell, 
  Settings, 
  Search,
  Menu,
  X,
  LogOut,
  Database,
  Lightbulb,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Initialize theme based on user preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Market Analysis", href: "/market-analysis", icon: Search },
    { name: "Forecasting", href: "/forecasting", icon: TrendingUp },
    { name: "Competitors", href: "/competitor-intelligence", icon: Users },
    { name: "Opportunities", href: "/opportunities", icon: Lightbulb },
    { name: "Data Integrations", href: "/data-integrations", icon: Database },
    { name: "Alerts", href: "/alerts", icon: Bell },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 glass-panel shadow-soft-lg z-10 relative">
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-border">
            <Link href="/" className="flex items-center text-lg font-heading font-semibold text-gradient-primary">
              <BarChart3 className="h-6 w-6 mr-2 text-primary" />
              <span>MarketInsightAI</span>
            </Link>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-blue-glow" 
                      : "text-foreground hover:bg-secondary/50 hover:translate-x-1"
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center justify-between">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold shadow-blue-glow">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || user?.username}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground hover:text-primary mt-1 px-2 py-1"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign out
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-full md:hidden glass-panel transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out`}
        style={{ maxWidth: "280px" }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href="/" className="flex items-center text-lg font-heading font-semibold text-gradient-primary">
            <BarChart3 className="h-6 w-6 mr-2 text-primary" />
            <span>MarketInsightAI</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="hover:bg-secondary/50 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="px-2 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-64px)]">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-blue-glow" 
                    : "text-foreground hover:bg-secondary/50 hover:translate-x-1"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-border">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold shadow-blue-glow">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                </div>
                <span className="ml-2 text-sm font-medium text-foreground">
                  {user?.name || user?.username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleDarkMode}
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start mt-2 border-border hover:border-primary hover:bg-secondary/50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="md:hidden flex items-center h-16 flex-shrink-0 px-4 border-b border-border glass-panel shadow-soft">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="hover:bg-secondary/50 rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 text-lg font-heading font-semibold text-gradient-primary">ForecastroAI</div>
        </header>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="bg-shapes relative">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
