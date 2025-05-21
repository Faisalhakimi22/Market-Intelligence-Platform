import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth, LoginValues, RegisterValues } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { GeometryShapes, FloatingIcon } from "@/components/ui/geometry-shapes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Icons
import {
  CheckCircle2,
  BarChart2,
  Sparkles,
  BrainCircuit,
  Globe,
  Shield,
  ArrowRight,
  Lightbulb,
  FileBarChart,
  Gem,
  AlertCircle,
  CheckCircle,
  Users,
  ChevronRight,
  Mail,
  Key,
  User,
  TrendingUp,
  FileText,
  Target,
  Rocket,
  Laptop,
  Smartphone,
  Loader2,
  Menu,
  Phone,
  Package,
  CircleDollarSign,
  HelpCircle,
  ChevronDown,
  Lock,
  Diamond,
  Code,
  UserCheck,
  LineChart,
  BarChart,
  Zap,
  Star,
  Hexagon,
  Award,
  DollarSign,
  BookOpen,
  Newspaper
} from "lucide-react";

// SVG imports
import analyticsDashboardSvg from "../assets/analytics-dashboard.svg";
import marketAnalysisSvg from "../assets/market-analysis.jpg";
import businessGrowthSvg from "../assets/business-growth.png";
import geometricBackgroundSvg from "../assets/geometric-background.svg";
import abstractBackgroundSvg from "../assets/abstract-background.svg";
import patternBackgroundSvg from "../assets/pattern-background.svg";

// Type Definitions
type ViewId = "auth" | "login" | "features" | "pricing" | "faq" | "privacy" | "terms" | "contact"
  | "api" | "integrations" | "documentation" | "guides" | "blog" | "about";

// Extended schemas with validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  name: z.string().min(1, "Name is required"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

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
      Fore<span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-purple-500 text-transparent">castro AI</span>
    </h1>
  </div>
);

// Add import for the new image at the top with other assets
import marketAnalysisJpg from "../assets/market-analysis.jpg";

