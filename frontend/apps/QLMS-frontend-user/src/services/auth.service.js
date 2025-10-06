import apiClient from "./http-client"; // Import instance ĐỘC LẬP của Độc giả

class AuthService {
  // Đảm bảo endpoint chỉ là của Độc giả
  async login(credentials) {
    return (await apiClient.post("/docgia/login", credentials)).data;
  }

  // ... các hàm khác
}

export default new AuthService();
