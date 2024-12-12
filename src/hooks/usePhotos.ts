import { useState, useEffect } from 'react';

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: string;
    location?: string;
    date?: string;
  };
}

// Fallback photos data
const fallbackPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    caption: 'Yosemite Valley',
    metadata: {
      camera: 'Sony A7III',
      lens: '16-35mm f/2.8',
      settings: 'f/11, 1/125s, ISO 100',
      location: 'Yosemite National Park, California',
      date: '2023-06-15'
    }
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    caption: 'Urban Exploration',
    metadata: {
      camera: 'Fujifilm X-T4',
      lens: '23mm f/1.4',
      settings: 'f/2.8, 1/250s, ISO 400',
      location: 'San Francisco, California',
      date: '2023-07-22'
    }
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1682687218147-9806132dc697',
    caption: 'Portrait in Natural Light',
    metadata: {
      camera: 'Canon R5',
      lens: '85mm f/1.2',
      settings: 'f/1.8, 1/200s, ISO 200',
      location: 'Golden Gate Park',
      date: '2023-08-30'
    }
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    caption: 'Mountain Sunrise',
    metadata: {
      camera: 'Sony A7III',
      lens: '24-70mm f/2.8',
      settings: 'f/8, 1/250s, ISO 100',
      location: 'Rocky Mountains',
      date: '2023-09-15'
    }
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
    caption: 'Forest Path',
    metadata: {
      camera: 'Sony A7III',
      lens: '16-35mm f/2.8',
      settings: 'f/4, 1/60s, ISO 400',
      location: 'Redwood National Park',
      date: '2023-10-01'
    }
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    caption: 'Sunset at the Lake',
    metadata: {
      camera: 'Canon R5',
      lens: '70-200mm f/2.8',
      settings: 'f/11, 1/125s, ISO 100',
      location: 'Lake Tahoe',
      date: '2023-11-12'
    }
  }
];

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // TODO: Replace with Firebase fetch when ready
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPhotos(fallbackPhotos);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch photos'));
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return { photos, isLoading, error };
}
