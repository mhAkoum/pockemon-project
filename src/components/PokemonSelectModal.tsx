import { useEffect, useState } from 'react';
import { pokemonService } from '../services/pokemonService';
import { getErrorMessage } from '../utils/errors';
import type { PokemonListItem } from '../types/pokemon';

interface PokemonSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pokemonId: number) => void;
  trainerId: number;
  selectedIds: number[];
  title: string;
}

function PokemonSelectModal({
  isOpen, onClose, onSelect, trainerId, selectedIds, title,
}: PokemonSelectModalProps) {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchPokemons = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await pokemonService.getTrainerPokemons(trainerId);
          setPokemons(data);
        } catch (err) {
          setError(getErrorMessage(err));
        } finally {
          setLoading(false);
        }
      };
      fetchPokemons();
    }
  }, [isOpen, trainerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              {error}
            </div>
          )}
          {loading && (
            <p className="text-gray-600">Loading Pokémons...</p>
          )}
          {!loading && pokemons.length === 0 && (
            <p className="text-gray-600">No Pokémons available</p>
          )}
          {!loading && pokemons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pokemons.map((pokemon) => {
                const isSelected = selectedIds.includes(pokemon.id);
                return (
                  <button
                    key={pokemon.id}
                    type="button"
                    onClick={() => {
                      if (!isSelected) {
                        onSelect(pokemon.id);
                        onClose();
                      }
                    }}
                    disabled={isSelected}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-800">{pokemon.name || pokemon.species}</h4>
                      {pokemon.isShiny && (
                        <span className="text-yellow-500 text-xs">✨</span>
                      )}
                      {isSelected && (
                        <span className="text-blue-600 text-xs">✓ Selected</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{pokemon.species}</p>
                    <p className="text-gray-600 text-sm">
                      Level:
                      {' '}
                      {pokemon.level}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-6 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PokemonSelectModal;
