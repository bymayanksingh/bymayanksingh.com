import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | { url: string; credit?: { name: string; link: string } };
  alt: string;
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

  const imageUrl = typeof src === 'string' ? src : src.url;
  const imageCredit = typeof src === 'object' ? src.credit : undefined;

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 ${fallbackClassName}`}>
        <ImageOff className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        onError={() => setError(true)}
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
