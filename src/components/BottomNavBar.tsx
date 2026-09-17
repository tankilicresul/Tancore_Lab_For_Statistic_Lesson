import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Home, Trophy, UserCheck } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface BottomNavBarProps {
  currentView: string;
  onGoHome: () => void;
  onOpenProfile: (openLeaderboard?: boolean) => void;
  onOpenAuth: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentView,
  onGoHome,
  onOpenProfile,
  onOpenAuth,
}) => {
  const { language, isAuthenticated, isVerified, userProfile } = useAppStore();

  const isHomeActive = currentView === 'home';
  const isProfileActive = currentView === 'profile';

  return (
    <nav
      aria-label="Mobil ve Alt Navigasyon Çubuğu"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-3 sm:px-6 py-1.5 sm:py-2 pb-[calc(0.4rem+env(safe-area-inset-bottom))] font-sans transition-all duration-300"
    >
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* 1. Ana Sayfa (Home) Button */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl transition-all cursor-pointer group active:scale-95 ${
            isHomeActive
              ? 'text-[#ff7a00] font-black'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          title={language === 'tr' ? 'Ana Sayfa' : 'Home'}
        >
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${
              isHomeActive
                ? 'bg-[#ff7a00]/15 text-[#ff7a00] scale-105 shadow-xs'
                : 'group-hover:bg-slate-100 text-slate-500'
            }`}
          >
            <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-bold">
            {language === 'tr' ? 'Ana Sayfa' : 'Home'}
          </span>
        </button>

        {/* 2. Genel Skor Tablosu (Leaderboard) Button */}
        <button
          onClick={() => onOpenProfile(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl transition-all cursor-pointer group active:scale-95 text-slate-500 hover:text-amber-600 font-medium"
          title={language === 'tr' ? 'Genel Skor Tablosu & Liderlik' : 'Leaderboard'}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-amber-500/15 text-amber-500 group-hover:scale-105">
            <Trophy className="w-5 h-5 stroke-[2.25] text-amber-500 fill-amber-400/20" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-bold text-slate-700 group-hover:text-amber-600">
            {language === 'tr' ? 'Skor Tablosu' : 'Leaderboard'}
          </span>
        </button>

        {/* 3. Profilim (My Profile) Button */}
        {!isAuthenticated || !isVerified ? (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl transition-all cursor-pointer group active:scale-95 text-slate-500 hover:text-[#ff7a00] font-medium"
            title={language === 'tr' ? 'Giriş Yap / Kayıt Ol' : 'Sign In / Sign Up'}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-[#ff7a00]/15 text-[#ff7a00] group-hover:scale-105">
              <UserCheck className="w-5 h-5 stroke-[2.25]" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight font-bold text-slate-700 group-hover:text-[#ff7a00]">
              {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => onOpenProfile(false)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl transition-all cursor-pointer group active:scale-95 ${
              isProfileActive
                ? 'text-[#ff7a00] font-black'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
            title={language === 'tr' ? 'Profilim & Başarılar' : 'My Profile'}
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center p-0.5 transition-all ${
                isProfileActive
                  ? 'ring-2 ring-[#ff7a00] bg-[#ff7a00]/15 scale-105 shadow-xs'
                  : 'group-hover:bg-slate-100'
              }`}
            >
              <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                <UserAvatar
                  avatarUrl={userProfile?.avatarUrl}
                  avatarEmoji={userProfile?.avatarEmoji || '👨‍🎓'}
                  fullName={userProfile?.fullName}
                  size="sm"
                  className="w-full h-full"
                />
              </div>
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight font-bold">
              {language === 'tr' ? 'Profilim' : 'Profile'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
