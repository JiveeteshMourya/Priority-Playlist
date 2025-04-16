import { useState, useEffect } from 'react';
import type { YouTubePlayer, YouTubeEvent } from '../types/youtube';

export const useYouTubePlayer = () => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player('youtube-player', {
        height: '500',
        width: '100%',
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: YouTubeEvent) => {
            setPlayer(event.target);
          },
        },
      });
    };
  }, []);

  const loadVideo = (videoId: string) => {
    if (player) {
      player.loadVideoById(videoId);
    }
  };

  return { player, loadVideo };
};