import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Flame, Trophy, Globe, RotateCcw, Zap } from 'lucide-react';
import { BadgesModal } from './BadgesModal';

export const XpStreakBar: React.FC = () => {
  const { language, toggleLanguage, xp, streak, resetProgress, unlockedBadges } = useAppStore();
  const [showBadges, setShowBadges] = useState(false);

  const handleReset = () => {
    if (window.confirm(language === 'tr' ? 'Tüm ilerlemenizi sıfırlamak istediğinize emin misiniz?' : 'Are you sure you want to reset all progress?')) {
      resetProgress();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 font-sans shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo matching Image 2 (TanCoreLab Electric Orange Circle + White Ring + Lightning Bolt) */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-[#ff7a00] flex items-center justify-center shadow-md shadow-[#ff7a00]/30 group-hover:scale-105 transition-transform p-1">
              <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white stroke-[2.5]" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                StatLingo
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 tracking-wider uppercase">
                PRO
              </span>
            </div>
          </a>

          {/* User Stats & Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Streak */}
            <div className="flex items-center space-x-1.5 bg-[#ff7a00]/10 border border-[#ff7a00]/30 px-3 py-1.5 rounded-full text-[#ff7a00] font-extrabold text-xs tracking-wide shadow-xs">
              <Flame className="w-4 h-4 fill-[#ff7a00] text-[#ff7a00] animate-pulse" />
              <span>{streak} {language === 'tr' ? 'gün' : 'days'}</span>
            </div>

            {/* XP */}
            <div className="flex items-center space-x-1.5 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full text-slate-900 font-extrabold text-xs tracking-wide">
              <Trophy className="w-4 h-4 text-[#ff7a00]" />
              <span className="text-[#ff7a00] font-bold">{xp} XP</span>
            </div>

            {/* Badges Drawer Trigger */}
            <button
              onClick={() => setShowBadges(true)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title={language === 'tr' ? 'Rozetlerim' : 'My Badges'}
            >
              <Trophy className="w-5 h-5 text-[#ff7a00]" />
              {unlockedBadges.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff7a00] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                  {unlockedBadges.length}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 border border-[#ff7a00]/30 text-[#ff7a00] font-extrabold text-xs transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Reset Progress Button */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors border border-slate-200"
              title={language === 'tr' ? 'İlerlemeyi Sıfırla' : 'Reset Progress'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {showBadges && <BadgesModal onClose={() => setShowBadges(false)} />}
    </>
  );
};
