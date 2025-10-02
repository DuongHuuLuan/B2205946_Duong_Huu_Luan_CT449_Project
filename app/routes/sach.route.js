// src/routes/sach.route.js
const express = require("express");
const sachController = require("../controllers/sach.controller");
const verifyToken = require("../middlewares/authJwt");
const authorizeRole = require("../middlewares/role");
const router = express.Router();

router
  .route("/")
  .get(
    verifyToken,
    authorizeRole(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    sachController.findAll
  )
  .post(
    verifyToken,
    authorizeRole(["Admin", "QuanLy", "ThuThu"]),
    sachController.create
  );

router
  .route("/:id")
  .get(
    verifyToken,
    authorizeRole(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    sachController.findOne
  )
  .put(
    verifyToken,
    authorizeRole(["Admin", "QuanLy", "ThuThu"]),
    sachController.update
  )
  .delete(verifyToken, authorizeRole(["Admin"]), sachController.delete);

module.exports = router;
