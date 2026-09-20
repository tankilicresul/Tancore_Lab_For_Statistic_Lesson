import React, { useState, useEffect, useRef } from 'react';
import { useAppStore, computeContiguousStreak } from '../store/useAppStore';
import { Flame, Globe, Zap, Crown, Check } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { PublicProfileModal } from './PublicProfileModal';
import { StreakModal } from './StreakModal';
import { soundService } from '../services/soundService';

interface XpStreakBarProps {
  onGoHome?: () => void;
  onOpenProfile?: () => void;
  currentView?: string;
  activeModuleName?: string;
}

export const XpStreakBar: React.FC<XpStreakBarProps> = ({
  onGoHome,
}) => {
  const {
    language,
    setLanguage,
    streak,
    activityDates,
    xp,
    isAuthenticated,
    isVerified,
    userProfile,
    selectedPublicProfile,
    setSelectedPublicProfile,
  } = useAppStore();

  const [showAuth, setShowAuth] = useState(false);
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isLanguagePopoverOpen, setIsLanguagePopoverOpen] = useState(false);

  // XP float-up dopamine animation
  const [xpDelta, setXpDelta] = useState<number | null>(null);
  const [showXpFloat, setShowXpFloat] = useState(false);
  const prevXpRef = useRef<number | null>(null);

  const langRef = useRef<HTMLDivElement>(null);
  const displayStreak = Math.max(computeContiguousStreak(activityDates), streak || 1);
  const currentXp = xp ?? 0;

  // Detect XP increases and fire float-up animation
  useEffect(() => {
    if (prevXpRef.current !== null && currentXp > prevXpRef.current) {
      const delta = currentXp - prevXpRef.current;
      setXpDelta(delta);
      setShowXpFloat(true);
      soundService.playXpFloat();
      const timer = setTimeout(() => setShowXpFloat(false), 1500);
      return () => clearTimeout(timer);
    }
    prevXpRef.current = currentXp;
  }, [currentXp]);

  // Close language popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLanguagePopoverOpen(false);
      }
    };
    if (isLanguagePopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguagePopoverOpen]);

  // Single subtle spin on mount, plus spin on hover
  useEffect(() => {
    setIsLogoSpinning(true);
    const timer = setTimeout(() => {
      setIsLogoSpinning(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-2.5 sm:py-3.5 font-sans shadow-xs">
        <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 flex items-center justify-between relative">
          {/* TancoreLab Brand Logo */}
          <a
            href="/"
            title="TanCoreLab Ana Sayfası"
            aria-label="TanCoreLab Ana Sayfasına Dön"
            onClick={(e) => {
              e.preventDefault();
              onGoHome?.();
            }}
            onMouseEnter={() => setIsLogoSpinning(true)}
            onAnimationEnd={() => setIsLogoSpinning(false)}
            className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer shrink-0 z-10"
          >
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#ff7a00] flex items-center justify-center shadow-md shadow-[#ff7a00]/30 group-hover:scale-105 transition-transform p-0.5 sm:p-1">
              <div
                className={`w-full h-full rounded-full border border-white sm:border-2 flex items-center justify-center ${
                  isLogoSpinning ? 'animate-logo-spin' : ''
                }`}
              >
                <Zap className="w-4 h-4 sm:w-5.5 sm:h-5.5 text-white fill-white stroke-[2]" />
              </div>
            </div>

            <span className="text-base sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              TanCoreLab
            </span>
          </a>

          {/* User Stats & Controls: Streak, Language and Profile / Home Icon */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 z-10">
            {/* Streak Button - Click opens Streak Modal */}
            <div className="relative">
              {/* XP Float-up animation — fires when XP increases */}
              {showXpFloat && xpDelta !== null && (
                <span
                  key={currentXp}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] font-black text-emerald-600 whitespace-nowrap animate-xp-float z-50 pointer-events-none"
                >
                  +{xpDelta} XP
                </span>
              )}
              <button
                onClick={() => {
                  soundService.playModalOpen();
                  setIsLanguagePopoverOpen(false);
                  setIsStreakModalOpen(true);
                }}
                className="flex items-center space-x-1 sm:space-x-1.5 bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 border border-[#ff7a00]/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[#ff7a00] font-black text-xs sm:text-sm tracking-wide shadow-xs cursor-pointer transition-colors btn-press"
                title={language === 'tr' ? 'Seri Durumunu Gör' : 'View Streak Status'}
              >
                <Flame className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 fill-[#ff7a00] text-[#ff7a00] animate-pulse" />
                <span>
                  {displayStreak} <span className="hidden min-[420px]:inline">{language === 'tr' ? 'gün' : 'days'}</span>
                </span>
              </button>
            </div>

            {/* Language Switcher Popover Tab */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => {
                  soundService.playBtnPress();
                  setIsLanguagePopoverOpen((prev) => !prev);
                }}
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  isLanguagePopoverOpen
                    ? 'bg-[#ff7a00] text-white border-[#ff7a00] shadow-md shadow-[#ff7a00]/25'
                    : 'bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 active:scale-95 border-[#ff7a00]/30 text-[#ff7a00]'
                }`}
                title={language === 'tr' ? 'Dili Değiştir' : 'Change Language'}
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.25]" />
                <span>{language.toUpperCase()}</span>
              </button>

              {/* Language Selection Tab / Dropdown */}
              {isLanguagePopoverOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl p-2 shadow-2xl border border-slate-200/90 z-50 animate-scale-up font-sans">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                    {language === 'tr' ? 'Dil Seçimi' : 'Language'}
                  </div>

                  {/* Turkish Option */}
                  <button
                    onClick={() => {
                      soundService.playBtnPress();
                      setLanguage('tr');
                      setIsLanguagePopoverOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      language === 'tr'
                        ? 'bg-orange-50 text-[#ff7a00] font-black shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base leading-none">🇹🇷</span>
                      <span>Türkçe</span>
                    </div>
                    {language === 'tr' && <Check className="w-4 h-4 text-[#ff7a00] stroke-[2.5]" />}
                  </button>

                  {/* English Option */}
                  <button
                    onClick={() => {
                      soundService.playBtnPress();
                      setLanguage('en');
                      setIsLanguagePopoverOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-orange-50 text-[#ff7a00] font-black shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base leading-none">🇬🇧</span>
                      <span>English</span>
                    </div>
                    {language === 'en' && <Check className="w-4 h-4 text-[#ff7a00] stroke-[2.5]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Streak Details Modal (Photo 2 Duolingo Style with Cool Sunglasses Tanco) */}
      {isStreakModalOpen && (
        <StreakModal onClose={() => setIsStreakModalOpen(false)} />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {selectedPublicProfile && (
        <PublicProfileModal
          profile={selectedPublicProfile}
          onClose={() => setSelectedPublicProfile(null)}
        />
      )}
    </>
  );
};
