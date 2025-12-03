import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import Register from './Register';

vi.mock('../services/authService', () => ({
  authService: {
    subscribe: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('allows user to input registration data', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>,
    );

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('1990-01-01');
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
  });

  it('shows error message on registration failure', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.subscribe).mockRejectedValue(new Error('Registration failed'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>,
    );

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.subscribe).mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(resolve, 100);
      }),
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>,
    );

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Signing up...');
  });
});

