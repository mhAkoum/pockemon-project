import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { trainerService } from '../services/trainerService';
import { storage } from '../utils/storage';
import ProfileEdit from './ProfileEdit';

const mockNavigate = vi.fn();

vi.mock('../services/trainerService', () => ({
  trainerService: {
    getTrainer: vi.fn(),
    updateTrainer: vi.fn(),
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

describe('ProfileEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('test-token');
    vi.mocked(storage.getTrainerId).mockReturnValue(1);
    vi.mocked(trainerService.getTrainer).mockResolvedValue({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      login: 'john@example.com',
      birthDate: '1990-01-01T00:00:00Z',
    } as never);
  });

  it('renders loading state initially', () => {
    vi.mocked(trainerService.getTrainer).mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfileEdit />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('displays form with pre-filled data', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfileEdit />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    });

    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
  });

  it('allows user to edit profile data', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfileEdit />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');

    expect(firstNameInput).toHaveValue('Jane');
  });

  it('shows validation error for password mismatch', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfileEdit />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/new password/i), 'password123');
    await user.type(screen.getByLabelText(/confirm new password/i), 'password456');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('updates profile and navigates on success', async () => {
    const user = userEvent.setup();
    vi.mocked(trainerService.updateTrainer).mockResolvedValue({
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      login: 'john@example.com',
      birthDate: '1990-01-01T00:00:00Z',
    } as never);

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfileEdit />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(trainerService.updateTrainer).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });
});
