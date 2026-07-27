export interface PaginationOptions {
  page: number;
  limit: number;
}

export function resolvePagination(
  page?: number,
  limit?: number,
): PaginationOptions {
  return {
    page: page ?? 1,
    limit: limit ?? 10,
  };
}
