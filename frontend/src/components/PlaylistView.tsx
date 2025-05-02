import { Box, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, IconButton, Card, CardContent, Stack } from '@mui/material';
import { PlayArrow, QueueMusic, Add, DeleteForever } from '@mui/icons-material';
import type { PlaylistItem } from '../types/youtube';
import { useState } from 'react';

interface PlaylistViewProps {
  playlist: PlaylistItem[];
  playlists: Array<{ _id: string; name: string; videos: PlaylistItem[] }>;
  currentVideoIndex: number;
  onVideoSelect: (index: number) => void;
  onCreatePlaylist: () => void;
  onDeletePlaylist: (id: string) => void;
  onSwitchPlaylist: (id: string) => void;
  currentPlaylistId: string;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  onAddToPlaylist: () => void;
  error?: string;
  isLoading: boolean;
}

export function PlaylistView({ 
  playlist, 
  playlists,
  currentVideoIndex, 
  onVideoSelect,
  onDeletePlaylist,
  onSwitchPlaylist,
  currentPlaylistId,
  videoUrl,
  onVideoUrlChange,
  onAddToPlaylist,
  error,
  isLoading
}: PlaylistViewProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleDeleteClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!id) return;
    setPlaylistToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (!playlistToDelete) return;
    onDeletePlaylist(playlistToDelete);
    setShowDeleteConfirm(false);
    setPlaylistToDelete(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
      {/* Playlists Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2
      }}>
        <Typography variant="h6" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'primary.main',
          fontWeight: 600,
        }}>
          <QueueMusic />
          Your Playlists
        </Typography>
        <IconButton 
          onClick={() => setShowImportDialog(true)}
          color="primary"
          sx={{ 
            border: '2px dashed',
            borderRadius: 2,
            p: 1
          }}
        >
          <Add />
        </IconButton>
      </Box>

      {/* Playlists Grid */}
      <Stack spacing={2} component="div">
        {playlists.map(playlist => (
          <Card 
            component="div"
            key={`playlist-${playlist._id}`}
            sx={{
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                '& .delete-button': {
                  opacity: 1
                }
              },
              border: playlist._id === currentPlaylistId ? 2 : 0,
              borderColor: 'primary.main'
            }}
            onClick={() => onSwitchPlaylist(playlist._id)}
          >
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              pr: 6 // Make space for delete button
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {playlist.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {playlist.videos.length} videos
                </Typography>
              </Box>
              {playlist._id === currentPlaylistId && (
                <PlayArrow sx={{ color: 'primary.main' }} />
              )}
              <IconButton
                className="delete-button"
                color="error"
                size="small"
                onClick={(e) => handleDeleteClick(playlist._id, e)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }}
              >
                <DeleteForever />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Current Videos List */}
      <Box sx={{ flex: 1, overflow: 'auto', mt: 2 }}>
        <Typography variant="h6" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'primary.main',
          fontWeight: 600,
          mb: 2
        }}>
          Current Playlist
        </Typography>

        {playlist.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              gap: 2,
              color: 'text.secondary',
              p: 3,
              textAlign: 'center'
            }}
          >
            <QueueMusic sx={{ fontSize: 48, opacity: 0.5 }} />
            <Typography>
              This playlist is empty. Import a YouTube playlist to get started!
            </Typography>
          </Box>
        ) : (
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
        )}
      </Box>

      {/* Import Dialog */}
      <Dialog 
        open={showImportDialog} 
        onClose={() => setShowImportDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Import YouTube Playlist</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Paste YouTube playlist URL"
              value={videoUrl}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              error={!!error}
              disabled={isLoading}
            />
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
            <Alert severity="info">
              Enter a YouTube playlist URL to import all its videos. The URL should look like: https://www.youtube.com/playlist?list=PLAYLIST_ID
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              onAddToPlaylist();
              setShowImportDialog(false);
            }} 
            disabled={!videoUrl || isLoading}
            variant="contained"
          >
            {isLoading ? 'Importing...' : 'Import'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showDeleteConfirm} 
        onClose={() => {
          console.log('Dialog closed');
          setShowDeleteConfirm(false);
          setPlaylistToDelete(null);
        }}
      >
        <DialogTitle>Delete Playlist</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this playlist? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            console.log('Cancel clicked');
            setShowDeleteConfirm(false);
            setPlaylistToDelete(null);
          }}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              console.log('Delete button clicked in dialog');
              handleDeleteConfirm();
            }} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}