import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// Icons
import { LogIn, UserPlus, ArrowRight, Check, Menu, Sun, Moon, BarChart2 } from "lucide-react";

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

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 transition-colors duration-300`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              aria-label="MarketInsightAI Logo"
            >
              <BarChart2 className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">MarketInsightAI</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              className="hidden md:block bg-blue-600 hover:bg-blue-700"
              onClick={() => document.querySelector("#auth-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Empower Your <span className="text-blue-600 dark:text-blue-400">Business</span> with AI
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto md:mx-0">
              Unlock market insights with cutting-edge AI analytics.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
              onClick={() => document.querySelector("#auth-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div
            id="auth-form"
            className="md:w-1/2 bg-white/90 dark:bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-gray-100/50 dark:bg-gray-700/50 rounded-lg">
                <TabsTrigger value="login" className="py-2 text-base font-medium">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="py-2 text-base font-medium">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-12 rounded-lg"
                      {...loginForm.register("email")}
                      aria-invalid={loginForm.formState.errors.email ? "true" : "false"}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-lg"
                      {...loginForm.register("password")}
                      aria-invalid={loginForm.formState.errors.password ? "true" : "false"}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                    disabled={loginForm.formState.isSubmitting}
                  >
                    <LogIn className="mr-2 h-5 w-5" /> Sign In
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="register-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-12 rounded-lg"
                      {...registerForm.register("email")}
                      aria-invalid={registerForm.formState.errors.email ? "true" : "false"}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-lg"
                      {...registerForm.register("password")}
                      aria-invalid={registerForm.formState.errors.password ? "true" : "false"}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-confirm-password" className="text-sm font-medium">Confirm Password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-lg"
                      {...registerForm.register("confirmPassword")}
                      aria-invalid={registerForm.formState.errors.confirmPassword ? "true" : "false"}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                    disabled={registerForm.formState.isSubmitting}
                  >
                    <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BarChart2, title: "AI Analytics", description: "Real-time market insights" },
              { icon: Check, title: "Easy to Use", description: "Intuitive interface" },
              { icon: ArrowRight, title: "Scalable", description: "Grows with your business" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                role="region"
                aria-label={feature.title}
              >
                <feature.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Simple Pricing
          </h2>
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-md">
              <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>Monthly</span>
              <Switch
                checked={billingPeriod === "annual"}
                onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
                aria-label="Toggle billing period"
              />
              <span className={`text-sm font-medium ${billingPeriod === "annual" ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>Annual</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Starter",
                price: billingPeriod === "monthly" ? "$19" : "$15",
                period: billingPeriod === "monthly" ? "/mo" : "/mo, billed annually",
                features: ["Basic Analytics", "5 Reports", "Email Support"],
              },
              {
                name: "Pro",
                price: billingPeriod === "monthly" ? "$49" : "$39",
                period: billingPeriod === "monthly" ? "/mo" : "/mo, billed annually",
                features: ["Advanced Analytics", "Unlimited Reports", "Priority Support"],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="border-none bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">{plan.period}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                      onClick={() => document.querySelector("#auth-form")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Transform Your Business?
          </motion.h2>
          <motion.p
            className="text-lg mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Start your journey with MarketInsightAI today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
              onClick={() => document.querySelector("#auth-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BarChart2 className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">MarketInsightAI</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400" aria-label="Terms of Service">Terms</a>
            <a href="#" className="hover:text-blue-400" aria-label="Privacy Policy">Privacy</a>
            <a href="#" className="hover:text-blue-400" aria-label="Contact Us">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
