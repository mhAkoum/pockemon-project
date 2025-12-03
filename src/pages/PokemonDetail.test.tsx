import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { pokemonService } from '../services/pokemonService';
import { storage } from '../utils/storage';
import PokemonDetail from './PokemonDetail';

const mockNavigate = vi.fn();

vi.mock('../services/pokemonService', () => ({
  pokemonService: {
    getPokemon: vi.fn(),
    deletePokemon: vi.fn(),
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

describe('PokemonDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
  });

  it('renders loading state initially', () => {
    vi.mocked(pokemonService.getPokemon).mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <MemoryRouter initialEntries={['/pokemons/1']}>
        <AuthProvider>
          <PokemonDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/loading pokémon details/i)).toBeInTheDocument();
  });

  it('displays pokemon details when loaded', async () => {
    const mockPokemon = {
      id: 1,
      species: 'Pikachu',
      name: 'Pika',
      level: 25,
      genderTypeCode: 'MALE' as const,
      size: 40,
      weight: 6,
      isShiny: false,
      trainerId: 1,
      boxId: 1,
    };
    vi.mocked(pokemonService.getPokemon).mockResolvedValue(mockPokemon as never);

    render(
      <MemoryRouter initialEntries={['/pokemons/1']}>
        <AuthProvider>
          <PokemonDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText('Pika')).toBeInTheDocument();
    expect(screen.getByText(/level.*25/i)).toBeInTheDocument();
  });

  it('shows delete button for owner', async () => {
    const mockPokemon = {
      id: 1,
      species: 'Pikachu',
      name: 'Pika',
      level: 25,
      trainerId: 1,
      boxId: 1,
    };
    vi.mocked(pokemonService.getPokemon).mockResolvedValue(mockPokemon as never);

    render(
      <MemoryRouter initialEntries={['/pokemons/1']}>
        <AuthProvider>
          <PokemonDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    vi.mocked(pokemonService.getPokemon).mockRejectedValue(new Error('Pokemon not found'));

    render(
      <MemoryRouter initialEntries={['/pokemons/1']}>
        <AuthProvider>
          <PokemonDetail />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
