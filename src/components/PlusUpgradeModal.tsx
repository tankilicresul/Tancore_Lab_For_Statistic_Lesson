import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  Bot,
  FileText,
  Briefcase,
  ShieldCheck,
  Lock,
  ArrowRight,
  Crown,
} from 'lucide-react';

export const PlusUpgradeModal: React.FC = () => {
  const {
    isPlusUpgradeModalOpen,
    setIsPlusUpgradeModalOpen,
    userProfile,
    isAuthenticated,
    language,
    openLemonCheckout,
  } = useAppStore();

  const [inputEmail, setInputEmail] = useState(userProfile?.schoolEmail || '');

  if (!isPlusUpgradeModalOpen) return null;

  const isTr = language === 'tr';
  const isAlreadyPlus = Boolean(userProfile?.isPremium);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = userProfile?.schoolEmail || inputEmail.trim();
    openLemonCheckout(targetEmail);
  };

  const perks = [
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: isTr ? 'Tüm Modüllere Sınırsız Erişim' : 'Unlimited Access to All Modules',
      desc: isTr
        ? 'Olasılık, İstatistik ve Yöneylem konularındaki tüm ileri düzey derslerin kilidini anında açın.'
        : 'Unlock all advanced probability, statistics, and operations research lessons instantly.',
    },
    {
      icon: <Bot className="w-5 h-5 text-orange-500" />,
      title: isTr ? 'Tanco AI ile Sınırsız Soru Çözümü' : 'Unlimited Tanco AI Problem Solver',
      desc: isTr
        ? 'Takıldığınız vize, final ve ödev sorularını 7/24 adım adım formülleriyle birlikte çözdürün.'
        : 'Get 24/7 step-by-step formula explanations and exam problem solutions.',
    },
    {
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      title: isTr ? 'Vize/Final Ders Notları & Formül Kağıtları' : 'Exam Study Notes & Formula Sheets',
      desc: isTr
        ? 'Koç, İTÜ, ODTÜ ve Boğaziçi seviyesinde derlenmiş kapsamlı PDF ders notlarına tam erişim sağlayın.'
        : 'Access high-yield university exam summary notes and cheat sheets in PDF.',
    },
    {
      icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
      title: isTr ? 'Gerçek Sektör Case Sınavları' : 'Real-World Case Study Exams',
      desc: isTr
        ? 'Şirketlerin veri setleriyle hazırlanan gerçek vaka analizlerini ve mülakat sorularını çözün.'
        : 'Tackle real enterprise datasets, simulation cases, and technical interview questions.',
    },
    {
      icon: <Crown className="w-5 h-5 text-amber-400" />,
      title: isTr ? 'Profilde Altın PLUS Rozeti' : 'Golden PLUS Badge on Profile',
      desc: isTr
        ? 'Liderlik tablosunda ve herkese açık profilinizde parlayan özel VIP PLUS unvanı kazanın.'
        : 'Stand out on the live leaderboard with a shining VIP PLUS student badge.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn font-sans">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Banner */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-[#ff7a00] p-6 sm:p-8 text-white">
          <button
            onClick={() => setIsPlusUpgradeModalOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-amber-200" />
            <span>TanCoreLab VIP</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            TanCoreLab Plus <Crown className="w-7 h-7 text-amber-200 fill-amber-300 inline" />
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-lg font-medium">
            {isTr
              ? 'Mühendislik istatistiği, yöneylem ve veri analitiğinde dönem birincisi olmanız için ihtiyacınız olan tüm güç tek pakette.'
              : 'Supercharge your probability, statistics, and engineering coursework with full AI and curriculum access.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Status Alert if already Plus */}
          {isAlreadyPlus ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center space-x-3 text-amber-900">
              <Crown className="w-6 h-6 text-amber-600 fill-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">
                  {isTr ? 'Aktif TanCoreLab Plus Üyesisiniz! 🎉' : 'You are an Active TanCoreLab Plus Member! 🎉'}
                </p>
                <p className="text-xs text-amber-700">
                  {isTr
                    ? 'Tüm modüller ve Tanco AI sınırsız olarak hesabınıza tanımlıdır.'
                    : 'All modules, notes, and Tanco AI features are fully unlocked.'}
                </p>
              </div>
            </div>
          ) : null}

          {/* Perks Grid */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isTr ? 'Plus Üyeliğe Dahil Olanlar' : "What's Included in Plus"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 transition-all flex items-start space-x-3"
                >
                  <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">{perk.icon}</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{perk.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Box & CTA */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-50 border-2 border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">119 ₺</span>
                <span className="text-xs sm:text-sm font-bold text-slate-500">/ {isTr ? 'ay' : 'month'}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {isTr ? 'Öğrenci Dostu Fiyat' : 'Student Special'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {isTr ? 'İstediğin an tek tıkla iptal et' : 'Cancel anytime'}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-[#ff7a00] hover:from-amber-600 hover:to-[#e66e00] text-white font-black text-sm shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{isTr ? "119 ₺ ile Plus'a Geç" : 'Upgrade to Plus (119 ₺)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Güvenli Ödeme</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Lemon Squeezy Güvencesiyle</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Anında Otomatik Aktivasyon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
