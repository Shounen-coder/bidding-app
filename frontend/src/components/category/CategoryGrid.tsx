import React from 'react';
import { Link } from 'react-router-dom';
import { type Category } from '../../types';
import { sampleCategories } from '../../data/sampleAuctions';


interface CategoryGridProps {
  onCategorySelect?: (category: Category) => void;
}


const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  // Duplicate categories for seamless loop
  const duplicatedCategories = [...sampleCategories, ...sampleCategories, ...sampleCategories];

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">

      {/* Carousel Container - Full Width */}
      <div className="relative space-y-8">
        {/* First Row - Left to Right */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-right space-x-8 space-y-4">
            {duplicatedCategories.map((category, index) => (
              <Link
                key={`row1-${category.id}-${index}`}
                to={`/categories/${category.slug}`}
                className="group cursor-pointer flex-shrink-0 w-96"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200/60 hover:border-teal-300/60 group-hover:bg-white h-32">
                  <div className="flex items-center space-x-6 h-full">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-md border border-gray-100"
                      style={{ backgroundColor: `${category.color_code}20` }}
                    >
                      <span className="text-3xl">{category.icon_name}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-[#1f3c4a] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center text-sm text-teal-600 font-semibold">
                        <span>{category.subcategories?.length || 0} subcategories</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Second Row - Right to Left */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-left space-x-8 space-y-4">
            {duplicatedCategories.map((category, index) => (
              <Link
                key={`row2-${category.id}-${index}`}
                to={`/categories/${category.slug}`}
                className="group cursor-pointer flex-shrink-0 w-96"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200/60 hover:border-teal-300/60 group-hover:bg-white h-32">
                  <div className="flex items-center space-x-6 h-full">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-md border border-gray-100"
                      style={{ backgroundColor: `${category.color_code}20` }}
                    >
                      <span className="text-3xl">{category.icon_name}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-[#1f3c4a] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center text-sm text-teal-600 font-semibold">
                        <span>{category.subcategories?.length || 0} subcategories</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16 px-4 sm:px-6 lg:px-8">
        <Link 
          to="/auctions"
          className="inline-flex items-center bg-gradient-to-r from-[#1f3c4a] to-[#2c5364] hover:from-[#2c5364] hover:to-[#1f3c4a] text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group"
        >
          <span className="text-lg">View All Auctions</span>
          <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* CSS Animations */}
      <style >{`
        @keyframes scroll-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll-right {
          animation: scroll-right 80s linear infinite;
        }

        .animate-scroll-left {
          animation: scroll-left 80s linear infinite;
        }

        /* Pause animation on hover */
        .group:hover .animate-scroll-right,
        .group:hover .animate-scroll-left {
          animation-play-state: paused;
        }

        /* Ensure smooth scrolling */
        .animate-scroll-right,
        .animate-scroll-left {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};


export default CategoryGrid;
