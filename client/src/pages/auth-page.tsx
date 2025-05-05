import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  User, 
  Lock, 
  Mail, 
  Briefcase, 
  ArrowRight, 
  Check,
  Eye,
  EyeOff,
  Github,
  Loader2
} from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const roles = [
  { value: "Entrepreneur", label: "Entrepreneur" },
  { value: "Analyst", label: "Analyst" },
  { value: "Investor", label: "Investor" },
  { value: "Consultant", label: "Consultant" },
  { value: "Executive", label: "Executive" },
];

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeView, setActiveView] = useState("login"); 
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // If user is already logged in, redirect to home page
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Register form
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "Analyst",
      termsAccepted: false,
    },
  });

  // Password strength checker
  useEffect(() => {
    const password = registerForm.watch("password");
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [registerForm.watch("password")]);

  // Submit handlers
  const onLoginSubmit = (data) => {
    const { rememberMe, ...loginData } = data;
    // Could store rememberMe in localStorage to implement persistent sessions
    loginMutation.mutate(loginData);
  };

  const onRegisterSubmit = (data) => {
    // Exclude confirmPassword and termsAccepted as they're not part of the User type
    const { confirmPassword, termsAccepted, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Social login handlers
  const handleSocialLogin = (provider) => {
    // This would connect to your OAuth implementation
    console.log(`Login with ${provider}`);
    // Would redirect to OAuth provider login page
  };

  // Demo login handler
  const handleDemoLogin = () => {
    loginForm.setValue("username", "demo");
    loginForm.setValue("password", "password123");
    loginForm.handleSubmit(onLoginSubmit)();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Branding & Features Section */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div>
          <div className="flex items-center space-x-2 mb-16">
            <TrendingUp className="h-8 w-8" />
            <h1 className="text-3xl font-bold">MarketInsight AI</h1>
          </div>
          
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-6">Unlock Market Intelligence</h2>
            <p className="text-xl text-blue-100 mb-8">
              AI-powered insights to help businesses identify opportunities and stay ahead of competitors.
            </p>
            
            <div className="grid gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white/15 p-3 rounded-lg">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">AI-Driven Insights</h3>
                  <p className="text-blue-100">Advanced machine learning models analyze market data to provide actionable recommendations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white/15 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Opportunity Detection</h3>
                  <p className="text-blue-100">Identify emerging trends and untapped markets before your competitors</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white/15 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Real-time Alerts</h3>
                  <p className="text-blue-100">Stay informed with customizable notifications about market shifts and competitor movements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-blue-100">© 2025 MarketInsight AI. All rights reserved.</p>
        </div>
      </div>
      
      {/* Auth Forms */}
      <div className="flex flex-col justify-center p-6 md:p-12">
        <div className="md:hidden flex items-center justify-center space-x-2 mb-8">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">MarketInsight AI</h1>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {activeView === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {activeView === "login" 
                ? "Sign in to your MarketInsight AI account" 
                : "Join thousands of businesses using MarketInsight AI"}
            </p>
          </div>
          
          {/* Toggle between Login and Register */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-8">
            <button
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all", 
                activeView === "login" 
                  ? "bg-white dark:bg-gray-700 shadow-sm" 
                  : "text-gray-500 dark:text-gray-400"
              )}
              onClick={() => setActiveView("login")}
            >
              Sign In
            </button>
            <button
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all", 
                activeView === "register" 
                  ? "bg-white dark:bg-gray-700 shadow-sm" 
                  : "text-gray-500 dark:text-gray-400"
              )}
              onClick={() => setActiveView("register")}
            >
              Create Account
            </button>
          </div>
          
          {/* Login Form */}
          {activeView === "login" && (
            <div>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                              placeholder="Enter your username" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                              type={showLoginPassword ? "text" : "password"}
                              placeholder="Enter your password" 
                              className="pl-10" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-3 text-gray-500"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                            >
                              {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full flex items-center justify-center space-x-2" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleSocialLogin('google')}
                    className="flex items-center justify-center"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path 
                        d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleSocialLogin('github')}
                    className="flex items-center justify-center"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleSocialLogin('microsoft')}
                    className="flex items-center justify-center"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path 
                        d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="w-full" 
                    onClick={handleDemoLogin}
                  >
                    Try Demo Account
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Register Form */}
          {activeView === "register" && (
            <div>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                              placeholder="Enter your full name" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                              type="email" 
                              placeholder="Enter your email" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                              placeholder="Choose a username" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                              <SelectTrigger className="pl-10">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                              type={showRegisterPassword ? "text" : "password"}
                              placeholder="Create a password" 
                              className="pl-10" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-3 text-gray-500"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            >
                              {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        {field.value && (
                          <div className="mt-2">
                            <div className="flex items-center mb-1">
                              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full", 
                                    passwordStrength === 0 && "w-0",
                                    passwordStrength === 1 && "w-1/5 bg-red-500",
                                    passwordStrength === 2 && "w-2/5 bg-orange-500",
                                    passwordStrength === 3 && "w-3/5 bg-yellow-500",
                                    passwordStrength === 4 && "w-4/5 bg-lime-500",
                                    passwordStrength === 5 && "w-full bg-green-500"
                                  )}
                                />
                              </div>
                              <span className="ml-2 text-xs text-gray-500">
                                {passwordStrength < 3 ? "Weak" : passwordStrength < 5 ? "Good" : "Strong"}
                              </span>
                            </div>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                              <li className="flex items-center">
                                <Check className={cn(
                                  "h-3 w-3 mr-1", 
                                  field.value.length >= 8 ? "text-green-500" : "text-gray-300"
                                )} />
                                At least 8 characters
                              </li>
                              <li className="flex items-center">
                                <Check className={cn(
                                  "h-3 w-3 mr-1", 
                                  /[A-Z]/.test(field.value) ? "text-green-500" : "text-gray-300"
                                )} />
                                Uppercase letter
                              </li>
                              <li className="flex items-center">
                                <Check className={cn(
                                  "h-3 w-3 mr-1", 
                                  /[a-z]/.test(field.value) ? "text-green-500" : "text-gray-300"
                                )} />
                                Lowercase letter
                              </li>
                              <li className="flex items-center">
                                <Check className={cn(
                                  "h-3 w-3 mr-1", 
                                  /[0-9]/.test(field.value) ? "text-green-500" : "text-gray-300"
                                )} />
                                Number
                              </li>
                              <li className="flex items-center">
                                <Check className={cn(
                                  "h-3 w-3 mr-1", 
                                  /[^A-Za-z0-9]/.test(field.value) ? "text-green-500" : "text-gray-300"
                                )} />
                                Special character
                              </li>
                            </ul>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password" 
                              className="pl-10" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-3 text-gray-500"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal text-sm">
                            I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full flex items-center justify-center space-x-2" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating your account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create account</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
          
          <p className="mt-6 text-center text-sm text-gray-500">
            {activeView === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveView("register")}
                  className="font-semibold text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setActiveView("login")}
                  className="font-semibold text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}