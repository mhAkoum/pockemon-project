import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { tradeService } from '../services/tradeService';
import { pokemonService } from '../services/pokemonService';
import { trainerService } from '../services/trainerService';
import { storage } from '../utils/storage';
import TradeDetail from './TradeDetail';

const mockNavigate = vi.fn();

vi.mock('../services/tradeService', () => ({
  tradeService: {
    getTrade: vi.fn(),
    updateTrade: vi.fn(),
  },
}));

vi.mock('../services/pokemonService', () => ({
  pokemonService: {
    getPokemon: vi.fn(),
  },
}));

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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock window.confirm
global.window.confirm = vi.fn(() => true);

describe('TradeDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(2);
  });

  it('renders loading state initially', () => {
    vi.mocked(tradeService.getTrade).mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <MemoryRouter initialEntries={['/trades/1']}>
        <AuthProvider>
          <TradeDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/loading trade details/i)).toBeInTheDocument();
  });

  it('displays trade details when loaded', async () => {
    const mockTrade = {
      id: 1,
      statusCode: 'PROPOSITION' as const,
      sender: { id: 1, pokemons: [] },
      receiver: { id: 2, pokemons: [] },
    };
    vi.mocked(tradeService.getTrade).mockResolvedValue(mockTrade as never);
    vi.mocked(trainerService.getTrainer).mockResolvedValue({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      login: 'john@example.com',
      birthDate: '1990-01-01',
    } as never);

    render(
      <MemoryRouter initialEntries={['/trades/1']}>
        <AuthProvider>
          <TradeDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/trade details/i)).toBeInTheDocument();
    });
  });

  it('shows accept/decline buttons for receiver', async () => {
    const mockTrade = {
      id: 1,
      statusCode: 'PROPOSITION' as const,
      sender: { id: 1, pokemons: [] },
      receiver: { id: 2, pokemons: [] },
    };
    vi.mocked(tradeService.getTrade).mockResolvedValue(mockTrade as never);
    vi.mocked(pokemonService.getPokemon).mockResolvedValue({
      id: 1,
      species: 'Pikachu',
      name: 'Pika',
      level: 25,
      trainerId: 1,
    } as never);
    vi.mocked(trainerService.getTrainer).mockResolvedValue({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      login: 'john@example.com',
      birthDate: '1990-01-01',
    } as never);

    render(
      <MemoryRouter initialEntries={['/trades/1']}>
        <AuthProvider>
          <TradeDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/trade details/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays error message on failure', async () => {
    vi.mocked(tradeService.getTrade).mockRejectedValue(new Error('Trade not found'));

    render(
      <MemoryRouter initialEntries={['/trades/1']}>
        <AuthProvider>
          <TradeDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
