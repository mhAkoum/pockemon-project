import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { authService } from './authService';
import apiClient from './api';

vi.mock('./api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login calls API with correct endpoint and data', async () => {
    const mockResponse = { data: { accessToken: 'token', trainerId: 1 } };
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const credentials = { login: 'test@example.com', password: 'password123' };
    const result = await authService.login(credentials);

    expect(apiClient.post).toHaveBeenCalledWith('/login', credentials);
    expect(result).toEqual(mockResponse.data);
  });

  it('subscribe calls API with correct endpoint and data', async () => {
    const mockResponse = { data: { accessToken: 'token', trainerId: 1 } };
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'john@example.com',
      birthDate: '1990-01-01',
      password: 'password123',
    };
    const result = await authService.subscribe(userData);

    expect(apiClient.post).toHaveBeenCalledWith('/subscribe', userData);
    expect(result).toEqual(mockResponse.data);
  });
});

