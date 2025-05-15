import { ReactNode, useState, useEffect } from "react";
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
  ChevronRight,
  ArrowUpRight,
  LayoutDashboard,
  Zap,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
    
    // Load sidebar preference
    const collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    setSidebarCollapsed(collapsed);
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
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
    localStorage.setItem('sidebar-collapsed', (!isSidebarCollapsed).toString());
  };
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Market Analysis", href: "/market-analysis", icon: Search },
    { name: "Forecasting", href: "/forecasting", icon: TrendingUp },
    { name: "Competitors", href: "/competitor-intelligence", icon: Users },
    { name: "Opportunities", href: "/opportunities", icon: Lightbulb },
    { name: "Data Integrations", href: "/data-integrations", icon: Database },
    { name: "Alerts", href: "/alerts", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div className="flex h-screen bg-background transition-all duration-300">
      {/* Desktop sidebar */}
      <aside 
        className={`hidden md:flex md:flex-col ${isSidebarCollapsed ? 'md:w-20' : 'md:w-72'} glass-card-premium shadow-blue-glow relative z-20 transition-all duration-300 border-r border-white/10 dark:border-white/5`}
      >
        <div className="flex flex-col flex-1 h-full overflow-y-auto">
          {/* Logo area */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} h-16 flex-shrink-0 px-4 relative`}>
            {!isSidebarCollapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-blue-glow">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-heading font-bold text-gradient-primary">InsightAI</span>
              </Link>
            )}
            
            {isSidebarCollapsed && (
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-blue-glow">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            )}
            
            <button 
              onClick={toggleSidebar}
              className={`${isSidebarCollapsed ? 'mx-auto mt-4' : 'absolute -right-3 top-1/2 -translate-y-1/2'} h-6 w-6 rounded-full bg-background border border-border shadow-soft flex items-center justify-center`}
            >
              <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-8 space-y-1.5">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`group flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-3 
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-blue-glow' 
                      : 'text-foreground hover:bg-white/10 dark:hover:bg-white/5'} 
                    rounded-xl transition-all duration-300 relative`}
                >
                  <span className={`${isActive ? 'animate-pulse-glow' : ''} flex items-center justify-center`}>
                    <item.icon className={`h-5 w-5 ${isSidebarCollapsed ? '' : 'mr-3'} ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  </span>
                  
                  {!isSidebarCollapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                  
                  {isActive && !isSidebarCollapsed && (
                    <span className="absolute right-3">
                      <ArrowUpRight className="h-3 w-3 text-primary-foreground" />
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-6 -translate-x-3 translate-y-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                      <div className="bg-popover text-popover-foreground px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-soft-lg">
                        {item.name}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* User profile section */}
          <div className={`px-3 pb-5 pt-2 ${isSidebarCollapsed ? 'text-center' : ''}`}>
            {!isSidebarCollapsed && (
              <div className="rounded-xl glass-panel p-4 shadow-inner-glow">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-semibold shadow-purple-glow">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.name || user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Enterprise Plan
                    </p>
                  </div>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-white/10 dark:hover:bg-white/5"
                      onClick={toggleDarkMode}
                    >
                      {darkMode ? (
                        <Sun className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-white/10 dark:hover:bg-white/5"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {isSidebarCollapsed && (
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-semibold shadow-purple-glow">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white/10 dark:hover:bg-white/5"
                    onClick={toggleDarkMode}
                  >
                    {darkMode ? (
                      <Sun className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white/10 dark:hover:bg-white/5"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            )}
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

      {/* Mobile sidebar menu */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-full md:hidden glass-card-premium transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out`}
        style={{ maxWidth: "280px" }}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-blue-glow">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-heading font-bold text-gradient-primary">InsightAI</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="hover:bg-white/10 dark:hover:bg-white/5 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-4 py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              className="glass-input py-2 pl-10 pr-4 rounded-xl w-full text-sm"
            />
          </div>
        </div>
        
        <nav className="px-2 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-blue-glow" 
                    : "text-foreground hover:bg-white/10 dark:hover:bg-white/5"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {item.name}
                {isActive && (
                  <ArrowUpRight className="h-3 w-3 ml-auto text-primary-foreground" />
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-xl glass-panel p-4 shadow-inner-glow">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-semibold shadow-purple-glow">
                {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {user?.name || user?.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  Enterprise Plan
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-white/10 dark:hover:bg-white/5"
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
              className="w-full justify-center mt-3 rounded-lg border-border hover:border-primary"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between h-16 z-10 flex-shrink-0 px-4 glass-panel shadow-soft">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="hover:bg-white/10 dark:hover:bg-white/5 rounded-full mr-3"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-primary flex items-center justify-center shadow-blue-glow">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-heading font-bold text-gradient-primary">InsightAI</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="bg-animated-gradient min-h-screen">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              {/* Page header */}
              <div className="hidden md:flex md:items-center md:justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-heading font-bold">
                      {navigation.find(item => item.href === location)?.name || "Dashboard"}
                    </h1>
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="glass-input py-2 pl-10 pr-4 rounded-xl text-sm w-64"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full relative"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </Button>
                </div>
              </div>
              
              {/* Page content */}
              <div className="space-y-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
