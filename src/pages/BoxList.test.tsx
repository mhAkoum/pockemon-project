import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { boxService } from '../services/boxService';
import { storage } from '../utils/storage';
import BoxList from './BoxList';

vi.mock('../services/boxService', () => ({
  boxService: {
    getBoxes: vi.fn(),
  },
}));

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

describe('BoxList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
  });

  it('renders loading state initially', () => {
    vi.mocked(boxService.getBoxes).mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxList />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/loading boxes/i)).toBeInTheDocument();
  });

  it('displays boxes when loaded', async () => {
    const mockBoxes = [
      { id: 1, name: 'Box 1' },
      { id: 2, name: 'Box 2' },
    ];
    vi.mocked(boxService.getBoxes).mockResolvedValue(mockBoxes as never);

    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxList />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('My Boxes')).toBeInTheDocument();
    });

    expect(screen.getByText('Box 1')).toBeInTheDocument();
    expect(screen.getByText('Box 2')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create box/i })).toBeInTheDocument();
  });

  it('displays empty state when no boxes', async () => {
    vi.mocked(boxService.getBoxes).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxList />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/you don't have any boxes yet/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /create your first box/i })).toBeInTheDocument();
  });

  it('displays error message on failure', async () => {
    vi.mocked(boxService.getBoxes).mockRejectedValue(new Error('Failed to fetch boxes'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxList />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});

