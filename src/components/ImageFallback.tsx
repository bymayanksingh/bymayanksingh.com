import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function ImageFallback({ src, alt, className = '', fallbackClassName = '' }: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    setImgSrc(src);
    setLoading(true);
    setError(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    console.log('Image failed to load:', imgSrc);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying image load (${retryCount + 1}/${MAX_RETRIES}):`, imgSrc);
      // Add a small delay before retrying
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        // Force a reload by appending a timestamp
        setImgSrc(`${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}`);
      }, 1000);
    } else {
      console.log(`Max retries reached for: ${alt}`);
      setError(true);
      setLoading(false);
    }
  };

  // For Google Drive preview URLs, use an iframe
  if (imgSrc.includes('drive.google.com/file/d/') && imgSrc.includes('/preview')) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={imgSrc}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  if (error || !imgSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 ${fallbackClassName || className}`}>
        <div className="text-gray-600">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <span className="text-sm">Image not available</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={() => {
        setLoading(false);
        setError(false);
      }}
      style={{ opacity: loading ? 0 : 1 }}
    />
  );
}
