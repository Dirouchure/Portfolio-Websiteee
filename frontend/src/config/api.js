import axios from "axios";
import { isTokenValid, clearAuth } from "../utils/auth";
import defaultProfilePic from "../assets/profile.jpg";

const DEFAULT_PORT = process.env.REACT_APP_API_PORT || "5001";

export const isStaticDeployment = () => {
  if (typeof window === "undefined") return false;
  // If an explicit API URL is set, we are not purely static
  if (process.env.REACT_APP_API_URL) return false;
  
  const hostname = window.location.hostname || "";
  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
    return false;
  }
  // Check if private IP on local WiFi (for mobile testing with local backend)
  const isPrivateIp = /^192\.168\./.test(hostname) || /^10\./.test(hostname) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);
  if (isPrivateIp) {
    return false;
  }

  // Any hosted domain (Netlify, Vercel, GitHub Pages, or custom domain) without REACT_APP_API_URL
  return true;
};

const getApiUrl = () => {
  // If REACT_APP_API_URL is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/$/, "");
  }

  // If deployed to a static host (Netlify, Vercel, etc.) without a backend configured,
  // do NOT attempt connecting to port 5001 (avoids Mixed Content and Connection Refused errors)
  if (isStaticDeployment()) {
    return "";
  }

  // Auto-detect based on hostname (localhost or local network IP)
  const hostname = window.location.hostname || "localhost";
  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
    return `http://localhost:${DEFAULT_PORT}/api`;
  }

  return `http://${hostname}:${DEFAULT_PORT}/api`;
};

const API_URL = getApiUrl();

export const BASE_URL = API_URL ? API_URL.replace("/api", "") : "";

export const getUploadUrl = (filePath, cacheKey) => {
  if (!filePath) return defaultProfilePic;
  if (filePath.includes("avatar.svg") || filePath === "/images/profile.jpg") {
    return defaultProfilePic;
  }
  if (filePath.startsWith("http://") || filePath.startsWith("https://") || filePath.startsWith("data:") || filePath.startsWith("/static/media/")) {
    return filePath;
  }
  // When hosted on Netlify or static host without an active backend, fall back to bundled photo
  if (isStaticDeployment() || !API_URL) {
    return defaultProfilePic;
  }
  // Frontend public assets (e.g., /images/profile.jpg)
  if (filePath.startsWith("/")) {
    return `${process.env.PUBLIC_URL || ""}${filePath}`;
  }
  const base = `${BASE_URL}/uploads/${filePath}`;
  return cacheKey ? `${base}?v=${encodeURIComponent(cacheKey)}` : base;
};

const api = axios.create({
  baseURL: API_URL || undefined,
});

api.interceptors.request.use(
  (config) => {
    // If on a static host without a backend API, reject immediately so components instantly use offline fallback data
    if (isStaticDeployment() && !process.env.REACT_APP_API_URL) {
      return Promise.reject(new Error("Static deployment mode: backend API not configured."));
    }

    const token = localStorage.getItem("token");
    if (token) {
      if (!isTokenValid(token)) {
        clearAuth();
        if (
          window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin/login"
        ) {
          window.location.href = "/admin/login";
        }
        return Promise.reject(new Error("Session expired"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname.startsWith("/admin")
    ) {
      clearAuth();
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
