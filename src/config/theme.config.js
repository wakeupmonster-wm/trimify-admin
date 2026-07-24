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
  success: "bg-emerald-100/70 text-emerald-700",
  paid: "bg-emerald-100/70 text-emerald-700",
  active: "bg-emerald-100/70 text-emerald-700",
  failed: "bg-rose-100/70 text-rose-700",
  expired: "bg-amber-100/70 text-amber-700",
  churned: "bg-rose-100/70 text-rose-700",
  pending: "bg-amber-100/70 text-amber-700",
  revoked: "bg-rose-100/70 text-rose-700",
  refunded: "bg-violet-100/70 text-violet-700",
  disputed: "bg-orange-100/70 text-orange-700",
  inactive: "bg-slate-100/70 text-slate-600",
};
