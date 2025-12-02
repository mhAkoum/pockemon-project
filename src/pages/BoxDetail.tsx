import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { boxService } from '../services/boxService';
import { getErrorMessage } from '../utils/errors';
import type { BoxDetail as BoxDetailType } from '../types/box';
import type { Pokemon } from '../types/pokemon';

function BoxDetail() {
  const { boxId } = useParams<{ boxId: string }>();
  const { trainerId } = useAuth();
  const navigate = useNavigate();
  const [box, setBox] = useState<BoxDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBox = async () => {
      if (!trainerId || !boxId) {
        setError('Missing trainer ID or box ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const boxIdNum = parseInt(boxId, 10);
        const data = await boxService.getBox(trainerId, boxIdNum);
        setBox(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBox();
  }, [trainerId, boxId]);

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading box details...</p>
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
          onClick={() => navigate('/boxes')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Boxes
        </button>
      </main>
    );
  }

  if (!box) {
    return (
      <main className="container mx-auto p-4">
        <p className="text-gray-600">Box not found</p>
        <Link to="/boxes" className="text-blue-600 hover:underline">
          Back to Boxes
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6">
        <Link
          to="/boxes"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Boxes
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">{box.name}</h1>
        <p className="text-gray-600">
          Box ID:
          {' '}
          {box.id}
        </p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Pokémons (
          {box.pokemons.length}
          /30)
        </h2>
        {box.pokemons.length < 30 && (
          <Link
            to="/pokemons/add"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Pokémon
          </Link>
        )}
      </div>

      {box.pokemons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">This box is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {box.pokemons.map((pokemon: Pokemon) => (
            <Link
              key={pokemon.id}
              to={`/pokemons/${pokemon.id}`}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{pokemon.name}</h3>
                {pokemon.isShiny && (
                  <span className="text-yellow-500 text-sm font-bold">✨ Shiny</span>
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
      )}
    </main>
  );
}

export default BoxDetail;
