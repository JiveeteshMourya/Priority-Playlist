export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const extractPlaylistId = (url: string): string | null => {
  const regExp = /[&?]list=([^&]+)/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const validateYouTubeUrl = (url: string): boolean => {
  const videoId = extractVideoId(url);
  const playlistId = extractPlaylistId(url);
  return videoId !== null || playlistId !== null;
};

export const isPlaylistUrl = (url: string): boolean => {
  return extractPlaylistId(url) !== null;
};