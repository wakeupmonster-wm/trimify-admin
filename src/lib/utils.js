import { clsx } from "clsx";
import { format, isValid } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCompactNumber(number) {
  if (number === undefined || number === null) return "0";
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}

/** Standard date-only display format used throughout the admin panel. */
export function formatAppDate(value, fallback = "-") {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  return isValid(date) ? format(date, "dd MMM yyyy") : fallback;
}

/** Standard date-and-time display format used throughout the admin panel. */
export function formatAppDateTime(value, fallback = "-") {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  return isValid(date) ? format(date, "dd MMM yyyy, hh:mm a") : fallback;
}
