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

  // default (include /api)
  return "http://localhost:3002/api";
};

const BASE_URL = getBaseUrl();
console.log("[DEBUG] API BASE_URL =", BASE_URL);

/* Public API (no token) */
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(DOCGIA_TOKEN_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {}
    return config;
  },
  (error) => Promise.reject(error)
);

export function createApiClient(prefix = "") {
  const p = !prefix ? "" : prefix.startsWith("/") ? prefix : `/${prefix}`;

  const instance = axios.create({
    baseURL: `${BASE_URL}${p}`, // e.g. http://localhost:3002/api + /docgia => /api/docgia
    headers: {
      Accept: "application/json",
    },
    timeout: 20000,
  });

  instance.interceptors.request.use(
    (config) => {
      try {
        const token = localStorage.getItem(DOCGIA_TOKEN_KEY);
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
          if (config.headers) {
            delete config.headers["Content-Type"];
            delete config.headers["content-type"];
          }
        }
      } catch (e) {}
      return config;
    },
    (err) => Promise.reject(err)
  );

  instance.interceptors.response.use(
    (res) => res?.data ?? res,
    (err) => Promise.reject(err)
  );

  return instance;
}

export default api;
