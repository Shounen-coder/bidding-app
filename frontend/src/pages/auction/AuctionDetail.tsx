import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { fetchAuctionById, clearCurrentAuction } from '../../store/slices/auctionSlice';
import CountdownTimer from '../../components/auction/CountdownTimer';
import LiveBidHistory from '../../components/auction/LiveBidHistory';
// import LoadingButton from '../../components/ui/LoadingButton';

const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { currentAuction, isLoading, error } = useSelector((state: RootState) => state.auctions);

  useEffect(() => {
    if (id) {
      dispatch(fetchAuctionById(parseInt(id, 10)));
    }
    return () => {
      dispatch(clearCurrentAuction());
    };
  }, [dispatch, id]);

  if (isLoading || !currentAuction) {
    return <div className="text-center py-24">Loading auction details...</div>;
  }

  if (error) {
    return <div className="text-center py-24 text-red-600">Error: {error}</div>;
  }

  const {
    product, category, subcategory, seller,
    currentPrice, totalBids, status, startTime, endTime, bids,
    timeRemaining, nextMinBid, reserveMet
  } = currentAuction;

  const formatPrice = (price: number | null | undefined) =>
    price !== null && price !== undefined
      ? price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      : '--';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
      <div className="mb-2 text-gray-600">{product.description}</div>
      <div className="mb-6 flex flex-col md:flex-row gap-8">
        <div>
          {product.images && product.images.length > 0 ? (
            <img src={`/images/products/${product.images[0]}`} alt={product.title} className="rounded-lg w-64 h-64 object-cover" />
          ) : <div className="h-64 w-64 flex items-center justify-center bg-gray-200 rounded-lg">No Image</div>}
          <div className="mt-4 font-medium">
            Category: {category.name}
            {subcategory ? ` > ${subcategory.name}` : ''}
          </div>
          <div className="mt-2 text-sm text-gray-500">Condition: {product.condition}</div>
        </div>
        <div>
          <div className="mb-2">
            <span className="block text-lg font-semibold">
              Current Bid: {formatPrice(currentPrice || product.startingPrice)}
            </span>
            <span className="text-gray-400 text-sm">Next Min Bid: {formatPrice(nextMinBid)}</span>
          </div>
          <div className="mb-2">
            <span className="block text-sm text-gray-500">Status: {status}</span>
            <span className="block text-sm text-gray-500">Total bids: {totalBids}</span>
            <span className="block text-sm text-gray-500">Seller: {seller.firstName} {seller.lastName} ({seller.username})</span>
            <span className="block text-sm text-green-600">{reserveMet ? 'Reserve Met' : ''}</span>
          </div>
          {/* {status === 'active' && timeRemaining && (
            <div className="mt-2 text-blue-600 font-medium">
              Time Remaining: {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
            </div>
          )} */}
          {status === 'active' && (
  <CountdownTimer endTime={endTime} className="text-blue-600 font-medium" />
)}
        </div>
      </div>
      <div>
        <LiveBidHistory 
  auctionId={currentAuction.id}
  initialBids={currentAuction.bids || []}
  currentUserId={user?.id} // Pass current user ID for highlighting
  auctionStatus={currentAuction.status} // NEW!
/>
      </div>
    </div>
  );
};

export default AuctionDetail;
