import type { Pokemon } from './pokemon';

export interface Box {
  id: number;
  name: string;
}

export interface BoxDetail extends Box {
  pokemons: Pokemon[];
}

export interface BoxCreateRequest {
  name: string;
}

export interface BoxUpdateRequest {
  name: string;
}
