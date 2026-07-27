import fs from "fs/promises";

import { extractText, getDocumentProxy } from "unpdf";

import { PDF_CONFIG } from "../../../config/pdf.config";

import type { PdfProcessingResult } from "../pdf-processing.types";

import type { IPdfProcessingService } from "./pdf-processing.service.interface";

export class PdfProcessingService implements IPdfProcessingService {
  async analyzeDocument(filePath: string): Promise<PdfProcessingResult> {
    const buffer = await fs.readFile(filePath);

    const document = await getDocumentProxy(new Uint8Array(buffer));

    const { text } = await extractText(document, {
      mergePages: false,
    });

    const pages = text.map((pageText, index) => ({
      pageNumber: index + 1,
      text: pageText,
      hasText: pageText.trim().length > 0,
    }));
    const hasText = pages.some((page) => page.hasText);

return {
  metadata: {
    pageCount: document.numPages,

    textLength: pages.reduce((sum, page) => sum + page.text.length, 0),

    hasText,

    title: undefined,
    author: undefined,
    subject: undefined,
    creator: undefined,
    producer: undefined,

    isEncrypted: false,
  },

  pages,

  contentType: hasText ? "NATIVE_TEXT" : "SCANNED",

  requiresOcr: !hasText,
};
  }
}
