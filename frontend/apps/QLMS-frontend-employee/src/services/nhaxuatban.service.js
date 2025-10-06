import createApiClient from "./api.service";

class NhaXuatBanService {
  constructor(baseURL = "/api/nhaxuatban") {
    this.api = createApiClient(baseURL);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async getAll() {
    const res = await this.api.get("/");
    // đảm bảo mỗi NXB đều có bookCount
    return res.data.map((nxb) => ({
      ...nxb,
      bookCount: nxb.bookCount ?? 0, // fallback 0 nếu backend chưa trả
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

export default new NhaXuatBanService();
