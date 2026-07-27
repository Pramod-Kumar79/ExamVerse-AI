import { ExamStatus } from "@prisma/client";

export interface QueryExamsDto {
  page?: number;

  limit?: number;

  search?: string;

  courseId?: string;

  status?: ExamStatus;

  isPublished?: boolean;
}
