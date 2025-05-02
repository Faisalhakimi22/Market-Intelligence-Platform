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
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Market Analysis", href: "/market-analysis", icon: Search },
    { name: "Forecasting", href: "/forecasting", icon: TrendingUp },
    { name: "Competitors", href: "/competitor-intelligence", icon: Users },
    { name: "Opportunities", href: "/opportunities", icon: BarChart3 },
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r">
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
            <Link href="/" className="flex items-center text-lg font-semibold">
              <BarChart3 className="h-6 w-6 mr-2 text-primary" />
              <span>Market Intel</span>
            </Link>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-primary-foreground" : "text-gray-500"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name || user?.username}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-500 mt-1"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-full md:hidden bg-white transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
        style={{ maxWidth: "250px" }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/" className="flex items-center text-lg font-semibold">
            <BarChart3 className="h-6 w-6 mr-2 text-primary" />
            <span>Market Intel</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
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
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-primary-foreground" : "text-gray-500"}`} />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
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
        <div className="md:hidden flex items-center h-16 flex-shrink-0 px-4 border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 text-lg font-semibold">Market Intel</div>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}