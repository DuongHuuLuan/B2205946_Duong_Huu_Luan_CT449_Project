const { ObjectId } = require("mongodb");
class TheoDoiMuonSachService {
  constructor(client) {
    this.TDMS = client.db().collection("theodoimuonsach");
    this.DocGia = client.db().collection("docgia");
    this.Sach = client.db().collection("sach");
  }

  // Thêm phiếu mượn
  async create(payload) {
    // Kiểm tra DocGia tồn tại theo MaDocGia
    const docGia = await this.DocGia.findOne({ MaDocGia: payload.MaDocGia });
    if (!docGia) throw new Error("DocGia không tồn tại");

    // Kiểm tra Sach tồn tại theo MaSach
    const sach = await this.Sach.findOne({ MaSach: payload.MaSach });
    if (!sach) throw new Error("Sach không tồn tại");

    const doc = {
      MaDocGia: payload.MaDocGia,
      MaSach: payload.MaSach,
      NgayMuon: new Date(payload.NgayMuon),
      NgayTra: payload.NgayTra ? new Date(payload.NgayTra) : null,
    };

    const result = await this.TDMS.insertOne(doc);
    return result;
  }

  // Tìm nhiều phiếu mượn
  async find(filter) {
    const cursor = await this.TDMS.find(filter);
    return await cursor.toArray();
  }

  // Tìm theo id
  async findById(id) {
    return await this.TDMS.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật phiếu mượn
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

  // Xóa 1 phiếu mượn
  async delete(id) {
    const result = await this.TDMS.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả phiếu mượn
  async deleteAll() {
    const result = await this.TDMS.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = TheoDoiMuonSachService;
