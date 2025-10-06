const express = require("express");
const docgiaAuthController = require("../controllers/docgiaauth.controller");

const router = express.Router();

// routes đăng ký, đăng nhập
router.post("/register", docgiaAuthController.register);
router.post("/login", docgiaAuthController.login);

module.exports = router;
