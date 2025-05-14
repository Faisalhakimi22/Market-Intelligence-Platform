import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"], // ✅ Retained dark mode class-based toggle
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // ✅ Your content paths are correct
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        // Ensure accessibility with high-contrast error colors
        red: {
          500: '#ef4444',
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
        // Added fade-in for smoother animations in auth-page.tsx
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
      // Enhance accessibility with focus styles
      boxShadow: {
        "focus-ring": "0 0 0 3px rgba(59, 130, 246, 0.3)", // Matches blue-500
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // ✅ Retained for animations
    require("@tailwindcss/typography"), // ✅ Retained for typography
    // Added for better form styling and accessibility
    require("@tailwindcss/forms")({
      strategy: 'class', // Ensures form inputs use class-based styling
    }),
  ],
} satisfies Config;
