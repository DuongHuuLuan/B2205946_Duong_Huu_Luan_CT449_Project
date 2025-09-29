const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo NXB mới
exports.create = async (req, res, next) => {
  if (!req.body?.TenNXB) {
    return next(new ApiError(400, "Tên NXB không được để trống"));
  }

  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo NXB mới"));
  }
};

// Lấy tất cả NXB
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const { TenNXB } = req.query;
    if (TenNXB) {
      documents = await nxbService.find({
        TenNXB: { $regex: new RegExp(TenNXB), $options: "i" },
      });
    } else {
      documents = await nxbService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách NXB"));
  }

  return res.send(documents);
};

// Lấy NXB theo ID
exports.findOne = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy NXB"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tìm NXB id=${req.params.id}`));
  }
};

// Cập nhật NXB
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được trống"));
  }

  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy NXB để cập nhật"));
    }
    return res.send({ message: "Cập nhật NXB thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật NXB id=${req.params.id}`));
  }
};

// Xóa 1 NXB
exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy NXB để xóa"));
    }
    return res.send({ message: "Xóa NXB thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa NXB id=${req.params.id}`));
  }
};

// Xóa tất cả NXB
exports.deleteAll = async (_req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const deletedCount = await nxbService.deleteAll();

    return res.send({
      message: `${deletedCount} NXB đã bị xóa`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa toàn bộ NXB"));
  }
};
