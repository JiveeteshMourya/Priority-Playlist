import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import type { PlaylistItem } from '../types/youtube';

interface CurrentPlaylistProps {
  playlist: PlaylistItem[];
  currentVideoIndex: number;
  onVideoSelect: (index: number) => void;
}

export function CurrentPlaylist({ 
  playlist, 
  currentVideoIndex, 
  onVideoSelect,
}: CurrentPlaylistProps) {
  if (playlist.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 2,
          color: 'text.secondary',
          p: 3,
          textAlign: 'center'
        }}
      >
        <Typography>
          This playlist is empty. Import a YouTube playlist to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <List 
      sx={{ 
        width: '100%', 
        p: 0,
        '& .MuiListItem-root': {
          px: 0,
          mb: 1
        }
      }}
    >
      {playlist.map((item, index) => (
        <ListItem 
          key={item.videoId} 
          disablePadding
        >
          <ListItemButton
            selected={index === currentVideoIndex}
            onClick={() => onVideoSelect(index)}
            sx={{
              borderRadius: 1,
              transition: 'all 0.2s',
              '&.Mui-selected': {
                bgcolor: 'rgba(33, 150, 243, 0.15)',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.25)',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {index === currentVideoIndex ? (
                <PlayArrow sx={{ color: 'primary.main' }} />
              ) : (
                <Typography 
                  sx={{ 
                    color: 'text.secondary',
                    width: 24,
                    textAlign: 'center'
                  }}
                >
                  {index + 1}
                </Typography>
              )}
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              sx={{
                '& .MuiListItemText-primary': {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.2,
                  fontSize: '0.9rem',
                  color: index === currentVideoIndex ? 'primary.main' : 'inherit'
                }
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}