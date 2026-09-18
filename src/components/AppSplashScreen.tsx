import React, { useEffect, useState, useRef } from 'react';

export const AppSplashScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const TOTAL_DURATION = 1750; // 1.75s smooth fill
    let animFrameId: number;

    const animateProgress = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const linearProgress = Math.min(elapsed / TOTAL_DURATION, 1);

      // Ease out cubic for natural, snappy deceleration
      const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
      const currentPercent = Math.round(easedProgress * 100);

      setProgress(currentPercent);

      if (linearProgress < 1) {
        animFrameId = requestAnimationFrame(animateProgress);
      } else {
        // Flash at 100%
        setIsFlashing(true);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete?.();
          }, 250);
        }, 300);
      }
    };

    animFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f8fafc] select-none pointer-events-none overflow-hidden transition-opacity duration-250 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Center Brand Container */}
      <div className="flex flex-col items-center justify-center px-4">
        {/* Logo and Typography Row */}
        <div className="flex items-center space-x-3.5 sm:space-x-4">
          {/* Logo Badge with Subtle Energy Pulse */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ff7a00] flex items-center justify-center p-1.5 shadow-xl transition-all duration-300 ${
              isFlashing
                ? 'shadow-[0_0_35px_rgba(255,122,0,0.9)] ring-4 ring-orange-300 scale-105'
                : 'shadow-[#ff7a00]/25'
            }`}
          >
            <div className="w-full h-full rounded-full border-[2.5px] border-white flex items-center justify-center bg-[#ff7a00]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 sm:w-10 sm:h-10 transform -rotate-6"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
          </div>

          {/* Typography */}
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans leading-none">
              TanCoreLab
            </h1>
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-orange-600 uppercase mt-1.5">
              Endüstri Mühendisliği & Analitik
            </span>
          </div>
        </div>

        {/* Filling Progress Cylinder */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center w-full max-w-xs">
          {/* Outer Rounded Track */}
          <div
            className={`w-64 sm:w-72 h-4 sm:h-4.5 bg-slate-100 rounded-full p-0.5 border border-slate-200/90 shadow-inner relative overflow-hidden transition-all duration-300 ${
              isFlashing
                ? 'ring-4 ring-orange-400/50 shadow-[0_0_20px_rgba(255,122,0,0.8)]'
                : ''
            }`}
          >
            {/* Dynamic Filling Orange Bar */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-[#ff7a00] to-[#ff5500] relative overflow-hidden transition-[width] duration-75 ease-out shadow-xs"
              style={{
                width: `${Math.max(progress, 4)}%`,
              }}
            >
              {/* Shimmer Light Reflection Wave */}
              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{
                  animation: 'cylinderShimmer 1.2s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Loading status & percentage counter */}
          <div className="flex justify-between items-center w-64 sm:w-72 mt-2 px-1 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] animate-ping" />
              <span className="text-[11px] font-semibold text-slate-500">Laboratuvar yükleniyor...</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#ff7a00]">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

