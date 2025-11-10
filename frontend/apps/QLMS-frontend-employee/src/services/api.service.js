import axios from "axios";

const commonConfig = {
  headers: {
    // Đổi Headers thành headers (thường là chữ thường trong Axios)
    //"Content-Type": "application/json",
    Accept: "application/json",
  },
};

export default (baseURL) => {
  // 1. Tạo instance Axios
  const apiClient = axios.create({
    baseURL,
    ...commonConfig,
  });

  // 2. Thêm Request Interceptor để xử lý Token
  apiClient.interceptors.request.use(
    (config) => {
      // Lấy token từ localStorage (nơi bạn đã lưu sau khi đăng nhập)
      const token = localStorage.getItem("userToken");

      // Nếu token tồn tại và yêu cầu không phải là yêu cầu Auth (để tránh lặp)
      if (token) {
        // Đính kèm token vào Header Authorization theo chuẩn Bearer
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return apiClient; // Trả về instance đã có Interceptor
};
