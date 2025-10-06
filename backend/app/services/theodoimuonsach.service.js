const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.TDMS = client.db().collection("theodoimuonsach");
    this.DocGia = client.db().collection("docgia");
    this.Sach = client.db().collection("sach");
  }

  async create(payload) {
    const { MaDocGia, ChiTietMuon } = payload;

    // 1. Kiểm tra Độc Giả và giới hạn số lượng sách mượn
    const docGia = await this.DocGia.findOne({ MaDocGia });
    if (!docGia) throw new Error("Mã Độc Giả không tồn tại");

    if (!ChiTietMuon || ChiTietMuon.length === 0) {
      throw new Error("Vui lòng chọn sách để mượn.");
    }
    if (ChiTietMuon.length > 3) {
      throw new Error("Mỗi lần mượn tối đa 3 cuốn sách.");
    }

    // 2. Kiểm tra sách, số lượng tồn kho và tính Tổng Tiền
    let tongTien = 0;
    const chiTietMuonMoi = [];

    for (const item of ChiTietMuon) {
      const sach = await this.Sach.findOne({ MaSach: item.MaSach });

      if (!sach) throw new Error(`Sách với Mã ${item.MaSach} không tồn tại`);
      if (sach.SoQuyen <= 0) throw new Error(`Sách '${sach.TenSach}' đã hết.`);

      // FIX 1: Lấy giá sách từ trường DonGia (theo dữ liệu mẫu bạn cung cấp)
      const giaSach = sach.DonGia || 0;
      tongTien += giaSach;

      chiTietMuonMoi.push({
        MaSach: item.MaSach,
        GiaTien: giaSach, // FIX 1: Lưu giá trị DonGia/GiaSach vào GiaTien (khắc phục lỗi 'N/A')
        TrangThai: "Chưa trả",
      });
    }

    // 3. Kiểm tra giới hạn mượn (đếm tổng số cuốn sách đang mượn)
    const recordsDangMuon = await this.TDMS.find({
      MaDocGia: MaDocGia,
      TrangThai: { $in: ["Chờ duyệt", "Đang mượn", "Trễ hạn"] },
    }).toArray();

    let soCuonDangMuon = 0;
    recordsDangMuon.forEach((rec) => {
      // Chỉ đếm những cuốn sách chưa trả trong ChiTietMuon
      rec.ChiTietMuon.forEach((chiTiet) => {
        if (chiTiet.TrangThai !== "Đã trả") {
          soCuonDangMuon++;
        }
      });
    });

    // Cộng thêm số cuốn đang mượn trong đơn hàng mới
    const tongCuonSauMuon = soCuonDangMuon + ChiTietMuon.length;

    if (tongCuonSauMuon > 3) {
      // Giới hạn tổng số cuốn đang mượn là 3
      throw new Error(
        `Mỗi độc giả chỉ được mượn tối đa 3 cuốn sách cùng lúc. Hiện tại đang mượn ${soCuonDangMuon} cuốn, không thể mượn thêm ${ChiTietMuon.length} cuốn.`
      );
    }

    // 4. Kiểm tra Trễ hạn (logic cấm mượn mới)
    const hasOverdueBook = recordsDangMuon.some(
      (rec) => rec.TrangThai === "Trễ hạn"
    );
    if (hasOverdueBook) {
      throw new Error("Độc giả đang có sách trễ hạn và bị cấm mượn sách mới.");
    }

    // 5. Tạo tài liệu mới
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

    const result = await this.TDMS.insertOne(doc);
    return result;
  }

  async find(filter) {
    const cursor = await this.TDMS.find(filter);
    const records = await cursor.toArray();

    const today = new Date();

    for (let rec of records) {
      let tienPhatHienTai = 0;

      // 1. Kiểm tra và Cập nhật trạng thái Trễ hạn (đã sửa lỗi rec.TrangThai = trangThaiMoi)
      if (
        rec.TrangThai === "Đang mượn" &&
        rec.HanTra &&
        new Date(rec.HanTra) < today
      ) {
        rec.TrangThai = "Trễ hạn"; // Cập nhật trạng thái cho đối tượng trả về

        await this.TDMS.updateOne(
          { _id: rec._id },
          { $set: { TrangThai: "Trễ hạn" } } // Cập nhật vào DB
        );
      }

      // 2. Tính toán tiền phạt tạm thời (chỉ cho Trễ hạn) và Tổng Thanh toán

      // PHẢI KHAI BÁO BIẾN hanTra ở đây để sử dụng trong khối if tiếp theo.
      const hanTra = rec.HanTra ? new Date(rec.HanTra) : null;

      if (rec.TrangThai === "Trễ hạn") {
        // LỖI CÚ PHÁP ĐÃ ĐƯỢC KHẮC PHỤC (10000 -> 1000 * 60 * 60 * 24)
        // LỖI CÚ PHÁP ĐÃ ĐƯỢC KHẮC PHỤC (new Date() - hanTra)
        const soNgayTre = Math.ceil((today - hanTra) / (1000 * 60 * 60 * 24));

        // Phạt 10000 VND/ngày/cuốn (Hằng số phạt 10000 được lấy từ code bạn cung cấp)
        tienPhatHienTai = soNgayTre * 10000 * rec.ChiTietMuon.length;
        if (tienPhatHienTai < 0) tienPhatHienTai = 0;

        // Gán tiền phạt tạm thời vào đối tượng trả về
        rec.TienPhatTamThoi = tienPhatHienTai;

        // Gán tổng thanh toán tạm thời
        rec.TongThanhToan = rec.TongTien + tienPhatHienTai;
      } else if (rec.TrangThai === "Đã trả") {
        if (rec.TongTienCuoi !== undefined) {
          rec.TongThanhToan = rec.TongTienCuoi;
        } else {
          // Nếu đã trả rồi, dùng TienPhat và TongTien đã lưu trong DB
          rec.TienPhatTamThoi = rec.TienPhat || 0;
          rec.TongThanhToan = rec.TongTien + rec.TienPhatTamThoi;
        }
      } else {
        // Nếu là "Chờ duyệt" hoặc "Đang mượn" (chưa trễ hạn)
        rec.TienPhatTamThoi = 0;
        rec.TongThanhToan = rec.TongTien;
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
      // Dùng Set để chỉ cập nhật một lần cho mỗi MaSach duy nhất
      const uniqueMaSach = new Set(doc.ChiTietMuon.map((item) => item.MaSach));

      for (const maSach of uniqueMaSach) {
        const sach = await this.Sach.findOne({ MaSach: maSach });

        if (!sach || sach.SoQuyen <= 0) {
          throw new Error(`Sách có Mã '${maSach}' đã hết, không thể duyệt.`);
        }

        // FIX 2: Giảm số lượng tồn kho cho sách
        await this.Sach.updateOne(
          { MaSach: maSach },
          { $inc: { SoQuyen: -1 } }
        );
      }

      // Cập nhật thông tin phiếu mượn
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
      let tienPhat = 0;
      let tongTienCuoiCung = doc.TongTien || 0;
      if (doc.TrangThai === "Trễ hạn") {
        const today = new Date();
        const hanTra = new Date(doc.HanTra); // >> ĐÃ SỬA LỖI: 10000 ĐƯỢC THAY BẰNG 1000

        const soNgayTre = Math.ceil((today - hanTra) / (1000 * 60 * 60 * 24)); // Ví dụ: Phạt 10000 VNĐ/ngày/cuốn (Mức phạt đã đồng nhất)

        tienPhat = soNgayTre * 10000 * doc.ChiTietMuon.length;

        if (tienPhat < 0) tienPhat = 0;
      }
      tongTienCuoiCung = (doc.TongTien || 0) + tienPhat;

      // Cập nhật số lượng tồn kho cho TỪNG cuốn sách
      // Dùng Set để chỉ tăng tồn kho một lần cho mỗi MaSach duy nhất
      const uniqueMaSach = new Set(doc.ChiTietMuon.map((item) => item.MaSach));

      for (const maSach of uniqueMaSach) {
        // FIX 2: Tăng số lượng tồn kho
        await this.Sach.updateOne(
          { MaSach: maSach },
          { $inc: { SoQuyen: +1 } } // Tăng số lượng tồn kho
        );
      }

      // Gán trạng thái "Đã trả" cho tất cả chi tiết mượn (nếu cần)
      const chiTietMuonTra = doc.ChiTietMuon.map((item) => ({
        ...item,
        TrangThai: "Đã trả",
      }));

      updateData = {
        TrangThai: "Đã trả",
        NgayTra: payload.NgayTra ? new Date(payload.NgayTra) : new Date(),
        NhanVienTra: payload.MSNV || null,
        TienPhat: tienPhat,
        TongTienCuoi: tongTienCuoiCung,
        ChiTietMuon: chiTietMuonTra, // Cập nhật ChiTietMuon về trạng thái Đã trả
      };
    }

    // Nếu chỉ update thông tin khác (không đổi trạng thái)
    else {
      // Khi cập nhật các trường khác, cần đảm bảo ChiTietMuon cũng được update
      updateData = {
        ...(payload.MaDocGia && { MaDocGia: payload.MaDocGia }),
        ...(payload.NgayMuon && { NgayMuon: new Date(payload.NgayMuon) }),
        ...(payload.NgayTra && { NgayTra: new Date(payload.NgayTra) }),
        ...(payload.HanTra && { HanTra: new Date(payload.HanTra) }),
        ...(payload.TrangThai && { TrangThai: payload.TrangThai }),
        // Cần đảm bảo ChiTietMuon được cập nhật khi người dùng thêm/xóa sách
        ...(payload.ChiTietMuon && { ChiTietMuon: payload.ChiTietMuon }),
      };
    }

    // Loại bỏ MaSach cũ (nếu có trong payload)
    if (updateData.MaSach) delete updateData.MaSach;

    // Cập nhật vào DB
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
