const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const bcrypt = require("bcryptjs");
// Thêm nhân viên (chỉ Admin mới có quyền)
exports.create = async (req, res, next) => {
  if (req.user.ChucVu !== "Admin") {
    return next(new ApiError(403, "Chỉ Admin mới có quyền thêm nhân viên"));
  }

  if (!req.body?.MSNV || !req.body?.HoTenNV || !req.body?.Password) {
    return next(
      new ApiError(400, "MSNV, HoTenNV và Password không được để trống")
    );
  }

  try {
    const nvService = new NhanVienService(MongoDB.client);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.Password, salt);

    const nhanVienData = {
      MSNV: req.body.MSNV,
      HoTenNV: req.body.HoTenNV,
      Password: hashedPassword,
      ChucVu: req.body.ChucVu || "HoTro",
      DiaChi: req.body.DiaChi,
      SoDienThoai: req.body.SoDienThoai,
    };

    const document = await nvService.create(nhanVienData);
    return res.send(document);
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(400, "Mã số nhân viên đã tồn tại."));
    }
    return next(new ApiError(500, `Lỗi khi tạo nhân viên: ${error.message}`));
  }
};
// Lấy tất cả (chỉ Admin)
exports.findAll = async (req, res, next) => {
  if (req.user.ChucVu !== "Admin") {
    return next(
      new ApiError(403, "Chỉ Admin mới có quyền xem danh sách nhân viên")
    );
  }

  try {
    const nvService = new NhanVienService(MongoDB.client);
    const documents = await nvService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
  }
};

// Tìm nhân viên theo ID
exports.findOne = async (req, res, next) => {
  try {
    // Admin thì xem được tất cả, nhân viên thường chỉ xem chính mình
    if (req.user.ChucVu !== "Admin" && req.user.MSNV !== req.params.id) {
      return next(
        new ApiError(403, "Bạn không có quyền xem thông tin nhân viên khác")
      );
    }

    const nvService = new NhanVienService(MongoDB.client);
    const document = await nvService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tìm nhân viên id=${req.params.id}`));
  }
};

// Cập nhật nhân viên
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được trống"));
  }

  try {
    // Admin cập nhật được tất cả, nhân viên thường chỉ được cập nhật bản thân
    if (req.user.ChucVu !== "Admin" && req.user.MSNV !== req.params.id) {
      return next(
        new ApiError(403, "Bạn không có quyền cập nhật nhân viên khác")
      );
    }

    const nvService = new NhanVienService(MongoDB.client);
    const document = await nvService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên để cập nhật"));
    }
    return res.send({ message: "Cập nhật nhân viên thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật nhân viên id=${req.params.id}`)
    );
  }
};

// Xóa 1 nhân viên (chỉ Admin)
exports.delete = async (req, res, next) => {
  if (req.user.ChucVu !== "Admin") {
    return next(new ApiError(403, "Chỉ Admin mới có quyền xóa nhân viên"));
  }

  try {
    const nvService = new NhanVienService(MongoDB.client);
    const document = await nvService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên để xóa"));
    }
    return res.send({ message: "Xóa nhân viên thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa nhân viên id=${req.params.id}`));
  }
};

// Xóa tất cả nhân viên (chỉ Admin)
exports.deleteAll = async (_req, res, next) => {
  if (_req.user.ChucVu !== "Admin") {
    return next(
      new ApiError(403, "Chỉ Admin mới có quyền xóa tất cả nhân viên")
    );
  }

  try {
    const nvService = new NhanVienService(MongoDB.client);
    const deletedCount = await nvService.deleteAll();

    return res.send({
      message: `${deletedCount} nhân viên đã bị xóa`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả nhân viên"));
  }
};
