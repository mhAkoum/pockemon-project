import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tradeService } from '../services/tradeService';
import { getErrorMessage } from '../utils/errors';
import type { TradeListItem, TradeSearchParams, TradeStatusCode } from '../types/trade';

function TradeList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { trainerId } = useAuth();
  const [trades, setTrades] = useState<TradeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [orderBy, setOrderBy] = useState<'ASC' | 'DESC'>('DESC');
  const [statusFilter, setStatusFilter] = useState<TradeStatusCode | ''>('');

  useEffect(() => {
    const urlOrderBy = searchParams.get('orderBy') as 'ASC' | 'DESC' | null;
    const urlStatus = searchParams.get('statusCode') as TradeStatusCode | null;
    if (urlOrderBy) setOrderBy(urlOrderBy);
    if (urlStatus) setStatusFilter(urlStatus);
  }, [searchParams]);

  useEffect(() => {
    const fetchTrades = async () => {
      if (!trainerId) {
        setError('Trainer ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params: TradeSearchParams = {
          page,
          pageSize,
          orderBy,
        };

        if (statusFilter) {
          params.statusCode = statusFilter;
        }

        const data = await tradeService.getTrades(trainerId, params);
        setTrades(data);

        const urlParams = new URLSearchParams();
        if (orderBy) urlParams.set('orderBy', orderBy);
        if (statusFilter) urlParams.set('statusCode', statusFilter);
        setSearchParams(urlParams);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [trainerId, page, orderBy, statusFilter, setSearchParams]);

  const handleStatusChange = (status: TradeStatusCode | '') => {
    setStatusFilter(status);
    setPage(0);
  };

  const handleOrderToggle = () => {
    const newOrder = orderBy === 'ASC' ? 'DESC' : 'ASC';
    setOrderBy(newOrder);
    setPage(0);
  };

  const getStatusColor = (status: TradeStatusCode) => {
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

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading trades...</p>
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
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Trades</h1>
        <Link
          to="/trainers/search"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Create New Trade
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="statusFilter" className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as TradeStatusCode | '')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="PROPOSITION">Proposition</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="DECLINED">Declined</option>
            </select>
          </div>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="orderBy" className="block text-gray-700 text-sm font-bold mb-2">
              Sort Order
            </label>
            <button
              type="button"
              onClick={handleOrderToggle}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {orderBy === 'ASC' ? '↑ Oldest First' : '↓ Newest First'}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          Found
          {' '}
          {trades.length}
          {' '}
          {trades.length === 1 ? 'trade' : 'trades'}
        </p>
      </div>

      {trades.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No trades found matching your filters.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {trades.map((trade) => (
              <Link
                key={trade.id}
                to={`/trades/${trade.id}`}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(trade.statusCode)}`}>
                        {trade.statusCode}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Trade #
                      {trade.id}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Sender ID:
                      {' '}
                      {trade.sender.id}
                      {' '}
                      | Receiver ID:
                      {' '}
                      {trade.receiver.id}
                    </p>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
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
              disabled={trades.length < pageSize}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default TradeList;
