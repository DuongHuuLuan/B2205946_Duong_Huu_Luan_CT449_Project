const express = require("express");
const tdms = require("../controllers/theodoimuonsach.controller");

const {
  // Độc giả
  verifyToken: verifyTokenDocGia,
  authorizeRoleDocGia, // Lưu ý: Hàm này không nhận tham số mảng Role nếu nó chỉ check DocGia
} = require("../middlewares/auth.docgia.middleware");

const {
  // Nhân viên
  verifyToken: verifyTokenNhanVien,
  authorizeRoleNhanVien, // Hàm này nhận tham số mảng Role
} = require("../middlewares/auth.nhanvien.middleware");

const router = express.Router();

// ----------------------------------------------------------------------
// ROUTE CHO ĐỘC GIẢ (Sử dụng middleware DocGia)
// ----------------------------------------------------------------------

// Route: /api/theodoiMuonSach/docgia
router
  .route("/docgia")
  // GET: Xem các sách độc giả đã mượn
  .get(
    verifyTokenDocGia,
    authorizeRoleDocGia(), // Chỉ cần ủy quyền là DocGia
    tdms.findByDocGia
  )
  // POST: Ghi mượn sách mới
  .post(
    verifyTokenDocGia,
    authorizeRoleDocGia(), // Chỉ cần ủy quyền là DocGia
    tdms.createByDocGia
  );

// ----------------------------------------------------------------------
// ROUTE CHO NHÂN VIÊN (Sử dụng middleware Nhân viên)
// ----------------------------------------------------------------------

// Route: /api/theodoiMuonSach/
router
  .route("/")
  // GET: Xem tất cả bản ghi
  .get(
    verifyTokenNhanVien,
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    tdms.findAll
  )
  // POST: Ghi mượn sách (Nếu Nhân viên tạo hộ)
  .post(
    verifyTokenNhanVien,
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu"]),
    tdms.create
  )
  // DELETE: Xóa tất cả (chỉ Admin)
  .delete(
    verifyTokenNhanVien,
    authorizeRoleNhanVien(["Admin"]),
    tdms.deleteAll
  );

// Route: /api/theodoiMuonSach/:id
router
  .route("/:id")
  // GET: Xem chi tiết
  .get(
    verifyTokenNhanVien,
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    tdms.findOne
  )
  // PUT: Ghi trả/Cập nhật
  .put(
    verifyTokenNhanVien,
    authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu"]),
    tdms.update
  )
  // DELETE: Xóa bản ghi (chỉ Admin)
  .delete(verifyTokenNhanVien, authorizeRoleNhanVien(["Admin"]), tdms.delete);

module.exports = router;
