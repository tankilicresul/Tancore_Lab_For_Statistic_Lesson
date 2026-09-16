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

  if (showAuth) {
    return (
      <AuthModal
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div
        className="hidden sm:block absolute inset-0 -z-10"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-amber-400 via-[#ff7a00] to-[#f25900] px-6 pt-8 pb-10 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-10">
            <X className="w-4 h-4" />
          </button>
          <div className="relative inline-block mb-3">
            <TanCoreMascotAvatar size="lg" className="rounded-full shadow-xl border-4 border-white/60" />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-xs animate-pulse" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug relative z-10">
            {isTr ? '2. Modüle Geçmek İçin Üye Ol! 🎓' : 'Sign Up to Unlock Module 2! 🎓'}
          </h2>
          <p className="mt-1.5 text-white/90 text-xs sm:text-sm font-medium leading-relaxed relative z-10 px-2">
            {isTr
              ? "İlk modülü başarıyla deneyimledin. Tüm ilerlemen cihazında saklandı! 2. Modüle ve sonraki tüm konulara devam etmek için ücretsiz kayıt ol veya giriş yap."
              : 'You explored the first module. Your progress is saved on your device! Sign up free or log in to unlock Module 2 and beyond.'}
          </p>
        </div>

        <div className="bg-white px-5 pb-6 pt-4 space-y-3">
          <div className="flex flex-col space-y-1.5 mb-2">
            {(isTr
              ? ['✅ İlerlemeniz sıfırlanmaz, hesabınıza aktarılır', '✅ 2. Modül ve tüm ileri düzey konular açılır', '✅ XP, rozet ve liderlik tablosu', '✅ Tanco AI asistan ile sınırsız sohbet']
              : ['✅ Progress is preserved & transferred to your account', '✅ Unlock Module 2 & all advanced courses', '✅ XP, badges & global leaderboard', '✅ Unlimited Tanco AI assistant']
            ).map((perk, i) => (
              <span key={i} className="text-xs text-slate-700 font-semibold">{perk}</span>
            ))}
          </div>
          <button
            onClick={() => setShowAuth(true)}
            className="w-full py-3.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff7a00]/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isTr ? 'Ücretsiz Kayıt Ol' : 'Sign Up Free'}</span>
          </button>
          <button
            onClick={() => setShowAuth(true)}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 border border-slate-200"
          >
            <LogIn className="w-4 h-4" />
            <span>{isTr ? 'Zaten Hesabım Var — Giriş Yap' : 'I Have an Account — Sign In'}</span>
          </button>
          <button onClick={onClose} className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors cursor-pointer">
            {isTr ? 'Şimdi değil' : 'Not now'}
          </button>
        </div>
      </div>
    </div>
  );
};
