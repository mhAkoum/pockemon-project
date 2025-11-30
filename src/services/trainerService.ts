import apiClient from './api';
import type {
  Trainer,
  TrainerSearchParams,
  TrainerListItem,
  TrainerUpdateRequest,
} from '../types/trainer';

export const trainerService = {
  async searchTrainers(params?: TrainerSearchParams): Promise<TrainerListItem[]> {
    const response = await apiClient.get<TrainerListItem[]>('/trainers', { params });
    return response.data;
  },

  async getTrainer(trainerId: number): Promise<Trainer> {
    const response = await apiClient.get<Trainer>(`/trainers/${trainerId}`);
    return response.data;
  },

  async updateTrainer(trainerId: number, data: TrainerUpdateRequest): Promise<Trainer> {
    const response = await apiClient.patch<Trainer>(`/trainers/${trainerId}`, data);
    return response.data;
  },

  async deleteTrainer(trainerId: number): Promise<void> {
    await apiClient.delete(`/trainers/${trainerId}`);
  },
};
