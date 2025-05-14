import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  Moon,
  Sun,
  Star,
  Send,
} from "lucide-react";

// Extended schemas with validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type NewsletterFormValues = z.infer<typeof newsletterSchema>;

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

// Testimonial data
const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechTrend Innovations",
    quote: "MarketInsightAI transformed our strategy with actionable insights. We identified a new market segment in just weeks!",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    company: "Global Ventures",
    quote: "The real-time trend analysis is a game-changer. Our campaigns are now 30% more effective.",
    avatar: "https://i.pravatar.cc/150?u=michael",
  },
  {
    name: "Emily Davis",
    role: "Founder",
    company: "StartupSpark",
    quote: "The AI-powered opportunity validation saved us from a costly mistake. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?u=emily",
  },
];

// Component for animated chart in market trends
const MarketTrendChart = () => (
  <motion.div
    className="h-40 w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative w-full h-full">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <motion.path
          d="M0,80 L40,60 L80,70 L120,50 L160,65 L200,55"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      <span className="absolute top-2 left-2 text-xs text-gray-600 dark:text-gray-300">
        Live Market Trends
      </span>
    </div>
  </motion.div>
);

// Component for quick actions sidebar
const QuickActions = () => (
  <motion.div
    className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    initial={{ x: 100 }}
    animate={{ x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}
    >
      <Lightbulb className="h-4 w-4" />
      <span className="text-sm">Features</span>
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })}
    >
      <Gem className="h-4 w-4" />
      <span className="text-sm">Pricing</span>
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => document.querySelector(".auth-form-container")?.scrollIntoView({ behavior: "smooth" })}
    >
      <Rocket className="h-4 w-4" />
      <span className="text-sm">Sign Up</span>
    </Button>
  </motion.div>
);

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "enterprise">("pro");
  const [activeTab, setActiveTab] = useState("login");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTour, setShowTour] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Newsletter form
  const newsletterForm = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  // Scroll handling for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY <= lastScrollY || currentScrollY < 80);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Redirect if logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      confirmPassword: "",
    },
  });

  // Form submission handlers
  const onLoginSubmit = useCallback(
    (data: LoginFormValues) => loginMutation.mutate(data),
    [loginMutation]
  );

  const onRegisterSubmit = useCallback(
    (data: RegisterFormValues) => {
      const { confirmPassword, ...registerData } = data;
      registerMutation.mutate(registerData);
    },
    [registerMutation]
  );

  const onNewsletterSubmit = useCallback(
    (data: NewsletterFormValues) => {
      console.log("Newsletter subscription:", data);
      newsletterForm.reset();
    },
    [newsletterForm]
  );

  // Plans data
  const plans = useMemo(
    () => ({
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
          "Community access",
          "Basic API access",
        ],
        buttonText: "Start Free Trial",
        color: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40",
        badge: "14-Day Free Trial",
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
          "Team collaboration (up to 5 users)",
          "Advanced API access",
        ],
        buttonText: "Choose Pro",
        color: "border-blue-400 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40",
        badge: "Most Popular",
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
          "On-demand market research",
          "White-label reports",
        ],
        buttonText: "Contact Sales",
        color: "border-blue-300 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40",
        badge: "Complete Solution",
      },
    }),
    [billingPeriod]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}>
      {/* Guided Tour Modal */}
      <Dialog open={showTour} onOpenChange={setShowTour}>
        <DialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50">
          <DialogHeader>
            <DialogTitle>Welcome to MarketInsightAI!</DialogTitle>
            <DialogDescription>
              Take a quick tour to discover how our platform can transform your business strategy.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-gray-600 dark:text-gray-300">
              Explore features, pricing, and start your free trial today!
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowTour(false)}
            >
              Start Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Actions Sidebar */}
      <QuickActions />

      {/* Header */}
      <header
        className={`border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-sm transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <BarChart2 className="h-5 w-5 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              MarketInsight<span className="text-blue-600 dark:text-blue-400">AI</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                href="#features"
              >
                Features
              </a>
              <a
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                href="#pricing"
              >
                Pricing
              </a>
              <a
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                href="#faq"
              >
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-gray-600 dark:text-gray-300"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-700"
                onClick={() => {
                  document.querySelector(".auth-form-container")?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => setActiveTab("login"), 100);
                }}
              >
                Sign In
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
                size="sm"
                onClick={() => {
                  document.querySelector(".auth-form-container")?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => setActiveTab("register"), 100);
                }}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-gray-600 dark:text-gray-300"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-gray-300">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Features
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Pricing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => document.querySelector("#faq")?.scrollIntoView({ behavior: "smooth" })}
                >
                  FAQ
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Contact Us
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    document.querySelector(".auth-form-container")?.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => setActiveTab("login"), 100);
                  }}
                >
                  Login
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={() => {
                document.querySelector(".auth-form-container")?.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => setActiveTab("register"), 100);
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:py-32 bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Badge className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 mb-4 px-4 py-2 text-sm rounded-full border border-blue-200 dark:border-blue-800">
                  Powered by Advanced AI
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white leading-tight">
                  Unlock <span className="text-blue-700 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Market Opportunities</span> <br /> with AI Insights
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed">
                  Leverage cutting-edge AI to analyze trends, validate ideas, and outpace competitors with data-driven strategies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 px-8 text-base font-semibold"
                    onClick={() => {
                      document.querySelector(".auth-form-container")?.scrollIntoView({ behavior: "smooth" });
                      setTimeout(() => setActiveTab("register"), 100);
                    }}
                  >
                    Start Free Trial <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 text-base font-medium"
                    asChild
                  >
                    <a href="#features">
                      Discover Features <ChevronRight className="w-5 h-5" />
                    </a>
                  </Button>
                </div>
                <div className="flex items-center gap-6 mt-10">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.img
                        key={i}
                        src={`https://i.pravatar.cc/50?u=user${i}`}
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-900"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Trusted by 2,500+ innovators worldwide
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="w-full md:w-1/2">
              <motion.div
                className="auth-form-container bg-white/80 dark:bg-gray-800/80 shadow-2xl rounded-2xl p-8 border border-blue-100/50 dark:border-blue-900/30 backdrop-blur-xl relative overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-300/20 to-blue-100/20 dark:from-blue-900/30 dark:to-blue-800/30 rounded-bl-full -z-10" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-300/20 to-blue-100/20 dark:from-blue-900/30 dark:to-blue-800/30 rounded-tr-full -z-10" />
                <Tabs
                  defaultValue={activeTab}
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-1">
                    <TabsTrigger
                      value="login"
                      className="py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-blue-700 data-[state=active]:dark:text-blue-400 data-[state=active]:shadow-md rounded-lg"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-blue-700 data-[state=active]:dark:text-blue-400 data-[state=active]:shadow-md rounded-lg"
                    >
                      Create Account
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                      <div className="space-y-3">
                        <Label htmlFor="login-username" className="text-base font-medium">
                          Username
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="login-username"
                            type="text"
                            className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            {...loginForm.register("username")}
                          />
                        </div>
                        {loginForm.formState.errors.username && (
                          <motion.p
                            className="text-sm text-red-500 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            {loginForm.formState.errors.username.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password" className="text-base font-medium">
                            Password
                          </Label>
                          <a
                            href="#"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="login-password"
                            type="password"
                            className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            {...loginForm.register("password")}
                          />
                        </div>
                        {loginForm.formState.errors.password && (
                          <motion.p
                            className="text-sm text-red-500 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            {loginForm.formState.errors.password.message}
                          </motion.p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 font-semibold tracking-wide"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Don't have an account?{" "}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            onClick={() => setActiveTab("register")}
                          >
                            Sign up now
                          </button>
                        </p>
                      </div>
                    </form>
                  </TabsContent>
                  <TabsContent value="register">
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                      <div className="space-y-3">
                        <Label htmlFor="register-name" className="text-base font-medium">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="register-name"
                            type="text"
                            className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your full name"
                            {...registerForm.register("name")}
                          />
                        </div>
                        {registerForm.formState.errors.name && (
                          <motion.p
                            className="text-sm text-red-500 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            {registerForm.formState.errors.name.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="register-email" className="text-base font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email address"
                            {...registerForm.register("email")}
                          />
                        </div>
                        {registerForm.formState.errors.email && (
                          <motion.p
                            className="text-sm text-red-500 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            {registerForm.formState.errors.email.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="register-username" className="text-base font-medium">
                          Username
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="register-username"
                            type="text"
                            className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                            placeholder="Choose a username"
                            {...registerForm.register("username")}
                          />
                        </div>
                        {registerForm.formState.errors.username && (
                          <motion.p
                            className="text-sm text-red-500 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            {registerForm.formState.errors.username.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="register-password" className="text-base font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="register-password"
                            type="password"
                            className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                            placeholder="Create a secure password"
                            {...registerForm.register("password")}
                          />
                        </div>
                        {registerForm.formState.errors.password && (
                          <motion.p
                            className="text-sm text-red-500 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            {registerForm.formState.errors.password.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="register-confirm-password" className="text-base font-medium">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="register-confirm-password"
                            type="password"
                            className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                            {...registerForm.register("confirmPassword")}
                          />
                        </div>
                        {registerForm.formState.errors.confirmPassword && (
                          <motion.p
                            className="text-sm text-red-500 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            {registerForm.formState.errors.confirmPassword.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          By creating an account, you agree to our{" "}
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline underline-offset-4"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline underline-offset-4"
                          >
                            Privacy Policy
                          </a>.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 font-semibold tracking-wide"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating your account...
                          </>
                        ) : (
                          "Create Free Account"
                        )}
                      </Button>
                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Already have an account?{" "}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            onClick={() => setActiveTab("login")}
                          >
                            Sign in
                          </button>
                        </p>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Trends Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/90">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600/10 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
              Real-Time Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Explore <span className="text-blue-700 dark:text-blue-400">Live Market Trends</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get a glimpse of our powerful analytics with real-time market data visualizations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md"
              whileHover={{ y: -5, boxShadow: "0 15px 25px rgba(0,0,0,0.1)" }}
            >
              <MarketTrendChart />
              <h3 className="text-xl font-semibold mt-4 mb-2">Consumer Trends</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor shifts in consumer behavior across industries.
              </p>
            </motion.div>
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md"
              whileHover={{ y: -5, boxShadow: "0 15px 25px rgba(0,0,0,0.1)" }}
            >
              <MarketTrendChart />
              <h3 className="text-xl font-semibold mt-4 mb-2">Competitor Activity</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track competitor performance and market positioning.
              </p>
            </motion.div>
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md"
              whileHover={{ y: -5, boxShadow: "0 15px 25px rgba(0,0,0,0.1)" }}
            >
              <MarketTrendChart />
              <h3 className="text-xl font-semibold mt-4 mb-2">Industry Growth</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Identify high-growth sectors and emerging opportunities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600/10 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
              Core Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Empower Your Business with <span className="text-blue-700 dark:text-blue-400">AI-Driven Tools</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From predictive analytics to global market access, our platform equips you with everything you need to succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BrainCircuit,
                title: "AI-Powered Analysis",
                description: "Leverage advanced algorithms to uncover hidden patterns and predict market trends with high accuracy.",
              },
              {
                icon: TrendingUp,
                title: "Real-Time Market Trends",
                description: "Stay ahead with live updates on industry shifts, consumer behavior, and emerging opportunities.",
              },
              {
                icon: Users,
                title: "Competitor Intelligence",
                description: "Analyze competitor strategies and positioning to gain a competitive edge in your market.",
              },
              {
                icon: Target,
                title: "Opportunity Validation",
                description: "Validate business ideas with real market data to minimize risks and maximize returns.",
              },
              {
                icon: FileText,
                title: "Custom Reports",
                description: "Generate professional reports with actionable insights and stunning visualizations.",
              },
              {
                icon: Globe,
                title: "Global Market Access",
                description: "Explore international markets to identify expansion opportunities and global trends.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md"
                whileHover={{ y: -5, boxShadow: "0 15px 25px rgba(0,0,0,0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-12 w-12 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-blue-50/50 dark:bg-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600/10 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
              Customer Stories
            </aranteed
Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              What Our <span className="text-blue-700 dark:text-blue-400">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Hear from business leaders who transformed their strategies with MarketInsightAI.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full border-2 border-blue-200 dark:border-blue-800"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonials[currentTestimonial].quote}"
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600/10 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
              Pricing Plans
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Find the Perfect <span className="text-blue-700 dark:text-blue-400">Plan for You</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Scalable plans with a 14-day free trial. Unlock powerful features tailored to your business needs.
            </p>
            <div className="flex items-center justify-center gap-3 mb-10">
              <span
                className={`text-sm font-medium ${
                  billingPeriod === "monthly" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Monthly
              </span>
              <div className="relative inline-block">
                <Switch
                  checked={billingPeriod === "annual"}
                  onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
                  className="data-[state=checked]:bg-blue-600"
                />
                {billingPeriod === "annual" && (
                  <span className="absolute -top-3 -right-20 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    Save 20%
                  </span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  billingPeriod === "annual" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Annual
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(plans).map(([key, plan]) => (
              <motion.div
                key={key}
                className={`rounded-xl border ${
                  selectedPlan === key
                    ? plan.color
                    : "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80"
                } shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 backdrop-blur-md`}
                whileHover={{ y: -5, boxShadow: "0 20px 25px rgba(0,0,0,0.1)" }}
                onClick={() => setSelectedPlan(key as any)}
              >
                <div className="p-6 pb-0">
                  {plan.badge && (
                    <Badge
                      className={`mb-4 ${
                        key === "pro"
                          ? "bg-blue-600/10 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}
                    >
                      {plan.badge}
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 mb-4">{plan.description}</p>
                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">{plan.period}</span>
                    </div>
                    {billingPeriod === "annual" && plan.saveAmount && (
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                        Save {plan.saveAmount} annually
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Button
                    className="w-full h-12 text-base font-semibold"
                    variant={selectedPlan === key ? "default" : "outline"}
                    onClick={() => {
                      setSelectedPlan(key as any);
                      document.querySelector(".auth-form-container")?.scrollIntoView({ behavior: "smooth" });
                      setTimeout(() => setActiveTab("register"), 100);
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-8 text-center backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Need a custom solution?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Our enterprise team can tailor MarketInsightAI to meet your unique business requirements.
            </p>
            <Button
              variant="outline"
              className="mx-auto text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
            >
              Contact Our Sales Team
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600/10 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Answers to Your <span className="text-blue-700 dark:text-blue-400">Questions</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to know about MarketInsightAI and our services.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "What is MarketInsightAI?",
                  answer:
                    "MarketInsightAI is a cutting-edge platform that uses AI to analyze market data, validate business ideas, and provide actionable insights for strategic decision-making.",
                },
                {
                  question: "How does the free trial work?",
                  answer:
                    "Our 14-day free trial grants full access to all features without a credit card. You'll receive a reminder before the trial ends to choose a plan or cancel.",
                },
                {
                  question: "Can I switch between plans?",
                  answer:
                    "Yes, you can upgrade or downgrade anytime from your account settings. Upgrades take effect immediately, while downgrades apply at the next billing cycle.",
                },
                {
                  question: "What data sources do you use?",
                  answer:
                    "We aggregate data from industry reports, public financials, consumer behavior stats, social media trends, and proprietary datasets, all processed by our AI.",
                },
                {
                  question: "How accurate is the AI analysis?",
                  answer:
                    "Our AI models are highly accurate, trained on vast datasets. We recommend combining our insights with your expertise for optimal decision-making.",
                },
                {
                  question: "Do you offer custom solutions?",
                  answer:
                    "Yes, our enterprise solutions include custom integrations, reporting dashboards, and specialized analytics. Contact our sales team for details.",
                },
              ].map((item, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-left text-lg font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600/10 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
              Contact Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              We're Here to <span className="text-blue-700 dark:text-blue-400">Help</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Reach out to our team for support, inquiries, or to explore custom solutions for your business.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-8 flex flex-col items-center border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md"
              whileHover={{ y: -5, boxShadow: "0 15px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="h-14 w-14 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                Get a response within 24 hours.
              </p>
              <a
                href="mailto:faisalh556@gmail.com"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                faisalh556@gmail.com
              </a>
            </motion.div>
            <motion.div
              className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-8 flex flex-col items-center border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md"
              whileHover={{ y: -5, boxShadow: "0 15px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="h-14 w-14 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <Phone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                Available Monday to Friday, 9am to 5pm.
              </p>
              <Button
                variant="outline"
                className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
              >
                Contact Support
              </Button>
            </motion.div>
            <motion.div
              className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-8 flex flex-col items-center border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md"
              whileHover={{ y: -5, boxShadow: "0 15px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="h-14 w-14 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <Send className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                Connect with our team instantly.
              </p>
              <Button
                variant="outline"
                className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
              >
                Start Chat
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-300/30 dark:text-blue-100 px-4 py-2 rounded-full border-none">
              Get Started
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Revolutionize Your Strategy with <span className="underline decoration-blue-300 decoration-4">MarketInsightAI</span>
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join thousands of businesses unlocking new opportunities with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2 bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-blue-300/30 px-8 text-base font-semibold"
                onClick={() => {
                  document.querySelector(".auth-form-container")?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => setActiveTab("register"), 100);
                }}
              >
                Start Your Free Trial <Rocket className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-blue-200 text-white hover:bg-blue-500/30 hover:border-blue-300 text-base font-medium"
              >
                Schedule a Demo
              </Button>
            </div>
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-100" />
                <span className="text-sm text-blue-100">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-100" />
                <span className="text-sm text-blue-100">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-100" />
                <span className="text-sm text-blue-100">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <BarChart2 className="h-5 w-5 text-white" />
                </motion.div>
                <h1 className="text-xl font-bold text-white">
                  MarketInsight<span className="text-blue-400">AI</span>
                </h1>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-md">
                Empowering businesses with AI-driven market intelligence to uncover opportunities and drive growth.
              </p>
              <form onSubmit={newsletterForm.handleSubmit(onNewsletterSubmit)} className="mt-6">
                <Label htmlFor="newsletter-email" className="text-sm font-medium text-white">
                  Subscribe to Our Newsletter
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    {...newsletterForm.register("email")}
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {newsletterForm.formState.errors.email && (
                  <p className="text-sm text-red-400 mt-1">
                    {newsletterForm.formState.errors.email.message}
                  </p>
                )}
              </form>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="hover:text-blue-300 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Enterprise
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Customer Stories
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-blue-300 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-blue-300 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    API Status
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-blue-300 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">
                    Partners
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-400">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>© 2025 MarketInsightAI. All rights reserved.</div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-blue-300 transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
