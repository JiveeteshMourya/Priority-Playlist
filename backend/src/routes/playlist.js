import express from 'express';
import {
  getPlaylists,
  createPlaylist,
  addVideo,
  updatePriority,
  removeVideo,
  deletePlaylist
} from '../controllers/playlistController.js';

const router = express.Router();

// Get all playlists
router.get('/', getPlaylists);

// Create a new playlist
router.post('/', createPlaylist);

// Add a video to a playlist
router.post('/:id/videos', addVideo);

// Update video priority
router.patch('/:playlistId/videos/:videoId/priority', updatePriority);

// Remove a video from playlist
router.delete('/:playlistId/videos/:videoId', removeVideo);

// Delete a playlist
router.delete('/:id', deletePlaylist);

export default router;