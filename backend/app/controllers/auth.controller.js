const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MongoDB = require("../utils/mongodb.util");
const NhanVienService = require("../services/nhanvien.service");
const ApiError = require("../api-error");

// Secret key JWT (nên để vào .env)
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// Đăng ký tài khoản
exports.register = async (req, res, next) => {
  try {
    const { MSNV, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;

    if (!MSNV || !HoTenNV || !Password) {
      return next(new ApiError(400, "MSNV, HoTenNV và Password là bắt buộc"));
    }

    const nvService = new NhanVienService(MongoDB.client);

    // Kiểm tra đã tồn tại chưa
    const existing = await nvService.findByMSNV(MSNV);
    if (existing) {
      return next(new ApiError(400, "MSNV đã tồn tại"));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Tạo nhân viên mới
    const result = await nvService.create({
      MSNV,
      HoTenNV,
      Password: hashedPassword,
      ChucVu,
      DiaChi,
      SoDienThoai,
    });

    return res
      .status(201)
      .send({ message: "Đăng ký thành công", id: result.insertedId });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng ký tài khoản"));
  }
};

// Đăng nhập
exports.login = async (req, res, next) => {
  try {
    const { MSNV, Password } = req.body;
    if (!MSNV || !Password) {
      return next(new ApiError(400, "MSNV và Password là bắt buộc"));
    }

    const nvService = new NhanVienService(MongoDB.client);

    // Tìm nhân viên
    const user = await nvService.findByMSNV(MSNV);
    if (!user) {
      return next(new ApiError(401, "Sai MSNV hoặc mật khẩu"));
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return next(new ApiError(401, "Sai MSNV hoặc mật khẩu"));
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user._id,
        MSNV: user.MSNV,
        HoTenNV: user.HoTenNV,
        ChucVu: user.ChucVu,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.send({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        MSNV: user.MSNV,
        HoTenNV: user.HoTenNV,
        ChucVu: user.ChucVu,
      },
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};
