import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Category } from '../../types';
import { sampleCategories } from '../../data/sampleAuctions';

interface CategoryGridProps {
  onCategorySelect?: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  // Duplicate categories for seamless loop
  const duplicatedCategories = [...sampleCategories, ...sampleCategories, ...sampleCategories];

  return (
    <div ref={containerRef} className="category-grid-container">
      {/* Carousel Container - Full Width */}
      <div className="relative overflow-hidden bg-gradient-to-r from-transparent via-gray-50 to-transparent py-12">
        
        {/* First Row - Left to Right */}
        <div className="flex space-x-6 animate-scroll-left mb-8">
          {duplicatedCategories.map((category, index) => (
            <Link
              key={`row1-${index}`}
              to={`/auctions?category=${encodeURIComponent(category.name)}`}
              onClick={() => handleCategoryClick(category)}
              className="category-card group flex-shrink-0"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`
                w-80 h-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
                transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                ${isVisible ? 'animate-fade-in-scale' : 'opacity-0'}
                ${hoveredCard === index ? 'ring-2 ring-teal-400' : ''}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  {/* Icon Section */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      {category.icon_name}
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 mt-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                      {category.description}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-teal-100 group-hover:text-teal-700 transition-all duration-300">
                      {category.subcategories?.length || 0} subcategories
                    </span>
                    
                    {/* Progress Bar */}
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Second Row - Right to Left */}
        <div className="flex space-x-6 animate-scroll-right">
          {duplicatedCategories.map((category, index) => (
            <Link
              key={`row2-${index}`}
              to={`/auctions?category=${encodeURIComponent(category.name)}`}
              onClick={() => handleCategoryClick(category)}
              className="category-card group flex-shrink-0"
              onMouseEnter={() => setHoveredCard(index + 1000)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`
                w-80 h-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
                transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                ${isVisible ? 'animate-fade-in-scale' : 'opacity-0'}
                ${hoveredCard === index + 1000 ? 'ring-2 ring-teal-400' : ''}
              `}
              style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                {/* Card Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  {/* Icon Section */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-xl flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      {category.icon_name}
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 mt-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                      {category.description}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-teal-100 group-hover:text-teal-700 transition-all duration-300">
                      {category.subcategories?.length || 0} subcategories
                    </span>
                    
                    {/* Progress Bar */}
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* Enhanced Call to Action */}
      <div className="text-center mt-12">
        <Link
          to="/auctions"
          className="inline-flex items-center px-8 py-4 bg-[#1f3c4a] hover:bg-teal-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
        >
          <span className="mr-2">View All Auctions</span>
          <svg 
            className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* CSS Animations */}
      <style>{`
        .animate-scroll-left {
          animation: scrollLeft 10s linear infinite;
        }
        
        .animate-scroll-right {
          animation: scrollRight 10s linear infinite;
        }
        
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        
        @keyframes scrollRight {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        
        .animate-fade-in-scale {
          animation: fadeInScale 0.8s ease forwards;
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .category-card {
          position: relative;
        }
        
        .category-card:hover .animate-scroll-left,
        .category-card:hover .animate-scroll-right {
          animation-play-state: paused;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CategoryGrid;
