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

  // ✅ FIXED: Helper function to ensure proper image URLs
  const getImageUrl = (image: string) => {
    if (!image) return '';
    
    // If already a full URL (starts with http/https), return as-is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // If starts with '/', it's an absolute path from root
    if (image.startsWith('/')) {
      return `${window.location.origin}${image}`;
    }
    
    // Otherwise, assume it's a relative path and prepend your API base URL
    // Replace 'your-api-base-url' with your actual API URL
    return `http://localhost:5000/uploads/${image}`;
  };

  // ✅ FIXED: Process and validate images
  const validImages = images
    ?.filter(img => img && img.trim() !== '') // Remove empty/null images
    ?.map(img => getImageUrl(img)) || [];

  console.log('🖼️ ProductGallery Debug:');
  console.log('Original images:', images);
  console.log('Processed images:', validImages);

  if (!validImages || validImages.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-400 text-xl mb-2">📷</div>
        <div className="text-gray-600 font-medium">No Images Available</div>
        <div className="text-gray-500 text-sm">Product images will appear here</div>
      </div>
    );
  }

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  // ✅ FIXED: Handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('❌ Image failed to load:', validImages[activeIndex]);
    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Main Image Display */}
      <div className="relative">
        <img
          src={validImages[activeIndex]}
          alt={`${title} - Image ${activeIndex + 1}`}
          className={`w-full h-96 object-cover cursor-pointer transition-transform duration-300 ${
            isZoomed ? 'transform scale-110' : ''
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          onError={handleImageError}
          loading="lazy"
        />

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          {activeIndex + 1} / {validImages.length}
        </div>

        {/* Condition Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {condition.replace('_', ' ').replace('-', ' ').toUpperCase()}
        </div>

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs">
          Click to {isZoomed ? 'zoom out' : 'zoom in'}
        </div>

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {validImages.length > 1 && (
        <div className="flex space-x-2 p-4 bg-gray-50 overflow-x-auto">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                index === activeIndex
                  ? 'border-teal-400 shadow-lg transform scale-110 ring-2 ring-teal-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
