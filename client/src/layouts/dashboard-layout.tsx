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
  Sun,
  Sparkles,
  Star
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

  // Get first two letters of name for the avatar
  const getInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return user?.username?.substring(0, 2).toUpperCase() || "FI";
  };
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-background/95 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        {darkMode && (
          <>
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary/20 rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-secondary/30 rounded-full"></div>
          </>
        )}
      </div>

      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-72 glass-panel shadow-lg backdrop-blur-lg bg-background/50 border-r border-border/50 z-10 relative">
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center h-20 flex-shrink-0 px-6 border-b border-border/50">
            <Link href="/" className="flex items-center text-xl font-heading font-bold">
              <div className="relative">
                <BarChart3 className="h-7 w-7 mr-3 text-primary" />
                <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-primary" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">ForecastroAI</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md" 
                      : "text-foreground hover:bg-secondary/30 hover:translate-x-1"
                  }`}
                >
                  <div className={`flex items-center justify-center ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}>
                    <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <span className="ml-3">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto">
                      <Star className="h-3 w-3 text-primary-foreground/70" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 p-5 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-semibold shadow-md">
                  {getInitials()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || user?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role || "Analyst"}
                  </p>
                </div>
              </div>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-secondary/30"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-indigo-400" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg hover:bg-secondary/30 ml-1"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
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
        className={`fixed inset-y-0 left-0 z-50 w-full md:hidden glass-panel bg-background/90 backdrop-blur-lg transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out`}
        style={{ maxWidth: "280px" }}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-border/50">
          <Link href="/" className="flex items-center text-xl font-heading font-bold">
            <div className="relative">
              <BarChart3 className="h-7 w-7 mr-3 text-primary" />
              <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-primary" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">ForecastroAI</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="hover:bg-secondary/30 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="px-4 py-5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-80px)]">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md" 
                    : "text-foreground hover:bg-secondary/30 hover:translate-x-1"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={`flex items-center justify-center ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <span className="ml-3">{item.name}</span>
                {isActive && (
                  <div className="ml-auto">
                    <Star className="h-3 w-3 text-primary-foreground/70" />
                  </div>
                )}
              </Link>
            );
          })}
          <div className="pt-5 mt-5 border-t border-border/50">
            <div className="flex items-center justify-between px-3 py-3 bg-secondary/10 rounded-xl">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-semibold shadow-md">
                  {getInitials()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || user?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role || "Analyst"}
                  </p>
                </div>
              </div>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-secondary/30"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-indigo-400" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start mt-3 border-border/50 hover:border-primary hover:bg-secondary/20 rounded-xl"
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
        <header className="md:hidden flex items-center h-16 flex-shrink-0 px-4 border-b border-border/40 glass-panel bg-background/50 backdrop-blur-md">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="hover:bg-secondary/30 rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 text-lg font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">ForecastroAI</div>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-secondary/30"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-400" />
              )}
            </Button>
          </div>
        </header>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="relative">
            {/* Background patterns */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>
            
            {/* Content area */}
            <div className="py-8 px-6 sm:px-8 lg:px-10 relative z-10">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
