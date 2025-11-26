import { createApiClient, publicApi } from "./api.service";
const PREFIX = "/docgia";

class DocGiaService {
  constructor(prefix) {
    this.privateApi = createApiClient(prefix);
    this.publicPath = prefix;
  }

  async login(data) {
    const res = await publicApi.post(`${this.publicPath}/login`, data);
    return res;
  }

  async register(data) {
    const res = await publicApi.post(`${this.publicPath}/register`, data);
    return res;
  }

  async getProfile() {
    const res = await this.privateApi.get("/profile/me");
    return res;
  }

  async updateProfile(payload) {
    const res = await this.privateApi.put("/profile/update", payload);
    return res;
  }

  async uploadAvatar(formData) {
    return await this.privateApi.put("/profile/update", formData);
  }
}

export default new DocGiaService(PREFIX);
