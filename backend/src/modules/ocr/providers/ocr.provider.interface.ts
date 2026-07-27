import type { OcrResult } from "../ocr.types";

export interface IOcrProvider {
  extractText(filePath: string): Promise<OcrResult>;
}
