import createApiClient from "./api.service";
const baseURL = "/api/sach";

class SachService {
  constructor(baseURL) {
    this.api = createApiClient(baseURL);
  }

  // Lấy tất cả sách
  async getAll(query = {}) {
    const res = await this.api.get("/", { params: query });
    return res.data; // { message, data: [...] }
  }

  // Lấy sách theo ID
  async get(id) {
    const res = await this.api.get(`/${id}`);
    return res.data; // { message, data: {...} }
  }

  // Thêm sách mới
  async create(data) {
    const res = await this.api.post("/", data);
    return res.data; // { message, data: {...} }
  }

  // Cập nhật sách
  async update(id, data) {
    const res = await this.api.put(`/${id}`, data);
    return res.data; // { message, data: {...} }
  }

  // Xóa sách theo ID
  async delete(id) {
    const res = await this.api.delete(`/${id}`);
    return res.data; // { message, data: {...} }
  }

  // Xóa toàn bộ sách
  async deleteAll() {
    const res = await this.api.delete("/");
    return res.data; // { message, data: { deletedCount } }
  }
}

export default new SachService(baseURL);
