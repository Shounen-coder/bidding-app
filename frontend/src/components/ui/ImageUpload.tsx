// src/components/ui/ImageUpload.tsx
import React, { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 6,
  className = '' 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle file selection
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        continue;
      }

      // Check if we're exceeding max images
      if (images.length + newImages.length >= maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        break;
      }

      try {
        const base64 = await convertToBase64(file);
        newImages.push(base64);
      } catch (error) {
        console.error('Error converting file:', error);
        alert(`Failed to process ${file.name}`);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
    
    setUploading(false);
  }, [images, maxImages, onImagesChange]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Remove image
  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-teal-400 bg-teal-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-gray-600">Processing images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {dragActive ? 'Drop images here' : 'Upload product images'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              Drag and drop your images here, or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-teal-600 hover:text-teal-700 font-medium underline"
              >
                browse files
              </button>
            </p>
            
            <div className="text-sm text-gray-500">
              <p>• Maximum {maxImages} images</p>
              <p>• Up to 5MB per image</p>
              <p>• Supports: JPG, PNG, GIF, WebP</p>
            </div>
          </div>
        )}
      </div>

      {/* URL Input Alternative */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or add image URL</span>
        </div>
      </div>

      <URLInput 
        onAddImage={(url) => {
          if (images.length < maxImages) {
            onImagesChange([...images, url]);
          } else {
            alert(`Maximum ${maxImages} images allowed`);
          }
        }}
        disabled={images.length >= maxImages}
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Invalid+Image';
                }}
              />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center text-sm font-bold shadow-lg"
              >
                ×
              </button>
              
              {/* Primary indicator */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image count indicator */}
      <div className="text-sm text-gray-500 text-center">
        {images.length} / {maxImages} images uploaded
      </div>
    </div>
  );
};

// URL Input Component
interface URLInputProps {
  onAddImage: (url: string) => void;
  disabled?: boolean;
}

const URLInput: React.FC<URLInputProps> = ({ onAddImage, disabled }) => {
  const [urlInput, setUrlInput] = useState('');
  const [validating, setValidating] = useState(false);

  const validateAndAddUrl = async () => {
    if (!urlInput.trim()) return;

    setValidating(true);
    
    // Basic URL validation
    try {
      new URL(urlInput);
    } catch {
      alert('Please enter a valid URL');
      setValidating(false);
      return;
    }

    // Test if image loads
    const img = new Image();
    img.onload = () => {
      onAddImage(urlInput.trim());
      setUrlInput('');
      setValidating(false);
    };
    img.onerror = () => {
      alert('Unable to load image from this URL');
      setValidating(false);
    };
    img.src = urlInput;
  };

  return (
    <div className="flex space-x-2">
      <input
        type="url"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        placeholder="https://example.com/image.jpg"
        disabled={disabled || validating}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        onKeyPress={(e) => e.key === 'Enter' && validateAndAddUrl()}
      />
      <button
        type="button"
        onClick={validateAndAddUrl}
        disabled={disabled || !urlInput.trim() || validating}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
      >
        {validating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          'Add'
        )}
      </button>
    </div>
  );
};

export default ImageUpload;
