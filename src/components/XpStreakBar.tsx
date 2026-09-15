import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Flame, Globe, Zap, User, ChevronDown, Check, BookOpen, Dices, BarChart3, Layers } from 'lucide-react';
import { ProfileModal } from './ProfileModal';
import { getLocalized } from '../utils/localization';

interface XpStreakBarProps {
  onGoHome?: () => void;
  activeModuleName?: string;
  selectedTrack?: 'probability' | 'statistics';
  onSelectTrack?: (track: 'probability' | 'statistics') => void;
  onSelectModuleId?: (moduleId: string) => void;
}

export const XpStreakBar: React.FC<XpStreakBarProps> = ({
  onGoHome,
  activeModuleName,
  selectedTrack = 'probability',
  onSelectTrack,
  onSelectModuleId,
}) => {
  const { language, toggleLanguage, streak } = useAppStore();
  const [showProfile, setShowProfile] = useState(false);
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trigger logo spin animation every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLogoSpinning(true);
      const timer = setTimeout(() => {
        setIsLogoSpinning(false);
      }, 1300);
      return () => clearTimeout(timer);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Default displayed title
  let currentTitle = activeModuleName;
  if (!currentTitle) {
    if (selectedTrack === 'statistics') {
      currentTitle = language === 'tr' ? 'İstatistik' : 'Statistics';
    } else {
      currentTitle = language === 'tr' ? 'Olasılık' : 'Probability';
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-4 py-2.5 sm:py-3 font-sans shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          {/* TanCoreLab Brand Logo & Dynamic Course Title Switcher */}
          <div className="relative flex items-center space-x-1.5 sm:space-x-3 min-w-0 shrink" ref={dropdownRef}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onGoHome?.();
              }}
              className="flex items-center space-x-1.5 sm:space-x-2.5 group cursor-pointer shrink-0"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ff7a00] flex items-center justify-center shadow-md shadow-[#ff7a00]/30 group-hover:scale-105 transition-transform p-0.5 sm:p-1 ${
                  isLogoSpinning ? 'animate-logo-spin' : ''
                }`}
              >
                <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white stroke-[1.75]" />
                </div>
              </div>

              <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                TanCoreLab
              </span>
            </a>

            {/* Course Track Dropdown Trigger (Non-bold text) */}
            <div className="flex items-center space-x-0.5 min-w-0">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-0.5 sm:space-x-1 text-xs sm:text-base font-medium text-[#ff7a00] hover:bg-orange-50 px-1 sm:px-2 py-0.5 rounded-xl transition-all border border-transparent hover:border-orange-200 group min-w-0"
              >
                <span className="whitespace-nowrap leading-snug">
                  {currentTitle}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff7a00] shrink-0 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Course Track Switcher Dropdown Popover */}
            {isDropdownOpen && (
              <div className="absolute top-12 left-0 z-50 w-72 sm:w-80 bg-white border border-slate-200 rounded-3xl p-3 shadow-2xl animate-fade-in font-sans">
                <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#ff7a00] tracking-widest font-mono">
                    {language === 'tr' ? 'DERS SEÇİMİ' : 'SELECT COURSE'}
                  </span>
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div className="space-y-1.5 p-1">
                  {/* Option 1: Olasılık */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onSelectTrack?.('probability');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors text-left text-sm font-black ${
                      selectedTrack === 'probability' && !activeModuleName
                        ? 'bg-[#ff7a00] text-white shadow-xs'
                        : 'hover:bg-orange-50 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Dices className={`w-4 h-4 ${selectedTrack === 'probability' && !activeModuleName ? 'text-white' : 'text-[#ff7a00]'}`} />
                      <span>{language === 'tr' ? 'Olasılık' : 'Probability'}</span>
                    </div>
                    {selectedTrack === 'probability' && !activeModuleName && <Check className="w-4 h-4 text-white" />}
                  </button>

                  {/* Option 2: İstatistik */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onSelectTrack?.('statistics');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors text-left text-xs font-black ${
                      selectedTrack === 'statistics' && !activeModuleName
                        ? 'bg-[#ff7a00] text-white shadow-xs'
                        : 'hover:bg-orange-50 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <BarChart3 className={`w-4 h-4 ${selectedTrack === 'statistics' && !activeModuleName ? 'text-white' : 'text-[#ff7a00]'}`} />
                      <span>{language === 'tr' ? 'İstatistik' : 'Statistics'}</span>
                    </div>
                    {selectedTrack === 'statistics' && !activeModuleName && <Check className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Stats & Controls: Streak, Language and Profile */}
          <div className="flex items-center space-x-1 sm:space-x-2.5 shrink-0">
            {/* Streak */}
            <div className="flex items-center space-x-1 bg-[#ff7a00]/10 border border-[#ff7a00]/30 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[#ff7a00] font-extrabold text-[10px] sm:text-xs tracking-wide shadow-xs">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#ff7a00] text-[#ff7a00] animate-pulse" />
              <span>
                {streak} {language === 'tr' ? 'gün' : 'days'}
              </span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-0.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 border border-[#ff7a00]/30 text-[#ff7a00] font-extrabold text-[10px] sm:text-xs transition-colors"
            >
              <Globe className="w-3 h-3 stroke-[2]" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* My Profile Button */}
            <button
              onClick={() => setShowProfile(true)}
              className="p-1 sm:p-2 rounded-xl bg-[#ff7a00]/15 hover:bg-[#ff7a00]/25 text-[#ff7a00] border border-[#ff7a00]/40 transition-colors shadow-xs flex items-center justify-center"
              title={language === 'tr' ? 'Profilim & Performansım' : 'My Profile'}
            >
              <User className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[1.75]" />
            </button>
          </div>
        </div>
      </header>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
};
