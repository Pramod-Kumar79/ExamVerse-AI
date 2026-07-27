export interface ReorderExamQuestionDto {
  questionId: string;

  displayOrder: number;
}

export interface ReorderExamQuestionsDto {
  questions: ReorderExamQuestionDto[];
}
