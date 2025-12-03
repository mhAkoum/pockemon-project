import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { trainerService } from './trainerService';
import apiClient from './api';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('trainerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searchTrainers calls API with correct endpoint and params', async () => {
    const mockResponse = { data: [{ id: 1, firstName: 'John', lastName: 'Doe' }] };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const params = { firstName: 'John', page: 0, pageSize: 20 };
    const result = await trainerService.searchTrainers(params);

    expect(apiClient.get).toHaveBeenCalledWith('/trainers', { params });
    expect(result).toEqual(mockResponse.data);
  });

  it('getTrainer calls API with correct endpoint', async () => {
    const mockResponse = {
      data: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        login: 'john@example.com',
        birthDate: '1990-01-01',
      },
    };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const result = await trainerService.getTrainer(1);

    expect(apiClient.get).toHaveBeenCalledWith('/trainers/1');
    expect(result).toEqual(mockResponse.data);
  });

  it('updateTrainer calls API with correct endpoint and data', async () => {
    const mockResponse = {
      data: {
        id: 1,
        firstName: 'Jane',
        lastName: 'Doe',
        login: 'john@example.com',
        birthDate: '1990-01-01',
      },
    };
    vi.mocked(apiClient.patch).mockResolvedValue(mockResponse);

    const data = { firstName: 'Jane' };
    const result = await trainerService.updateTrainer(1, data);

    expect(apiClient.patch).toHaveBeenCalledWith('/trainers/1', data);
    expect(result).toEqual(mockResponse.data);
  });

  it('deleteTrainer calls API with correct endpoint', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined);

    await trainerService.deleteTrainer(1);

    expect(apiClient.delete).toHaveBeenCalledWith('/trainers/1');
  });
});

