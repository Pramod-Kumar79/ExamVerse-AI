export interface QueryBatchesDto {
  page?: number;
  limit?: number;

  search?: string;

  instituteId?: string;

  academicYear?: string;

  semester?: number;

  isActive?: boolean;
}
