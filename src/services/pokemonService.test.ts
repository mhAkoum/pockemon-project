import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { pokemonService } from './pokemonService';
import apiClient from './api';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('pokemonService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searchPokemons calls API with correct endpoint and params', async () => {
    const mockResponse = { data: [{ id: 1, species: 'Pikachu' }] };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const params = { species: 'Pikachu', page: 0, pageSize: 20 };
    const result = await pokemonService.searchPokemons(params);

    expect(apiClient.get).toHaveBeenCalledWith('/pokemons', { params });
    expect(result).toEqual(mockResponse.data);
  });

  it('getPokemon calls API with correct endpoint', async () => {
    const mockResponse = { data: { id: 1, species: 'Pikachu', name: 'Pika' } };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const result = await pokemonService.getPokemon(1);

    expect(apiClient.get).toHaveBeenCalledWith('/pokemons/1');
    expect(result).toEqual(mockResponse.data);
  });

  it('getTrainerPokemons calls API with correct endpoint', async () => {
    const mockResponse = { data: [{ id: 1, species: 'Pikachu' }] };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const result = await pokemonService.getTrainerPokemons(1);

    expect(apiClient.get).toHaveBeenCalledWith('/trainers/1/pokemons');
    expect(result).toEqual(mockResponse.data);
  });

  it('createPokemon calls API with correct endpoint and data', async () => {
    const mockResponse = { data: { id: 1 } };
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const data = {
      species: 'Pikachu',
      name: 'Pika',
      level: 25,
      boxId: 1,
    };
    const result = await pokemonService.createPokemon(data);

    expect(apiClient.post).toHaveBeenCalledWith('/pokemons', data);
    expect(result).toEqual(mockResponse.data);
  });

  it('updatePokemon calls API with correct endpoint and data', async () => {
    const mockResponse = { data: { id: 1, species: 'Pikachu', name: 'Updated' } };
    vi.mocked(apiClient.patch).mockResolvedValue(mockResponse);

    const data = { name: 'Updated' };
    const result = await pokemonService.updatePokemon(1, data);

    expect(apiClient.patch).toHaveBeenCalledWith('/pokemons/1', data);
    expect(result).toEqual(mockResponse.data);
  });

  it('deletePokemon calls API with correct endpoint', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined);

    await pokemonService.deletePokemon(1);

    expect(apiClient.delete).toHaveBeenCalledWith('/pokemons/1');
  });
});

