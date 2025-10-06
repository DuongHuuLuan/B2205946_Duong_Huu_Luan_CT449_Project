const ApiError = require("../api-error");

// 1. KHAI BÁO BIẾN SERVICE (Chưa gán giá trị)
let sachService;
let docGiaService;
let theoDoiMuonSachService;
let nhanVienService;
let nhaXuatBanService;

// Import các Service Class
const SachService = require("../services/sach.service");
const DocGiaService = require("../services/docgia.service");
const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const NhanVienService = require("../services/nhanvien.service");
const NhaXuatBanService = require("../services/nhaxuatban.service");

/**
 * @description Hàm Khởi tạo Services, được gọi TỪ server.js sau khi CSDL kết nối.
 * @param {object} client Đối tượng kết nối MongoDB client
 */
exports.initServices = (client) => {
  if (!client) {
    throw new Error(
      "Lỗi khởi tạo Controller Thống Kê: Đối tượng client kết nối là undefined."
    );
  }
  // 2. Gán giá trị cho các biến Service SỬ DỤNG client đã kết nối
  sachService = new SachService(client);
  docGiaService = new DocGiaService(client);
  theoDoiMuonSachService = new TheoDoiMuonSachService(client);
  nhanVienService = new NhanVienService(client);
  nhaXuatBanService = new NhaXuatBanService(client);
};

/**
 * @description Lấy các chỉ số thống kê chung cho dashboard
 */
exports.getGeneralStats = async (req, res, next) => {
  try {
    // Kiểm tra đảm bảo Service đã được khởi tạo
    if (!sachService) {
      throw new ApiError(503, "Dịch vụ Thống Kê chưa sẵn sàng.");
    }

    const totalBooks = await sachService.count({});
    const totalReaders = await docGiaService.count({});
    const totalBorrows = await theoDoiMuonSachService.count({});

    // Đếm số phiếu mượn đang hoạt động (Đang mượn, Trễ hạn, Chờ duyệt)
    const currentlyBorrowed = await theoDoiMuonSachService.count({
      TrangThai: { $in: ["Đang mượn", "Trễ hạn", "Chờ duyệt"] },
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
    const pipeline = [
      { $group: { _id: "$MaNXB", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "nhaxuatban",
          localField: "_id",
          foreignField: "MaNXB",
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
    // Pipeline đã được sửa chữa để xử lý mảng ChiTietMuon
    const pipeline = [
      // 1. Tách mảng ChiTietMuon ra thành từng tài liệu riêng biệt
      { $unwind: "$ChiTietMuon" },

      // 2. Nhóm theo Mã Sách trong ChiTietMuon và đếm số lượt mượn
      {
        $group: {
          _id: "$ChiTietMuon.MaSach",
          SoLuotMuon: { $sum: 1 },
        },
      },

      // 3. Sắp xếp giảm dần theo Số Lượt Mượn
      { $sort: { SoLuotMuon: -1 } },

      // 4. Giới hạn Top 10
      { $limit: 10 },

      // 5. Nối (lookup) với collection 'sach' để lấy tên sách
      {
        $lookup: {
          from: "sach",
          localField: "_id",
          foreignField: "MaSach",
          as: "sachInfo",
        },
      },
      // 6. Tách thông tin sách ra
      { $unwind: "$sachInfo" },
      {
        $project: {
          _id: 0,
          MaSach: "$_id",
          TenSach: "$sachInfo.TenSach",
          SoLuotMuon: 1, // Lấy giá trị SoLuotMuon đã tính
        },
      },
    ];

    const stats = await theoDoiMuonSachService.aggregate(pipeline);
    return res.send(stats);
  } catch (error) {
    console.error("Lỗi khi thống kê Top sách mượn:", error);
    return next(new ApiError(500, "Lỗi khi thống kê Top sách mượn."));
  }
};
