import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AuthModal } from './AuthModal';
import {
  X,
  Zap,
  Check,
  Bot,
  FileText,
  Briefcase,
  ShieldCheck,
  Lock,
  ArrowRight,
  Crown,
  UserCheck,
} from 'lucide-react';

export const PlusUpgradeModal: React.FC = () => {
  const {
    isPlusUpgradeModalOpen,
    setIsPlusUpgradeModalOpen,
    userProfile,
    isAuthenticated,
    isVerified,
    language,
    openLemonCheckout,
  } = useAppStore();

  const [showAuth, setShowAuth] = useState(false);

  if (!isPlusUpgradeModalOpen) return null;

  const isTr = language === 'tr';
  const isAlreadyPlus = Boolean(userProfile?.isPremium);
  const isUserLoggedIn = Boolean(isAuthenticated && isVerified && userProfile?.schoolEmail);

  const handleAction = () => {
    if (!isUserLoggedIn) {
      setShowAuth(true);
      return;
    }
    openLemonCheckout(userProfile?.schoolEmail || '');
  };

  const benefits = [
    {
      icon: <Zap className="w-4 h-4 text-amber-500 shrink-0" />,
      title: isTr ? 'Tüm İleri Düzey Modüller' : 'All Advanced Modules',
      sub: isTr ? '16 modül ve interaktif laboratuvarların tamamı açık' : 'Unlock all 16 interactive curriculum modules',
    },
    {
      icon: <Bot className="w-4 h-4 text-orange-500 shrink-0" />,
      title: isTr ? 'Sınırsız Tanco AI Soru Çözümü' : 'Unlimited Tanco AI Tutor',
      sub: isTr ? '7/24 adım adım formüllü soru ve ödev çözümü' : '24/7 step-by-step math & case problem solver',
    },
    {
      icon: <FileText className="w-4 h-4 text-blue-500 shrink-0" />,
      title: isTr ? 'Vize/Final Ders Notları & Formüller' : 'Exam Study Notes & PDF Sheets',
      sub: isTr ? 'Koç, İTÜ, Boğaziçi seviyesinde derlenmiş hazır özetler' : 'High-yield university exam cheat sheets',
    },
    {
      icon: <Briefcase className="w-4 h-4 text-emerald-500 shrink-0" />,
      title: isTr ? 'Gerçek Sektör Case Sınavları' : 'Real-World Case Study Exams',
      sub: isTr ? 'Şirket veri setleri ve teknik mülakat hazırlık soruları' : 'Real company datasets and technical practice',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn font-sans"
      onClick={() => setIsPlusUpgradeModalOpen(false)}
    >
      <div
        className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-gradient-to-br from-amber-400/25 to-orange-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsPlusUpgradeModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header Section */}
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              TanCoreLab Plus
            </h2>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              {isTr
                ? 'Mühendislik istatistiği ve olasılık derslerinde en yüksek başarı için ihtiyacın olan her şey.'
                : 'Everything you need to master university probability & statistics.'}
            </p>
          </div>

          {/* Active status if already subscribed */}
          {isAlreadyPlus && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-600 fill-amber-400 shrink-0" />
              <span>{isTr ? 'Aktif Plus Üyeliğiniz Bulunmaktadır 🎉' : 'Your Plus Subscription is Active! 🎉'}</span>
            </div>
          )}

          {/* Feature List (Compact, Clean Bullets) */}
          <div className="space-y-2.5 py-1">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 leading-none flex items-center gap-1.5">
                    <span>{item.title}</span>
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3] ml-auto shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing & Free Trial Card */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-slate-50/70 border border-amber-300/80 space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  {isTr ? '3 Günlük Deneme' : '3-Day Free Trial'}
                </span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">0 ₺</span>
                  <span className="text-xs text-slate-500 font-semibold">{isTr ? 'şimdi' : 'today'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isTr ? 'Sonrasında' : 'Then'}
                </span>
                <div className="flex items-baseline justify-end space-x-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">119 ₺</span>
                  <span className="text-xs text-slate-500 font-semibold">/ {isTr ? 'ay' : 'mo'}</span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            {isUserLoggedIn ? (
              <button
                onClick={handleAction}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-[#ff7a00] to-[#ff7a00] hover:from-amber-600 hover:to-[#e66e00] text-white font-bold text-sm shadow-md shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{isTr ? '3 Gün Ücretsiz Başla (0 ₺)' : 'Start 3-Day Free Trial (0 ₺)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAction}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-[#ff7a00] to-[#ff7a00] hover:from-amber-600 hover:to-[#e66e00] text-white font-bold text-sm shadow-md shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isTr ? 'Abonelik İçin Önce Giriş Yap / Kayıt Ol' : 'Sign In to Subscribe'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Reassurance Footer */}
          <div className="text-center space-y-1.5 pt-0.5">
            <p className="text-[11px] text-slate-500 leading-snug">
              {isTr
                ? 'Bugün kartından 0 ₺ çekilir. 3 gün içinde dilediğin an tek tıkla iptal edebilirsin.'
                : 'Charged 0 ₺ today. Cancel anytime within 3 days with one click.'}
            </p>

            <div className="flex items-center justify-center space-x-3 text-[10.5px] text-slate-400 font-medium pt-0.5">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                256-Bit SSL
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                Lemon Squeezy Güvencesi
              </span>
            </div>
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

