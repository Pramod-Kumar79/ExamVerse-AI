// export interface CreateExamDto {
//   title: string;

//   description?: string;

//   instructions?: string;

//   courseId: string;

//   startTime: Date;

//   endTime: Date;

//   durationMinutes: number;

//   totalMarks: number;

//   passingMarks: number;

//   negativeMarking?: boolean;

//   shuffleQuestions?: boolean;

//   shuffleOptions?: boolean;

//   showResultImmediately?: boolean;

//   maxAttempts?: number;
// }

export interface CreateExamDto {
  title: string;

  description?: string;

  instructions?: string;

  courseId?: string;

  createdByUserId?: string;

  isPractice?: boolean;

  isPublished?: boolean;

  startTime: Date;

  endTime: Date;

  durationMinutes: number;

  totalMarks: number;

  passingMarks: number;

  negativeMarking?: boolean;

  shuffleQuestions?: boolean;

  shuffleOptions?: boolean;

  showResultImmediately?: boolean;

  maxAttempts?: number;
}