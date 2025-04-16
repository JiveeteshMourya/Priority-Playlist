import { Box, TextField, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { isPlaylistUrl } from '../utils/youtubeUtils';

interface PlaylistManagerProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  onAddToPlaylist: () => Promise<void>;
  error?: string;
  isLoading?: boolean;
}

export const PlaylistManager = ({
  videoUrl,
  onVideoUrlChange,
  onAddToPlaylist,
  error,
  isLoading = false,
}: PlaylistManagerProps) => {
  const isPlaylist = isPlaylistUrl(videoUrl);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 1 }}
            onClose={() => onVideoUrlChange('')}
          >
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            label="YouTube Video or Playlist URL"
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder="Paste YouTube URL here"
            error={!!error}
            disabled={isLoading}
            helperText={error || 'Enter a valid YouTube video or playlist URL'}
          />
          <Button
            variant="contained"
            onClick={onAddToPlaylist}
            disabled={isLoading || !videoUrl.trim()}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isPlaylist ? (
              'Import Playlist'
            ) : (
              'Add to Playlist'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};