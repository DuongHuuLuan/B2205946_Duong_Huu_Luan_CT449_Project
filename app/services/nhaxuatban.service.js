const { ObjectId } = require("mongodb");

class NhaXuatBanService {
  constructor(client) {
    this.NXB = client.db().collection("nhaxuatban");
  }

  // Thêm NXB mới
  async create(payload) {
    const doc = {
      MaNXB: payload.MaNXB,
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
    };
    const result = await this.NXB.insertOne(doc);
    return result;
  }

  // Tìm nhiều NXB theo filter
  async find(filter) {
    const cursor = await this.NXB.find(filter);
    return await cursor.toArray();
  }

  // Tìm NXB theo id
  async findById(id) {
    return await this.NXB.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật NXB
  async update(id, payload) {
    const update = {
      $set: {
        MaNXB: payload.MaNXB,
        TenNXB: payload.TenNXB,
        DiaChi: payload.DiaChi,
        DienThoai: payload.DienThoai,
      },
    };
    const result = await this.NXB.findOneAndUpdate(
      { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
      update,
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa 1 NXB
  async delete(id) {
    const result = await this.NXB.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả NXB
  async deleteAll() {
    const result = await this.NXB.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = NhaXuatBanService;
