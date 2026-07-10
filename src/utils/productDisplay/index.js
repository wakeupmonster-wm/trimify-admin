import { SPECIAL_MAPPINGS } from "./specialMappings";
import { formatEnumLabel } from "./fallbackFormatters";

/**
 * Safely resolves the display name for a product, subscription, or raw enum string.
 * Priority: displayName -> customDisplayName -> specialMappings -> generic formatter -> safe fallback
 */
export const getProductDisplayName = (productInput) => {
  if (productInput === null || productInput === undefined || productInput === "N/A" || productInput === "") {
    return "—";
  }

  let rawString = null;

  // 1. If object, check strict priority fields
  if (typeof productInput === "object") {
    if (productInput.displayName) return productInput.displayName;
    if (productInput.customDisplayName) return productInput.customDisplayName;
    
    // Check nested objects if API passes { product: { ... } }
    const nested = productInput.product || productInput.subscription;
    if (nested && typeof nested === "object") {
      if (nested.displayName) return nested.displayName;
      if (nested.customDisplayName) return nested.customDisplayName;
    }
    
    // Extract raw identifier for fallback
    rawString = productInput.productId || productInput.planType || productInput.id || productInput._id;
  } else if (typeof productInput === "string") {
    rawString = productInput;
  }

  if (!rawString) return "—";

  // 2. Check Special Mappings (e.g. BOOST -> Super Charge)
  const key = rawString.toUpperCase();
  if (SPECIAL_MAPPINGS[key]) {
    return SPECIAL_MAPPINGS[key];
  }

  // 3. Use generic safe formatter
  return formatEnumLabel(rawString);
};
