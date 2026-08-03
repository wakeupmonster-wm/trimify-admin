/**
 * Theme & Color Configuration
 * 
 * This file centralizes the color palettes used across the application's dashboards
 * and charts to ensure a consistent, premium UI/UX.
 */

// ─── Unified Brand Palette (Monochromatic Blue) ──────────────────────────────
// Used for general data visualization (e.g., pie charts, bar charts) to avoid 
// the "rainbow effect" and maintain a cohesive brand identity.
export const APP_COLORS = [
  "#007FC0", // Base Primary Blue
  "#3399D1", // Light Blue
  "#005986", // Dark Blue
  "#66B2E3", // Lighter Blue
  "#004060", // Darkest Blue
  "#99CCF4", // Soft Blue
  "#cce6ff", // Lightest Blue
];

export const ACCENT_COLORS = [
    "#3b82f6", // Blue (Weight Loss)
    "#10b981", // Emerald (Gain Muscle)
    "#8b5cf6", // Violet (Stay Fit)
    "#f59e0b", // Amber 
    "#f43f5e", // Rose
    "#0ea5e9", // Sky
  ];

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
  expired: "bg-amber-500/10 text-amber-600",
  churned: "bg-rose-500/10 text-rose-600",
  pending: "bg-amber-500/10 text-amber-600",
  revoked: "bg-rose-500/10 text-rose-600",
  refunded: "bg-violet-500/10 text-violet-600",
  disputed: "bg-orange-500/10 text-orange-600",
  inactive: "bg-slate-500/10 text-slate-600",
};
