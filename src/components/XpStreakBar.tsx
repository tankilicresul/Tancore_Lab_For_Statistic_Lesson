import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Flame, Globe, Zap, UserCheck, ShieldCheck, Home } from 'lucide-react';
import { ProfileModal } from './ProfileModal';
import { AuthModal } from './AuthModal';
import { PublicProfileModal } from './PublicProfileModal';

interface XpStreakBarProps {
  onGoHome?: () => void;
  activeModuleName?: string;
}

export const XpStreakBar: React.FC<XpStreakBarProps> = ({
  onGoHome,
}) => {
  const { language, toggleLanguage, streak, isAuthenticated, isVerified, userProfile, selectedPublicProfile, setSelectedPublicProfile } = useAppStore();
  const [showProfile, setShowProfile] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 py-2.5 sm:py-3 font-sans shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between relative">
          {/* TanCoreLab Brand Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowProfile(false);
              onGoHome?.();
            }}
            className="flex items-center space-x-1.5 sm:space-x-2 group cursor-pointer shrink-0 z-10"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ff7a00] flex items-center justify-center shadow-md shadow-[#ff7a00]/25 group-hover:scale-105 transition-transform p-0.5 sm:p-1 ${
                isLogoSpinning ? 'animate-logo-spin' : ''
              }`}
            >
              <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white stroke-[1.75]" />
              </div>
            </div>

            <span className="text-xs sm:text-base font-black text-slate-900 tracking-tight font-sans">
              TanCoreLab
            </span>
          </a>

          {/* User Stats & Controls: Streak, Language and Profile / Home Icon */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 z-10">
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
              className="flex items-center space-x-0.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 border border-[#ff7a00]/30 text-[#ff7a00] font-extrabold text-[10px] sm:text-xs transition-colors cursor-pointer"
            >
              <Globe className="w-3 h-3 stroke-[2]" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Registration / Auth Button or My Profile / Home Icon Button */}
            {!isAuthenticated || !isVerified ? (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black transition-all shadow-xs cursor-pointer"
                title={language === 'tr' ? 'E-posta ile Kayıt Ol / Giriş Yap' : 'Sign Up / Sign In'}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'tr' ? 'Kayıt Ol' : 'Sign Up'}</span>
              </button>
            ) : showProfile ? (
              /* When Profile is Open: Rightmost Button becomes Home Icon (🏠 Ev İkonu) */
              <button
                onClick={() => setShowProfile(false)}
                className="p-1.5 sm:p-2 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white transition-all shadow-md shadow-[#ff7a00]/30 flex items-center justify-center cursor-pointer"
                title={language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
              >
                <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.25]" />
              </button>
            ) : (
              /* When Profile is Closed: Rightmost Button shows Profile Avatar */
              <button
                onClick={() => setShowProfile(true)}
                className="p-1 sm:p-1.5 rounded-xl bg-[#ff7a00]/15 hover:bg-[#ff7a00]/25 text-[#ff7a00] border border-[#ff7a00]/40 transition-colors shadow-xs flex items-center justify-center space-x-1 font-bold text-xs cursor-pointer"
                title={language === 'tr' ? 'Profilim & Performansım' : 'My Profile'}
              >
                <span className="text-base leading-none">{userProfile?.avatarEmoji || '👨‍🎓'}</span>
                <ShieldCheck className="w-3 h-3 text-emerald-600 hidden sm:inline" />
              </button>
            )}
          </div>
        </div>
      </header>

      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
          onOpenAuth={() => setShowAuth(true)}
        />
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
