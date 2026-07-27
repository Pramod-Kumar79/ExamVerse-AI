export interface DocumentPage {
  pageNumber: number;
  text: string;
  hasText: boolean;
  confidence?: number;
  language?: string;
}
