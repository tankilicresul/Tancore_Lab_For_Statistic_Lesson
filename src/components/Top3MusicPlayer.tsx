import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

interface Top3MusicPlayerProps {
  isTop3User?: boolean;
  language?: 'tr' | 'en';
}

const YOUTUBE_VIDEO_ID = 'MOlUTsZ2IWg';
const START_SECONDS = 20;

export const Top3MusicPlayer: React.FC<Top3MusicPlayerProps> = ({
  isTop3User = false,
  language = 'tr',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const hasStartedRef = useRef<boolean>(false);

  // Handle postMessage commands to YouTube IFrame
  const sendCommand = (func: string, args: any = '') => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func,
          args: Array.isArray(args) ? args : [args],
        }),
        '*'
      );
    }
  };

  const DEFAULT_VOLUME = 25;

  // Listen for YouTube IFrame state changes (ended = 0)
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.event === 'onStateChange' && data.info === 0) {
          // Video ended: stop playing and mark as played
          setIsPlaying(false);
          setHasPlayedOnce(true);
        }
      } catch {
        // non-youtube message
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  useEffect(() => {
    if (!isTop3User) return;

    if (isPlaying) {
      if (!hasStartedRef.current) {
        sendCommand('seekTo', [START_SECONDS, true]);
        hasStartedRef.current = true;
      }
      sendCommand('playVideo');
      if (isMuted) {
        sendCommand('mute');
      } else {
        sendCommand('unMute');
        sendCommand('setVolume', [DEFAULT_VOLUME]);
      }
    } else {
      sendCommand('pauseVideo');
    }
  }, [isPlaying, isMuted, isTop3User]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      sendCommand('pauseVideo');
    };
  }, []);

  const togglePlay = () => {
    if (!isTop3User) return;
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTop3User) return;
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        sendCommand('mute');
      } else {
        sendCommand('unMute');
        sendCommand('setVolume', [DEFAULT_VOLUME]);
      }
      return next;
    });
  };

  const handleIframeLoad = () => {
    if (!isTop3User) return;
    sendCommand('setVolume', [DEFAULT_VOLUME]);
    sendCommand('seekTo', [START_SECONDS, true]);
  };

  // If user is NOT in the Top 3, do not load iframe and show locked exclusive indicator
  if (!isTop3User) {
    return (
      <div className="w-full flex items-center justify-center mb-2">
        <div
          className="flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-slate-100/90 border border-slate-200/70 text-[10.5px] font-bold text-slate-500 select-none shadow-2xs"
          title={language === 'tr' ? 'Bu özel kutlama müziği yalnızca ilk 3 sıradaki şampiyonlar için açılır' : 'This celebration theme is exclusive to top 3 champions'}
        >
          <span className="text-xs">🔒</span>
          <span>
            {language === 'tr'
              ? 'Şampiyonluk Müziği (İlk 3\'e Özel)'
              : 'Champion Theme (Top 3 Exclusive)'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center mb-2">
      {/* Hidden YouTube IFrame - Non-looping, single play */}
      <iframe
        ref={iframeRef}
        id="top3-yt-iframe"
        title="Top 3 Theme Music"
        onLoad={handleIframeLoad}
        className="hidden w-0 h-0 pointer-events-none opacity-0 absolute -z-50"
        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&start=${START_SECONDS}&autoplay=0&loop=0&playsinline=1&controls=0&rel=0`}
        allow="autoplay; encrypted-media"
      />

      {/* Minimal Floating Music Player (Exclusive for Top 3) */}
      <div
        onClick={togglePlay}
        className="group relative flex items-center gap-2 py-1 px-3 rounded-full bg-amber-50 border border-amber-200/80 cursor-pointer transition-all duration-200 select-none text-slate-700 hover:text-slate-900 shadow-xs"
        title={language === 'tr' ? 'İlk 3 Şampiyon Müziği: Kır Çiçeği (made by solorijin)' : 'Top 3 Champion Theme: Wildflower (made by solorijin)'}
      >
        {/* Animated Equalizer or Music Icon */}
        <div className="flex items-center justify-center w-5 h-5 text-[#ff7a00]">
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-[#ff7a00] rounded-full animate-pulse h-3" />
              <span className="w-0.5 bg-[#ff7a00] rounded-full animate-bounce h-2" />
              <span className="w-0.5 bg-[#ff7a00] rounded-full animate-pulse h-3" />
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ff7a00] transition-colors" />
          )}
        </div>

        {/* Track Title */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <span className="truncate max-w-[190px] sm:max-w-[280px]">
            🎵 {language === 'tr' ? 'Kır Çiçeği' : 'Wildflower'}{' '}
            <span className="font-medium opacity-75 text-[10px] text-slate-500">· made by solorijin</span>
          </span>
          <span className="text-[9.5px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0">
            TOP 3
          </span>
        </div>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="p-1 rounded-full text-slate-500 hover:text-[#ff7a00] transition-colors cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Mute/Unmute Button (Visible when playing) */}
        {isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 -ml-1 rounded-full text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
