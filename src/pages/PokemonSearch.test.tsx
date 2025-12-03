import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { pokemonService } from '../services/pokemonService';
import PokemonSearch from './PokemonSearch';

vi.mock('../services/pokemonService', () => ({
  pokemonService: {
    searchPokemons: vi.fn(),
  },
}));

describe('PokemonSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search form', () => {
    render(
      <BrowserRouter>
        <PokemonSearch />
      </BrowserRouter>,
    );

    expect(screen.getByRole('heading', { name: /search pokémons/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/species/i)).toBeInTheDocument();
  });

  it('displays pokemons when loaded', async () => {
    const mockPokemons = [
      { id: 1, species: 'Pikachu', name: 'Pika', level: 25, trainerId: 1 },
      { id: 2, species: 'Charizard', name: 'Char', level: 50, trainerId: 1 },
    ];
    vi.mocked(pokemonService.searchPokemons).mockResolvedValue(mockPokemons as never);

    render(
      <BrowserRouter>
        <PokemonSearch />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText('Charizard')).toBeInTheDocument();
  });

  it('allows filtering by species', async () => {
    const user = userEvent.setup();
    vi.mocked(pokemonService.searchPokemons).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <PokemonSearch />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/species/i)).toBeInTheDocument();
    });

    const speciesInput = screen.getByLabelText(/species/i);
    await user.type(speciesInput, 'Pikachu');

    await waitFor(() => {
      expect(pokemonService.searchPokemons).toHaveBeenCalledWith(
        expect.objectContaining({ species: 'Pikachu' }),
      );
    });
  });

  it('displays empty state when no results', async () => {
    vi.mocked(pokemonService.searchPokemons).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <PokemonSearch />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/no pokémons found/i)).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    vi.mocked(pokemonService.searchPokemons).mockRejectedValue(new Error('Search failed'));

    render(
      <BrowserRouter>
        <PokemonSearch />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

