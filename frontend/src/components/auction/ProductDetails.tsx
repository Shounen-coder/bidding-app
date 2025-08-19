import React from 'react';

interface ProductDetailsProps {
  product: {
    title: string;
    description: string;
    condition: string;
    startingPrice: number;
    reservePrice?: number | null;
    buyNowPrice?: number | null;
    bidIncrement: number;
  };
  category: {
    name: string;
    slug: string;
  };
  subcategory?: {
    name: string;
    slug: string;
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  category,
  subcategory
}) => {
  const formatPrice = (price: number) => 
    price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new': return 'text-green-600 bg-green-50';
      case 'like-new': return 'text-blue-600 bg-blue-50';
      case 'good': return 'text-yellow-600 bg-yellow-50';
      case 'fair': return 'text-orange-600 bg-orange-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{category.name}</span>
          {subcategory && (
            <>
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>{subcategory.name}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
      </div>

      {/* Key Product Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Starting Price</div>
          <div className="text-lg font-bold text-gray-900">{formatPrice(product.startingPrice)}</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Bid Increment</div>
          <div className="text-lg font-bold text-blue-600">{formatPrice(product.bidIncrement)}</div>
        </div>

        {product.reservePrice !== null && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Reserve Price</div>
            <div className="text-lg font-bold text-purple-600">{formatPrice(product.reservePrice!)}</div>
          </div>
        )}

        {product.buyNowPrice !== null && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Buy Now Price</div>
            <div className="text-lg font-bold text-green-600">{formatPrice(product.buyNowPrice!)}</div>
          </div>
        )}
      </div>

      {/* Condition */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Condition</h3>
        <div className="flex items-center">
          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getConditionColor(product.condition)}`}>
            {product.condition.toUpperCase()}
          </span>
          <div className="ml-4 text-sm text-gray-600">
            {product.condition === 'new' && 'Brand new, unused item in original packaging'}
            {product.condition === 'like-new' && 'Excellent condition, minimal signs of use'}
            {product.condition === 'good' && 'Good condition with normal wear from use'}
            {product.condition === 'fair' && 'Fair condition with visible signs of wear'}
            {product.condition === 'poor' && 'Poor condition, significant wear or damage'}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
