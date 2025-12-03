import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { tradeService } from '../services/tradeService';
import { storage } from '../utils/storage';
import TradeList from './TradeList';

vi.mock('../services/tradeService', () => ({
  tradeService: {
    getTrades: vi.fn(),
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

describe('TradeList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
  });

  it('renders loading state initially', () => {
    vi.mocked(tradeService.getTrades).mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <TradeList />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/loading trades/i)).toBeInTheDocument();
  });

  it('displays trades when loaded', async () => {
    const mockTrades = [
      {
        id: 1,
        statusCode: 'PROPOSITION' as const,
        sender: { id: 1, firstName: 'John', lastName: 'Doe' },
        receiver: { id: 2, firstName: 'Jane', lastName: 'Smith' },
      },
    ];
    vi.mocked(tradeService.getTrades).mockResolvedValue(mockTrades as never);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TradeList />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/my trades/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/trade #1/i)).toBeInTheDocument();
    });
  });

  it('displays empty state when no trades', async () => {
    vi.mocked(tradeService.getTrades).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TradeList />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/no trades found/i)).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    vi.mocked(tradeService.getTrades).mockRejectedValue(new Error('Failed to fetch trades'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <TradeList />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
