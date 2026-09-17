import React, { useEffect, useState } from 'react';

export const AppSplashScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'loading' | 'flashing' | 'zooming' | 'done'>('loading');

  useEffect(() => {
    // Stage 1: Cylinder fills (0s - 2.3s)
    // Stage 2: Cylinder reaches 100% and flashes (2.3s - 2.6s)
    const flashTimer = setTimeout(() => {
      setStage('flashing');
    }, 2300);

    // Stage 3: Logo expands & zooms into screen (2.6s - 3.0s)
    const zoomTimer = setTimeout(() => {
      setStage('zooming');
    }, 2600);

    // Stage 4: Finish at 3.0s and reveal app
    const finishTimer = setTimeout(() => {
      setStage('done');
      onComplete?.();
    }, 3000);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(zoomTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (stage === 'done') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f8fafc] select-none pointer-events-none transition-opacity ${
        stage === 'zooming' ? 'opacity-0 duration-400 ease-out' : 'opacity-100 duration-300'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 48%, rgba(255, 122, 0, 0.09) 0%, #f8fafc 70%)',
      }}
    >
      {/* Center Brand Container */}
      <div
        className={`flex flex-col items-center justify-center transition-all ${
          stage === 'zooming'
            ? 'scale-[14] opacity-0 duration-450 ease-in'
            : stage === 'flashing'
            ? 'scale-105 duration-300 ease-out'
            : 'scale-100 duration-500 ease-out'
        }`}
      >
        {/* TanCoreLab Icon & Brand Text */}
        <div className="flex items-center space-x-3.5 sm:space-x-4">
          {/* Logo Badge */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ff7a00] flex items-center justify-center p-1.5 shadow-xl transition-all duration-300 ${
              stage === 'flashing'
                ? 'shadow-[0_0_40px_rgba(255,122,0,0.95)] ring-4 ring-orange-300 ring-offset-2 scale-110'
                : 'shadow-[#ff7a00]/30'
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
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-orange-600 uppercase mt-1">
              Endüstri Mühendisliği & Analitik
            </span>
          </div>
        </div>

        {/* 3-Second Filling Cylinder (Progress Bar) */}
        <div
          className={`mt-8 sm:mt-10 transition-all duration-300 ${
            stage === 'zooming' ? 'opacity-0 scale-90' : 'opacity-100'
          }`}
        >
          {/* Outer Rounded Cylinder */}
          <div
            className={`w-64 sm:w-72 h-4 sm:h-4.5 bg-white rounded-full p-0.5 border border-slate-200/90 shadow-inner relative overflow-hidden transition-all duration-300 ${
              stage === 'flashing'
                ? 'ring-4 ring-orange-400/50 shadow-[0_0_24px_rgba(255,122,0,0.8)]'
                : 'shadow-xs'
            }`}
          >
            {/* Filling Orange Bar */}
            <div
              className={`h-full rounded-full bg-gradient-to-r from-amber-400 via-[#ff7a00] to-[#ff5500] relative overflow-hidden transition-all ${
                stage === 'flashing'
                  ? 'brightness-125 shadow-[0_0_16px_rgba(255,122,0,1)]'
                  : ''
              }`}
              style={{
                animation: 'cylinderProgressFill 2.4s cubic-bezier(0.12, 0.8, 0.32, 1) forwards',
              }}
            >
              {/* Shimmer / Light Reflection Wave */}
              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{
                  animation: 'cylinderShimmer 1.4s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Subtle loading subtitle text */}
          <div className="flex justify-center items-center mt-2.5 space-x-1.5 text-xs text-slate-400 font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] animate-ping" />
            <span>Laboratuvar yükleniyor...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
