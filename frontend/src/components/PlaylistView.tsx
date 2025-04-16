import { Paper, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import type { PlaylistItem } from '../types/youtube';

interface PlaylistViewProps {
  playlist: PlaylistItem[];
  currentVideoIndex: number;
  onVideoSelect: (index: number) => void;
}

export const PlaylistView = ({
  playlist,
  currentVideoIndex,
  onVideoSelect,
}: PlaylistViewProps) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Current Playlist
      </Typography>
      <List>
        {playlist.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No videos in playlist
          </Typography>
        ) : (
          playlist.map((item, index) => (
            <ListItem key={item.videoId} disablePadding>
              <ListItemButton
                onClick={() => onVideoSelect(index)}
                selected={index === currentVideoIndex}
              >
                <ListItemText
                  primary={item.title}
                  secondary={`Video ${index + 1}`}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};