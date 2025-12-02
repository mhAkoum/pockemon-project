import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { pokemonService } from '../services/pokemonService';
import { getErrorMessage } from '../utils/errors';
import type { PokemonListItem, PokemonSearchParams, GenderTypeCode } from '../types/pokemon';

function PokemonSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [filters, setFilters] = useState<PokemonSearchParams>({
    species: searchParams.get('species') ? searchParams.get('species')! : undefined,
    levelMin: searchParams.get('levelMin') ? Number(searchParams.get('levelMin')) : undefined,
    levelMax: searchParams.get('levelMax') ? Number(searchParams.get('levelMax')) : undefined,
    gender: (searchParams.get('gender') as GenderTypeCode) || undefined,
    sizeMin: searchParams.get('sizeMin') ? Number(searchParams.get('sizeMin')) : undefined,
    sizeMax: searchParams.get('sizeMax') ? Number(searchParams.get('sizeMax')) : undefined,
    weightMin: searchParams.get('weightMin') ? Number(searchParams.get('weightMin')) : undefined,
    weightMax: searchParams.get('weightMax') ? Number(searchParams.get('weightMax')) : undefined,
    isShiny: searchParams.get('isShiny') === 'true' ? true : undefined,
  });

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: PokemonSearchParams = {
          page,
          pageSize,
        };

        if (filters.species && filters.species.trim() !== '') params.species = filters.species.trim();
        if (filters.levelMin) params.levelMin = filters.levelMin;
        if (filters.levelMax) params.levelMax = filters.levelMax;
        if (filters.gender) params.gender = filters.gender;
        if (filters.sizeMin) params.sizeMin = filters.sizeMin;
        if (filters.sizeMax) params.sizeMax = filters.sizeMax;
        if (filters.weightMin) params.weightMin = filters.weightMin;
        if (filters.weightMax) params.weightMax = filters.weightMax;
        if (filters.isShiny !== undefined) params.isShiny = filters.isShiny;

        const data = await pokemonService.searchPokemons(params);
        setPokemons(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [page, filters]);

  const handleFilterChange = (name: string, value: string | number | boolean | undefined) => {
    const cleanedValue = value === '' ? undefined : value;
    setFilters((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
    setPage(0);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = (e.target as HTMLInputElement);
      handleFilterChange(name, checked);
    } else if (name === 'levelMin' || name === 'levelMax' || name === 'sizeMin' || name === 'sizeMax' || name === 'weightMin' || name === 'weightMax') {
      const numValue = value === '' ? undefined : Number(value);
      handleFilterChange(name, numValue);
    } else {
      handleFilterChange(name, value);
    }
  };

  const handleClearFilters = () => {
    const emptyFilters: PokemonSearchParams = {};
    setFilters(emptyFilters);
    setPage(0);
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== '',
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Pokémons</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="species" className="block text-gray-700 text-sm font-bold mb-2">
              Species
            </label>
            <input
              type="text"
              id="species"
              name="species"
              value={filters.species ?? ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Pikachu"
            />
          </div>

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="levelMin" className="block text-gray-700 text-sm font-bold mb-2">
              Level Min
            </label>
            <input
              type="number"
              id="levelMin"
              name="levelMin"
              value={filters.levelMin || ''}
              onChange={handleInputChange}
              min={1}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1"
            />
          </div>

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="levelMax" className="block text-gray-700 text-sm font-bold mb-2">
              Level Max
            </label>
            <input
              type="number"
              id="levelMax"
              name="levelMax"
              value={filters.levelMax || ''}
              onChange={handleInputChange}
              min={1}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100"
            />
          </div>

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={filters.gender || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NOT_DEFINED">Not Defined</option>
            </select>
          </div>

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="sizeMin" className="block text-gray-700 text-sm font-bold mb-2">
              Size Min (cm)
            </label>
            <input
              type="number"
              id="sizeMin"
              name="sizeMin"
              value={filters.sizeMin || ''}
              onChange={handleInputChange}
              min={0}
              step={0.1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="sizeMax" className="block text-gray-700 text-sm font-bold mb-2">
              Size Max (cm)
            </label>
            <input
              type="number"
              id="sizeMax"
              name="sizeMax"
              value={filters.sizeMax || ''}
              onChange={handleInputChange}
              min={0}
              step={0.1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="weightMin" className="block text-gray-700 text-sm font-bold mb-2">
              Weight Min (kg)
            </label>
            <input
              type="number"
              id="weightMin"
              name="weightMin"
              value={filters.weightMin || ''}
              onChange={handleInputChange}
              min={0}
              step={0.1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="weightMax" className="block text-gray-700 text-sm font-bold mb-2">
              Weight Max (kg)
            </label>
            <input
              type="number"
              id="weightMax"
              name="weightMax"
              value={filters.weightMax || ''}
              onChange={handleInputChange}
              min={0}
              step={0.1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="isShiny" className="flex items-center mt-7">
              <input
                type="checkbox"
                id="isShiny"
                name="isShiny"
                checked={filters.isShiny === true}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 text-sm font-bold">Shiny Only</span>
            </label>
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
          <p className="text-gray-600">Loading Pokémons...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Found
              {' '}
              {pokemons.length}
              {' '}
              {pokemons.length === 1 ? 'Pokémon' : 'Pokémons'}
            </p>
          </div>

          {pokemons.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No Pokémons found matching your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {pokemons.map((pokemon) => (
                  <Link
                    key={pokemon.id}
                    to={`/pokemons/${pokemon.id}`}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{pokemon.name || pokemon.species}</h3>
                      {pokemon.isShiny && (
                        <span className="text-yellow-500 text-sm font-bold">✨</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Species:
                      {' '}
                      {pokemon.species}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Level:
                      {' '}
                      {pokemon.level}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Gender:
                      {' '}
                      {pokemon.genderTypeCode}
                    </p>
                  </Link>
                ))}
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
                  disabled={pokemons.length < pageSize}
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

export default PokemonSearch;
