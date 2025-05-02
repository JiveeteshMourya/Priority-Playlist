export interface YouTubeVideoSnippet {
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
}

export interface YouTubeVideoResponse {
  items: Array<{
    id: string;
    snippet: YouTubeVideoSnippet;
  }>;
}

export interface YouTubePlaylistItemResourceId {
  kind: string;
  videoId: string;
}

export interface YouTubePlaylistItemSnippet {
  title: string;
  description: string;
  resourceId: YouTubePlaylistItemResourceId;
}

export interface YouTubePlaylistItem {
  snippet: YouTubePlaylistItemSnippet;
}

export interface YouTubePlaylistResponse {
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
}

export interface YouTubeErrorResponse {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}

// Update type guard with proper type checking
export function isYouTubeErrorResponse(data: unknown): data is YouTubeErrorResponse {
  if (!data || typeof data !== 'object') return false;
  
  const candidate = data as Partial<YouTubeErrorResponse>;
  return Boolean(
    candidate.error &&
    typeof candidate.error.code === 'number' &&
    typeof candidate.error.message === 'string' &&
    Array.isArray(candidate.error.errors)
  );
}