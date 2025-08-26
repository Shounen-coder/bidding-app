// src/pages/seller/MyAuctions.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { type RootState, type AppDispatch } from '../../store';
import { fetchSellerAuctions, setFilters, deleteSellerAuction } from '../../store/slices/sellerSlice';

const MyAuctions: React.FC = () => {


   // New: Track deleting
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // New: Delete handler
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this auction? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await dispatch(deleteSellerAuction(id)).unwrap();
      // Optionally show a toast/alert here
    } catch (err) {
      alert('Failed to delete auction.');
    } finally {
      setDeletingId(null);
    }
  };


  // Add this helper function near the top of your MyAuctions component
  const getDisplayStatus = (auction: any) => {
    const now = new Date();
    const endTime = new Date(auction.endTime);

    // ✅ Same logic as BidStatusIndicators
    const isAuctionEnded =
      auction.status === 'ended' ||
      auction.status === 'complete' ||
      auction.status === 'finished' ||
      endTime <= now;

    if (isAuctionEnded) {
      return 'ended';
    }

    if (auction.status === 'scheduled') {
      return 'scheduled';
    }

    if (auction.status === 'active') {
      const timeDiff = endTime.getTime() - now.getTime();
      const hoursRemaining = timeDiff / (1000 * 60 * 60);

      // Ending soon if less than 1 hour remaining
      if (hoursRemaining < 1 && hoursRemaining > 0) {
        return 'ending_soon';
      }
      return 'active';
    }

    return auction.status;
  };

  // ✅ Status styling helper
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          text: 'LIVE',
          className: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
        };
      case 'ending_soon':
        return {
          text: 'ENDING SOON',
          className: 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse'
        };
      case 'ended':
        return {
          text: 'ENDED',
          className: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
        };
      case 'scheduled':
        return {
          text: 'SCHEDULED',
          className: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
        };
      default:
        return {
          text: status.toUpperCase(),
          className: 'bg-gray-500 text-white'
        };
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();

  const {
    auctions = [], // Add default empty array
    auctionsPagination = { page: 1, limit: 10, total: 0, pages: 0 }, // Add default pagination
    filters = { status: 'all' }, // Add default filters
    isLoading,
    error
  } = useSelector((state: RootState) => state.seller);

  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

  // Update MyAuctions.tsx useEffect:
  useEffect(() => {
    // Always fetch auctions when component mounts or when coming from creation
    console.log('MyAuctions mounted, fetching auctions with status...', selectedStatus);
    dispatch(fetchSellerAuctions({
      status: selectedStatus,
      page: 1,
      limit: 10
    }));

    if (searchParams.get('created') === 'true') {
      console.log('Auction created successfully!');
      // you can add toastNotifications later
    }
  }, [dispatch, selectedStatus, searchParams]); // Add searchParams as dependency

  // Keep existing useEffect for status changes
  useEffect(() => {
    if (!searchParams.get('created')) { // Only fetch if not coming from creation
      dispatch(fetchSellerAuctions({
        status: selectedStatus,
        page: auctionsPagination?.page || 1,
        limit: auctionsPagination?.limit || 10
      }));
    }
  }, [dispatch, selectedStatus]);

  // In MyAuctions.tsx, add debug logs:
  useEffect(() => {
    console.log('🔍 MyAuctions - Current auctions:', auctions);
    console.log('🔍 MyAuctions - Auctions length:', auctions?.length);
    console.log('🔍 MyAuctions - isLoading:', isLoading);
    console.log('🔍 MyAuctions - error:', error);
  }, [auctions, isLoading, error]);

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    dispatch(setFilters({ status }));
  };

  const handlePageChange = (newPage: number) => {
    const limit = auctionsPagination?.limit || 10;
    dispatch(fetchSellerAuctions({
      status: selectedStatus,
      page: newPage,
      limit: limit
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Less than 1h left';
  };

  // Safe access to pagination properties for render
  const currentPage = auctionsPagination?.page || 1;
  const totalPages = auctionsPagination?.pages || 0;
  const limit = auctionsPagination?.limit || 10;
  const total = auctionsPagination?.total || 0;

  if (isLoading && auctions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Auctions</h1>
          <p className="text-gray-600 mt-1">Manage your auction listings</p>
        </div>
        <Link
          to="/dashboard/sell/create"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Auction
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex space-x-2">
          {['all', 'active', 'scheduled', 'ended', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selectedStatus === status
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Auctions List */}
      {auctions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No auctions found</h3>
          <p className="text-gray-600 mb-6">
            {selectedStatus === 'all'
              ? "You haven't created any auctions yet."
              : `No ${selectedStatus} auctions found.`
            }
          </p>
          <Link
            to="/dashboard/sell/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
          >
            Create Your First Auction
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Item</div>
            <div className="col-span-2">Current Price</div>
            <div className="col-span-1">Bids</div>
            <div className="col-span-1">Views</div>
            <div className="col-span-2">Time Left</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {auctions.map((auction) => {
              // ✅ Use fixed logic for status
              const displayStatus = getDisplayStatus(auction);
              const statusConfig = getStatusConfig(displayStatus);

              return (
                <div key={auction.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50">
                  {/* Item */}
                  <div className="col-span-4">
                    <div className="flex items-center space-x-3">
                      {auction.product?.images && auction.product.images.length > 0 ? (
                        <img
                          src={auction.product.images[0]}
                          alt={auction.product?.title || 'Auction item'}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {auction.product?.title || 'Untitled'}
                        </p>
                        <p className="text-xs text-gray-500">{auction.category?.name || 'No category'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Price */}
                  <div className="col-span-2 flex items-center">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        ${auction.currentPrice || auction.startingPrice || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        Start: ${auction.startingPrice || 0}
                      </p>
                    </div>
                  </div>

                  {/* Bids */}
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-gray-900">{auction.totalBids ?? 0}</p>
                  </div>

                  {/* Views */}
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-gray-900">{auction.viewCount ?? 0}</p>
                  </div>

                  {/* Time Left */}
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm text-gray-900">
                      {auction.endTime ? getTimeRemaining(auction.endTime) : 'No end time'}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusConfig.className}`}>
                      {statusConfig.text}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex space-x-2">
                      <Link
                        to={`/auctions/${auction.id}`}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                        onClick={() => console.log('🔗 Clicking view for auction ID:', auction.id)}
                      >
                        View
                      </Link>
                      {auction.status === 'draft' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Edit
                        </button>
                      )}
                      {/* ✅ NEW: Delete Button (for draft OR any status you desire) */}
      <button
        className="text-red-600 hover:text-red-700 text-sm font-medium"
        disabled={deletingId === auction.id}
        onClick={() => handleDelete(auction.id)}
      >
        {deletingId === auction.id ? 'Deleting...' : 'Delete'}
      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * limit) + 1} to{' '}
                  {Math.min(currentPage * limit, total)} of{' '}
                  {total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAuctions;
