const { ObjectId } = require("mongodb");

// ====== Helper tính số ngày trễ hạn chuẩn (theo UTC, tránh lệch 1 ngày) ======
const MS_PER_DAY = 1000 * 60 * 60 * 24;
function overdueDays(hanTra, now = new Date()) {
  if (!hanTra) return 0;
  const dHan = new Date(hanTra);
  const dNow = new Date(now);

  const utcHan = Date.UTC(
    dHan.getUTCFullYear(),
    dHan.getUTCMonth(),
    dHan.getUTCDate()
  );
  const utcNow = Date.UTC(
    dNow.getUTCFullYear(),
    dNow.getUTCMonth(),
    dNow.getUTCDate()
  );

  const diffDays = Math.floor((utcNow - utcHan) / MS_PER_DAY);
  return diffDays > 0 ? diffDays : 0;
}

class TheoDoiMuonSachService {
  constructor(client) {
    this.TDMS = client.db().collection("theodoimuonsach");
    this.DocGia = client.db().collection("docgia");
    this.Sach = client.db().collection("sach");
  }

  // ========== TẠO MỚI ==========
  async create(payload) {
    const { MaDocGia, ChiTietMuon } = payload;

    const docGia = await this.DocGia.findOne({ MaDocGia });
    if (!docGia) throw new Error("Mã Độc Giả không tồn tại");

    if (!ChiTietMuon || ChiTietMuon.length === 0) {
      throw new Error("Vui lòng chọn sách để mượn.");
    }
    if (ChiTietMuon.length > 3) {
      throw new Error("Mỗi lần mượn tối đa 3 cuốn sách.");
    }

    let tongTien = 0;
    const chiTietMuonMoi = [];

    for (const item of ChiTietMuon) {
      const sach = await this.Sach.findOne({ MaSach: item.MaSach });
      if (!sach) throw new Error(`Sách với Mã ${item.MaSach} không tồn tại`);
      if (sach.SoQuyen <= 0) throw new Error(`Sách '${sach.TenSach}' đã hết.`);

      const giaSach = sach.DonGia || 0;
      tongTien += giaSach;

      chiTietMuonMoi.push({
        MaSach: item.MaSach,
        GiaTien: giaSach,
        TrangThai: "Chưa trả",
      });
    }

    const recordsDangMuon = await this.TDMS.find({
      MaDocGia,
      TrangThai: { $in: ["Chờ duyệt", "Đang mượn", "Trễ hạn"] },
    }).toArray();

    let soCuonDangMuon = 0;
    recordsDangMuon.forEach((rec) => {
      rec.ChiTietMuon.forEach((chiTiet) => {
        if (chiTiet.TrangThai !== "Đã trả") soCuonDangMuon++;
      });
    });

    const tongCuonSauMuon = soCuonDangMuon + ChiTietMuon.length;
    if (tongCuonSauMuon > 3) {
      throw new Error(
        `Mỗi độc giả chỉ được mượn tối đa 3 cuốn sách cùng lúc. Hiện đang mượn ${soCuonDangMuon} cuốn.`
      );
    }

    const hasOverdueBook = recordsDangMuon.some(
      (rec) => rec.TrangThai === "Trễ hạn"
    );
    if (hasOverdueBook)
      throw new Error("Độc giả đang có sách trễ hạn, không thể mượn mới.");

    const doc = {
      MaDocGia,
      ChiTietMuon: chiTietMuonMoi,
      TongTien: tongTien,
      TienPhat: 0,
      NgayMuon: payload.NgayMuon ? new Date(payload.NgayMuon) : new Date(),
      HanTra: payload.HanTra ? new Date(payload.HanTra) : null,
      NgayTra: null,
      TrangThai: "Chờ duyệt",
      NhanVienDuyet: null,
      NhanVienTra: null,
    };

    return await this.TDMS.insertOne(doc);
  }

