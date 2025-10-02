const express = require("express");
const thongke = require("../controllers/thongke.controller");

const { verifyToken } = require("../middlewares/authJwt");
const { authorizeRole } = require("../middlewares/role");

const router = express.Router();

// Vai trò được phép xem thống kê
const STATS_ROLES = ["Admin", "QuanLy"];

// 1. Thống kê chung (Tổng quan)
router.get(
  "/general",
  verifyToken,
  authorizeRole(STATS_ROLES),
  thongke.getGeneralStats
);

// 2. Thống kê Sách theo Nhà Xuất Bản
router.get(
  "/publisher-stats",
  verifyToken,
  authorizeRole(STATS_ROLES),
  thongke.getBooksByPublisher
);

// 3. Thống kê Nhân viên theo Chức vụ
router.get(
  "/staff-by-role",
  verifyToken,
  authorizeRole(STATS_ROLES),
  thongke.getStaffByRole
);
// thốn kê theo top- sách mượn
router.get(
  "/top-borrowed",
  verifyToken,
  authorizeRole(STATS_ROLES),
  thongke.getTopBorrowedBooks
);

module.exports = router;
