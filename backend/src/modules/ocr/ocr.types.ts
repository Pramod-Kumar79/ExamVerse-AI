import type { DocumentPage } from "./../../common/types";

export interface OcrMetadata {
  provider: string;
  pageCount: number;
  averageConfidence: number;
}

export interface OcrResult {
  metadata: OcrMetadata;
  pages: DocumentPage[];
}
