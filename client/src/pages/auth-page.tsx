import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useLocation } from "wouter";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Icons
import { LogIn, UserPlus, ArrowRight, Check, Menu, Sun, Moon, BarChart2, Zap, Shield, Globe, Star } from "lucide-react";

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Form Hooks
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  // Form Submission Handlers
  const onLoginSubmit = useCallback((data: LoginFormValues) => {
    console.log("Login:", data);
    navigate("/dashboard");
  }, [navigate]);

  const onRegisterSubmit = useCallback((data: RegisterFormValues) => {
    console.log("Register:", data);
    navigate("/dashboard");
  }, [navigate]);

  // Dark Mode Toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Particle Background Effect
  const particles = Array.from({ length: 20 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute h-2 w-2 bg-blue-400/50 rounded-full"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ));

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} bg-gradient-to-br from-gray-100 to-blue-200 dark:from-gray-900 dark:to-blue-950 transition-colors duration-500 overflow-x-hidden`}>
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-12 w-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              aria-label="MarketInsightAI Logo"
            >
              <BarChart2 className="h-7 w-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">MarketInsightAI</h1>
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    className="text-gray-700 dark:text-gray-200 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
                  >
                    {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDarkMode ? "Light Mode" : "Dark Mode"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md text-white font-semibold"
              onClick={() => document.querySelector("#auth-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-gray-300 dark:border-gray-700"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-900/20 dark:to-purple-900/20 z-0">
          {particles}
        </div>
        <motion.div
          className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 relative z-10"
          style={{ opacity, scale }}
        >
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.h1
              className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Unleash <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Powered</span> Insights
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform your business with real-time market analytics.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white font-semibold px-8 py-3 rounded-full transform hover:scale-105 transition-transform"
                onClick={() => document.querySelector("#auth-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Start Now <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>
          </div>
          <motion.div
            id="auth-form"
            className="lg:w-1/2 bg-white/10 dark:bg-gray-800/10 p-8 rounded-3xl shadow-2xl border border-gray-200/10 dark:border-gray-700/10 backdrop-blur-xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8 bg-gray-100/10 dark:bg-gray-700/10 rounded-xl backdrop-blur-sm">
                <TabsTrigger
                  value="login"
                  className="py-3 text-lg font-semibold data-[state=active]:bg-white/20 data-[state=active]:dark:bg-gray-800/20 data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-400"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="py-3 text-lg font-semibold data-[state=active]:bg-white/20 data-[state=active]:dark:bg-gray-800/20 data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-400"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 rounded-xl bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 shadow-sm"
                        {...loginForm.register("email")}
                        aria-invalid={loginForm.formState.errors.email ? "true" : "false"}
                        autoFocus
                      />
                    </motion.div>
                    <AnimatePresence>
                      {loginForm.formState.errors.email && (
                        <motion.p
                          className="text-sm text-red-500 mt-1 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Star className="h-4 w-4" /> {loginForm.formState.errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 rounded-xl bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 shadow-sm"
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
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-transform"
                    disabled={loginForm.formState.isSubmitting}
                  >
                    <LogIn className="mr-2 h-5 w-5" /> Sign In
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 rounded-xl bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 shadow-sm"
                        {...registerForm.register("email")}
                        aria-invalid={registerForm.formState.errors.email ? "true" : "false"}
                        autoFocus
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
                    <Label htmlFor="register-password" className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 rounded-xl bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 shadow-sm"
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
                    <Label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-200">Confirm Password</Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 rounded-xl bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 shadow-sm"
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
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-transform"
                    disabled={registerForm.formState.isSubmitting}
                  >
                    <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Cutting-Edge Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Real-Time Analytics", description: "Instant market insights with AI precision." },
              { icon: Shield, title: "Secure Data", description: "Enterprise-grade security for your peace of mind." },
              { icon: Globe, title: "Global Reach", description: "Access markets worldwide with ease." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 dark:bg-gray-800/10 p-8 rounded-2xl shadow-xl border border-gray-200/10 dark:border-gray-700/10 backdrop-blur-lg"
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                role="region"
                aria-label={feature.title}
              >
                <feature.icon className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-6 mx-auto" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-blue-200 dark:from-gray-900 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Flexible Pricing
          </motion.h2>
          <div className="flex justify-center mb-12">
            <motion.div
              className="flex items-center gap-4 bg-white/10 dark:bg-gray-800/10 p-3 rounded-xl shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className={`text-lg font-medium ${billingPeriod === "monthly" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>Monthly</span>
              <Switch
                checked={billingPeriod === "annual"}
                onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
                className="data-[state=checked]:bg-blue-600"
                aria-label="Toggle billing period"
              />
              <span className={`text-lg font-medium ${billingPeriod === "annual" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>Annual</span>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: billingPeriod === "monthly" ? "$19" : "$15",
                period: billingPeriod === "monthly" ? "/mo" : "/mo, billed annually",
                features: ["Basic Analytics", "5 Reports/Month", "Email Support"],
              },
              {
                name: "Pro",
                price: billingPeriod === "monthly" ? "$49" : "$39",
                period: billingPeriod === "monthly" ? "/mo" : "/mo, billed annually",
                features: ["Advanced Analytics", "Unlimited Reports", "Priority Support", "Team Collaboration"],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className="bg-white/10 dark:bg-gray-800/10 p-8 rounded-2xl shadow-xl border border-gray-200/10 dark:border-gray-700/10 backdrop-blur-lg"
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="border-none bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-3">{plan.period}</span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-600 dark:text-gray-300 text-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-transform"
                      onClick={() => document.querySelector("#auth-form")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Choose {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-0">
          {particles}
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-5xl font-extrabold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Elevate Your Business Today
          </motion.h2>
          <motion.p
            className="text-xl mb-10 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join the future of market intelligence with MarketInsightAI.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-gray-100 shadow-xl rounded-full px-10 py-4 font-semibold transform hover:scale-110 transition-transform"
              onClick={() => document.querySelector("#auth-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Started Now <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <motion.div
              className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <BarChart2 className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold">MarketInsightAI</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Terms of Service">Terms</a>
            <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Privacy Policy">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Contact Us">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
