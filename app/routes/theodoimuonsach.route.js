// src/routes/theodoimuonsach.route.js
const express = require("express");
const tdms = require("../controllers/theodoimuonsach.controller");
const verifyToken = require("../middlewares/authJwt");
const authorizeRole = require("../middlewares/role");
const router = express.Router();

router
  .route("/")
  .get(
    verifyToken,
    authorizeRole(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    tdms.findAll
  ) // Xem tất cả
  .post(verifyToken, authorizeRole(["Admin", "QuanLy", "ThuThu"]), tdms.create) // Ghi mượn sách
  .delete(verifyToken, authorizeRole(["Admin"]), tdms.deleteAll); // Xóa tất cả (chỉ Admin)

router
  .route("/:id")
  .get(
    verifyToken,
    authorizeRole(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    tdms.findOne
  ) // Xem chi tiết
  .put(verifyToken, authorizeRole(["Admin", "QuanLy", "ThuThu"]), tdms.update) // Ghi trả/Cập nhật
  .delete(verifyToken, authorizeRole(["Admin"]), tdms.delete); // Xóa bản ghi (chỉ Admin)

module.exports = router;