// Add the DemoModal component before the AuthPage component
function DemoModal() {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const demoFeatures = [
    {
      title: "Real-time Market Analytics",
      description: "Watch as our AI analyzes market trends in real-time, providing actionable insights for your business.",
      image: analyticsDashboardSvg,
      icon: <BarChart2 className="h-5 w-5 text-primary" />
    },
    {
      title: "Competitor Analysis",
      description: "Track your competitors' movements and stay ahead with detailed comparative analysis.",
      image: marketAnalysisSvg,
      icon: <Users className="h-5 w-5 text-purple-500" />
    },
    {
      title: "AI-Powered Predictions",
      description: "Experience the power of our machine learning models predicting market trends with high accuracy.",
      image: businessGrowthSvg,
      icon: <BrainCircuit className="h-5 w-5 text-green-500" />
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % demoFeatures.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>Experience Forecastro AI in Action</DialogTitle>
        <DialogDescription>
          Take a tour of our powerful features and see how we can transform your market intelligence.
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6">
        <div className="relative overflow-hidden rounded-lg border border-border">
          {/* Feature Showcase */}
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {demoFeatures[currentFeature].icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{demoFeatures[currentFeature].title}</h3>
                <p className="text-muted-foreground mb-4">{demoFeatures[currentFeature].description}</p>
              </div>
            </div>
            <div className="mt-4 aspect-video relative rounded-lg overflow-hidden border border-border/50">
              <img
                src={demoFeatures[currentFeature].image}
                alt={demoFeatures[currentFeature].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-border">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>
        </div>

        {/* Feature Navigation */}
        <div className="mt-6 flex gap-2">
          {demoFeatures.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentFeature(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                currentFeature === index
                  ? "bg-primary"
                  : "bg-border hover:bg-primary/50"
              )}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="w-full" onClick={() => window.open('https://demo.forecastroai.com/signup', '_blank')}>
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={() => window.open('https://calendly.com/forecastroai/demo', '_blank')}>
            Schedule Live Demo
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const [activeTab, setActiveTab] = useState("login");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewId>("auth");
  
  // Hide header on scroll down, show on scroll up
  useEffect(() => {
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

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Login form handling
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form handling
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
      name: "",
      terms: false
    },
  });

  // Form submission handlers
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      if (!data.terms) {
        registerForm.setError("terms", {
          type: "manual",
          message: "You must accept the terms and conditions"
        });
        return;
      }
      
    // Remove confirmPassword and terms as they're not in the API schema
    const { confirmPassword, terms, ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Close mobile menu when clicking outside
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
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

  // Function to switch between views
  const switchView = (view: ViewId) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Define interfaces for plan types
  interface BasePlan {
    name: string;
    description: string;
    price: string;
    period: string;
    features: string[];
    buttonText: string;
    color: string;
    textColor: string;
    icon: JSX.Element;
    badge: string;
    saveAmount?: string;
  }

  // Plans data
  const plans: {
    starter: BasePlan;
    pro: BasePlan;
    enterprise: BasePlan;
  } = {
    starter: {
      name: "Starter",
      description: "Essential market intelligence for startups",
      price: "Free for 14 days",
      period: "14-day trial, then $3/month",
      features: [
        "Basic market trend analysis",
        "Limited competitor tracking (up to 3)",
        "Monthly industry reports",
        "5 AI-powered business idea validations",
        "Email support",
        "Community access"
      ],
      buttonText: "Start Free Trial",
      color: "from-blue-400/10 to-blue-500/10 dark:from-blue-900/20 dark:to-blue-800/20",
      textColor: "text-blue-600 dark:text-blue-400",
      icon: <BarChart className="h-5 w-5" />,
      badge: "14-Day Free Trial"
    },
    pro: {
      name: "Professional",
      description: "Advanced intelligence for growing businesses",
      price: billingPeriod === "monthly" ? "$5" : "$4",
      period: billingPeriod === "monthly" ? "/month" : "/month, billed annually",
      saveAmount: "$12",
      features: [
        "Advanced market trend analysis",
        "Unlimited competitor tracking",
        "Weekly industry reports",
        "100 AI-powered business idea validations",
        "Custom forecast modeling",
        "Priority email & chat support",
        "Team collaboration (up to 5 users)"
      ],
      buttonText: "Choose Pro",
      color: "from-blue-500/10 to-indigo-600/10 dark:from-blue-800/20 dark:to-indigo-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
      icon: <Gem className="h-5 w-5" />,
      badge: "Most Popular"
    },
    enterprise: {
      name: "Enterprise",
      description: "Complete intelligence suite for organizations",
      price: billingPeriod === "monthly" ? "$9" : "$7.20",
      period: billingPeriod === "monthly" ? "/month" : "/month, billed annually",
      saveAmount: "$21.60",
      features: [
        "Everything in Professional",
        "Advanced API integrations",
        "Custom data sources",
        "Unlimited AI-powered business validations",
        "Dedicated success manager",
        "24/7 priority support",
        "Team collaboration (unlimited users)",
        "Custom reporting & analytics",
        "On-demand market research"
      ],
      buttonText: "Contact Sales",
      color: "from-purple-500/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
      icon: <Diamond className="h-5 w-5" />,
      badge: "Complete Solution"
    }
  };

  // Features data
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Market Trend Analysis",
      description: "Advanced analytics that identify emerging market trends and growth opportunities before your competitors do.",
      points: [
        "Real-time data tracking from multiple sources",
        "Predictive forecasting of industry movements",
        "Customizable alerts for critical changes"
      ],
      color: "bg-blue-100/50 dark:bg-blue-900/20",
      delay: 0.1
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Competitor Intelligence",
      description: "Monitor your competitors' strategies, pricing, and market positioning with our comprehensive tracking tools.",
      points: [
        "Automated competitor activity monitoring",
        "Price change notifications and analysis",
        "Market share comparison tools"
      ],
      color: "bg-purple-100/50 dark:bg-purple-900/20",
      delay: 0.2
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-green-600 dark:text-green-400" />,
      title: "AI Business Validation",
      description: "Test your business ideas with our AI-powered validation tools to minimize risks and maximize success rates.",
      points: [
        "Idea success prediction and scoring",
        "Market fit analysis and feedback",
        "Competitive positioning assessment"
      ],
      color: "bg-green-100/50 dark:bg-green-900/20",
      delay: 0.3
    },
    {
      icon: <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      title: "Industry Reports",
      description: "Access comprehensive, data-driven reports on your industry's trends, challenges, and opportunities.",
      points: [
        "Quarterly in-depth industry analysis",
        "Sector-specific performance metrics",
        "Future trend projections and forecasts"
      ],
      color: "bg-amber-100/50 dark:bg-amber-900/20",
      delay: 0.4
    },
    {
      icon: <Target className="h-6 w-6 text-red-600 dark:text-red-400" />,
      title: "Strategic Opportunity Finder",
      description: "Discover untapped market opportunities and niches with significant growth potential for your business.",
      points: [
        "Gap analysis and opportunity identification",
        "Growth potential evaluation",
        "Risk assessment and mitigation strategies"
      ],
      color: "bg-red-100/50 dark:bg-red-900/20",
      delay: 0.5
    },
    {
      icon: <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Customer Behavior Analysis",
      description: "Understand your target audience with deep insights into customer preferences, behaviors, and emerging needs.",
      points: [
        "Demographic and psychographic profiling",
        "Purchase pattern analysis",
        "Customer journey mapping"
      ],
      color: "bg-indigo-100/50 dark:bg-indigo-900/20",
      delay: 0.6
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: "How does Forecastro collect and process data?",
      answer: "Our platform aggregates data from thousands of public and premium sources, including financial reports, news outlets, social media, industry publications, and proprietary databases. This data is then processed through our advanced AI algorithms to identify patterns, correlations, and insights that would be difficult to discover manually."
    },
    {
      question: "Can I integrate Forecastro with my existing tools?",
      answer: "Yes, we offer robust API access with our Professional and Enterprise plans. This allows you to integrate our market intelligence data with your existing CRM, business intelligence, analytics platforms, and other business tools. Our development team can also assist with custom integration needs for Enterprise customers."
    },
    {
      question: "How often is the market data updated?",
      answer: "Our system updates data in real-time for critical market movements and competitor activities. Most standard datasets are refreshed daily, while more comprehensive industry reports and analyses are updated weekly or monthly depending on the data type and your subscription level."
    },
    {
      question: "Is my business data secure on the platform?",
      answer: "Absolutely. We implement enterprise-grade security measures including end-to-end encryption, secure authentication, regular security audits, and compliance with global data protection regulations. Your business data is never shared with third parties, and all analyses are conducted in secure, isolated environments."
    },
    {
      question: "What support options are available?",
      answer: "All plans include access to our knowledge base and community forums. The Starter plan includes email support with a 24-hour response time. Professional plans add priority email and chat support with faster response times. Enterprise customers receive 24/7 priority support, a dedicated account manager, and optional onsite training and implementation assistance."
    },
    {
      question: "Can I try Forecastro before purchasing?",
      answer: "Yes, we offer a 14-day free trial with no credit card required. This gives you access to most features of our Professional plan, allowing you to experience the value of our platform before making a commitment. You can upgrade or downgrade your plan at any time after purchasing."
    }
  ];

  // Helper function to render the base layout
  const renderBaseLayout = (content: React.ReactNode) => {
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
                <button 
                  onClick={() => switchView("auth")}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
                >
                  Home
                </button>
                <button 
                  onClick={() => switchView("features")}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
                >
                  Features
                </button>
                <button 
                  onClick={() => switchView("pricing")}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => switchView("faq")}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => switchView("about")}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
                >
                  About
                </button>
              </nav>

              {/* Theme Toggler, Login Button and Mobile Menu Button */}
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button 
                  onClick={() => switchView("login")}
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
                  <button 
                    onClick={() => {
                      switchView("auth");
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm py-2"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => {
                      switchView("features");
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm py-2"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => {
                      switchView("pricing");
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm py-2"
                  >
                    Pricing
                  </button>
                  <button 
                    onClick={() => {
                      switchView("faq");
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm py-2"
                  >
                    FAQ
                  </button>
                  <button 
                    onClick={() => {
                      switchView("about");
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm py-2"
                  >
                    About
                  </button>
                  <Button 
                    onClick={() => {
                      switchView("login");
                      setIsMobileMenuOpen(false);
                    }}
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
        
        {content}
        
        {/* Footer */}
        <footer className="bg-card/50 dark:bg-card/30 border-t border-border pt-12 pb-8 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-1">
                <Logo />
                <p className="text-muted-foreground text-sm my-4">AI-powered market intelligence for smarter business decisions.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="col-span-1">
                <h3 className="text-base font-medium text-foreground mb-3">Product</h3>
                <ul className="space-y-2.5">
                  <li>
                    <button onClick={() => switchView("features")} className="text-muted-foreground hover:text-primary text-sm">Features</button>
                  </li>
                  <li>
                    <button onClick={() => switchView("pricing")} className="text-muted-foreground hover:text-primary text-sm">Pricing</button>
                  </li>
                  <li>
                    <button onClick={() => switchView("api")} className="text-muted-foreground hover:text-primary text-sm">API</button>
                  </li>
                  <li>
                    <button onClick={() => switchView("integrations")} className="text-muted-foreground hover:text-primary text-sm">Integrations</button>
                  </li>
                </ul>
              </div>
              <div className="col-span-1">
                <h3 className="text-base font-medium text-foreground mb-3">Resources</h3>
                <ul className="space-y-2.5">
                  <li>
                    <button onClick={() => switchView("documentation")} className="text-muted-foreground hover:text-primary text-sm">Documentation</button>
                  </li>
                  <li>
                    <button onClick={() => switchView("guides")} className="text-muted-foreground hover:text-primary text-sm">Guides</button>
                  </li>
                  <li>
                    <button onClick={() => switchView("blog")} className="text-muted-foreground hover:text-primary text-sm">Blog</button>
                  </li>
                  <li>
                    <button onClick={() => switchView("faq")} className="text-muted-foreground hover:text-primary text-sm">FAQ</button>
                  </li>
                </ul>
              </div>
              <div className="col-span-1">
                <h3 className="text-base font-medium text-foreground mb-3">Company</h3>
                <ul className="space-y-2.5">
                  <li>
                    <button onClick={() => switchView("about")} className="text-muted-foreground hover:text-primary text-sm">About</button>
                  </li>
                  <li>
                    <button onClick={() => switchView("contact")} className="text-muted-foreground hover:text-primary text-sm">Contact</button>
                  </li>
                  <li>
                    <button onClick={() => switchView("privacy")} className="text-muted-foreground hover:text-primary text-sm">Privacy Policy</button>
                  </li>
                  <li>
                    <button onClick={() => switchView("terms")} className="text-muted-foreground hover:text-primary text-sm">Terms of Service</button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-border pt-8">
              <p className="text-muted-foreground text-xs text-center">
                &copy; {new Date().getFullYear()} Forecastro AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // Add social login handlers
  const handleGoogleLogin = () => {
    try {
      // Show loading state
      loginMutation.isLoading = true;
      
      // Call the auth service to handle Google OAuth
      // This is a placeholder - replace with actual OAuth implementation
      window.location.href = "/api/auth/google";
      
      // Note: The actual redirect will happen so this code below won't execute
      // But we include it for clarity
      console.log("Redirecting to Google OAuth...");
    } catch (error) {
      console.error("Google login error:", error);
      loginMutation.isLoading = false;
    }
  };
  
  const handleTwitterLogin = () => {
    try {
      // Show loading state
      loginMutation.isLoading = true;
      
      // Call the auth service to handle Twitter OAuth
      // This is a placeholder - replace with actual OAuth implementation
      window.location.href = "/api/auth/twitter";
      
      // Note: The actual redirect will happen so this code below won't execute
      console.log("Redirecting to Twitter OAuth...");
    } catch (error) {
      console.error("Twitter login error:", error);
      loginMutation.isLoading = false;
    }
  };

  if (activeView === "auth") {
    return renderBaseLayout(
      <main className="pt-20 pb-16 relative z-10">
        <div className="container mx-auto px-4 relative">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch relative z-10 mb-20">
            {/* Left Column - Hero Content */}
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
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => switchView("pricing")}
                >
                  Start Free Trial
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  View Demo
                </Button>
                  </DialogTrigger>
                  <DemoModal />
                </Dialog>
              </div>
              {/* Trust Indicators */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Trusted by 10,000+ businesses worldwide</span>
            </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Enterprise-grade security & compliance</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span>Real-time market data & insights</span>
                </div>
              </div>
            </div>
            {/* Right Column - Enhanced Business Image */}
            <div className="hidden lg:flex w-1/2 items-center justify-center relative">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl" />
              <div className="absolute inset-0">
                <div className="absolute -right-8 -top-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -left-8 -bottom-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -left-4 top-1/4 bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Market Growth</div>
                    <div className="text-xs text-muted-foreground">+24.8% Increase</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -right-4 bottom-1/4 bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Competitor Analysis</div>
                    <div className="text-xs text-muted-foreground">12 New Insights</div>
                  </div>
                </div>
              </motion.div>

              {/* Main Image Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-[90%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/0 z-10" />
              <img
                src={marketAnalysisJpg}
                alt="Business market analysis illustration"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Stats */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 z-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-primary">Markets</div>
                      <div className="text-2xl font-bold">150+</div>
            </div>
                    <div className="text-center border-l border-r border-border">
                      <div className="text-sm font-medium text-primary">Accuracy</div>
                      <div className="text-2xl font-bold">96%</div>
          </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-primary">Insights</div>
                      <div className="text-2xl font-bold">24/7</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-primary rounded-full" />
                <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-purple-500 rounded-full" />
                <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Forecastro AI?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Experience the power of AI-driven market intelligence with our comprehensive suite of tools.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl border border-border/50"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground">Get instant insights into market trends and competitor movements as they happen.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl border border-border/50"
              >
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <BrainCircuit className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Predictions</h3>
                <p className="text-muted-foreground">Leverage advanced AI algorithms to predict market trends and opportunities.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl border border-border/50"
              >
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Competitor Tracking</h3>
                <p className="text-muted-foreground">Monitor your competitors' strategies and stay ahead of market changes.</p>
              </motion.div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-20">
            <div className="glass-card rounded-xl border border-border/50 p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-muted-foreground">Active Users</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-purple-500 mb-2">50M+</div>
                  <div className="text-muted-foreground">Data Points</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-green-500 mb-2">99.9%</div>
                  <div className="text-muted-foreground">Uptime</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-blue-500 mb-2">24/7</div>
                  <div className="text-muted-foreground">Support</div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Market Strategy?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of businesses making smarter decisions with Forecastro AI.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => switchView("pricing")} className="w-full sm:w-auto">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => switchView("contact")} className="w-full sm:w-auto">
                Talk to Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }
  
  else if (activeView === "features") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 gap-1 mb-6 inline-flex">
              <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span>All Features</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-heading">
              Powerful Tools for Market Intelligence
            </h1>
            <p className="text-lg text-muted-foreground">
              Our comprehensive suite of AI-powered tools provides deep insights into market trends, 
              competitor strategies, and growth opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/40 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 relative z-10" style={{backgroundColor: feature.color}}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground relative z-10">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 relative z-10">{feature.description}</p>
                <ul className="space-y-2 relative z-10">
                  {feature.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  else if (activeView === "pricing") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 gap-1 mb-6 inline-flex">
              <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span>Pricing Plans</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-heading">
              Choose a Plan That Works for You
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Simple, transparent pricing that scales with your business.
            </p>
            
            <div className="flex items-center justify-center mb-8">
              <span className={`text-sm mr-3 ${billingPeriod === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch 
                checked={billingPeriod === "annual"}
                onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-sm ml-3 ${billingPeriod === "annual" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                Annual <span className="inline-block ml-1.5 px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 text-xs rounded-full font-medium">Save 20%</span>
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(plans).map(([key, plan], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "rounded-xl overflow-hidden border bg-card relative",
                  key === "pro" ? "border-primary/50 md:scale-105 shadow-lg" : "border-border shadow-sm"
                )}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 ${plan.color} opacity-40`} />
                
                {plan.badge && (
                  <div className="absolute -right-10 top-6 rotate-45 bg-primary px-10 py-1">
                    <span className="text-xs font-bold text-white">{plan.badge}</span>
                  </div>
                )}
                
                <div className="p-6 relative z-10">
                  <div className={`h-12 w-12 rounded-lg ${plan.textColor} bg-primary/10 flex items-center justify-center mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1.5 mb-5">{plan.description}</p>
                  
                  <div className="mb-5">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground text-sm ml-1.5">{plan.period}</span>
                    </div>
                    {plan.saveAmount && billingPeriod === "annual" && (
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">Save ${plan.saveAmount} per year</p>
                    )}
                  </div>
                  
                  <Button className="w-full mb-6" variant={key === "pro" ? "default" : "outline"}>
                    {plan.buttonText}
                  </Button>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  else if (activeView === "faq") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 gap-1 mb-6 inline-flex">
              <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span>Questions & Answers</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-heading">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Get answers to the most common questions about our platform.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem value={`item-${index}`} className="glass-card border border-border/50 overflow-hidden rounded-lg">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <span className="text-left font-medium text-foreground">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
            
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-6">Still have questions?</p>
              <Button onClick={() => switchView("contact")} variant="default">Contact Us</Button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  else if (activeView === "contact") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 gap-1 mb-6 inline-flex">
              <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span>Get In Touch</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-heading">
              Contact Our Team
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions or need help? Our team is here to assist you.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto glass-card p-8 rounded-xl border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Send us a message</h3>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea 
                      id="message" 
                      rows={5} 
                      placeholder="Your message..." 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </div>
              
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Email</h4>
                        <p className="text-muted-foreground">Faisal.hakimi0@outlook.com</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Globe className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Location</h4>
                        <p className="text-muted-foreground">
                          Peshawar<br />
                          Khyber Pakhtunkhwa<br />
                          Pakistan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium text-foreground mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  else if (activeView === "privacy" || activeView === "terms") {
    const isPrivacy = activeView === "privacy";
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 gap-1 mb-6 inline-flex">
                <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                <span>{isPrivacy ? "Privacy & Data" : "Terms & Conditions"}</span>
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-heading">
                {isPrivacy ? "Privacy Policy" : "Terms of Service"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {isPrivacy 
                  ? "How we collect, use, and protect your data." 
                  : "The rules and guidelines for using our platform."}
              </p>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <p>Last updated: May 15, 2025</p>
              
              {isPrivacy ? (
                // Privacy Policy Content
                <>
                  <h2>Introduction</h2>
                  <p>
                    MarketInsightAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.
                  </p>
                  
                  <h2>Information We Collect</h2>
                  <p>
                    We collect information that you provide directly to us, information we collect automatically when you use our services, and information from third-party sources.
                  </p>
                  
                  <h3>Information You Provide to Us</h3>
                  <ul>
                    <li>Account information (name, email address, username, password)</li>
                    <li>Profile information (company name, industry, job title)</li>
                    <li>Payment information (processed through secure third-party payment processors)</li>
                    <li>User content (search queries, saved reports, custom parameters)</li>
                    <li>Communications you have with us</li>
                  </ul>
                  
                  <h3>Information We Collect Automatically</h3>
                  <ul>
                    <li>Log information (IP address, browser type, pages visited, time spent)</li>
                    <li>Device information (hardware model, operating system, unique device identifiers)</li>
                    <li>Usage information (features used, actions taken, settings preferences)</li>
                    <li>Cookies and similar technologies</li>
                  </ul>
                  
                  <h2>How We Use Your Information</h2>
                  <p>We use the information we collect to:</p>
                  <ul>
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send administrative messages, updates, and security alerts</li>
                    <li>Respond to your comments, questions, and customer service requests</li>
                    <li>Personalize your experience and deliver content relevant to your interests</li>
                    <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                    <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </>
              ) : (
                // Terms of Service Content
                <>
                  <h2>Acceptance of Terms</h2>
                  <p>
                    By accessing or using MarketInsightAI's platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
                  </p>
                  
                  <h2>Use License</h2>
                  <p>
                    Permission is granted to temporarily access the materials on MarketInsightAI's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul>
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                  
                  <h2>Account Terms</h2>
                  <p>
                    You are responsible for maintaining the security of your account and password. MarketInsightAI cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                  </p>
                  <p>
                    You are responsible for all content posted and activity that occurs under your account. You may not use the service for any illegal purpose or to violate any laws in your jurisdiction.
                  </p>
                  
                  <h2>Payment Terms</h2>
                  <p>
                    A valid payment method is required for paid subscriptions. If you upgrade from the free tier to a paid subscription, we will immediately charge your card, and you will be billed in advance on a recurring basis.
                  </p>
                  <p>
                    There will be no refunds or credits for partial months of service, or for periods when you did not use the service.
                  </p>
                </>
              )}
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about our {isPrivacy ? "Privacy Policy" : "Terms of Service"}, please contact us at:
              </p>
              <ul>
                <li>Email: Faisal.hakimi0@outlook.com</li>
                <li>Address: Peshawar, Khyber Pakhtunkhwa, Pakistan</li>
              </ul>
            </div>
            
            <div className="mt-12 text-center">
              <Button onClick={() => switchView("auth")} variant="outline" className="mx-2">Back to Home</Button>
              <Button onClick={() => switchView("contact")} variant="default" className="mx-2">Contact Us</Button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  // API documentation page
  else if (activeView === "api") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <ContentTemplate 
            title="API Documentation" 
            subtitle="Integrate Forecastro into your applications with our powerful API." 
            icon={<Code className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />} 
          />
          
          <div className="max-w-4xl mx-auto mt-12 glass-card rounded-xl p-8 border border-border/50">
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="text-muted-foreground mb-4">Our API provides programmatic access to market data, trends, and insights. Follow these steps to start integrating with our platform.</p>
              
              <div className="space-y-4 mt-6">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">1</div>
                  <div className="flex-1">
                    <h3 className="font-medium">Get your API key</h3>
                    <p className="text-sm text-muted-foreground">Sign up for a Forecastro account and generate an API key from your dashboard.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">2</div>
                  <div className="flex-1">
                    <h3 className="font-medium">Choose your endpoints</h3>
                    <p className="text-sm text-muted-foreground">Explore our API documentation to find the endpoints that fit your needs.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">3</div>
                  <div className="flex-1">
                    <h3 className="font-medium">Make your first request</h3>
                    <p className="text-sm text-muted-foreground">Use our sample code to make your first API request and start integrating.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Code Example</h2>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-sm text-muted-foreground">
{`// Example API request using JavaScript
const fetchMarketData = async () => {
  const response = await fetch('https://api.forecastro.com/v1/market/trends', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}`}
                </pre>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button onClick={() => switchView("auth")} variant="default">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  // Integrations page
  else if (activeView === "integrations") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <ContentTemplate 
            title="Integrations" 
            subtitle="Connect Forecastro with your favorite tools and platforms." 
            icon={<Package className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />} 
          />
          
          <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Salesforce", icon: "💼", desc: "Sync market data with your CRM" },
              { name: "Slack", icon: "💬", desc: "Get insights directly in your team chat" },
              { name: "HubSpot", icon: "🔄", desc: "Power your marketing with market trends" },
              { name: "Tableau", icon: "📊", desc: "Create powerful data visualizations" },
              { name: "Google Sheets", icon: "📝", desc: "Import data to spreadsheets" },
              { name: "Zapier", icon: "⚡", desc: "Connect to 3000+ apps with no code" },
              { name: "Power BI", icon: "📈", desc: "Build business intelligence dashboards" },
              { name: "Notion", icon: "📋", desc: "Embed insights in your workspace" },
              { name: "Airtable", icon: "🗃️", desc: "Populate your bases with market data" }
            ].map((integration, i) => (
              <div key={i} className="glass-card p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                <div className="text-3xl mb-4">{integration.icon}</div>
                <h3 className="text-lg font-medium mb-2">{integration.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{integration.desc}</p>
                <Button variant="outline" size="sm" className="w-full">Connect</Button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Don't see the integration you need?</p>
            <Button onClick={() => switchView("contact")} variant="default">
              Request an Integration
            </Button>
          </div>
        </div>
      </main>
    );
  }
  
  // Documentation page
  else if (activeView === "documentation") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <ContentTemplate 
            title="Documentation" 
            subtitle="Learn how to use Forecastro with our comprehensive documentation." 
            icon={<FileText className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />} 
          />
          
          <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="glass-card rounded-xl p-6 border border-border/50 sticky top-24">
                <h3 className="font-medium mb-4">Table of Contents</h3>
                <ul className="space-y-2.5">
                  {["Getting Started", "Dashboard", "Market Analysis", "Competitor Tracking", "Report Generation", "Account Settings", "Integrations", "API Reference", "FAQ", "Troubleshooting"].map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-8">
              <div className="glass-card rounded-xl p-6 border border-border/50">
                <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
                <p className="text-muted-foreground mb-4">Welcome to Forecastro! This guide will help you get up and running with our platform.</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">1. Create Your Account</h3>
                    <p className="text-sm text-muted-foreground">Sign up for a Forecastro account to get started. You can begin with our 14-day free trial.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">2. Set Up Your Profile</h3>
                    <p className="text-sm text-muted-foreground">Configure your industry settings, business size, and areas of interest to get personalized insights.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">3. Explore the Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Your dashboard is the central hub for all your market intelligence. Customize it to show the metrics that matter most to you.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">4. Track Competitors</h3>
                    <p className="text-sm text-muted-foreground">Add competitors to your watchlist to monitor their strategies, pricing, and market positioning.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">5. Generate Your First Report</h3>
                    <p className="text-sm text-muted-foreground">Use our report generator to create a comprehensive analysis of your market landscape.</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={() => switchView("auth")} variant="default">
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  // Guides page
  else if (activeView === "guides") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <ContentTemplate 
            title="Guides & Tutorials" 
            subtitle="Step-by-step instructions to help you get the most out of MarketInsightAI." 
            icon={<BookOpen className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />} 
          />
          
          <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "Getting Started with Market Analysis", 
                desc: "Learn how to perform your first market analysis using our platform.", 
                category: "Beginner",
                time: "10 min read"
              },
              { 
                title: "Advanced Competitor Tracking", 
                desc: "Set up comprehensive monitoring of your top competitors.", 
                category: "Advanced",
                time: "15 min read"
              },
              { 
                title: "Creating Custom Reports", 
                desc: "Design and generate custom reports tailored to your business needs.", 
                category: "Intermediate",
                time: "12 min read"
              },
              { 
                title: "Interpreting Market Trends", 
                desc: "How to spot patterns and make predictions based on market data.", 
                category: "Intermediate",
                time: "8 min read"
              },
              { 
                title: "Setting Up API Integrations", 
                desc: "Connect your existing tools with our API for seamless data flow.", 
                category: "Advanced",
                time: "20 min read"
              },
              { 
                title: "Data Visualization Techniques", 
                desc: "Create powerful visualizations to communicate insights effectively.", 
                category: "Intermediate",
                time: "14 min read"
              }
            ].map((guide, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-colors group">
                <div className="h-40 bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-primary/40 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="outline" className="px-2 py-0.5 text-xs font-medium">
                      {guide.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{guide.time}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{guide.desc}</p>
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10 transition-colors">
                    Read Guide
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button onClick={() => switchView("documentation")} variant="default">
              View All Documentation
            </Button>
          </div>
        </div>
      </main>
    );
  }
  
  // Blog page
  else if (activeView === "blog") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <ContentTemplate 
            title="Blog" 
            subtitle="Insights, news, and tips from our market intelligence experts." 
            icon={<Newspaper className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />} 
          />
          
          <div className="max-w-5xl mx-auto mt-12">
            {/* Featured post */}
            <div className="glass-card rounded-xl overflow-hidden border border-border/50 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 h-60 md:h-auto flex items-center justify-center p-8">
                  <LineChart className="h-24 w-24 text-primary/40" />
                </div>
                <div className="p-8">
                  <Badge variant="outline" className="mb-4">Featured</Badge>
                  <h2 className="text-2xl font-bold mb-3">The Future of Market Intelligence in 2024</h2>
                  <p className="text-muted-foreground mb-6">Explore the emerging trends and technologies shaping the future of market intelligence and how businesses can prepare for what's ahead.</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary/80 to-purple-500/80"></div>
                      <div>
                        <p className="text-sm font-medium">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">Head of Research</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">April 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent posts */}
            <h3 className="text-xl font-bold mb-6">Recent Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                { 
                  title: "5 Ways AI is Revolutionizing Market Analysis", 
                  desc: "Discover how artificial intelligence is transforming how businesses analyze market data.", 
                  author: "Michael Chen",
                  date: "April 10, 2024"
                },
                { 
                  title: "Understanding Customer Behavior in Emerging Markets", 
                  desc: "Key insights into consumer trends and purchasing patterns in rapidly growing economies.", 
                  author: "Priya Narayan",
                  date: "April 8, 2024"
                },
                { 
                  title: "The Impact of Sustainability on Brand Perception", 
                  desc: "How eco-friendly practices influence consumer choices and brand loyalty in today's market.", 
                  author: "Thomas Wright",
                  date: "April 5, 2024"
                },
                { 
                  title: "Strategic Pricing in Competitive Industries", 
                  desc: "Techniques for optimizing your pricing strategy to balance profitability and market share.", 
                  author: "Emma Rodriguez",
                  date: "April 3, 2024"
                },
                { 
                  title: "Using Predictive Analytics for Market Forecasting", 
                  desc: "How forward-looking data analysis can help your business anticipate market shifts.", 
                  author: "James Wilson",
                  date: "March 30, 2024"
                },
                { 
                  title: "Building a Data-Driven Culture in Your Organization", 
                  desc: "Steps to foster a company environment that prioritizes evidence-based decision making.", 
                  author: "Amara Okafor",
                  date: "March 28, 2024"
                }
              ].map((post, i) => (
                <div key={i} className="glass-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-colors group">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{post.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">{post.author}</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline">
                Load More Articles
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  // About page
  else if (activeView === "about") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <ContentTemplate 
            title="About Us" 
            subtitle="We're on a mission to democratize market intelligence for businesses of all sizes." 
            icon={<Users className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />} 
          />
          
          <div className="max-w-4xl mx-auto mt-12">
            <div className="glass-card rounded-xl p-8 border border-border/50 mb-12">
              <h2 className="text-2xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2025, MarketInsightAI was born from a simple observation: access to high-quality market intelligence was largely restricted to enterprise companies with massive budgets. Small and medium-sized businesses were left without the tools they needed to make informed strategic decisions.
              </p>
              <p className="text-muted-foreground mb-4">
                Our founders, a team of data scientists and market research experts, set out to change this paradigm. By harnessing the power of AI and machine learning, we've created a platform that provides enterprise-grade market intelligence at a fraction of the traditional cost.
              </p>
              <p className="text-muted-foreground">
                Today, Forecastro serves thousands of businesses worldwide, helping them discover market opportunities, track competitors, and make data-driven decisions with confidence.
              </p>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { 
                  title: "Data Integrity", 
                  desc: "We believe in the highest standards of data quality, accuracy, and reliability.", 
                  icon: <Shield className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                },
                { 
                  title: "Accessibility", 
                  desc: "We're committed to making powerful market intelligence accessible to businesses of all sizes.", 
                  icon: <Users className="h-10 w-10 text-green-500 dark:text-green-400" />
                },
                { 
                  title: "Innovation", 
                  desc: "We continuously push the boundaries of what's possible with AI-powered market analysis.", 
                  icon: <Lightbulb className="h-10 w-10 text-amber-500 dark:text-amber-400" />
                }
              ].map((value, i) => (
                <div key={i} className="glass-card rounded-xl p-6 border border-border/50 text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-center">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { 
                  name: "Faisal Hakimi", 
                  role: "CEO & Founder", 
                  bio: "Data scientist and AI enthusiast at Market Research International with 4+ years of experience."
                },
                { 
                  name: "Sadiq Mansoor", 
                  role: "Co-Founder", 
                  bio: "AI engineer part of  machine learning teams at tech companies."
                },
                { 
                  name: "lara", 
                  role: "Data Science", 
                  bio: "Expert in market analytics with a background in economics and statistical analysis."
                }
              ].map((person, i) => (
                <div key={i} className="glass-card rounded-xl p-6 border border-border/50 text-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary/80 to-purple-500/80 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">{person.name}</h3>
                  <p className="text-sm text-primary mb-3">{person.role}</p>
                  <p className="text-sm text-muted-foreground">{person.bio}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-6">Interested in joining our team?</p>
              <Button onClick={() => switchView("contact")} variant="default">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  else if (activeView === "login") {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 flex flex-col items-center min-h-[60vh]">
          <div className="w-full max-w-md relative">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl"
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
            <div className="glass-form rounded-2xl overflow-hidden relative shadow-soft">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
                <div className="absolute -right-1/3 -bottom-1/4 w-2/3 h-2/3 bg-blue-500/5 rounded-full blur-2xl" />
                <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-2xl" />
              </div>
              {/* Auth Tabs */}
              <div className="p-6 sm:p-8">
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6 w-full bg-muted/50">
                    <TabsTrigger value="login" className="font-medium text-sm">Sign In</TabsTrigger>
                    <TabsTrigger value="register" className="font-medium text-sm">Create Account</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="mt-0 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">Welcome back</h2>
                      <p className="text-muted-foreground mb-6 text-sm">Sign in to access your account</p>
                    </div>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-username">Username</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                              <User className="h-5 w-5" />
                            </div>
                            <Input
                              id="login-username"
                              type="text"
                              className="pl-10"
                              placeholder="Enter your username"
                              {...loginForm.register("username")}
                            />
                          </div>
                          {loginForm.formState.errors.username && (
                            <p className="text-sm text-destructive">{loginForm.formState.errors.username.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="login-password">Password</Label>
                            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </div>
                            <Input
                              id="login-password"
                              type="password"
                              className="pl-10"
                              placeholder="Enter your password"
                              {...loginForm.register("password")}
                            />
                          </div>
                          {loginForm.formState.errors.password && (
                            <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" />
                          <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                          >
                            Remember me
                          </label>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                      </div>
                    </form>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" type="button" className="hover:bg-muted/50 transition-colors" onClick={handleGoogleLogin}>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" type="button" className="hover:bg-muted/50 transition-colors" onClick={handleTwitterLogin}>
                        <svg className="mr-2 h-4 w-4" fill="#1DA1F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="register" className="mt-0 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">Create your account</h2>
                      <p className="text-muted-foreground mb-6 text-sm">Get started with MarketInsightAI</p>
                    </div>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="register-name">Full Name</Label>
                            <Input
                              id="register-name"
                              type="text"
                              placeholder="Enter your name"
                              {...registerForm.register("name")}
                            />
                            {registerForm.formState.errors.name && (
                              <p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="register-username">Username</Label>
                            <Input
                              id="register-username"
                              type="text"
                              placeholder="Create a username"
                              {...registerForm.register("username")}
                            />
                            {registerForm.formState.errors.username && (
                              <p className="text-sm text-destructive">{registerForm.formState.errors.username.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                              <Mail className="h-5 w-5" />
                            </div>
                            <Input
                              id="register-email"
                              type="email"
                              className="pl-10"
                              placeholder="your@email.com"
                              {...registerForm.register("email")}
                            />
                          </div>
                          {registerForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password">Password</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </div>
                            <Input
                              id="register-password"
                              type="password"
                              className="pl-10"
                              placeholder="Create a password (min. 8 characters)"
                              {...registerForm.register("password")}
                            />
                          </div>
                          {registerForm.formState.errors.password && (
                            <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-confirm-password">Confirm Password</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </div>
                            <Input
                              id="register-confirm-password"
                              type="password"
                              className="pl-10"
                              placeholder="Confirm your password"
                              {...registerForm.register("confirmPassword")}
                            />
                          </div>
                          {registerForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="terms" 
                            onCheckedChange={(checked) => {
                              registerForm.setValue("terms", checked === true);
                            }}
                            checked={registerForm.watch("terms")}
                            className="mt-1" 
                          />
                          <div>
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                            >
                              I agree to the <button type="button" onClick={() => switchView("terms")} className="text-primary hover:underline">Terms of Service</button> and <button type="button" onClick={() => switchView("privacy")} className="text-primary hover:underline">Privacy Policy</button>
                            </label>
                            {registerForm.formState.errors.terms && (
                              <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.terms.message}</p>
                            )}
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => switchView("auth")}
          >
            Back to Home
          </Button>
        </div>
      </main>
    );
  }
  
  // Default case - display fallback for any other view that wasn't implemented
  else {
    return renderBaseLayout(
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 gap-1 mb-6 inline-flex">
              <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span>Info</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-heading">
              Under Construction
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              This section of the site is still being developed. Please check back soon!
            </p>
            <Button onClick={() => switchView("auth")} variant="default">
              Return to Home
            </Button>
          </div>
        </div>
      </main>
    );
  }
}

function ContentTemplate({ title, subtitle, icon }: { title: string, subtitle: string, icon: React.ReactNode }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 gap-1 mb-6 inline-flex">
        {icon}
        <span>{title}</span>
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-heading">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        {subtitle}
      </p>
    </div>
  );
}
