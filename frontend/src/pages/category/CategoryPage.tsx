import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { type Category, type Subcategory, type Auction } from '../../types';
import { sampleCategories, sampleAuctions } from '../../data/sampleAuctions';
import AuctionCard from '../../components/auction/AuctionCard';

const CategoryPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug: string;
    subcategorySlug?: string;
  }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load category data
  useEffect(() => {
    const foundCategory = sampleCategories.find(cat => cat.slug === categorySlug);
    setCategory(foundCategory || null);

    if (foundCategory && subcategorySlug) {
      const foundSubcategory = foundCategory.subcategories?.find(sub => sub.slug === subcategorySlug);
      setSelectedSubcategory(foundSubcategory || null);
    } else {
      setSelectedSubcategory(null);
    }

    setLoading(false);
  }, [categorySlug, subcategorySlug]);

  // Filter auctions based on category/subcategory
  useEffect(() => {
    let filtered = sampleAuctions.filter(auction => {
      if (!category) return false;
      
      if (selectedSubcategory) {
        return auction.product?.subcategory?.slug === selectedSubcategory.slug;
      } else {
        return auction.product?.category?.slug === category.slug;
      }
    });

    setFilteredAuctions(filtered);
  }, [category, selectedSubcategory]);

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    navigate(`/category/${categorySlug}/${subcategory.slug}`);
  };

  const handleViewAllCategory = () => {
    navigate(`/category/${categorySlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/auctions" className="hover:text-blue-600">All Categories</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{category.name}</span>
            {selectedSubcategory && (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">{selectedSubcategory.name}</span>
              </>
            )}
          </nav>

          {/* Category Header */}
          <div className="flex items-center space-x-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${category.color_code}20` }}
            >
              <span className="text-4xl">{category.icon_name}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedSubcategory ? selectedSubcategory.name : category.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {selectedSubcategory ? selectedSubcategory.description : category.description}
              </p>
              <div className="text-sm text-gray-500">
                {filteredAuctions.length} auction{filteredAuctions.length !== 1 ? 's' : ''} available
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {category.name} Categories
              </h3>

              {/* View All Option */}
              <div className="mb-4">
                <button
                  onClick={handleViewAllCategory}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedSubcategory 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">View All {category.name}</div>
                  <div className="text-sm text-gray-500">
                    {sampleAuctions.filter(a => a.product?.category?.slug === category.slug).length} auctions
                  </div>
                </button>
              </div>

              {/* Subcategories */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Subcategories
                </h4>
                {category.subcategories?.map((subcategory) => {
                  const subcategoryAuctionCount = sampleAuctions.filter(
                    a => a.product?.subcategory?.slug === subcategory.slug
                  ).length;

                  return (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedSubcategory?.slug === subcategory.slug
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{subcategory.name}</div>
                      <div className="text-sm text-gray-500">
                        {subcategoryAuctionCount} auction{subcategoryAuctionCount !== 1 ? 's' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t">
                <Link
                  to="/auctions"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Browse All Auctions
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Category Switch Tabs (for mobile) */}
            <div className="lg:hidden mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 overflow-x-auto">
                  {sampleCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        cat.slug === categorySlug
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {cat.icon_name} {cat.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Results */}
            {filteredAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAuctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    variant="default"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100">
                  <span className="text-4xl">{category.icon_name}</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No auctions found
                </h3>
                <p className="text-gray-600 mb-6">
                  There are currently no active auctions in{' '}
                  {selectedSubcategory ? selectedSubcategory.name : category.name}.
                </p>
                <Link
                  to="/auctions"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Browse All Auctions
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
