import "multer";
import fs from "fs/promises";
import path from "path";

import type { Express } from "express";

import type { StorageProvider, StoredFile } from "./storage.provider";

export class LocalStorageProvider implements StorageProvider {
  async save(file: Express.Multer.File): Promise<StoredFile> {
    return {
      originalName: file.originalname,

      storedName: path.basename(file.path),

      mimeType: file.mimetype,

      extension: path.extname(file.originalname),

      fileSize: file.size,

      storagePath: file.path,
    };
  }

  async delete(storagePath: string): Promise<void> {
    await fs.unlink(storagePath);
  }

  getDownloadUrl(storagePath: string): string {
    return `/uploads/${path.basename(storagePath)}`;
  }
}
