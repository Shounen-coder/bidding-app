import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { sampleCategories, sampleAuctions } from '../../data/sampleAuctions';

const Explore: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set());
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Enhanced parallax and scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Parallax for hero
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      
      // Nav visibility after hero section
      const heroHeight = window.innerHeight * 0.7; // 70vh
      setIsNavVisible(scrollY > heroHeight - 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll for featured auctions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredAuctions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleElements(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-30px' }
    );

    const animatedElements = contentRef.current?.querySelectorAll('.animate-on-scroll');
    animatedElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // High-quality image data
  const featuredAuctions = [
    {
      id: 1,
      title: "Vintage Rolex Submariner 1965",
      currentBid: 15750,
      bidCount: 23,
      timeLeft: "2d 14h",
      image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=800&q=80",
      category: "Luxury Watches"
    },
    {
      id: 2,
      title: "Rare 1952 Ferrari 212 Europa",
      currentBid: 890000,
      bidCount: 45,
      timeLeft: "5d 8h",
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
      category: "Classic Cars"
    },
    {
      id: 3,
      title: "Picasso Original Sketch 1943",
      currentBid: 125000,
      bidCount: 67,
      timeLeft: "1d 3h",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
      category: "Fine Art"
    },
    {
      id: 4,
      title: "Hermès Birkin Bag Collection",
      currentBid: 35000,
      bidCount: 31,
      timeLeft: "3d 12h",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      category: "Luxury Fashion"
    },
    {
      id: 5,
      title: "Steinway Grand Piano 1925",
      currentBid: 78000,
      bidCount: 18,
      timeLeft: "6d 4h",
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80",
      category: "Musical Instruments"
    }
  ];

  const endingSoonAuctions = [
    {
      id: 6,
      title: "Diamond Tennis Bracelet",
      currentBid: 8500,
      bidCount: 42,
      timeLeft: "2h 15m",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 7,
      title: "Vintage Leica Camera",
      currentBid: 3200,
      bidCount: 28,
      timeLeft: "4h 30m",
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 8,
      title: "Persian Silk Carpet",
      currentBid: 12000,
      bidCount: 35,
      timeLeft: "1h 45m",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 9,
      title: "Ming Dynasty Vase",
      currentBid: 25000,
      bidCount: 19,
      timeLeft: "3h 22m",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 10,
      title: "Vintage Wine Collection",
      currentBid: 5600,
      bidCount: 51,
      timeLeft: "5h 10m",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 11,
      title: "Antique Silver Set",
      currentBid: 4200,
      bidCount: 33,
      timeLeft: "6h 55m",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const popularAuctions = [
    {
      id: 12,
      title: "Contemporary Art Collection",
      currentBid: 45000,
      bidCount: 89,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 13,
      title: "Luxury Watch Set",
      currentBid: 18500,
      bidCount: 67,
      image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 14,
      title: "Designer Furniture",
      currentBid: 12300,
      bidCount: 54,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 15,
      title: "Rare Book Collection",
      currentBid: 8900,
      bidCount: 43,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 16,
      title: "Vintage Jewelry",
      currentBid: 15600,
      bidCount: 72,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 17,
      title: "Classic Motorcycle",
      currentBid: 28000,
      bidCount: 91,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const categoryCollections = [
    {
      title: "Fine Art & Paintings",
      items: [
        {
          id: 18,
          title: "Abstract Oil Painting",
          currentBid: 8500,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 19,
          title: "Watercolor Landscape",
          currentBid: 3200,
          image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 20,
          title: "Modern Sculpture",
          currentBid: 12000,
          image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 21,
          title: "Vintage Photography",
          currentBid: 2800,
          image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 22,
          title: "Classical Portrait",
          currentBid: 15600,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=300&q=80"
        }
      ]
    },
    {
      title: "Luxury Watches & Jewelry",
      items: [
        {
          id: 23,
          title: "Patek Philippe Watch",
          currentBid: 45000,
          image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 24,
          title: "Diamond Engagement Ring",
          currentBid: 18500,
          image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 25,
          title: "Vintage Omega",
          currentBid: 8200,
          image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 26,
          title: "Pearl Necklace Set",
          currentBid: 6800,
          image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 27,
          title: "Gold Bracelet Collection",
          currentBid: 12500,
          image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80"
        }
      ]
    },
    {
      title: "Classic Cars & Motorcycles",
      items: [
        {
          id: 28,
          title: "1967 Mustang GT",
          currentBid: 85000,
          image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 29,
          title: "Vintage Harley Davidson",
          currentBid: 28000,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 30,
          title: "Porsche 911 Classic",
          currentBid: 125000,
          image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 31,
          title: "BMW Motorcycle",
          currentBid: 15600,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 32,
          title: "Classic Chevrolet",
          currentBid: 65000,
          image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=300&q=80"
        }
      ]
    }
  ];

  const quickFilters = [
    { name: 'All Categories', active: activeCategory === null },
    { name: 'Art', active: activeCategory === 'art' },
    { name: 'Watches', active: activeCategory === 'watches' },
    { name: 'Cars', active: activeCategory === 'cars' },
    { name: 'Fashion', active: activeCategory === 'fashion' },
    { name: 'Jewelry', active: activeCategory === 'jewelry' },
    { name: 'Antiques', active: activeCategory === 'antiques' },
    { name: 'Electronics', active: activeCategory === 'electronics' },
    { name: 'Books', active: activeCategory === 'books' },
    { name: 'Music', active: activeCategory === 'music' }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

// First, let's add the dropdown state for each category filter
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);


// Enhanced category data with subcategories
const enhancedCategories = sampleCategories.slice(0, 8).map((category, index) => {
  const categoryMap: { [key: number]: string[] } = {
    0: ['Fine Art & Paintings', 'Sculptures', 'Photography', 'Digital Art'],
    1: ["Men's Clothing", "Women's Clothing", 'Shoes & Footwear', 'Accessories'],
    2: ['Furniture', 'Garden & Outdoor', 'Home Decor', 'Kitchen & Dining'],
    3: ['Smartphones', 'Laptops & Computers', 'Cameras & Photography', 'Wearables & Smartwatches'],
    4: ['Classic Cars', 'Sports Cars', 'Luxury Cars', 'Motorcycles'],
    5: ['Fine Art & Paintings', 'Coins & Currency', 'Vintage Toys', 'Stamps'],
    6: ['Diamond Jewelry', 'Gold Jewelry', 'Silver Jewelry', 'Vintage Jewelry'],
    7: ['Luxury Watches', 'Vintage Watches', 'Smartwatches', 'Watch Accessories']
  };
  
  return {
    ...category,
    subcategories: categoryMap[index] || []
  };
});

// Map category filters to their subcategories
const categorySubcategories = {
  'art': ['Fine Art & Paintings', 'Sculptures', 'Photography', 'Digital Art'],
  'watches': ['Luxury Watches', 'Vintage Watches', 'Smartwatches', 'Watch Accessories'], 
  'cars': ['Classic Cars', 'Sports Cars', 'Luxury Cars', 'Motorcycles'],
  'fashion': ["Men's Clothing", "Women's Clothing", 'Shoes & Footwear', 'Accessories'],
  'jewelry': ['Diamond Jewelry', 'Gold Jewelry', 'Silver Jewelry', 'Vintage Jewelry'],
  'antiques': ['Furniture', 'Coins & Currency', 'Vintage Toys', 'Collectibles']
};


//   // First, let's add the subcategory data structure at the top of your component, after the imports:

// const subcategoriesData: Record<number, string[]> = {
//   1: ["Smartphones", "Laptops & Computers", "Wearables & Smartwatches", "Cameras & Photography"],
//   2: ["Men's Clothing", "Women's Clothing", "Jewelry & Watches", "Shoes & Footwear"],
//   3: ["Furniture", "Garden & Outdoor", "Home Decor"],
//   5: ["Fine Art & Paintings", "Coins & Currency", "Vintage Toys"]
// };

// // Enhanced category data with subcategories
// const enhancedCategories = sampleCategories.slice(0, 8).map((category, index) => ({
//   ...category,
//   parent_id: index + 1,
//   subcategories: subcategoriesData[index + 1] || []
// }));


  // Custom Carousel Component with Manual Navigation
interface CustomCarouselProps {
  items: any[];
  itemsPerView: number;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({ items, itemsPerView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        disabled={!canGoPrev}
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform -translate-x-6 group-hover:translate-x-0
          ${canGoPrev 
            ? 'bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-teal-600 hover:bg-teal-50 cursor-pointer hover:scale-110' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
          }
        `}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        disabled={!canGoNext}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform translate-x-6 group-hover:translate-x-0
          ${canGoNext 
            ? 'bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-teal-600 hover:bg-teal-50 cursor-pointer hover:scale-110' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
          }
        `}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${(items.length / itemsPerView) * 100}%`
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0"
              style={{ width: `${100 / items.length}%` }}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="w-full bg-white rounded-xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 group/item">
                <Link to={`/auctions/${item.id}`} className="block">
                  <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover/item:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-all duration-300"></div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 text-center transform scale-90 group-hover/item:scale-100 transition-transform duration-300">
                        <p className="text-gray-800 font-semibold line-clamp-1">{item.title}</p>
                        <p className="text-teal-600 font-bold">${item.currentBid?.toLocaleString() || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Badge for Popular Items */}
                    {item.bidCount && item.bidCount > 50 && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 animate-pulse">
                        <span>⭐</span>
                        <span>Hot</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover/item:text-teal-600 transition-colors duration-300 line-clamp-1">
                      {item.title}
                    </h3>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">
                        {item.currentBid ? 'Current bid' : 'Starting bid'}
                      </span>
                      <span className="text-xl font-bold text-teal-600">
                        ${item.currentBid?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{item.bidCount || Math.floor(Math.random() * 30) + 5} bids</span>
                      <span>2d 5h left</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${currentIndex === index 
                ? 'bg-teal-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};


  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          ref={heroRef}
          className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] hero-gradient"
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${8 + Math.random() * 12}s`
              }}
            >
              <div className={`rounded-full ${
                i % 5 === 0 ? 'w-3 h-3 bg-teal-400' : 
                i % 5 === 1 ? 'w-2 h-2 bg-cyan-400' : 
                i % 5 === 2 ? 'w-1 h-1 bg-white' :
                i % 5 === 3 ? 'w-2 h-2 bg-blue-400' : 'w-1 h-1 bg-green-400'
              }`} />
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Explore
            </span>
          </h1>
          
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s' }}>
            <p className="text-2xl md:text-3xl mb-8 text-gray-300 max-w-4xl mx-auto">
              Discover amazing auctions across thousands of categories. From rare collectibles to luxury items.
            </p>
          </div>

          {/* Live Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s' }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-teal-400 mb-1">{sampleAuctions.length}</div>
              <div className="text-sm text-gray-300">Live Auctions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-green-400 mb-1">24/7</div>
              <div className="text-sm text-gray-300">Active Bidding</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-cyan-400 mb-1">{sampleCategories.length}+</div>
              <div className="text-sm text-gray-300">Categories</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll-indicator"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Explore Navigation Bar - Appears with Parallax */}
{/* Enhanced Explore Navigation Bar with Individual Dropdowns */}
<section 
  ref={navRef}
  className={`
    fixed top-16 left-0 right-0 z-50 transition-all duration-700 ease-out
    ${isNavVisible 
      ? 'translate-y-0 opacity-100 bg-white/95 backdrop-blur-md shadow-lg' 
      : '-translate-y-full opacity-0'
    }
  `}
>
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between py-3">
      
      {/* Enhanced Search Bar */}
      <div className="flex-1 max-w-md mr-6">
        <div className={`
          relative group transition-all duration-300 
          ${isSearchFocused ? 'transform scale-105' : ''}
        `}>
          <input
            type="text"
            placeholder="Search auctions, categories..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm bg-gray-50 focus:bg-white group-hover:border-gray-400"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Clear Search Button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category Filters with Individual Dropdowns */}
      <div className="flex-1">
        <div className="flex space-x-3 min-w-max">
          {quickFilters.slice(0, 5).map((filter, index) => (
            <div
              key={filter.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(filter.name.toLowerCase())}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => setActiveCategory(filter.active ? null : filter.name.toLowerCase())}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap
                  ${filter.active 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50 bg-gray-100'
                  }
                `}
              >
                {filter.name}
              </button>

              {/* Simple Dropdown for Individual Categories */}
              {activeDropdown === filter.name.toLowerCase() && categorySubcategories[filter.name.toLowerCase() as keyof typeof categorySubcategories] && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-50">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    {filter.name}
                  </div>
                  {categorySubcategories[filter.name.toLowerCase() as keyof typeof categorySubcategories].map((subcategory, subIndex) => (
                    <Link
                      key={subIndex}
                      to={`/auctions?category=${encodeURIComponent(filter.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* "More" Categories with All Subcategories */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('more')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-teal-600 hover:bg-teal-50 bg-gray-100 transition-all duration-300 flex items-center space-x-1">
              <span>More</span>
              <svg className={`w-4 h-4 transform transition-transform duration-200 ${activeDropdown === 'more' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Simple All Categories Dropdown */}
            {activeDropdown === 'more' && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-64 z-50 max-h-80 overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  All Categories
                </div>
                
                {enhancedCategories.map((category, index) => (
                  <div key={category.slug}>
                    <Link
                      to={`/auctions?category=${encodeURIComponent(category.name)}`}
                      className="block px-3 py-3 text-sm text-gray-800 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 font-medium border-b border-gray-50"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {category.name}
                    </Link>
                    
                    {/* Subcategories for each main category */}
                    {category.subcategories && category.subcategories.map((subcategory, subIndex) => (
                      <Link
                        key={subIndex}
                        to={`/auctions?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                        className="block px-6 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                ))}
                
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <Link 
                    to="/categories"
                    className="block px-3 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium hover:bg-teal-50 transition-colors duration-200"
                    onClick={() => setActiveDropdown(null)}
                  >
                    View All Categories →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Options */}
      <div className="flex items-center space-x-3 ml-4">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">Sort:</span>
          <select className="text-teal-600 bg-transparent border-0 text-sm font-medium cursor-pointer hover:text-teal-700 transition-colors duration-200">
            <option>Popular</option>
            <option>Ending Soon</option>
            <option>Newest</option>
          </select>
        </div>
        
        <div className="w-px h-6 bg-gray-300"></div>
        
        <Link 
          to="/auctions"
          className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
        >
          <span>View All</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  </div>
</section>




      {/* Main Content */}
      <div ref={contentRef} className={isNavVisible ? 'pt-20' : ''}>
        
        {/* Featured Auctions Carousel with Images */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-on-scroll opacity-0" data-index="0">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Featured <span className="text-teal-600">Auctions</span>
              </h2>
              <p className="text-xl text-gray-600">Premium items with the highest bidding activity</p>
            </div>

            <div className="relative max-w-7xl mx-auto animate-on-scroll opacity-0" data-index="1">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredAuctions.map((auction, index) => (
                    <div key={auction.id} className="w-full flex-shrink-0 relative group">
                      <div className="h-96 relative overflow-hidden">
                        <img 
                          src={auction.image} 
                          alt={auction.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        
                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex items-end p-8">
                          <div className="text-white max-w-2xl">
                            <div className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                              {auction.category}
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-4">
                              {auction.title}
                            </h3>
                            <div className="flex items-center space-x-6 mb-6">
                              <div>
                                <p className="text-gray-300 text-sm">Current bid</p>
                                <p className="text-2xl font-bold text-teal-400">
                                  ${auction.currentBid.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-300 text-sm">{auction.bidCount} bids</p>
                                <p className="text-lg font-semibold">{auction.timeLeft} left</p>
                              </div>
                            </div>
                            <Link 
                              to={`/auctions/${auction.id}`}
                              className="inline-flex items-center px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                            >
                              <span className="mr-2">Place Bid</span>
                              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel Controls */}
              <div className="flex justify-center space-x-2 mt-6">
                {featuredAuctions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-300
                      ${currentSlide === index ? 'bg-teal-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* You Might Like Section */}
        {/* <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12 animate-on-scroll opacity-0" data-index="2">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  ✨ You Might Like
                </h2>
                <p className="text-lg text-gray-600">Curated recommendations based on popular trends</p>
              </div>
            </div>

            <div className="overflow-x-auto pb-6">
              <div className="flex space-x-6 animate-scroll-x" style={{ width: 'max-content' }}>
                {popularAuctions.map((auction, index) => (
                  <div
                    key={auction.id}
                    className="w-80 bg-white rounded-xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 group"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Link to={`/auctions/${auction.id}`} className="block">
                      <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                        <img 
                          src={auction.image} 
                          alt={auction.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div> */}
                        
                        {/* Hover Overlay */}
                        {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            <p className="text-gray-800 font-semibold">{auction.title}</p>
                            <p className="text-teal-600 font-bold">${auction.currentBid.toLocaleString()}</p>
                          </div>
                        </div> */}

                        {/* Popular Badge */}
                        {/* <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                          <span>⭐</span>
                          <span>Popular</span>
                        </div>
                      </div> */}
                      
                      {/* <div className="p-6">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-teal-600 transition-colors duration-300 line-clamp-1">
                          {auction.title}
                        </h3>
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-500">Current bid</span>
                          <span className="text-xl font-bold text-teal-600">
                            ${auction.currentBid.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{auction.bidCount} bids</span>
                          <span>2d 5h left</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* You Might Like Section with Manual Navigation */}
<section className="py-16 bg-gradient-to-b from-gray-50 to-white">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between mb-12 animate-on-scroll opacity-0" data-index="2">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          ✨ You Might Like
        </h2>
        <p className="text-lg text-gray-600">Curated recommendations based on popular trends</p>
      </div>
    </div>

    {/* Custom Carousel with Manual Navigation */}
    <CustomCarousel items={popularAuctions} itemsPerView={4} />
  </div>
</section>

        {/* Ending Soon Section with Images */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12 animate-on-scroll opacity-0" data-index="3">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  ⏰ Ending Soon
                </h2>
                <p className="text-lg text-gray-600">Don't miss these closing auctions</p>
              </div>
              <Link 
                to="/auctions?status=ending-soon"
                className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-2"
              >
                <span>View All</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {endingSoonAuctions.map((auction, index) => (
                <div
                  key={auction.id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll opacity-0"
                  data-index={index + 4}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link to={`/auctions/${auction.id}`} className="block h-full">
                    <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                      <img 
                        src={auction.image} 
                        alt={auction.title}
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent"></div>
                      
                      {/* Timer Badge */}
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold animate-pulse">
                        {auction.timeLeft}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-800 font-semibold line-clamp-1">{auction.title}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-2 text-gray-800 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                        {auction.title}
                      </h3>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Current bid</span>
                        <span className="text-sm font-bold text-red-600">
                          ${auction.currentBid.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{auction.bidCount} bids</span>
                        <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Collections with Auto-Scroll Carousels */}
        {/* {categoryCollections.map((collection, collectionIndex) => (
          <section key={collection.title} className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-12 animate-on-scroll opacity-0" data-index={collectionIndex + 10}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {collection.title}
                  </h2>
                  <p className="text-lg text-gray-600">Discover premium items in this category</p>
                </div>
                <Link 
                  to={`/auctions?category=${encodeURIComponent(collection.title)}`}
                  className="text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-2"
                >
                  <span>View All</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="overflow-x-auto pb-6">
                <div className="flex space-x-6 animate-scroll-x" style={{ width: 'max-content' }}>
                  {collection.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="w-72 bg-white rounded-xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 group"
                    >
                      <Link to={`/auctions/${item.id}`} className="block">
                        <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div> */}
                          
                          {/* Hover Overlay */}
                          {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                              <p className="text-gray-800 font-semibold">{item.title}</p>
                              <p className="text-teal-600 font-bold">${item.currentBid.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-teal-600 transition-colors duration-300 line-clamp-2">
                            {item.title}
                          </h3>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Starting bid</span>
                            <span className="text-xl font-bold text-teal-600">
                              ${item.currentBid.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))} */}


{/* Category Collections with Manual Navigation */}
{categoryCollections.map((collection, collectionIndex) => (
  <section key={collection.title} className="py-16 bg-gradient-to-b from-gray-50 to-white">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-12 animate-on-scroll opacity-0" data-index={collectionIndex + 10}>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {collection.title}
          </h2>
          <p className="text-lg text-gray-600">Discover premium items in this category</p>
        </div>
        <Link 
          to={`/auctions?category=${encodeURIComponent(collection.title)}`}
          className="text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-2"
        >
          <span>View All</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Custom Carousel for Category Items */}
      <CustomCarousel items={collection.items} itemsPerView={5} />
    </div>
  </section>
))}


      </div>

      {/* Click outside to close dropdown */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMoreMenu(false)}
        ></div>
      )}

      {/* Animation Styles */}
      <style >{`
        .hero-gradient {
          background-size: 400% 400%;
          animation: gradient-shift 20s ease infinite;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-flow 4s ease infinite;
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-20px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(10px) rotate(240deg) scale(0.9); }
          100% { transform: translateY(0px) rotate(360deg) scale(1); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-on-scroll {
          animation: slideUp 0.8s ease forwards;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-scroll-indicator {
          animation: scroll-indicator 2s infinite;
        }
        
        @keyframes scroll-indicator {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(12px); opacity: 1; }
        }
        
        .animate-scroll-x {
          animation: scrollX 30s linear infinite;
        }
        
        @keyframes scrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-dropdown {
          animation: dropdownSlide 0.3s ease forwards;
        }
        
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #14b8a6 #f1f5f9;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #14b8a6, #06b6d4);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #0f766e, #0891b2);
  }
  
  /* Ensure navigation bar doesn't clip dropdown */
  .dropdown-container {
    position: relative;
  }
  
  /* Smooth transitions for dropdown */
  .dropdown-mega-menu {
    will-change: transform, opacity;
    backface-visibility: hidden;
  }

      `}</style>
    </div>
  );
};

export default Explore;
