import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trainerService } from '../services/trainerService';
import { getErrorMessage } from '../utils/errors';
import type { TrainerUpdateRequest } from '../types/trainer';

function ProfileEdit() {
  const navigate = useNavigate();
  const { trainerId } = useAuth();
  const [formData, setFormData] = useState<TrainerUpdateRequest & { passwordConfirm: string }>({
    firstName: '',
    lastName: '',
    birthDate: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      if (!trainerId) {
        setError('Trainer ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const trainer = await trainerService.getTrainer(trainerId);
        setFormData({
          firstName: trainer.firstName,
          lastName: trainer.lastName,
          birthDate: trainer.birthDate.split('T')[0],
          password: '',
          passwordConfirm: '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [trainerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);

    if (formData.password && formData.password !== formData.passwordConfirm) {
      setValidationError('Passwords do not match');
      return;
    }

    if (!trainerId) {
      setError('Trainer ID not found');
      return;
    }

    setSubmitting(true);

    try {
      const updateData: TrainerUpdateRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
      };

      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      await trainerService.updateTrainer(trainerId, updateData);
      navigate('/profile');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (validationError) {
      setValidationError(null);
    }
    if (error) {
      setError(null);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto p-4 max-w-md">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 max-w-md">
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h1>

        {(error || validationError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
              First Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="First name"
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
              Last Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Last name"
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="birthDate" className="block text-gray-700 text-sm font-bold mb-2">
              Birth Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Birth date"
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              New Password (optional)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="New password"
            />
            <p className="text-gray-500 text-xs mt-1">
              Leave empty to keep current password
            </p>
          </div>

          {formData.password && (
            <div className="mb-4">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="passwordConfirm" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Confirm new password"
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              to="/profile"
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

export default ProfileEdit;
