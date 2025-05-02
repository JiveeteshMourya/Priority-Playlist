import type { PlaylistItem } from '../types/youtube';

const API_BASE_URL = 'http://localhost:5000/api';

interface Playlist {
  _id: string;
  name: string;
  videos: PlaylistItem[];
}

interface PlaylistResponse {
  playlists: Playlist[];
  currentPage: number;
  totalPages: number;
  totalPlaylists: number;
}

export const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await fetch(`${API_BASE_URL}/playlists`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch playlists');
  }
  const data: PlaylistResponse = await response.json();
  return data.playlists;
};

export const createPlaylist = async (name: string): Promise<Playlist> => {
  const response = await fetch(`${API_BASE_URL}/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, videos: [] })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create playlist');
  }
  
  return response.json();
};

export const deletePlaylist = async (id: string): Promise<{ success: boolean; message: string }> => {
  console.log('Sending delete request for playlist:', id);
  const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  console.log('Delete response:', data);
  
  if (!response.ok) {
    console.error('Delete playlist error:', data);
    throw new Error(data.message || 'Failed to delete playlist');
  }

  return data;
};

export const importPlaylist = async (name: string, videos: PlaylistItem[]): Promise<Playlist> => {
  const response = await fetch(`${API_BASE_URL}/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      videos: videos.map(video => ({
        videoId: video.videoId,
        title: video.title,
        url: video.url || `https://www.youtube.com/watch?v=${video.videoId}`
      }))
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to import playlist');
  }
  
  return response.json();
};