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
  ChevronDown,
  Globe,
  ArrowRight,
  MessageSquare,
  Star,
  LayoutGrid,
  Zap,
  FileText,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New market report available", time: "2h ago", read: false },
    { id: 2, title: "Competitor launched new product", time: "5h ago", read: false },
    { id: 3, title: "Your forecast report is ready", time: "1d ago", read: true }
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
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
    { name: "Dashboard", href: "/", icon: LayoutGrid },
    { name: "Market Analysis", href: "/market-analysis", icon: Globe },
    { name: "Forecasting", href: "/forecasting", icon: TrendingUp },
    { name: "Competitors", href: "/competitor-intelligence", icon: Users },
    { name: "Opportunities", href: "/opportunities", icon: Lightbulb },
    { name: "Data Integrations", href: "/data-integrations", icon: Database },
  ];
  
  const secondaryNavigation = [
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { name: "Settings", href: "/settings", icon: Settings },
  ];
  
  const quickActions = [
    { name: "New Report", icon: FileText, color: "bg-blue-500" },
    { name: "Competitor Analysis", icon: Users, color: "bg-purple-500" },
    { name: "Market Alert", icon: Bell, color: "bg-amber-500" },
    { name: "Share Insights", icon: MessageSquare, color: "bg-green-500" }
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      setIsUserMenuOpen(false);
      setIsSearchOpen(false);
    }
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (!isUserMenuOpen) {
      setIsNotificationsOpen(false);
      setIsSearchOpen(false);
    }
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsNotificationsOpen(false);
      setIsUserMenuOpen(false);
    } else {
      setSearchQuery("");
    }
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Animation variants
  const sidebarVariants = {
    hidden: { x: -280 },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 500, damping: 30 } }
  };
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-background/95">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      </div>

      {/* Sidebar for desktop */}
      <motion.aside 
        className="hidden md:flex md:flex-col md:w-72 glass-panel shadow-soft-xl z-10 relative border-r border-border/30"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-border/30">
            <Link href="/" className="flex items-center text-lg font-heading font-bold text-gradient-primary">
              <div className="mr-3 h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white">
                <Zap className="h-4 w-4" />
              </div>
              <span>MarketInsightAI</span>
            </Link>
          </div>
          
          {/* Quick actions panel */}
          <div className="p-4 border-b border-border/30">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quick Actions</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, idx) => (
                <Button 
                  key={action.name} 
                  variant="ghost" 
                  size="sm" 
                  className="flex flex-col items-center justify-center h-20 border border-border/50 rounded-xl bg-background/40 hover:bg-background/80 transition-all hover:scale-105"
                >
                  <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center text-white mb-2`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium">{action.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Search bar */}
          <div className="px-4 pt-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-secondary/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                onClick={toggleSearch}
              />
            </div>
          </div>
          
          {/* Main navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 px-2">Main</h3>
              <div className="space-y-1">
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
                      {item.name === "Market Analysis" && (
                        <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">New</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 px-2">General</h3>
              <div className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-secondary text-foreground" 
                          : "text-foreground hover:bg-secondary/50 hover:translate-x-1"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Pro features banner */}
            <div className="mt-6 px-2">
              <div className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 p-0.5">
                <div className="bg-background/90 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-amber-400" />
                    <h4 className="text-sm font-medium">Upgrade to Pro</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Unlock premium features and get unlimited access</p>
                  <Button size="sm" className="w-full justify-between bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                    <span>Go Premium</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </nav>
          
          {/* User profile */}
          <div className="flex-shrink-0 border-t border-border/30 p-4">
            <div className="w-full" onClick={toggleUserMenu}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-blue-glow">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">
                      {user?.name || user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDarkMode();
                  }}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-indigo-400" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* User dropdown menu */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  className="absolute bottom-20 left-4 right-4 bg-background/95 border border-border/50 rounded-lg shadow-lg p-2 z-50 backdrop-blur-md"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                >
                  <div className="p-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-md cursor-pointer">
                    Your Profile
                  </div>
                  <div className="p-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-md cursor-pointer">
                    Account Settings
                  </div>
                  <div className="p-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-md cursor-pointer">
                    Help Center
                  </div>
                  <div className="border-t border-border/50 my-1"></div>
                  <div 
                    className="p-2 text-sm font-medium text-rose-500 hover:bg-rose-500/10 rounded-md cursor-pointer"
                    onClick={handleLogout}
                  >
                    Sign out
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        <motion.div 
          className={`fixed inset-y-0 left-0 z-50 w-full md:hidden glass-panel transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-all duration-300 ease-in-out`}
          style={{ maxWidth: "280px" }}
          initial="hidden"
          animate={isMobileMenuOpen ? "visible" : "hidden"}
          variants={sidebarVariants}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/" className="flex items-center text-lg font-heading font-bold text-gradient-primary">
              <div className="mr-2 h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white">
                <Zap className="h-3.5 w-3.5" />
              </div>
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
          
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-secondary/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          <nav className="px-2 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-64px)]">
            <div className="p-2">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 px-2">Main</h3>
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-blue-glow" 
                        : "text-foreground hover:bg-secondary/50 hover:translate-x-1"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    {item.name}
                    {item.name === "Market Analysis" && (
                      <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">New</span>
                    )}
                  </Link>
                );
              })}
            </div>
            
            <div className="p-2">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 px-2">General</h3>
              {secondaryNavigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${
                      isActive 
                        ? "bg-secondary text-foreground" 
                        : "text-foreground hover:bg-secondary/50 hover:translate-x-1"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="p-2">
              <div className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 p-0.5">
                <div className="bg-background/90 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-amber-400" />
                    <h4 className="text-sm font-medium">Upgrade to Pro</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Unlock premium features and get unlimited access</p>
                  <Button size="sm" className="w-full justify-between bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                    <span>Go Premium</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="pt-4 mt-2 border-t border-border mx-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-blue-glow">
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
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-indigo-400" />
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
        </motion.div>
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border/30 bg-background/80 px-4 backdrop-blur sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="md:hidden hover:bg-secondary/50 rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumbs - only visible on desktop */}
          <div className="hidden md:flex items-center text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Dashboard</span>
            {location !== "/" && (
              <>
                <span className="mx-2">/</span>
                <span>{location.substring(1).split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</span>
              </>
            )}
          </div>

          {/* Page title - mobile only */}
          <div className="md:hidden text-lg font-heading font-bold text-gradient-primary">MarketInsightAI</div>

          <div className="flex flex-1 items-center justify-end gap-x-4 self-stretch">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Search trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={toggleSearch}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notification button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground relative"
                onClick={toggleNotifications}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-primary text-xs font-medium text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* User menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-x-2 hover:bg-secondary/50 rounded-lg"
                onClick={toggleUserMenu}
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>

        {/* Search overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm p-4 sm:p-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInVariants}
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Search</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSearch}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search for reports, markets, competitors..." 
                    className="w-full h-12 pl-10 pr-4 rounded-lg text-lg bg-secondary/40 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                
                {/* Quick access */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Searches</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["Market growth 2023", "Competitor analysis", "AI trends", "Consumer behavior"].map((item) => (
                      <div key={item} className="flex items-center p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 cursor-pointer">
                        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Reports</h3>
                  <div className="space-y-2">
                    {["Q3 Market Analysis", "Competitor Landscape 2023", "Growth Opportunities"].map((item) => (
                      <div key={item} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 cursor-pointer">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-sm">{item}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notifications dropdown */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <motion.div 
              className="absolute top-16 right-4 sm:right-6 z-40 w-80 bg-background/95 border border-border/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-md"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
            >
              <div className="flex items-center justify-between p-3 border-b border-border/50">
                <h3 className="font-medium">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex p-3 border-b border-border/20 hover:bg-secondary/20 cursor-pointer ${notification.read ? '' : 'bg-primary/5'}`}
                  >
                    <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${notification.read ? 'bg-secondary' : 'bg-primary/20'} mr-3`}>
                      <Bell className={`h-4 w-4 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="ml-auto">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border/50 text-center">
                <Button variant="ghost" size="sm" className="text-primary text-sm">
                  View all notifications
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="bg-shapes relative">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
        
        {/* Floating help button */}
        <div className="fixed bottom-6 right-6 z-20">
          <Button 
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-violet-600 hover:from-primary hover:to-violet-700"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
