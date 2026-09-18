import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Home, Trophy, UserCheck } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { soundService } from '../services/soundService';

interface BottomNavBarProps {
  currentView: string;
  onGoHome: () => void;
  onOpenLeaderboard: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentView,
  onGoHome,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenAuth,
}) => {
  const { language, isAuthenticated, isVerified, userProfile } = useAppStore();

  const isHomeActive = currentView === 'home';
  const isLeaderboardActive = currentView === 'leaderboard';
  const isProfileActive = currentView === 'profile';

  return (
    <nav
      aria-label="Mobil ve Alt Navigasyon Çubuğu"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-3 sm:px-6 py-1.5 sm:py-2 pb-[calc(0.4rem+env(safe-area-inset-bottom))] font-sans"
    >
      <div className="max-w-md mx-auto flex items-center justify-around relative">

        {/* 1. Ana Sayfa */}
        <button
          onClick={() => {
            soundService.playNavSwitch();
            onGoHome();
          }}
          className="flex flex-col items-center justify-center flex-1 py-1 px-2 cursor-pointer group btn-press"
          title={language === 'tr' ? 'Ana Sayfa' : 'Home'}
        >
          <div className={`w-12 h-8 rounded-2xl flex items-center justify-center transition-all duration-200 ${isHomeActive ? 'bg-[#ff7a00]/15 scale-110' : 'group-hover:bg-slate-100 group-hover:scale-105'}`}>
            <Home className={`transition-all duration-200 ${isHomeActive ? 'w-5 h-5 stroke-[2.5] text-[#ff7a00]' : 'w-5 h-5 stroke-[2] text-slate-500 group-hover:text-slate-800'}`} />
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight transition-all duration-200 ${isHomeActive ? 'font-black text-[#ff7a00]' : 'font-medium text-slate-500 group-hover:text-slate-800'}`}>
            {language === 'tr' ? 'Ana Sayfa' : 'Home'}
          </span>
        </button>

        {/* 2. Skor Tablosu */}
        <button
          onClick={() => {
            soundService.playNavSwitch();
            onOpenLeaderboard();
          }}
          className="flex flex-col items-center justify-center flex-1 py-1 px-2 cursor-pointer group btn-press"
          title={language === 'tr' ? 'Skor Tablosu' : 'Leaderboard'}
        >
          <div className={`w-12 h-8 rounded-2xl flex items-center justify-center transition-all duration-200 ${isLeaderboardActive ? 'bg-amber-400/20 scale-110' : 'group-hover:bg-amber-400/10 group-hover:scale-105'}`}>
            <Trophy className={`transition-all duration-200 ${isLeaderboardActive ? 'w-5 h-5 stroke-[2.5] text-amber-500 fill-amber-400/30' : 'w-5 h-5 stroke-[2] text-amber-400 group-hover:text-amber-500'}`} />
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight transition-all duration-200 ${isLeaderboardActive ? 'font-black text-amber-500' : 'font-medium text-slate-500 group-hover:text-amber-600'}`}>
            {language === 'tr' ? 'Skor Tablosu' : 'Leaderboard'}
          </span>
        </button>

        {/* 3. Profil / Giriş */}
        {!isAuthenticated || !isVerified ? (
          <button
            onClick={() => {
              soundService.playModalOpen();
              onOpenAuth();
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 px-2 cursor-pointer group btn-press"
            title={language === 'tr' ? 'Giriş Yap / Kayıt Ol' : 'Sign In / Sign Up'}
          >
            <div className="w-12 h-8 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:bg-[#ff7a00]/10 group-hover:scale-105">
              <UserCheck className="w-5 h-5 stroke-[2.25] text-[#ff7a00]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium text-slate-500 group-hover:text-[#ff7a00] transition-colors duration-200">
              {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              soundService.playNavSwitch();
              onOpenProfile();
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 px-2 cursor-pointer group btn-press"
            title={language === 'tr' ? 'Profilim & Başarılar' : 'My Profile'}
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center p-0.5 transition-all duration-200 ${isProfileActive ? 'ring-2 ring-[#ff7a00] bg-[#ff7a00]/15 scale-110' : 'ring-1 ring-slate-200 group-hover:ring-[#ff7a00]/40 group-hover:scale-105'}`}>
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
            <span className={`text-[10px] mt-0.5 tracking-tight transition-all duration-200 ${isProfileActive ? 'font-black text-[#ff7a00]' : 'font-medium text-slate-500 group-hover:text-slate-800'}`}>
              {language === 'tr' ? 'Profilim' : 'Profile'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
