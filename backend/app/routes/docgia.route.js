const express = require("express");
const router = express.Router();
const docgiaController = require("../controllers/docgia.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Import fs module
// Middleware cho từng loại người dùng
const {
  verifyToken: verifyNhanVien,
  authorizeRoleNhanVien,
} = require("../middlewares/auth.nhanvien.middleware");
const {
  verifyToken: verifyDocGia,
  authorizeRoleDocGia,
} = require("../middlewares/auth.docgia.middleware");

// Cấu hình Multer (giữ nguyên)
const UPLOAD_DIR = "uploads/docgia/";
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory: ${UPLOAD_DIR}`);
  }
} catch (error) {
  console.error("ERROR creating upload directory:", error);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Nếu là tạo độc giả mới, req.user chưa có
    // Dùng MaDocGia trong body (được gửi trước file)
    const maDocGia = req.body.MaDocGia || "unknown";
    cb(
      null,
      `docgia-${maDocGia}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
});
// ------------------------------------------------

// ROUTE CHO NHÂN VIÊN

// 1. POST /api/docgia (Tạo độc giả KHÔNG file - gửi JSON)
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
    docgiaController.create // <-- KHÔNG CÓ MULTER
  )
  .delete(
    verifyNhanVien,
    authorizeRoleNhanVien(["Admin"]),
    docgiaController.deleteAll
  );

// 2. POST /api/docgia/with-avatar (Tạo độc giả CÓ file - gửi FormData)
// Frontend cần gọi route này khi có file
router.post(
  "/with-avatar",
  verifyNhanVien,
  authorizeRoleNhanVien(["Admin", "QuanLy", "ThuThu"]),
  uploadAvatar.single("Avatar"), // <-- CÓ MULTER Ở ĐÂY
  docgiaController.createWithAvatar // <-- Dùng controller mới
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
    uploadAvatar.single("Avatar"), // <-- THÊM MULTER cho PUT /:id để sửa (nếu có file)
    docgiaController.update
  )
  .delete(
    verifyNhanVien,
    authorizeRoleNhanVien(["Admin"]),
    docgiaController.delete
  );

// ROUTE CHO ĐỘC GIẢ (Giữ nguyên)

// Xem thông tin cá nhân
router.get(
  "/profile/me",
  verifyDocGia,
  authorizeRoleDocGia(),
  docgiaController.getProfile // Chuyển logic vào controller để tránh trùng lặp code
);

// Thêm uploadAvatar.single('Avatar') vào trước Controller
router.put(
  "/profile/update",
  verifyDocGia,
  authorizeRoleDocGia(),
  uploadAvatar.single("Avatar"), // <-- MULTER ĐƯỢC GẮN Ở ĐÂY
  docgiaController.updateProfile
);

module.exports = router;
