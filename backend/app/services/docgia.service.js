const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("docgia");
  }

  extractDocGiaData(payload) {
    const docgia = {
      MaDocGia: payload.MaDocGia,
      HoLot: payload.HoLot,
      Ten: payload.Ten,
      NgaySinh: payload.NgaySinh,
      Phai: payload.Phai,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
      Password: payload.Password,
    };

    Object.keys(docgia).forEach(
      (key) => docgia[key] === undefined && delete docgia[key]
    );

    return docgia;
  }

  async create(payload) {
    const docgia = this.extractDocGiaData(payload);
    const result = await this.DocGia.insertOne(docgia);
    return result;
  }

  async find(filter) {
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.DocGia.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findOne(filter) {
    return await this.DocGia.findOne(filter);
  }

  async update(id, payload) {
    let filter;

    if (typeof id === "object") {
      filter = id; // ví dụ { MaDocGia: "DG001" }
    } else {
      filter = {
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      };
    }

    const updateData = this.extractDocGiaData(payload);

    // Nếu có Password thì hash lại
    if (updateData.Password) {
      const salt = await bcrypt.genSalt(10);
      updateData.Password = await bcrypt.hash(updateData.Password, salt);
    }

    const result = await this.DocGia.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result.value;
  }

  async delete(id) {
    const result = await this.DocGia.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.DocGia.deleteMany({});
    return result.deletedCount;
  }

  async count(filter = {}) {
    return await this.DocGia.countDocuments(filter);
  }
}

module.exports = DocGiaService;
