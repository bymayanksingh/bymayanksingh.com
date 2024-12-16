import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | { url: string; credit?: { name: string; link: string } };
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function ImageFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackClassName = '',
  ...props 
}: ImageFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    console.error('Image failed to load:', src);
    console.error('Error loading image for:', alt);
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', src);
    setLoading(false);
  };

  // Convert Google Drive URL to a direct access format
  const processImageUrl = (url: string) => {
    if (!url) return url;

    // Handle Google Drive URLs
    if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
      // Extract the file ID
      let fileId = '';
      
      // Match ID from various Google Drive URL formats
      const patterns = [
        /\/file\/d\/([^/]+)/,  // matches /file/d/{fileId}
        /id=([^&]+)/,          // matches id={fileId}
        /\/d\/([^/]+)/         // matches /d/{fileId}
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          fileId = match[1];
          break;
        }
      }

      if (fileId) {
        // Use the direct image proxy URL
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }
    }
    
    return url;
  };

  const imageUrl = typeof src === 'string' ? src : src.url;
  const imageCredit = typeof src === 'object' ? src.credit : undefined;
  const processedSrc = processImageUrl(imageUrl);

  if (error || !processedSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 ${fallbackClassName}`}>
        <ImageOff className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className={`flex items-center justify-center bg-gray-800 ${fallbackClassName || className}`}>
          <div className="w-8 h-8 border-2 border-gray-600 border-t-green-400 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={processedSrc}
        alt={alt}
        className={`${className} ${loading ? 'hidden' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        referrerPolicy="no-referrer"
        {...props}
      />
      {imageCredit && (
        <a
          href={imageCredit.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 text-xs text-white/70 hover:text-white bg-black/50 px-2 py-1 rounded"
        >
          Photo by {imageCredit.name}
        </a>
      )}
    </div>
  );
}
