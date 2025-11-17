const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../../public/uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const mimetype = allowed.test(file.mimetype);
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && ext) cb(null, true);
  else cb(new Error("Only jpg/jpeg/png images are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

module.exports = {
  uploadSingle: (fieldName = "Avatar") => upload.single(fieldName),
  UPLOAD_DIR,
};
