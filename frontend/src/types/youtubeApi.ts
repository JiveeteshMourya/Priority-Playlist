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

export interface YouTubePlaylistItemSnippet {
  title: string;
  description: string;
  resourceId: {
    kind: string;
    videoId: string;
  };
}

export interface YouTubePlaylistResponse {
  items: Array<{
    snippet: YouTubePlaylistItemSnippet;
  }>;
  nextPageToken?: string;
}