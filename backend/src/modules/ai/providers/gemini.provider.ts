import { GoogleGenAI } from "@google/genai";

import { env } from "../../../config/env";
import { logger } from "../../../lib/logger";

import { AI_MODEL } from "../ai.constants";

import type { IAiProvider } from "./ai.provider.interface";

export class GeminiProvider implements IAiProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  async generateContent(prompt: string): Promise<string> {
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        logger.info(
          {
            attempt,
            model: AI_MODEL.GEMINI_FLASH,
          },
          "Sending request to Gemini",
        );

        const response = await this.client.models.generateContent({
          model: AI_MODEL.GEMINI_FLASH,
          contents: prompt,
        });

        logger.info("Gemini response received.");

        const text = response.text ?? "";

        logger.info(
          {
            length: text.length,
          },
          "Gemini text extracted.",
        );

        if (!text.trim()) {
          throw new Error("Gemini returned an empty response.");
        }

        return text;
      } catch (error: any) {
        const message = error?.message ?? "";

        const retryable =
          message.includes("503") ||
          message.includes("UNAVAILABLE") ||
          message.includes("429");

        logger.warn(
          {
            attempt,
            retryable,
            error: message,
          },
          "Gemini request failed",
        );

        if (retryable && attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        }

        logger.error(
          {
            err: error,
          },
          "Gemini provider failed",
        );

        throw new Error("AI service is temporarily unavailable.");
      }
    }

    throw new Error("Gemini request failed.");
  }
}
