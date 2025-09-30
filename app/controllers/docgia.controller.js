const ApiError = require("../api-error");
const DocGiaService = require("../services/docgia.service"); 
const MongoDB = require("../utils/mongodb.util");

// Hàm tạo mới Độc giả (CREATE)
exports.create = async (req, res, next) => {
  if (!req.body?.Ten) { 
    return next(new ApiError(400, "Ten (Tên) của Độc giả không thể trống"));
  }

  try {
    // Khởi tạo DocGiaService
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "Đã xảy ra lỗi khi tạo Độc giả mới")
    );
  }
};

// Hàm tìm kiếm tất cả Độc giả (READ all)   
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    // Thay đổi tham số query từ 'name' sang 'ten' để tìm kiếm theo tên Độc giả
    const {
      ten
    } = req.query; 
    if (ten) {
      // Hàm tìm kiếm theo tên
      documents = await docGiaService.findByName(ten);
    } else {
      // Hàm tìm kiếm tất cả (không có điều kiện)
      documents = await docGiaService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách Độc giả")
    );
  }

  return res.send(documents);
};

// Hàm tìm kiếm một Độc giả theo ID (READ one)
exports.findOne = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy Độc giả"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi truy xuất Độc giả với id=${req.params.id}`
      )
    );
  }
};

// Hàm cập nhật thông tin Độc giả (UPDATE)
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được trống"));
  }

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.update(req.params.id, req.body);
    if (document === null) {
      return next(new ApiError(404, "Không tìm thấy Độc giả"));
    }

    return res.send({
      message: "Thông tin Độc giả đã được cập nhật thành công"
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi cập nhật Độc giả với id=${req.params.id}`
      )
    );
  }
};

// Hàm xóa một Độc giả (DELETE one)
exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.delete(req.params.id);
    if (document === null) {
      return next(new ApiError(404, "Không tìm thấy Độc giả"));
    }
    return res.send({
      message: "Độc giả đã được xóa thành công"
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể xóa Độc giả với id=${req.params.id}`
      )
    );
  }
};

// Tạm thời giữ nguyên tên hàm findAllFavorite để tương thích cấu trúc
exports.findAllFavorite = async (_req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const documents = await docGiaService.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(
        500,
        "Đã xảy ra lỗi khi truy xuất danh sách Độc giả yêu thích"
      )
    );
  }
};

// Hàm xóa tất cả Độc giả (DELETE all)
exports.deleteAll = async (_req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const deletedCount = await docGiaService.deleteAll();
    return res.send({
      message: `${deletedCount} Độc giả đã được xóa thành công`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả Độc giả")
    );
  }
};