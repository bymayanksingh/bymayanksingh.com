import { useEffect, useState } from 'react';
import { Command, Music } from 'lucide-react';
import { fallbackSpotifyData } from '../config/fallbackData';

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}

export function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData>(fallbackSpotifyData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/spotify/now-playing', {
          signal: controller.signal
        });
        
        if (!isMounted) return;
        
        const newData = await response.json();
        setData(newData);
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching Spotify data:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch Spotify data'));
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every minute instead of 30 seconds to reduce API calls
    const interval = setInterval(fetchData, 60000);
    
    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  if (loading && !data.isPlaying) {
    return (
      <div className="flex items-center space-x-2 text-green-400/90">
        <Command className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!data.isPlaying) {
    return (
      <div className="flex items-center space-x-2 text-gray-400/80">
        <Music className="w-4 h-4" />
        <span className="text-sm">Not playing</span>
      </div>
    );
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg p-4 hover:border-green-400/30 transition-colors group"
    >
      {/* Album Art with lazy loading */}
      <div className="flex-shrink-0">
        <img
          src={data.albumImageUrl}
          alt={data.album}
          className="w-16 h-16 rounded-md shadow-lg transform group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>

      {/* Song Info */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <Music className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-400">Now Playing</span>
        </div>
        <h3 className="text-white font-medium truncate group-hover:text-green-400 transition-colors">
          {data.title}
        </h3>
        <p className="text-gray-400 text-sm truncate">
          {data.artist} • {data.album}
        </p>
      </div>
    </a>
  );
}
