import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: [true, 'Video ID is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true
  },
  priority: {
    type: Number,
    default: 0,
    index: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Playlist name is required'],
    trim: true,
    minlength: [2, 'Playlist name must be at least 2 characters long'],
    maxlength: [100, 'Playlist name cannot exceed 100 characters']
  },
  videos: [videoSchema],
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true, // This automatically adds createdAt and updatedAt fields
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for faster queries
playlistSchema.index({ createdAt: -1 });
playlistSchema.index({ 'videos.videoId': 1 });

// Virtual for video count
playlistSchema.virtual('videoCount').get(function() {
  return this.videos.length;
});

// Method to check if video exists
playlistSchema.methods.hasVideo = function(videoId) {
  return this.videos.some(video => video.videoId === videoId);
};

// Static method to find playlists containing a specific video
playlistSchema.statics.findByVideoId = function(videoId) {
  return this.find({ 'videos.videoId': videoId });
};

const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist;