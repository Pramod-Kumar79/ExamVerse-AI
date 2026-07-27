import { QuestionType } from "@prisma/client";

export function mapQuestionType(type: string): QuestionType {
  switch (type) {
    case "MCQ":
      return QuestionType.MCQ;

    case "MULTIPLE_SELECT":
      return QuestionType.MULTIPLE_SELECT;

    case "TRUE_FALSE":
      return QuestionType.TRUE_FALSE;

    case "NUMERICAL":
      return QuestionType.NUMERICAL;

    case "SHORT_ANSWER":
      return QuestionType.SHORT_ANSWER;

    case "LONG_ANSWER":
      return QuestionType.LONG_ANSWER;

    default:
      return QuestionType.LONG_ANSWER;
  }
}
