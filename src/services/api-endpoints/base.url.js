/*===================== BASE URL =====================*/
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://testadmin.trimify.com.au/api";

export const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")
  : "https://testadmin.trimify.com.au";

