export type GenderTypeCode = 'MALE' | 'FEMALE' | 'NOT_DEFINED';

export interface PokemonData {
  species: string;
  name: string;
  level: number;
  genderTypeCode: GenderTypeCode;
  isShiny: boolean;
}

export interface Pokemon extends PokemonData {
  id: number;
  trainerId?: number;
  boxId?: number;
  size?: number;
  weight?: number;
}

export interface PokemonListItem extends PokemonData {
  id: number;
  trainerId: number;
}

export interface PokemonSearchParams {
  page?: number;
  pageSize?: number;
  species?: string;
  levelMin?: number;
  levelMax?: number;
  gender?: GenderTypeCode;
  sizeMin?: number;
  sizeMax?: number;
  weightMin?: number;
  weightMax?: number;
  isShiny?: boolean;
}

export interface PokemonCreateRequest {
  species: string;
  name?: string;
  level: number;
  genderTypeCode: GenderTypeCode;
  size: number;
  weight: number;
  isShiny: boolean;
}

export interface PokemonUpdateRequest {
  species?: string;
  name?: string;
  level?: number;
  genderTypeCode?: GenderTypeCode;
  size?: number;
  weight?: number;
  isShiny?: boolean;
  boxId?: number;
}
