export interface LoginRequest {
  login: string;
  password: string;
}

export interface SubscribeRequest {
  firstName: string;
  lastName: string;
  login: string;
  birthDate: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  trainerId: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  trainerId: number | null;
}
