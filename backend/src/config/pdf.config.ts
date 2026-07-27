import path from "path";

export const PDF_CONFIG = {
  standardFontDataUrl: path.join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "standard_fonts",
  ),
};
