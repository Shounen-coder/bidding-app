import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuctionCard from '../../components/auction/AuctionCard';

const SellerItemsPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch seller's auctions
    const fetchSellerAuctions = async () => {
      try {
        const response = await fetch(`/api/seller/auctions?sellerId=${sellerId}`);
        const data = await response.json();
        setAuctions(data.auctions || []);
      } catch (error) {
        console.error('Error fetching seller auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchSellerAuctions();
    }
  }, [sellerId]);

  if (loading) return <div className="p-8">Loading seller items...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Seller's Other Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction: any) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default SellerItemsPage;
