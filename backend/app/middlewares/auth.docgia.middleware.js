const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return next(new ApiError(401, "Không có token, truy cập bị từ chối"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(403, "Token không hợp lệ hoặc đã hết hạn"));
  }
};

const authorizeRoleDocGia = () => {
  return (req, res, next) => {
    // Độc giả chỉ cần kiểm tra xem họ có đăng nhập hay không (req.user tồn tại)
    if (!req.user) {
      return res
        .status(403)
        .json({ message: "Truy cập bị từ chối. (Yêu cầu Độc giả)" });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoleDocGia,
};
