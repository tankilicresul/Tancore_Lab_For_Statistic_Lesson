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
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 text-center border border-slate-100 animate-modal-enter">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-20"
          title={isTr ? 'Kapat' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tanco Speech Bubble Orange Header Card (2. Fotoğraf Tasarımı) */}
        <div className="relative bg-gradient-to-br from-amber-400 via-[#ff7a00] to-[#f25900] rounded-3xl p-4 text-left shadow-lg overflow-hidden mb-4 border border-amber-300/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {/* White Speech Bubble Container */}
          <div className="relative bg-white rounded-2xl p-3.5 text-slate-900 shadow-md mb-3">
            <h3 className="font-black text-xs sm:text-sm text-slate-900 leading-snug mb-1">
              {isTr ? 'Uygulamayı sevdin sanırım :)' : 'Looks like you enjoy the app :)'}
            </h3>
            <p className="text-[11.5px] sm:text-xs text-slate-600 font-medium leading-relaxed">
              {isTr
                ? 'Ücretsiz bir hesap oluşturarak ilerlemeni kaydedebilir, Tanco ile soru çözebilir ve tüm modüllere erişebilirsin.'
                : 'Create a free account to save your progress, ask Tanco for help, and unlock all learning modules.'}
            </p>

            {/* Speech Bubble Arrow Tail */}
            <div className="absolute -bottom-1.5 left-5 w-3.5 h-3.5 bg-white transform rotate-45 rounded-xs" />
          </div>

          {/* Tanco Mascot Avatar & Title */}
          <div className="flex items-center space-x-2.5 pt-1 pl-1 relative z-10">
            <TanCoreMascotAvatar size="md" className="rounded-full ring-2 ring-white/90 shadow-md shrink-0" />
            <div className="flex flex-col text-white">
              <span className="text-xs font-black tracking-tight drop-shadow-xs">Tanco</span>
              <span className="text-[10px] font-bold text-amber-100">
                {isTr ? 'Öğretim Asistanı' : 'Teaching Assistant'}
              </span>
            </div>
          </div>
        </div>

        {/* Perks List */}
        <div className="flex flex-col items-center justify-center space-y-2 mb-4 text-center bg-slate-50/90 p-3.5 rounded-2xl border border-slate-100">
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
            <span key={i} className="text-xs text-slate-700 font-bold text-center leading-normal">
              {perk}
            </span>
          ))}
        </div>

        {/* Action Buttons: Önce Giriş Yap, Sonra KAYIT OL */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              setAuthInitialTab('login');
              setShowAuth(true);
            }}
            className="w-full py-3.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff7a00]/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>{isTr ? 'Giriş Yap' : 'Sign In'}</span>
          </button>
          <button
            onClick={() => {
              setAuthInitialTab('register');
              setShowAuth(true);
            }}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 border border-slate-200"
          >
            <UserPlus className="w-4 h-4 text-slate-700" />
            <span>{isTr ? 'KAYIT OL' : 'SIGN UP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};



