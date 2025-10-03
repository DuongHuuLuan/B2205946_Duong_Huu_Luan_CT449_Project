const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.TDMS = client.db().collection("theodoimuonsach");
    this.DocGia = client.db().collection("docgia");
    this.Sach = client.db().collection("sach");
  }

  async create(payload) {
    const docGia = await this.DocGia.findOne({ MaDocGia: payload.MaDocGia });
    if (!docGia) throw new Error("Mã Độc Giả không tồn tại");

    const sach = await this.Sach.findOne({ MaSach: payload.MaSach });
    if (!sach) throw new Error("Sách không tồn tại");

    if (sach.SoQuyen <= 0) throw new Error("Sách đã hết");

    const soSachDangMuon = await this.TDMS.countDocuments({
      MaDocGia: payload.MaDocGia,
      TrangThai: { $in: ["Chờ duyệt", "Đang mượn"] },
    });

    if (soSachDangMuon >= 3) {
      throw new Error("Mỗi độc giả chỉ được mượn tối đa 3 cuốn cùng lúc");
    }

    const doc = {
      MaDocGia: payload.MaDocGia,
      MaSach: payload.MaSach,
      NgayMuon: new Date(payload.NgayMuon),
      HanTra: payload.HanTra ? new Date(payload.HanTra) : null,
      NgayTra: payload.NgayTra ? new Date(payload.NgayTra) : null,
      TrangThai: "Chờ duyệt",
      NhanVienDuyet: null,
      NhanVienTra: null,
    };

    const result = await this.TDMS.insertOne(doc);
    return result;
  }

  async find(filter) {
    const cursor = await this.TDMS.find(filter);
    const records = await cursor.toArray();

    const today = new Date();

    for (let rec of records) {
      if (
        rec.TrangThai === "Đang mượn" &&
        rec.HanTra &&
        new Date(rec.HanTra) < today
      ) {
        rec.TrangThai = "Trễ hạn";

        await this.TDMS.updateOne(
          { _id: rec._id },
          { $set: { TrangThai: "Trễ hạn" } }
        );
      }
    }

    return records;
  }

  async findById(id) {
    return await this.TDMS.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;
    if (!objectId) return null;

    const doc = await this.TDMS.findOne({ _id: objectId });
    if (!doc) return null;
    let updateData = {};

    // Trường hợp chuyển từ "Chờ duyệt" -> "Đang mượn"
    if (payload.TrangThai === "Đang mượn" && doc.TrangThai === "Chờ duyệt") {
      const sach = await this.Sach.findOne({ MaSach: doc.MaSach });
      if (!sach || sach.SoQuyen <= 0) {
        throw new Error("Sách đã hết, không thể duyệt.");
      }

      await this.Sach.updateOne(
        { MaSach: doc.MaSach },
        { $inc: { SoQuyen: -1 } }
      );

      // auto set NgayMuon và HanTra nếu chưa có
      const ngayMuon = payload.NgayMuon
        ? new Date(payload.NgayMuon)
        : new Date();
      let hanTra = payload.HanTra
        ? new Date(payload.HanTra)
        : new Date(ngayMuon);
      if (!payload.HanTra) {
        hanTra.setDate(ngayMuon.getDate() + 7);
      }

      updateData = {
        TrangThai: "Đang mượn",
        NgayMuon: ngayMuon,
        HanTra: hanTra,
        NhanVienDuyet: payload.MSNV || null,
      };
    }

    // Trường hợp chuyển từ "Đang mượn" -> "Đã trả"
    else if (payload.TrangThai === "Đã trả" && doc.TrangThai !== "Đã trả") {
      await this.Sach.updateOne(
        { MaSach: doc.MaSach },
        { $inc: { SoQuyen: +1 } }
      );

      updateData = {
        TrangThai: "Đã trả",
        NgayTra: payload.NgayTra ? new Date(payload.NgayTra) : new Date(),
        NhanVienTra: payload.MSNV || null,
      };
    }

    // Nếu chỉ update thông tin khác (không đổi trạng thái)
    else {
      updateData = {
        ...(payload.MaDocGia && { MaDocGia: payload.MaDocGia }),
        ...(payload.MaSach && { MaSach: payload.MaSach }),
        ...(payload.NgayMuon && { NgayMuon: new Date(payload.NgayMuon) }),
        ...(payload.NgayTra && { NgayTra: new Date(payload.NgayTra) }),
        ...(payload.HanTra && { HanTra: new Date(payload.HanTra) }),
        ...(payload.TrangThai && { TrangThai: payload.TrangThai }),
      };
    }
    const result = await this.TDMS.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result.value || result;
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

  async count(filter = {}) {
    return await this.TDMS.countDocuments(filter);
  }

  async aggregate(pipeline) {
    const cursor = await this.TDMS.aggregate(pipeline);
    return await cursor.toArray();
  }
}

module.exports = TheoDoiMuonSachService;
