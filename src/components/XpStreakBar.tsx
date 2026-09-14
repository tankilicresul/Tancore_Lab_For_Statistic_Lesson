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
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                StatLingo
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
          </a>

          {/* User Stats & Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Streak */}
            <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full text-amber-400 font-bold text-sm">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{streak} {language === 'tr' ? 'gün' : 'days'}</span>
            </div>

            {/* XP */}
            <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 font-bold text-sm">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>{xp} XP</span>
            </div>

            {/* Badges Drawer Trigger */}
            <button
              onClick={() => setShowBadges(true)}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title={language === 'tr' ? 'Rozetlerim' : 'My Badges'}
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              {unlockedBadges.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unlockedBadges.length}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Reset Progress Button */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 transition-colors border border-slate-800 hover:border-rose-800/40"
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
