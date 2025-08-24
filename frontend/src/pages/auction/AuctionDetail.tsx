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

//auctionstatus display
// import AuctionStatusDisplay from '../../components/auction/AuctionStatusDisplay';
import NotificationToast from '../../components/auction/NotificationToast';
import { useNotifications } from '../../hooks/useNotifications';

//Product and sellers
import ProductGallery from '../../components/auction/ProductGallery';
import ProductDetails from '../../components/auction/ProductDetails';
import SellerProfile from '../../components/auction/SellerProfile';

//watchlist
import WatchlistButton from '../../components/auction/WatchListButton';

const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { currentAuction, isLoading, error } = useSelector((state: RootState) => state.auctions);

    const {
    notifications,
    removeNotification,
    notifySuccess,
    notifyWarning,
    notifyError
  } = useNotifications();

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


  // ✅ FIXED: Check if current user is the seller
  const isSeller = user && (
    (currentAuction.seller?.id && currentAuction.seller.id === user.id) || 
    (currentAuction.product?.createdBy && currentAuction.product.createdBy === user.id)
  );

  // Check if current user is winning bidder
  const isWinningBidder = Boolean(user && currentAuction?.currentWinnerId === user.id);
  // In your AuctionDetail component, restructure the layout like this:



  const isAuctionEnded = new Date(endTime) <= new Date();


return (
  <div className="max-w-7xl mx-auto p-6">
  {/* Header - Updated with Watchlist on the Right */}
<div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
  {/* Left side - Title and Description */}
  <div className="flex-1">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
    <p className="text-xl text-gray-600 max-w-4xl">{product.description}</p>
  </div>

  {/* Right side - Watchlist and Actions */}
  <div className="flex items-center space-x-3 lg:mt-2">
    {!isAuctionEnded ? (
  <WatchlistButton
    auctionId={currentAuction.id}
    auctionTitle={product.title}
    variant="large"
    className="shadow-lg hover:shadow-xl"
    onStatusChange={(isWatched) => {
      const message = isWatched
        ? 'Added to your watchlist! You\'ll receive notifications about this auction.'
        : 'Removed from watchlist.';
      notifySuccess(isWatched ? 'Added to Watchlist' : 'Removed from Watchlist', message);
    }}
  />
) : (
  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
    <div className="text-red-700 font-semibold">Auction Has Ended</div>
    <div className="text-red-600 text-sm mt-1">Bidding is no longer available</div>
  </div>
)}
    
    <button className="p-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
    </button>
  </div>
</div>

  
  <div className="mb-8">
    {/* <AuctionStatusDisplay
      status={status}
      timeRemaining={timeRemaining ? {...timeRemaining, totalMs:0} : null}
      isWinningBidder={isWinningBidder}
      isOutbid={false} // You can implement logic to track if user was outbid
      endTime={endTime}
      className="flex justify-center"
    /> */}
    <CountdownTimer
     endTime={endTime}
    />
    
  </div>

  {/* Main Content Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Column - Main Content */}
    <div className="lg:col-span-2 space-y-8">
      
      {/* Enhanced Product Gallery and Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Product Gallery */}
        <div className="mb-8">
          <ProductGallery
            images={product.images || []}
            title={product.title}
            condition={product.condition}
          />
        </div>

        <ProductDetails
          product={product}
          category={category}
          subcategory={subcategory}
        />
      </div>

      
{/* {process.env.NODE_ENV === 'development' && (
  <div style={{ 
    background: 'yellow', 
    padding: '10px', 
    fontSize: '12px',
    margin: '10px 0'
  }}>
    DEBUG: Passing to BidForm - auctionId: {currentAuction.id}, productId: {currentAuction.productId}
  </div>
)} */}
      {/* Bid Form */}
      {!isAuctionEnded ? (
        
    <>
          {isSeller ? (
            // Seller message (keep your existing design)
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                You Cannot Bid on Your Own Auction
              </h3>
              <p className="text-blue-600">
                As the seller, you cannot place bids on this auction. You can monitor the bidding activity below.
              </p>
              <div className="mt-4 p-4 bg-white rounded border">
                <p className="text-sm text-gray-600">
                  <strong>Current Bid:</strong> {formatPrice(currentPrice)} 
                  <span className="ml-4">
                    <strong>Total Bids:</strong> {totalBids}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            // BidForm for non-sellers
            <BidForm
              auctionId={currentAuction.id}
              auctionTitle={product.title}
              currentPrice={currentPrice || product.startingPrice}
              nextMinBid={nextMinBid}
              bidIncrement={product.bidIncrement}
              isActive={status === 'active'}
              reservePrice={product.reservePrice}
              reserveMet={reserveMet}
              onBidPlaced={(bidData) => {
                setTimeout(() => {
                  dispatch(fetchAuctionById(currentAuction.id));
                }, 5000);
                
                // ✅ FIXED: Remove the problematic action object
                notifySuccess(
                  'Bid Placed Successfully!',
                  `You're now the highest bidder at ${formatPrice(bidData.bid.amount)}!`
                  // Remove the action object that was causing the error
                );
              }}
            />
          )}
        </>
      ) : (
        // Auction ended
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Auction Has Ended</h3>
          <p className="text-gray-600 mb-4">Bidding is no longer available</p>
          <p className="text-lg font-semibold">
            Final winning bid: {formatPrice(currentPrice)}
          </p>
        </div>
      )}

      {/* Enhanced Live Bid History */}
      <div id="bid-history" className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <svg className="w-7 h-7 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Bid History
          </h2>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {totalBids} total bid{totalBids !== 1 ? 's' : ''}
          </div>
        </div>
        <LiveBidHistory 
          auctionId={currentAuction.id}
          initialBids={currentAuction.bids || []}
          currentUserId={user?.id}
          auctionStatus={currentAuction.status}
          
        />
      </div>
    </div>

    {/* Right Column - Enhanced Bid Status Panel */}
    <div className="lg:col-span-1">
      
      <div className="sticky top-6 space-y-6">
        {/* Main Bid Status */}
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
        
        {/* Enhanced Seller Profile Section */}
<div className="mt-8">
  <SellerProfile
    seller={{
      ...seller,
      id: seller.id || product.createdBy, // Use seller.id or fallback to product.createdBy
    }}
    memberSince={seller.createdAt ? new Date(seller.createdAt).getFullYear().toString() : undefined}
    totalSales={seller.totalAuctions || 0}
    responseTime="< 1 hour"
    reviewsCount={0} // TODO: Implement reviews system later
  />
</div>

        {/* Quick Stats Card */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Auction Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Watchers</span>
              <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Views</span>
              <span className="font-semibold text-gray-900">247</span>
            </div>
            {/* <div className="flex justify-between items-center">
              <span className="text-gray-600">Time Left</span>
              <span className="font-semibold text-blue-600">
                {timeRemaining ? `${timeRemaining.days}d ${timeRemaining.hours}h` : 'Ended'}
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Notification Toasts */}
  {notifications.map(notification => (
    <NotificationToast
      key={notification.id}
      notification={notification}
      onDismiss={removeNotification}
      position="top-right"
    />
  ))}
</div>

);

};

export default AuctionDetail;
