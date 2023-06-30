export interface PaginatedData<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
