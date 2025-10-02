const { ObjectId } = require("mongodb");
class TheoDoiMuonSachService {
  constructor(client) {
    this.TDMS = client.db().collection("theodoimuonsach");
    this.DocGia = client.db().collection("docgia");
    this.Sach = client.db().collection("sach");
  }

  async create(payload) {
    const docGia = await this.DocGia.findOne({ MaDocGia: payload.MaDocGia });
    if (!docGia) throw new Error("DocGia không tồn tại");

    const sach = await this.Sach.findOne({ MaSach: payload.MaSach });
    if (!sach) throw new Error("sách không tồn tại");

    if (sach.SoQuyen <= 0) throw new Error("sách đã hết");

    const soSachDangMuon = await this.TDMS.countDocuments({
      MaDocGia: payload.MaDocGia,
      NgayTra: null,
    });

    if (soSachDangMuon >= 3) {
      throw new Error("Mỗi độc giả chị được mượn tối đa 3 cuốn cùng lúc");
    }
    const doc = {
      MaDocGia: payload.MaDocGia,
      MaSach: payload.MaSach,
      NgayMuon: new Date(payload.NgayMuon),
      NgayTra: payload.NgayTra ? new Date(payload.NgayTra) : null,
    };

    const result = await this.TDMS.insertOne(doc);

    await this.Sach.updateOne(
      {
        MaSach: payload.MaSach,
      },
      { $inc: { SoQuyen: -1 } }
    );
    return result;
  }
  async find(filter) {
    const cursor = await this.TDMS.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.TDMS.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async update(id, payload) {
    const update = {
      $set: {
        MaDocGia: payload.MaDocGia,
        MaSach: payload.MaSach,
        NgayMuon: new Date(payload.NgayMuon),
        NgayTra: payload.NgayTra ? new Date(payload.NgayTra) : null,
      },
    };

    const result = await this.TDMS.findOneAndUpdate(
      { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
      update,
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.TDMS.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.TDMS.deleteMany({});
    return result.deletedCount;
  }

  // Phương thức cho thống kê

  /**
   * @description Đếm số lượng phiếu mượn sách dựa trên bộ lọc
   * @param {Object} filter - Bộ lọc MongoDB (mặc định là rỗng để đếm tất cả)
   */
  async count(filter = {}) {
    // Sử dụng phương thức countDocuments() của MongoDB driver
    return await this.TDMS.countDocuments(filter);
  }

  async aggregate(pipeline) {
    // Sử dụng phương thức aggregate() của MongoDB driver
    const cursor = await this.TDMS.aggregate(pipeline);
    return await cursor.toArray();
  }
}

module.exports = TheoDoiMuonSachService;
