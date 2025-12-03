import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { boxService } from '../services/boxService';
import { storage } from '../utils/storage';
import BoxDetail from './BoxDetail';

vi.mock('../services/boxService', () => ({
  boxService: {
    getBox: vi.fn(),
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

describe('BoxDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
  });

  it('renders loading state initially', () => {
    vi.mocked(boxService.getBox).mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <MemoryRouter initialEntries={['/boxes/1']}>
        <AuthProvider>
          <BoxDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/loading box details/i)).toBeInTheDocument();
  });

  it('displays box details when loaded', async () => {
    const mockBox = {
      id: 1,
      name: 'Test Box',
      pokemons: [
        { id: 1, species: 'Pikachu', name: 'Pika', level: 25 },
        { id: 2, species: 'Charizard', name: 'Char', level: 50 },
      ],
    };
    vi.mocked(boxService.getBox).mockResolvedValue(mockBox as never);

    render(
      <MemoryRouter initialEntries={['/boxes/1']}>
        <AuthProvider>
          <BoxDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test Box')).toBeInTheDocument();
    });

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Charizard')).toBeInTheDocument();
  });

  it('displays empty state when box has no pokemons', async () => {
    const mockBox = {
      id: 1,
      name: 'Empty Box',
      pokemons: [],
    };
    vi.mocked(boxService.getBox).mockResolvedValue(mockBox as never);

    render(
      <MemoryRouter initialEntries={['/boxes/1']}>
        <AuthProvider>
          <BoxDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Empty Box')).toBeInTheDocument();
    });

    expect(screen.getByText(/this box is empty/i)).toBeInTheDocument();
  });

  it('displays error message on failure', async () => {
    vi.mocked(boxService.getBox).mockRejectedValue(new Error('Box not found'));

    render(
      <MemoryRouter initialEntries={['/boxes/1']}>
        <AuthProvider>
          <BoxDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /back to boxes/i })).toBeInTheDocument();
  });
});

