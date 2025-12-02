import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    if (error.response) {
      const { data: responseData, status } = error.response;
      let message = `Request failed with status ${status}`;

      if (typeof responseData === 'string') {
        message = responseData || message;
      } else if (responseData?.message) {
        message = responseData.message;
      } else if (responseData?.error) {
        message = responseData.error;
      } else if (responseData && typeof responseData === 'object') {
        const errorText = JSON.stringify(responseData);
        if (errorText !== '{}') {
          message = errorText;
        }
      }

      if (status === 500) {
        message = `Server error: ${message}. Please check the backend logs or try again.`;
      }

      return {
        message,
        status,
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
