import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import { AuthModal } from './AuthModal';
import { LogIn, UserPlus, X } from 'lucide-react';

interface GuestGateModalProps {
  onClose: () => void;
}

export const GuestGateModal: React.FC<GuestGateModalProps> = ({ onClose }) => {
  const { language } = useAppStore();
  const [showAuth, setShowAuth] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('register');

  if (showAuth) {
    return (
      <AuthModal
        initialTab={authInitialTab}
        onClose={() => {
          setShowAuth(false);
          onClose();
        }}
        onSuccess={onClose}
      />
    );
  }

  const isTr = language === 'tr';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/35 backdrop-blur-xs animate-fade-in font-sans">
      <div
        className="hidden sm:block absolute inset-0 -z-10"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-7 text-center border border-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-10"
          title={isTr ? 'Kapat' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot Avatar & Title */}
        <div className="flex flex-col items-center pt-2">
          <div className="relative inline-block mb-1">
            <TanCoreMascotAvatar size="lg" className="rounded-full shadow-lg ring-4 ring-[#ff7a00]/15" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {isTr ? 'Profili Görüntülemek İçin Üye Ol !' : 'Sign Up to View Profile !'}
          </h2>
        </div>

        {/* Perks List */}
        <div className="flex flex-col items-center justify-center space-y-2.5 my-5 text-center bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
          {(isTr
            ? [
                '✅ İlerlemeniz sıfırlanmaz, hesabınıza aktarılır',
                '✅ 2. Modül ve tüm ileri düzey konular açılır',
                '✅ Tanco AI asistan ile sınırsız sohbet',
                '✅ XP, rozet ve liderlik tablosu',
              ]
            : [
                '✅ Progress is preserved & transferred to your account',
                '✅ Unlock Module 2 & all advanced courses',
                '✅ XP, badges & global leaderboard',
                '✅ Unlimited Tanco AI assistant',
              ]
          ).map((perk, i) => (
            <span key={i} className="text-xs sm:text-sm text-slate-700 font-bold text-center leading-normal">
              {perk}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setAuthInitialTab('register');
              setShowAuth(true);
            }}
            className="w-full py-3.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff7a00]/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isTr ? 'KAYIT OL' : 'SIGN UP'}</span>
          </button>
          <button
            onClick={() => {
              setAuthInitialTab('login');
              setShowAuth(true);
            }}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 border border-slate-200"
          >
            <LogIn className="w-4 h-4 text-slate-700" />
            <span>{isTr ? 'Giriş Yap' : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

