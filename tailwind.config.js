/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Setting default sans so "Plus Jakarta Sans" applies globally
        sans: ["Plus Jakarta Sans", "sans-serif"],
        // Keeping jakarta for backward compatibility
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }], // 10px
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
        "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
        "5xl": ["3rem", { lineHeight: "1" }], // 48px
        "6xl": ["3.75rem", { lineHeight: "1" }], // 60px
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      spacing: {
        18: "4.5rem", // 72px
        22: "5.5rem", // 88px
        26: "6.5rem", // 104px
        30: "7.5rem", // 120px
      },
      colors: {
        // --- Base / Surfaces ---
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

        // --- Brand / Accents ---
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        brand: {
          blue: "hsl(var(--brand-blue))",
          hoverBlue: "hsl(var(--hover-blue))",
          bg: "hsl(var(--bg-gray))",
        },

        // --- System / States ---
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // --- Feedback / Alerts ---
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--bg-warning))",
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

        // --- Data Visualization ---
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },

        // --- Layout / Sidebar ---
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

        // --- Neutral Scales ---
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

        // --- Mobile App Colors (Flutter) ---
        app: {
          primary1: "#002538",
          primary2: "#007FC0",
          primary3: "#5AA0C1",
          primary4: "#B9E9FF",
          primary5: "#04365F",
          background: "#FAFAFA",
          darkGrey: "#2B2829",
          cardOrange: "#DC6B1B",
          cardGreen: "#15B097",
          cardYellow: "#EDA145",
          logOutRed: "#C03744",
          caloriesRed: "#FF5252",
          proteinBlue: "#4A90E2",
          fatsYellow: "#FFC107",
          carbsGreen: "#8BC34A",
          baseWhite: "#FFFFFF",
          greyText: "#5A5555",
          cardBgBlue: "#E3F6FF",
          cardBgBlue2: "#F1FBFF",
          bodyText: "#5A5555",
          calendarFont: "#433E3F",
          white: "#FFFFFF",
          black: "#000000",
          grey: "#B3B3B3",
          calories: "#15B097",
          fat: "#DC6B1B",
          cabs: "#EDA145",
        },
      },
      backgroundImage: {
        "aqua-gradient":
          "linear-gradient(to bottom right, hsl(var(--aqua-gradient-start)), hsl(var(--aqua-gradient-end)))",
        "aqua-gradient-start": "hsl(var(--aqua-gradient-start))",
        "aqua-gradient-end": "hsl(var(--aqua-gradient-end))",
      },
      keyframes: {
        // --- Core UI Animations ---
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },

        // --- Decorative Animations ---
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
