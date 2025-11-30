export type TradeStatusCode = 'PROPOSITION' | 'ACCEPTED' | 'DECLINED';

export interface TradeListItem {
  id: number;
  statusCode: TradeStatusCode;
  receiver: {
    id: number;
  };
  sender: {
    id: number;
  };
}

export interface TradePokemon {
  id: number;
  species: string;
  name: string;
  level: number;
  genderTypeCode: string;
  isShiny: boolean;
}

export interface TraderData {
  id: number;
  pokemons: number[];
}

export interface TradeDetail {
  id: number;
  statusCode: TradeStatusCode;
  sender: TraderData;
  receiver: TraderData;
}

export interface TradeSearchParams {
  page?: number;
  pageSize?: number;
  orderBy?: 'ASC' | 'DESC';
  statusCode?: TradeStatusCode;
}

export interface TradeCreateRequest {
  receiverId: number;
  pokemonsOfferedIds: number[];
  pokemonsWantedIds: number[];
}

export interface TradeUpdateRequest {
  statusCode: 'ACCEPTED' | 'DECLINED';
}
