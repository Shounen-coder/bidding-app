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

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing auctions across our comprehensive categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sampleCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-6 text-center border-2 border-transparent hover:border-blue-200">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${category.color_code}20` }}
                >
                  <span className="text-3xl">{category.icon_name}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {category.description}
                </p>
                <div className="flex items-center justify-center text-xs text-blue-600">
                  <span>{category.subcategories?.length || 0} subcategories</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/auctions"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
          >
            View All Auctions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
