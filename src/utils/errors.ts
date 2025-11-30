import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    if (error.response) {
      return {
        message: error.response.data?.message || `Request failed with status ${error.response.status}`,
        status: error.response.status,
        code: error.code,
      };
    }
    if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        code: error.code,
      };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
}

export function getErrorMessage(error: unknown): string {
  return handleApiError(error).message;
}
