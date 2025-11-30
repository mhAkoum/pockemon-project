import {
  describe, it, expect, beforeEach, vi,
} from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { storage } from '../utils/storage';

vi.mock('../utils/storage', () => ({
  storage: {
    getToken: vi.fn(),
    getTrainerId: vi.fn(),
    clear: vi.fn(),
    setToken: vi.fn(),
    setTrainerId: vi.fn(),
    removeToken: vi.fn(),
    removeTrainerId: vi.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide auth context functions', () => {
    vi.mocked(storage.getToken).mockReturnValue(null);
    vi.mocked(storage.getTrainerId).mockReturnValue(null);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.login).toBeDefined();
    expect(result.current.subscribe).toBeDefined();
    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.subscribe).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should handle logout', () => {
    vi.mocked(storage.getToken).mockReturnValue(null);
    vi.mocked(storage.getTrainerId).mockReturnValue(null);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(storage.clear).toHaveBeenCalled();
  });
});
