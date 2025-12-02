import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pokemonService } from '../services/pokemonService';
import { boxService } from '../services/boxService';
import { getErrorMessage } from '../utils/errors';
import type { PokemonCreateRequest, GenderTypeCode } from '../types/pokemon';
import type { Box } from '../types/box';

function PokemonAdd() {
  const navigate = useNavigate();
  const { trainerId } = useAuth();
  const [formData, setFormData] = useState<Omit<PokemonCreateRequest, 'name'> & { name: string }>({
    species: '',
    name: '',
    level: 1,
    genderTypeCode: 'NOT_DEFINED' as GenderTypeCode,
    size: 10,
    weight: 10,
    isShiny: false,
  });
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loadingBoxes, setLoadingBoxes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBoxes = async () => {
      if (!trainerId) return;

      try {
        setLoadingBoxes(true);
        const data = await boxService.getBoxes(trainerId);
        setBoxes(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingBoxes(false);
      }
    };

    fetchBoxes();
  }, [trainerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);

    if (!formData.species.trim()) {
      setValidationError('Species is required');
      return;
    }

    if (formData.level < 1 || formData.level > 100) {
      setValidationError('Level must be between 1 and 100');
      return;
    }

    if (formData.size <= 0) {
      setValidationError('Size must be greater than 0');
      return;
    }

    if (formData.weight <= 0) {
      setValidationError('Weight must be greater than 0');
      return;
    }

    if (boxes.length === 0) {
      setValidationError('You need at least one box to add a Pokémon. Please create a box first.');
      return;
    }

    setLoading(true);

    try {
      const requestData: PokemonCreateRequest = {
        species: formData.species.trim(),
        level: formData.level,
        genderTypeCode: formData.genderTypeCode,
        size: formData.size,
        weight: formData.weight,
        isShiny: formData.isShiny,
      };

      if (formData.name.trim() && formData.name.trim() !== formData.species.trim()) {
        requestData.name = formData.name.trim();
      }

      const result = await pokemonService.createPokemon(requestData);
      navigate(`/pokemons/${result.id}`);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === 'level' || name === 'size' || name === 'weight') {
      const numValue = value === '' ? 0 : Number(value);
      setFormData({
        ...formData,
        [name]: numValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (validationError) {
      setValidationError(null);
    }
    if (error) {
      setError(null);
    }
  };

  if (loadingBoxes) {
    return (
      <main className="container mx-auto p-4 max-w-2xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading boxes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Pokémon</h1>

        {(error || validationError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error || validationError}
          </div>
        )}

        {boxes.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
            You need at least one box to add a Pokémon.
            {' '}
            <Link to="/boxes/create" className="underline font-semibold">
              Create a box first
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="species" className="block text-gray-700 text-sm font-bold mb-2">
              Species
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Pikachu"
              aria-label="Pokémon species"
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name (optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave empty to use species name"
              aria-label="Pokémon name"
            />
            <p className="text-gray-500 text-xs mt-1">
              If not provided, the species name will be used
            </p>
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="level" className="block text-gray-700 text-sm font-bold mb-2">
              Level
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              min={1}
              max={100}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Pokémon level"
              aria-required="true"
            />
            <p className="text-gray-500 text-xs mt-1">Between 1 and 100</p>
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="genderTypeCode" className="block text-gray-700 text-sm font-bold mb-2">
              Gender
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="genderTypeCode"
              name="genderTypeCode"
              value={formData.genderTypeCode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Pokémon gender"
              aria-required="true"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NOT_DEFINED">Not Defined</option>
            </select>
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="size" className="block text-gray-700 text-sm font-bold mb-2">
              Size (cm)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              min={0.1}
              step={0.1}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Pokémon size in centimeters"
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="weight" className="block text-gray-700 text-sm font-bold mb-2">
              Weight (kg)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min={0.1}
              step={0.1}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Pokémon weight in kilograms"
              aria-required="true"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="isShiny" className="flex items-center">
              <input
                type="checkbox"
                id="isShiny"
                name="isShiny"
                checked={formData.isShiny}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 text-sm font-bold">Shiny Pokémon</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || boxes.length === 0}
              className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Pokémon'}
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

export default PokemonAdd;
