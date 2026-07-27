import type { Prisma } from "@prisma/client";
export interface SaveAnswerDto {
  questionId: string;

  answer: Prisma.InputJsonValue;
}
