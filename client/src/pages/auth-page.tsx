import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth, LoginValues, RegisterValues } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Parallax, Background } from "react-parallax";

// Import illustrations and backgrounds
import analyticsDashboardSvg from "../assets/analytics-dashboard.svg";
import marketAnalysisSvg from "../assets/market-analysis.svg";
import businessGrowthSvg from "../assets/business-growth.svg";
import geometricBackgroundSvg from "../assets/geometric-background.webp";
import abstractBackgroundSvg from "../assets/abstract-background.svg";
import patternBackgroundSvg from "../assets/pattern-background.svg";

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
  DollarSign
} from "lucide-react";

// Type Definitions
type ViewId = "auth" | "features" | "pricing" | "faq" | "privacy" | "terms" | "contact";

// Extended schemas with validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

// Geometric Decorative Shape Component
const GeometricShape = ({ className }: { className?: string }) => (
  <motion.div 
    className={cn("absolute rounded-full bg-gradient-to-r opacity-20 blur-3xl", className)}
    animate={{ 
      scale: [1, 1.1, 1],
      opacity: [0.1, 0.2, 0.1]
    }}
    transition={{ 
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut" 
    }}
  />
);

// Hexagon Grid Animation Background
const HexagonBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <div className="absolute inset-0 bg-gradient-mesh bg-repeat opacity-10" />
  </div>
);

