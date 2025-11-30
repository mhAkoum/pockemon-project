import apiClient from './api';
import type { LoginRequest, SubscribeRequest, AuthResponse } from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  async subscribe(userData: SubscribeRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/subscribe', userData);
    return response.data;
  },
};
