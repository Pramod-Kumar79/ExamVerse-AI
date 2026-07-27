import "multer";
import type { Express } from "express";

export interface StoredFile {
  originalName: string;
  storedName: string;
  mimeType: string;
  extension: string;
  fileSize: number;
  storagePath: string;
}

export interface StorageProvider {
  save(file: Express.Multer.File): Promise<StoredFile>;

  delete(storagePath: string): Promise<void>;

  getDownloadUrl(storagePath: string): string;
}
