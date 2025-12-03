import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import Header from './Header';

vi.mock('../utils/storage', () => ({
  storage: {
    getToken: vi.fn(),
    getTrainerId: vi.fn(),
    clear: vi.fn(),
    setToken: vi.fn(),
    setTrainerId: vi.fn(),
    removeToken: vi.fn(),
    removeTrainerId: vi.fn(),
  },
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header with logo', () => {
    vi.mocked(storage.getToken).mockReturnValue(null);
    vi.mocked(storage.getTrainerId).mockReturnValue(null);

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pc pokémon/i })).toBeInTheDocument();
  });

  it('shows login and sign up links when not authenticated', () => {
    vi.mocked(storage.getToken).mockReturnValue(null);
    vi.mocked(storage.getTrainerId).mockReturnValue(null);

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows authenticated navigation when logged in', async () => {
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /my boxes/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /my trades/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /search for a trainer/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /search for a pokémon/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /user profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
