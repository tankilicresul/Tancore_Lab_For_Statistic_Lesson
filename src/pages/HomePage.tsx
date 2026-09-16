import React, { useState, useEffect } from 'react';
import { ALL_MODULES } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import { getLocalized } from '../utils/localization';
import { TanCoreMascotAvatar } from '../components/TanCoreMascotAvatar';
import {
  BookOpen,
  Zap,
  Dices,
  BarChart3,
  Trophy,
  Flame,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface HomePageProps {
  onSelectTrack: (track: 'probability' | 'statistics') => void;
  onStartPlacementTest: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTrack,
  onStartPlacementTest,
}) => {
  const {
    language,
    xp,
    streak,
    userProfile,
    completedLessons,
    completedCaseExams,
  } = useAppStore();

  const [isBtnLogoSpinning, setIsBtnLogoSpinning] = useState(false);

  // Periodic logo spin animation every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBtnLogoSpinning(true);
      const timer = setTimeout(() => {
        setIsBtnLogoSpinning(false);
      }, 1300);
      return () => clearTimeout(timer);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Derive dynamic student greeting name from registered fullName
  const cleanName = (userProfile?.fullName || '').replace(/Resul\s*(Tan\s*Kılıç)?(\s*\(Admin\))?/gi, '').trim();
  const studentDisplayName = cleanName
    ? cleanName.split(' ')[0]
    : (language === 'tr' ? 'Öğrenci' : 'Student');

  const totalLessons = ALL_MODULES.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const totalCases = ALL_MODULES.reduce((acc, m) => acc + (m.caseExams?.length || 0), 0);
  const totalItems = totalLessons + totalCases;
  const completedCount = completedLessons.length + completedCaseExams.length;

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 font-sans overflow-x-hidden animate-fade-in space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <TanCoreMascotAvatar size="lg" className="shadow-md shadow-[#ff7a00]/20 hover:scale-105 transition-transform shrink-0" />
          <div className="flex flex-col items-start space-y-1.5 min-w-0">
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-none">
              <span>{language === 'tr' ? `Selam ${studentDisplayName}!` : `Hi ${studentDisplayName}!`}</span>
            </h1>

            {/* Placement Test CTA */}
            <button
              onClick={onStartPlacementTest}
              onMouseEnter={() => {
                setIsBtnLogoSpinning(true);
                setTimeout(() => setIsBtnLogoSpinning(false), 1300);
              }}
              className="flex items-center justify-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-[9.5px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all shadow-xs shadow-[#ff7a00]/25 group shrink-0 whitespace-nowrap cursor-pointer"
            >
              <div
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xs shrink-0 group-hover:scale-105 transition-transform ${
                  isBtnLogoSpinning ? 'animate-logo-spin' : ''
                }`}
              >
                <div className="w-full h-full rounded-full bg-[#ff7a00] flex items-center justify-center border border-white">
                  <Zap className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white fill-white stroke-[1.75]" />
                </div>
              </div>
              <span className="whitespace-nowrap">
                {language === 'tr'
                  ? 'Seviyeni Belirle'
                  : 'Placement Test'}
              </span>
            </button>
          </div>
        </div>

        {/* Speech Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4.5 space-y-2 text-[11px] sm:text-xs text-slate-700 leading-relaxed shadow-2xs relative">
          <p>
            {language === 'tr' ? (
              <>
                TancoreLab istatistik ve olasılık platformuna hoş geldin! Toplam <strong className="text-[#ff7a00] font-black">{xp} XP</strong> topladın. 🎯
              </>
            ) : (
              <>
                Welcome to TancoreLab! You have earned <strong className="text-[#ff7a00] font-black">{xp} XP</strong> total. 🎯
              </>
            )}
          </p>
          <p className="pt-1.5 border-t border-slate-200/60 text-[10.5px] sm:text-xs text-slate-600 font-medium">
            {language === 'tr'
              ? 'Aşağıdaki modül kartlarından birine tıklayarak ders akışına gidebilirsin.'
              : 'Click any of the course cards below to open the interactive learning path.'}
          </p>
        </div>
      </div>

      {/* Course Track Selection Section (Öğrenmek İstediğin Alanı Seç) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4 px-1">
          <BookOpen className="w-4.5 h-4.5 text-[#ff7a00]" />
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
            {language === 'tr' ? 'Öğrenmek İstediğin Alanı Seç' : 'Select Learning Track'}
          </h2>
        </div>

        {/* 2 Square Course Cards in 1 Row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: Olasılık */}
          <button
            onClick={() => onSelectTrack('probability')}
            className="group relative p-3.5 sm:p-5 rounded-3xl border border-orange-200/90 hover:border-[#ff7a00] bg-gradient-to-b from-orange-50/70 via-white to-orange-50/30 hover:from-orange-50 hover:to-orange-100/60 transition-all duration-300 text-left flex flex-col justify-between aspect-square cursor-pointer overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#ff7a00]/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

            {/* Top row: Icon & Status Badge */}
            <div className="flex items-start justify-between w-full relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#ff7a00] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-[#ff7a00]/25">
                <Dices className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-[#ff7a00] font-mono shrink-0 border border-orange-200/80">
                {language === 'tr' ? '8 Modül' : '8 Modules'}
              </span>
            </div>

            {/* Bottom text: Title & Subtitle / CTA */}
            <div className="relative z-10 mt-auto pt-2">
              <h3 className="text-sm sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-[#ff7a00] transition-colors leading-snug">
                {language === 'tr' ? 'Olasılık' : 'Probability'}
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                {language === 'tr' ? 'Temeller, Bayes, Monte Carlo & Dağılımlar' : 'Bayes & Distributions'}
              </p>

              <div className="flex items-center space-x-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#ff7a00] mt-2 group-hover:translate-x-1 transition-transform">
                <span>{language === 'tr' ? 'Ders Yoluna Git' : 'Open Path'}</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </div>
            </div>
          </button>

          {/* Card 2: İstatistik */}
          <button
            onClick={() => onSelectTrack('statistics')}
            className="group relative p-3.5 sm:p-5 rounded-3xl border border-slate-200 hover:border-[#ff7a00] bg-gradient-to-b from-slate-50/70 via-white to-orange-50/20 hover:from-orange-50 hover:to-orange-100/60 transition-all duration-300 text-left flex flex-col justify-between aspect-square cursor-pointer overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-slate-900/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

            {/* Top row: Icon & Status Badge */}
            <div className="flex items-start justify-between w-full relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono shrink-0 border border-slate-200">
                {language === 'tr' ? '8 Modül' : '8 Modules'}
              </span>
            </div>

            {/* Bottom text: Title & Subtitle / CTA */}
            <div className="relative z-10 mt-auto pt-2">
              <h3 className="text-sm sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-[#ff7a00] transition-colors leading-snug">
                {language === 'tr' ? 'İstatistik' : 'Statistics'}
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                {language === 'tr' ? 'Hipotez, Varyans, Regresyon & ANOVA' : 'Hypothesis & Regression'}
              </p>

              <div className="flex items-center space-x-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#ff7a00] mt-2 group-hover:translate-x-1 transition-transform">
                <span>{language === 'tr' ? 'Ders Yoluna Git' : 'Open Path'}</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
