/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f8f9fb",
          100: "#f1f3f7",
          200: "#e3e7ef",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#33364d", // New Primary Color - Dark Blue Grey
          600: "#2a2d40",
          700: "#212433",
          800: "#181b26",
          900: "#0f1219",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#f0fdfc",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#109e92", // New Secondary Color - Teal
          600: "#0d7377",
          700: "#0f5f63",
          800: "#134e4a",
          900: "#134e4a",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: "#f0fdfc",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#109e92", // New Secondary Color - Teal for accent
          600: "#0d7377",
          700: "#0f5f63",
          800: "#134e4a",
          900: "#134e4a",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom brand colors for GenAI Smart Flow PM - Updated Color Scheme
        brand: {
          primary: "#33364d", // New Primary Color - Dark Blue Grey
          primaryDark: "#2a2d40", // Darker variant of primary
          secondary: "#109e92", // New Secondary Color - Teal
          secondaryDark: "#0d7377", // Darker variant of secondary
          background: "#FFFFFF", // White background
          text: "#33364d", // Primary color for text
          accent: "#109e92", // Secondary color for accent
          success: "#22c55e", // Green - keep existing
          warning: "#f59e0b", // Amber - keep existing
          error: "#ef4444", // Red - keep existing
          info: "#109e92", // Secondary color for info
        },
        // Status colors for tasks/projects - Updated with new color scheme
        status: {
          todo: "#33364d", // Primary color
          inprogress: "#109e92", // Secondary color
          inreview: "#2a2d40", // Darker primary
          done: "#22c55e", // Keep green for completion
          blocked: "#ef4444", // Keep red for blocked
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Ubuntu", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        heading: ["Ubuntu", "system-ui", "sans-serif"],
        ubuntu: ["Ubuntu", "system-ui", "sans-serif"],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: 0, transform: "translateX(-10px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}
