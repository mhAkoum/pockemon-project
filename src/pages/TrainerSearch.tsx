import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trainerService } from '../services/trainerService';
import { getErrorMessage } from '../utils/errors';
import type { TrainerListItem, TrainerSearchParams } from '../types/trainer';

function TrainerSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { trainerId: currentTrainerId } = useAuth();
  const [trainers, setTrainers] = useState<TrainerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [filters, setFilters] = useState<TrainerSearchParams>({
    firstName: searchParams.get('firstName') || undefined,
    lastName: searchParams.get('lastName') || undefined,
    login: searchParams.get('login') || undefined,
  });

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: TrainerSearchParams = {
          page,
          pageSize,
        };

        if (filters.firstName && filters.firstName.trim() !== '') {
          params.firstName = filters.firstName.trim();
        }
        if (filters.lastName && filters.lastName.trim() !== '') {
          params.lastName = filters.lastName.trim();
        }
        if (filters.login && filters.login.trim() !== '') {
          params.login = filters.login.trim();
        }

        const data = await trainerService.searchTrainers(params);
        setTrainers(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [page, filters]);

  const handleFilterChange = (name: string, value: string | undefined) => {
    const cleanedValue = value === '' ? undefined : value;
    setFilters((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
    setPage(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleFilterChange(name, value);
  };

  const handleClearFilters = () => {
    const emptyFilters: TrainerSearchParams = {};
    setFilters(emptyFilters);
    setPage(0);
    setSearchParams({});
  };

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== null) {
        params.set(key, String(val));
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== '',
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Trainers</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={filters.firstName ?? ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Ash"
            />
          </div>

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={filters.lastName ?? ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Ketchum"
            />
          </div>

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="login" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="text"
              id="login"
              name="login"
              value={filters.login ?? ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ash@example.com"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading trainers...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Found
              {' '}
              {trainers.length}
              {' '}
              {trainers.length === 1 ? 'trainer' : 'trainers'}
            </p>
          </div>

          {trainers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No trainers found matching your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {trainers.map((trainer) => {
                  const isSelf = trainer.id === currentTrainerId;
                  return (
                    <div
                      key={trainer.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {trainer.firstName}
                        {' '}
                        {trainer.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{trainer.login}</p>
                      <div className="flex gap-2">
                        <Link
                          to={`/trainers/${trainer.id}`}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          View Profile
                        </Link>
                        {!isSelf && (
                          <Link
                            to={`/trades/create?receiverId=${trainer.id}`}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Trade
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page
                  {' '}
                  {page + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={trainers.length < pageSize}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}

export default TrainerSearch;
