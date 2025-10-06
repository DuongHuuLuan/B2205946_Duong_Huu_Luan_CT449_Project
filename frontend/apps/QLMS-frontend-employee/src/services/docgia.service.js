import createApiClient from "./api.service";

class DocGiaService {
  constructor(baseURL = "/api/docgia") {
    this.api = createApiClient(baseURL);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async getAll() {
    const res = await this.api.get("/");
    // Đảm bảo có trường hasBorrowed để UI dùng check disable nút xóa
    return res.data.map((dg) => ({
      ...dg,
      hasBorrowed: dg.hasBorrowed ?? false, // fallback false nếu backend chưa gửi
    }));
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new DocGiaService();
