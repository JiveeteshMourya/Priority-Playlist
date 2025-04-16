import { useState, useEffect } from 'react';
import type { PlaylistItem } from '../types/youtube';

const STORAGE_KEY = 'priority-playlist';

export const usePlaylistStorage = () => {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlist));
  }, [playlist]);

  return [playlist, setPlaylist] as const;
};