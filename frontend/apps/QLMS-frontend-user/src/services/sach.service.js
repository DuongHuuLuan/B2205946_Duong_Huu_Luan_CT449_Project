import api from "./api.service";

class SachService {
  async getAllAvailable() {
    return (await api.get("/sach/available")).data.data;
  }

  async getById(id) {
    return (await api.get(`/sach/${id}`)).data.data;
  }

  async search(keyword) {
    const response = await api.get(
      `/sach/search?q=${encodeURIComponent(keyword)}`
    );
    return response.data.data;
  }
}

export default new SachService();
