import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

interface Top3MusicPlayerProps {
  isTop3User?: boolean;
  language?: 'tr' | 'en';
}

const YOUTUBE_VIDEO_ID = 'MOlUTsZ2IWg';

export const Top3MusicPlayer: React.FC<Top3MusicPlayerProps> = ({
  isTop3User = false,
  language = 'tr',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Auto-play when Top 3 user enters
  useEffect(() => {
    if (isTop3User) {
      setIsPlaying(true);
    }
  }, [isTop3User]);

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

  useEffect(() => {
    if (isPlaying) {
      sendCommand('playVideo');
      if (isMuted) {
        sendCommand('mute');
      } else {
        sendCommand('unMute');
        sendCommand('setVolume', [60]);
      }
    } else {
      sendCommand('pauseVideo');
    }
  }, [isPlaying, isMuted]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      sendCommand('pauseVideo');
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        sendCommand('mute');
      } else {
        sendCommand('unMute');
        sendCommand('setVolume', [60]);
      }
      return next;
    });
  };

  return (
    <div className="w-full flex items-center justify-center mb-2">
      {/* Hidden YouTube IFrame */}
      <iframe
        ref={iframeRef}
        id="top3-yt-iframe"
        title="Top 3 Theme Music"
        className="hidden w-0 h-0 pointer-events-none opacity-0 absolute -z-50"
        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=${
          isTop3User ? '1' : '0'
        }&loop=1&playlist=${YOUTUBE_VIDEO_ID}&playsinline=1&controls=0&rel=0`}
        allow="autoplay; encrypted-media"
      />

      {/* Styled Floating Music Badge */}
      <div
        onClick={togglePlay}
        className={`group relative flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 select-none border shadow-xs ${
          isPlaying
            ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-amber-300/80 text-amber-900 ring-2 ring-amber-300/40 shadow-amber-500/10'
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800'
        }`}
        title={language === 'tr' ? 'İlk 3 Şampiyon Müziği (Kır Çiçeği)' : 'Top 3 Champion Theme (Wildflower)'}
      >
        {/* Animated Equalizer or Music Icon */}
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-[#ff7a00]">
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-[#ff7a00] rounded-full animate-pulse h-3" />
              <span className="w-0.5 bg-[#ff7a00] rounded-full animate-bounce h-2" />
              <span className="w-0.5 bg-[#ff7a00] rounded-full animate-pulse h-3" />
            </div>
          ) : (
            <Music className="w-3 h-3 text-slate-400 group-hover:text-[#ff7a00] transition-colors" />
          )}
        </div>

        {/* Track Title */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <span className="truncate max-w-[130px] sm:max-w-[180px]">
            🎵 {language === 'tr' ? 'Kır Çiçeği' : 'Wildflower'}
          </span>
          {isTop3User && (
            <span className="text-[9.5px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              TOP 3
            </span>
          )}
        </div>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="p-1 rounded-full text-slate-500 hover:text-[#ff7a00] transition-colors"
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
            className="p-1 -ml-1 rounded-full text-slate-500 hover:text-amber-600 transition-colors"
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
