import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Separator } from "@/components/ui/separator";

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
  Loader2
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
      name: "",
      confirmPassword: "",
    },
  });

  // Form submission handlers
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword as it's not in the API schema
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Plans data
  const plans = {
    starter: {
      name: "Starter",
      description: "Essential market intelligence for startups",
      price: billingPeriod === "monthly" ? "$49" : "$39",
      period: billingPeriod === "monthly" ? "/month" : "/month, billed annually",
      saveAmount: "$120",
      features: [
        "Basic market trend analysis",
        "Limited competitor tracking (up to 5)",
        "Monthly industry reports",
        "10 AI-powered business idea validations",
        "Email support"
      ],
      buttonText: "Get Started",
      color: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40",
      badge: ""
    },
    pro: {
      name: "Professional",
      description: "Advanced intelligence for growing businesses",
      price: billingPeriod === "monthly" ? "$99" : "$79",
      period: billingPeriod === "monthly" ? "/month" : "/month, billed annually",
      saveAmount: "$240",
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
      color: "border-primary-300 bg-primary-50 dark:border-primary-900 dark:bg-primary-950/40",
      badge: "Most Popular"
    },
    enterprise: {
      name: "Enterprise",
      description: "Complete intelligence suite for organizations",
      price: billingPeriod === "monthly" ? "$249" : "$199",
      period: billingPeriod === "monthly" ? "/month" : "/month, billed annually",
      saveAmount: "$600",
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
      color: "border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/40",
      badge: "Complete Solution"
    }
  };

  // If loading, render nothing until redirect happens
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MarketInsight<span className="text-primary">AI</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">Pricing</a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#testimonials">Testimonials</a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#faq">FAQ</a>
            </nav>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab("login")}
              >
                Sign In
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setActiveTab("register")}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
          <div className="md:hidden">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab("login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-primary-100 hover:bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300 mb-4">
                  Market Intelligence Reimagined
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                  Transform Data into <span className="text-primary">Business Opportunities</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Our AI-powered platform analyzes market trends, competition, and consumer behavior to 
                  help you make data-driven decisions and identify high-potential business opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="gap-2"
                    onClick={() => setActiveTab("register")}
                  >
                    Start Free Trial <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2" asChild>
                    <a href="#features">
                      Explore Features <ChevronRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-6 mt-10">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-900">
                        <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Trusted by 1,000+ business leaders</p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Create Account</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username" className="text-base">Username</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
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
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {loginForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password" className="text-base">Password</Label>
                          <a href="#" className="text-sm text-primary hover:text-primary/90">Forgot password?</a>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Key className="h-5 w-5 text-gray-400" />
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
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full py-6 text-base"
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
                      
                      <div className="mt-6 flex items-center justify-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Don't have an account?{" "}
                          <button 
                            type="button"
                            className="text-primary hover:text-primary/90 font-medium"
                            onClick={() => setActiveTab("register")}
                          >
                            Sign up now
                          </button>
                        </p>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name" className="text-base">Full Name</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input 
                            id="register-name" 
                            type="text"
                            className="pl-10"
                            placeholder="Enter your full name"
                            {...registerForm.register("name")}
                          />
                        </div>
                        {registerForm.formState.errors.name && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {registerForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-base">Email</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input 
                            id="register-email" 
                            type="email"
                            className="pl-10"
                            placeholder="Enter your email address"
                            {...registerForm.register("email")}
                          />
                        </div>
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-username" className="text-base">Username</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input 
                            id="register-username" 
                            type="text"
                            className="pl-10"
                            placeholder="Choose a username"
                            {...registerForm.register("username")}
                          />
                        </div>
                        {registerForm.formState.errors.username && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {registerForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-base">Password</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Key className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input 
                            id="register-password" 
                            type="password"
                            className="pl-10"
                            placeholder="Create a secure password"
                            {...registerForm.register("password")}
                          />
                        </div>
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password" className="text-base">Confirm Password</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Key className="h-5 w-5 text-gray-400" />
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
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {registerForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full py-6 text-base"
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
                      
                      <div className="mt-6 flex items-center justify-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Already have an account?{" "}
                          <button 
                            type="button"
                            className="text-primary hover:text-primary/90 font-medium"
                            onClick={() => setActiveTab("login")}
                          >
                            Sign in
                          </button>
                        </p>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">Platform Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Market Intelligence Designed for Results</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with comprehensive market data to give you actionable insights for your business decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-5">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">Advanced algorithms analyze vast datasets to identify patterns and generate predictive insights about market opportunities.</p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-5">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Market Trends</h3>
              <p className="text-gray-600 dark:text-gray-400">Stay ahead with live tracking of industry shifts, consumer behavior changes, and emerging market trends.</p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-5">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Competitor Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-400">Monitor competitor strategies, market positioning, and offerings to identify your competitive advantage.</p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-5">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Opportunity Validation</h3>
              <p className="text-gray-600 dark:text-gray-400">Test business ideas against real market data to validate concepts before investing time and resources.</p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-5">
                <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Reports</h3>
              <p className="text-gray-600 dark:text-gray-400">Generate professional, presentation-ready reports with visualizations, insights, and recommendations.</p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-5">
                <Globe className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Market Access</h3>
              <p className="text-gray-600 dark:text-gray-400">Access data across international markets to identify expansion opportunities and global trends.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">Pricing Plans</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose the Right Plan for Your Business</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Flexible pricing options designed to scale with your business needs. All plans include a 14-day free trial.
            </p>

            <div className="flex items-center justify-center gap-3 mb-10">
              <span className={`text-sm ${billingPeriod === "monthly" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>Monthly</span>
              <div className="relative inline-block">
                <Switch
                  checked={billingPeriod === "annual"}
                  onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
                />
                {billingPeriod === "annual" && (
                  <span className="absolute -top-3 -right-20 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    Save 20%
                  </span>
                )}
              </div>
              <span className={`text-sm ${billingPeriod === "annual" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>Annual</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(plans).map(([key, plan]) => (
              <motion.div 
                key={key}
                className={`rounded-xl border ${
                  selectedPlan === key ? plan.color : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                } shadow-sm overflow-hidden transition-all duration-200`}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => setSelectedPlan(key as any)}
              >
                <div className="p-6 pb-0">
                  {plan.badge && (
                    <Badge className={`mb-4 ${
                      key === "pro" ? "bg-primary/10 text-primary border-primary/20" : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}>
                      {plan.badge}
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 mb-4">{plan.description}</p>
                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">{plan.period}</span>
                    </div>
                    {billingPeriod === "annual" && (
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">Save {plan.saveAmount} annually</p>
                    )}
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Button 
                    className="w-full"
                    variant={selectedPlan === key ? "default" : "outline"}
                    onClick={() => {
                      setSelectedPlan(key as any);
                      setActiveTab("register");
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                  
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 md:p-8 text-center">
            <h3 className="text-xl font-semibold mb-3">Need a custom solution?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              We offer tailored market intelligence solutions for larger organizations with specific needs.
            </p>
            <Button variant="outline" className="mx-auto">Contact Our Sales Team</Button>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section id="testimonials" className="py-16 bg-gray-50 dark:bg-gray-900/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Business Leaders</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See what our customers have achieved with MarketInsightAI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-800 border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">CEO, TechStart Inc.</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  "MarketInsightAI has transformed how we approach market opportunities. The AI-driven analysis helped us identify a market gap that became our most profitable product line."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-gray-500">Founder, GrowthVentures</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  "The competitor intelligence feature alone is worth the investment. We've been able to stay two steps ahead of market shifts and position our offerings strategically."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Alexandra Torres</h4>
                    <p className="text-sm text-gray-500">Marketing Director, Innovate Ltd</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  "The Business Idea Analyzer validated our product concept in minutes, saving us months of research and thousands in market testing costs. This platform is a game-changer."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find answers to common questions about our platform and services.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is MarketInsightAI?</AccordionTrigger>
                <AccordionContent>
                  MarketInsightAI is an advanced market intelligence platform that combines AI-powered analysis with comprehensive market data to help businesses identify and validate opportunities, monitor competitors, and make data-driven strategic decisions.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How does the free trial work?</AccordionTrigger>
                <AccordionContent>
                  All our plans include a 14-day free trial with full access to platform features. No credit card is required to start your trial. You'll receive a reminder before the trial ends, and you can choose to continue with a paid plan or cancel at any time.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I switch between plans?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade or downgrade your plan at any time from your account settings. When upgrading, you'll get immediate access to additional features, and we'll prorate the cost. When downgrading, changes will take effect at the start of your next billing cycle.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>What data sources do you use?</AccordionTrigger>
                <AccordionContent>
                  Our platform aggregates data from multiple trusted sources, including industry reports, public financial data, consumer behavior statistics, social media trends, and proprietary datasets. All data is processed and analyzed using our advanced AI algorithms to generate actionable insights.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How accurate is the AI analysis?</AccordionTrigger>
                <AccordionContent>
                  Our AI models are continuously trained on vast datasets and have demonstrated high accuracy in market trend prediction and opportunity validation. However, we recommend using our insights as part of a comprehensive decision-making process that includes your business expertise and other market inputs.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>Do you offer custom solutions?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer custom enterprise solutions for organizations with specific market intelligence needs. Our team can develop tailored data integrations, custom reporting dashboards, and specialized analysis models. Contact our sales team to discuss your requirements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-50 dark:bg-primary-950/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 border-primary text-primary">Start Today</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transform Your Business Strategy with Data-Driven Insights</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of businesses that use MarketInsightAI to discover opportunities and make confident decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => setActiveTab("register")}
              >
                Start Your Free Trial <Rocket className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule a Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                  <BarChart2 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">MarketInsight<span className="text-primary">AI</span></h1>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Transforming market data into validated business opportunities.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Enterprise</a></li>
                <li><a href="#" className="hover:text-white">Customer Stories</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Guides</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">API Status</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-400">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                © 2023 MarketInsightAI. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white">Terms</a>
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
