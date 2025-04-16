export interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(videoId: string): void;
  cueVideoById(videoId: string): void;
}

export interface YouTubeEvent {
  target: YouTubePlayer;
}

export interface YouTubePlayerVars {
  autoplay?: 0 | 1;
  controls?: 0 | 1;
  modestbranding?: 0 | 1;
  rel?: 0 | 1;
}

export interface PlaylistItem {
  videoId: string;
  title: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (
        elementId: string,
        config: {
          height: string | number;
          width: string | number;
          playerVars?: {
            autoplay?: 0 | 1;
            controls?: 0 | 1;
            modestbranding?: 0 | 1;
            rel?: 0 | 1;
          };
          events?: {
            onReady?: (event: YouTubeEvent) => void;
            onStateChange?: (event: YouTubeEvent) => void;
          };
        }
      ) => void;
    };
  }
}