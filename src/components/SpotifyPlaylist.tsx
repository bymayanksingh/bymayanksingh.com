import { fallbackPlaylists } from '../config/fallbackData';

interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  url: string;
  totalTracks: number;
}

interface SpotifyPlaylistProps {
  playlists: Playlist[];
  loading: boolean;
}

// Loading skeleton component
const PlaylistSkeleton = () => (
  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg overflow-hidden">
    <div className="aspect-square bg-gray-800 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-6 bg-gray-800 rounded animate-pulse" />
      <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse" />
      <div className="h-3 bg-gray-800 rounded w-1/3 animate-pulse" />
    </div>
  </div>
);

export function SpotifyPlaylist({ playlists = fallbackPlaylists, loading }: SpotifyPlaylistProps) {
  if (loading && playlists.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {[...Array(3)].map((_, i) => (
          <PlaylistSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {playlists.map((playlist) => (
        <a
          key={playlist.id}
          href={playlist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg overflow-hidden hover:border-green-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/5"
        >
          {/* Playlist Image with lazy loading */}
          <div className="aspect-square relative overflow-hidden bg-gray-800">
            <img
              src={playlist.imageUrl}
              alt={playlist.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
          </div>

          {/* Playlist Info */}
          <div className="p-4">
            <h3 className="text-lg font-medium text-white/90 group-hover:text-green-400 transition-colors mb-1 truncate">
              {playlist.name}
            </h3>
            <p className="text-sm text-gray-400/90 line-clamp-2 mb-2">
              {playlist.description || `A collection of ${playlist.totalTracks} tracks`}
            </p>
            <div className="text-xs text-gray-500">
              {playlist.totalTracks} tracks
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
