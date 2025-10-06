import axios from "axios";

const DOCGIA_TOKEN_KEY = "docgiaToken";

const createApiClient = (baseURL) => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

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

  return api;
};

export default createApiClient;
