const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo sách mới
exports.create = async (req, res, next) => {
  if (!req.body?.TenSach) {
    return next(new ApiError(400, "Tên sách không được để trống"));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.create(req.body);

    return res.send({
      message: "Thêm sách thành công",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo sách mới"));
  }
};

// Lấy tất cả sách
exports.findAll = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const { TenSach } = req.query;

    let documents = [];
    if (TenSach) {
      documents = await sachService.find({
        TenSach: { $regex: new RegExp(TenSach), $options: "i" },
      });
    } else {
      documents = await sachService.find({});
    }

    return res.send({
      message: "Lấy danh sách sách thành công",
      data: documents,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách sách"));
  }
};

// Lấy sách theo ID
exports.findOne = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }

    return res.send({
      message: "Lấy sách thành công",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tìm sách id=${req.params.id}`));
  }
};

// Cập nhật sách
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được trống"));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách để cập nhật"));
    }

    return res.send({
      message: "Cập nhật sách thành công",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật sách id=${req.params.id}`));
  }
};

// Xóa sách theo ID
exports.delete = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách để xóa"));
    }

    return res.send({
      message: "Xóa sách thành công",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa sách id=${req.params.id}`));
  }
};

// Xóa toàn bộ sách
exports.deleteAll = async (_req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const deletedCount = await sachService.deleteAll();

    return res.send({
      message: `${deletedCount} sách đã bị xóa`,
      data: { deletedCount },
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa toàn bộ sách"));
  }
};
