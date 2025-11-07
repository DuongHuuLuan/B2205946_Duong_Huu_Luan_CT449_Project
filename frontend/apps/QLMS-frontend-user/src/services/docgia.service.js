import { createApiClient, publicApi } from "./api.service";

const PREFIX = "/docgia";

class DocGiaService {
  constructor(prefix) {
    this.publicPath = prefix;
    this.privateApi = createApiClient(prefix);
  }

  /* Public (no token) */
  async login(data) {
    return publicApi.post(`${this.publicPath}/login`, data);
  }

  async register(data) {
    return publicApi.post(`${this.publicPath}/register`, data);
  }

  /* Private (token required) */
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
    return this.privateApi.post("/profile/avatar", formData);
  }
}

export default new DocGiaService(PREFIX);
