import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Flame, Globe, Zap, Crown } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { PublicProfileModal } from './PublicProfileModal';

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
    toggleLanguage,
    streak,
    isAuthenticated,
    isVerified,
    userProfile,
    selectedPublicProfile,
    setSelectedPublicProfile,
    setIsPlusUpgradeModalOpen,
  } = useAppStore();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);

  const isPlus = Boolean(userProfile?.isPremium);

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 sm:py-3.5 font-sans shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between relative">
          {/* TancoreLab Brand Logo */}
          <a
            href="/"
            title="TanCoreLab Ana Sayfası"
            aria-label="TanCoreLab Ana Sayfasına Dön"
            onClick={(e) => {
              e.preventDefault();
              onGoHome?.();
            }}
            className="flex items-center space-x-2.5 sm:space-x-3 group cursor-pointer shrink-0 z-10"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#ff7a00] flex items-center justify-center shadow-md shadow-[#ff7a00]/30 group-hover:scale-105 transition-transform p-1">
              <div
                className={`w-full h-full rounded-full border-2 border-white flex items-center justify-center ${
                  isLogoSpinning ? 'animate-logo-spin' : ''
                }`}
              >
                <Zap className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white fill-white stroke-[2]" />
              </div>
            </div>

            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              TanCoreLab
            </span>
          </a>

          {/* User Stats & Controls: Streak, Language and Profile / Home Icon */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0 z-10">
            {/* Streak - 0 for unauthenticated guests, real count for logged in */}
            <div className="flex items-center space-x-1.5 bg-[#ff7a00]/10 border border-[#ff7a00]/30 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[#ff7a00] font-black text-xs sm:text-sm tracking-wide shadow-xs">
              <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-[#ff7a00] text-[#ff7a00] animate-pulse" />
              <span>
                {isAuthenticated && isVerified ? streak : 0} {language === 'tr' ? 'gün' : 'days'}
              </span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 border border-[#ff7a00]/30 text-[#ff7a00] font-black text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.25]" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Plus Upgrade or VIP Badge - ONLY shown for logged-in & verified students */}
            {isAuthenticated && isVerified && (
              isPlus ? (
                <button
                  onClick={() => setIsPlusUpgradeModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-400/80 text-amber-600 font-bold text-xs sm:text-sm tracking-wide shadow-xs cursor-pointer hover:scale-105 transition-transform"
                  title="TanCoreLab Plus Üyeliği Aktif"
                >
                  <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400" />
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-black">
                    PLUS
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setIsPlusUpgradeModalOpen(true)}
                  className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-[#ff7a00] hover:from-amber-600 hover:to-[#e66e00] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 cursor-pointer"
                  title={language === 'tr' ? "TanCoreLab Plus'a Yükselt (3 Gün Ücretsiz)" : 'Upgrade to Plus (3 Days Free)'}
                >
                  <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-200 text-white animate-pulse" />
                  <span>Plus</span>
                </button>
              )
            )}
          </div>
        </div>
      </header>

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
