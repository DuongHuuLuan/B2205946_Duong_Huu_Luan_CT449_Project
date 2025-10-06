// src/services/auth.service.js
import createApiClient from "./api.service";

const API_BASE_URL = "http://localhost:3000/api/auth";

class AuthService {
  // Thay đổi: Bây giờ constructor sử dụng URL đầy đủ
  constructor(baseURL = API_BASE_URL) {
    this.api = createApiClient(baseURL);
  }

  async register(data) {
    return (await this.api.post("/register", data)).data;
  }

  async login(data) {
    return (await this.api.post("/login", data)).data;
  }

  // Các hàm quản lý Token ở Frontend (quan trọng)
  logout() {
    localStorage.removeItem("userToken"); // Xóa token khỏi bộ nhớ cục bộ
  }

  saveToken(token) {
    localStorage.setItem("userToken", token); // Lưu token nhận được sau khi đăng nhập
  }

  getToken() {
    return localStorage.getItem("userToken");
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}

export default new AuthService();
