import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { trainerService } from '../services/trainerService';
import { storage } from '../utils/storage';
import TrainerSearch from './TrainerSearch';

vi.mock('../services/trainerService', () => ({
  trainerService: {
    searchTrainers: vi.fn(),
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

describe('TrainerSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
  });

  it('renders search form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TrainerSearch />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByRole('heading', { name: /search trainers/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  });

  it('displays trainers when loaded', async () => {
    const mockTrainers = [
      {
        id: 1, firstName: 'John', lastName: 'Doe', login: 'john@example.com',
      },
      {
        id: 2, firstName: 'Jane', lastName: 'Smith', login: 'jane@example.com',
      },
    ];
    vi.mocked(trainerService.searchTrainers).mockResolvedValue(mockTrainers as never);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TrainerSearch />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('allows filtering by first name', async () => {
    const user = userEvent.setup();
    vi.mocked(trainerService.searchTrainers).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TrainerSearch />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.type(firstNameInput, 'John');

    await waitFor(() => {
      expect(trainerService.searchTrainers).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'John' }),
      );
    });
  });

  it('displays empty state when no results', async () => {
    vi.mocked(trainerService.searchTrainers).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TrainerSearch />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/no trainers found/i)).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    vi.mocked(trainerService.searchTrainers).mockRejectedValue(new Error('Search failed'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <TrainerSearch />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
