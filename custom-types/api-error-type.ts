export interface ApiError {
  message: string;
  data: unknown;
  errors?: string[];
}
