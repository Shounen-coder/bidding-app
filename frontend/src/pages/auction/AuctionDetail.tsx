import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { fetchAuctionById, clearCurrentAuction } from '../../store/slices/auctionSlice';
import CountdownTimer from '../../components/auction/CountdownTimer';
import LiveBidHistory from '../../components/auction/LiveBidHistory';
import BidForm from '../../components/auction/BidForm';
import BidStatusIndicators from '../../components/auction/BidStatusIndicators';
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

  // In your AuctionDetail component, restructure the layout like this:
return (
  <div className="max-w-7xl mx-auto p-6">
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
      <p className="text-xl text-gray-600 max-w-4xl">{product.description}</p>
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Product Images and Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Your existing product image and details */}
          <div className="mb-6">
            {product.images && product.images.length > 0 ? (
              <img 
                src={`/images/products/${product.images[0]}`} 
                alt={product.title} 
                className="w-full h-96 object-cover rounded-lg shadow-md" 
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
                <span className="text-gray-500 text-lg">No Image Available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Category:</span>
              <span className="ml-2 text-gray-600">
                {category.name}
                {subcategory ? ` > ${subcategory.name}` : ''}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Condition:</span>
              <span className="ml-2 text-gray-600 capitalize">{product.condition}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Seller:</span>
              <span className="ml-2 text-gray-600">
                {seller.firstName} {seller.lastName} ({seller.username})
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Starting Price:</span>
              <span className="ml-2 text-gray-600">{formatPrice(product.startingPrice)}</span>
            </div>
          </div>
        </div>

        {/* Bid Form */}
        <BidForm
          auctionId={currentAuction.id}
          auctionTitle={product.title}
          currentPrice={currentPrice || product.startingPrice}
          nextMinBid={nextMinBid || (currentPrice || product.startingPrice) + product.bidIncrement}
          bidIncrement={product.bidIncrement}
          isActive={status === 'active'}
          reservePrice={product.reservePrice}
          reserveMet={reserveMet}
          onBidPlaced={(bidData) => {
            setTimeout(() => {
  dispatch(fetchAuctionById(currentAuction.id));
}, 5000);

          }}
        />

        {/* Live Bid History */}
        <LiveBidHistory 
          auctionId={currentAuction.id}
          initialBids={currentAuction.bids || []}
          currentUserId={user?.id}
          auctionStatus={currentAuction.status}
        />
      </div>

      {/* Right Column - Bid Status Panel */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <BidStatusIndicators
            currentPrice={currentPrice || product.startingPrice}
            startingPrice={product.startingPrice}
            nextMinBid={nextMinBid || (currentPrice || product.startingPrice) + product.bidIncrement}
            reservePrice={product.reservePrice}
            reserveMet={reserveMet}
            totalBids={totalBids}
            timeRemaining={timeRemaining}
            status={status}
          />
        </div>
      </div>
    </div>
  </div>
);

};

export default AuctionDetail;
