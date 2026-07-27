import "multer";

import fs from "fs";
import path from "path";

import multer from "multer";

import {
  ALLOWED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE,
} from "../documents.constants";

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "documents",
  new Date().getFullYear().toString(),
  String(new Date().getMonth() + 1).padStart(2, "0"),
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
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
  if (
    ALLOWED_DOCUMENT_TYPES.includes(
      file.mimetype as (typeof ALLOWED_DOCUMENT_TYPES)[number],
    )
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type."));
  }
};

export const uploadDocument = multer({
  storage,

  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
  },

  fileFilter,
});
