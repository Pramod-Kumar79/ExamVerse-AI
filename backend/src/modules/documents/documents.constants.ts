export const DOCUMENTS_DEFAULT_PAGE = 1;

export const DOCUMENTS_DEFAULT_LIMIT = 10;

export const DOCUMENTS_MAX_LIMIT = 100;

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  "image/jpeg",
  "image/png",
] as const;

export const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50 MB
