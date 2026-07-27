import {
  BloomLevel,
  DifficultyLevel,
  QuestionType,
  Prisma,
} from "@prisma/client";

export interface UpdateQuestionOptionDto {
  optionText: string;

  imageUrl?: string;

  isCorrect: boolean;

  displayOrder: number;
}

export interface UpdateQuestionDto {
  title?: string;

  description?: string;

  type?: QuestionType;

  difficulty?: DifficultyLevel;

  bloomLevel?: BloomLevel;

  chapter?: string;

  topic?: string;

  explanation?: string;

  solution?: string;

  marks?: number;

  negativeMarks?: number;

  estimatedTime?: number;

  source?: string;

  year?: number;

  language?: string;

  tags?: string[];

  answer?: Prisma.InputJsonValue;

  aiGenerated?: boolean;

  imageUrl?: string;

  latexContent?: string;

  codeSnippet?: string;

  isActive?: boolean;

  options?: UpdateQuestionOptionDto[];
}
