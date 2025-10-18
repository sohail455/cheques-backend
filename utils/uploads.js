const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "public", "images", "cheques");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const stamp = Date.now();
    cb(null, `${base}-${stamp}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (/^image\//.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 5MB

module.exports = upload;
