import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Flame, Trophy, Globe, Zap, User } from 'lucide-react';
import { BadgesModal } from './BadgesModal';
import { ProfileModal } from './ProfileModal';

interface XpStreakBarProps {
  onGoHome?: () => void;
}

export const XpStreakBar: React.FC<XpStreakBarProps> = ({ onGoHome }) => {
  const { language, toggleLanguage, xp, streak, unlockedBadges } = useAppStore();
  const [showBadges, setShowBadges] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);

  // Trigger logo spin animation every 5 seconds (accelerating start, rapid deceleration stop)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLogoSpinning(true);
      const timer = setTimeout(() => {
        setIsLogoSpinning(false);
      }, 1300);
      return () => clearTimeout(timer);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 font-sans shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* TanCoreLab Brand Logo & Name with 5s Spinning Animation */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onGoHome?.();
            }}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full bg-[#ff7a00] flex items-center justify-center shadow-md shadow-[#ff7a00]/30 group-hover:scale-105 transition-transform p-1 ${
                isLogoSpinning ? 'animate-logo-spin' : ''
              }`}
            >
              <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white stroke-[1.75]" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                TanCoreLab
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

            {/* My Profile Button */}
            <button
              onClick={() => setShowProfile(true)}
              className="p-2 rounded-xl bg-[#ff7a00]/15 hover:bg-[#ff7a00]/25 text-[#ff7a00] border border-[#ff7a00]/40 transition-colors shadow-xs"
              title={language === 'tr' ? 'Profilim & Performansım' : 'My Profile'}
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </button>
          </div>
        </div>
      </header>

      {showBadges && <BadgesModal onClose={() => setShowBadges(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
};
