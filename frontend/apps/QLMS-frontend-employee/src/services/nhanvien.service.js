import createApiClient from "./api.service";

class NhanVienService {
  constructor(baseURL = "/api/nhanvien") {
    this.api = createApiClient(baseURL);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async getById(id) {
    return this.get(id);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async createWithAvatar(nhanVienObj, file = null) {
    const fd = new FormData();
    Object.entries(nhanVienObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });
    if (file) fd.append("Avatar", file);
    return (await this.api.post("/", fd)).data;
  }

  async updateWithAvatar(id, nhanVienObj, file = null) {
    const fd = new FormData();
    Object.entries(nhanVienObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });
    if (file) fd.append("Avatar", file);
    return (await this.api.put(`/${id}`, fd)).data;
  }

  async login(credentials) {
    const result = await this.api.post("/login", credentials);
    return result.data;
  }

  async register(data) {
    const result = await this.api.post("/register", data);
    return result.data;
  }
}

export default new NhanVienService();
