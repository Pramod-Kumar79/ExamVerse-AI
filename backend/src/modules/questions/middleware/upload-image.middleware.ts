import fs from "fs";
import path from "path";

import multer from "multer";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const uploadDir = path.join(process.cwd(), "uploads", "question-images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported image type. Use JPEG, PNG, WebP, or GIF."));
  }
};

export const uploadQuestionImage = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter,
});
