/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "420px", // Extra small devices
        sm: "640px", // Small (Large phones)
        md: "768px", // Medium (Tablets)
        lg: "1024px", // Large (Laptops)
        xl: "1280px", // Extra Large (Desktops)
        "2xl": "1536px", // 2X Large Desktops
        "3xl": "1920px", // Full HD+ / Ultra-wide
        "4k": "2560px", // 4K Monitors / High Res
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--bg-warning))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--brand-blue))",
        },
        brand: {
          blue: "hsl(var(--brand-blue))",
          hoverBlue: "hsl(var(--hover-blue))",
          bg: "hsl(var(--bg-gray))",
        },
        grey: {
          50: "hsl(var(--grey-50))",
          100: "hsl(var(--grey-100))",
          200: "hsl(var(--grey-200))",
          300: "hsl(var(--grey-300))",
          400: "hsl(var(--grey-400))",
          500: "hsl(var(--grey-500))",
          600: "hsl(var(--grey-600))",
          700: "hsl(var(--grey-700))",
          800: "hsl(var(--grey-800))",
          900: "hsl(var(--grey-900))",
        },
        alerts: {
          info: "hsl(var(--info))",
          bg_info: "hsl(var(--bg-info))",
          success: "hsl(var(--success))",
          success_dark: "hsl(var(--success-dark))",
          bg_success: "hsl(var(--bg-success))",
          warning: "hsl(var(--warning))",
          warning_dark: "hsl(var(--warning-dark))",
          bg_warning: "hsl(var(--bg-warning))",
          error: "hsl(var(--error))",
          error_dark: "hsl(var(--error-dark))",
          bg_error: "hsl(var(--bg-error))",
          lightDis: "hsl(var(--light-dis))",
          lightDis_dark: "hsl(var(--light-dis-dark))",
          darkDis: "hsl(var(--dark-dis))",
          darkDis_dark: "hsl(var(--dark-dis-dark))",
          buttonDis: "hsl(var(--button-dis))",
          buttonDis_dark: "hsl(var(--button-dis-dark))",
        },
      },
      backgroundImage: {
        "aqua-gradient":
          "linear-gradient(to bottom right, hsl(var(--aqua-gradient-start)), hsl(var(--aqua-gradient-end)))",
        "aqua-gradient-start": "hsl(var(--aqua-gradient-start))",
        "aqua-gradient-end": "hsl(var(--aqua-gradient-end))",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.2deg)" },
          "60%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        wave: "wave 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
