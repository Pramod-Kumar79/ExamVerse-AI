export interface CreateBatchDto {
  name: string;
  code?: string;
  description?: string;

  academicYear?: string;
  semester?: number;

  startDate?: Date;
  endDate?: Date;

  instituteId: string;
}
