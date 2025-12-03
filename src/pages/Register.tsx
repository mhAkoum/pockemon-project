import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../utils/errors';

function Register() {
  const navigate = useNavigate();
  const { subscribe } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    login: '',
    birthDate: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await subscribe(formData);
      navigate('/');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Registration error:', err);
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
        <h1 className="pokemon-title text-center mb-6">Sign Up</h1>

        {error && (
          <div className="pokemon-alert mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} aria-label="Registration form">
          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="firstName" className="pokemon-label">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="pokemon-input"
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="lastName" className="pokemon-label">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="pokemon-input"
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="login" className="pokemon-label">
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

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="birthDate" className="pokemon-label">
              Date of Birth
            </label>
            <input
              id="birthDate"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="pokemon-input"
              aria-required="true"
            />
          </div>

          <div className="mb-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="password" className="pokemon-label">
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
            className="w-full pokemon-button-blue disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center pokemon-text">
          Already have an account?
          {' '}
          <Link to="/login" className="text-pokemon-blue hover:underline font-bold">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
