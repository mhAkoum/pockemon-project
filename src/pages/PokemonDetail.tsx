import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pokemonService } from '../services/pokemonService';
import { getErrorMessage } from '../utils/errors';
import type { Pokemon } from '../types/pokemon';

function PokemonDetail() {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const { trainerId } = useAuth();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!pokemonId) {
        setError('Missing Pokémon ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const pokemonIdNum = parseInt(pokemonId, 10);
        const data = await pokemonService.getPokemon(pokemonIdNum);
        setPokemon(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonId]);

  const handleDelete = async () => {
    if (!pokemon || !pokemonId) return;

    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(`Are you sure you want to delete ${pokemon.name || pokemon.species}?`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const pokemonIdNum = parseInt(pokemonId, 10);
      await pokemonService.deletePokemon(pokemonIdNum);
      if (pokemon.boxId) {
        navigate(`/boxes/${pokemon.boxId}`);
      } else {
        navigate('/boxes');
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setIsDeleting(false);
    }
  };

  const isOwner = pokemon && trainerId && pokemon.trainerId === trainerId;

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading Pokémon details...</p>
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
          onClick={() => {
            if (pokemon?.boxId) {
              navigate(`/boxes/${pokemon.boxId}`);
            } else {
              navigate('/boxes');
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back
        </button>
      </main>
    );
  }

  if (!pokemon) {
    return (
      <main className="container mx-auto p-4">
        <p className="text-gray-600">Pokémon not found</p>
        <Link to="/boxes" className="text-blue-600 hover:underline">
          Back to Boxes
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => {
            if (pokemon.boxId) {
              navigate(`/boxes/${pokemon.boxId}`);
            } else {
              navigate('/boxes');
            }
          }}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">
              {pokemon.name || pokemon.species}
              {pokemon.isShiny && (
                <span className="text-yellow-500 ml-2">✨ Shiny</span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Pokémon ID:
              {' '}
              {pokemon.id}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">Species</p>
            <p className="text-gray-800 font-semibold">{pokemon.species}</p>
          </div>
          {pokemon.name && pokemon.name !== pokemon.species && (
            <div>
              <p className="text-gray-600 text-sm mb-1">Name</p>
              <p className="text-gray-800 font-semibold">{pokemon.name}</p>
            </div>
          )}
          <div>
            <p className="text-gray-600 text-sm mb-1">Level</p>
            <p className="text-gray-800 font-semibold">{pokemon.level}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Gender</p>
            <p className="text-gray-800 font-semibold">{pokemon.genderTypeCode}</p>
          </div>
          {pokemon.size !== undefined && (
            <div>
              <p className="text-gray-600 text-sm mb-1">Size</p>
              <p className="text-gray-800 font-semibold">
                {pokemon.size}
                {' '}
                cm
              </p>
            </div>
          )}
          {pokemon.weight !== undefined && (
            <div>
              <p className="text-gray-600 text-sm mb-1">Weight</p>
              <p className="text-gray-800 font-semibold">
                {pokemon.weight}
                {' '}
                kg
              </p>
            </div>
          )}
          {pokemon.trainerId && (
            <div>
              <p className="text-gray-600 text-sm mb-1">Trainer ID</p>
              <p className="text-gray-800 font-semibold">{pokemon.trainerId}</p>
            </div>
          )}
          {pokemon.boxId && (
            <div>
              <p className="text-gray-600 text-sm mb-1">Box</p>
              <Link
                to={`/boxes/${pokemon.boxId}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                Box #
                {pokemon.boxId}
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default PokemonDetail;
