export interface IAiProvider {
  generateContent(prompt: string): Promise<string>;
}
