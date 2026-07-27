import { QuestionResponseValidator } from "../validator";

export class JsonResponseParser {
  static parse(response: string) {
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No valid JSON found in AI response.");
    }

    const json = cleaned.substring(start, end + 1);

    const parsed = JSON.parse(json);

    return QuestionResponseValidator.validate(parsed);
  }
}
