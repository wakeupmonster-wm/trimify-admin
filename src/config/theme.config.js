/**
 * Theme & Color Configuration
 * 
 * This file centralizes the color palettes used across the application's dashboards
 * and charts to ensure a consistent, premium UI/UX.
 */

// ─── Previous Brand Palettes (Commented Out for Testing) ──────────────────────
/*
export const APP_COLORS = [
  "#007FC0", // Base Primary Blue (700)
  "#006193", // Primary 800
  "#009DEE", // Primary 600
  "#3399D1", // Light Blue
  "#005986", // Dark Blue
  "#66B2E3", // Lighter Blue
  "#004060", // Darkest Blue
  "#99CCF4", // Soft Blue
  "#cce6ff", // Lightest Blue
];

export const ACCENT_COLORS = [
  "#0069A5", // User Goal 1
  "#7956F8", // User Goal 2
  "#019CFD", // User Goal 3
  "#f59e0b", // Amber 
  "#f43f5e", // Rose
  "#0ea5e9", // Sky
];
*/

// ─── New Primary Colors Palette (Testing) ────────────────────────────────────
export const PRIMARY_COLORS = {
  Primary800: "#006193",
  Primary700: "#007fc0",
  Primary600: "#009dee",
  Primary500: "#1cb2ff",
  Primary400: "#49c1ff",
  Primary300: "#77d1ff",
  Primary200: "#a4e0ff",
  Primary100: "#d2f0ff",
};

export const PRIMARY_PALETTE = [
  PRIMARY_COLORS.Primary800, // #006193
  PRIMARY_COLORS.Primary700, // #007fc0
  PRIMARY_COLORS.Primary600, // #009dee
  PRIMARY_COLORS.Primary500, // #1cb2ff
  PRIMARY_COLORS.Primary400, // #49c1ff
  PRIMARY_COLORS.Primary300, // #77d1ff
  PRIMARY_COLORS.Primary200, // #a4e0ff
  PRIMARY_COLORS.Primary100, // #d2f0ff
];

// ─── New Secondary Colors Palette (Testing) ──────────────────────────────────
export const SECONDARY_COLORS = {
  Secondary900: "#006696",
  Secondary800: "#0082c0",
  Secondary700: "#009ee9",
  Secondary600: "#13b3ff",
  Secondary500: "#3dc1ff",
  Secondary400: "#66ceff",
  Secondary300: "#90dbff",
  Secondary200: "#b9e9ff",
  Secondary100: "#f1fbff",
};

export const SECONDARY_PALETTE = [
  SECONDARY_COLORS.Secondary900, // #006696
  SECONDARY_COLORS.Secondary800, // #0082c0
  SECONDARY_COLORS.Secondary700, // #009ee9
  SECONDARY_COLORS.Secondary600, // #13b3ff
  SECONDARY_COLORS.Secondary500, // #3dc1ff
  SECONDARY_COLORS.Secondary400, // #66ceff
  SECONDARY_COLORS.Secondary300, // #90dbff
  SECONDARY_COLORS.Secondary200, // #b9e9ff
  SECONDARY_COLORS.Secondary100, // #f1fbff
];

// ─── Backward Compatibility Aliases ──────────────────────────────────────────
export const APP_COLORS = PRIMARY_PALETTE;
export const ACCENT_COLORS = SECONDARY_PALETTE;

