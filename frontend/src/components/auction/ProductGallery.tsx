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
      <div className={`bg-gray-100 rounded-xl flex flex-col items-center justify-center h-96 ${className}`}>
        <svg className="w-24 h-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 text-lg font-medium">No Images Available</p>
        <p className="text-gray-400 text-sm">Product images will appear here</p>
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
          className="relative h-96 lg:h-[500px] bg-gray-50 rounded-xl overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-blue-300 transition-colors"
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
          <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Condition Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              condition === 'new' ? 'bg-green-600 text-white' :
              condition === 'like-new' ? 'bg-blue-600 text-white' :
              condition === 'good' ? 'bg-yellow-600 text-white' :
              condition === 'fair' ? 'bg-orange-600 text-white' :
              'bg-red-600 text-white'
            }`}>
              {condition.toUpperCase()}
            </span>
          </div>

          {/* Zoom Indicator */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Click to {isZoomed ? 'zoom out' : 'zoom in'}
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === activeIndex
                  ? 'border-blue-500 shadow-lg transform scale-105'
                  : 'border-gray-200 hover:border-gray-300'
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
