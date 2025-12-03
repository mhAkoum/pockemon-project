import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getToken', () => {
    it('returns token from localStorage', () => {
      localStorage.setItem('authToken', 'test-token');
      expect(storage.getToken()).toBe('test-token');
    });

    it('returns null when token does not exist', () => {
      expect(storage.getToken()).toBeNull();
    });
  });

  describe('getTrainerId', () => {
    it('returns trainerId from localStorage', () => {
      localStorage.setItem('trainerId', '123');
      expect(storage.getTrainerId()).toBe(123);
    });

    it('returns null when trainerId does not exist', () => {
      expect(storage.getTrainerId()).toBeNull();
    });
  });

  describe('setToken', () => {
    it('sets token in localStorage', () => {
      storage.setToken('new-token');
      expect(localStorage.getItem('authToken')).toBe('new-token');
    });
  });

  describe('setTrainerId', () => {
    it('sets trainerId in localStorage', () => {
      storage.setTrainerId(456);
      expect(localStorage.getItem('trainerId')).toBe('456');
    });
  });

  describe('removeToken', () => {
    it('removes token from localStorage', () => {
      localStorage.setItem('authToken', 'test-token');
      storage.removeToken();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('removeTrainerId', () => {
    it('removes trainerId from localStorage', () => {
      localStorage.setItem('trainerId', '123');
      storage.removeTrainerId();
      expect(localStorage.getItem('trainerId')).toBeNull();
    });
  });

  describe('clear', () => {
    it('removes both token and trainerId from localStorage', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('trainerId', '123');
      storage.clear();
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('trainerId')).toBeNull();
    });
  });
});

