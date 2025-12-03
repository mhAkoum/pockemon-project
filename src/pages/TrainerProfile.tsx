import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trainerService } from '../services/trainerService';
import { getErrorMessage } from '../utils/errors';
import type { Trainer } from '../types/trainer';

function TrainerProfile() {
  const { trainerId: trainerIdParam } = useParams<{ trainerId: string }>();
  const { trainerId: currentTrainerId } = useAuth();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trainerId = trainerIdParam ? parseInt(trainerIdParam, 10) : currentTrainerId;
  const isOwnProfile = trainerId === currentTrainerId;

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
        const data = await trainerService.getTrainer(trainerId);
        setTrainer(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [trainerId]);

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back
        </button>
      </main>
    );
  }

  if (!trainer) {
    return (
      <main className="container mx-auto p-4">
        <p className="text-gray-600">Trainer not found</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            {trainer.firstName}
            {' '}
            {trainer.lastName}
          </h1>
          {isOwnProfile && (
            <Link
              to="/profile/edit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">First Name</p>
            <p className="text-gray-800 font-semibold">{trainer.firstName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Last Name</p>
            <p className="text-gray-800 font-semibold">{trainer.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Email</p>
            <p className="text-gray-800 font-semibold">{trainer.login}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Birth Date</p>
            <p className="text-gray-800 font-semibold">{formatDate(trainer.birthDate)}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TrainerProfile;
