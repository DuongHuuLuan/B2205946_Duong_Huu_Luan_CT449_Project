const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const moment = require("moment");
const { ObjectId } = require("mongodb");
// Tạo phiếu mượn
exports.create = async (req, res, next) => {
  // Thay đổi kiểm tra: MaDocGia và ChiTietMuon (mảng) không được trống
  if (
    !req.body?.MaDocGia ||
    !req.body?.ChiTietMuon ||
    req.body.ChiTietMuon.length === 0
  ) {
    return next(
      new ApiError(400, "Mã Độc Giả và Chi tiết sách mượn không được để trống")
    );
  }

  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);

    // Nếu không gửi HanTra thì mặc định +7 ngày từ ngày mượn
    if (!req.body.HanTra && req.body.NgayMuon) {
      req.body.HanTra = moment(req.body.NgayMuon).add(7, "days").toDate();
    }

    const document = await tdmsService.create(req.body);
    return res.send({
      message: "Tạo phiếu mượn thành công",
      document,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "Lỗi khi tạo phiếu mượn.",
      error: error.message,
    });
  }
};

// Lấy tất cả phiếu mượn
exports.findAll = async (req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    let documents = await tdmsService.find({}); // Service đã tự động cập nhật trạng thái "Trễ hạn"

    // Chỉ cần format ngày và trả về
    documents = documents.map((doc) => ({
      ...doc,
      NgayMuon: doc.NgayMuon ? moment(doc.NgayMuon).format("YYYY-MM-DD") : null,
      HanTra: doc.HanTra ? moment(doc.HanTra).format("YYYY-MM-DD") : null,
      NgayTra: doc.NgayTra ? moment(doc.NgayTra).format("YYYY-MM-DD") : null,
    }));

    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách phiếu mượn"));
  }
};

// Lấy phiếu mượn theo ID
exports.findOne = async (req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    // Dùng find để đảm bảo phiếu mượn được kiểm tra và cập nhật trạng thái "Trễ hạn" nếu cần
    const documents = await tdmsService.find({
      _id: ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null,
    });
    let document = documents[0];

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }

    // Format ngày
    document.NgayMuon = document.NgayMuon
      ? moment(document.NgayMuon).format("YYYY-MM-DD")
      : null;
    document.HanTra = document.HanTra
      ? moment(document.HanTra).format("YYYY-MM-DD")
      : null;
    document.NgayTra = document.NgayTra
      ? moment(document.NgayTra).format("YYYY-MM-DD")
      : null;

    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi tìm phiếu mượn id=${req.params.id}`)
    );
  }
};

// Cập nhật phiếu mượn
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được trống"));
  }

  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await tdmsService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn để cập nhật"));
    }
    return res.send({
      message: "Cập nhật phiếu mượn thành công",
      document,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || `Lỗi khi cập nhật phiếu mượn id=${req.params.id}`
      )
    );
  }
};

// Xóa 1 phiếu mượn
exports.delete = async (req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await tdmsService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn để xóa"));
    }
    return res.send({
      message: "Xóa phiếu mượn thành công",
      document,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || `Lỗi khi xóa phiếu mượn id=${req.params.id}`
      )
    );
  }
};

// Xóa tất cả phiếu mượn
exports.deleteAll = async (_req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const deletedCount = await tdmsService.deleteAll();

    return res.send({
      message: `${deletedCount} phiếu mượn đã bị xóa`,
    });
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Lỗi khi xóa toàn bộ phiếu mượn")
    );
  }
};
// File: theodoimuonsach.controller.js

// Độc giả xem các sách mình đang mượn
exports.findByDocGia = async (req, res, next) => {
  try {
    const MaDocGia = req.user.MaDocGia;
    const db = MongoDB.client.db();
    const collection = db.collection("theodoimuonsach");

    const documents = await collection
      .aggregate([
        { $match: { MaDocGia: MaDocGia } },

        // SỬA: BỎ TongThanhToan. Chỉ ưu tiên TongTien (cho cả cũ và mới)
        {
          $addFields: {
            TongTienHienThi: {
              $ifNull: [
                "$TongTien", // Chỉ kiểm tra TongTien
                0, // Mặc định là 0
              ],
            },
          },
        },

        {
          $lookup: {
            from: "sach",
            localField: "ChiTietMuon.MaSach",
            foreignField: "MaSach",
            as: "SachThongTin",
          },
        },
        { $sort: { NgayMuon: -1 } },
      ])
      .toArray();

    res.send(documents);
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Lỗi khi lấy danh sách mượn sách của độc giả")
    );
  }
};

// Độc giả tự mượn sách
exports.createByDocGia = async (req, res, next) => {
  try {
    const MaDocGia = req.user.MaDocGia;
    const { ChiTietMuon, TongTien, NgayMuon, HanTra } = req.body;

    if (!ChiTietMuon || !Array.isArray(ChiTietMuon) || ChiTietMuon.length === 0)
      return next(new ApiError(400, "Danh sách sách mượn không hợp lệ"));

    if (ChiTietMuon.length > 3)
      return next(new ApiError(400, "Chỉ được mượn tối đa 3 sách"));

    const db = MongoDB.client.db();
    const sachCollection = db.collection("sach");
    const muonCollection = db.collection("theodoimuonsach");

    // Lấy và kiểm tra tiền cọc gửi từ Frontend
    const tienCocTuFrontend = Number(TongTien) || 0;

    if (tienCocTuFrontend <= 0) {
      return next(
        new ApiError(
          400,
          "Tổng tiền cọc phải lớn hơn 0. Vui lòng kiểm tra giá sách."
        )
      );
    }

    for (const item of ChiTietMuon) {
      const sach = await sachCollection.findOne({ MaSach: item.MaSach });

      if (!sach)
        return next(new ApiError(404, `Không tìm thấy sách ${item.MaSach}`));

      // Kiểm tra số lượng còn lại
      const soQuyenCon = sach.SoQuyenCon || sach.SoQuyen || 0;
      if (soQuyenCon <= 0 || item.SoLuong > soQuyenCon)
        return next(
          new ApiError(
            400,
            `Sách ${sach.TenSach} không đủ số lượng (${item.SoLuong} > ${soQuyenCon})`
          )
        );
    }

    // Tạo phiếu mượn
    const newBorrow = {
      MaDocGia,
      NgayMuon: NgayMuon ? new Date(NgayMuon) : new Date(),
      HanTra: HanTra
        ? new Date(HanTra)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ChiTietMuon,
      TrangThai: "Chờ duyệt",
      // Chỉ lưu vào TongTien. KHÔNG CÓ TongThanhToan
      TongTien: tienCocTuFrontend,
      NgayTra: null,
    };

    const result = await muonCollection.insertOne(newBorrow);

    res.send({
      message: "Yêu cầu mượn sách đã được gửi đi. Vui lòng chờ duyệt.",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Lỗi Controller createByDocGia:", error);
    return next(
      new ApiError(500, error.message || "Lỗi khi độc giả mượn sách")
    );
  }
};
