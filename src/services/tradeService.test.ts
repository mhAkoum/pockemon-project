import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { tradeService } from './tradeService';
import apiClient from './api';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('tradeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTrades calls API with correct endpoint and params', async () => {
    const mockResponse = { data: [{ id: 1, statusCode: 'PROPOSITION' }] };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const params = { page: 0, pageSize: 20, orderBy: 'DESC' };
    const result = await tradeService.getTrades(1, params);

    expect(apiClient.get).toHaveBeenCalledWith('/trainers/1/trades', { params });
    expect(result).toEqual(mockResponse.data);
  });

  it('getTrade calls API with correct endpoint', async () => {
    const mockResponse = {
      data: {
        id: 1,
        statusCode: 'PROPOSITION',
        sender: { id: 1, pokemons: [] },
        receiver: { id: 2, pokemons: [] },
      },
    };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const result = await tradeService.getTrade(1);

    expect(apiClient.get).toHaveBeenCalledWith('/trades/1');
    expect(result).toEqual(mockResponse.data);
  });

  it('createTrade calls API with correct endpoint and data', async () => {
    const mockResponse = { data: { id: 1 } };
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const data = {
      senderId: 1,
      receiverId: 2,
      senderPokemons: [1, 2],
      receiverPokemons: [3],
    };
    const result = await tradeService.createTrade(data);

    expect(apiClient.post).toHaveBeenCalledWith('/trades', data);
    expect(result).toEqual(mockResponse.data);
  });

  it('updateTrade calls API with correct endpoint and data', async () => {
    const mockResponse = { data: { id: 1 } };
    vi.mocked(apiClient.patch).mockResolvedValue(mockResponse);

    const data = { statusCode: 'ACCEPTED' };
    const result = await tradeService.updateTrade(1, data);

    expect(apiClient.patch).toHaveBeenCalledWith('/trades/1', data);
    expect(result).toEqual(mockResponse.data);
  });
});

