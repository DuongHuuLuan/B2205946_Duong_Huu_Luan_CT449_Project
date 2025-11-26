const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Cấu hình lưu trữ cho Multer
const storage = multer.diskStorage({
  // Thư mục đích đến để lưu file
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  // Đặt tên file
  filename: function (req, file, cb) {
    // Ví dụ: image-1678886400000.jpg
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Khởi tạo Multer với cấu hình lưu trữ
const upload = multer({ storage: storage });

// Middleware để xử lý 1 file duy nhất với trường 'image'
router.post("/upload", upload.single("image"), (req, res) => {
  // Lấy đường dẫn file đã lưu
  const imageUrl = `/uploads/${req.file.filename}`;

  // Lưu imageUrl và các dữ liệu khác vào MongoDB
  // ... (logic MongoDB ở đây)

  res.json({ message: "Tải ảnh lên thành công", imageUrl: imageUrl });
});

module.exports = router;
