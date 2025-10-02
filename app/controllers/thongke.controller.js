// app/controllers/thongke.controller.js

const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

// Import các Service Class
const SachService = require("../services/sach.service");
const DocGiaService = require("../services/docgia.service");
const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const NhanVienService = require("../services/nhanvien.service");
const NhaXuatBanService = require("../services/nhaxuatban.service");

// Khởi tạo các Service Instance để sử dụng
const sachService = new SachService(MongoDB.client);
const docGiaService = new DocGiaService(MongoDB.client);
const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
const nhanVienService = new NhanVienService(MongoDB.client);
const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);

/**
 * @description Lấy các chỉ số thống kê chung cho dashboard
 */
exports.getGeneralStats = async (req, res, next) => {
  try {
    const totalBooks = await sachService.count({});
    const totalReaders = await docGiaService.count({});
    const totalBorrows = await theoDoiMuonSachService.count({});
    const currentlyBorrowed = await theoDoiMuonSachService.count({
      NgayTra: null,
    });
    const totalStaff = await nhanVienService.count({});
    const totalPublishers = await nhaXuatBanService.count({});

    return res.send({
      totalBooks,
      totalReaders,
      totalBorrows,
      currentlyBorrowed,
      totalStaff,
      totalPublishers,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy dữ liệu thống kê chung."));
  }
};

/**
 * @description Thống kê số lượng sách theo từng Nhà Xuất Bản
 */
exports.getBooksByPublisher = async (req, res, next) => {
  try {
    // Aggregation Pipeline để nhóm và đếm sách theo MaNXB
    const pipeline = [
      { $group: { _id: "$MaNXB", count: { $sum: 1 } } },
      // Nối (lookup) với collection 'nhaxuatbans' để lấy tên NXB
      {
        $lookup: {
          from: "nhaxuatban",
          localField: "_id",
          foreignField: "_id",
          as: "publisherInfo",
        },
      },
      { $unwind: "$publisherInfo" },
      {
        $project: {
          _id: 0,
          TenNXB: "$publisherInfo.TenNXB",
          count: "$count",
        },
      },
    ];

    const stats = await sachService.aggregate(pipeline);
    return res.send(stats);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thống kê sách theo Nhà Xuất Bản."));
  }
};

/**
 * @description Thống kê số lượng nhân viên theo từng chức vụ
 */
exports.getStaffByRole = async (req, res, next) => {
  try {
    // Aggregation Pipeline để nhóm và đếm nhân viên theo ChucVu
    const pipeline = [
      { $group: { _id: "$ChucVu", count: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          ChucVu: "$_id",
          count: "$count",
        },
      },
    ];
    const stats = await nhanVienService.aggregate(pipeline);
    return res.send(stats);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thống kê nhân viên theo chức vụ."));
  }
};

/**
 * @description Thống kê 10 cuốn sách được mượn nhiều nhất
 */
exports.getTopBorrowedBooks = async (req, res, next) => {
  try {
    const pipeline = [
      // 1. Nhóm theo Mã Sách và đếm số lượt mượn
      { $group: { _id: "$MaSach", count: { $sum: 1 } } },
      // 2. Sắp xếp giảm dần
      { $sort: { count: -1 } },
      // 3. Giới hạn Top 10
      { $limit: 10 },
      // 4. Nối (lookup) với collection 'sach' để lấy tên sách và thông tin
      {
        $lookup: {
          from: "sach", // Tên collection của Sách
          localField: "_id",
          foreignField: "MaSach", // Giả định MaSach trong TDMS khớp với MaSach trong Sach
          as: "sachInfo",
        },
      },
      { $unwind: "$sachInfo" },
      {
        $project: {
          _id: 0,
          MaSach: "$_id",
          TenSach: "$sachInfo.TenSach",
          SoLuotMuon: "$count",
        },
      },
    ];

    // Bạn cần đảm bảo TheoDoiMuonSachService đã có hàm aggregate()
    const stats = await theoDoiMuonSachService.aggregate(pipeline);
    return res.send(stats);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thống kê Top sách mượn."));
  }
};
