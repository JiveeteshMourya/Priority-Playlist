export const extractPlaylistId = (url: string): string | null => {
  // Handle traditional playlist URLs and watch URLs with playlist parameter
  const regExp = /(?:list=)([^&#]+)/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const validateYouTubeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'www.youtube.com' || 
      urlObj.hostname === 'youtube.com'
    ) && extractPlaylistId(url) !== null;
  } catch {
    return false;
  }
};

// We don't need this anymore since we only accept playlists
export const extractVideoId = (url: string): string | null => {
  return null;
};

export const isPlaylistUrl = (url: string): boolean => {
  return validateYouTubeUrl(url);
};