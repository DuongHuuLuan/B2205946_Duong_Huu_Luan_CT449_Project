const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("docgia");
  }

  // Chuẩn hóa dữ liệu đầu vào (chỉ giữ field hợp lệ)
  extractDocGiaData(payload) {
    const docgia = {
      MaDocGia: payload.MaDocGia,
      HoLot: payload.HoLot,
      Ten: payload.Ten,
      NgaySinh: payload.NgaySinh,
      Phai: payload.Phai,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
    };

    // Xóa field undefined
    Object.keys(docgia).forEach(
      (key) => docgia[key] === undefined && delete docgia[key]
    );

    return docgia;
  }

  // Tạo mới độc giả
  async create(payload) {
    const docgia = this.extractDocGiaData(payload);
    const result = await this.DocGia.insertOne(docgia);
    return result;
  }

  // Tìm nhiều theo filter
  async find(filter) {
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }

  // Tìm theo tên (HoLot + Ten)
  async findByName(name) {
    return await this.find({
      $or: [
        { HoLot: { $regex: new RegExp(name), $options: "i" } },
        { Ten: { $regex: new RegExp(name), $options: "i" } },
      ],
    });
  }

  // Tìm theo ID
  async findById(id) {
    return await this.DocGia.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật thông tin độc giả
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractDocGiaData(payload);
    const result = await this.DocGia.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  // Xóa theo ID
  async delete(id) {
    const result = await this.DocGia.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  // Xóa toàn bộ collection
  async deleteAll() {
    const result = await this.DocGia.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = DocGiaService;
