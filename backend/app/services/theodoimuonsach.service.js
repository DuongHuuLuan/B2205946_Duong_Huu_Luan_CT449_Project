// const { ObjectId } = require("mongodb");

// // ====== Helper tính số ngày trễ hạn chuẩn (theo UTC, tránh lệch 1 ngày) ======
// const MS_PER_DAY = 1000 * 60 * 60 * 24;
// function overdueDays(hanTra, now = new Date()) {
//   if (!hanTra) return 0;
//   const dHan = new Date(hanTra);
//   const dNow = new Date(now);

//   const utcHan = Date.UTC(
//     dHan.getUTCFullYear(),
//     dHan.getUTCMonth(),
//     dHan.getUTCDate()
//   );
//   const utcNow = Date.UTC(
//     dNow.getUTCFullYear(),
//     dNow.getUTCMonth(),
//     dNow.getUTCDate()
//   );

//   const diffDays = Math.floor((utcNow - utcHan) / MS_PER_DAY);
//   return diffDays > 0 ? diffDays : 0;
// }

// class TheoDoiMuonSachService {
//   constructor(client) {
//     this.TDMS = client.db().collection("theodoimuonsach");
//     this.DocGia = client.db().collection("docgia");
//     this.Sach = client.db().collection("sach");
//   }

//   // ========== TẠO MỚI ==========
//   async create(payload) {
//     const { MaDocGia, ChiTietMuon } = payload;

//     const docGia = await this.DocGia.findOne({ MaDocGia });
//     if (!docGia) throw new Error("Mã Độc Giả không tồn tại");

//     if (!ChiTietMuon || ChiTietMuon.length === 0) {
//       throw new Error("Vui lòng chọn sách để mượn.");
//     }
//     if (ChiTietMuon.length > 3) {
//       throw new Error("Mỗi lần mượn tối đa 3 cuốn sách.");
//     }

//     let tongTien = 0;
//     const chiTietMuonMoi = [];

//     for (const item of ChiTietMuon) {
//       const sach = await this.Sach.findOne({ MaSach: item.MaSach });
//       if (!sach) throw new Error(`Sách với Mã ${item.MaSach} không tồn tại`);
//       if (sach.SoQuyen <= 0) throw new Error(`Sách '${sach.TenSach}' đã hết.`);

//       const giaSach = sach.DonGia || 0;
//       tongTien += giaSach;

//       chiTietMuonMoi.push({
//         MaSach: item.MaSach,
//         GiaTien: giaSach,
//         TrangThai: "Chưa trả",
//       });
//     }

//     const recordsDangMuon = await this.TDMS.find({
//       MaDocGia,
//       TrangThai: { $in: ["Chờ duyệt", "Đang mượn", "Trễ hạn"] },
//     }).toArray();

//     let soCuonDangMuon = 0;
//     recordsDangMuon.forEach((rec) => {
//       rec.ChiTietMuon.forEach((chiTiet) => {
//         if (chiTiet.TrangThai !== "Đã trả") soCuonDangMuon++;
//       });
//     });

//     const tongCuonSauMuon = soCuonDangMuon + ChiTietMuon.length;
//     if (tongCuonSauMuon > 3) {
//       throw new Error(
//         `Mỗi độc giả chỉ được mượn tối đa 3 cuốn sách cùng lúc. Hiện đang mượn ${soCuonDangMuon} cuốn.`
//       );
//     }

//     const hasOverdueBook = recordsDangMuon.some(
//       (rec) => rec.TrangThai === "Trễ hạn"
//     );
//     if (hasOverdueBook)
//       throw new Error("Độc giả đang có sách trễ hạn, không thể mượn mới.");

//     const doc = {
//       MaDocGia,
//       ChiTietMuon: chiTietMuonMoi,
//       TongTien: tongTien,
//       TienPhat: 0,
//       NgayMuon: payload.NgayMuon ? new Date(payload.NgayMuon) : new Date(),
//       HanTra: payload.HanTra ? new Date(payload.HanTra) : null,
//       NgayTra: null,
//       TrangThai: "Chờ duyệt",
//       NhanVienDuyet: null,
//       NhanVienTra: null,
//     };

//     return await this.TDMS.insertOne(doc);
//   }

//   // ========== LẤY DANH SÁCH ==========
//   async find(filter) {
//     const cursor = await this.TDMS.find(filter);
//     const records = await cursor.toArray();
//     const today = new Date();

//     for (let rec of records) {
//       let tienPhatHienTai = 0;
//       const hanTra = rec.HanTra ? new Date(rec.HanTra) : null;

