import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface HLSVideoPlayerProps {
  src: string;
}

export const HLSVideoPlayer = ({ src }: HLSVideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  
  // ✅ CORRECCIÓN: Usar ReturnType para obtener el tipo exacto del jugador de video.js
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered', 'vjs-theme-city');
      videoRef.current.appendChild(videoElement);

      // Asignar directamente a playerRef.current
      playerRef.current = videojs(videoElement, {
        autoplay: true,
        muted: true, // Necesario para autoplay en navegadores modernos
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: src,
          type: 'application/x-mpegURL' // Tipo MIME para HLS (.m3u8)
        }]
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
};