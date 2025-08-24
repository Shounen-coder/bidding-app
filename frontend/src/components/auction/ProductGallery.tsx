import React, { useState } from 'react';


interface ProductGalleryProps {
  images: string[];
  title: string;
  condition: string;
  className?: string;
}


const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  title,
  condition,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);


  if (!images || images.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex flex-col items-center justify-center h-96 border border-slate-200 shadow-lg ${className}`}>
        <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full p-6 mb-6">
          <svg className="w-16 h-16 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-slate-600 text-lg font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">No Images Available</p>
        <p className="text-slate-500 text-sm mt-2">Product images will appear here</p>
      </div>
    );
  }


  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };


  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };


  return (
    <div className={`${className}`}>
      {/* Main Image Display */}
      <div className="relative mb-6 group">
        <div 
          className="relative h-96 lg:h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden cursor-pointer border-2 border-slate-200 hover:border-teal-400 transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={`/images/products/${images[activeIndex]}`}
            alt={`${title} - Image ${activeIndex + 1}`}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'transform scale-110' : ''
            }`}
          />
          
          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#1f3c4a] to-slate-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            {activeIndex + 1} / {images.length}
          </div>


          {/* Condition Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
              condition === 'new' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' :
              condition === 'like-new' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
              condition === 'good' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' :
              condition === 'fair' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' :
              'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}>
              {condition.toUpperCase()}
            </span>
          </div>


          {/* Zoom Indicator */}
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg">
            Click to {isZoomed ? 'zoom out' : 'zoom in'}
          </div>
        </div>


        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-400 rounded-full p-3 shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 border border-slate-200"
            >
              <svg className="w-6 h-6 text-slate-700 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-400 rounded-full p-3 shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 border border-slate-200"
            >
              <svg className="w-6 h-6 text-slate-700 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>


      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex space-x-4 overflow-x-auto pb-2 px-1">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                index === activeIndex
                  ? 'border-teal-400 shadow-lg transform scale-110 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img
                src={`/images/products/${image}`}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
