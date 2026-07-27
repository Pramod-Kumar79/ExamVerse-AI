import type { IAiProvider } from "../providers";

import type { IAiService } from "./ai.service.interface";

export class AiService implements IAiService {
  constructor(private readonly aiProvider: IAiProvider) {}

  async generateContent(prompt: string): Promise<string> {
    return this.aiProvider.generateContent(prompt);
  }
}
