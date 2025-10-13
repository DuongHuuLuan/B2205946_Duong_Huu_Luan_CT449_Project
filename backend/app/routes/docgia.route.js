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

// Cập nhật thông tin cá nhân
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

      const docGia = await service.findOne({ MaDocGia: req.user.MaDocGia });
      if (!docGia) return next(new ApiError(404, "Không tìm thấy Độc giả"));

      const updated = await service.update(docGia._id, req.body);
      res.send({ message: "Cập nhật thông tin thành công", updated });
    } catch (error) {
      console.error(error);
      return next(new ApiError(500, "Lỗi khi cập nhật profile"));
    }
  }
);

module.exports = router;
