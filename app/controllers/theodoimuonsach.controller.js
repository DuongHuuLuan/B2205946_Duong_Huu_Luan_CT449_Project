const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const moment = require("moment");
// Tạo phiếu mượn
exports.create = async (req, res, next) => {
  if (!req.body?.MaDocGia || !req.body?.MaSach) {
    return next(new ApiError(400, "MaDocGia và MaSach không được để trống"));
  }

  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await tdmsService.create(req.body);
    return res.send({
      message: "Tạo phiếu mượn thành công",
      document,
    });
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi khi tạo phiếu mượn sách"));
  }
};

// Lấy tất cả phiếu mượn
exports.findAll = async (req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    let documents = await tdmsService.find({});

    // Format ngày trước khi trả về
    documents = documents.map(doc => ({
      ...doc,
      NgayMuon: doc.NgayMuon ? moment(doc.NgayMuon).format("YYYY-MM-DD") : null,
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
    let document = await tdmsService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }

    // Format ngày
    document.NgayMuon = document.NgayMuon ? moment(document.NgayMuon).format("YYYY-MM-DD") : null;
    document.NgayTra = document.NgayTra ? moment(document.NgayTra).format("YYYY-MM-DD") : null;

    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tìm phiếu mượn id=${req.params.id}`));
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
    return next(new ApiError(500, error.message || `Lỗi khi cập nhật phiếu mượn id=${req.params.id}`));
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
    return next(new ApiError(500, error.message || `Lỗi khi xóa phiếu mượn id=${req.params.id}`));
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
    return next(new ApiError(500, error.message || "Lỗi khi xóa toàn bộ phiếu mượn"));
  }
};
