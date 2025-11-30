const AUTH_TOKEN_KEY = 'authToken';
const TRAINER_ID_KEY = 'trainerId';

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getTrainerId(): number | null {
    const id = localStorage.getItem(TRAINER_ID_KEY);
    return id ? parseInt(id, 10) : null;
  },

  setTrainerId(id: number): void {
    localStorage.setItem(TRAINER_ID_KEY, id.toString());
  },

  removeTrainerId(): void {
    localStorage.removeItem(TRAINER_ID_KEY);
  },

  clear(): void {
    this.removeToken();
    this.removeTrainerId();
  },
};
