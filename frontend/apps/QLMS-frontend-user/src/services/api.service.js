// src/services/api.service.js
import axios from "axios";

const DOCGIA_TOKEN_KEY = "docgiaToken";

const getBaseUrl = () => {
  try {
    if (
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_BASE
    ) {
      return import.meta.env.VITE_API_BASE;
    }
  } catch (e) {}

  try {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.VUE_APP_API_BASE
    ) {
      return process.env.VUE_APP_API_BASE;
    }
  } catch (e) {}

  if (typeof window !== "undefined" && window.__API_BASE__) {
    return window.__API_BASE__;
  }

  return "http://localhost:3002/api";
};

const BASE_URL = getBaseUrl();

/* Public API (no token) */
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});

/* Default api instance (optional global) */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* Attach token for default api as well */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(DOCGIA_TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export function createApiClient(prefix = "") {
  // normalize prefix: '' hoặc bắt đầu bằng '/'
  const p = !prefix ? "" : prefix.startsWith("/") ? prefix : `/${prefix}`;

  const instance = axios.create({
    baseURL: `${BASE_URL}${p}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 20000,
  });

  // request: gắn token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(DOCGIA_TOKEN_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  // response: optional unwrap res.data so services can return data directly
  instance.interceptors.response.use(
    (res) => res?.data ?? res,
    (err) => Promise.reject(err)
  );

  return instance;
}

export default api;
