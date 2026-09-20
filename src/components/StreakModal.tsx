import React, { useState, useEffect } from 'react';
import { useAppStore, computeContiguousStreak, getLocalDateStr } from '../store/useAppStore';
import { X, Check, Flame } from 'lucide-react';
import { soundService } from '../services/soundService';

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

const LiquidLavaStream: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 36"
    className={`w-36 sm:w-44 h-auto overflow-visible pointer-events-none filter drop-shadow-[0_4px_6px_rgba(185,28,28,0.65)] ${className}`}
    fill="none"
    xmlns="https://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="lavaStreamGradModal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF59D" />
        <stop offset="25%" stopColor="#FACC15" />
        <stop offset="50%" stopColor="#FB923C" />
        <stop offset="75%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>

      <linearGradient id="lavaCoreGradModal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#F97316" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    {/* Soft Red Ambient Lava Glow behind stream */}
    <path
      d="M 10 2 Q 40 8 80 4 Q 120 8 150 2 L 145 12 Q 120 18 80 14 Q 40 18 15 10 Z"
      fill="#DC2626"
      fillOpacity="0.5"
      className="blur-[3px]"
    />

    {/* Main Liquid Lava Melt & Dripping Molten Lava Flow */}
    <path
      d="
        M 8 0 
        Q 24 3 40 1 
        C 42 10, 44 19, 46 25 
        C 48 30, 52 31, 54 28 
        C 56 23, 55 12, 60 3 
        Q 76 6 92 2 
        C 94 12, 97 25, 99 33 
        C 101 38, 106 39, 108 35 
        C 111 29, 109 14, 116 3 
        Q 134 5 152 0 
        C 142 8, 138 12, 126 9 
        C 118 7, 108 14, 96 11 
        C 86 8, 70 12, 54 8 
        C 40 5, 24 8, 8 0 
        Z
      "
      fill="url(#lavaStreamGradModal)"
    />

    {/* Inner White/Yellow Hot Core Highlight */}
    <path
      d="
        M 16 1 
        Q 28 3 38 2 
        C 40 8, 42 16, 44 21 
        C 45 24, 48 25, 49 23 
        C 50 19, 50 10, 54 2 
        Q 70 5 86 2 
        C 88 9, 91 19, 93 27 
        C 94 31, 98 32, 100 28 
        C 102 23, 101 11, 107 2 
        Q 125 4 140 1 
        Z
      "
      fill="url(#lavaCoreGradModal)"
    />

    {/* Falling Glowing Lava Droplets */}
    <circle cx="46" cy="34" r="2" fill="#FACC15" className="animate-pulse" />
    <circle cx="46" cy="34" r="1" fill="#FFFFFF" />

    <circle cx="99" cy="38" r="2.5" fill="#F97316" className="animate-pulse" />
    <circle cx="99" cy="38" r="1.2" fill="#FEF08A" />

    <circle cx="130" cy="22" r="1.5" fill="#FACC15" />
  </svg>
);

const IceCrystal3D: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSmoke?: boolean;
  hasSolvedBadge?: boolean;
}> = ({ className = '', size = 'md', showSmoke = true, hasSolvedBadge = true }) => {
  const [imgError, setImgError] = useState(false);

  const dims = {
    sm: 'w-2.5 h-3.5',
    md: 'w-4.5 h-6 sm:w-5 sm:h-7',
    lg: 'w-6 h-8.5',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Rising Cold White/Frost Vapor Animation from Top of Crystal */}
      {showSmoke && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none w-5 h-6 flex items-center justify-center z-20">
          {/* Mist puff 1: Main rising frost wisp */}
          <div className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-t from-sky-200/90 to-white/95 blur-[0.75px] shadow-[0_0_8px_rgba(56,189,248,0.6)] animate-cold-smoke-1" />
          {/* Mist puff 2: Right drift wisp */}
          <div className="absolute w-2 h-2 rounded-full bg-gradient-to-t from-cyan-200/85 to-white/95 blur-[0.75px] shadow-[0_0_6px_rgba(14,165,233,0.5)] animate-cold-smoke-2" />
          {/* Mist puff 3: Left drift wisp */}
          <div className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-t from-sky-100/80 to-white/90 blur-[1px] shadow-[0_0_6px_rgba(56,189,248,0.4)] animate-cold-smoke-3" />
        </div>
      )}

      {/* 3D Ice Crystal from User's Reference Photo */}
      {!imgError ? (
        <img
          src="/ice-crystal-3d.png"
          alt="3D Ice Crystal"
          className={`${dims} object-contain filter drop-shadow-[0_4px_8px_rgba(14,165,233,0.55)] animate-ice-crystal transition-transform`}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Multi-faceted 3D SVG Fallback */
        <svg
          viewBox="0 0 100 146"
          className={`${dims} overflow-visible filter drop-shadow-[0_4px_8px_rgba(14,165,233,0.55)] animate-ice-crystal`}
          fill="none"
          xmlns="https://www.w3.org/2000/svg"
        >
          <polygon points="36,4 70,18 97,48 50,144 14,50" fill="#0284c7" />
          <polygon points="36,4 70,18 64,36 30,22" fill="#E0F2FE" />
          <polygon points="14,50 36,4 30,22 24,78" fill="#38BDF8" />
          <polygon points="30,22 64,36 50,118" fill="#7DD3FC" />
          <polygon points="64,36 97,48 84,102 50,118" fill="#0284c7" />
          <polygon points="24,78 50,118 50,144" fill="#0369A1" />
          <polygon points="50,118 84,102 50,144" fill="#075985" />
          <line x1="30" y1="22" x2="64" y2="36" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <line x1="30" y1="22" x2="50" y2="118" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <line x1="64" y1="36" x2="50" y2="118" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        </svg>
      )}

      {/* Solved checkmark badge on bottom-right of crystal */}
      {hasSolvedBadge && (
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-600 text-white flex items-center justify-center ring-1 ring-white shadow-xs z-10">
          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
        </div>
      )}
    </div>
  );
};

