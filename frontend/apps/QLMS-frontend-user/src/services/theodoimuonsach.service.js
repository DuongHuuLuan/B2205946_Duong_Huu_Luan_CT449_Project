import api from "./api.service";

class TheoDoiMuonSachService {
  async getByDocGia() {
    return (await api.get("/theodoimuonsach/docgia")).data;
  }

  async create(data) {
    return (await api.post("/theodoimuonsach", data)).data;
  }
}

export default new TheoDoiMuonSachService();
