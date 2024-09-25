// src/common/interfaces/api-response.interface.ts
export interface ErrorResponse {
  code: number;
  message: string;
}

export interface DataResponse {
  result: boolean;
}

export interface ApiResponse {
  error: ErrorResponse | null;
  data: DataResponse;
}
