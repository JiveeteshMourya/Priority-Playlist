import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline, AppBar, Toolbar, Typography, CircularProgress, Paper, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { PlaylistPlay, Brightness4, Brightness7 } from '@mui/icons-material';
import { VideoPlayer } from './components/VideoPlayer.tsx';
import { PlaylistView } from './components/PlaylistView.tsx';
import { CurrentPlaylist } from './components/CurrentPlaylist.tsx';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useThemeMode } from './hooks/useThemeMode';
import { extractPlaylistId, validateYouTubeUrl } from './utils/youtubeUtils';
import { fetchPlaylistItems } from './services/youtubeService';
import { getPlaylists, createPlaylist, deletePlaylist as deletePlaylistApi, importPlaylist } from './services/apiService';
import type { PlaylistItem } from './types/youtube';

const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#7B9ED9' : '#90CAF9', // Pastel blue
      light: mode === 'light' ? '#A9C2E6' : '#B3E5FC',
      dark: mode === 'light' ? '#5D7FB3' : '#64B5F6',
    },
    secondary: {
      main: mode === 'light' ? '#F0A6CA' : '#F48FB1', // Pastel pink
      light: mode === 'light' ? '#F7C4DB' : '#F8BBD0',
      dark: mode === 'light' ? '#E686B0' : '#F06292',
    },
    background: {
      default: mode === 'light' ? '#F8F9FA' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
    text: {
      primary: mode === 'light' ? '#2C3E50' : '#E0E0E0',
      secondary: mode === 'light' ? '#5D7A98' : '#9E9E9E',
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: mode === 'light' ? 1 : 4,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

function App() {
  const { mode, toggleMode } = useThemeMode();
  const theme = getTheme(mode);
  const { loadVideo } = useYouTubePlayer();
  const [playlists, setPlaylists] = useState<Array<{ _id: string; name: string; videos: PlaylistItem[] }>>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistItem[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [playlistId, setPlaylistId] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const fetchedPlaylists = await getPlaylists();
      setPlaylists(fetchedPlaylists);
      
      if (fetchedPlaylists.length > 0) {
        setPlaylistId(fetchedPlaylists[0]._id);
        setCurrentPlaylist(fetchedPlaylists[0].videos);
      }
      setIsInitializing(false);
    } catch (err) {
      setError('Failed to load playlists');
      console.error('Loading playlists error:', err);
      setIsInitializing(false);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      setError(undefined);
      setIsLoading(true);
      const name = `New Playlist ${playlists.length + 1}`;
      const newPlaylist = await createPlaylist(name);
      setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
      setPlaylistId(newPlaylist._id);
      setCurrentPlaylist(newPlaylist.videos);
      setCurrentVideoIndex(-1);
    } catch (err) {
      setError('Failed to create playlist');
      console.error('Error creating playlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    try {
      console.log('Starting playlist deletion process for id:', id);
      setError(undefined);
      setIsLoading(true);
      
      const result = await deletePlaylistApi(id);
      console.log('Delete API response:', result);
      
      // Update playlists state
      console.log('Updating playlists state...');
      const updatedPlaylists = playlists.filter(p => p._id !== id);
      setPlaylists(updatedPlaylists);
      
      // Handle current playlist state
      if (id === playlistId) {
        console.log('Deleting current playlist, switching to next available...');
        if (updatedPlaylists.length > 0) {
          // Switch to the first available playlist
          const nextPlaylist = updatedPlaylists[0];
          console.log('Switching to playlist:', nextPlaylist.name);
          setPlaylistId(nextPlaylist._id);
          setCurrentPlaylist(nextPlaylist.videos);
          setCurrentVideoIndex(nextPlaylist.videos.length > 0 ? 0 : -1);
          if (nextPlaylist.videos.length > 0) {
            loadVideo(nextPlaylist.videos[0].videoId);
          }
        } else {
          // No playlists left
          console.log('No playlists remaining, resetting state');
          setPlaylistId('');
          setCurrentPlaylist([]);
          setCurrentVideoIndex(-1);
        }
      }

      // Show success message
      setError(result.message);
      setTimeout(() => setError(undefined), 3000); // Clear message after 3 seconds
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete playlist';
      console.error('Error in handleDeletePlaylist:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchPlaylist = (id: string) => {
    const playlist = playlists.find(p => p._id === id);
    if (playlist) {
      setPlaylistId(id);
      setCurrentPlaylist(playlist.videos);
      if (playlist.videos.length > 0) {
        setCurrentVideoIndex(0);
        loadVideo(playlist.videos[0].videoId);
      } else {
        setCurrentVideoIndex(-1);
      }
    }
  };

  const handleAddToPlaylist = async () => {
    setError(undefined);

    if (!validateYouTubeUrl(videoUrl)) {
      setError('Invalid YouTube playlist URL');
      return;
    }

    setIsLoading(true);
    try {
      const playlistIdFromUrl = extractPlaylistId(videoUrl);
      if (!playlistIdFromUrl) {
        throw new Error('Invalid playlist URL');
      }

      const playlistItems = await fetchPlaylistItems(playlistIdFromUrl);
      if (playlistItems.length === 0) {
        throw new Error('No valid videos found in the playlist');
      }

      // Create a new playlist with the imported videos
      const importedPlaylist = await importPlaylist(
        `YouTube Playlist ${playlists.length + 1}`,
        playlistItems
      );

      // Update UI state
      setPlaylists([...playlists, importedPlaylist]);
      setPlaylistId(importedPlaylist._id);
      setCurrentPlaylist(importedPlaylist.videos);
      setVideoUrl('');
      
      // Start playing the first video
      if (importedPlaylist.videos.length > 0) {
        loadVideo(importedPlaylist.videos[0].videoId);
        setCurrentVideoIndex(0);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import playlist. Please try again.';
      setError(errorMessage);
      console.error('Error importing playlist:', err);
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: 'background.default'
        }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              sx={{ mr: 2 }}
            >
              <PlaylistPlay />
            </IconButton>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600,
                letterSpacing: '0.5px',
                color: 'text.primary'
              }}
            >
              Priority Playlist
            </Typography>
            <IconButton onClick={toggleMode} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', flex: 1 }}>
          {/* Left Sidebar for playlist management */}
          <Box
            component="nav"
            sx={{
              width: { md: isSidebarOpen ? 320 : 0 },
              flexShrink: 0,
              display: { xs: isSidebarOpen ? 'block' : 'none', md: 'block' },
              transition: 'width 0.2s ease-in-out',
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              overflowY: 'auto',
              pt: '64px', // AppBar height
              zIndex: theme => theme.zIndex.drawer
            }}
          >
            <Box sx={{ p: 2 }}>
              <PlaylistView
                playlist={currentPlaylist}
                playlists={playlists}
                currentVideoIndex={currentVideoIndex}
                onVideoSelect={handleVideoSelect}
                onCreatePlaylist={handleCreatePlaylist}
                onDeletePlaylist={handleDeletePlaylist}
                onSwitchPlaylist={handleSwitchPlaylist}
                currentPlaylistId={playlistId}
                videoUrl={videoUrl}
                onVideoUrlChange={setVideoUrl}
                onAddToPlaylist={handleAddToPlaylist}
                error={error}
                isLoading={isLoading}
              />
            </Box>
          </Box>

          {/* Main content area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { md: `calc(100% - ${isSidebarOpen ? 320 : 0}px)` },
              ml: { md: `${isSidebarOpen ? 320 : 0}px` },
              mt: '64px', // AppBar height
              transition: theme => theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              display: 'flex',
              gap: 2,
            }}
          >
            {/* Video player area */}
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                <VideoPlayer 
                  hasVideo={currentPlaylist.length > 0 && currentVideoIndex >= 0} 
                  currentPlaylistName={playlists.find(p => p._id === playlistId)?.name}
                />
              </Paper>
            </Box>

            {/* Right sidebar for current playlist */}
            <Paper 
              sx={{ 
                width: { xs: '100%', sm: 400 },
                borderRadius: 2,
                bgcolor: 'background.paper',
                display: { xs: 'none', sm: 'block' },
                height: 'calc(100vh - 96px)', // Subtracting AppBar height + padding
                position: 'sticky',
                top: '80px', // AppBar height + small gap
                overflowY: 'auto'
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 2
                }}>
                  <PlaylistPlay />
                  Current Playlist
                </Typography>
                <CurrentPlaylist
                  playlist={currentPlaylist}
                  currentVideoIndex={currentVideoIndex}
                  onVideoSelect={handleVideoSelect}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
