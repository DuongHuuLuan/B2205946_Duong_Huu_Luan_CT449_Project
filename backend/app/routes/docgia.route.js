const express = require("express");
const router = express.Router();
const docgiaController = require("../controllers/docgia.controller");

// Middleware cho từng loại người dùng
const {
  verifyToken: verifyNhanVien,
  authorizeRoleNhanVien,
} = require("../middlewares/auth.nhanvien.middleware");
const {
  verifyToken: verifyDocGia,
  authorizeRoleDocGia,
} = require("../middlewares/auth.docgia.middleware");

// ROUTE CHO NHÂN VIÊN

router
  .route("/")
  .get(
    verifyNhanVien,
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    docgiaController.findAll
  )
  .post(
    verifyNhanVien,
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu"]),
    docgiaController.create
  );

router
  .route("/:id")
  .get(
    verifyNhanVien,
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    docgiaController.findOne
  )
  .put(
    verifyNhanVien,
    authorizeRoleNhanVien(["Admin", "QuanLy"]),
    docgiaController.update
  )
  .delete(
    verifyNhanVien,
    authorizeRoleNhanVien(["Admin"]),
    docgiaController.delete
  );

// ROUTE CHO ĐỘC GIẢ

// Xem thông tin cá nhân
router.get(
  "/profile/me",
  verifyDocGia,
  authorizeRoleDocGia(),
  async (req, res, next) => {
    try {
      const DocGiaService = require("../services/docgia.service");
      const MongoDB = require("../utils/mongodb.util");
      const ApiError = require("../api-error");
      const service = new DocGiaService(MongoDB.client);

      const docGia = await service.findOne({ MaDocGia: req.user.MaDocGia });
      if (!docGia) return next(new ApiError(404, "Không tìm thấy Độc giả"));

      const { Password, ...userWithoutPassword } = docGia;
      res.send(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return next(new ApiError(500, "Lỗi khi lấy thông tin profile"));
    }
  }
);

// phần PUT trong routes/docgia.route.js (thay thế phần hiện tại nếu cần)
router.put(
  "/profile/update",
  verifyDocGia,
  authorizeRoleDocGia(),
  async (req, res, next) => {
    try {
      const DocGiaService = require("../services/docgia.service");
      const MongoDB = require("../utils/mongodb.util");
      const ApiError = require("../api-error");
      const service = new DocGiaService(MongoDB.client);

      if (!req.user || !req.user.MaDocGia) {
        return next(new ApiError(401, "Không xác thực người dùng"));
      }

      // whitelist (không include file avatar upload)
      const allowed = [
        "HoLot",
        "Ten",
        "NgaySinh",
        "Phai",
        "DiaChi",
        "DienThoai",
        "Password",
      ];
      const payload = {};
      for (const k of allowed) {
        if (Object.prototype.hasOwnProperty.call(req.body, k)) {
          payload[k] = req.body[k];
        }
      }

      if (payload.NgaySinh && typeof payload.NgaySinh === "string") {
        const d = new Date(payload.NgaySinh);
        if (!isNaN(d.getTime())) payload.NgaySinh = d;
      }

      const updatedDoc = await service.update(
        { MaDocGia: req.user.MaDocGia },
        payload
      );

      if (!updatedDoc) {
        return next(new ApiError(404, "Không tìm thấy Độc giả"));
      }

      const { Password, ...publicProfile } = updatedDoc;

      return res.send({
        message: "Cập nhật thông tin thành công",
        profile: publicProfile,
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
  }
);

module.exports = router;
