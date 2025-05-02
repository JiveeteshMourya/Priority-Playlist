import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { Add, YouTube } from '@mui/icons-material';

interface PlaylistManagerProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  onAddToPlaylist: () => void;
  error?: string;
  isLoading: boolean;
}

export function PlaylistManager({
  videoUrl,
  onVideoUrlChange,
  onAddToPlaylist,
  error,
  isLoading
}: PlaylistManagerProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'primary.main',
        fontWeight: 600 
      }}>
        <YouTube />
        Import YouTube Playlist
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Paste YouTube playlist URL"
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          error={!!error}
          disabled={isLoading}
          helperText="Enter a YouTube playlist URL to import"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }
            }
          }}
        />
        <Button
          variant="contained"
          onClick={onAddToPlaylist}
          disabled={!videoUrl || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <Add />}
          sx={{
            minWidth: { xs: '100%', sm: '150px' },
            height: '56px',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {isLoading ? 'Importing...' : 'Import'}
        </Button>
      </Box>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          {error}
        </Alert>
      )}

      <Alert 
        severity="info"
        sx={{ 
          borderRadius: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        Enter a YouTube playlist URL and click Import to create a new playlist with all its videos. The URL should look like: https://www.youtube.com/playlist?list=PLAYLIST_ID
      </Alert>
    </Box>
  );
}