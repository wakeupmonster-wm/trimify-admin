export const formatEnumLabel = (rawString) => {
  if (!rawString || typeof rawString !== "string" || rawString === "N/A") return "—";
  
  // Replace underscores with spaces
  let formatted = rawString.replace(/_/g, " ");
  
  // Remove "manual" if we don't want to leak internal grant logic
  formatted = formatted.replace(/manual/gi, "").trim();
  
  // Capitalize words
  const result = formatted.replace(/\b\w/g, (l) => l.toUpperCase());
  
  // Console Detection for Enum Leaks
  // console.warn(`[Display Helper] Using generic fallback for unknown enum: "${rawString}" -> "${result}"`);
  // Since the user asked for console.warn during development, I'll keep it active but maybe log only in dev environment if we had access to NODE_ENV, but for now I'll just use a generic console warn.
  
  // We can just log it always for now as requested.
  console.warn(`[Display Helper] Using generic fallback for unknown enum: "${rawString}" -> "${result}"`);

  return result;
};
