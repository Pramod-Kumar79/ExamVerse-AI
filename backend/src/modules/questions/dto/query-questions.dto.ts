// import { DifficultyLevel, QuestionType } from "@prisma/client";

// export type QuestionSortField =
//   | "createdAt"
//   | "updatedAt"
//   | "marks"
//   | "difficulty"
//   | "year";

// export type SortOrder = "asc" | "desc";

// export interface QueryQuestionsDto {
//   page?: number;

//   limit?: number;

//   search?: string;

//   type?: QuestionType;

//   difficulty?: DifficultyLevel;

//   chapter?: string;

//   topic?: string;

//   isActive?: boolean;

//   aiGenerated?: boolean;

//   year?: number;

//   source?: string;

//   sortBy?: QuestionSortField;

//   sortOrder?: SortOrder;
// }

import { DifficultyLevel, QuestionType } from "@prisma/client";

export type QuestionSortField =
  | "createdAt"
  | "updatedAt"
  | "marks"
  | "difficulty"
  | "year";

export type SortOrder = "asc" | "desc";

// Controls which slice of the question bank a query can see:
// - "shared": the teacher/admin bank (excludes anything created by students)
// - "own": only questions created by ownerId (a student's personal bank)
// - "own_and_shared": ownerId's own questions plus the shared bank (used when
//   picking questions for a practice exam, so students can draw on both)
export type QuestionScope = "shared" | "own" | "own_and_shared";

export interface QueryQuestionsDto {
  page?: number;

  limit?: number;

  search?: string;

  type?: QuestionType;

  difficulty?: DifficultyLevel;

  chapter?: string;

  topic?: string;

  isActive?: boolean;

  aiGenerated?: boolean;

  year?: number;

  source?: string;

  sortBy?: QuestionSortField;

  sortOrder?: SortOrder;

  scope?: QuestionScope;

  ownerId?: string;

  instituteId?: string;
}