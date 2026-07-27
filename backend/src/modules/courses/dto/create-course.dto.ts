export interface CreateCourseDto {
  name: string;
  code: string;

  description?: string;

  instituteId: string;
  subjectId: string;
  teacherId: string;
  batchId: string;

  academicYear?: string;

  semester?: number;

  credits?: number;
}
