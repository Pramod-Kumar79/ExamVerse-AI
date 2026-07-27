export interface UpdateCourseDto {
  name?: string;
  code?: string;

  description?: string;

  subjectId?: string;
  teacherId?: string;
  batchId?: string;

  academicYear?: string;

  semester?: number;

  credits?: number;

  isActive?: boolean;
}
