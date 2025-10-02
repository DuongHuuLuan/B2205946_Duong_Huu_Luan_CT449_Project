const express = require("express");
const nhanvien = require("../controllers/nhanvien.controller");
const verifyToken = require("../middlewares/authJwt");
const authorizeRole = require("../middlewares/role");
const router = express.Router();

// Lấy danh sách nhân viên -> chỉ Admin và Quản lý được quyền xem
router.get(
  "/",
  verifyToken,
  authorizeRole(["Admin", "QuanLy"]),
  nhanvien.findAll
);

router.post("/", verifyToken, authorizeRole(["Admin"]), nhanvien.create);

router.get("/:id", verifyToken, nhanvien.findOne);
router.put(
  "/:id",
  verifyToken,

  (req, res, next) => {
    if (req.user.ChucVu === "Admin" || req.user.ChucVu === "QuanLy") {
      return next();
    }
    if (req.user.id === req.params.id) {
      return next();
    }

    return res.status(403).json({
      message: "Bạn không có quyền truy cập để cập nhật thông tin này.",
    });
  },
  nhanvien.update
);

// Xóa nhân viên -> chỉ Admin
router.delete("/:id", verifyToken, authorizeRole(["Admin"]), nhanvien.delete);

module.exports = router;
