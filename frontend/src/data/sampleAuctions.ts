import { type Auction, type Product, type Category, type Subcategory, type User } from '../types';

// Sample users (keep existing)
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
  },
  {
    id: 3,
    username: 'luxury_dealer',
    email: 'luxury@example.com',
    first_name: 'Michael',
    last_name: 'Chen',
    phone: '+1-555-0103',
    profile_image: '',
    is_verified: true,
    is_admin: false,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z'
  }
];

// Enhanced subcategories
const sampleSubcategories: Subcategory[] = [
  // Electronics subcategories
  { id: 101, parent_category_id: 1, name: 'Smartphones', slug: 'smartphones', description: 'Mobile phones and accessories', sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 102, parent_category_id: 1, name: 'Laptops & Computers', slug: 'laptops-computers', description: 'Laptops, desktops, and computer accessories', sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 103, parent_category_id: 1, name: 'Wearables & Smartwatches', slug: 'wearables-smartwatches', description: 'Smartwatches, fitness trackers, and wearable tech', sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 104, parent_category_id: 1, name: 'Cameras & Photography', slug: 'cameras-photography', description: 'Digital cameras, lenses, and photography equipment', sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 105, parent_category_id: 1, name: 'Gaming Consoles', slug: 'gaming-consoles', description: 'Video game consoles and gaming accessories', sort_order: 5, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 106, parent_category_id: 1, name: 'Audio Equipment', slug: 'audio-equipment', description: 'Headphones, speakers, and audio gear', sort_order: 6, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Fashion & Accessories subcategories
  { id: 201, parent_category_id: 2, name: "Men's Clothing", slug: 'mens-clothing', description: 'Clothing and apparel for men', sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 202, parent_category_id: 2, name: "Women's Clothing", slug: 'womens-clothing', description: 'Clothing and apparel for women', sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 203, parent_category_id: 2, name: 'Jewelry & Watches', slug: 'jewelry-watches', description: 'Fine jewelry, watches, and luxury accessories', sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 204, parent_category_id: 2, name: 'Shoes & Footwear', slug: 'shoes-footwear', description: 'Shoes, boots, and footwear for all occasions', sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 205, parent_category_id: 2, name: 'Handbags & Luggage', slug: 'handbags-luggage', description: 'Handbags, purses, and travel luggage', sort_order: 5, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 206, parent_category_id: 2, name: 'Designer & Luxury', slug: 'designer-luxury', description: 'High-end designer fashion and luxury items', sort_order: 6, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Home & Garden subcategories
  { id: 301, parent_category_id: 3, name: 'Furniture', slug: 'furniture', description: 'Indoor and outdoor furniture', sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 302, parent_category_id: 3, name: 'Garden & Outdoor', slug: 'garden-outdoor', description: 'Garden tools, plants, and outdoor equipment', sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 303, parent_category_id: 3, name: 'Home Decor', slug: 'home-decor', description: 'Decorative items, artwork, and home accessories', sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 304, parent_category_id: 3, name: 'Lighting & Electrical', slug: 'lighting-electrical', description: 'Light fixtures, lamps, and electrical items', sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 305, parent_category_id: 3, name: 'Kitchen & Dining', slug: 'kitchen-dining', description: 'Kitchen appliances, cookware, and dining items', sort_order: 5, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Sports & Recreation subcategories
  { id: 401, parent_category_id: 4, name: 'Fitness Equipment', slug: 'fitness-equipment', description: 'Exercise machines, weights, and fitness gear', sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 402, parent_category_id: 4, name: 'Outdoor Sports', slug: 'outdoor-sports', description: 'Camping, hiking, and outdoor recreation gear', sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 403, parent_category_id: 4, name: 'Team Sports', slug: 'team-sports', description: 'Equipment for football, basketball, soccer, and more', sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 404, parent_category_id: 4, name: 'Water Sports', slug: 'water-sports', description: 'Surfboards, kayaks, and water recreation equipment', sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Art & Collectibles subcategories
  { id: 501, parent_category_id: 5, name: 'Fine Art & Paintings', slug: 'fine-art-paintings', description: 'Original artwork, paintings, and prints', sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 502, parent_category_id: 5, name: 'Coins & Currency', slug: 'coins-currency', description: 'Rare coins, currency, and numismatic items', sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 503, parent_category_id: 5, name: 'Stamps & Postal', slug: 'stamps-postal', description: 'Rare stamps and postal collectibles', sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 504, parent_category_id: 5, name: 'Vintage Toys', slug: 'vintage-toys', description: 'Classic and vintage toys and games', sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 505, parent_category_id: 5, name: 'Memorabilia', slug: 'memorabilia', description: 'Sports, entertainment, and historical memorabilia', sort_order: 5, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Automotive subcategories
  { id: 601, parent_category_id: 6, name: 'Car Parts & Accessories', slug: 'car-parts-accessories', description: 'Auto parts, accessories, and modifications', sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 602, parent_category_id: 6, name: 'Motorcycles & ATVs', slug: 'motorcycles-atvs', description: 'Motorcycles, ATVs, and related equipment', sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 603, parent_category_id: 6, name: 'Classic & Vintage Cars', slug: 'classic-vintage-cars', description: 'Classic, vintage, and collector vehicles', sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 604, parent_category_id: 6, name: 'Tools & Equipment', slug: 'automotive-tools', description: 'Automotive tools and garage equipment', sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Books & Media subcategories
  { id: 701, parent_category_id: 7, name: 'Rare Books', slug: 'rare-books', description: 'First editions, rare, and collectible books', sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 702, parent_category_id: 7, name: 'Vinyl Records', slug: 'vinyl-records', description: 'Vintage and rare vinyl records', sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 703, parent_category_id: 7, name: 'Movies & DVDs', slug: 'movies-dvds', description: 'Movie collections, DVDs, and media', sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 704, parent_category_id: 7, name: 'Magazines & Periodicals', slug: 'magazines-periodicals', description: 'Vintage magazines and periodical collections', sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Antiques subcategories
  { id: 801, parent_category_id: 8, name: 'Vintage Furniture', slug: 'vintage-furniture', description: 'Antique and vintage furniture pieces', sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 802, parent_category_id: 8, name: 'Porcelain & China', slug: 'porcelain-china', description: 'Fine china, porcelain, and ceramic collectibles', sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 803, parent_category_id: 8, name: 'Silverware & Metals', slug: 'silverware-metals', description: 'Silver, brass, and metal antiques', sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 804, parent_category_id: 8, name: 'Clocks & Timepieces', slug: 'clocks-timepieces', description: 'Antique clocks, pocket watches, and timepieces', sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// Enhanced categories with subcategories
const sampleCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    icon_name: '📱',
    color_code: '#3B82F6',
    sort_order: 1,
    is_active: true,
    subcategories: sampleSubcategories.filter(sub => sub.parent_category_id === 1),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Fashion & Accessories',
    slug: 'fashion-accessories',
    description: 'Clothing, jewelry, and fashion accessories',
    icon_name: '👗',
    color_code: '#EC4899',
    sort_order: 2,
    is_active: true,
    subcategories: sampleSubcategories.filter(sub => sub.parent_category_id === 2),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture, decor, and garden items',
    icon_name: '🏡',
    color_code: '#10B981',
    sort_order: 3,
    is_active: true,
    subcategories: sampleSubcategories.filter(sub => sub.parent_category_id === 3),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Sports & Recreation',
    slug: 'sports-recreation',
    description: 'Athletic gear and recreational equipment',
    icon_name: '⚽',
    color_code: '#F59E0B',
    sort_order: 4,
    is_active: true,
    subcategories: sampleSubcategories.filter(sub => sub.parent_category_id === 4),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Art & Collectibles',
    slug: 'art-collectibles',
    description: 'Artwork, collectibles, and unique finds',
    icon_name: '🎨',
    color_code: '#8B5CF6',
    sort_order: 5,
    is_active: true,
    subcategories: sampleSubcategories.filter(sub => sub.parent_category_id === 5),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    name: 'Automotive',
    slug: 'automotive',
    description: 'Cars, motorcycles, and automotive equipment',
    icon_name: '🚗',
    color_code: '#EF4444',
    sort_order: 6,
    is_active: true,
    subcategories: sampleSubcategories.filter(sub => sub.parent_category_id === 6),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 7,
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, vinyl, and media collectibles',
    icon_name: '📚',
    color_code: '#06B6D4',
    sort_order: 7,
    is_active: true,
    subcategories: sampleSubcategories.filter(sub => sub.parent_category_id === 7),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 8,
    name: 'Antiques',
    slug: 'antiques',
    description: 'Vintage and antique treasures',
    icon_name: '🏺',
    color_code: '#84CC16',
    sort_order: 8,
    is_active: true,
    subcategories: sampleSubcategories.filter(sub => sub.parent_category_id === 8),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Enhanced sample products with subcategories
const sampleProducts: Product[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 1TB - Factory Sealed',
    description: 'Brand new iPhone 15 Pro Max in Natural Titanium, 1TB storage. Factory sealed, never opened. Includes all original accessories and 1-year Apple warranty.',
    category_id: 1,
    subcategory_id: 101,
    category: sampleCategories.find(cat => cat.id === 1),
    subcategory: sampleSubcategories.find(sub => sub.id === 101),
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
  },
  {
    id: 2,
    title: 'MacBook Pro 16" M3 Max - Like New',
    description: 'Barely used MacBook Pro with M3 Max chip, 32GB RAM, 1TB SSD. Perfect for professionals and creatives. Includes original box, charger, and documentation.',
    category_id: 1,
    subcategory_id: 102,
    category: sampleCategories.find(cat => cat.id === 1),
    subcategory: sampleSubcategories.find(sub => sub.id === 102),
    starting_price: 1500.00,
    reserve_price: 2200.00,
    buy_now_price: 2800.00,
    bid_increment: 50.00,
    condition: 'like-new',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
    ],
    created_by: 1,
    creator: sampleUsers[0],
    created_at: '2025-08-10T09:00:00Z',
    updated_at: '2025-08-10T09:00:00Z'
  },
  {
    id: 3,
    title: 'Vintage Rolex Submariner 1980s',
    description: 'Authentic vintage Rolex Submariner from the 1980s. Serviced recently, all original parts. A true collector\'s piece with beautiful patina.',
    category_id: 2,
    subcategory_id: 203,
    category: sampleCategories.find(cat => cat.id === 2),
    subcategory: sampleSubcategories.find(sub => sub.id === 203),
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
    id: 4,
    title: 'Original Banksy Print - Authenticated',
    description: 'Rare authenticated Banksy print from 2019. Certificate of authenticity included. Perfect condition, never framed.',
    category_id: 5,
    subcategory_id: 501,
    category: sampleCategories.find(cat => cat.id === 5),
    subcategory: sampleSubcategories.find(sub => sub.id === 501),
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
    id: 5,
    title: 'Herman Miller Aeron Chair - Size B',
    description: 'Classic Herman Miller Aeron ergonomic office chair in excellent condition. Size B (medium). Perfect for home office or professional workspace.',
    category_id: 3,
    subcategory_id: 301,
    category: sampleCategories.find(cat => cat.id === 3),
    subcategory: sampleSubcategories.find(sub => sub.id === 301),
    starting_price: 300.00,
    reserve_price: 500.00,
    bid_increment: 25.00,
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
    ],
    created_by: 3,
    creator: sampleUsers[2],
    created_at: '2025-08-07T10:15:00Z',
    updated_at: '2025-08-07T10:15:00Z'
  },
  {
    id: 6,
    title: 'Canon EOS R5 Camera Body',
    description: 'Professional Canon EOS R5 mirrorless camera body. Low shutter count, excellent condition. Perfect for professional photographers and videographers.',
    category_id: 1,
    subcategory_id: 104,
    category: sampleCategories.find(cat => cat.id === 1),
    subcategory: sampleSubcategories.find(sub => sub.id === 104),
    starting_price: 2000.00,
    reserve_price: 2800.00,
    bid_increment: 100.00,
    condition: 'like-new',
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'
    ],
    created_by: 1,
    creator: sampleUsers[0],
    created_at: '2025-08-06T15:30:00Z',
    updated_at: '2025-08-06T15:30:00Z'
  }
];

// Helper function to calculate time remaining (keep existing)
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

// Enhanced sample auctions
export const sampleAuctions: Auction[] = [
  {
    id: 1,
    product_id: 1,
    product: sampleProducts[0],
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
  },
  {
    id: 2,
    product_id: 2,
    product: sampleProducts[1],
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
    id: 3,
    product_id: 3,
    product: sampleProducts[2],
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
    id: 4,
    product_id: 4,
    product: sampleProducts[3],
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
    id: 5,
    product_id: 5,
    product: sampleProducts[4],
    start_time: '2025-08-07T10:15:00Z',
    end_time: '2025-08-16T22:00:00Z', // 4 days from now
    current_price: 425.00,
    current_winner_id: 3,
    current_winner: sampleUsers[2],
    total_bids: 8,
    status: 'active',
    reserve_met: false,
    time_remaining: calculateTimeRemaining('2025-08-16T22:00:00Z'),
    created_at: '2025-08-07T10:15:00Z',
    updated_at: '2025-08-12T09:45:00Z'
  },
  {
    id: 6,
    product_id: 6,
    product: sampleProducts[5],
    start_time: '2025-08-06T15:30:00Z',
    end_time: '2025-08-17T19:30:00Z', // 5 days from now
    current_price: 2450.00,
    current_winner_id: 1,
    current_winner: sampleUsers[0],
    total_bids: 15,
    status: 'active',
    reserve_met: false,
    time_remaining: calculateTimeRemaining('2025-08-17T19:30:00Z'),
    created_at: '2025-08-06T15:30:00Z',
    updated_at: '2025-08-12T11:22:00Z'
  }
];

// Export enhanced data
export { sampleCategories, sampleSubcategories, sampleUsers, sampleProducts };
