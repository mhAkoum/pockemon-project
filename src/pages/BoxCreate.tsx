import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { boxService } from '../services/boxService';
import { getErrorMessage } from '../utils/errors';

function BoxCreate() {
  const navigate = useNavigate();
  const { trainerId } = useAuth();
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setValidationError('Box name is required');
      return;
    }

    if (trimmedName.length > 16) {
      setValidationError('Box name must be 16 characters or less');
      return;
    }

    if (!trainerId) {
      setError('Trainer ID not found');
      return;
    }

    setLoading(true);

    try {
      const createdBox = await boxService.createBox(trainerId, { name: trimmedName });
      navigate(`/boxes/${createdBox.id}`);
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
    if (validationError) {
      setValidationError(null);
    }
    if (error) {
      setError(null);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-md">
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Box</h1>

        {(error || validationError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Box Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={16}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter box name (max 16 characters)"
              aria-label="Box name"
              aria-required="true"
              aria-invalid={!!(validationError || error)}
            />
            <p className="text-gray-500 text-xs mt-1">
              {formData.name.length}
              /16 characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Box'}
            </button>
            <Link
              to="/boxes"
              className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-center hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default BoxCreate;
