import Playlist from '../models/playlist.js';

// Get all playlists with pagination
export const getPlaylists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const playlists = await Playlist.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Playlist.countDocuments();

    res.status(200).json({
      playlists,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPlaylists: total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch playlists',
      error: error.message 
    });
  }
};

// Create a new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name, videos } = req.body;
    const playlist = new Playlist({
      name,
      videos: videos || []
    });
    const savedPlaylist = await playlist.save();
    res.status(201).json(savedPlaylist);
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to create playlist',
      error: error.message 
    });
  }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete playlist with ID:', id);
    
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      console.log('Playlist not found:', id);
      return res.status(404).json({ 
        message: 'Playlist not found',
        success: false 
      });
    }

    console.log('Found playlist:', playlist.name);
    await Playlist.findByIdAndDelete(id);
    console.log('Successfully deleted playlist:', playlist.name);
    
    res.json({ 
      message: `Playlist "${playlist.name}" deleted successfully`,
      success: true 
    });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ 
      message: 'Failed to delete playlist',
      error: error.message,
      success: false
    });
  }
};