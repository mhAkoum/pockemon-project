import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { trainerService } from '../services/trainerService';
import { storage } from '../utils/storage';
import TrainerProfile from './TrainerProfile';

vi.mock('../services/trainerService', () => ({
  trainerService: {
    getTrainer: vi.fn(),
  },
}));

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

describe('TrainerProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
  });

  it('renders loading state initially', () => {
    vi.mocked(trainerService.getTrainer).mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AuthProvider>
          <TrainerProfile />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/loading trainer profile/i)).toBeInTheDocument();
  });

  it('displays trainer profile when loaded', async () => {
    const mockTrainer = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      login: 'john@example.com',
      birthDate: '1990-01-01T00:00:00Z',
    };
    vi.mocked(trainerService.getTrainer).mockResolvedValue(mockTrainer as never);

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AuthProvider>
          <TrainerProfile />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('shows edit button for own profile', async () => {
    const mockTrainer = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      login: 'john@example.com',
      birthDate: '1990-01-01T00:00:00Z',
    };
    vi.mocked(trainerService.getTrainer).mockResolvedValue(mockTrainer as never);

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AuthProvider>
          <TrainerProfile />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /edit profile/i })).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    vi.mocked(trainerService.getTrainer).mockRejectedValue(new Error('Trainer not found'));

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AuthProvider>
          <TrainerProfile />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
