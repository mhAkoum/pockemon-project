import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tradeService } from '../services/tradeService';
import { pokemonService } from '../services/pokemonService';
import { trainerService } from '../services/trainerService';
import { getErrorMessage } from '../utils/errors';
import PokemonSelectModal from '../components/PokemonSelectModal';
import type { TradeCreateRequest } from '../types/trade';
import type { Pokemon } from '../types/pokemon';
import type { Trainer } from '../types/trainer';

function TradeCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { trainerId: senderId } = useAuth();
  const receiverIdParam = searchParams.get('receiverId');
  const receiverId = receiverIdParam ? parseInt(receiverIdParam, 10) : null;

  const [receiverInfo, setReceiverInfo] = useState<Trainer | null>(null);
  const [senderPokemons, setSenderPokemons] = useState<(Pokemon | null)[]>(Array(6).fill(null));
  const [receiverPokemons, setReceiverPokemons] = useState<(Pokemon | null)[]>(Array(6).fill(null));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSlotIndex, setModalSlotIndex] = useState<number | null>(null);
  const [modalSide, setModalSide] = useState<'sender' | 'receiver' | null>(null);

  useEffect(() => {
    const fetchReceiver = async () => {
      if (!receiverId) {
        setError('Receiver ID not found in URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const receiver = await trainerService.getTrainer(receiverId);
        setReceiverInfo(receiver);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchReceiver();
  }, [receiverId]);

  const openModal = (side: 'sender' | 'receiver', slotIndex: number) => {
    setModalSide(side);
    setModalSlotIndex(slotIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSide(null);
    setModalSlotIndex(null);
  };

  const handlePokemonSelect = (pokemonId: number) => {
    if (!modalSide || modalSlotIndex === null) return;

    const fetchPokemon = async () => {
      try {
        const pokemon = await pokemonService.getPokemon(pokemonId);
        if (modalSide === 'sender') {
          const newSenderPokemons = [...senderPokemons];
          newSenderPokemons[modalSlotIndex] = pokemon;
          setSenderPokemons(newSenderPokemons);
        } else {
          const newReceiverPokemons = [...receiverPokemons];
          newReceiverPokemons[modalSlotIndex] = pokemon;
          setReceiverPokemons(newReceiverPokemons);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };

    fetchPokemon();
  };

  const removePokemon = (side: 'sender' | 'receiver', slotIndex: number) => {
    if (side === 'sender') {
      const newSenderPokemons = [...senderPokemons];
      newSenderPokemons[slotIndex] = null;
      setSenderPokemons(newSenderPokemons);
    } else {
      const newReceiverPokemons = [...receiverPokemons];
      newReceiverPokemons[slotIndex] = null;
      setReceiverPokemons(newReceiverPokemons);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);

    if (!senderId || !receiverId) {
      setValidationError('Missing sender or receiver ID');
      return;
    }

    const offeredIds = senderPokemons.filter((p): p is Pokemon => p !== null).map((p) => p.id);
    const wantedIds = receiverPokemons.filter((p): p is Pokemon => p !== null).map((p) => p.id);

    if (offeredIds.length === 0 && wantedIds.length === 0) {
      setValidationError('You must offer at least one Pokémon or request at least one Pokémon');
      return;
    }

    setSubmitting(true);

    try {
      const tradeData: TradeCreateRequest = {
        receiverId,
        pokemonsOfferedIds: offeredIds,
        pokemonsWantedIds: wantedIds,
      };

      const createdTrade = await tradeService.createTrade(tradeData);
      navigate(`/trades/${createdTrade.id}`);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!receiverInfo) {
    return (
      <main className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error || 'Receiver not found'}
        </div>
        <Link to="/trainers/search" className="text-blue-600 hover:underline">
          Go to Trainer Search
        </Link>
      </main>
    );
  }

  const selectedSenderIds = senderPokemons
    .filter((p): p is Pokemon => p !== null)
    .map((p) => p.id);
  const selectedReceiverIds = receiverPokemons
    .filter((p): p is Pokemon => p !== null)
    .map((p) => p.id);

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <Link to="/trainers/search" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Trainer Search
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">Create Trade</h1>
      </div>

      {(error || validationError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error || validationError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              You (Sender)
            </h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Your Pokémons to Offer
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {senderPokemons.map((pokemon, index) => (
                <div
                  key={pokemon?.id || `sender-slot-${index}`}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 min-h-[120px] flex flex-col items-center justify-center"
                >
                  {pokemon ? (
                    <>
                      <div className="flex items-center justify-between w-full mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">
                          {pokemon.name || pokemon.species}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removePokemon('sender', index)}
                          className="text-red-600 hover:text-red-800 text-xs"
                          aria-label={`Remove ${pokemon.name || pokemon.species}`}
                        >
                          ×
                        </button>
                      </div>
                      {pokemon.isShiny && (
                        <span className="text-yellow-500 text-xs mb-1">✨</span>
                      )}
                      <p className="text-gray-600 text-xs truncate w-full">{pokemon.species}</p>
                      <p className="text-gray-600 text-xs">
                        Lv.
                        {pokemon.level}
                      </p>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openModal('sender', index)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                      aria-label={`Add Pokémon to slot ${index + 1}`}
                    >
                      + Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {receiverInfo.firstName}
              {' '}
              {receiverInfo.lastName}
              {' '}
              (Receiver)
            </h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Pokémons You Want
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {receiverPokemons.map((pokemon, index) => (
                <div
                  key={pokemon?.id || `receiver-slot-${index}`}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 min-h-[120px] flex flex-col items-center justify-center"
                >
                  {pokemon ? (
                    <>
                      <div className="flex items-center justify-between w-full mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">
                          {pokemon.name || pokemon.species}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removePokemon('receiver', index)}
                          className="text-red-600 hover:text-red-800 text-xs"
                          aria-label={`Remove ${pokemon.name || pokemon.species}`}
                        >
                          ×
                        </button>
                      </div>
                      {pokemon.isShiny && (
                        <span className="text-yellow-500 text-xs mb-1">✨</span>
                      )}
                      <p className="text-gray-600 text-xs truncate w-full">{pokemon.species}</p>
                      <p className="text-gray-600 text-xs">
                        Lv.
                        {pokemon.level}
                      </p>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openModal('receiver', index)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                      aria-label={`Add Pokémon to slot ${index + 1}`}
                    >
                      + Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating Trade...' : 'Create Trade'}
          </button>
          <Link
            to="/trainers/search"
            className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-center hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </Link>
        </div>
      </form>

      {modalOpen && modalSide && modalSlotIndex !== null && senderId && (
        <PokemonSelectModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSelect={handlePokemonSelect}
          trainerId={modalSide === 'sender' ? senderId : receiverId!}
          selectedIds={modalSide === 'sender' ? selectedSenderIds : selectedReceiverIds}
          title={
            modalSide === 'sender'
              ? 'Select Pokémon to Offer'
              : `Select Pokémon from ${receiverInfo.firstName} ${
                receiverInfo.lastName
              }`
          }
        />
      )}
    </main>
  );
}

export default TradeCreate;
