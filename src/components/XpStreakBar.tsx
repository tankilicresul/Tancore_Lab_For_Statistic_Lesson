import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Flame, Globe, Zap, UserCheck, ShieldCheck, Home } from 'lucide-react';
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
  onOpenProfile,
  currentView = 'home',
}) => {
  const { language, toggleLanguage, streak, isAuthenticated, isVerified, userProfile, selectedPublicProfile, setSelectedPublicProfile } = useAppStore();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);

  const isProfileView = currentView === 'profile';

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
          {/* TanCoreLab Brand Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onGoHome?.();
            }}
            className="flex items-center space-x-2 sm:space-x-2.5 group cursor-pointer shrink-0 z-10"
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ff7a00] flex items-center justify-center shadow-md shadow-[#ff7a00]/30 group-hover:scale-105 transition-transform p-1 ${
                isLogoSpinning ? 'animate-logo-spin' : ''
              }`}
            >
              <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white fill-white stroke-[2]" />
              </div>
            </div>

            <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight font-sans">
              TanCoreLab
            </span>
          </a>

          {/* User Stats & Controls: Streak, Language and Profile / Home Icon */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0 z-10">
            {/* Streak */}
            <div className="flex items-center space-x-1.5 bg-[#ff7a00]/10 border border-[#ff7a00]/30 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[#ff7a00] font-black text-xs sm:text-sm tracking-wide shadow-xs">
              <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-[#ff7a00] text-[#ff7a00] animate-pulse" />
              <span>
                {streak} {language === 'tr' ? 'gün' : 'days'}
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

            {/* Registration / Auth Button or My Profile / Home Icon Button */}
            {!isAuthenticated || !isVerified ? (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs sm:text-sm font-black transition-all shadow-xs cursor-pointer"
                title={language === 'tr' ? 'E-posta ile Kayıt Ol / Giriş Yap' : 'Sign Up / Sign In'}
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'tr' ? 'Kayıt Ol' : 'Sign Up'}</span>
              </button>
            ) : isProfileView ? (
              /* When Profile is Open: Rightmost Button becomes Home Icon (🏠 Ev İkonu) */
              <button
                onClick={onGoHome}
                className="p-2 sm:p-2.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white transition-all shadow-md shadow-[#ff7a00]/30 flex items-center justify-center cursor-pointer"
                title={language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
              >
                <Home className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.25]" />
              </button>
            ) : (
              /* When Profile is Closed: Rightmost Button shows Profile Avatar */
              <button
                onClick={onOpenProfile}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-[#ff7a00]/15 hover:bg-[#ff7a00]/25 text-[#ff7a00] border border-[#ff7a00]/40 transition-colors shadow-xs flex items-center justify-center space-x-1.5 font-black text-xs sm:text-sm cursor-pointer"
                title={language === 'tr' ? 'Profilim & Performansım' : 'My Profile'}
              >
                <span className="text-lg sm:text-xl leading-none">{userProfile?.avatarEmoji || '👨‍🎓'}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600 hidden sm:inline" />
              </button>
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
