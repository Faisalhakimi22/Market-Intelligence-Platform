import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight,
  Info,
  CreditCard,
  HelpCircle,
  Home
} from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeSection, setActiveSection] = useState("auth");
  
  // If user is already logged in, redirect to home page
  if (user) {
    return <Redirect to="/" />;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "Analyst",
    },
  });

  // Submit handlers
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Exclude confirmPassword as it's not part of the User type
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Render appropriate section content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case "auth":
        return (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Sign in to your MarketInsight AI account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" className="bg-gray-50 dark:bg-gray-800" {...field} />
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
                              <Input type="password" placeholder="Enter your password" className="bg-gray-50 dark:bg-gray-800" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Demo account: username: "demo", password: "password123"
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Sign up for a new MarketInsight AI account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" className="bg-gray-50 dark:bg-gray-800" {...field} />
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
                              <Input type="email" placeholder="Enter your email" className="bg-gray-50 dark:bg-gray-800" {...field} />
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
                              <Input placeholder="Choose a username" className="bg-gray-50 dark:bg-gray-800" {...field} />
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
                            <FormControl>
                              <Input placeholder="Your role (e.g., Entrepreneur, Analyst)" className="bg-gray-50 dark:bg-gray-800" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" className="bg-gray-50 dark:bg-gray-800" {...field} />
                              </FormControl>
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
                                <Input type="password" placeholder="Confirm password" className="bg-gray-50 dark:bg-gray-800" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Registering..." : "Register"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
      case "pricing":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Pricing Plans</CardTitle>
              <CardDescription>
                Choose the plan that works best for your business needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Starter Plan */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col h-full">
                    <div className="mb-5">
                      <h3 className="text-xl font-bold">Starter</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">For small businesses and entrepreneurs</p>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">$29</span>
                        <span className="text-gray-600 dark:text-gray-400">/month</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>5 market reports per month</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Basic competitor analysis</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Weekly market updates</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Email support</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      Get Started
                    </Button>
                  </div>
                </div>
                
                {/* Pro Plan */}
                <div className="rounded-xl border border-blue-500 p-6 shadow-md bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 relative">
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">Popular</span>
                  </div>
                  
                  <div className="flex flex-col h-full">
                    <div className="mb-5">
                      <h3 className="text-xl font-bold">Professional</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">For growing businesses and teams</p>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">$79</span>
                        <span className="text-gray-600 dark:text-gray-400">/month</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>20 market reports per month</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Advanced competitor analysis</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Daily market updates</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Priority email & chat support</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Trend forecasting tools</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                      Get Started
                    </Button>
                  </div>
                </div>
                
                {/* Enterprise Plan */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col h-full">
                    <div className="mb-5">
                      <h3 className="text-xl font-bold">Enterprise</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">For large organizations</p>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">$199</span>
                        <span className="text-gray-600 dark:text-gray-400">/month</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Unlimited market reports</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Real-time competitor tracking</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Custom market analysis</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>24/7 dedicated support</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>API access & integrations</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                          <span>Custom AI model training</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      Contact Sales
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "about":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">About MarketInsight AI</CardTitle>
              <CardDescription>
                Empowering businesses with AI-driven market intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  At MarketInsight AI, we're on a mission to democratize access to high-quality market intelligence. 
                  We believe that every business, regardless of size, should have access to the insights they need to make
                  informed decisions and identify growth opportunities.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Our Technology</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We leverage cutting-edge artificial intelligence and machine learning algorithms to analyze vast amounts of 
                  market data, identifying patterns and opportunities that would be impossible to detect manually. Our proprietary
                  models are continuously trained on the latest market trends, competitor movements, and consumer behavior data.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 rounded-lg">
                  <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Founded in 2021</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Started by a team of data scientists and market analysts with a vision to transform business intelligence
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 rounded-lg">
                  <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">5,000+ Users</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Trusted by startups, scale-ups, and enterprise companies across 30+ countries
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 rounded-lg">
                  <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">50+ Industries</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Specialized models for detecting opportunities across diverse market sectors
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  onClick={() => setActiveSection("auth")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Join MarketInsight AI Today
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case "faq":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Get answers to common questions about MarketInsight AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    question: "How does MarketInsight AI work?",
                    answer: "MarketInsight AI uses advanced machine learning algorithms to analyze market data from thousands of sources, including news, social media, financial reports, and customer reviews. Our AI models identify trends, opportunities, and potential threats, presenting them in an easy-to-understand format with actionable recommendations."
                  },
                  {
                    question: "Can I customize the insights for my specific industry?",
                    answer: "Yes! With Professional and Enterprise plans, you can fine-tune our models to focus on your specific industry, competitors, and market segments. Even with our Starter plan, you can specify your industry and get relevant insights."
                  },
                  {
                    question: "How frequently is the data updated?",
                    answer: "Our platform pulls and analyzes new data continuously. Depending on your plan, you'll receive daily or weekly market updates, and real-time alerts for significant market movements or competitor activities."
                  },
                  {
                    question: "Can I export reports or share insights with my team?",
                    answer: "Absolutely. All plans include the ability to export reports in PDF or CSV formats. Professional and Enterprise plans include team collaboration features, allowing you to share insights and annotations with team members."
                  },
                  {
                    question: "Is there a free trial available?",
                    answer: "Yes, we offer a 14-day free trial with access to all features from our Professional plan. No credit card is required to start your trial."
                  },
                  {
                    question: "How secure is my data on MarketInsight AI?",
                    answer: "We take data security very seriously. All data is encrypted both in transit and at rest, and we follow industry best practices for data protection. Our platform is SOC 2 compliant, ensuring the highest standards of security and privacy."
                  }
                ].map((item, index) => (
                  <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                    <h3 className="text-lg font-bold mb-2 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                      {item.question}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 pl-7">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Still have questions?</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">Our team is ready to help you with any questions you may have.</p>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="flex-1 hidden lg:flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold font-heading mb-6">MarketInsight AI</h1>
          <p className="text-xl mb-12 text-blue-100">
            AI-powered market intelligence for entrepreneurs and businesses seeking growth opportunities.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg">AI-Driven Insights</h3>
                <p className="text-blue-100">Actionable intelligence powered by advanced machine learning models</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Market Opportunity Detection</h3>
                <p className="text-blue-100">Identify untapped markets and growth areas before your competitors</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Real-time Alerts</h3>
                <p className="text-blue-100">Stay informed about market changes, competitor moves, and regulatory updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Forms and Navigation */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8">
        {/* Top navigation for different sections */}
        <div className="w-full max-w-md mb-6">
          <nav className="flex justify-center items-center space-x-1 overflow-x-auto p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <Button 
              variant={activeSection === "auth" ? "default" : "ghost"} 
              onClick={() => setActiveSection("auth")}
              className={activeSection === "auth" ? "bg-blue-600 text-white" : ""}
              size="sm"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Button>
            <Button 
              variant={activeSection === "about" ? "default" : "ghost"} 
              onClick={() => setActiveSection("about")}
              className={activeSection === "about" ? "bg-blue-600 text-white" : ""}
              size="sm"
            >
              <Info className="h-4 w-4 mr-1" />
              About
            </Button>
            <Button 
              variant={activeSection === "pricing" ? "default" : "ghost"} 
              onClick={() => setActiveSection("pricing")}
              className={activeSection === "pricing" ? "bg-blue-600 text-white" : ""}
              size="sm"
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Pricing
            </Button>
            <Button 
              variant={activeSection === "faq" ? "default" : "ghost"} 
              onClick={() => setActiveSection("faq")}
              className={activeSection === "faq" ? "bg-blue-600 text-white" : ""}
              size="sm"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              FAQ
            </Button>
          </nav>
        </div>
        
        {/* Mobile logo */}
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-block p-3 mb-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">MarketInsight AI</h1>
            <p className="text-gray-600 dark:text-gray-400">AI-powered market intelligence platform</p>
          </div>
          
          {/* Section content */}
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
}
