// // src/routes/sach.route.js
// const express = require("express");
// const sachController = require("../controllers/sach.controller");
// const verifyToken = require("../middlewares/authJwt");
// const authorizeRole = require("../middlewares/role");
// const {
//   // verifyToken,
//   authorizeRoleDocGia,
// } = require("../middlewares/auth.docgia.middleware");
// const router = express.Router();

// router.get(
//   "/available",
//   verifyToken,
//   authorizeRoleDocGia(),
//   sachController.findAvailable
// );

// router.get("/:id", verifyToken, authorizeRoleDocGia(), sachController.findOne);

// router
//   .route("/")
//   .get(
//     verifyToken,
//     authorizeRole(["Admin", "QuanLy", "ThuThu", "HoTro"]),
//     sachController.findAll
//   )
//   .post(
//     verifyToken,
//     authorizeRole(["Admin", "QuanLy", "ThuThu"]),
//     sachController.create
//   );

// router
//   .route("/:id")
//   .get(
//     verifyToken,
//     authorizeRole(["Admin", "QuanLy", "ThuThu", "HoTro"]),
//     sachController.findOne
//   )
//   .put(
//     verifyToken,
//     authorizeRole(["Admin", "QuanLy", "ThuThu"]),
//     sachController.update
//   )
//   .delete(verifyToken, authorizeRole(["Admin"]), sachController.delete);

// module.exports = router;

const express = require("express");
const sachController = require("../controllers/sach.controller");

const {
  // Độc giả
  verifyToken: verifyTokenDocGia,
  authorizeRoleDocGia,
} = require("../middlewares/auth.docgia.middleware");

const {
  // Nhân viên
  verifyToken: verifyTokenNhanVien,
  authorizeRoleNhanVien,
} = require("../middlewares/auth.nhanvien.middleware");

const router = express.Router();

// ----------------------------------------------------------------------
// ROUTE CHO ĐỘC GIẢ (Chỉ xem)
// ----------------------------------------------------------------------

// GET /api/sach/available (Tìm sách có sẵn)
// Chỉ cần xác thực và ủy quyền là Độc giả
router.get(
  "/available",
  verifyTokenDocGia, // Sử dụng verifyToken của Độc giả
  authorizeRoleDocGia(), // Ủy quyền chỉ cho Độc giả
  sachController.findAvailable
);

// GET /api/sach/:id (Xem chi tiết sách)
// Chỉ cần xác thực và ủy quyền là Độc giả (Để fix lỗi 403 Forbidden bạn gặp trước đó)
router.get(
  "/:id",
  verifyTokenDocGia, // Sử dụng verifyToken của Độc giả
  authorizeRoleDocGia(), // Ủy quyền chỉ cho Độc giả
  sachController.findOne
);

// ----------------------------------------------------------------------
// ROUTE CHO NHÂN VIÊN (Xem, Thêm, Sửa, Xóa)
router
  .route("/")
  // GET /api/sach/ (Tìm tất cả - Dành cho Nhân viên)
  .get(
    verifyTokenNhanVien, // Sử dụng verifyToken của Nhân viên
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu", "HoTro"]), // Ủy quyền cho Nhân viên
    sachController.findAll
  )
  // POST /api/sach/ (Thêm mới - Dành cho Nhân viên)
  .post(
    verifyTokenNhanVien, // Sử dụng verifyToken của Nhân viên
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu"]),
    sachController.create
  );

router
  .route("/:id")
  // GET /api/sach/:id (Xem chi tiết - Dành cho Nhân viên)
  // Nếu Độc giả đã có route riêng, có thể bỏ route này hoặc chỉ dùng cho Nhân viên muốn xem thêm thông tin chi tiết hơn.
  .get(
    verifyTokenNhanVien, // Sử dụng verifyToken của Nhân viên
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    sachController.findOne
  )
  // PUT /api/sach/:id (Cập nhật - Dành cho Nhân viên)
  .put(
    verifyTokenNhanVien, // Sử dụng verifyToken của Nhân viên
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu"]),
    sachController.update
  )
  // DELETE /api/sach/:id (Xóa - Chỉ Admin)
  .delete(
    verifyTokenNhanVien, // Sử dụng verifyToken của Nhân viên
    authorizeRoleNhanVien(["Admin"]),
    sachController.delete
  );

module.exports = router;