//       // --- Cập nhật trạng thái nếu trễ hạn ---
//       if (rec.TrangThai === "Đang mượn" && hanTra && new Date(hanTra) < today) {
//         rec.TrangThai = "Trễ hạn";
//         await this.TDMS.updateOne(
//           { _id: rec._id },
//           { $set: { TrangThai: "Trễ hạn" } }
//         );
//       }

//       // --- Tính tiền phạt & tổng thanh toán ---
//       if (rec.TrangThai === "Trễ hạn") {
//         const soNgayTre = overdueDays(hanTra, today);
//         tienPhatHienTai = soNgayTre * 10000 * (rec.ChiTietMuon?.length || 1);

//         rec.TienPhatTamThoi = tienPhatHienTai;
//         rec.TongThanhToan = rec.TongTien + tienPhatHienTai;
//       } else if (rec.TrangThai === "Đã trả") {
//         rec.TienPhatTamThoi = rec.TienPhat || 0;
//         rec.TongThanhToan = (rec.TongTien || 0) + rec.TienPhatTamThoi;
//       } else {
//         rec.TienPhatTamThoi = 0;
//         rec.TongThanhToan = rec.TongTien;
//       }
//     }

//     return records;
//   }

//   // ========== LẤY THEO ID ==========
//   async findById(id) {
//     return await this.TDMS.findOne({
//       _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
//     });
//   }

//   // ========== CẬP NHẬT ==========
//   async update(id, payload) {
//     const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;
//     if (!objectId) return null;

//     const doc = await this.TDMS.findOne({ _id: objectId });
//     if (!doc) return null;

//     let updateData = {};

//     // --- Duyệt phiếu mượn ---
//     if (payload.TrangThai === "Đang mượn" && doc.TrangThai === "Chờ duyệt") {
//       const uniqueMaSach = new Set(doc.ChiTietMuon.map((i) => i.MaSach));

//       for (const maSach of uniqueMaSach) {
//         const sach = await this.Sach.findOne({ MaSach: maSach });
//         if (!sach || sach.SoQuyen <= 0)
//           throw new Error(`Sách '${maSach}' đã hết, không thể duyệt.`);
//         await this.Sach.updateOne(
//           { MaSach: maSach },
//           { $inc: { SoQuyen: -1 } }
//         );
//       }

//       const ngayMuon = payload.NgayMuon
//         ? new Date(payload.NgayMuon)
//         : new Date();
//       let hanTra = payload.HanTra
//         ? new Date(payload.HanTra)
//         : new Date(ngayMuon);
//       if (!payload.HanTra) hanTra.setDate(ngayMuon.getDate() + 7);

//       updateData = {
//         TrangThai: "Đang mượn",
//         NgayMuon: ngayMuon,
//         HanTra: hanTra,
//         NhanVienDuyet: payload.MSNV || null,
//       };
//     }

//     // --- Trả sách ---
//     else if (payload.TrangThai === "Đã trả" && doc.TrangThai !== "Đã trả") {
//       const today = new Date();
//       const hanTra = new Date(doc.HanTra);
//       const soNgayTre = overdueDays(hanTra, today);
//       const tienPhat = soNgayTre * 10000 * (doc.ChiTietMuon?.length || 1);
//       const tongTienCuoiCung = (doc.TongTien || 0) + tienPhat;

//       const uniqueMaSach = new Set(doc.ChiTietMuon.map((i) => i.MaSach));
//       for (const maSach of uniqueMaSach) {
//         await this.Sach.updateOne(
//           { MaSach: maSach },
//           { $inc: { SoQuyen: +1 } }
//         );
//       }

//       const chiTietMuonTra = doc.ChiTietMuon.map((i) => ({
//         ...i,
//         TrangThai: "Đã trả",
//       }));

//       updateData = {
//         TrangThai: "Đã trả",
//         NgayTra: payload.NgayTra ? new Date(payload.NgayTra) : new Date(),
//         NhanVienTra: payload.MSNV || null,
//         TienPhat: tienPhat,
//         TongTienCuoi: tongTienCuoiCung,
//         ChiTietMuon: chiTietMuonTra,
//       };
//     }

//     // --- Cập nhật thông tin chung ---
//     else {
//       updateData = {
//         ...(payload.MaDocGia && { MaDocGia: payload.MaDocGia }),
//         ...(payload.NgayMuon && { NgayMuon: new Date(payload.NgayMuon) }),
//         ...(payload.NgayTra && { NgayTra: new Date(payload.NgayTra) }),
//         ...(payload.HanTra && { HanTra: new Date(payload.HanTra) }),
//         ...(payload.TrangThai && { TrangThai: payload.TrangThai }),
//         ...(payload.ChiTietMuon && { ChiTietMuon: payload.ChiTietMuon }),
//       };
//     }

