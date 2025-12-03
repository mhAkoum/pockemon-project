import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('returns error message for Error instances', () => {
    const error = new Error('Standard error');
    expect(getErrorMessage(error)).toBe('Standard error');
  });

  it('returns default message for unknown errors', () => {
    const error = 'Unknown error type';
    expect(getErrorMessage(error)).toBe('An unexpected error occurred');
  });

  it('returns default message for null', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
  });

  it('returns default message for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
  });
});
