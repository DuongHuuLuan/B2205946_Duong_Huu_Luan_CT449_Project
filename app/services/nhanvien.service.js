const { ObjectId } = require("mongodb");
const ALLOWED_ROLES = ["Admin", "QuanLy", "ThuThu", "HoTro"];
class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
  }

  // Thêm nhân viên
  async create(payload) {
    if (!ALLOWED_ROLES.includes(payload.ChucVu)) {
      throw new Error("Chức vụ không hợp lệ");
    }
    const nv = {
      MSNV: payload.MSNV,
      HoTenNV: payload.HoTenNV,
      Password: payload.Password,
      ChucVu: payload.ChucVu,
      DiaChi: payload.DiaChi,
      SoDienThoai: payload.SoDienThoai,
    };
    return await this.NhanVien.insertOne(nv);
  }

  // Lấy tất cả (có filter hoặc rỗng)
  async find(filter = {}) {
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }

  // Tìm theo id
  async findById(id) {
    return await this.NhanVien.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Tìm theo MSNV (để đăng nhập / đăng ký)
  async findByMSNV(msnv) {
    return await this.NhanVien.findOne({ MSNV: msnv });
  }

  // Cập nhật
  async update(id, payload) {
    const update = {
      $set: {
        MSNV: payload.MSNV,
        HoTenNV: payload.HoTenNV,
        ChucVu: payload.ChucVu,
        DiaChi: payload.DiaChi,
        SoDienThoai: payload.SoDienThoai,
      },
    };

    // Nếu có password mới thì update
    if (payload.Password) {
      update.$set.Password = payload.Password;
    }

    return await this.NhanVien.findOneAndUpdate(
      { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
      update,
      { returnDocument: "after" }
    );
  }

  // Xóa 1 nhân viên
  async delete(id) {
    return await this.NhanVien.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Xóa tất cả
  async deleteAll() {
    const result = await this.NhanVien.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = NhanVienService;
