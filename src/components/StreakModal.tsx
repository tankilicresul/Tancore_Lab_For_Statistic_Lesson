import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Check, Flame, Zap, Sparkles } from 'lucide-react';

interface StreakModalProps {
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({ onClose }) => {
  const { language, streak, isAuthenticated, isVerified } = useAppStore();
  const isTr = language === 'tr';

  const displayStreak = isAuthenticated && isVerified ? streak : (streak > 0 ? streak : 3);

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

  const todayIndex = new Date().getDay(); // 0 = Sunday, ..., 6 = Saturday

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
        <Zap className="absolute top-8 left-4 w-7 h-7 text-yellow-200/30 rotate-[-15deg] pointer-events-none animate-pulse" />
        <Zap className="absolute top-12 right-6 w-9 h-9 text-amber-200/30 rotate-[20deg] pointer-events-none animate-pulse" />
        <Sparkles className="absolute bottom-28 left-6 w-6 h-6 text-yellow-300/40 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/35 text-white/90 hover:text-white transition-colors cursor-pointer z-20"
          title={isTr ? 'Kapat' : 'Close'}
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Cool Tanco with Sunglasses & Lightning Aura */}
        <div className="relative mx-auto mt-2 mb-3 flex items-center justify-center">
          {/* Pulsing Energy Aura */}
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-300/40 via-amber-400/50 to-orange-500/40 blur-xl animate-pulse" />

          {/* Tanco Mascot SVG with Sunglasses and Crackling Lightning */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full overflow-visible"
              fill="none"
              xmlns="https://www.w3.org/2000/svg"
            >
              {/* Electric Aura Flares / Spikes behind head */}
              <path
                d="M100 8 L114 36 L144 26 L134 54 L164 64 L138 84 L160 110 L130 114 L136 144 L110 132 L98 160 L86 132 L60 144 L66 114 L36 110 L58 84 L32 64 L62 54 L52 26 L82 36 Z"
                fill="#FEF08A"
                fillOpacity="0.85"
              />
              <path
                d="M100 16 L110 38 L136 30 L128 52 L152 60 L132 76 L148 98 L124 102 L128 126 L108 116 L98 138 L88 116 L68 126 L72 102 L48 98 L64 76 L44 60 L68 52 L60 30 L86 38 Z"
                fill="#FACC15"
              />

              {/* Side Lightning Bolts */}
              {/* Left Bolt */}
              <path
                d="M24 60 L42 82 H32 L46 110 L28 88 H38 Z"
                fill="#FFFFFF"
                stroke="#F59E0B"
                strokeWidth="2"
                className="animate-pulse"
              />
              {/* Right Bolt */}
              <path
                d="M176 60 L158 82 H168 L154 110 L172 88 H162 Z"
                fill="#FFFFFF"
                stroke="#F59E0B"
                strokeWidth="2"
                className="animate-pulse"
              />

              {/* Tanco Hair Back */}
              <path
                d="M45 92 C40 60, 62 25, 100 25 C138 25, 160 60, 155 92 Z"
                fill="#1E293B"
                stroke="#0F172A"
                strokeWidth="4"
              />

              {/* Tanco Body & Suit */}
              <path
                d="M40 180 C40 142, 70 132, 100 132 C130 132, 160 142, 160 180 Z"
                fill="#E2E8F0"
                stroke="#0F172A"
                strokeWidth="5"
              />
              <path
                d="M78 132 L100 160 L122 132 L140 136 L100 174 L60 136 Z"
                fill="#FF7A00"
                stroke="#0F172A"
                strokeWidth="4"
              />

              {/* Neck */}
              <rect x="86" y="112" width="28" height="24" fill="#FED7AA" stroke="#0F172A" strokeWidth="4" />

              {/* Head Circle */}
              <circle cx="100" cy="85" r="42" fill="#FF7A00" stroke="#0F172A" strokeWidth="5" />
              <circle cx="100" cy="85" r="34" stroke="#FFFFFF" strokeWidth="4" fill="none" />

              {/* Tanco Energy Lightning on Head */}
              <path
                d="M102 65 L88 87 H98 L94 105 L112 83 H102 L106 65 Z"
                fill="#FFFFFF"
              />

              {/* COOL SUNGLASSES (Gözlük) */}
              <g className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                {/* Sunglasses Frame */}
                <path
                  d="M60 76 C60 72, 64 69, 70 69 L130 69 C136 69, 140 72, 140 76 L136 94 C134 102, 122 105, 114 101 L100 93 L86 101 C78 105, 66 102, 64 94 Z"
                  fill="#0F172A"
                  stroke="#1E293B"
                  strokeWidth="3"
                />
                {/* Left Lens Dark Gradient */}
                <path
                  d="M67 73 L96 73 L94 88 C92 94, 84 96, 78 94 L69 88 C66 84, 65 77, 67 73 Z"
                  fill="#1E293B"
                />
                {/* Right Lens Dark Gradient */}
                <path
                  d="M104 73 L133 73 C135 77, 134 84, 131 88 L122 94 C116 96, 108 94, 106 88 Z"
                  fill="#1E293B"
                />
                {/* White Specular Glare / Reflection Lines across lenses */}
                <path
                  d="M74 74 L84 74 L73 90 L67 90 Z"
                  fill="#FFFFFF"
                  fillOpacity="0.8"
                />
                <path
                  d="M111 74 L121 74 L110 90 L104 90 Z"
                  fill="#FFFFFF"
                  fillOpacity="0.8"
                />
                {/* Bridge over nose */}
                <rect x="96" y="73" width="8" height="4" fill="#334155" />
              </g>

              {/* Front Bangs / Hair Tufts over glasses frame */}
              <path
                d="M56 68 C66 38, 92 34, 100 44 C108 34, 134 38, 144 68 C134 48, 112 48, 100 56 C88 48, 66 48, 56 68 Z"
                fill="#1E293B"
                stroke="#0F172A"
                strokeWidth="4"
              />
            </svg>
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

        {/* Days of the Week Card (Photo 2 Duolingo Style) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 text-slate-800 shadow-xl my-4">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysOfWeek.map((d) => {
              const isToday = d.index === todayIndex;
              // Days up to today are marked if streak spans them
              const isPastOrToday = d.index <= todayIndex;
              const isChecked = isPastOrToday && displayStreak > 0;

              return (
                <div key={d.index} className="flex flex-col items-center">
                  <span
                    className={`text-[11px] sm:text-xs font-black mb-2 ${
                      isToday ? 'text-[#ff7a00] font-black' : 'text-slate-400'
                    }`}
                  >
                    {d.label}
                  </span>

                  <div className="relative flex items-center justify-center">
                    {isChecked ? (
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-xs ${
                          isToday
                            ? 'bg-[#ff7a00] text-white ring-2 ring-[#ff7a00]/40 scale-105 animate-pulse'
                            : 'bg-[#ff7a00] text-white'
                        }`}
                      >
                        <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200/90 flex items-center justify-center" />
                    )}
                  </div>
                </div>
              );
            })}
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