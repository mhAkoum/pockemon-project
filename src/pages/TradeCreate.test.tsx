import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { trainerService } from '../services/trainerService';
import { storage } from '../utils/storage';
import TradeCreate from './TradeCreate';

const mockNavigate = vi.fn();

vi.mock('../services/tradeService', () => ({
  tradeService: {
    createTrade: vi.fn(),
  },
}));

vi.mock('../services/trainerService', () => ({
  trainerService: {
    getTrainer: vi.fn(),
  },
}));

vi.mock('../services/pokemonService', () => ({
  pokemonService: {
    getPokemon: vi.fn(),
    getTrainerPokemons: vi.fn(),
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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TradeCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
    vi.mocked(trainerService.getTrainer).mockResolvedValue({
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      login: 'jane@example.com',
      birthDate: '1990-01-01',
    } as never);
  });

  it('renders loading state initially', () => {
    vi.mocked(trainerService.getTrainer).mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <MemoryRouter initialEntries={['/trades/create?receiverId=2']}>
        <AuthProvider>
          <TradeCreate />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays create trade form when receiver loaded', async () => {
    render(
      <MemoryRouter initialEntries={['/trades/create?receiverId=2']}>
        <AuthProvider>
          <TradeCreate />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create trade/i })).toBeInTheDocument();
    });
  });

  it('displays error when receiver ID missing', async () => {
    render(
      <MemoryRouter initialEntries={['/trades/create']}>
        <AuthProvider>
          <TradeCreate />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/receiver id not found/i)).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    vi.mocked(trainerService.getTrainer).mockRejectedValue(new Error('Trainer not found'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <TradeCreate />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
