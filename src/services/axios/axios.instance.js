import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_Token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto-logout logic — only redirect if NOT already on the login page
      const isOnLoginPage = window.location.pathname.startsWith("/auth/login") || window.location.pathname === "/auth";
      if (!isOnLoginPage) {
        console.warn("Session Expired. Logging out...");
        localStorage.removeItem("access_Token");
        localStorage.removeItem("auth_user");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);