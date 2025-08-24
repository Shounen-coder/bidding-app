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
      case 'new': return 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200';
      case 'like-new': return 'text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200';
      case 'good': return 'text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200';
      case 'fair': return 'text-orange-700 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200';
      case 'poor': return 'text-red-700 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200';
      default: return 'text-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200';
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center text-sm text-slate-600 mb-3">
          <div className="bg-gradient-to-r from-teal-100 to-cyan-100 px-3 py-1 rounded-full">
            <span className="font-medium">{category.name}</span>
          </div>
          {subcategory && (
            <>
              <svg className="w-4 h-4 mx-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <div className="bg-cyan-100 px-3 py-1 rounded-full">
                <span className="font-medium">{subcategory.name}</span>
              </div>
            </>
          )}
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold bg-black bg-clip-text text-transparent">{product.title}</h1>
      </div>

      <div className="p-6">
        {/* Key Product Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-sm text-slate-600 mb-2 font-medium">Starting Price</div>
            <div className="text-lg font-bold text-[#1f3c4a]">{formatPrice(product.startingPrice)}</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-sm text-slate-600 mb-2 font-medium">Bid Increment</div>
            <div className="text-lg font-bold text-blue-600">{formatPrice(product.bidIncrement)}</div>
          </div>


          {product.reservePrice !== null && (
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="text-sm text-slate-600 mb-2 font-medium">Reserve Price</div>
              <div className="text-lg font-bold text-purple-600">{formatPrice(product.reservePrice!)}</div>
            </div>
          )}


          {product.buyNowPrice !== null && (
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="text-sm text-slate-600 mb-2 font-medium">Buy Now Price</div>
              <div className="text-lg font-bold text-emerald-600">{formatPrice(product.buyNowPrice!)}</div>
            </div>
          )}
        </div>


        {/* Condition */}
        <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 bg-black bg-clip-text text-transparent">Condition</h3>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <span className={`inline-block px-6 py-3 rounded-full text-sm font-bold shadow-md ${getConditionColor(product.condition)}`}>
              {product.condition.toUpperCase()}
            </span>
            <div className="text-sm text-slate-600 font-medium">
              {product.condition === 'new' && 'Brand new, unused item in original packaging'}
              {product.condition === 'like-new' && 'Excellent condition, minimal signs of use'}
              {product.condition === 'good' && 'Good condition with normal wear from use'}
              {product.condition === 'fair' && 'Fair condition with visible signs of wear'}
              {product.condition === 'poor' && 'Poor condition, significant wear or damage'}
            </div>
          </div>
        </div>


        {/* Description */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 bg-black bg-clip-text text-transparent flex items-center">
            <svg className="w-5 h-5 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Description
          </h3>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line font-medium">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProductDetails;