//     if (updateData.MaSach) delete updateData.MaSach;

//     const result = await this.TDMS.findOneAndUpdate(
//       { _id: objectId },
//       { $set: updateData },
//       { returnDocument: "after" }
//     );

//     return result.value || result;
//   }

//   // ========== XÓA ==========
//   async delete(id) {
//     return await this.TDMS.findOneAndDelete({
//       _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
//     });
//   }

//   async deleteAll() {
//     const result = await this.TDMS.deleteMany({});
//     return result.deletedCount;
//   }

//   async count(filter = {}) {
//     return await this.TDMS.countDocuments(filter);
//   }

//   async aggregate(pipeline) {
//     const cursor = await this.TDMS.aggregate(pipeline);
//     return await cursor.toArray();
//   }
// }

// module.exports = TheoDoiMuonSachService;

// services/theodoimuonsach.service.js
// services/theodoimuonsach.service.js
const { ObjectId } = require("mongodb");

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

  // ==================== TẠO PHIẾU MƯỢN ====================
  async create(payload) {
    const { MaDocGia, ChiTietMuon, NgayMuon, HanTra, TongTien } = payload;

    const docGia = await this.DocGia.findOne({ MaDocGia });
    if (!docGia) throw new Error("Mã độc giả không tồn tại");

    if (!Array.isArray(ChiTietMuon) || ChiTietMuon.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một sách");
    }

    let tongTienTinh = 0;
    let tongSoCuon = 0;
    const chiTietChuan = [];

    for (const item of ChiTietMuon) {
      const maSach = item.MaSach?.trim();
      const soLuong = Number(item.SoLuong) || 1;

      if (!maSach || soLuong < 1) throw new Error("Dữ liệu sách không hợp lệ");

      const sach = await this.Sach.findOne({ MaSach: maSach });
      if (!sach) throw new Error(`Không tìm thấy sách mã ${maSach}`);
      if ((sach.SoQuyen || 0) < soLuong) {
        throw new Error(
          `Sách "${sach.TenSach}" chỉ còn ${sach.SoQuyen || 0} cuốn`
        );
      }

      const giaTien = Number(sach.DonGia) || 0;
      tongTienTinh += giaTien * soLuong;
      tongSoCuon += soLuong;

      chiTietChuan.push({
        MaSach: maSach,
        SoLuong: soLuong,
        GiaTien: giaTien,
        TrangThai: "Chưa trả",
      });
    }

    // Kiểm tra giới hạn 3 cuốn
    const dangMuon = await this.TDMS.find({
      MaDocGia,
      TrangThai: { $in: ["Chờ duyệt", "Đang mượn", "Trễ hạn"] },
    }).toArray();

    let soCuonHienTai = 0;
    for (const rec of dangMuon) {
      for (const ct of rec.ChiTietMuon || []) {
        if (ct.TrangThai !== "Đã trả") soCuonHienTai += ct.SoLuong || 1;
      }
    }

    if (soCuonHienTai + tongSoCuon > 3) {
      throw new Error(
        `Chỉ được mượn tối đa 3 cuốn. Hiện đang mượn ${soCuonHienTai} cuốn`
      );
    }

    if (dangMuon.some((r) => r.TrangThai === "Trễ hạn")) {
      throw new Error("Bạn đang có sách trễ hạn, không thể mượn thêm");
    }

    const doc = {
      MaDocGia,
      ChiTietMuon: chiTietChuan,
      TongTien: TongTien != null ? TongTien : tongTienTinh,
      TienPhat: 0,
      TongThanhToan: TongTien != null ? TongTien : tongTienTinh,
      NgayMuon: NgayMuon ? new Date(NgayMuon) : new Date(),
      HanTra: HanTra
        ? new Date(HanTra)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      NgayTra: null,
      TrangThai: "Chờ duyệt",
      NhanVienDuyet: null,
      NhanVienTra: null,
    };

    const result = await this.TDMS.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  // ==================== LẤY DANH SÁCH (TỰ ĐỘNG CẬP NHẬT + LƯU PHẠT) ====================
  async find(filter = {}) {
    const cursor = await this.TDMS.find(filter);
    let records = await cursor.toArray();
    const today = new Date();

    for (let rec of records) {
      const hanTra = rec.HanTra ? new Date(rec.HanTra) : null;
      const soCuon = (rec.ChiTietMuon || []).reduce(
        (s, ct) => s + (ct.SoLuong || 1),
        0
      );
      const ngayTre = overdueDays(hanTra, today);
      const tienPhat = ngayTre > 0 ? ngayTre * 10000 * soCuon : 0;
      const tongThanhToan = (rec.TongTien || 0) + tienPhat;

      let needUpdate = false;
      const updateFields = {};

      if (
        ngayTre > 0 &&
        rec.TrangThai !== "Trễ hạn" &&
        rec.TrangThai !== "Đã trả"
      ) {
        updateFields.TrangThai = "Trễ hạn";
        needUpdate = true;
      }
      if ((rec.TienPhat || 0) !== tienPhat) {
        updateFields.TienPhat = tienPhat;
        updateFields.TongThanhToan = tongThanhToan;
        needUpdate = true;
      }

      if (needUpdate) {
        await this.TDMS.updateOne({ _id: rec._id }, { $set: updateFields });
        Object.assign(rec, updateFields);
      }

      // Đảm bảo luôn có field
      rec.TienPhat = rec.TienPhat || 0;
      rec.TongThanhToan = rec.TongThanhToan || rec.TongTien || 0;
    }

    return records;
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return await this.TDMS.findOne({ _id: new ObjectId(id) });
  }

  // ==================== CẬP NHẬT (HOÀN HẢO) ====================
  async update(id, payload) {
    if (!ObjectId.isValid(id)) return null;
    const _id = new ObjectId(id);
    const doc = await this.TDMS.findOne({ _id });
    if (!doc) return null;

    let updateData = {};

    // Luôn cho phép sửa ngày + trạng thái thủ công
    if (payload.NgayMuon !== undefined)
      updateData.NgayMuon = new Date(payload.NgayMuon);
    if (payload.HanTra !== undefined)
      updateData.HanTra = new Date(payload.HanTra);
    if (
      payload.TrangThai &&
      !["Đang mượn", "Đã trả"].includes(payload.TrangThai)
    ) {
      updateData.TrangThai = payload.TrangThai;
    }

    // Duyệt mượn
    if (payload.TrangThai === "Đang mượn" && doc.TrangThai === "Chờ duyệt") {
      for (const item of doc.ChiTietMuon) {
        const soLuong = item.SoLuong || 1;
        await this.Sach.updateOne(
          { MaSach: item.MaSach },
          { $inc: { SoQuyen: -soLuong } }
        );
      }
      updateData = {
        TrangThai: "Đang mượn",
        NgayMuon: payload.NgayMuon ? new Date(payload.NgayMuon) : new Date(),
        HanTra: payload.HanTra
          ? new Date(payload.HanTra)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        NhanVienDuyet: payload.MSNV || null,
      };
    }
    // Trả sách
    else if (payload.TrangThai === "Đã trả" && doc.TrangThai !== "Đã trả") {
      const today = new Date();
      const hanTra = doc.HanTra ? new Date(doc.HanTra) : today;
      const ngayTre = overdueDays(hanTra, today);
      const soCuon = (doc.ChiTietMuon || []).reduce(
        (s, ct) => s + (ct.SoLuong || 1),
        0
      );
      const tienPhat = ngayTre * 10000 * soCuon;

      for (const item of doc.ChiTietMuon) {
        await this.Sach.updateOne(
          { MaSach: item.MaSach },
          { $inc: { SoQuyen: +(item.SoLuong || 1) } }
        );
      }

      updateData = {
        TrangThai: "Đã trả",
        NgayTra: payload.NgayTra ? new Date(payload.NgayTra) : today,
        NhanVienTra: payload.MSNV || null,
        TienPhat: tienPhat,
        TongThanhToan: (doc.TongTien || 0) + tienPhat,
        ChiTietMuon: doc.ChiTietMuon.map((ct) => ({
          ...ct,
          TrangThai: "Đã trả",
        })),
      };
    }

    if (Object.keys(updateData).length === 0) return doc;

    await this.TDMS.updateOne({ _id }, { $set: updateData });
    return await this.TDMS.findOne({ _id });
  }

  async aggregate(pipeline = []) {
    if (!Array.isArray(pipeline)) pipeline = [];
    const cursor = await this.TDMS.aggregate(pipeline);
    return await cursor.toArray();
  }

  async count(filter = {}) {
    if (!filter || typeof filter !== "object") filter = {};
    return await this.TDMS.countDocuments(filter);
  }

  async delete(id) {
    if (!ObjectId.isValid(id)) return null;
    return await this.TDMS.findOneAndDelete({ _id: new ObjectId(id) });
  }

  async deleteAll() {
    const result = await this.TDMS.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = TheoDoiMuonSachService;
