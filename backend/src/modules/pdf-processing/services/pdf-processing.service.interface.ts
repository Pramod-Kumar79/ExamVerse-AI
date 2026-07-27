import type { PdfProcessingResult } from "../pdf-processing.types";

export interface IPdfProcessingService {
  analyzeDocument(filePath: string): Promise<PdfProcessingResult>;
}
