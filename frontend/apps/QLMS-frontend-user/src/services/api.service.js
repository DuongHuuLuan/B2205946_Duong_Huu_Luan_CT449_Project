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
  } catch (_) {}

  try {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.VUE_APP_API_BASE
    ) {
      return process.env.VUE_APP_API_BASE;
    }
  } catch (_) {}

  if (typeof window !== "undefined" && window.__API_BASE__) {
    return window.__API_BASE__;
  }

  return "/api";
};

const BASE_URL = getBaseUrl();
console.log("[DEBUG] API BASE_URL =", BASE_URL);

//Public API (không token)

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});

//Private API (token)
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
    } catch (_) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// createApiClient("/docgia"), "/nhanvien"

export function createApiClient(prefix = "") {
  const p = prefix ? (prefix.startsWith("/") ? prefix : `/${prefix}`) : "";

  const instance = axios.create({
    baseURL: `${BASE_URL}${p}`,
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

        // Nếu upload FormData thì để axios tự set Content-Type
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
          delete config.headers["content-type"];
        }
      } catch (_) {}
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
