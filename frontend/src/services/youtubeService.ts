import type { YouTubeVideoResponse, YouTubePlaylistResponse } from '../types/youtubeApi';
import type { PlaylistItem } from '../types/youtube';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchVideoDetails = async (videoId: string): Promise<YouTubeVideoResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/videos?part=snippet&id=${videoId}&key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch video details');
  }
  
  return response.json();
};

export const fetchPlaylistItems = async (playlistId: string): Promise<PlaylistItem[]> => {
  const response = await fetch(
    `${API_BASE_URL}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch playlist items');
  }

  const data: YouTubePlaylistResponse = await response.json();
  return data.items.map(item => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title
  }));
};

export const getVideoTitle = async (videoId: string): Promise<string> => {
  try {
    const data = await fetchVideoDetails(videoId);
    return data.items[0]?.snippet.title || 'Untitled Video';
  } catch (error) {
    console.error('Error fetching video title:', error);
    return 'Untitled Video';
  }
};