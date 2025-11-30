export interface Trainer {
  id: number;
  firstName: string;
  lastName: string;
  login: string;
  birthDate: string;
}

export interface TrainerSearchParams {
  page?: number;
  pageSize?: number;
  firstName?: string;
  lastName?: string;
  login?: string;
}

export interface TrainerListItem {
  id: number;
  firstName: string;
  lastName: string;
  login: string;
}

export interface TrainerUpdateRequest {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  password?: string;
}
