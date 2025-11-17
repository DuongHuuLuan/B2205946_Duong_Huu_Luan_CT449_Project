const ApiError = require("../api-error");
const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.Ten) return next(new ApiError(400, "Tên không được trống"));
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.create(req.body);
    res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo Độc giả mới"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const db = MongoDB.client.db();
    const docGiaCollection = db.collection("docgia");

    const documents = await docGiaCollection
      .aggregate([
        {
          $lookup: {
            from: "theodoimuonsach",
            let: { maDocGia: "$MaDocGia" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$MaDocGia", "$$maDocGia"] },
                  $or: [{ NgayTra: null }, { NgayTra: { $exists: false } }],
                },
              },
            ],
            as: "borrowInfo",
          },
        },
        { $addFields: { hasBorrowed: { $gt: [{ $size: "$borrowInfo" }, 0] } } },
        { $project: { borrowInfo: 0, Password: 0 } },
      ])
      .toArray();

    res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách Độc Giả"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Không tìm thấy Độc giả"));

    const { Password, ...userWithoutPassword } = document;
    res.send(userWithoutPassword);
  } catch (error) {
    return next(new ApiError(500, `Lỗi truy xuất Độc giả id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  try {
    console.log("controller.update called, params.id =", req.params.id);
    console.log("body keys:", Object.keys(req.body || {}));
    console.log("body:", req.body);
  } catch (e) {}

  if (!Object.keys(req.body || {}).length)
    return next(new ApiError(400, "Dữ liệu cập nhật không được trống"));

  try {
    const docGiaService = new DocGiaService(MongoDB.client);

    // Thực hiện cập nhật (service sẽ xử lý id hoặc MaDocGia)
    const updated = await docGiaService.update(req.params.id, req.body);

    console.log(">> update result:", updated);

    if (!updated) {
      // Không có document trả về từ update. Có thể do:
      // - không tìm thấy document (404)
      // - hoặc payload chỉ chứa giá trị giống hệt (không thay đổi)
      // Hãy kiểm tra bản ghi gốc để phân biệt
      const existingById = await docGiaService
        .findById(req.params.id)
        .catch(() => null);
      const existingByMa = !existingById
        ? await docGiaService
            .findOne({ MaDocGia: req.params.id })
            .catch(() => null)
        : null;
      const existing = existingById || existingByMa;

      if (!existing) {
        return next(new ApiError(404, "Không tìm thấy Độc giả"));
      }

      // existing tồn tại -> kiểm tra xem payload có thực sự tạo khác biệt không
      const payload = { ...req.body };
      // loại bỏ các field không cho phép so sánh (ví dụ MaDocGia)
      delete payload.MaDocGia;
      delete payload.Password; // password thường bị xử lý riêng, bỏ qua khi so sánh

      // so sánh từng field trong payload với existing
      let hasDiff = false;
      for (const k of Object.keys(payload)) {
        const newVal = payload[k];
        const oldVal = existing[k];

        // chuẩn hoá ngày (nếu là string YYYY-MM-DD)
        const normalize = (v) => {
          if (v === undefined || v === null) return "";
          if (typeof v === "string") return v.trim();
          if (v instanceof Date) return v.toISOString();
          return String(v);
        };

        if (normalize(newVal) !== normalize(oldVal)) {
          hasDiff = true;
          break;
        }
      }

      if (!hasDiff) {
        return res.status(200).json({
          message:
            "Không có thay đổi (các trường gửi lên giống với dữ liệu hiện có).",
          doc: existing,
        });
      }
      return next(new ApiError(500, "Không thể cập nhật. Vui lòng thử lại."));
    }

    return res.json({
      message: "Cập nhật thành công",
      doc: updated,
    });
  } catch (error) {
    console.error("update controller ERROR:", error);
    return next(new ApiError(500, `Lỗi cập nhật Độc giả id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const docGia = await docGiaService.findById(req.params.id);
    if (!docGia) return next(new ApiError(404, "Không tìm thấy Độc giả"));

    const muonCollection = MongoDB.client.db().collection("theodoimuonsach");
    const hasBorrowed = await muonCollection.findOne({
      MaDocGia: docGia.MaDocGia,
      $or: [{ NgayTra: null }, { NgayTra: { $exists: false } }],
    });
    if (hasBorrowed) return next(new ApiError(400, "Độc giả đang mượn sách"));

    await docGiaService.delete(req.params.id);
    res.send({ message: "Xóa thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi xóa Độc giả id=${req.params.id}`));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const deletedCount = await docGiaService.deleteAll();
    res.send({ message: `${deletedCount} Độc giả đã được xóa thành công` });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả Độc giả"));
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const docGia = await docGiaService.findOne({ MaDocGia: req.user.MaDocGia });
    if (!docGia) return next(new ApiError(404, "Không tìm thấy Độc giả"));

    const { Password, ...userWithoutPassword } = docGia;
    res.send(userWithoutPassword);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi lấy thông tin profile"));
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    console.log(">>> updateProfile called");
    console.log("USER:", req.user);
    console.log("BODY keys:", Object.keys(req.body || {}));
    console.log("FILES:", req.file ? req.file.path : "No file");

    if (!req.user || !req.user.MaDocGia) {
      console.error("No req.user or missing MaDocGia");
      return next(new ApiError(401, "Không xác thực người dùng"));
    }

    const db = MongoDB.client.db();
    const docGiaColl = db.collection("docgia");
    const maDocGia = String(req.user.MaDocGia).trim(); // BƯỚC 1: KIỂM TRA SỰ TỒN TẠI VÀ LẤY TÀI LIỆU HIỆN CÓ

    const existingDoc = await docGiaColl.findOne({ MaDocGia: maDocGia });
    if (!existingDoc) {
      return next(
        new ApiError(404, "Không tìm thấy Độc giả (MaDocGia không tồn tại)")
      );
    }

    let payload = { ...req.body }; // Loại bỏ các trường không được phép cập nhật
    delete payload.Password;
    delete payload.MatKhau;
    delete payload.MaDocGia; // Chuẩn hoá NgaySinh

    if (payload.NgaySinh && typeof payload.NgaySinh === "string") {
      const d = new Date(payload.NgaySinh);
      if (!isNaN(d.getTime())) payload.NgaySinh = d;
    } // Xử lý Avatar (nếu có file)

    if (req.file) {
      payload.Avatar = req.file.path;
      console.log("Avatar path added:", payload.Avatar);
    } // XỬ LÝ TRƯỜNG HỢP KHÔNG CÓ DỮ LIỆU CẬP NHẬT

    if (!Object.keys(payload).length) {
      // Trích xuất profile không có mật khẩu từ existingDoc
      const { Password, MatKhau, password, matkhau, ...userWithoutPassword } =
        existingDoc;
      return res.status(200).send({
        message: "Không có dữ liệu cập nhật.",
        profile: userWithoutPassword,
      });
    } // THỰC HIỆN CẬP NHẬT

    const result = await docGiaColl.findOneAndUpdate(
      { MaDocGia: maDocGia },
      { $set: payload },
      { returnDocument: "after" }
    ); // XỬ LÝ TRƯỜNG HỢP KHÔNG CÓ THAY ĐỔI TRÊN DB (findOneAndUpdate trả về null/không có value)

    if (!result.value) {
      // Sử dụng existingDoc để trả về profile thành công
      const { Password, MatKhau, password, matkhau, ...userWithoutPassword } =
        existingDoc;
      return res.status(200).send({
        message: "Cập nhật thành công (Không có thay đổi dữ liệu).",
        profile: userWithoutPassword,
      });
    } // XỬ LÝ THÀNH CÔNG VÀ CÓ THAY ĐỔI

    const { Password, MatKhau, password, matkhau, ...userWithoutPassword } =
      result.value;
    return res.send({
      message: "Cập nhật thông tin thành công",
      profile: userWithoutPassword, // Đảm bảo trả về profile
    });
  } catch (error) {
    console.error("updateProfile ERROR:", error);
    if (process.env.NODE_ENV === "development") {
      return res
        .status(500)
        .json({ message: error.message, stack: error.stack });
    }
    return next(new ApiError(500, "Lỗi khi cập nhật profile"));
  }
};

// sửa getBorrowStats — trả về số sách (camelCase) để frontend dễ dùng
exports.getBorrowStats = async (req, res, next) => {
  try {
    const db = MongoDB.client.db();
    const muonColl = db.collection("theodoimuonsach");
    const ma = req.user.MaDocGia;

    // lấy tất cả phiếu mượn (để tính số sách), chỉ phiếu liên quan MaDocGia
    const docs = await muonColl.find({ MaDocGia: ma }).toArray();

    let currentBorrowed = 0; // số sách đang mượn
    let totalBorrowed = 0; // tổng sách đã mượn (tất cả phiếu)
    let overdueCount = 0; // số sách quá hạn

    const today = new Date();

    for (const d of docs) {
      const chiTiet = Array.isArray(d.ChiTietMuon) ? d.ChiTietMuon : [];
      const numBooks = chiTiet.reduce(
        (s, it) => s + (Number(it.SoLuong) || 1),
        0
      );
      totalBorrowed += numBooks;

      // Xác định "đang mượn": khi NgayTra === null/không tồn tại OR TrangThai === 'Đang mượn'
      const isStillBorrowed =
        d.NgayTra == null ||
        d.NgayTra === undefined ||
        d.TrangThai === "Đang mượn";
      if (isStillBorrowed) {
        currentBorrowed += numBooks;
      }

      // dùng trường HanTra (tên chuẩn) để so sánh quá hạn
      const hanTra = d.HanTra ? new Date(d.HanTra) : null;
      if (hanTra && hanTra < today && isStillBorrowed) {
        overdueCount += numBooks;
      }
    }

    // trả về tên trường dễ dùng ở frontend (camelCase)
    res.json({
      currentBorrowed,
      totalBorrowed,
      overdueCount,
    });
  } catch (err) {
    console.error("getBorrowStats error:", err);
    return next(new ApiError(500, "Lỗi lấy thống kê mượn sách"));
  }
};
