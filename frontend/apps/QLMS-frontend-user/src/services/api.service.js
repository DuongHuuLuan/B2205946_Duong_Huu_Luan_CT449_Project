import axios from "axios";

const DOCGIA_BASE_URL = "/api";
const DOCGIA_TOKEN_KEY = "docgiaToken";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const apiClient = axios.create({
  baseURL: DOCGIA_BASE_URL,
  ...commonConfig,
});

// 2. Thêm Request Interceptor để xử lý Token (Độc giả)
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ khóa riêng của Độc giả
    const token = localStorage.getItem(DOCGIA_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
