import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../utils/errors';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="container mx-auto p-4 max-w-md">
      <div className="pokemon-box mt-8">
        <h1 className="pokemon-title text-center mb-6">Login</h1>

        {error && (
          <div className="pokemon-alert mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} aria-label="Login form">
          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="login" className="pokemon-label block">
              Email
            </label>
            <input
              id="login"
              type="email"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
              className="pokemon-input"
              aria-required="true"
            />
          </div>

          <div className="mb-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="password" className="pokemon-label block">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="pokemon-input"
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full pokemon-button-green disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center pokemon-text">
          Don&apos;t have an account?
          {' '}
          <Link to="/register" className="text-pokemon-blue hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
