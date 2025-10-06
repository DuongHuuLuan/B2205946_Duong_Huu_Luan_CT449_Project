const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo sách mới
exports.create = async (req, res, next) => {
  if (!req.body?.TenSach) {
    return next(new ApiError(400, "Tên sách không được để trống"));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.create(req.body);

    return res.send({
      message: "Thêm sách thành công",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo sách mới"));
  }
};

// Lấy tất cả sách
// exports.findAll = async (req, res, next) => {
//   try {
//     const sachService = new SachService(MongoDB.client);
//     const { TenSach } = req.query;

//     let documents = [];
//     if (TenSach) {
//       documents = await sachService.find({
//         TenSach: { $regex: new RegExp(TenSach), $options: "i" },
//       });
//     } else {
//       documents = await sachService.find({});
//     }

//     const theoDoiMuonSach = MongoDB.client.db().collection("theodoimuonsach");

//     // gán thêm cờ isBorrowed
//     for (let doc of documents) {
//       const borrowed = await theoDoiMuonSach.findOne({
//         "ChiTietMuon.MaSach": doc.MaSach,
//         $or: [{ NgayTra: null }, { NgayTra: { $exists: false } }],
//       });
//     }

//     return res.send({
//       message: "Lấy danh sách sách thành công",
//       data: documents,
//     });
//   } catch (error) {
//     return next(new ApiError(500, "Lỗi khi lấy danh sách sách"));
//   }
// };
exports.findAll = async (req, res, next) => {
  try {
    const db = MongoDB.client.db();
    const sachCollection = db.collection("sach");
    const muonCollection = db.collection("theodoimuonsach");

    const documents = await sachCollection
      .aggregate([
        {
          $lookup: {
            from: "theodoimuonsach",
            let: { maSach: "$MaSach" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$$maSach", "$ChiTietMuon.MaSach"] },
                  $or: [{ NgayTra: null }, { NgayTra: { $exists: false } }],
                },
              },
            ],
            as: "borrowInfo",
          },
        },
        {
          $addFields: {
            isBorrowed: { $gt: [{ $size: "$borrowInfo" }, 0] },
          },
        },
        { $project: { borrowInfo: 0 } },
      ])
      .toArray();

    res.send({
      message: "Lấy danh sách sách thành công",
      data: documents,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách sách"));
  }
};

// Lấy sách theo ID
exports.findOne = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }

    return res.send({
      message: "Lấy sách thành công",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tìm sách id=${req.params.id}`));
  }
};

// Cập nhật sách
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được trống"));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách để cập nhật"));
    }

    return res.send({
      message: "Cập nhật sách thành công",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật sách id=${req.params.id}`));
  }
};

// Xóa sách theo ID (có kiểm tra ràng buộc mượn sách)
exports.delete = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const sachId = req.params.id;

    // Tìm sách trước để lấy MaSach
    const sach = await sachService.findById(sachId);
    if (!sach) {
      return next(new ApiError(404, "Không tìm thấy sách để xóa"));
    }

    const theoDoiMuonSach = MongoDB.client.db().collection("theodoimuonsach");

    // Kiểm tra xem sách có đang được mượn chưa trả không
    const isBorrowed = await theoDoiMuonSach.findOne({
      "ChiTietMuon.MaSach": sach.MaSach, // liên kết qua MaSach
      $or: [{ NgayTra: null }, { NgayTra: { $exists: false } }],
    });

    if (isBorrowed) {
      return next(
        new ApiError(400, "Không thể xóa sách vì đang có người mượn")
      );
    }

    // Nếu không bị ràng buộc thì xóa sách
    const document = await sachService.delete(sachId);

    return res.send({
      message: "Xóa sách thành công",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa sách id=${req.params.id}`));
  }
};

// Xóa toàn bộ sách
exports.deleteAll = async (_req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const deletedCount = await sachService.deleteAll();

    return res.send({
      message: `${deletedCount} sách đã bị xóa`,
      data: { deletedCount },
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa toàn bộ sách"));
  }
};