// FloatingIcons for visual appeal
const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { icon: <Sparkles size={20} />, color: "text-blue-500", delay: 0, className: "left-[15%] top-[20%]" },
        { icon: <BrainCircuit size={20} />, color: "text-purple-500", delay: 1.2, className: "right-[10%] top-[15%]" },
        { icon: <Shield size={20} />, color: "text-green-500", delay: 0.5, className: "left-[20%] bottom-[30%]" },
        { icon: <Lightbulb size={20} />, color: "text-amber-500", delay: 2, className: "right-[25%] bottom-[15%]" },
        { icon: <LineChart size={20} />, color: "text-blue-500", delay: 1.5, className: "left-[85%] top-[50%]" },
        { icon: <UserCheck size={20} />, color: "text-indigo-500", delay: 0.8, className: "left-[5%] top-[65%]" },
        { icon: <Star size={20} />, color: "text-yellow-500", delay: 2.5, className: "right-[5%] top-[35%]" },
      ].map((item, index) => (
        <motion.div
          key={index}
          className={cn("absolute z-0 opacity-50", item.color, item.className)}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 5,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
};

// Logo Component
const Logo = () => (
  <div className="flex items-center gap-2 group">
    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg overflow-hidden group-hover:shadow-blue-500/30 transition-all duration-300">
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
    <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
      MarketInsight<span className="text-blue-600 dark:text-blue-400 bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-transparent">AI</span>
    </h1>
  </div>
);

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

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword and terms as they're not in the API schema
    const { confirmPassword, terms, ...registerData } = data;
    registerMutation.mutate(registerData);
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
      color: "from-blue-400/20 to-blue-500/20 dark:from-blue-900/30 dark:to-blue-800/30",
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
      color: "from-blue-500/20 to-indigo-600/20 dark:from-blue-800/30 dark:to-indigo-900/30",
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
      color: "from-purple-500/20 to-indigo-600/20 dark:from-purple-900/30 dark:to-indigo-900/30",
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
      color: "bg-blue-100 dark:bg-blue-900/30",
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
      color: "bg-purple-100 dark:bg-purple-900/30",
      delay: 0.2
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-green-600 dark:text-green-400" />,
      title: "AI Business Validation",
      description: "Test and validate your business ideas with our AI-powered analysis engine before investing resources.",
      points: [
        "Market viability assessment",
        "Revenue potential modeling",
        "Risk analysis and mitigation strategies"
      ],
      color: "bg-green-100 dark:bg-green-900/30",
      delay: 0.3
    },
    {
      icon: <FileBarChart className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      title: "Custom Reports & Analytics",
      description: "Generate detailed reports tailored to your specific business needs and industry focus.",
      points: [
        "Customizable reporting templates",
        "Interactive data visualizations",
        "Exportable insights for presentations"
      ],
      color: "bg-amber-100 dark:bg-amber-900/30",
      delay: 0.4
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "What is MarketInsightAI?",
      answer: "MarketInsightAI is a comprehensive AI-powered platform that provides market intelligence, competitor tracking, and business idea validation to help businesses make data-driven decisions."
    },
    {
      question: "How does the AI-powered business idea validation work?",
      answer: "Our AI analyzes market trends, consumer behavior, and competitive landscapes to provide you with a detailed assessment of your business idea's viability, potential challenges, and opportunities."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Yes, you can easily switch between plans as your business needs change. When upgrading, you'll be billed the prorated difference for the remainder of your billing cycle."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial on our Starter plan with no credit card required. This gives you full access to test our platform before making a decision."
    },
    {
      question: "How often is the market data updated?",
      answer: "Our market data is updated in real-time for critical metrics, daily for most standard metrics, and weekly for comprehensive industry reports."
    },
    {
      question: "Is there a limit to how many users can access my account?",
      answer: "The Starter plan supports 1 user, Professional supports up to 5 team members, and Enterprise allows unlimited users with custom role permissions."
    },
  ];

  // If loading, render loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-animated-gradient">
        <div className="glass rounded-xl p-8 flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 animate-pulse">Loading MarketInsightAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-animated-gradient overflow-hidden">
      {/* Pattern background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={patternBackgroundSvg} 
          alt="" 
          className="absolute h-full w-full"
        />
      </div>
      
      {/* Modern background with abstract design and animated waves */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={abstractBackgroundSvg} 
            alt="" 
            className="absolute h-full w-full object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-purple-600/10 mix-blend-overlay"></div>
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
        
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <img 
            src={geometricBackgroundSvg} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Animated wave elements */}
        <div className="absolute bottom-0 left-0 right-0 h-56 opacity-20">
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32 bg-blue-500/20"
            style={{
              borderTopLeftRadius: '50%',
              borderTopRightRadius: '50%',
              transform: 'scaleX(1.5)',
              transformOrigin: 'bottom'
            }}
            animate={{
              y: [0, -15, 0],
              scaleY: [1, 1.1, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-24 bg-indigo-500/20"
            style={{
              borderTopLeftRadius: '40%',
              borderTopRightRadius: '40%',
              transform: 'scaleX(1.7)',
              transformOrigin: 'bottom'
            }}
            animate={{
              y: [0, -10, 0],
              scaleY: [1, 1.05, 1]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-16 bg-purple-500/20"
            style={{
              borderTopLeftRadius: '30%',
              borderTopRightRadius: '30%',
              transform: 'scaleX(1.9)',
              transformOrigin: 'bottom'
            }}
            animate={{
              y: [0, -5, 0],
              scaleY: [1, 1.03, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>
      </div>
      
      {/* Decorative background elements */}
      <HexagonBackground />
      <div className="bg-shapes relative">
        <GeometricShape className="from-blue-500/20 to-purple-500/20 w-[500px] h-[500px] -left-64 -top-64" />
        <GeometricShape className="from-indigo-500/20 to-purple-500/20 w-[600px] h-[600px] -right-96 top-96" />
        <GeometricShape className="from-blue-500/20 to-indigo-500/20 w-[400px] h-[400px] left-1/3 bottom-0" />
      </div>
      <FloatingIcons />

      {/* Header with glassmorphism effect */}
      <header className={`border-b border-white/20 dark:border-gray-800/30 glass fixed top-0 left-0 right-0 z-50 shadow-xl transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <button 
                className={`text-sm font-medium transition-colors nav-link ${activeView === "features" ? "active" : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"}`}
                onClick={() => switchView("features")}
              >
                Features
              </button>
              <button 
                className={`text-sm font-medium transition-colors nav-link ${activeView === "pricing" ? "active" : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"}`}
                onClick={() => switchView("pricing")}
              >
                Pricing
              </button>
              <button 
                className={`text-sm font-medium transition-colors nav-link ${activeView === "faq" ? "active" : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"}`}
                onClick={() => switchView("faq")}
              >
                FAQ
              </button>
            </nav>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/30 hover:border-blue-400 dark:border-gray-700/50 dark:hover:border-blue-700"
                onClick={() => {
                  switchView("auth");
                  setTimeout(() => setActiveTab("login"), 100);
                }}
              >
                <Lock className="mr-1 h-3.5 w-3.5" />
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-blue-500/20 border-0"
                size="sm"
                onClick={() => {
                  switchView("auth");
                  setTimeout(() => setActiveTab("register"), 100);
                }}
              >
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Start Free Trial
              </Button>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 border-white/30 dark:border-gray-700/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
              onClick={() => {
                switchView("auth");
                setTimeout(() => setActiveTab("register"), 100);
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu with glassmorphism */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            ref={mobileMenuRef}
            className="md:hidden fixed top-[72px] left-0 right-0 z-40 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass rounded-xl shadow-lg py-2 px-4 space-y-1">
              <button 
                className="block w-full text-left py-2 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50"
                onClick={() => {
                  switchView("features");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Zap className="inline-block mr-2 h-4 w-4 text-blue-500" />
                Features
              </button>
              <button 
                className="block w-full text-left py-2 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50"
                onClick={() => {
                  switchView("pricing");
                  setIsMobileMenuOpen(false);
                }}
              >
                <DollarSign className="inline-block mr-2 h-4 w-4 text-green-500" />
                Pricing
              </button>
              <button 
                className="block w-full text-left py-2 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50"
                onClick={() => {
                  switchView("faq");
                  setIsMobileMenuOpen(false);
                }}
              >
                <HelpCircle className="inline-block mr-2 h-4 w-4 text-amber-500" />
                FAQ
              </button>
              <button 
                className="block w-full text-left py-2 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50"
                onClick={() => {
                  switchView("auth");
                  setIsMobileMenuOpen(false);
                  setTimeout(() => setActiveTab("login"), 100);
                }}
              >
                <Lock className="inline-block mr-2 h-4 w-4 text-purple-500" />
                Sign In
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 pt-28 pb-16 relative flex-grow min-h-[calc(100vh-144px)] z-10">
        {/* Beautiful background for main content area */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-indigo-50/80 dark:from-blue-950/10 dark:to-indigo-950/10 backdrop-blur-sm"></div>
          <img 
            src={abstractBackgroundSvg} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
        </div>
        {/* View Container */}
        <AnimatePresence mode="wait">
          {/* Privacy Policy View */}
          {activeView === "privacy" && (
            <motion.div
              key="privacy-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="max-w-3xl mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Privacy Policy
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                    Last updated: May 14, 2023
                  </p>
                </motion.div>
                
                <motion.div 
                  className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/30 dark:border-white/5 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="prose prose-blue dark:prose-invert max-w-none">
                    <h3>1. Introduction</h3>
                    <p>
                      At MarketInsightAI, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                    </p>
                    
                    <h3>2. Information We Collect</h3>
                    <p>
                      We collect information that you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include:
                    </p>
                    <ul>
                      <li>Personal identifiers (name, email address, username)</li>
                      <li>Authentication information (password)</li>
                      <li>Business information (company name, role)</li>
                      <li>Payment and billing information</li>
                      <li>Communications and feedback you provide</li>
                    </ul>
                    
                    <h3>3. How We Use Your Information</h3>
                    <p>We use your information for various purposes, including to:</p>
                    <ul>
                      <li>Provide, maintain, and improve our services</li>
                      <li>Process transactions and manage your account</li>
                      <li>Send you technical notices, updates, and administrative messages</li>
                      <li>Respond to your comments and questions</li>
                      <li>Protect against fraudulent, unauthorized, or illegal activity</li>
                    </ul>
                    
                    <h3>4. Data Security</h3>
                    <p>
                      We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
                    </p>
                    
                    <h3>5. Your Rights</h3>
                    <p>
                      Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, delete, or restrict processing of your data.
                    </p>
                    
                    <div className="flex justify-center mt-8">
                      <Button 
                        onClick={() => {
                          setActiveView("auth");
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Back to Login
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Terms of Service View */}
          {activeView === "terms" && (
            <motion.div
              key="terms-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="max-w-3xl mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Terms of Service
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                    Last updated: May 14, 2023
                  </p>
                </motion.div>
                
                <motion.div 
                  className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/30 dark:border-white/5 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="prose prose-blue dark:prose-invert max-w-none">
                    <h3>1. Acceptance of Terms</h3>
                    <p>
                      By accessing or using MarketInsightAI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                    </p>
                    
                    <h3>2. Description of Service</h3>
                    <p>
                      MarketInsightAI provides AI-powered market intelligence and business analytics tools ("Service"). The Service may include features for analyzing market trends, competitor intelligence, and business opportunities.
                    </p>
                    
                    <h3>3. Account Registration</h3>
                    <p>
                      To use certain features of the Service, you may need to register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                    
                    <h3>4. Subscription and Payments</h3>
                    <p>
                      Some features of the Service may require a paid subscription. All payments are processed securely through our payment providers. Subscriptions will automatically renew unless canceled before the renewal date.
                    </p>
                    
                    <h3>5. Intellectual Property</h3>
                    <p>
                      All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, and software, are owned by MarketInsightAI and are protected by intellectual property laws.
                    </p>
                    
                    <h3>6. Limitation of Liability</h3>
                    <p>
                      To the maximum extent permitted by law, MarketInsightAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
                    </p>
                    
                    <div className="flex justify-center mt-8">
                      <Button 
                        onClick={() => {
                          setActiveView("auth");
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Back to Login
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Contact View */}
          {activeView === "contact" && (
            <motion.div
              key="contact-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="max-w-3xl mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Contact Us
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                    We'd love to hear from you. Here's how you can reach us.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/30 dark:border-white/5 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="contact-name">Your Name</Label>
                          <Input id="contact-name" className="mt-1" placeholder="Enter your name" />
                        </div>
                        <div>
                          <Label htmlFor="contact-email">Email Address</Label>
                          <Input id="contact-email" type="email" className="mt-1" placeholder="Enter your email" />
                        </div>
                        <div>
                          <Label htmlFor="contact-subject">Subject</Label>
                          <Input id="contact-subject" className="mt-1" placeholder="How can we help you?" />
                        </div>
                        <div>
                          <Label htmlFor="contact-message">Message</Label>
                          <textarea
                            id="contact-message"
                            rows={4}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 backdrop-blur-md px-4 py-2 mt-1 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="Tell us more about your inquiry..."
                          />
                        </div>
                        <Button 
                          type="button" 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => alert("Message sent! We'll get back to you soon.")}
                        >
                          Send Message
                        </Button>
                      </form>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
                          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Email</h4>
                          <p className="text-gray-600 dark:text-gray-400">support@marketinsightai.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
                          <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Phone</h4>
                          <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
                          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Office Hours</h4>
                          <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 9AM - 5PM EST</p>
                        </div>
                      </div>
                      
                      <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
                        <Button 
                          onClick={() => {
                            setActiveView("auth");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          Back to Login
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Authentication View */}
          {activeView === "auth" && (
            <motion.div
              key="auth-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="auth-form-container max-w-md mx-auto">
                <motion.div 
                  className="glass-card-premium rounded-2xl overflow-hidden shadow-2xl gradient-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ translateY: -5 }}
                >
                  {/* Beautiful background elements for the login card */}
                  <div className="absolute inset-0 -z-10 bg-transparent dark:bg-gray-900/50 backdrop-blur-xl overflow-hidden">
                    <img 
                      src={abstractBackgroundSvg} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                    
                    {/* Animated spotlight effect */}
                    <motion.div
                      className="absolute -inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>
                  
                  <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-20rem)] aspect-[16/9] w-[72.1875rem] bg-gradient-to-tr from-blue-400 to-purple-400 opacity-30 sm:left-[calc(50%-30rem)]"></div>
                  </div>
                  
                  <div className="px-6 pt-6 pb-8">
                    <div className="mb-2">
                      <Tabs 
                        value={activeTab} 
                        onValueChange={setActiveTab}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 bg-white/30 dark:bg-gray-800/30 p-1">
                          <TabsTrigger 
                            value="login" 
                            className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                          >
                            <Lock className="mr-1.5 h-3.5 w-3.5" />
                            Sign In
                          </TabsTrigger>
                          <TabsTrigger 
                            value="register" 
                            className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                          >
                            <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                            Create Account
                          </TabsTrigger>
                        </TabsList>
                        
                        {/* Login Form */}
                        <TabsContent value="login" className="mt-6 space-y-4">
                          <div className="text-center">
                            <h2 className="text-xl font-bold font-heading">Welcome back</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account to continue</p>
                          </div>
                          
                          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5 mt-6">
                            <div className="space-y-3">
                              <div className="relative">
                                <Input
                                  id="login-username"
                                  className="form-input h-14 pt-4 pl-10 glass-input"
                                  placeholder=" "
                                  {...loginForm.register("username")}
                                />
                                <Label
                                  htmlFor="login-username"
                                  className="form-label absolute top-4 left-10 text-gray-500 dark:text-gray-400 pointer-events-none"
                                >
                                  Username
                                </Label>
                                <User className="absolute left-3 top-4 h-5 w-5 text-blue-500/70" />
                                {loginForm.formState.errors.username && (
                                  <div className="absolute right-3 top-4 text-red-500">
                                    <AlertCircle className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              {loginForm.formState.errors.username && (
                                <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.username.message}</p>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="relative">
                                <Input
                                  id="login-password"
                                  type="password"
                                  className="form-input h-14 pt-4 pl-10 glass-input"
                                  placeholder=" "
                                  {...loginForm.register("password")}
                                />
                                <Label
                                  htmlFor="login-password"
                                  className="form-label absolute top-4 left-10 text-gray-500 dark:text-gray-400 pointer-events-none"
                                >
                                  Password
                                </Label>
                                <Key className="absolute left-3 top-4 h-5 w-5 text-blue-500/70" />
                                {loginForm.formState.errors.password && (
                                  <div className="absolute right-3 top-4 text-red-500">
                                    <AlertCircle className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              {loginForm.formState.errors.password && (
                                <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label
                                  htmlFor="remember"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Remember me
                                </label>
                              </div>
                              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                Forgot password?
                              </a>
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 button-glow"
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              Sign In
                            </Button>
                          </form>
                          
                          <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                              onClick={() => setActiveTab("register")}
                            >
                              Create one now
                            </button>
                          </div>
                        </TabsContent>
                        
                        {/* Register Form */}
                        <TabsContent value="register" className="mt-6 space-y-4">
                          <div className="text-center">
                            <h2 className="text-xl font-bold font-heading">Create your account</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start your 14-day free trial today</p>
                          </div>
                          
                          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 mt-6">
                            <div className="space-y-3">
                              <div className="relative">
                                <Input
                                  id="register-name"
                                  className="form-input h-14 pt-4 pl-10 glass-input"
                                  placeholder=" "
                                  {...registerForm.register("name")}
                                />
                                <Label
                                  htmlFor="register-name"
                                  className="form-label absolute top-4 left-10 text-gray-500 dark:text-gray-400 pointer-events-none"
                                >
                                  Full Name
                                </Label>
                                <User className="absolute left-3 top-4 h-5 w-5 text-blue-500/70" />
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="relative">
                                <Input
                                  id="register-email"
                                  type="email"
                                  className="form-input h-14 pt-4 pl-10 glass-input"
                                  placeholder=" "
                                  {...registerForm.register("email")}
                                />
                                <Label
                                  htmlFor="register-email"
                                  className="form-label absolute top-4 left-10 text-gray-500 dark:text-gray-400 pointer-events-none"
                                >
                                  Email Address
                                </Label>
                                <Mail className="absolute left-3 top-4 h-5 w-5 text-blue-500/70" />
                                {registerForm.formState.errors.email && (
                                  <div className="absolute right-3 top-4 text-red-500">
                                    <AlertCircle className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              {registerForm.formState.errors.email && (
                                <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.email.message}</p>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="relative">
                                <Input
                                  id="register-username"
                                  className="form-input h-14 pt-4 pl-10 glass-input"
                                  placeholder=" "
                                  {...registerForm.register("username")}
                                />
                                <Label
                                  htmlFor="register-username"
                                  className="form-label absolute top-4 left-10 text-gray-500 dark:text-gray-400 pointer-events-none"
                                >
                                  Username
                                </Label>
                                <UserCheck className="absolute left-3 top-4 h-5 w-5 text-blue-500/70" />
                                {registerForm.formState.errors.username && (
                                  <div className="absolute right-3 top-4 text-red-500">
                                    <AlertCircle className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              {registerForm.formState.errors.username && (
                                <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.username.message}</p>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="relative">
                                <Input
                                  id="register-password"
                                  type="password"
                                  className="form-input h-14 pt-4 pl-10 glass-input"
                                  placeholder=" "
                                  {...registerForm.register("password")}
                                />
                                <Label
                                  htmlFor="register-password"
                                  className="form-label absolute top-4 left-10 text-gray-500 dark:text-gray-400 pointer-events-none"
                                >
                                  Password
                                </Label>
                                <Lock className="absolute left-3 top-4 h-5 w-5 text-blue-500/70" />
                                {registerForm.formState.errors.password && (
                                  <div className="absolute right-3 top-4 text-red-500">
                                    <AlertCircle className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              {registerForm.formState.errors.password && (
                                <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.password.message}</p>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="relative">
                                <Input
                                  id="register-confirm-password"
                                  type="password"
                                  className="form-input h-14 pt-4 pl-10 glass-input"
                                  placeholder=" "
                                  {...registerForm.register("confirmPassword")}
                                />
                                <Label
                                  htmlFor="register-confirm-password"
                                  className="form-label absolute top-4 left-10 text-gray-500 dark:text-gray-400 pointer-events-none"
                                >
                                  Confirm Password
                                </Label>
                                <Key className="absolute left-3 top-4 h-5 w-5 text-blue-500/70" />
                                {registerForm.formState.errors.confirmPassword && (
                                  <div className="absolute right-3 top-4 text-red-500">
                                    <AlertCircle className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              {registerForm.formState.errors.confirmPassword && (
                                <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                              )}
                            </div>
                            
                            <div className="flex items-start space-x-2 mt-4">
                              <Checkbox 
                                id="terms" 
                                {...registerForm.register("terms")} 
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor="terms"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  I agree to the <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</a>
                                </label>
                                {registerForm.formState.errors.terms && (
                                  <p className="text-sm text-red-500">{registerForm.formState.errors.terms.message}</p>
                                )}
                              </div>
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full h-12 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 button-glow"
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              Create Account
                            </Button>
                          </form>
                          
                          <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
                            <button 
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                              onClick={() => setActiveTab("login")}
                            >
                              Sign in
                            </button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {/* Features View */}
          {activeView === "features" && (
            <motion.div
              key="features-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Powerful Features for Market Intelligence
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                    Discover how MarketInsightAI can transform your business decisions with AI-powered analytics and intelligence.
                  </p>
                  
                  <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl mb-12 glass-card">
                    <img 
                      src={marketAnalysisSvg} 
                      alt="Market Analysis Dashboard" 
                      className="w-full h-auto" 
                    />
                  </div>
                </motion.div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/30 dark:border-white/5 p-6 hover-lift card-3d"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: feature.delay }}
                    >
                      <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-900/30 dark:to-indigo-900/30">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold font-heading mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.points.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button 
                    className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 button-glow"
                    onClick={() => {
                      switchView("auth");
                      setTimeout(() => setActiveTab("register"), 100);
                    }}
                  >
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Pricing View */}
          {activeView === "pricing" && (
            <motion.div
              key="pricing-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="max-w-5xl mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Simple, Transparent Pricing
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                    Choose the plan that's right for your business. All plans include a 14-day free trial.
                  </p>
                  
                  <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-xl mb-12 glass-card">
                    <img 
                      src={businessGrowthSvg} 
                      alt="Business Growth Analytics" 
                      className="w-full h-auto" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-center mt-8 space-x-3">
                    <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>Monthly</span>
                    <Switch
                      checked={billingPeriod === "annual"}
                      onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className={`text-sm font-medium ${billingPeriod === "annual" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                      Annual
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 font-medium">
                        Save 20%
                      </Badge>
                    </span>
                  </div>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(plans).map(([key, plan], index) => (
                    <motion.div 
                      key={key}
                      className={cn(
                        "glass-card rounded-2xl overflow-hidden shadow-lg",
                        "hover:shadow-xl transition-all duration-300 card-3d",
                        key === "pro" && "md:scale-105 md:z-10 relative"
                      )}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                    >
                      {key === "pro" && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                      )}
                      <div className={`p-1 bg-gradient-to-r ${plan.color}`}>
                        <div className={`${plan.textColor} font-medium text-center text-xs uppercase tracking-wider py-1`}>
                          {plan.badge}
                        </div>
                      </div>
                      <div className="px-6 py-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-lg ${plan.color} flex items-center justify-center mr-2`}>
                                {plan.icon}
                              </div>
                              <h3 className="text-xl font-bold font-heading">{plan.name}</h3>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{plan.description}</p>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{plan.price}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">{plan.period}</div>
                          {billingPeriod === "annual" && 'saveAmount' in plan && (
                            <div className="text-green-600 dark:text-green-400 text-sm mt-1">Save {plan.saveAmount} per year</div>
                          )}
                        </div>
                        
                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <Button 
                          className={cn(
                            "w-full bg-gradient-to-r",
                            key === "starter" ? "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" :
                            key === "pro" ? "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 button-glow" :
                            "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          )}
                          onClick={() => {
                            switchView("auth");
                            setTimeout(() => setActiveTab("register"), 100);
                          }}
                        >
                          {plan.buttonText}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="mt-16 glass-card rounded-2xl overflow-hidden shadow-xl border border-white/30 dark:border-white/5 p-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-2xl font-bold font-heading mb-4">Need a custom plan?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    We offer customized solutions for large organizations with specific requirements. Contact our sales team to discuss your needs.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-blue-300 hover:border-blue-500 dark:border-blue-700 dark:hover:border-blue-500"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Schedule a Call
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {/* FAQ View */}
          {activeView === "faq" && (
            <motion.div
              key="faq-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="max-w-3xl mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                    Find answers to common questions about MarketInsightAI.
                  </p>
                  
                  <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-xl mb-12 glass-card">
                    <img 
                      src={analyticsDashboardSvg} 
                      alt="Analytics Dashboard" 
                      className="w-full h-auto" 
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/30 dark:border-white/5 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/20 dark:border-gray-800/50">
                        <AccordionTrigger className="text-left font-medium py-4 hover:text-blue-600 dark:hover:text-blue-400 [&[data-state=open]]:text-blue-600 dark:[&[data-state=open]]:text-blue-400">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-400 pt-1 pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
                
                <motion.div 
                  className="mt-12 glass-card rounded-2xl overflow-hidden shadow-xl border border-white/30 dark:border-white/5 p-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold font-heading mb-3">Still have questions?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We're here to help. Contact our support team for more information.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                    <Button variant="outline" className="border-blue-300 hover:border-blue-500 dark:border-blue-700 dark:hover:border-blue-500">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      View Documentation
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="glass border-t border-white/20 dark:border-gray-800/30 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BarChart2 className="h-5 w-5 text-white" />
                </motion.div>
              </div>
              <span className="text-gray-800 dark:text-gray-200 font-medium">MarketInsightAI © {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-6">
              <Button 
                variant="link" 
                onClick={() => {
                  setActiveView("privacy");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:underline transition-colors p-0 h-auto"
              >
                Privacy Policy
              </Button>
              <Button 
                variant="link" 
                onClick={() => {
                  setActiveView("terms");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:underline transition-colors p-0 h-auto"
              >
                Terms of Service
              </Button>
              <Button 
                variant="link" 
                onClick={() => {
                  setActiveView("contact");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:underline transition-colors p-0 h-auto"
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Prevents empty space after footer */}
      <div className="h-0 overflow-hidden bg-animated-gradient"></div>
    </div>
  );
}
