import type { YouTubeVideoResponse, YouTubePlaylistResponse } from '../types/youtubeApi';
import { isYouTubeErrorResponse } from '../types/youtubeApi';
import type { PlaylistItem } from '../types/youtube';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchVideoDetails = async (videoId: string): Promise<YouTubeVideoResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/videos?part=snippet&id=${videoId}&key=${API_KEY}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch video details');
  }
  
  const data = await response.json();
  if (!data.items?.length) {
    throw new Error('Video not found or is not accessible');
  }
  
  return data;
};

export const fetchPlaylistItems = async (playlistId: string): Promise<PlaylistItem[]> => {
  const items: PlaylistItem[] = [];
  let nextPageToken: string | undefined = undefined;

  try {
    do {
      const pageUrl = `${API_BASE_URL}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}&key=${API_KEY}`;
      const response = await fetch(pageUrl);
      const data = await response.json();

      if (!response.ok) {
        // Handle specific YouTube API errors
        if (isYouTubeErrorResponse(data)) {
          if (data.error.code === 404) {
            throw new Error('Playlist not found. Make sure the playlist exists and is public.');
          } else if (data.error.code === 403) {
            throw new Error('Unable to access playlist. Make sure the playlist is public.');
          } else {
            throw new Error(data.error.message || 'Failed to fetch playlist items');
          }
        }
        throw new Error('Failed to fetch playlist items');
      }

      // Type assertion since we know it's a successful response
      const playlistData = data as YouTubePlaylistResponse;

      // Verify the response has the expected structure
      if (!Array.isArray(playlistData.items)) {
        throw new Error('Invalid response format from YouTube API');
      }
      
      // Filter out deleted, private, or invalid videos
      const validItems = playlistData.items.filter((item) => 
        item.snippet && 
        item.snippet.title !== 'Private video' && 
        item.snippet.title !== 'Deleted video' &&
        item.snippet.resourceId?.videoId
      );

      items.push(...validItems.map((item) => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
      })));

      nextPageToken = playlistData.nextPageToken;
    } while (nextPageToken);

    if (items.length === 0) {
      throw new Error('No accessible videos found in this playlist. Make sure the playlist is public and contains valid videos.');
    }

    return items;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to fetch playlist. Please check if the playlist is public and try again.');
    }
  }
};

export const getVideoTitle = async (videoId: string): Promise<string> => {
  try {
    const data = await fetchVideoDetails(videoId);
    const title = data.items[0]?.snippet.title;
    if (!title) {
      throw new Error('Video title not found');
    }
    return title;
  } catch (error) {
    console.error('Error fetching video title:', error);
    throw error;
  }
};