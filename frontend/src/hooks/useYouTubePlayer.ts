import { useState, useEffect } from 'react';
import type { YouTubePlayer, YouTubeEvent } from '../types/youtube';

export const useYouTubePlayer = () => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  useEffect(() => {
    let isMounted = true;
    let ytPlayer: YouTubePlayer | null = null;

    // Load YouTube IFrame API
    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT) {
          resolve();
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
      });
    };

    const initializePlayer = async () => {
      await loadYouTubeAPI();

      if (!isMounted) return;

      // Clear existing player element if it exists
      const existingPlayer = document.getElementById('youtube-player');
      if (existingPlayer) {
        existingPlayer.innerHTML = '';
      }

      ytPlayer = new window.YT.Player('youtube-player', {
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
            if (isMounted) {
              setPlayer(event.target);
              console.log('YouTube player ready');
            }
          },
          onError: (event: YouTubeEvent) => {
            console.error('YouTube Player Error:', event);
          },
        },
      });
    };

    initializePlayer().catch(error => {
      console.error('Error initializing YouTube player:', error);
    });

    return () => {
      isMounted = false;
      if (ytPlayer) {
        try {
          ytPlayer.destroy();
        } catch (error) {
          console.error('Error destroying YouTube player:', error);
        }
      }
    };
  }, []);

  const loadVideo = (videoId: string) => {
    if (player) {
      try {
        player.loadVideoById(videoId);
        console.log('Loading video:', videoId);
      } catch (error) {
        console.error('Error loading video:', error);
      }
    } else {
      console.warn('YouTube player not ready yet');
    }
  };

  return { player, loadVideo };
};