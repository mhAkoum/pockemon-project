import apiClient from './api';
import type {
  Box,
  BoxDetail,
  BoxCreateRequest,
  BoxUpdateRequest,
} from '../types/box';

export const boxService = {
  async getBoxes(trainerId: number): Promise<Box[]> {
    const response = await apiClient.get<Box[]>(`/trainers/${trainerId}/boxes`);
    return response.data;
  },

  async createBox(trainerId: number, data: BoxCreateRequest): Promise<Box> {
    const response = await apiClient.post<Box>(`/trainers/${trainerId}/boxes`, data);
    return response.data;
  },

  async getBox(trainerId: number, boxId: number): Promise<BoxDetail> {
    const response = await apiClient.get<BoxDetail>(`/trainers/${trainerId}/boxes/${boxId}`);
    return response.data;
  },

  async updateBox(trainerId: number, boxId: number, data: BoxUpdateRequest): Promise<Box> {
    const response = await apiClient.patch<Box>(`/trainers/${trainerId}/boxes/${boxId}`, data);
    return response.data;
  },

  async deleteBox(trainerId: number, boxId: number): Promise<void> {
    await apiClient.delete(`/trainers/${trainerId}/boxes/${boxId}`);
  },
};
