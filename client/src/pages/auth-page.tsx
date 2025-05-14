import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Icons
import {
  BarChart2,
  Sparkles,
  BrainCircuit,
  Globe,
  Shield,
  ArrowRight,
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
  Loader2,
  Menu,
  Phone,
  Sun,
  Moon,
  Star,
  Twitter,
  Github
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

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "enterprise">("pro");
  const [activeTab, setActiveTab] = useState("login");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Form handling
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", email: "", name: "", confirmPassword: "" },
  });

  // Form submission handlers
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Plans data
  const plans = {
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
      color: "border-purple-800 bg-purple-950/20",
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
      color: "border-blue-800 bg-blue-950/20",
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
      color: "border-purple-800 bg-purple-950/20",
      badge: "Complete Solution"
    }
  };

  // Particle background
  const particles = Array.from({ length: 30 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute h-1.5 w-1.5 bg-white/30 rounded-full"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -15, 0],
        opacity: [0.1, 0.5, 0.1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 to-purple-950">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} bg-gradient-to-br from-blue-950 to-purple-950 text-gray-100 transition-colors duration-500`}>
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 bg-blue-950/50 backdrop-blur-xl border-b border-blue-800/50 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              aria-label="MarketInsightAI Logo"
            >
              <BarChart2 className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-extrabold tracking-wide text-white">MarketInsight<span className="text-blue-400">AI</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors" href="#features">Features</a>
              <a className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors" href="#pricing">Pricing</a>
              <a className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors" href="#faq">FAQ</a>
            </nav>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    className="text-gray-300 hover:bg-blue-900/50"
                  >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDarkMode ? "Light Mode" : "Dark Mode"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
              onClick={() => {
                document.querySelector('.auth-form-container')?.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => setActiveTab("register"), 100);
              }}
            >
              Start Free Trial
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden border-blue-800 bg-blue-950/50 text-gray-300">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-blue-950/80 backdrop-blur-md text-gray-200 border-blue-800">
                <DropdownMenuItem onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}>
                  Features
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                  Pricing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' })}>
                  FAQ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Contact Us
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    document.querySelector('.auth-form-container')?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => setActiveTab("login"), 100);
                  }}
                >
                  Login
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0">{particles}</div>
        <motion.div
          className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10"
          style={{ opacity, scale }}
        >
          <div className="md:w-1/2 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full border-blue-800">
                Cosmic Market Intelligence
              </Badge>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-wide">
                Explore <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Galactic Insights</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
                Harness AI to navigate market trends and uncover stellar business opportunities across the universe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)] px-8 animate-pulse-glow"
                  onClick={() => {
                    document.querySelector('.auth-form-container')?.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => setActiveTab("register"), 100);
                  }}
                >
                  Launch Now <Rocket className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-800 text-blue-300 hover:bg-blue-900/50 hover:border-blue-700"
                  asChild
                >
                  <a href="#features">
                    Discover Features <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-10 justify-center md:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center border-2 border-blue-800">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">Trusted by 1,000+ cosmic innovators</p>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="md:w-1/2 auth-form-container bg-blue-950/30 p-8 rounded-3xl shadow-glass border border-blue-800/50 backdrop-blur-xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8 bg-blue-900/30 rounded-xl backdrop-blur-sm">
                <TabsTrigger
                  value="login"
                  className="py-3 text-lg font-semibold text-gray-300 data-[state=active]:bg-blue-800/50 data-[state=active]:text-blue-400"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="py-3 text-lg font-semibold text-gray-300 data-[state=active]:bg-blue-800/50 data-[state=active]:text-blue-400"
                >
                  Create Account
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="login-username" className="text-sm font-medium text-gray-200">Username</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-blue-400" />
                      </div>
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Enter your username"
                        className="pl-10 h-12 rounded-xl bg-blue-900/50 border-blue-800 text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm"
                        {...loginForm.register("username")}
                        aria-invalid={loginForm.formState.errors.username ? "true" : "false"}
                        autoFocus
                      />
                    </motion.div>
                    <AnimatePresence>
                      {loginForm.formState.errors.username && (
                        <motion.p
                          className="text-sm text-red-500 mt-1 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Star className="h-4 w-4" /> {loginForm.formState.errors.username.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-sm font-medium text-gray-200">Password</Label>
                      <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</a>
                    </div>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Key className="h-5 w-5 text-blue-400" />
                      </div>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 h-12 rounded-xl bg-blue-900/50 border-blue-800 text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm"
                        {...loginForm.register("password")}
                        aria-invalid={loginForm.formState.errors.password ? "true" : "false"}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {loginForm.formState.errors.password && (
                        <motion.p
                          className="text-sm text-red-500 mt-1 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Star className="h-4 w-4" /> {loginForm.formState.errors.password.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg animate-pulse-glow"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  <div className="mt-4 flex items-center justify-center">
                    <p className="text-sm text-gray-400">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-blue-400 hover:text-blue-300 font-medium"
                        onClick={() => setActiveTab("register")}
                      >
                        Sign up now
                      </button>
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-blue-800 text-blue-300 hover:bg-blue-900/50"
                    >
                      <Twitter className="mr-2 h-5 w-5" /> Sign in with Twitter
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 border-blue-800 text-blue-300 hover:bg-blue-900/50"
                    >
                      <Github className="mr-2 h-5 w-5" /> Sign in with GitHub
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="register-name" className="text-sm font-medium text-gray-200">Full Name</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-blue-400" />
                      </div>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 h-12 rounded-xl bg-blue-900/50 border-blue-800 text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm"
                        {...registerForm.register("name")}
                        aria-invalid={registerForm.formState.errors.name ? "true" : "false"}
                        autoFocus
                      />
                    </motion.div>
                    <AnimatePresence>
                      {registerForm.formState.errors.name && (
                        <motion.p
                          className="text-sm text-red-500 mt-1 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Star className="h-4 w-4" /> {registerForm.formState.errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="register-email" className="text-sm font-medium text-gray-200">Email</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-blue-400" />
                      </div>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-10 h-12 rounded-xl bg-blue-900/50 border-blue-800 text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm"
                        {...registerForm.register("email")}
                        aria-invalid={registerForm.formState.errors.email ? "true" : "false"}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {registerForm.formState.errors.email && (
                        <motion.p
                          className="text-sm text-red-500 mt-1 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Star className="h-4 w-4" /> {registerForm.formState.errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="register-username" className="text-sm font-medium text-gray-200">Username</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-blue-400" />
                      </div>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username"
                        className="pl-10 h-12 rounded-xl bg-blue-900/50 border-blue-800 text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm"
                        {...registerForm.register("username")}
                        aria-invalid={registerForm.formState.errors.username ? "true" : "false"}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {registerForm.formState.errors.username && (
                        <motion.p
                          className="text-sm text-red-500 mt-1 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Star className="h-4 w-4" /> {registerForm.formState.errors.username.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="register-password" className="text-sm font-medium text-gray-200">Password</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Key className="h-5 w-5 text-blue-400" />
                      </div>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a secure password"
                        className="pl-10 h-12 rounded-xl bg-blue-900/50 border-blue-800 text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm"
                        {...registerForm.register("password")}
                        aria-invalid={registerForm.formState.errors.password ? "true" : "false"}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {registerForm.formState.errors.password && (
                        <motion.p
                          className="text-sm text-red-500 mt-1 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Star className="h-4 w-4" /> {registerForm.formState.errors.password.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-200">Confirm Password</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Key className="h-5 w-5 text-blue-400" />
                      </div>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10 h-12 rounded-xl bg-blue-900/50 border-blue-800 text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm"
                        {...registerForm.register("confirmPassword")}
                        aria-invalid={registerForm.formState.errors.confirmPassword ? "true" : "false"}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {registerForm.formState.errors.confirmPassword && (
                        <motion.p
                          className="text-sm text-red-500 mt-1 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Star className="h-4 w-4" /> {registerForm.formState.errors.confirmPassword.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="text-sm text-gray-400">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>.
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg animate-pulse-glow"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating your account...
                      </>
                    ) : (
                      "Create Free Account"
                    )}
                  </Button>
                  <div className="mt-4 flex items-center justify-center">
                    <p className="text-sm text-gray-400">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-blue-400 hover:text-blue-300 font-medium"
                        onClick={() => setActiveTab("login")}
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-blue-800 text-blue-300 hover:bg-blue-900/50"
                    >
                      <Twitter className="mr-2 h-5 w-5" /> Sign up with Twitter
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 border-blue-800 text-blue-300 hover:bg-blue-900/50"
                    >
                      <Github className="mr-2 h-5 w-5" /> Sign up with GitHub
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-blue-950 to-blue-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full border-blue-800">Stellar Features</Badge>
            <h2 className="text-4xl font-extrabold text-white mb-4">Navigate Markets with <span className="text-blue-400">Cosmic Precision</span></h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform delivers interstellar insights to propel your business to new galaxies.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BrainCircuit, title: "AI-Powered Analysis", description: "Advanced algorithms analyze cosmic datasets to predict market trends." },
              { icon: TrendingUp, title: "Real-Time Trends", description: "Track interstellar market shifts and consumer behavior instantly." },
              { icon: Users, title: "Competitor Intelligence", description: "Monitor rival strategies to gain a galactic edge." },
              { icon: Target, title: "Opportunity Validation", description: "Test business ideas against stellar market data." },
              { icon: FileText, title: "Custom Reports", description: "Generate professional reports with cosmic visualizations." },
              { icon: Globe, title: "Global Access", description: "Explore markets across the universe with ease." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-blue-950/30 p-6 rounded-2xl shadow-glass border border-blue-800/50 backdrop-blur-xl hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)]"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <feature.icon className="h-12 w-12 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white text-center">{feature.title}</h3>
                <p className="text-gray-300 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full border-blue-800">Pricing Plans</Badge>
            <h2 className="text-4xl font-extrabold text-white mb-4">Choose Your <span className="text-blue-400">Orbit</span></h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Select a plan to launch your business into the stars. All plans include a 14-day free trial.
            </p>
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className={`text-sm ${billingPeriod === "monthly" ? "text-white" : "text-gray-400"}`}>Monthly</span>
              <div className="relative inline-block">
                <Switch
                  checked={billingPeriod === "annual"}
                  onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
                  className="data-[state=checked]:bg-blue-600"
                />
                {billingPeriod === "annual" && (
                  <span className="absolute -top-3 -right-20 bg-green-900/50 text-green-300 text-xs font-medium px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                )}
              </div>
              <span className={`text-sm ${billingPeriod === "annual" ? "text-white" : "text-gray-400"}`}>Annual</span>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.entries(plans).map(([key, plan]) => (
              <motion.div
                key={key}
                className={`rounded-2xl border ${selectedPlan === key ? plan.color : "border-blue-800 bg-blue-950/30"} shadow-glass backdrop-blur-xl hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)] overflow-hidden`}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                onClick={() => setSelectedPlan(key as any)}
              >
                <div className="p-6 pb-0">
                  {plan.badge && (
                    <Badge className={`mb-4 ${key === "pro" ? "bg-blue-900/50 text-blue-300" : "bg-purple-900/50 text-purple-300"} border-none`}>
                      {plan.badge}
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-gray-300 text-sm mt-1 mb-4">{plan.description}</p>
                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    </div>
                    {billingPeriod === "annual" && (
                      <p className="text-green-400 text-sm mt-1">Save {plan.saveAmount} annually</p>
                    )}
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl animate-pulse-glow"
                    onClick={() => {
                      setSelectedPlan(key as any);
                      document.querySelector('.auth-form-container')?.scrollIntoView({ behavior: "smooth" });
                      setTimeout(() => setActiveTab("register"), 100);
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mt-12 bg-blue-950/30 rounded-2xl p-6 md:p-8 text-center border border-blue-800/50 backdrop-blur-xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-white mb-3">Need a custom constellation?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We offer tailored market intelligence solutions for interstellar organizations.
            </p>
            <Button
              variant="outline"
              className="border-blue-800 text-blue-300 hover:bg-blue-900/50 mx-auto"
            >
              Contact Our Sales Team
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-blue-950">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full border-blue-800">Cosmic Queries</Badge>
            <h2 className="text-4xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Find answers to navigate our interstellar platform.
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-white hover:text-blue-400">What is MarketInsightAI?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  MarketInsightAI is an AI-powered platform that analyzes cosmic market data to help businesses identify and validate stellar opportunities.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-white hover:text-blue-400">How does the free trial work?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  All plans include a 14-day free trial with full access to cosmic features. No credit card required.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-white hover:text-blue-400">Can I switch between plans?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, upgrade or downgrade anytime from your account settings with prorated costs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-white hover:text-blue-400">What data sources do you use?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  We aggregate data from industry reports, financials, consumer trends, and proprietary cosmic datasets.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-white hover:text-blue-400">How accurate is the AI analysis?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Our AI models are highly accurate but should be used alongside your interstellar expertise.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-white hover:text-blue-400">Do you offer custom solutions?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, we provide tailored solutions for organizations with specific cosmic needs.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-blue-950 to-purple-950">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full border-blue-800">Contact Us</Badge>
            <h2 className="text-4xl font-extrabold text-white mb-4">Connect Across the Cosmos</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Have questions? Our team is ready to guide your interstellar journey.
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-blue-950/30 rounded-2xl p-8 flex flex-col items-center border border-blue-800/50 backdrop-blur-xl"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="h-14 w-14 bg-blue-900/50 rounded-lg flex items-center justify-center mb-6">
                <Mail className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-gray-300 mb-4 text-center">
                Send a message and we’ll respond within 24 hours.
              </p>
              <a href="mailto:faisalh556@gmail.com" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium">
                faisalh556@gmail.com
              </a>
            </motion.div>
            <motion.div
              className="bg-blue-950/30 rounded-2xl p-8 flex flex-col items-center border border-blue-800/50 backdrop-blur-xl"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="h-14 w-14 bg-blue-900/50 rounded-lg flex items-center justify-center mb-6">
                <Phone className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
              <p className="text-gray-300 mb-4 text-center">
                Available Monday to Friday, 9am to 5pm.
              </p>
              <Button
                variant="outline"
                className="border-blue-800 text-blue-300 hover:bg-blue-900/50"
              >
                Contact Support
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 to-purple-800/20 z-0">{particles}</div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full border-blue-800">Launch Today</Badge>
            <h2 className="text-5xl font-extrabold text-white mb-6">Propel Your Business to the Stars</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the cosmic community using MarketInsightAI to conquer new markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg animate-pulse-glow px-8"
                onClick={() => {
                  document.querySelector('.auth-form-container')?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => setActiveTab("register"), 100);
                }}
              >
                Start Your Free Trial <Rocket className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-800 text-blue-300 hover:bg-blue-900/50"
              >
                Schedule a Demo
              </Button>
            </div>
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-300">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-300">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-300">Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 py-12 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <BarChart2 className="h-5 w-5 text-white" />
                </motion.div>
                <h1 className="text-xl font-extrabold text-white">MarketInsight<span className="text-blue-400">AI</span></h1>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Navigating markets with cosmic intelligence.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-blue-400">Features</a></li>
                <li><a href="#" className="hover:text-blue-400">Security</a></li>
                <li><a href="#" className="hover:text-blue-400">Enterprise</a></li>
                <li><a href="#" className="hover:text-blue-400">Customer Stories</a></li>
                <li><a href="#pricing" className="hover:text-blue-400">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400">Guides</a></li>
                <li><a href="#faq" className="hover:text-blue-400">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-400">API Status</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400">Press</a></li>
                <li><a href="#" className="hover:text-blue-400">Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-blue-800 text-sm text-gray-400">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>© 2025 MarketInsightAI. All rights reserved.</div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-blue-400">Terms</a>
                <a href="#" className="hover:text-blue-400">Privacy</a>
                <a href="#" className="hover:text-blue-400">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
