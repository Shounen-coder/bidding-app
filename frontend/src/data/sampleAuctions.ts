import { type Auction, type Product, type Category, type User } from '../types';

// Sample users (sellers)
const sampleUsers: User[] = [
  {
    id: 1,
    username: 'tech_collector',
    email: 'collector@example.com',
    first_name: 'John',
    last_name: 'Smith',
    phone: '+1-555-0101',
    profile_image: '',
    is_verified: true,
    is_admin: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    username: 'vintage_finds',
    email: 'vintage@example.com',
    first_name: 'Sarah',
    last_name: 'Johnson',
    phone: '+1-555-0102',
    profile_image: '',
    is_verified: true,
    is_admin: false,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  }
];

// Sample categories (matching our database)
const sampleCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and devices',
    icon_name: '💻',
    color_code: '#3B82F6',
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Fashion & Accessories',
    slug: 'fashion',
    description: 'Clothing, jewelry, and style',
    icon_name: '👔',
    color_code: '#EC4899',
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Art & Collectibles',
    slug: 'art',
    description: 'Paintings, sculptures, and collectibles',
    icon_name: '🎨',
    color_code: '#8B5CF6',
    sort_order: 5,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Sample products
const sampleProducts: Product[] = [
  {
    id: 1,
    title: 'MacBook Pro 16" M3 Max - Like New',
    description: 'Barely used MacBook Pro with M3 Max chip, 32GB RAM, 1TB SSD. Perfect for professionals and creatives. Includes original box, charger, and documentation.',
    category_id: 1,
    category: sampleCategories[0],
    starting_price: 1500.00,
    reserve_price: 2200.00,
    buy_now_price: 2800.00,
    bid_increment: 50.00,
    condition: 'like-new',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
    ],
    created_by: 1,
    creator: sampleUsers[0],
    created_at: '2025-08-10T09:00:00Z',
    updated_at: '2025-08-10T09:00:00Z'
  },
  {
    id: 2,
    title: 'Vintage Rolex Submariner 1980s',
    description: 'Authentic vintage Rolex Submariner from the 1980s. Serviced recently, all original parts. A true collector\'s piece with beautiful patina.',
    category_id: 2,
    category: sampleCategories[1],
    starting_price: 8000.00,
    reserve_price: 12000.00,
    bid_increment: 250.00,
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1606859749634-1b36b3b8b8d8?w=800'
    ],
    created_by: 2,
    creator: sampleUsers[1],
    created_at: '2025-08-09T14:30:00Z',
    updated_at: '2025-08-09T14:30:00Z'
  },
  {
    id: 3,
    title: 'Original Banksy Print - Authenticated',
    description: 'Rare authenticated Banksy print from 2019. Certificate of authenticity included. Perfect condition, never framed.',
    category_id: 3,
    category: sampleCategories[2],
    starting_price: 5000.00,
    reserve_price: 8000.00,
    bid_increment: 200.00,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ],
    created_by: 2,
    creator: sampleUsers[1],
    created_at: '2025-08-08T16:45:00Z',
    updated_at: '2025-08-08T16:45:00Z'
  },
  {
    id: 4,
    title: 'iPhone 15 Pro Max 512GB - Unopened',
    description: 'Brand new iPhone 15 Pro Max in Natural Titanium, 512GB storage. Still in original packaging, never opened. Perfect gift or personal upgrade.',
    category_id: 1,
    category: sampleCategories[0],
    starting_price: 800.00,
    reserve_price: 1000.00,
    buy_now_price: 1200.00,
    bid_increment: 25.00,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
    ],
    created_by: 1,
    creator: sampleUsers[0],
    created_at: '2025-08-11T11:20:00Z',
    updated_at: '2025-08-11T11:20:00Z'
  }
];

// Helper function to calculate time remaining
const calculateTimeRemaining = (endTime: string) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

// Sample auctions with different states
export const sampleAuctions: Auction[] = [
  {
    id: 1,
    product_id: 1,
    product: sampleProducts[0],
    start_time: '2025-08-10T09:00:00Z',
    end_time: '2025-08-15T21:00:00Z', // 3 days from now
    current_price: 1850.00,
    current_winner_id: 2,
    current_winner: sampleUsers[1],
    total_bids: 12,
    status: 'active',
    reserve_met: false,
    time_remaining: calculateTimeRemaining('2025-08-15T21:00:00Z'),
    created_at: '2025-08-10T09:00:00Z',
    updated_at: '2025-08-12T14:30:00Z'
  },
  {
    id: 2,
    product_id: 2,
    product: sampleProducts[1],
    start_time: '2025-08-09T14:30:00Z',
    end_time: '2025-08-13T20:30:00Z', // 1 day from now
    current_price: 9200.00,
    current_winner_id: 1,
    current_winner: sampleUsers[0],
    total_bids: 24,
    status: 'active',
    reserve_met: false,
    time_remaining: calculateTimeRemaining('2025-08-13T20:30:00Z'),
    created_at: '2025-08-09T14:30:00Z',
    updated_at: '2025-08-12T16:15:00Z'
  },
  {
    id: 3,
    product_id: 3,
    product: sampleProducts[2],
    start_time: '2025-08-08T16:45:00Z',
    end_time: '2025-08-14T18:45:00Z', // 2 days from now
    current_price: 6400.00,
    current_winner_id: 1,
    current_winner: sampleUsers[0],
    total_bids: 18,
    status: 'active',
    reserve_met: false,
    time_remaining: calculateTimeRemaining('2025-08-14T18:45:00Z'),
    created_at: '2025-08-08T16:45:00Z',
    updated_at: '2025-08-12T10:20:00Z'
  },
  {
    id: 4,
    product_id: 4,
    product: sampleProducts[3],
    start_time: '2025-08-11T11:20:00Z',
    end_time: '2025-08-12T23:59:00Z', // Ending soon (few hours)
    current_price: 950.00,
    current_winner_id: 2,
    current_winner: sampleUsers[1],
    total_bids: 31,
    status: 'active',
    reserve_met: true,
    time_remaining: calculateTimeRemaining('2025-08-12T23:59:00Z'),
    created_at: '2025-08-11T11:20:00Z',
    updated_at: '2025-08-12T18:10:00Z'
  }
];

// Export categories and users for use in other components
export { sampleCategories, sampleUsers };
