import React, { useState } from 'react';
import { useAppStore, getInitialDemoActivityDates } from '../store/useAppStore';
import { X, Check, Flame, Zap, Sparkles } from 'lucide-react';

interface StreakModalProps {
  onClose: () => void;
}

const CoolSunglasses: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 64"
    className={`w-full h-auto filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.65)] ${className}`}
    fill="none"
    xmlns="https://www.w3.org/2000/svg"
  >
    {/* Sunglasses Bridge */}
    <path
      d="M 66 22 Q 80 18 94 22"
      stroke="#020617"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M 70 23 Q 80 20 90 23"
      stroke="#334155"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Left Frame & Temple */}
    <path
      d="M 12 16 L 30 16 Q 70 16 70 28 Q 70 48 48 48 Q 18 48 14 30 Z"
      fill="#020617"
      stroke="#1e293b"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Left Lens Dark Tint */}
    <path
      d="M 18 20 Q 64 20 64 28 Q 64 43 46 43 Q 22 43 18 30 Z"
      fill="url(#leftLensGrad)"
    />
    {/* Left Lens Specular Glare / White Reflection Bars */}
    <path
      d="M 28 21 L 38 21 L 24 42 L 18 42 Z"
      fill="#ffffff"
      fillOpacity="0.9"
    />
    <path
      d="M 44 21 L 49 21 L 37 40 L 32 40 Z"
      fill="#ffffff"
      fillOpacity="0.45"
    />

    {/* Right Frame & Temple */}
    <path
      d="M 148 16 L 130 16 Q 90 16 90 28 Q 90 48 112 48 Q 142 48 146 30 Z"
      fill="#020617"
      stroke="#1e293b"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Right Lens Dark Tint */}
    <path
      d="M 142 20 Q 96 20 96 28 Q 96 43 114 43 Q 138 43 142 30 Z"
      fill="url(#rightLensGrad)"
    />
    {/* Right Lens Specular Glare / White Reflection Bars */}
    <path
      d="M 110 21 L 120 21 L 106 42 L 100 42 Z"
      fill="#ffffff"
      fillOpacity="0.9"
    />
    <path
      d="M 126 21 L 131 21 L 119 40 L 114 40 Z"
      fill="#ffffff"
      fillOpacity="0.45"
    />

    {/* Left & Right Temple Hinges */}
    <rect x="8" y="18" width="6" height="5" rx="1.5" fill="#475569" />
    <rect x="146" y="18" width="6" height="5" rx="1.5" fill="#475569" />

    <defs>
      <linearGradient id="leftLensGrad" x1="18" y1="20" x2="64" y2="43" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f172a" />
        <stop offset="1" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="rightLensGrad" x1="96" y1="20" x2="142" y2="43" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f172a" />
        <stop offset="1" stopColor="#020617" />
      </linearGradient>
    </defs>
  </svg>
);

