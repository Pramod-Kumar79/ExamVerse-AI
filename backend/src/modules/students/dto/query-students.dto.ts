export interface QueryStudentsDto {
  page?: number;

  limit?: number;

  batchId?: string;

  semester?: number;

  search?: string;

  instituteId?: string;
}
