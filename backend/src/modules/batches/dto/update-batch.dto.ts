export interface UpdateBatchDto {
  name?: string;
  code?: string;
  description?: string;

  academicYear?: string;
  semester?: number;

  startDate?: Date;
  endDate?: Date;

  isActive?: boolean;
}
