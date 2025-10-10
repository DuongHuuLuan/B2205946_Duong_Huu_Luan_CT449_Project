// File: src/services/theodoimuonsach.service.js (hoặc tương tự)

import api from "./api.service";

class TheoDoiMuonSachService {
  async findByDocGia() {
    return (await api.get("/theodoimuonsach/docgia")).data;
  }

  async createByDocGia(data) {
    return (await api.post("/theodoimuonsach/docgia", data)).data;
  }
}

export default new TheoDoiMuonSachService();
