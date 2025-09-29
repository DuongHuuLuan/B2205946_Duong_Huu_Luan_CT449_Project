const express = require("express");
const nhanvien = require("../controllers/nhanvien.controller");

const router = express.Router();

router.route("/")
  .get(nhanvien.findAll)
  .post(nhanvien.create)
  .delete(nhanvien.deleteAll);

router.route("/:id")
  .get(nhanvien.findOne)
  .put(nhanvien.update)
  .delete(nhanvien.delete);

module.exports = router;


// const express = require("express");
// const nhanvien = require("../controllers/nhanvien.controller");
// const verifyToken = require("../middlewares/auth");
// const authorizeRole = require("../middlewares/role");

// const router = express.Router();

// // Lấy danh sách nhân viên -> chỉ Admin được quyền xem
// router.get(
//   "/",
//   verifyToken,
//   authorizeRole(["Admin"]),
//   nhanvien.findAll
// );

// // Tạo nhân viên mới -> chỉ Admin
// router.post(
//   "/",
//   verifyToken,
//   authorizeRole(["Admin"]),
//   nhanvien.create
// );

// // Xem chi tiết nhân viên -> Admin hoặc chính nhân viên đó
// router.get(
//   "/:id",
//   verifyToken,
//   nhanvien.findOne
// );

// // Cập nhật nhân viên -> Admin hoặc chính nhân viên đó
// router.put(
//   "/:id",
//   verifyToken,
//   nhanvien.update
// );

// // Xóa nhân viên -> chỉ Admin
// router.delete(
//   "/:id",
//   verifyToken,
//   authorizeRole(["Admin"]),
//   nhanvien.delete
// );

// module.exports = router;
