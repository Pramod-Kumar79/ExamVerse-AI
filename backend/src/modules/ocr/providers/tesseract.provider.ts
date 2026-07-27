// import type { IOcrProvider } from "./ocr.provider.interface";
// import type { OcrResult } from "../ocr.types";

// export class TesseractProvider implements IOcrProvider {
//   async extractText(_filePath: string): Promise<OcrResult> {
//     throw new Error("Tesseract OCR not implemented yet.");
//   }
// }


import { createWorker } from "tesseract.js";
import { getDocumentProxy, renderPageAsImage } from "unpdf";
import fs from "fs/promises";

import { DEFAULT_LANGUAGE } from "../ocr.constants";

import type { IOcrProvider } from "./ocr.provider.interface";
import type { OcrResult } from "../ocr.types";

// Cap how many pages we OCR per document to keep processing time and memory
// bounded for very long uploads. Most question papers are well under this.
const MAX_OCR_PAGES = 20;

export class TesseractProvider implements IOcrProvider {
  async extractText(filePath: string): Promise<OcrResult> {
    const buffer = await fs.readFile(filePath);

    // A plain proxy (no canvas factory) is enough just to read the page count.
    const document = await getDocumentProxy(new Uint8Array(buffer));
    const pageCount = Math.min(document.numPages, MAX_OCR_PAGES);

    const worker = await createWorker(DEFAULT_LANGUAGE);

    const pages: OcrResult["pages"] = [];
    let confidenceSum = 0;

    try {
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
        // renderPageAsImage wires up its own canvas-aware document internally
        // when given raw bytes, and each call needs its own untouched
        // Uint8Array (the underlying buffer gets detached after use).
        const pageBytes = new Uint8Array(buffer.length);
        pageBytes.set(buffer);

        const imageBuffer = await renderPageAsImage(pageBytes, pageNumber, {
          canvasImport: () => import("@napi-rs/canvas"),
          scale: 2,
        });

        const {
          data: { text, confidence },
        } = await worker.recognize(Buffer.from(imageBuffer));

        const normalizedConfidence =
          typeof confidence === "number" ? confidence / 100 : 0;

        confidenceSum += normalizedConfidence;

        pages.push({
          pageNumber,
          text: text ?? "",
          hasText: Boolean(text && text.trim().length > 0),
          confidence: normalizedConfidence,
          language: DEFAULT_LANGUAGE,
        });
      }
    } finally {
      await worker.terminate();
    }

    return {
      metadata: {
        provider: "tesseract",
        pageCount: pages.length,
        averageConfidence: pages.length > 0 ? confidenceSum / pages.length : 0,
      },
      pages,
    };
  }
}
