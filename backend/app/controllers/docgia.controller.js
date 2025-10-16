const ApiError = require("../api-error");
const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");

// CRUD độc giả
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
  if (!Object.keys(req.body).length)
    return next(new ApiError(400, "Dữ liệu cập nhật không được trống"));
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.update(req.params.id, req.body);
    if (!document) return next(new ApiError(404, "Không tìm thấy Độc giả"));

    res.send({ message: "Cập nhật thành công" });
  } catch (error) {
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
    console.log("USER:", req.user); // kiểm tra
    console.log("BODY keys:", Object.keys(req.body || {}));
    console.log("BODY:", req.body);
    console.log("FILES:", req.file || req.files);

    if (!req.user || !req.user.MaDocGia) {
      console.error("No req.user or missing MaDocGia");
      return next(new ApiError(401, "Không xác thực người dùng"));
    }

    const db = MongoDB.client.db();
    const docGiaColl = db.collection("docgia");

    // Chuẩn hóa payload: loại bỏ fields không cho phép update (vd: Password, MaDocGia)
    const payload = { ...req.body };
    delete payload.Password;
    delete payload.MaDocGia;
    // chuyển NgaySinh nếu là chuỗi YYYY-MM-DD sang Date (tuỳ bạn muốn lưu kiểu Date)
    if (payload.NgaySinh && typeof payload.NgaySinh === "string") {
      const d = new Date(payload.NgaySinh);
      if (!isNaN(d.getTime())) payload.NgaySinh = d;
    }

    // Update theo MaDocGia và trả về doc sau khi update
    const result = await docGiaColl.findOneAndUpdate(
      { MaDocGia: req.user.MaDocGia },
      { $set: payload },
      { returnDocument: "after" } // trả về document sau khi cập nhật
    );

    if (!result.value) return next(new ApiError(404, "Không tìm thấy Độc giả"));

    const { Password, ...userWithoutPassword } = result.value;
    return res.send({
      message: "Cập nhật thông tin thành công",
      profile: userWithoutPassword,
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
