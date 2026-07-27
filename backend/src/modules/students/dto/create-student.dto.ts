export interface CreateStudentDto {
  userId: string;
  batchId: string;

  rollNumber?: string;

  semester?: number;
}
