import React from 'react';
import { type Category } from '../../types';

// Sample categories data (later we'll fetch from API)
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
    created_at: '',
    updated_at: ''
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
    created_at: '',
    updated_at: ''
  },
  {
    id: 3,
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture, decor, and plants',
    icon_name: '🏠',
    color_code: '#10B981',
    sort_order: 3,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 4,
    name: 'Sports & Recreation',
    slug: 'sports',
    description: 'Athletic gear and equipment',
    icon_name: '⚽',
    color_code: '#F59E0B',
    sort_order: 4,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 5,
    name: 'Art & Collectibles',
    slug: 'art',
    description: 'Paintings, sculptures, and collectibles',
    icon_name: '🎨',
    color_code: '#8B5CF6',
    sort_order: 5,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 6,
    name: 'Automotive',
    slug: 'automotive',
    description: 'Cars, motorcycles, and parts',
    icon_name: '🚗',
    color_code: '#EF4444',
    sort_order: 6,
    is_active: true,
    created_at: '',
    updated_at: ''
  }
];

interface CategoryGridProps {
  onCategorySelect?: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing auctions across our most popular categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sampleCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect && onCategorySelect(category)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 text-center border-2 border-transparent hover:border-gray-200">
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
                <div className="text-xs text-gray-400">
                  View Auctions →
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            View All Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
