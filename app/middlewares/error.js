const ApiError = require("../api-error");

// Middleware xử lý lỗi 404
const notFound = (req, res, next) => {
  next(new ApiError(404, "Không tìm thấy tài nguyên"));
};

// Middleware xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    message: err.message || "Có lỗi xảy ra trên server",
  });
};

module.exports = { notFound, errorHandler };
