const { ObjectId } = require("mongodb");

class SachService {
  constructor(client) {
    this.Sach = client.db().collection("sach");
  }

  extractSachData(payload) {
    const sach = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      DonGia: payload.DonGia,
      SoQuyen: payload.SoQuyen,
      NamXuatBan: payload.NamXuatBan,
      MaNXB: payload.MaNXB,
      TacGia: payload.TacGia, // hoặc NguonGoc
    };

    Object.keys(sach).forEach(
      (key) => sach[key] === undefined && delete sach[key]
    );

    return sach;
  }

  async create(payload) {
    const sach = this.extractSachData(payload);
    const result = await this.Sach.insertOne(sach);
    return result;
  }

  async find(filter) {
    const cursor = await this.Sach.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Sach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const update = this.extractSachData(payload);

    //update trước
    const result = await this.Sach.updateOne(filter, { $set: update });

    if (result.matchedCound == 0) {
      return null;
    }

    // lấy lại document sau khi update
    return await this.Sach.findOne(filter);
  }

  async delete(id) {
    const result = await this.Sach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.Sach.deleteMany({});
    return result.deletedCount;
  }

  // phương thức cho thống kê
  /**
   * @description Đếm số lượng tài liệu dựa trên bộ lọc
   * @param {Object} filter - Bộ lọc MongoDB (ví dụ: {})
   */
  async count(filter = {}) {
    // Sử dụng phương thức countDocuments() của MongoDB driver
    return await this.Sach.countDocuments(filter);
  } /**
   * @description Thực hiện các thao tác tổng hợp (Aggregation Pipeline)
   * @param {Array} pipeline - Mảng các giai đoạn (stages) của Aggregation
   */

  async aggregate(pipeline) {
    // Sử dụng phương thức aggregate() của MongoDB driver
    const cursor = await this.Sach.aggregate(pipeline);
    return await cursor.toArray();
  }
}

module.exports = SachService;
