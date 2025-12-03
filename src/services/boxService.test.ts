import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { boxService } from './boxService';
import apiClient from './api';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('boxService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getBoxes calls API with correct endpoint', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Box 1' }] };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const result = await boxService.getBoxes(1);

    expect(apiClient.get).toHaveBeenCalledWith('/trainers/1/boxes');
    expect(result).toEqual(mockResponse.data);
  });

  it('createBox calls API with correct endpoint and data', async () => {
    const mockResponse = { data: { id: 1, name: 'New Box' } };
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const result = await boxService.createBox(1, { name: 'New Box' });

    expect(apiClient.post).toHaveBeenCalledWith('/trainers/1/boxes', { name: 'New Box' });
    expect(result).toEqual(mockResponse.data);
  });

  it('getBox calls API with correct endpoint', async () => {
    const mockResponse = { data: { id: 1, name: 'Box 1', pokemons: [] } };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const result = await boxService.getBox(1, 1);

    expect(apiClient.get).toHaveBeenCalledWith('/trainers/1/boxes/1');
    expect(result).toEqual(mockResponse.data);
  });

  it('updateBox calls API with correct endpoint and data', async () => {
    const mockResponse = { data: { id: 1, name: 'Updated Box' } };
    vi.mocked(apiClient.patch).mockResolvedValue(mockResponse);

    const result = await boxService.updateBox(1, 1, { name: 'Updated Box' });

    expect(apiClient.patch).toHaveBeenCalledWith('/trainers/1/boxes/1', { name: 'Updated Box' });
    expect(result).toEqual(mockResponse.data);
  });

  it('deleteBox calls API with correct endpoint', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined);

    await boxService.deleteBox(1, 1);

    expect(apiClient.delete).toHaveBeenCalledWith('/trainers/1/boxes/1');
  });
});
