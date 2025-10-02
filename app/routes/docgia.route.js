const express = require("express");
const docgiaController = require("../controllers/docgia.controller");
const verifyToken = require("../middlewares/authJwt");
const authorizeRole = require("../middlewares/role");
const router = express.Router();

router
  .route("/")
  .get(
    verifyToken,
    authorizeRole(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    docgiaController.findAll
  )
  .post(
    verifyToken,
    authorizeRole(["Admin", "QuanLy", "ThuThu"]),
    docgiaController.create
  );

router
  .route("/:id")
  .get(
    verifyToken,
    authorizeRole(["Admin", "QuanLy", "ThuThu", "HoTro"]),
    docgiaController.findOne
  )
  .put(verifyToken, authorizeRole(["Admin", "QuanLy"]), docgiaController.update)
  .delete(verifyToken, authorizeRole(["Admin"]), docgiaController.delete);

module.exports = router;
