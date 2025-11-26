import createApiClient from "./api.service";

class DocGiaService {
  constructor(baseURL = "/api/docgia") {
    this.api = createApiClient(baseURL);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async createWithAvatar(docGiaObj, file) {
    const fd = new FormData();
    // docGiaObj là object trường dữ liệu (MaDocGia, Ten, ...)
    Object.keys(docGiaObj).forEach((k) => {
      if (docGiaObj[k] !== undefined && docGiaObj[k] !== null) {
        fd.append(k, docGiaObj[k]);
      }
    });
    if (file) fd.append("Avatar", file);

    // IMPORTANT: không set Content-Type ở đây
    const res = await this.api.post("/with-avatar", fd);
    return res.data;
  }

  // Update with file -> PUT /:id (backend của bạn có uploadAvatar.single('Avatar') cho PUT /:id)
  async updateWithAvatar(id, docGiaObj, file) {
    const fd = new FormData();
    Object.keys(docGiaObj).forEach((k) => {
      if (docGiaObj[k] !== undefined && docGiaObj[k] !== null) {
        fd.append(k, docGiaObj[k]);
      }
    });
    if (file) fd.append("Avatar", file);

    const res = await this.api.put(`/${id}`, fd);
    return res.data;
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
