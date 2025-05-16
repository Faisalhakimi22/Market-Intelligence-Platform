import React from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GeometryShapes } from "@/components/ui/geometry-shapes";

// Icons
import {
  Sparkles,
  BarChart2,
  BrainCircuit,
  Globe,
  Shield,
  Users,
  Menu,
  TrendingUp,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

// Logo Component
const Logo = () => (
  <div 
    className="flex items-center gap-2 group cursor-pointer" 
    onClick={() => {
      window.location.href = "/";
      window.location.reload();
    }}
  >
    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary/90 to-primary flex items-center justify-center shadow-lg overflow-hidden group-hover:shadow-primary/30 transition-all duration-300">
      <motion.div
        initial={{ y: 0 }}
        animate={{
          y: [0, -2, 0, 2, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <BarChart2 className="h-6 w-6 text-white" />
      </motion.div>
    </div>
    <h1 className="text-2xl font-bold font-heading text-foreground">
      MarketInsight<span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-purple-500 text-transparent">AI</span>
    </h1>
  </div>
);

export default function MarketingPage() {
  const [_, navigate] = useLocation();
  const [isHeaderVisible, setIsHeaderVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  // Hide header on scroll down, show on scroll up
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Close mobile menu when clicking outside
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-background overflow-hidden font-sans antialiased relative">
      {/* Elegant background with single gradient layer */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-animated-gradient">
        {/* We're using just one background layer with custom animation from our new CSS */}
      </div>
      
      {/* Enhanced geometry shapes with SVG animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <GeometryShapes />
      </div>
      
      {/* Background shapes that add depth without doubling backgrounds */}
      <div className="absolute inset-0 bg-shapes pointer-events-none z-0"></div>

      {/* Header with enhanced glass effect */}
      <header 
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          "glass-panel",
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="/features"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
              >
                Features
              </a>
              <a 
                href="/pricing"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
              >
                Pricing
              </a>
              <a 
                href="/faq"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
              >
                FAQ
              </a>
              <a 
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
              >
                Contact
              </a>
            </nav>

            {/* Theme Toggler, Login Button and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                onClick={() => window.location.href = "/auth"}
                variant="outline"
                size="sm"
                className="hidden md:flex"
              >
                Sign In
              </Button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="md:hidden flex items-center p-2 rounded-md text-muted-foreground hover:text-primary focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 w-full z-40 bg-background/95 backdrop-blur-lg border-b border-border/30 shadow-lg md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <a 
                  href="/features"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm py-2"
                >
                  Features
                </a>
                <a 
                  href="/pricing"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm py-2"
                >
                  Pricing
                </a>
                <a 
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm py-2"
                >
                  FAQ
                </a>
                <a 
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm py-2"
                >
                  Contact
                </a>
                <Button 
                  onClick={() => window.location.href = "/auth"}
                  variant="outline"
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
            {/* Hero Content */}
            <div className="w-full lg:w-1/2 p-2 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center mb-4">
                <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 gap-1 group hover:bg-primary/20 transition-colors">
                  <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  <span>AI-Powered Market Intelligence</span>
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-foreground leading-tight">
                Uncover Market <span className="bg-clip-text bg-gradient-to-r from-primary to-purple-600 text-transparent">Insights</span> with Confidence
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Make strategic decisions with our AI-powered market intelligence platform. Get ahead of trends, monitor competitors, and identify growth opportunities with data-driven insights.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-1.5 text-blue-600 dark:text-blue-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Real-time Market Trends</h3>
                    <p className="text-sm text-muted-foreground">Stay ahead with advanced analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-1.5 text-indigo-600 dark:text-indigo-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Competitor Intelligence</h3>
                    <p className="text-sm text-muted-foreground">Monitor strategies and positioning</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/30 rounded-lg p-1.5 text-purple-600 dark:text-purple-400">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">AI Business Validation</h3>
                    <p className="text-sm text-muted-foreground">Test ideas with predictive analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 bg-green-50 dark:bg-green-900/30 rounded-lg p-1.5 text-green-600 dark:text-green-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Secure & Compliant</h3>
                    <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => window.location.href = "/auth"}
                  className="flex-1"
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/demo"}
                  className="flex-1"
                >
                  Request Demo
                </Button>
              </div>
              
              {/* Social Proof */}
              <div className="mt-8">
                <p className="text-sm text-muted-foreground mb-3">Trusted by innovative companies</p>
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="text-muted-foreground/70 dark:text-muted-foreground/50">
                    <svg className="h-7" viewBox="0 0 100 30" fill="currentColor">
                      <path d="M20.5,15.1c0-4.8-3.9-8.7-8.7-8.7c-4.8,0-8.7,3.9-8.7,8.7c0,4.8,3.9,8.7,8.7,8.7C16.6,23.8,20.5,19.9,20.5,15.1z M48.8,15.1c0-4.8-3.9-8.7-8.7-8.7c-4.8,0-8.7,3.9-8.7,8.7c0,4.8,3.9,8.7,8.7,8.7C44.9,23.8,48.8,19.9,48.8,15.1z M77.1,15.1c0-4.8-3.9-8.7-8.7-8.7c-4.8,0-8.7,3.9-8.7,8.7c0,4.8,3.9,8.7,8.7,8.7C73.2,23.8,77.1,19.9,77.1,15.1z M97.1,15.1c0-4.8-3.9-8.7-8.7-8.7c-4.8,0-8.7,3.9-8.7,8.7c0,4.8,3.9,8.7,8.7,8.7C93.2,23.8,97.1,19.9,97.1,15.1z"/>
                    </svg>
                  </div>
                  <div className="text-muted-foreground/70 dark:text-muted-foreground/50">
                    <svg className="h-5" viewBox="0 0 100 20" fill="currentColor">
                      <path d="M14.1,0L0,19.1H5.7L19.8,0H14.1z M18.8,19.1H24L9.9,0H4.7L18.8,19.1z M34.4,0L20.3,19.1H25.9L40,0H34.4z M38.7,19.1h5.2L29.8,0h-5.2L38.7,19.1z"/>
                    </svg>
                  </div>
                  <div className="text-muted-foreground/70 dark:text-muted-foreground/50">
                    <svg className="h-5" viewBox="0 0 100 25" fill="currentColor">
                      <path d="M7.7,0.3L0,25h5.1l1.2-4h6.2l1.2,4h5.1L12,0.3H7.7z M7.4,17l2.1-7l2.1,7H7.4z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hero Image/Animation */}
            <div className="w-full lg:w-1/2 p-4">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-xl"
                  animate={{ 
                    opacity: [0.5, 0.15, 0.5],
                    scale: [0.98, 1.01, 0.98] 
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                <div className="relative bg-card/50 rounded-2xl p-8 backdrop-blur-sm border border-border/50">
                  {/* Add your hero image or animation here */}
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/5 to-purple-500/5 flex items-center justify-center">
                    <BarChart2 className="h-24 w-24 text-primary/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 