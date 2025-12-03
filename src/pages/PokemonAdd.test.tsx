import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { pokemonService } from '../services/pokemonService';
import { boxService } from '../services/boxService';
import { storage } from '../utils/storage';
import PokemonAdd from './PokemonAdd';

const mockNavigate = vi.fn();

vi.mock('../services/pokemonService', () => ({
  pokemonService: {
    createPokemon: vi.fn(),
  },
}));

vi.mock('../services/boxService', () => ({
  boxService: {
    getBoxes: vi.fn(),
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

describe('PokemonAdd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
    vi.mocked(boxService.getBoxes).mockResolvedValue([
      { id: 1, name: 'Box 1' },
      { id: 2, name: 'Box 2' },
    ] as never);
  });

  it('renders add pokemon form', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <PokemonAdd />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /add pokémon/i })).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/species/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
  });

  it('allows user to input pokemon data', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <PokemonAdd />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/species/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/species/i), 'Pikachu');
    await user.type(screen.getByLabelText(/name/i), 'Pika');

    expect(screen.getByLabelText(/species/i)).toHaveValue('Pikachu');
    expect(screen.getByLabelText(/name/i)).toHaveValue('Pika');
  });

  it('shows validation error for missing species', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <PokemonAdd />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add pokémon/i })).toBeInTheDocument();
    }, { timeout: 3000 });

    const submitButton = screen.getByRole('button', { name: /add pokémon/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/species is required/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('creates pokemon and navigates on success', async () => {
    const user = userEvent.setup();
    vi.mocked(pokemonService.createPokemon).mockResolvedValue({ id: 1 } as never);

    render(
      <BrowserRouter>
        <AuthProvider>
          <PokemonAdd />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/species/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    await user.type(screen.getByLabelText(/species/i), 'Pikachu');
    await user.type(screen.getByLabelText(/name/i), 'Pika');

    const boxSelect = screen.getByLabelText(/box/i);
    await user.selectOptions(boxSelect, '1');

    const submitButton = screen.getByRole('button', { name: /add pokémon/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(pokemonService.createPokemon).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});
