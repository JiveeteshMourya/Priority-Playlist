import { Box, Typography } from '@mui/material';
import { MovieCreation } from '@mui/icons-material';

interface VideoPlayerProps {
  hasVideo?: boolean;
  currentPlaylistName?: string;
}

export function VideoPlayer({ hasVideo = false, currentPlaylistName }: VideoPlayerProps) {
  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      maxWidth: '1600px', // YouTube's max width
      margin: '0 auto'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 1
      }}>
        <Typography variant="h6" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'primary.main',
          fontWeight: 600 
        }}>
          <MovieCreation />
          Now Playing
        </Typography>
        {currentPlaylistName && (
          <Typography variant="subtitle1" sx={{ 
            color: 'text.secondary',
            fontWeight: 500
          }}>
            Playlist: {currentPlaylistName}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: { 
            xs: '56.25%', // 16:9 for mobile
            md: 'min(calc((100vh - 169px) * 0.8), 56.25%)' // YouTube-like responsive height
          },
          bgcolor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 1,
          overflow: 'hidden'
        }}
      >
        <div
          id="youtube-player"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        
        {/* Placeholder for when no video is loaded */}
        {!hasVideo && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              color: 'text.secondary',
              p: 3,
              textAlign: 'center'
            }}
            id="player-placeholder"
          >
            <MovieCreation sx={{ fontSize: 48, opacity: 0.5 }} />
            <Typography>
              Add a video to your playlist to start watching
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}