import type { DocumentPage } from "./../../common/types";

export interface PdfMetadata {
  pageCount: number;
  textLength: number;
  hasText: boolean;

  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;

  isEncrypted: boolean;
}

export type PdfContentType = "NATIVE_TEXT" | "SCANNED";

export interface PdfProcessingResult {
  metadata: PdfMetadata;

  pages: DocumentPage[];

  contentType: PdfContentType;

  requiresOcr: boolean;
}
