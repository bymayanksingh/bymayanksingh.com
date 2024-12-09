import { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function ImageFallback({ src, alt, className = '', fallbackClassName = '' }: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || '/images/project-placeholder.jpg');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 1;

  useEffect(() => {
    if (!src) {
      setImgSrc('/images/project-placeholder.jpg');
      setLoading(false);
      return;
    }
    setImgSrc(src);
    setLoading(true);
    setError(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    setImgSrc('/images/project-placeholder.jpg');
    setError(true);
    setLoading(false);
  };

  // For Google Drive preview URLs, use an iframe
  if (imgSrc && imgSrc.includes('drive.google.com/file/d/') && imgSrc.includes('/preview')) {
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
    <div className="relative w-full h-full bg-gray-900">
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={() => {
          setLoading(false);
          setError(false);
        }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-4 border-gray-800 border-t-green-400 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
