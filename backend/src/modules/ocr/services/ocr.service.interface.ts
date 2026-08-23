import type { UserRole } from "@prisma/client";

import type { OcrResult } from "../ocr.types";

export interface RequestingUser {
  id: string;
  role: UserRole;
}

export interface IOcrService {
  extractDocument(
    documentId: string,
    requestingUser?: RequestingUser,
  ): Promise<OcrResult>;
}