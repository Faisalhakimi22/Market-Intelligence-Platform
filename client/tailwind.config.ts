import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"], // Retained dark mode class-based toggle
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // Correct content paths
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem", // Added for rounded-3xl in auth-page.tsx
      },
      colors: {
        // Required color palette for auth-page.tsx
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2a44',
          900: '#111827',
          950: '#030712',
        },
        red: {
          500: '#ef4444', // For error messages
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // Added for glassmorphism and hover effects
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      boxShadow: {
        "focus-ring": "0 0 0 3px rgba(59, 130, 246, 0.3)", // Matches blue-500
        "neumorphic": "5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px rgba(255, 255, 255, 0.5)",
        "glass": "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
      backdropBlur: {
        xl: "24px", // For enhanced glassmorphism
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1f2a44', // gray-800
            a: {
              color: '#2563eb', // blue-600
              '&:hover': {
                color: '#1d4ed8', // blue-700
              },
            },
          },
        },
        dark: {
          css: {
            color: '#e5e7eb', // gray-200
            a: {
              color: '#60a5fa', // blue-400
              '&:hover': {
                color: '#3b82f6', // blue-500
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms")({
      strategy: 'class',
    }),
  ],
} satisfies Config;
