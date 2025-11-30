import apiClient from './api';
import type {
  Pokemon,
  PokemonListItem,
  PokemonSearchParams,
  PokemonCreateRequest,
  PokemonUpdateRequest,
} from '../types/pokemon';

export const pokemonService = {
  async searchPokemons(params?: PokemonSearchParams): Promise<PokemonListItem[]> {
    const response = await apiClient.get<PokemonListItem[]>('/pokemons', { params });
    return response.data;
  },

  async getPokemon(pokemonId: number): Promise<Pokemon> {
    const response = await apiClient.get<Pokemon>(`/pokemons/${pokemonId}`);
    return response.data;
  },

  async getTrainerPokemons(trainerId: number): Promise<PokemonListItem[]> {
    const response = await apiClient.get<PokemonListItem[]>(`/trainers/${trainerId}/pokemons`);
    return response.data;
  },

  async createPokemon(data: PokemonCreateRequest): Promise<{ id: number }> {
    const response = await apiClient.post<{ id: number }>('/pokemons', data);
    return response.data;
  },

  async updatePokemon(pokemonId: number, data: PokemonUpdateRequest): Promise<Pokemon> {
    const response = await apiClient.patch<Pokemon>(`/pokemons/${pokemonId}`, data);
    return response.data;
  },

  async deletePokemon(pokemonId: number): Promise<void> {
    await apiClient.delete(`/pokemons/${pokemonId}`);
  },
};
