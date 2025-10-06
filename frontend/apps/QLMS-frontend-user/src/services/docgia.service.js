import createApiClient from "./api.service";
const baseURL = "/api/docgia";

class DocGiaService {
  constructor(baseURL) {
    this.api = createApiClient(baseURL);
  }

  /**
   * @description
   * @param {Object} data
   */
  async login(data) {
    const result = await this.api.post("/login", data);
    return result.data;
  }

  /**
   * @description
   * @param {Object} data
   */
  async register(data) {
    const result = await this.api.post("/register", data);
    return result.data;
  }
}

export default new DocGiaService(baseURL);
