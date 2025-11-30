import React, {
  createContext, useContext, useState, useEffect, useCallback, useMemo,
} from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
import type { LoginRequest, SubscribeRequest, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  subscribe: (userData: SubscribeRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    trainerId: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = storage.getToken();
    const trainerId = storage.getTrainerId();

    if (token && trainerId) {
      setAuthState({
        isAuthenticated: true,
        token,
        trainerId,
      });
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    storage.setToken(response.accessToken);
    storage.setTrainerId(response.trainerId);

    setAuthState({
      isAuthenticated: true,
      token: response.accessToken,
      trainerId: response.trainerId,
    });
  }, []);

  const subscribe = useCallback(async (userData: SubscribeRequest) => {
    const response = await authService.subscribe(userData);
    storage.setToken(response.accessToken);
    storage.setTrainerId(response.trainerId);

    setAuthState({
      isAuthenticated: true,
      token: response.accessToken,
      trainerId: response.trainerId,
    });
  }, []);

  const logout = useCallback(() => {
    storage.clear();
    setAuthState({
      isAuthenticated: false,
      token: null,
      trainerId: null,
    });
  }, []);

  const value: AuthContextType = useMemo(() => ({
    ...authState,
    login,
    subscribe,
    logout,
    loading,
  }), [authState, login, subscribe, logout, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