export const StreakModal: React.FC<StreakModalProps> = ({ onClose }) => {
  const { language, streak, isAuthenticated, isVerified, activityDates } = useAppStore();
  const [imgError, setImgError] = useState(false);
  const isTr = language === 'tr';

  const displayStreak = streak > 0 ? streak : (isAuthenticated && isVerified ? 1 : 3);

  // Week days starting from Sunday (0) to Saturday (6) like Photo 2
  const daysOfWeek = isTr
    ? [
        { label: 'Pz', full: 'Pazar', index: 0 },
        { label: 'Pt', full: 'Pazartesi', index: 1 },
        { label: 'Sa', full: 'Salı', index: 2 },
        { label: 'Ça', full: 'Çarşamba', index: 3 },
        { label: 'Pe', full: 'Perşembe', index: 4 },
        { label: 'Cu', full: 'Cuma', index: 5 },
        { label: 'Ct', full: 'Cumartesi', index: 6 },
      ]
    : [
        { label: 'Su', full: 'Sunday', index: 0 },
        { label: 'Mo', full: 'Monday', index: 1 },
        { label: 'Tu', full: 'Tuesday', index: 2 },
        { label: 'We', full: 'Wednesday', index: 3 },
        { label: 'Th', full: 'Thursday', index: 4 },
        { label: 'Fr', full: 'Friday', index: 5 },
        { label: 'Sa', full: 'Saturday', index: 6 },
      ];

  const now = new Date();
  const todayIndex = now.getDay(); // 0 = Sunday, ..., 6 = Saturday

  // Ensure activityDates has valid date list for current week
  const recordedDates =
    activityDates && activityDates.length > 0
      ? activityDates
      : getInitialDemoActivityDates(displayStreak);

  // Calculate the exact date (YYYY-MM-DD) for each day of the current week (Sunday to Saturday)
  const getWeekDayDateStr = (dayIdx: number) => {
    const d = new Date(now);
    d.setDate(now.getDate() - todayIndex + dayIdx);
    return d.toISOString().split('T')[0];
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#ff7a00] via-[#f56500] to-[#e04f00] text-white p-6 sm:p-7 text-center shadow-2xl overflow-hidden border border-amber-300/40 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows & Background Lightning Effects */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-yellow-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative lightning bolts in background */}
        <Zap className="absolute top-8 left-4 w-7 h-7 text-yellow-200/40 rotate-[-15deg] pointer-events-none animate-pulse" />
        <Zap className="absolute top-12 right-6 w-9 h-9 text-amber-200/40 rotate-[20deg] pointer-events-none animate-pulse" />
        <Sparkles className="absolute bottom-28 left-6 w-6 h-6 text-yellow-300/40 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/35 text-white/90 hover:text-white transition-colors cursor-pointer z-20"
          title={isTr ? 'Kapat' : 'Close'}
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Real Tanco Mascot with Sunglasses & Radiating Lightning Aura */}
        <div className="relative mx-auto mt-1 mb-2 flex items-center justify-center">
          {/* Pulsing Energy Glow Orb */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-yellow-300/40 via-amber-400/50 to-orange-500/40 blur-2xl animate-pulse pointer-events-none" />

          {/* Electric Sunburst Aura & Spikes radiating behind head */}
          <svg
            viewBox="0 0 240 240"
            className="absolute w-44 h-44 -top-3 overflow-visible pointer-events-none"
            fill="none"
            xmlns="https://www.w3.org/2000/svg"
          >
            {/* Outer Radiating Electric Flares */}
            <path
              d="M120 10 L136 45 L175 32 L162 70 L200 85 L168 110 L195 142 L158 148 L165 186 L132 170 L118 206 L104 170 L71 186 L78 148 L41 142 L68 110 L36 85 L74 70 L61 32 L100 45 Z"
              fill="#FEF08A"
              fillOpacity="0.55"
              className="animate-pulse"
            />
            {/* Inner Golden Lightning Rays */}
            <path
              d="M120 22 L132 50 L164 40 L154 68 L184 80 L160 102 L180 128 L150 134 L156 164 L130 152 L118 180 L106 152 L80 164 L86 134 L56 128 L76 102 L52 80 L82 68 L72 40 L104 50 Z"
              fill="#FACC15"
              fillOpacity="0.75"
            />
            {/* Crackling Zigzag Bolt on Left */}
            <path
              d="M32 75 L54 102 H42 L58 136 L36 108 H48 Z"
              fill="#FFFFFF"
              stroke="#F59E0B"
              strokeWidth="2.5"
              className="animate-pulse"
            />
            {/* Crackling Zigzag Bolt on Right */}
            <path
              d="M208 75 L186 102 H198 L182 136 L204 108 H192 Z"
              fill="#FFFFFF"
              stroke="#F59E0B"
              strokeWidth="2.5"
              className="animate-pulse"
            />
          </svg>

          {/* Official Tanco Character with Overlay Sunglasses */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]">
            <img
              src={imgError ? '/tancore-mascot.png' : '/tancore-mascot-transparent.png'}
              alt="Tanco"
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />

            {/* Cool Sunglasses Overlay anatomically placed on Tanco's face */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: '48.4%',
                top: '41.2%',
                width: '42%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CoolSunglasses />
            </div>
          </div>
        </div>

        {/* Big Bold Streak Number Display */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-6xl sm:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
              {displayStreak}
            </span>
            <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 fill-yellow-300 animate-bounce drop-shadow-md" />
          </div>
          <span className="text-base sm:text-lg font-black text-amber-100 tracking-wide mt-0.5 drop-shadow-xs">
            {isTr ? 'günlük seri!' : 'day streak!'}
          </span>
        </div>

        {/* Days of the Week Card (Duolingo Style: Lava vs Ice) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 text-slate-800 shadow-xl my-4">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysOfWeek.map((d) => {
              const isToday = d.index === todayIndex;
              const isFuture = d.index > todayIndex;
              const dayDateStr = getWeekDayDateStr(d.index);

              // 1. LAVLI (Active Streak): exactly displayStreak continuous days up to today
              // The total number of lava days strictly equals Math.min(displayStreak, todayIndex + 1)
              const isLava = !isFuture && (todayIndex - d.index < displayStreak);

              // 2. BUZLU (Ice): earlier solved days in this week before an interrupted break
              const isIce = !isFuture && !isLava && recordedDates.includes(dayDateStr);

              // 3. MISSED: past day that was not solved
              const isMissed = !isFuture && !isLava && !isIce;

              return (
                <div key={d.index} className="flex flex-col items-center">
                  <span
                    className={`text-[11px] sm:text-xs mb-2 transition-colors ${
                      isToday
                        ? 'text-[#ff7a00] font-black scale-105'
                        : isLava
                        ? 'text-orange-600 font-bold'
                        : isIce
                        ? 'text-sky-600 font-bold'
                        : 'text-slate-400 font-medium'
                    }`}
                  >
                    {d.label}
                  </span>

                  <div className="relative flex items-center justify-center">
                    {/* LAVLI (Fiery Lava Active Streak Day) */}
                    {isLava && (
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-orange-500/40 ${
                          isToday
                            ? 'ring-2 ring-yellow-300 ring-offset-2 ring-offset-white scale-110 animate-pulse'
                            : 'ring-1 ring-amber-300/70'
                        }`}
                        title={
                          isToday
                            ? (isTr ? 'Bugün (Alevli Seri)' : 'Today (Active Streak)')
                            : (isTr ? 'Alevli Seri Günü' : 'Active Streak Day')
                        }
                      >
                        <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3] text-white drop-shadow-xs" />
                      </div>
                    )}

                    {/* BUZLU (Icy Frost Broken / Earlier Streak Day) */}
                    {isIce && (
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md bg-gradient-to-tr from-cyan-400 via-sky-400 to-blue-500 text-white shadow-cyan-400/50 ring-1 ring-cyan-200/90"
                        title={isTr ? 'Buzlu (Önceki Çözülen Gün)' : 'Frozen (Previous Solved Day)'}
                      >
                        <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3] text-cyan-50 drop-shadow-xs" />
                      </div>
                    )}

                    {/* MISSED (Past day not solved) */}
                    {isMissed && (
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-200/90 flex items-center justify-center"
                        title={isTr ? 'Çözülmedi' : 'Missed'}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    )}

                    {/* FUTURE (Unreached upcoming day) */}
                    {isFuture && (
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100/70 border border-dashed border-slate-200/80 flex items-center justify-center"
                        title={isTr ? 'Gelecek Gün' : 'Future Day'}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Legend for Lava vs Ice */}
          <div className="flex items-center justify-center gap-3.5 mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 shadow-xs ring-1 ring-amber-300/60" />
              <span className="text-orange-600">{isTr ? 'Lavlı Seri' : 'Active Lava'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xs ring-1 ring-cyan-200" />
              <span className="text-sky-600">{isTr ? 'Buzlu Günler' : 'Frozen Ice'}</span>
            </span>
          </div>
        </div>

        {/* Motivational Info Text */}
        <p className="text-xs sm:text-sm font-semibold text-amber-50/95 leading-relaxed px-2 mb-4">
          {isTr
            ? 'Ateşin hiç sönmesin! Her gün en az bir ders veya vaka çözerek serini koru.'
            : 'Keep your fire burning! Solve at least one lesson or case study every day.'}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white hover:bg-amber-50 active:scale-95 text-[#ff7a00] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer"
        >
          {isTr ? 'Devam Et' : 'Continue'}
        </button>
      </div>
    </div>
  );
};