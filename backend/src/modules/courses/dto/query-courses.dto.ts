export interface QueryCoursesDto {
  page?: number;
  limit?: number;

  search?: string;

  instituteId?: string;

  subjectId?: string;

  teacherId?: string;

  batchId?: string;

  semester?: number;

  academicYear?: string;

  isActive?: boolean;
}
