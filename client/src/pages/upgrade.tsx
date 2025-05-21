import React from "react";
import DashboardLayout from "../home-page";
import { motion } from "framer-motion";
import { Check, ChevronRight, Star, Zap, Shield, BarChart3, Globe, TrendingUp } from "lucide-react";

export default function UpgradePage() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Essential market intelligence features",
      features: [
        "Basic market analytics",
        "Limited competitor tracking",
        "3 industry reports per month",
        "Standard forecasting"
      ],
      current: true
    },
    {
      name: "Pro",
      price: "$49/mo",
      description: "Advanced intelligence for growing businesses",
      features: [
        "Advanced market analytics",
        "Unlimited competitor tracking",
        "20 industry reports per month",
        "AI-powered forecasting",
        "Custom alerts",
        "Priority support"
      ],
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Complete solution for large organizations",
      features: [
        "Full market analytics suite",
        "Unlimited everything",
        "Custom integrations",
        "Dedicated account manager",
        "API access",
        "SLA guarantees"
      ]
    }
  ];
  
  const proFeatures = [
    {
      icon: Globe,
      title: "Advanced Market Analysis",
      description: "Unlock comprehensive market trends and detailed competitive analysis"
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Forecasting",
      description: "Generate more accurate predictions with our advanced machine learning models"
    },
    {
      icon: BarChart3,
      title: "Enhanced Dashboards",
      description: "Create custom dashboards with additional visualization types and data sources"
    },
    {
      icon: Shield,
      title: "Premium Support",
      description: "Get priority access to our support team and faster response times"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center bg-secondary/50 rounded-full px-3 py-1 mb-4">
            <Star className="h-4 w-4 text-amber-400 mr-2" />
            <span className="text-sm font-medium">Upgrade to Pro</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Take Your Market Intelligence to the Next Level</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Access premium features and unlock the full potential of our market analysis platform
          </p>
        </motion.div>
        
        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {proFeatures.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * idx + 0.2 }}
              className="bg-card rounded-xl border border-border/30 p-6"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Pricing Plans */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Choose the Right Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx + 0.4 }}
                className={`rounded-xl border ${
                  plan.featured ? 'border-primary shadow-lg shadow-primary/10' : 'border-border/30'
                } bg-card p-6 relative ${plan.featured ? 'ring-2 ring-primary/20' : ''}`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Recommended
                    </div>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <div className="bg-secondary text-xs font-medium px-3 py-1 rounded-full">
                      Current Plan
                    </div>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-2">{plan.price}</div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button className={`w-full py-2 rounded-lg text-sm flex items-center justify-center ${
                  plan.featured 
                    ? 'bg-gradient-to-r from-primary to-violet-600 text-primary-foreground' 
                    : 'bg-secondary text-foreground'
                }`}>
                  <span>{plan.current ? 'Current Plan' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-card rounded-xl border border-border/30 p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[
              {
                q: "How do I upgrade my subscription?",
                a: "Select the plan that fits your needs and click the upgrade button. You'll be guided through a simple checkout process."
              },
              {
                q: "Can I switch plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle."
              },
              {
                q: "Is there a free trial for Pro features?",
                a: "Yes, you can try Pro features for 14 days before making a commitment. No credit card required for the trial."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
              }
            ].map((faq, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 