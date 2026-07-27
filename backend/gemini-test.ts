import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function main() {
  console.log("API Key loaded:", !!process.env.GEMINI_API_KEY);

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say hello.",
  });

  console.log(response.text);
}

main().catch(console.error);