// ─── Dynamic Section-wise Chart Colors for Testing ───────────────────────────
// Testing ke liye aap yahan har chart/graph ka color aasani se switch kar sakte hain.
export const SECTION_CHART_COLORS = {
  // ── 1. Main Dashboard Charts ──
  dashboard: {
    // Composition: User Goal Distribution (Donut — ordered by weightage)
    userGoals: [
      PRIMARY_COLORS.Primary700,     // #007fc0 (Rank 1 - Highest Weightage)
      PRIMARY_COLORS.Primary600,     // #009dee (Rank 2)
      PRIMARY_COLORS.Primary500,     // #1cb2ff (Rank 3)
      SECONDARY_COLORS.Secondary500, // #3dc1ff (Rank 4)
      PRIMARY_COLORS.Primary400,     // #49c1ff (Rank 5)
      PRIMARY_COLORS.Primary300,     // #77d1ff (Rank 6)
    ],
    // Composition: Gender Distribution (Donut)
    gender: {
      male: PRIMARY_COLORS.Primary700,       // #007fc0
      female: SECONDARY_COLORS.Secondary500, // #3dc1ff
      other: "#D9E0E6",
    },
    // Composition: Vegetarian vs Non-veg (Donut)
    diet: {
      veg: PRIMARY_COLORS.Primary700,        // #007fc0 (Primary — matches Male)
      nonVeg: SECONDARY_COLORS.Secondary500, // #3dc1ff (Secondary — matches Female)
      unspecified: "#D9E0E6",
    },
    // Composition: Conversion Funnel (SVG Diagram)
    funnel: {
      primaryStripe: PRIMARY_COLORS.Primary700,       // #007fc0 (Primary)
      secondaryStripe: SECONDARY_COLORS.Secondary500, // #3dc1ff (Secondary)
      depthOuter: PRIMARY_COLORS.Primary200,          // #a4e0ff
      depthInner: PRIMARY_COLORS.Primary300,          // #77d1ff
    },
    // Trends: Engagement Trend DAU (Area Chart)
    dauTrend: PRIMARY_COLORS.Primary700, // #007fc0 (Primary)
    // Trends: Fitzone Users Assigned (Bar Chart — ordered by weightage)
    fitzone: [
      PRIMARY_COLORS.Primary700,     // #007fc0 (Rank 1 - Highest Weightage / Primary)
      SECONDARY_COLORS.Secondary500, // #3dc1ff (Rank 2 - Secondary)
      PRIMARY_COLORS.Primary500,     // #1cb2ff (Rank 3)
      PRIMARY_COLORS.Primary400,     // #49c1ff (Rank 4)
      PRIMARY_COLORS.Primary300,     // #77d1ff (Rank 5)
      PRIMARY_COLORS.Primary200,     // #a4e0ff (Rank 6)
    ],
    // Trends: Program Enrollment Split (Donut Chart — ordered by weightage)
    programSplit: [
      PRIMARY_COLORS.Primary700,     // #007fc0 (Rank 1 - Highest Weightage / Primary)
      SECONDARY_COLORS.Secondary500, // #3dc1ff (Rank 2 - Secondary)
      PRIMARY_COLORS.Primary500,     // #1cb2ff (Rank 3)
      PRIMARY_COLORS.Primary400,     // #49c1ff (Rank 4)
      PRIMARY_COLORS.Primary300,     // #77d1ff (Rank 5)
      PRIMARY_COLORS.Primary200,     // #a4e0ff (Rank 6)
    ],
  },

  // ── 2. Subscription Dashboard Charts ──
  subscription: {
    // Composition: Users by Plan Type (Donut — horizontal bar layout)
    planType: [
      PRIMARY_COLORS.Primary700,     // #007fc0 (Primary — matches Male)
      SECONDARY_COLORS.Secondary500, // #3dc1ff (Secondary — matches Female)
      PRIMARY_COLORS.Primary400,     // #49c1ff
      SECONDARY_COLORS.Secondary400, // #66ceff
    ],
    // Composition: Transaction Health (Donut — Semantic Status Colors)
    txHealth: {
      failed: "hsl(0, 84%, 60%)",    // Red (#ef4444)
      refunded: "hsl(258, 90%, 66%)",  // Violet / Purple
      success: "hsl(160, 84%, 39%)",  // Emerald / Green
      disputed: "hsl(24, 94%, 50%)",   // Amber / Orange
      pending: "hsl(38, 92%, 50%)",   // Yellow / Warm Amber
    },
    // Trends: Active vs Churned Users (Area Chart)
    activeVsChurned: {
      active: PRIMARY_COLORS.Primary700, // #007fc0 (Primary)
      churned: "#ef4444",                 // Red (churn semantic)
    },
    // Trends: Plan-wise Revenue (Bar Chart)
    planRevenue: PRIMARY_COLORS.Primary700, // #007fc0 (Primary)
    // Platform Activity: Top Selling Plans (Bar Chart)
    topSellingPlans: SECONDARY_COLORS.Secondary500, // #3dc1ff (Secondary)
  },
};

// ─── Semantic Status Colors ──────────────────────────────────────────────────
// Reserved exclusively for states that require immediate recognition 
// (e.g., success, failure, pending). Never used for general categories.
export const STATUS_COLORS = {
  success: "hsl(160, 84%, 39%)", // Emerald / Green
  paid: "hsl(160, 84%, 39%)",
  active: "hsl(160, 84%, 39%)",
  failed: "hsl(0, 84%, 60%)",    // Red
  expired: "hsl(0, 84%, 60%)",
  churned: "hsl(0, 84%, 60%)",
  pending: "hsl(38, 92%, 50%)",  // Amber / Yellow
  revoked: "hsl(215, 16%, 65%)", // Gray
  refunded: "hsl(258, 90%, 66%)", // Violet
  disputed: "hsl(24, 94%, 50%)",  // Orange
};

// ─── Semantic Status Badge Classes ───────────────────────────────────────────
// Centralized mapping for status badges using soft tinted background and colored text.
export const STATUS_BADGE_STYLE = {
  success: "bg-emerald-500/10 text-emerald-600",
  paid: "bg-emerald-500/10 text-emerald-600",
  active: "bg-emerald-500/10 text-emerald-600",
  failed: "bg-rose-500/10 text-rose-600",
  expired: "bg-[#E11D48]/10 text-[#E11D48]",
  churned: "bg-rose-500/10 text-rose-600",
  pending: "bg-amber-500/10 text-amber-600",
  revoked: "bg-rose-500/10 text-rose-600",
  refunded: "bg-violet-500/10 text-violet-600",
  disputed: "bg-orange-500/10 text-orange-600",
  inactive: "bg-slate-500/10 text-slate-600",
};
