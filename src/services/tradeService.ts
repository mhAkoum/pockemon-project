import apiClient from './api';
import type {
  TradeListItem,
  TradeDetail,
  TradeSearchParams,
  TradeCreateRequest,
  TradeUpdateRequest,
} from '../types/trade';

export const tradeService = {
  async getTrades(trainerId: number, params?: TradeSearchParams): Promise<TradeListItem[]> {
    const response = await apiClient.get<TradeListItem[]>(`/trainers/${trainerId}/trades`, { params });
    return response.data;
  },

  async getTrade(tradeId: number): Promise<TradeDetail> {
    const response = await apiClient.get<TradeDetail>(`/trades/${tradeId}`);
    return response.data;
  },

  async createTrade(data: TradeCreateRequest): Promise<{ id: number }> {
    const response = await apiClient.post<{ id: number }>('/trades', data);
    return response.data;
  },

  async updateTrade(tradeId: number, data: TradeUpdateRequest): Promise<{ id: number }> {
    const response = await apiClient.patch<{ id: number }>(`/trades/${tradeId}`, data);
    return response.data;
  },
};
