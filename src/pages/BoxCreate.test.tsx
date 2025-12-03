import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { boxService } from '../services/boxService';
import { storage } from '../utils/storage';
import BoxCreate from './BoxCreate';

const mockNavigate = vi.fn();

vi.mock('../services/boxService', () => ({
  boxService: {
    createBox: vi.fn(),
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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('BoxCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
  });

  it('renders create box form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxCreate />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByRole('heading', { name: /create box/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/box name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create box/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cancel/i })).toBeInTheDocument();
  });

  it('allows user to input box name', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxCreate />
        </AuthProvider>
      </BrowserRouter>,
    );

    const nameInput = screen.getByLabelText(/box name/i);
    await user.type(nameInput, 'My New Box');

    expect(nameInput).toHaveValue('My New Box');
    await waitFor(() => {
      expect(screen.getByText(/9\/16 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for empty name', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxCreate />
        </AuthProvider>
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole('button', { name: /create box/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/box name is required/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows validation error for name too long', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxCreate />
        </AuthProvider>
      </BrowserRouter>,
    );

    const nameInput = screen.getByLabelText(/box name/i);
    await user.type(nameInput, 'This is a very long box name that exceeds 16 characters');

    const submitButton = screen.getByRole('button', { name: /create box/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/box name must be 16 characters or less/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('creates box and navigates on success', async () => {
    const user = userEvent.setup();
    const mockBox = { id: 1, name: 'My New Box' };
    vi.mocked(boxService.createBox).mockResolvedValue(mockBox as never);

    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxCreate />
        </AuthProvider>
      </BrowserRouter>,
    );

    const nameInput = screen.getByLabelText(/box name/i);
    await user.type(nameInput, 'My New Box');
    await user.click(screen.getByRole('button', { name: /create box/i }));

    await waitFor(() => {
      expect(boxService.createBox).toHaveBeenCalledWith(1, { name: 'My New Box' });
      expect(mockNavigate).toHaveBeenCalledWith('/boxes/1');
    });
  });

  it('shows error message on creation failure', async () => {
    const user = userEvent.setup();
    vi.mocked(boxService.createBox).mockRejectedValue(new Error('Creation failed'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <BoxCreate />
        </AuthProvider>
      </BrowserRouter>,
    );

    const nameInput = screen.getByLabelText(/box name/i);
    await user.type(nameInput, 'My New Box');
    await user.click(screen.getByRole('button', { name: /create box/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

