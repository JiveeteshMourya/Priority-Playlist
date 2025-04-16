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
  if (!response.ok) throw new Error('Failed to fetch playlists');
  const data: PlaylistResponse = await response.json();
  return data.playlists;
};

export const createPlaylist = async (name: string): Promise<Playlist> => {
  const response = await fetch(`${API_BASE_URL}/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, videos: [] })
  });
  if (!response.ok) throw new Error('Failed to create playlist');
  return response.json();
};

export const addVideoToPlaylist = async (playlistId: string, video: PlaylistItem): Promise<Playlist> => {
  const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      videoId: video.videoId,
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.videoId}`,
      priority: 0 // Adding priority field
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to add video to playlist' }));
    throw new Error(errorData.message || 'Failed to add video to playlist');
  }
  return response.json();
};