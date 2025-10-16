const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.TenNXB) {
    return next(new ApiError(400, "Tên NXB không được để trống"));
  }

  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo NXB mới"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const db = MongoDB.client.db();
    const nxbCollection = db.collection("nhaxuatban");

    const documents = await nxbCollection
      .aggregate([
        {
          $lookup: {
            from: "sach",
            localField: "MaNXB",
            foreignField: "MaNXB",
            as: "sachList",
          },
        },
        {
          $addFields: {
            bookCount: { $size: "$sachList" },
          },
        },
        { $project: { sachList: 0 } },
      ])
      .toArray();

    res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách Nhà Xuất Bản"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy NXB"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tìm NXB id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được trống"));
  }

  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy NXB để cập nhật"));
    }
    return res.send({ message: "Cập nhật NXB thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật NXB id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const nxbId = req.params.id;

    const nxb = await nxbService.findById(nxbId);
    if (!nxb) {
      return next(new ApiError(404, "Không tìm thấy Nhà Xuất Bản để xoá"));
    }

    const sachCollection = MongoDB.client.db().collection("sach");
    const hasBook = await sachCollection.findOne({ MaNXB: nxb.MaNXB });

    if (hasBook) {
      return next(
        new ApiError(
          400,
          "Không thể xoá Nhà Xuất Bản vì vẫn còn sách thuộc Nhà Xuất Bản này"
        )
      );
    }

    const document = await nxbService.delete(nxbId);
    return res.send({
      message: "Xoá Nhà Xuất Bản thành công",
      data: document,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xoá Nhà Xuất Bản id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const deletedCount = await nxbService.deleteAll();

    return res.send({
      message: `${deletedCount} NXB đã bị xóa`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa toàn bộ NXB"));
  }
};
