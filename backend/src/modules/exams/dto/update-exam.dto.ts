import { ExamStatus } from "@prisma/client";

export interface UpdateExamDto {
  title?: string;

  description?: string;

  instructions?: string;

  startTime?: Date;

  endTime?: Date;

  durationMinutes?: number;

  totalMarks?: number;

  passingMarks?: number;

  negativeMarking?: boolean;

  shuffleQuestions?: boolean;

  shuffleOptions?: boolean;

  showResultImmediately?: boolean;

  maxAttempts?: number;

  status?: ExamStatus;

  isPublished?: boolean;
}
