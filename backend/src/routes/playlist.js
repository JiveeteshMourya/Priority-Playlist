import express from 'express';
import {
  getPlaylists,
  createPlaylist,
  deletePlaylist
} from '../controllers/playlistController.js';

const router = express.Router();

// Get all playlists
router.get('/', getPlaylists);

// Create a new playlist
router.post('/', createPlaylist);

// Delete a playlist
router.delete('/:id', deletePlaylist);

export default router;