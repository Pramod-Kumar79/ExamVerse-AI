import { BloomLevel, DifficultyLevel, QuestionType } from "@prisma/client";

export interface CreateQuestionDto {
  title: string;

  description?: string;

  type: QuestionType;

  difficulty?: DifficultyLevel;

  bloomLevel?: BloomLevel;

  chapter?: string;

  topic?: string;

  explanation?: string;

  solution?: string;

  tags?: string[];

  aiGenerated?: boolean;

  imageUrl?: string;

  latexContent?: string;

  codeSnippet?: string;

}
