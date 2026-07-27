// export type UserRole = "STUDENT" | "TEACHER" | "INSTITUTE" | "ADMIN";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   avatar?: string | null;
//   instituteId?: string | null;
//   createdAt?: string;
// }

// export interface ApiSuccess<T> {
//   success: true;
//   message: string;
//   data: T;
// }

// export interface Institute {
//   id: string;
//   name: string;
//   code: string;
//   email?: string | null;
//   phone?: string | null;
//   website?: string | null;
//   logo?: string | null;
//   address?: string | null;
//   createdAt?: string;
// }

// export interface Subject {
//   id: string;
//   name: string;
//   code?: string | null;
//   description?: string | null;
//   isActive?: boolean;
// }

// export interface Batch {
//   id: string;
//   name: string;
//   code?: string | null;
//   description?: string | null;
//   academicYear?: string | null;
//   semester?: number | null;
//   instituteId: string;
//   isActive?: boolean;
// }

// export interface TeacherProfile {
//   id: string;
//   userId: string;
//   designation?: string | null;
//   qualification?: string | null;
//   experience?: number | null;
//   user?: User;
// }

// export interface StudentProfile {
//   id: string;
//   userId: string;
//   batchId?: string | null;
//   rollNumber?: string | null;
//   semester?: number | null;
//   user?: User;
// }

// export interface Course {
//   id: string;
//   name: string;
//   code: string;
//   description?: string | null;
//   instituteId: string;
//   subjectId: string;
//   teacherId: string;
//   batchId: string;
//   academicYear?: string | null;
//   semester?: number | null;
//   credits?: number | null;
//   isActive?: boolean;
//   subject?: Subject;
//   teacher?: TeacherProfile;
//   batch?: Batch;
// }

// export type QuestionType =
//   | "MCQ"
//   | "MULTIPLE_SELECT"
//   | "TRUE_FALSE"
//   | "NUMERICAL"
//   | "SHORT_ANSWER"
//   | "LONG_ANSWER"
//   | "CODING";

// export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

// export interface QuestionOption {
//   id?: string;
//   optionText: string;
//   imageUrl?: string | null;
//   isCorrect: boolean;
//   displayOrder: number;
// }

// export interface Question {
//   id: string;
//   title: string;
//   description?: string | null;
//   type: QuestionType;
//   difficulty?: DifficultyLevel | null;
//   chapter?: string | null;
//   topic?: string | null;
//   explanation?: string | null;
//   solution?: string | null;
//   imageUrl?: string | null;
//   marks?: number | null;
//   tags?: string[];
//   aiGenerated?: boolean;
//   options?: QuestionOption[];
//   isActive?: boolean;
//   createdAt?: string;
// }

// export type ExamStatus =
//   | "DRAFT"
//   | "SCHEDULED"
//   | "LIVE"
//   | "COMPLETED"
//   | "ARCHIVED";

// export interface Exam {
//   id: string;
//   title: string;
//   description?: string | null;
//   instructions?: string | null;
//   courseId: string;
//   startTime: string;
//   endTime: string;
//   durationMinutes: number;
//   totalMarks: number;
//   passingMarks: number;
//   status?: ExamStatus;
//   negativeMarking?: boolean;
//   shuffleQuestions?: boolean;
//   shuffleOptions?: boolean;
//   showResultImmediately?: boolean;
//   maxAttempts?: number | null;
//   isPublished?: boolean;
//   course?: Course;
//   examQuestions?: {
//     id?: string;
//     questionId: string;
//     marks?: number;
//     negativeMarks?: number;
//     displayOrder: number;
//     question: Question;
//   }[];
// }

// export interface UploadedDocument {
//   id: string;
//   originalName: string;
//   storedName: string;
//   mimeType: string;
//   fileSize: number;
//   status: string;
//   pageCount?: number | null;
//   createdAt?: string;
// }

// export interface ExamAttempt {
//   id: string;
//   examId: string;
//   studentId?: string;
//   status: string;
//   startedAt?: string;
//   submittedAt?: string | null;
//   score?: number | null;
//   answers?: {
//     questionId: string;
//     answer: unknown;
//     obtainedMarks?: number | null;
//     evaluated?: boolean;
//   }[];
// }

export type UserRole = "STUDENT" | "TEACHER" | "INSTITUTE" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  instituteId?: string | null;
  createdAt?: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface Institute {
  id: string;
  name: string;
  code: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  logo?: string | null;
  address?: string | null;
  createdAt?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface Batch {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  academicYear?: string | null;
  semester?: number | null;
  instituteId: string;
  isActive?: boolean;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  designation?: string | null;
  qualification?: string | null;
  experience?: number | null;
  user?: User;
}

export interface StudentProfile {
  id: string;
  userId: string;
  batchId?: string | null;
  rollNumber?: string | null;
  semester?: number | null;
  user?: User;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  instituteId: string;
  subjectId: string;
  teacherId: string;
  batchId: string;
  academicYear?: string | null;
  semester?: number | null;
  credits?: number | null;
  isActive?: boolean;
  subject?: Subject;
  teacher?: TeacherProfile;
  batch?: Batch;
}

export type QuestionType =
  | "MCQ"
  | "MULTIPLE_SELECT"
  | "TRUE_FALSE"
  | "NUMERICAL"
  | "SHORT_ANSWER"
  | "LONG_ANSWER"
  | "CODING";

export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

export interface QuestionOption {
  id?: string;
  optionText: string;
  imageUrl?: string | null;
  isCorrect: boolean;
  displayOrder: number;
}

export interface Question {
  id: string;
  title: string;
  description?: string | null;
  type: QuestionType;
  difficulty?: DifficultyLevel | null;
  chapter?: string | null;
  topic?: string | null;
  explanation?: string | null;
  solution?: string | null;
  imageUrl?: string | null;
  marks?: number | null;
  tags?: string[];
  aiGenerated?: boolean;
  options?: QuestionOption[];
  isActive?: boolean;
  createdAt?: string;
}

export type ExamStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "LIVE"
  | "COMPLETED"
  | "ARCHIVED";

export interface Exam {
  id: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  courseId?: string | null;
  isPractice?: boolean;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  status?: ExamStatus;
  negativeMarking?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showResultImmediately?: boolean;
  maxAttempts?: number | null;
  isPublished?: boolean;
  course?: Course;
  examQuestions?: {
    id?: string;
    questionId: string;
    marks?: number;
    negativeMarks?: number;
    displayOrder: number;
    question: Question;
  }[];
}

export interface UploadedDocument {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  fileSize: number;
  status: string;
  pageCount?: number | null;
  createdAt?: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId?: string;
  status: string;
  startedAt?: string;
  submittedAt?: string | null;
  score?: number | null;
  answers?: {
    questionId: string;
    answer: unknown;
    obtainedMarks?: number | null;
    evaluated?: boolean;
  }[];
}