const express = require("express");
const cors = require("cors");
const path = require("path");
const mime = require("mime-types");
const docgiaRouter = require("./app/routes/docgia.route");
const docgiaAuthRouter = require("./app/routes/docgiaauth.route");
const sachRouter = require("./app/routes/sach.route");
const nhaxuatbanRouter = require("./app/routes/nhaxuatban.route");
const theodoimuonsach = require("./app/routes/theodoimuonsach.route");
const nhanvien = require("./app/routes/nhanvien.route");
const authRouter = require("./app/routes/auth.route");
const thongkeRouter = require("./app/routes/thongke.route");
const { notFound, errorHandler } = require("./app/middlewares/error");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/docgia", docgiaRouter);
app.use("/api/docgia/auth", docgiaAuthRouter);
app.use("/api/sach", sachRouter);
app.use("/api/nhaxuatban", nhaxuatbanRouter);
app.use("/api/theodoimuonsach", theodoimuonsach);
app.use("/api/nhanvien", nhanvien);
app.use("/api/auth", authRouter);
app.use("/api/thongke", thongkeRouter);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filepath) => {
      const mimeType = mime.lookup(filepath) || "application/octet-stream";
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  })
);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
