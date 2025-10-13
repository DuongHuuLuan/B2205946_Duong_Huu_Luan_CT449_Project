import { createApiClient, publicApi } from "./api.service";
const PREFIX = "/docgia";

class DocGiaService {
  constructor(prefix) {
    // private API (có interceptor gắn token)
    this.privateApi = createApiClient(prefix);
    this.publicPath = prefix;
  }

  // LOGIN / REGISTER dùng publicApi (không cần token)
  async login(data) {
    const res = await publicApi.post(`${this.publicPath}/login`, data);
    return res.data ?? res;
  }

  async register(data) {
    const res = await publicApi.post(`${this.publicPath}/register`, data);
    return res.data ?? res;
  }
  async getProfile() {
    return this.privateApi.get("/profile/me");
  }

  async updateProfile(payload) {
    return this.privateApi.put("/profile/update", payload);
  }

  async getBorrowStats() {
    return this.privateApi.get("/profile/stats");
  }

  async uploadAvatar(formData) {
    return this.privateApi.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export default new DocGiaService(PREFIX);
