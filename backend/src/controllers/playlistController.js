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

// Add video to playlist
export const addVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoId, title, url, priority = 0 } = req.body;

    if (!videoId || !title || !url) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        details: {
          videoId: !videoId ? 'Video ID is required' : null,
          title: !title ? 'Title is required' : null,
          url: !url ? 'URL is required' : null
        }
      });
    }

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found', playlistId: id });
    }

    // Check if video already exists in playlist
    if (playlist.videos.some(v => v.videoId === videoId)) {
      return res.status(400).json({ 
        message: 'Video already exists in playlist',
        videoId,
        playlistId: id
      });
    }

    playlist.videos.push({ videoId, title, url, priority });
    const updatedPlaylist = await playlist.save();
    res.json(updatedPlaylist);
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(400).json({ 
      message: 'Failed to add video to playlist',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update video priority
export const updatePriority = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    const { priority } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const video = playlist.videos.find(v => v.videoId === videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found in playlist' });
    }

    video.priority = priority;
    const updatedPlaylist = await playlist.save();
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete video from playlist
export const removeVideo = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.videos = playlist.videos.filter(v => v.videoId !== videoId);
    const updatedPlaylist = await playlist.save();
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlaylist = await Playlist.findByIdAndDelete(id);
    if (!deletedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};