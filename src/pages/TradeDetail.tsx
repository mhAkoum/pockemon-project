import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tradeService } from '../services/tradeService';
import { pokemonService } from '../services/pokemonService';
import { trainerService } from '../services/trainerService';
import { getErrorMessage } from '../utils/errors';
import type { TradeDetail } from '../types/trade';
import type { Pokemon } from '../types/pokemon';
import type { Trainer } from '../types/trainer';

interface TradeDetailWithPokemons extends TradeDetail {
  senderPokemons: Pokemon[];
  receiverPokemons: Pokemon[];
  senderInfo?: Trainer;
  receiverInfo?: Trainer;
}

function TradeDetailPage() {
  const { tradeId } = useParams<{ tradeId: string }>();
  const { trainerId } = useAuth();
  const navigate = useNavigate();
  const [trade, setTrade] = useState<TradeDetailWithPokemons | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTrade = async () => {
      if (!tradeId || !trainerId) {
        setError('Missing trade ID or trainer ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const tradeIdNum = parseInt(tradeId, 10);
        const tradeData = await tradeService.getTrade(tradeIdNum);

        const [senderPokemons, receiverPokemons] = await Promise.all([
          Promise.all(tradeData.sender.pokemons.map((id) => pokemonService.getPokemon(id))),
          Promise.all(tradeData.receiver.pokemons.map((id) => pokemonService.getPokemon(id))),
        ]);

        const [senderInfo, receiverInfo] = await Promise.all([
          trainerService.getTrainer(tradeData.sender.id).catch(() => undefined),
          trainerService.getTrainer(tradeData.receiver.id).catch(() => undefined),
        ]);

        setTrade({
          ...tradeData,
          senderPokemons,
          receiverPokemons,
          senderInfo,
          receiverInfo,
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, [tradeId, trainerId]);

  const handleStatusUpdate = async (statusCode: 'ACCEPTED' | 'DECLINED') => {
    if (!tradeId || !trainerId || !trade) return;

    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      `Are you sure you want to ${statusCode === 'ACCEPTED' ? 'accept' : 'decline'} this trade?`,
    );
    if (!confirmed) return;

    setUpdating(true);
    try {
      const tradeIdNum = parseInt(tradeId, 10);
      await tradeService.updateTrade(tradeIdNum, { statusCode });
      navigate('/trades');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setUpdating(false);
    }
  };

  const isReceiver = trade && trainerId && trade.receiver.id === trainerId;
  const canRespond = isReceiver && trade.statusCode === 'PROPOSITION';

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading trade details...</p>
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
          onClick={() => navigate('/trades')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Trades
        </button>
      </main>
    );
  }

  if (!trade) {
    return (
      <main className="container mx-auto p-4">
        <p className="text-gray-600">Trade not found</p>
        <Link to="/trades" className="text-blue-600 hover:underline">
          Back to Trades
        </Link>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'DECLINED':
        return 'bg-red-100 text-red-800';
      case 'PROPOSITION':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigate('/trades')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Trades
          </button>
          <Link
            to="/trainers/search"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Create New Trade
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">
              Trade #
              {trade.id}
            </h1>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(trade.statusCode)}`}>
              {trade.statusCode}
            </span>
          </div>
          {canRespond && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleStatusUpdate('ACCEPTED')}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Accept'}
              </button>
              <button
                type="button"
                onClick={() => handleStatusUpdate('DECLINED')}
                disabled={updating}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Decline'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Sender
            {trade.senderInfo && (
              <Link
                to={`/trainers/${trade.sender.id}`}
                className="ml-2 text-blue-600 hover:underline text-lg"
              >
                {trade.senderInfo.firstName}
                {' '}
                {trade.senderInfo.lastName}
              </Link>
            )}
          </h2>
          {!trade.senderInfo && (
            <p className="text-gray-600 mb-4">
              Trainer ID:
              {' '}
              {trade.sender.id}
            </p>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Offered Pokémons (
            {trade.senderPokemons.length}
            /6)
          </h3>
          {trade.senderPokemons.length === 0 ? (
            <p className="text-gray-600">No Pokémons offered</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trade.senderPokemons.map((pokemon) => (
                <Link
                  key={pokemon.id}
                  to={`/pokemons/${pokemon.id}`}
                  className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800">{pokemon.name || pokemon.species}</h4>
                    {pokemon.isShiny && (
                      <span className="text-yellow-500 text-xs">✨</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{pokemon.species}</p>
                  <p className="text-gray-600 text-sm">
                    Level:
                    {' '}
                    {pokemon.level}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Receiver
            {trade.receiverInfo && (
              <Link
                to={`/trainers/${trade.receiver.id}`}
                className="ml-2 text-blue-600 hover:underline text-lg"
              >
                {trade.receiverInfo.firstName}
                {' '}
                {trade.receiverInfo.lastName}
              </Link>
            )}
          </h2>
          {!trade.receiverInfo && (
            <p className="text-gray-600 mb-4">
              Trainer ID:
              {' '}
              {trade.receiver.id}
            </p>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Wanted Pokémons (
            {trade.receiverPokemons.length}
            /6)
          </h3>
          {trade.receiverPokemons.length === 0 ? (
            <p className="text-gray-600">No Pokémons wanted</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trade.receiverPokemons.map((pokemon) => (
                <Link
                  key={pokemon.id}
                  to={`/pokemons/${pokemon.id}`}
                  className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800">{pokemon.name || pokemon.species}</h4>
                    {pokemon.isShiny && (
                      <span className="text-yellow-500 text-xs">✨</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{pokemon.species}</p>
                  <p className="text-gray-600 text-sm">
                    Level:
                    {' '}
                    {pokemon.level}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default TradeDetailPage;