  // ========== LẤY DANH SÁCH ==========
  async find(filter) {
    const cursor = await this.TDMS.find(filter);
    const records = await cursor.toArray();
    const today = new Date();

    for (let rec of records) {
      let tienPhatHienTai = 0;
      const hanTra = rec.HanTra ? new Date(rec.HanTra) : null;

      // --- Cập nhật trạng thái nếu trễ hạn ---
      if (rec.TrangThai === "Đang mượn" && hanTra && new Date(hanTra) < today) {
        rec.TrangThai = "Trễ hạn";
        await this.TDMS.updateOne(
          { _id: rec._id },
          { $set: { TrangThai: "Trễ hạn" } }
        );
      }

      // --- Tính tiền phạt & tổng thanh toán ---
      if (rec.TrangThai === "Trễ hạn") {
        const soNgayTre = overdueDays(hanTra, today);
        tienPhatHienTai = soNgayTre * 10000 * (rec.ChiTietMuon?.length || 1);

        rec.TienPhatTamThoi = tienPhatHienTai;
        rec.TongThanhToan = rec.TongTien + tienPhatHienTai;
      } else if (rec.TrangThai === "Đã trả") {
        rec.TienPhatTamThoi = rec.TienPhat || 0;
        rec.TongThanhToan = (rec.TongTien || 0) + rec.TienPhatTamThoi;
      } else {
        rec.TienPhatTamThoi = 0;
        rec.TongThanhToan = rec.TongTien;
      }
    }

    return records;
  }

  // ========== LẤY THEO ID ==========
  async findById(id) {
    return await this.TDMS.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // ========== CẬP NHẬT ==========
  async update(id, payload) {
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;
    if (!objectId) return null;

    const doc = await this.TDMS.findOne({ _id: objectId });
    if (!doc) return null;

    let updateData = {};

    // --- Duyệt phiếu mượn ---
    if (payload.TrangThai === "Đang mượn" && doc.TrangThai === "Chờ duyệt") {
      const uniqueMaSach = new Set(doc.ChiTietMuon.map((i) => i.MaSach));

      for (const maSach of uniqueMaSach) {
        const sach = await this.Sach.findOne({ MaSach: maSach });
        if (!sach || sach.SoQuyen <= 0)
          throw new Error(`Sách '${maSach}' đã hết, không thể duyệt.`);
        await this.Sach.updateOne(
          { MaSach: maSach },
          { $inc: { SoQuyen: -1 } }
        );
      }

      const ngayMuon = payload.NgayMuon
        ? new Date(payload.NgayMuon)
        : new Date();
      let hanTra = payload.HanTra
        ? new Date(payload.HanTra)
        : new Date(ngayMuon);
      if (!payload.HanTra) hanTra.setDate(ngayMuon.getDate() + 7);

      updateData = {
        TrangThai: "Đang mượn",
        NgayMuon: ngayMuon,
        HanTra: hanTra,
        NhanVienDuyet: payload.MSNV || null,
      };
    }

    // --- Trả sách ---
    else if (payload.TrangThai === "Đã trả" && doc.TrangThai !== "Đã trả") {
      const today = new Date();
      const hanTra = new Date(doc.HanTra);
      const soNgayTre = overdueDays(hanTra, today);
      const tienPhat = soNgayTre * 10000 * (doc.ChiTietMuon?.length || 1);
      const tongTienCuoiCung = (doc.TongTien || 0) + tienPhat;

      const uniqueMaSach = new Set(doc.ChiTietMuon.map((i) => i.MaSach));
      for (const maSach of uniqueMaSach) {
        await this.Sach.updateOne(
          { MaSach: maSach },
          { $inc: { SoQuyen: +1 } }
        );
      }

      const chiTietMuonTra = doc.ChiTietMuon.map((i) => ({
        ...i,
        TrangThai: "Đã trả",
      }));

      updateData = {
        TrangThai: "Đã trả",
        NgayTra: payload.NgayTra ? new Date(payload.NgayTra) : new Date(),
        NhanVienTra: payload.MSNV || null,
        TienPhat: tienPhat,
        TongTienCuoi: tongTienCuoiCung,
        ChiTietMuon: chiTietMuonTra,
      };
    }

    // --- Cập nhật thông tin chung ---
    else {
      updateData = {
        ...(payload.MaDocGia && { MaDocGia: payload.MaDocGia }),
        ...(payload.NgayMuon && { NgayMuon: new Date(payload.NgayMuon) }),
        ...(payload.NgayTra && { NgayTra: new Date(payload.NgayTra) }),
        ...(payload.HanTra && { HanTra: new Date(payload.HanTra) }),
        ...(payload.TrangThai && { TrangThai: payload.TrangThai }),
        ...(payload.ChiTietMuon && { ChiTietMuon: payload.ChiTietMuon }),
      };
    }

    if (updateData.MaSach) delete updateData.MaSach;

    const result = await this.TDMS.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result.value || result;
  }

  // ========== XÓA ==========
  async delete(id) {
    return await this.TDMS.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
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
