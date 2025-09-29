const express = require("express");
const cors = require("cors");
const docgiaRouter = require("./app/routes/docgia.route");
const sachRouter = require("./app/routes/sach.route");
const nhaxuatbanRouter = require("./app/routes/nhaxuatban.route");
const theodoimuonsach = require("./app/routes/theodoimuonsach.route");
const nhanvien = require("./app/routes/nhanvien.route");
const authRouter = require("./app/routes/auth.route");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/docgia", docgiaRouter);
app.use("/api/sach", sachRouter);
app.use("/api/nhaxuatban", nhaxuatbanRouter);
app.use("/api/theodoimuonsach", theodoimuonsach);
app.use("/api/nhanvien", nhanvien);
app.use("/api/auth", authRouter);
module.exports = app;
