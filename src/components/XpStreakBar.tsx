import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Flame, Trophy, Globe, RotateCcw, Sparkles } from 'lucide-react';
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
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 font-sans">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo with 45% Warm Yellow-Orange Brand Identity */}
          <a href="#" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent tracking-tight">
                StatLingo
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider uppercase">
                PRO
              </span>
            </div>
          </a>

          {/* User Stats & Controls (35% White + 45% Amber/Orange) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Streak */}
            <div className="flex items-center space-x-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-full text-amber-300 font-extrabold text-xs tracking-wide shadow-sm">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{streak} {language === 'tr' ? 'gün' : 'days'}</span>
            </div>

            {/* XP */}
            <div className="flex items-center space-x-1.5 bg-amber-400/10 border border-amber-400/25 px-3 py-1.5 rounded-full text-white font-extrabold text-xs tracking-wide">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-bold">{xp} XP</span>
            </div>

            {/* Badges Drawer Trigger */}
            <button
              onClick={() => setShowBadges(true)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors border border-slate-800 hover:border-amber-500/40"
              title={language === 'tr' ? 'Rozetlerim' : 'My Badges'}
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              {unlockedBadges.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-md">
                  {unlockedBadges.length}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-extrabold text-xs transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Reset Progress Button */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 transition-colors border border-slate-800"
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
