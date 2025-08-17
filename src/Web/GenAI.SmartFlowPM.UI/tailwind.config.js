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
          50: "#fff4e6",
          100: "#ffe4cc",
          200: "#ffc999",
          300: "#ffae66",
          400: "#ff9333",
          500: "#FF851B", // Light Orange - Primary
          600: "#E76E04", // Dark Orange - Primary Dark
          700: "#cc5500",
          800: "#b34400",
          900: "#993300",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#f8f9fb",
          100: "#f1f3f7",
          200: "#e3e7ef",
          300: "#d5dae7",
          400: "#bdc4d1",
          500: "#001F3F", // Black Type - Text Primary
          600: "#001935",
          700: "#00142b",
          800: "#000f21",
          900: "#000a17",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: "#fff4e6",
          100: "#ffe4cc",
          200: "#ffc999",
          300: "#ffae66",
          400: "#ff9333",
          500: "#E76E04", // Dark Orange - Accent Color
          600: "#cc5500",
          700: "#b34400",
          800: "#993300",
          900: "#802200",
        },
        // Custom orange scales to match the exact colors
        orange: {
          50: "#fff8f1",
          100: "#feecdc", 
          200: "#fcd9bd",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FF851B", // Light Orange - matching primary
          600: "#E76E04", // Dark Orange - matching accent
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
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
          primary: "#FF851B", // Light Orange
          primaryDark: "#E76E04", // Dark Orange
          background: "#FFFFFF", // White background
          text: "#001F3F", // Black Type for text
          accent: "#E76E04", // Dark Orange accent
          success: "#22c55e", // Green - keep existing
          warning: "#f59e0b", // Amber - keep existing
          error: "#ef4444", // Red - keep existing
          info: "#FF851B", // Light Orange for info
        },
        // Status colors for tasks/projects - Updated with new color scheme
        status: {
          todo: "#001F3F", // Black Type
          inprogress: "#FF851B", // Light Orange
          inreview: "#E76E04", // Dark Orange
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
