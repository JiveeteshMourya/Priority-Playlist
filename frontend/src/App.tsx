import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Container, CssBaseline, AppBar, Toolbar, Typography, CircularProgress } from '@mui/material';
import { PlaylistPlay } from '@mui/icons-material';
import { VideoPlayer } from './components/VideoPlayer.tsx';
import { PlaylistManager } from './components/PlaylistManager.tsx';
import { PlaylistView } from './components/PlaylistView.tsx';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { extractVideoId, extractPlaylistId, validateYouTubeUrl, isPlaylistUrl } from './utils/youtubeUtils';
import { getVideoTitle, fetchPlaylistItems } from './services/youtubeService';
import { getPlaylists, createPlaylist, addVideoToPlaylist } from './services/apiService';
import type { PlaylistItem } from './types/youtube';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { loadVideo } = useYouTubePlayer();
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistItem[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [playlistId, setPlaylistId] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializePlaylist = async () => {
      try {
        const playlists = await getPlaylists();
        if (playlists.length === 0) {
          // Create a default playlist if none exists
          const newPlaylist = await createPlaylist('My Playlist');
          setPlaylistId(newPlaylist._id);
          setCurrentPlaylist(newPlaylist.videos);
        } else {
          // Use the first playlist
          setPlaylistId(playlists[0]._id);
          setCurrentPlaylist(playlists[0].videos);
        }
      } catch (error) {
        setError('Failed to initialize playlist');
        console.error('Initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializePlaylist();
  }, []);

  const handleAddToPlaylist = async () => {
    setError(undefined);
    if (!validateYouTubeUrl(videoUrl)) {
      setError('Invalid YouTube URL');
      return;
    }

    setIsLoading(true);
    try {
      if (isPlaylistUrl(videoUrl)) {
        const playlistIdFromUrl = extractPlaylistId(videoUrl);
        if (!playlistIdFromUrl) {
          throw new Error('Invalid playlist URL');
        }

        const playlistItems = await fetchPlaylistItems(playlistIdFromUrl);
        // Filter out any videos that are already in the playlist
        const newItems = playlistItems.filter(
          item => !currentPlaylist.some(existing => existing.videoId === item.videoId)
        );

        if (newItems.length === 0) {
          setError('All videos from this playlist are already in your playlist');
          return;
        }

        // Add each video to the playlist
        for (const item of newItems) {
          const updatedPlaylist = await addVideoToPlaylist(playlistId, item);
          setCurrentPlaylist(updatedPlaylist.videos);
        }

        setVideoUrl('');

        if (currentPlaylist.length === 0 && newItems.length > 0) {
          loadVideo(newItems[0].videoId);
          setCurrentVideoIndex(0);
        }
      } else {
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
          throw new Error('Could not extract video ID from URL');
        }

        if (currentPlaylist.some(item => item.videoId === videoId)) {
          setError('This video is already in the playlist');
          return;
        }

        const title = await getVideoTitle(videoId);
        const newItem: PlaylistItem = {
          videoId,
          title,
        };
        
        const updatedPlaylist = await addVideoToPlaylist(playlistId, newItem);
        setCurrentPlaylist(updatedPlaylist.videos);
        setVideoUrl('');
        
        if (currentPlaylist.length === 0) {
          loadVideo(newItem.videoId);
          setCurrentVideoIndex(0);
        }
      }
    } catch (error) {
      setError('Failed to add video to playlist. Please try again.');
      console.error('Error adding to playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSelect = (index: number) => {
    if (index >= 0 && index < currentPlaylist.length) {
      loadVideo(currentPlaylist[index].videoId);
      setCurrentVideoIndex(index);
    }
  };

  if (isInitializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <PlaylistPlay sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Priority Playlist
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 3 }}>
              <VideoPlayer />
              <PlaylistManager
                videoUrl={videoUrl}
                onVideoUrlChange={setVideoUrl}
                onAddToPlaylist={handleAddToPlaylist}
                error={error}
                isLoading={isLoading}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <PlaylistView
                playlist={currentPlaylist}
                currentVideoIndex={currentVideoIndex}
                onVideoSelect={handleVideoSelect}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