const LavaRock3D: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showFlames?: boolean;
  hasSolvedBadge?: boolean;
  isToday?: boolean;
}> = ({
  className = '',
  size = 'md',
  showFlames = true,
  hasSolvedBadge = true,
  isToday = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const dims = {
    sm: 'w-4 h-3.5',
    md: 'w-7 h-6 sm:w-8 sm:h-7',
    lg: 'w-10 h-8.5',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Heat Radiation Orb */}
      <div
        className={`absolute rounded-full pointer-events-none blur-md ${
          isToday
            ? 'w-9 h-9 bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-400 opacity-80 animate-pulse'
            : 'w-7 h-7 bg-gradient-to-tr from-red-600/60 via-amber-500/50 to-yellow-400/40 opacity-60'
        }`}
      />

      {/* Surging Flame Waves Animation from Crater / Peak */}
      {showFlames && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none w-7 h-8 flex items-center justify-center z-20">
          {/* Flame wave 1: Main central fire plume surge */}
          <div className="absolute w-3.5 h-4.5 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 blur-[0.75px] shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-flame-wave-1" />
          
          {/* Flame wave 2: Secondary flickering flame tongue */}
          <div className="absolute w-3 h-4 rounded-full bg-gradient-to-t from-red-500 via-orange-400 to-yellow-100 blur-[0.75px] shadow-[0_0_8px_rgba(249,115,22,0.85)] animate-flame-wave-2" />
          
          {/* Flame wave 3: Core hot white-yellow licking flame */}
          <div className="absolute w-2 h-3 rounded-full bg-gradient-to-t from-amber-300 via-yellow-200 to-white blur-[0.5px] shadow-[0_0_6px_rgba(254,240,138,0.95)] animate-flame-wave-3" />

          {/* Flying burning ember spark 1 */}
          <div className="absolute -left-1 top-2 w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_4px_#fde047] animate-ember-1" />
          
          {/* Flying burning ember spark 2 */}
          <div className="absolute right-0 top-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#fbbf24] animate-ember-2" />
        </div>
      )}

      {/* 3D Lava Rock Asset from User's Reference Photo */}
      {!imgError ? (
        <img
          src="/lava-rock-3d.png"
          alt="3D Burning Lava Rock"
          className={`${dims} object-contain filter drop-shadow-[0_4px_10px_rgba(239,68,68,0.85)] animate-lava-rock transition-transform`}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Vector 3D Lava Mountain Fallback */
        <svg
          viewBox="0 0 100 90"
          className={`${dims} overflow-visible filter drop-shadow-[0_4px_10px_rgba(239,68,68,0.85)] animate-lava-rock`}
          fill="none"
          xmlns="https://www.w3.org/2000/svg"
        >
          <path d="M10 82 Q20 50 45 22 Q52 14 62 22 Q85 45 92 82 Z" fill="#1c1917" stroke="#0c0a09" strokeWidth="2" />
          <path d="M45 22 Q50 45 35 70 Q42 78 55 80" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M52 35 Q65 52 75 80" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 26 Q50 42 42 58" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* Solved Checkmark Badge on bottom-right */}
      {hasSolvedBadge && (
        <div
          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-white shadow-xs z-10 ${
            isToday
              ? 'bg-amber-500 text-white ring-2 ring-yellow-300 animate-pulse'
              : 'bg-red-600 text-white'
          }`}
        >
          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
        </div>
      )}
    </div>
  );
};

const ExtinguishedLavaRock3D: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hasSolvedBadge?: boolean;
}> = ({ className = '', size = 'md', hasSolvedBadge = false }) => {
  const [imgError, setImgError] = useState(false);

  const dims = {
    sm: 'w-4 h-3.5',
    md: 'w-7 h-6 sm:w-8 sm:h-7',
    lg: 'w-10 h-8.5',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D Extinguished Lava Rock Asset from User's Reference Photo */}
      {!imgError ? (
        <img
          src="/extinguished-lava-rock-3d.png"
          alt="3D Extinguished Lava Rock"
          className={`${dims} object-contain filter drop-shadow-[0_3px_6px_rgba(15,23,42,0.65)] animate-dormant-rock transition-transform`}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Vector 3D Charcoal Rock Fallback */
        <svg
          viewBox="0 0 100 90"
          className={`${dims} overflow-visible filter drop-shadow-[0_3px_6px_rgba(15,23,42,0.65)] animate-dormant-rock`}
          fill="none"
          xmlns="https://www.w3.org/2000/svg"
        >
          <path d="M14 78 Q22 46 46 22 Q52 14 62 20 Q86 42 90 76 Q70 88 48 86 Q26 86 14 78 Z" fill="#18181b" stroke="#09090b" strokeWidth="2.5" />
          <path d="M44 26 Q48 44 36 62 Q40 70 50 72" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 34 Q62 48 70 70" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M46 28 Q48 40 42 52" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}

      {/* Solved Checkmark Badge on bottom-right of extinguished rock */}
      {hasSolvedBadge && (
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-700 text-white flex items-center justify-center ring-1 ring-white shadow-xs z-10">
          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
        </div>
      )}
    </div>
  );
};

const FutureRock3D: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const dims = {
    sm: 'w-4 h-3.5',
    md: 'w-7 h-6 sm:w-8 sm:h-7',
    lg: 'w-10 h-8.5',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D Natural Rock Boulder Asset from User's Reference Photo */}
      {!imgError ? (
        <img
          src="/future-rock-3d.png"
          alt="3D Future Rock"
          className={`${dims} object-contain filter drop-shadow-[0_3px_6px_rgba(71,85,105,0.45)] opacity-85 hover:opacity-100 animate-future-rock transition-all`}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Vector 3D Stone Fallback */
        <svg
          viewBox="0 0 100 90"
          className={`${dims} overflow-visible filter drop-shadow-[0_3px_6px_rgba(71,85,105,0.45)] animate-future-rock`}
          fill="none"
          xmlns="https://www.w3.org/2000/svg"
        >
          <path d="M18 72 Q15 42 42 18 Q55 12 70 18 Q90 38 88 72 Q68 85 45 84 Q28 84 18 72 Z" fill="#57534e" stroke="#292524" strokeWidth="2.5" />
          <path d="M42 22 Q48 40 38 58 Q44 68 54 70" stroke="#78716c" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M52 30 Q68 44 74 68" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 48 L58 46" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};

export const StreakModal: React.FC<StreakModalProps> = ({ onClose }) => {
  const { language, streak, activityDates } = useAppStore();
  const [imgError, setImgError] = useState(false);
  const isTr = language === 'tr';

  // Play Lava Flow if streak is active
  useEffect(() => {
    soundService.playLavaFlow(0.18);

    return () => {
      soundService.stopAmbient();
    };
  }, []);

  // Week days starting from Monday (Pt) to Sunday (Pz)
  const daysOfWeek = isTr
    ? [
        { label: 'Pt', full: 'Pazartesi', dayOffset: 0 },
        { label: 'Sa', full: 'Salı', dayOffset: 1 },
        { label: 'Ça', full: 'Çarşamba', dayOffset: 2 },
        { label: 'Pe', full: 'Perşembe', dayOffset: 3 },
        { label: 'Cu', full: 'Cuma', dayOffset: 4 },
        { label: 'Ct', full: 'Cumartesi', dayOffset: 5 },
        { label: 'Pz', full: 'Pazar', dayOffset: 6 },
      ]
    : [
        { label: 'Mo', full: 'Monday', dayOffset: 0 },
        { label: 'Tu', full: 'Tuesday', dayOffset: 1 },
        { label: 'We', full: 'Wednesday', dayOffset: 2 },
        { label: 'Th', full: 'Thursday', dayOffset: 3 },
        { label: 'Fr', full: 'Friday', dayOffset: 4 },
        { label: 'Sa', full: 'Saturday', dayOffset: 5 },
        { label: 'Su', full: 'Sunday', dayOffset: 6 },
      ];

  const now = new Date();
  const jsDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const todayMondayOffset = jsDay === 0 ? 6 : jsDay - 1; // 0 = Mon, 1 = Tue, ..., 6 = Sun

  const currentMonday = new Date(now);
  currentMonday.setDate(now.getDate() - todayMondayOffset);

  const formatDateStr = (d: Date) => getLocalDateStr(d);
  const todayStr = formatDateStr(now);

  // Real recorded activity dates from store
  const recordedDates = Array.isArray(activityDates) && activityDates.length > 0
    ? activityDates
    : [todayStr];

  // Active continuous streak count (unbroken chain of active days leading up to today)
  const displayStreak = Math.max(computeContiguousStreak(activityDates), streak || 1);

  // Derive effective active dates: merge recorded dates and the unbroken active streak days leading up to today
  const effectiveDates = new Set(recordedDates);
  effectiveDates.add(todayStr);

  for (let i = 0; i < displayStreak; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    effectiveDates.add(formatDateStr(d));
  }

  // Calculate Current Week Days (Monday -> Sunday) according to the exact streak rule:
  // - Buz: Never entered / missed days (hiç girilmemiş)
  // - Sönmüş Ateş: Entered in the past, but streak broke because an intervening day was missed (sönmüş lav kayası)
  // - Ateş: Entered and part of the continuous, unbroken active streak leading up to today with no ice in between (alevli lav kayası)
  // - Gelecek: Upcoming days of the week (doğal taş)
  const currentWeekDays = daysOfWeek.map((d) => {
    const dateObj = new Date(currentMonday);
    dateObj.setDate(currentMonday.getDate() + d.dayOffset);
    const dateStr = formatDateStr(dateObj);

    const isToday = d.dayOffset === todayMondayOffset;
    const isFuture = d.dayOffset > todayMondayOffset;
    const wasRecorded = effectiveDates.has(dateStr);

    let isLava = false;
    let isExtinguished = false;
    let isIce = false;

    if (isFuture) {
      // Future day -> stone boulder
    } else if (isToday) {
      // Today: active on the app -> Burning Lava Rock
      isLava = true;
    } else {
      // Past day in the current week
      if (!wasRecorded) {
        // Never entered / missed -> Buz Kristali (Ice)
        isIce = true;
      } else {
        // Entered on this day. Check if all intermediate days between this day and today were also entered
        let isStreakContinuousToToday = true;
        for (let offset = d.dayOffset + 1; offset <= todayMondayOffset; offset++) {
          const intermediateDate = new Date(currentMonday);
          intermediateDate.setDate(currentMonday.getDate() + offset);
          const intermediateStr = formatDateStr(intermediateDate);
          if (!effectiveDates.has(intermediateStr)) {
            isStreakContinuousToToday = false;
            break;
          }
        }

        if (isStreakContinuousToToday) {
          // Unbroken chain of activity with no ice between this day and today -> Ateş (Burning Lava Rock)
          isLava = true;
        } else {
          // Interrupted by at least one missed day -> Sönmüş Ateş (Extinguished Lava Rock)
          isExtinguished = true;
        }
      }
    }

    return {
      ...d,
      dateStr,
      isToday,
      isFuture,
      isLava,
      isExtinguished,
      isIce,
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#ff7a00] via-[#f56500] to-[#e04f00] text-white p-6 sm:p-7 text-center shadow-2xl overflow-hidden border border-amber-300/40 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-yellow-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundService.playModalClose();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/35 text-white/90 hover:text-white transition-colors cursor-pointer z-20"
          title={isTr ? 'Kapat' : 'Close'}
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Real Tanco Mascot with Sunglasses */}
        <div
          className="relative mx-auto mt-1 mb-2 flex items-center justify-center cursor-pointer group"
          onClick={() => soundService.playSunglassesGleam()}
          title={isTr ? 'Tanco!' : 'Tanco!'}
        >
          {/* Pulsing Energy Glow Orb */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-yellow-300/40 via-amber-400/50 to-orange-500/40 blur-2xl animate-pulse pointer-events-none" />

          {/* Electric Sunburst Aura behind head */}
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
            {/* Inner Golden Rays */}
            <path
              d="M120 22 L132 50 L164 40 L154 68 L184 80 L160 102 L180 128 L150 134 L156 164 L130 152 L118 180 L106 152 L80 164 L86 134 L56 128 L76 102 L52 80 L82 68 L72 40 L104 50 Z"
              fill="#FACC15"
              fillOpacity="0.75"
            />
          </svg>

          {/* Official Tanco Character with Enlarged Overlay Sunglasses */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform">
            <img
              src={imgError ? '/tancore-mascot.png' : '/tancore-mascot-transparent.png'}
              alt="Tanco"
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />

            {/* Cool Sunglasses Overlay proportioned to fit Tanco's face naturally */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: '48.8%',
                top: '41.6%',
                width: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CoolSunglasses />
            </div>
          </div>
        </div>

        {/* Big Bold Streak Number Display with Liquid Lava Stream & 3D Lava Fire Rock */}
        <div className="flex flex-col items-center justify-center relative mt-1">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-6xl sm:text-7xl font-black text-white tracking-tight drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)] leading-none">
              {displayStreak}
            </span>
            {/* 3D Lava Fire Rock Icon */}
            <div className="relative flex items-center justify-center ml-1">
              <LavaRock3D
                size="lg"
                showFlames={true}
                hasSolvedBadge={false}
                isToday={true}
                className="scale-125 sm:scale-135 filter drop-shadow-[0_6px_12px_rgba(234,88,12,0.65)]"
              />
            </div>
          </div>

          {/* Dripping Liquid Lava Stream under the number flowing down to "günlük seri!" */}
          <div className="flex justify-center -mt-1.5 -mb-0.5">
            <LiquidLavaStream />
          </div>

          <span className="text-base sm:text-lg font-black text-amber-100 tracking-wide drop-shadow-sm">
            {isTr ? 'günlük seri!' : 'day streak!'}
          </span>
        </div>

        {/* Weekly Activity Grid */}
        <div className="bg-white rounded-2xl p-4 text-slate-800 shadow-xl my-4 space-y-2.5">
          <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              {isTr ? 'Bu Haftaki İlerlemen' : 'This Week Progress'}
            </span>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              {displayStreak} {isTr ? 'günlük seri' : 'day streak'}
            </span>
          </div>

          {/* Current Week (Monday -> Sunday) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-1">
            {currentWeekDays.map((d) => (
              <div key={d.dayOffset} className="flex flex-col items-center">
                <span
                  className={`text-[11px] sm:text-xs mb-1.5 transition-colors ${
                    d.isToday
                      ? 'text-[#ff7a00] font-black scale-105'
                      : d.isLava
                      ? 'text-orange-600 font-bold'
                      : d.isExtinguished
                      ? 'text-slate-600 font-bold'
                      : d.isIce
                      ? 'text-sky-600 font-bold'
                      : 'text-slate-400 font-medium'
                  }`}
                >
                  {d.label}
                </span>

                <div className="relative h-10 sm:h-11 flex items-center justify-center">
                  {/* Active continuous streak -> 3D Burning Lava Rock */}
                  {d.isLava && (
                    <div className="relative flex items-center justify-center pt-1">
                      <LavaRock3D size="md" showFlames={true} isToday={d.isToday} hasSolvedBadge={true} />
                    </div>
                  )}
                  {/* Solved previously, but streak broke -> 3D Extinguished Lava Rock */}
                  {d.isExtinguished && (
                    <div className="relative flex items-center justify-center pt-1">
                      <ExtinguishedLavaRock3D size="md" hasSolvedBadge={true} />
                    </div>
                  )}
                  {/* Never entered / missed past day -> 3D Ice Crystal */}
                  {d.isIce && (
                    <div className="relative flex items-center justify-center pt-1">
                      <IceCrystal3D size="md" showSmoke={true} hasSolvedBadge={false} />
                    </div>
                  )}
                  {/* Future day -> 3D Future Rock */}
                  {d.isFuture && (
                    <div className="relative flex items-center justify-center pt-1 opacity-80">
                      <FutureRock3D size="md" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Info Text */}
        <p className="text-xs sm:text-sm font-semibold text-amber-50/95 leading-relaxed px-2 mb-4">
          {isTr
            ? 'Serini devam ettirmek için her gün giriş yap !'
            : 'Log in every day to keep your streak going !'}
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

