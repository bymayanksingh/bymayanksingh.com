import { useEffect, useState, Suspense } from 'react';
import { Terminal, Code, Music as MusicIcon } from 'lucide-react';
import { SpotifyNowPlaying } from '../components/SpotifyNowPlaying';
import { SpotifyPlaylist } from '../components/SpotifyPlaylist';
import { PageHeader } from '../components/PageHeader';
import { fallbackPlaylists } from '../config/fallbackData';

interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  url: string;
  totalTracks: number;
}

export function Music() {
  const [playlists, setPlaylists] = useState<Playlist[]>(fallbackPlaylists);
  const [loading, setLoading] = useState(false);
  const spotifyProfileUrl = 'https://open.spotify.com/user/YOUR_SPOTIFY_USERNAME'; // Replace with your Spotify username

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/spotify/playlists', {
          signal: controller.signal
        });
        
        if (!isMounted) return;
        
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        // Keep using fallback data on error
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchPlaylists();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          path="music"
          description="My musical journey and favorite tunes"
        />

        {/* Now Playing Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <h2 className="text-xl sm:text-2xl text-green-400">~/now-playing</h2>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm pl-6 sm:pl-7 mb-4">
            <Code className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>spotify status --live</span>
          </div>
          <div className="pl-6 sm:pl-7">
            <Suspense fallback={null}>
              <SpotifyNowPlaying />
            </Suspense>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <h2 className="text-xl sm:text-2xl text-green-400">~/profile</h2>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm pl-6 sm:pl-7 mb-4">
            <Code className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>cat spotify-profile.md</span>
          </div>
          <div className="pl-6 sm:pl-7">
            <a
              href={spotifyProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg px-4 py-3 hover:border-green-400/30 transition-colors group"
            >
              <MusicIcon className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 group-hover:text-green-400 transition-colors">
                View Spotify Profile
              </span>
            </a>
          </div>
        </div>

        {/* Playlists Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <h2 className="text-xl sm:text-2xl text-green-400">~/playlists</h2>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm pl-6 sm:pl-7 mb-6">
            <Code className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>ls -la spotify/playlists/</span>
          </div>
          <div className="pl-6 sm:pl-7">
            <Suspense fallback={null}>
              <SpotifyPlaylist playlists={playlists} loading={loading} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
