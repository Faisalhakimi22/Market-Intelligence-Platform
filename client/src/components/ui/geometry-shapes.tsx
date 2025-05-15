import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  BrainCircuit,
  Shield,
  Lightbulb,
  LineChart,
  UserCheck,
  Star,
  BarChart4,
  TrendingUp,
  Globe,
  Target,
  Zap,
} from "lucide-react";

// Geometric Shape Component - Simple floating elements
export const GeometricShape = ({ 
  className, 
  duration = 8, 
  scale = [1, 1.1, 1],
  opacity = [0.1, 0.2, 0.1]
}: { 
  className?: string;
  duration?: number;
  scale?: number[];
  opacity?: number[];
}) => (
  <motion.div 
    className={cn("absolute rounded-full blur-3xl", className)}
    animate={{ 
      scale,
      opacity
    }}
    transition={{ 
      duration,
      repeat: Infinity,
      ease: "easeInOut" 
    }}
  />
);

// SVG path animation for advanced backgrounds
export const AnimatedPathBackground = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.02] pointer-events-none">
    <svg
      className="w-full h-full"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d="M100,300 Q250,50 400,300 T700,300 T1000,300"
        fill="none"
        stroke="url(#gradient1)"
        strokeWidth="2"
        className="animate-[dash_20s_linear_infinite]"
        strokeDasharray="10,5"
      />
      <path
        d="M100,500 Q250,250 400,500 T700,500 T1000,500"
        fill="none"
        stroke="url(#gradient1)"
        strokeWidth="2"
        className="animate-[dash_25s_linear_infinite]"
        strokeDasharray="10,5"
        opacity="0.7"
      />
      <path
        d="M100,700 Q250,450 400,700 T700,700 T1000,700"
        fill="none"
        stroke="url(#gradient1)"
        strokeWidth="2"
        className="animate-[dash_30s_linear_infinite]"
        strokeDasharray="10,5"
        opacity="0.5"
      />
      <motion.circle
        cx="500"
        cy="500"
        r="300"
        fill="none"
        stroke="url(#gradient1)"
        strokeWidth="1"
        strokeDasharray="5,5"
        initial={{ opacity: 0.3 }}
        animate={{ 
          opacity: [0.2, 0.3, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </svg>
  </div>
);

// Collection of geometric shapes for background
export const GeometryShapes = () => {
  return (
    <>
      {/* Animated SVG paths */}
      <AnimatedPathBackground />
      
      {/* Floating blur shapes */}
      <GeometricShape 
        className="right-[-5%] top-[-5%] w-[40%] h-[40%] bg-blue-500/5"
        duration={10}
        scale={[0.95, 1.05, 0.95]}
        opacity={[0.05, 0.1, 0.05]}
      />
      
      <GeometricShape 
        className="left-[-10%] bottom-[-10%] w-[50%] h-[50%] bg-purple-500/5"
        duration={12}
        scale={[0.9, 1, 0.9]}
        opacity={[0.03, 0.08, 0.03]}
      />
      
      <GeometricShape 
        className="left-[30%] top-[40%] w-[30%] h-[30%] bg-indigo-500/5"
        duration={15}
        scale={[1, 1.15, 1]}
        opacity={[0.05, 0.1, 0.05]}
      />
      
      {/* Additional hexagon shape */}
      <motion.div 
        className="absolute top-[20%] right-[20%] w-40 h-40 opacity-10"
        initial={{ opacity: 0.1, rotate: 0 }}
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          rotate: 360
        }}
        transition={{ 
          duration: 60,
          repeat: Infinity,
          ease: "linear" 
        }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="50,3 100,28 100,75 50,100 3,75 3,25" 
            fill="none" 
            stroke="rgba(59, 130, 246, 0.5)" 
            strokeWidth="1"
          />
        </svg>
      </motion.div>
      
      {/* Additional elements - floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingIcons />
      </div>
    </>
  );
};

// Single floating icon component
export const FloatingIcon = ({ 
  icon, 
  color, 
  className, 
  delay = 0,
  duration = 5,
  yMovement = [-15, 0, -15]
}: { 
  icon: React.ReactNode;
  color: string;
  className: string;
  delay?: number;
  duration?: number;
  yMovement?: number[];
}) => (
  <motion.div
    className={cn("absolute z-0", color, className)}
    animate={{
      y: yMovement,
      opacity: [0.4, 0.7, 0.4],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {icon}
  </motion.div>
);

// Collection of floating icons with different positions
export const FloatingIcons = () => {
  return (
    <>
      {[
        { icon: <Sparkles size={20} />, color: "text-blue-500/30", delay: 0, className: "left-[15%] top-[20%]", duration: 5 },
        { icon: <BrainCircuit size={20} />, color: "text-purple-500/30", delay: 1.2, className: "right-[10%] top-[15%]", duration: 6 },
        { icon: <Shield size={20} />, color: "text-green-500/30", delay: 0.5, className: "left-[20%] bottom-[30%]", duration: 7 },
        { icon: <Lightbulb size={20} />, color: "text-amber-500/30", delay: 2, className: "right-[25%] bottom-[15%]", duration: 5.5 },
        { icon: <LineChart size={20} />, color: "text-blue-500/30", delay: 1.5, className: "left-[85%] top-[50%]", duration: 6.5 },
        { icon: <UserCheck size={20} />, color: "text-indigo-500/30", delay: 0.8, className: "left-[5%] top-[65%]", duration: 7.5 },
        { icon: <Star size={20} />, color: "text-yellow-500/30", delay: 2.5, className: "right-[5%] top-[35%]", duration: 8 },
        { icon: <BarChart4 size={20} />, color: "text-blue-500/30", delay: 3.2, className: "left-[35%] top-[10%]", duration: 7 },
        { icon: <TrendingUp size={20} />, color: "text-green-500/30", delay: 1.8, className: "right-[40%] bottom-[10%]", duration: 6 },
        { icon: <Globe size={20} />, color: "text-blue-500/30", delay: 4.2, className: "left-[55%] top-[65%]", duration: 8 },
        { icon: <Target size={20} />, color: "text-red-500/30", delay: 3.5, className: "right-[15%] top-[60%]", duration: 7.5 },
        { icon: <Zap size={20} />, color: "text-yellow-500/30", delay: 2.8, className: "left-[25%] top-[40%]", duration: 5.5 },
      ].map((item, index) => (
        <FloatingIcon
          key={index}
          icon={item.icon}
          color={item.color}
          className={item.className}
          delay={item.delay}
          duration={item.duration}
        />
      ))}
    </>
  );
};
