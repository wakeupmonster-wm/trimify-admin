/*===================== BASE URL =====================*/
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Route local development requests through Vite so the browser calls the
// same origin (`localhost`) and Vite forwards them to the API server.
export const BASE_URL =
  configuredApiBaseUrl ||
  (import.meta.env.DEV
    ? "/api"
    : "https://adminbackend.trimify.com.au/api");

export const IMAGE_BASE_URL = configuredApiBaseUrl
  ? configuredApiBaseUrl.replace(/\/api\/?$/, "")
  : "https://adminbackend.trimify.com.au";

