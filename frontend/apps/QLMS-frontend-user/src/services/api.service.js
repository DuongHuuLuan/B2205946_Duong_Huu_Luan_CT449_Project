// src/services/api.service.js

import axios from "axios";

const DOCGIA_TOKEN_KEY = "docgiaToken";
const BASE_URL = "http://localhost:3000/api";

// 1.PUBLIC API (KHÔNG CÓ Interceptor Token)
// Dùng cho Login, Register.
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2.PRIVATE API (CÓ Interceptor Token)
// Dùng cho các route bảo mật (được export default).
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor chỉ áp dụng cho PRIVATE API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(DOCGIA_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
