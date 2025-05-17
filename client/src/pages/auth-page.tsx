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
import marketAnalysisSvg from "../assets/market-analysis.svg";
import businessGrowthSvg from "../assets/business-growth.svg";
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
      MarketInsight<span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-purple-500 text-transparent">AI</span>
    </h1>
  </div>
);

// Add import for the new image at the top with other assets
import marketAnalysisJpg from "../assets/market-analysis.jpg";

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

  // ... rest of the code remains unchanged ...

  // The rest of the component code is unchanged and omitted for brevity.
  // (No changes to the main render logic or ContentTemplate.)

}
