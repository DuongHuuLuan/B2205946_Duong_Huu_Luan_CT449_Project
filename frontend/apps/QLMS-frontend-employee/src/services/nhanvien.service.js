import createApiClient from "./api.service";

const baseURL = "/api/nhanvien";

class NhanVienService {
  constructor(baseURL) {
    this.api = createApiClient(baseURL);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  /**
   * @description
   * @param {Object} credentials
   */
  async login(credentials) {
    const result = await this.api.post("/login", credentials);
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

  /**
   * @description
   */
  async getAll() {
    return (await this.api.get("/")).data;
  }

  /**
   * @description
   */
  async getById(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  /**
   * @description
   */
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  /**
   * @description
   */
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new NhanVienService(baseURL);
