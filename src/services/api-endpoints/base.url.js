/*===================== BASE URL =====================*/
/*  Assign your backend base URL in the .env file:
    VITE_API_BASE_URL=https://apibackend.trimify.com.au/api
*/
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://testadmin.trimify.com.au/api";

/*  All endpoints are relative to this base.
    Full URL = BASE_URL + endpoint constant
    Example: BASE_URL + ADMIN_LOGIN  →  https://apibackend.trimify.com.au/api/admin/login
*/
