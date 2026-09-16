import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import { formatStudentGreetingName } from '../utils/localization';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  CheckCircle2,
  PlayCircle,
  Lightbulb,
  GraduationCap
} from 'lucide-react';

interface TourStepConfig {
  step: number;
  tagTr: string;
  tagEn: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  hintTr: string;
  hintEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOUR_STEPS: TourStepConfig[] = [
  {
    step: 0,
    tagTr: 'DERS KUMANDA MERKEZİ',
    tagEn: 'COURSE CONTROL CENTER',
    titleTr: 'Ana Sayfa & Mühendislik Dersleri',
    titleEn: 'Home & Engineering Tracks',
    descTr: 'Burası ana merkezin! Endüstri Mühendisliği için Olasılık (ENGR 200), İstatistik (INDR 252) ve Optimizasyon derslerini buradan seçebilirsin. Paneller mobilde her zaman kare ve düzenlidir.',
    descEn: 'This is your mission control! Choose core Industrial Engineering courses like Probability (ENGR 200) and Statistics (INDR 252). Cards stay perfectly square on mobile.',
    hintTr: '👀 Şu an Ana Sayfa ekranındasın, ders kartlarını inceleyebilirsin!',
    hintEn: '👀 You are on the Home Page, check out the course cards!',
    icon: Compass,
  },
  {
    step: 1,
    tagTr: 'DERS HARİTASI & YOL',
    tagEn: 'ROADMAP & MODULES',
    titleTr: 'Modüller ve Zincirleme İlerleme',
    titleEn: 'Sequential Modules & Cases',
    descTr: 'Dersler birbirini tamamlayan modüller halinde ilerler. Her modülde konu anlatımı, şirket vaka sınavı ve formül haritaları bulunur. Şimdi ENGR 200 Olasılık yolundayız!',
    descEn: 'Courses progress in connected modules. Each module contains interactive lessons, case study exams, and formula maps. We are currently on the ENGR 200 roadmap!',
    hintTr: '✨ Ders haritasını kaydırıp modül yapısını görebilirsin!',
    hintEn: '✨ Scroll down to explore the module pathway!',
    icon: GraduationCap,
  },
  {
    step: 2,
    tagTr: 'CANLI SİMÜLASYON LABORATUVARI',
    tagEn: 'LIVE SIMULATION LAB',
    titleTr: 'İnteraktif Deneyim (Formülleri Yaşa!)',
    titleEn: 'Interactive Simulations (Hands-On)',
    descTr: 'Ezber yok! Aşağıdaki simülatörde değerleri değiştirip ortalama, medyan veya olasılık grafiklerinin canlı nasıl tepki verdiğini test edebilirsin. Derslerimiz interaktif simülatörlerle doludur.',
    descEn: 'No dry memorization! Modify numbers in the simulator below and watch how mean, median, and distributions update live.',
    hintTr: '🎮 Hemen aşağıdaki butonlara dokunup dene, çalışıyor!',
    hintEn: '🎮 Try clicking the buttons below, it is live and working!',
    icon: PlayCircle,
  },
  {
    step: 3,
    tagTr: 'AKILLI SEVİYE BELİRLEME',
    tagEn: 'SMART PLACEMENT TEST',
    titleTr: 'Bildiğin Konuları Doğrudan Atla!',
    titleEn: 'Skip Topics You Already Know!',
    descTr: 'Konuları zaten biliyorsan baştan başlamak zorunda değilsin. Seviye Belirleme Sınavı ile test çözüp bildiğin modülleri doğrudan atlayabilir, seviyene uygun konudan başlayabilirsin.',
    descEn: 'Already familiar with these concepts? Take the Placement Test to skip mastered modules and jump right into advanced lessons.',
    hintTr: '📝 Seviye belirleme testi şu an canlı ve çözülebilir!',
    hintEn: '📝 The placement test is active and ready on this screen!',
    icon: Lightbulb,
  },
  {
    step: 4,
    tagTr: '7/24 YANINDAKİ TA',
    tagEn: 'YOUR 24/7 TA',
    titleTr: 'Asistanın Tanco ile Sohbet Et!',
    titleEn: 'Chat with Your Assistant Tanco!',
    descTr: 'İşte en yakın arkadaşın! Ekranda istediğin yere taşıyabileceğin fotoğrafıma tıklayarak bana formüller, endüstri mühendisliği vaka analizleri ve sınavlar hakkında 7/24 soru sorabilirsin.',
    descEn: 'And here is your personal guide! Click my draggable photo anytime to ask questions about formulas, industrial cases, and exam prep 24/7.',
    hintTr: '💬 Fotoğrafıma tıklayarak dilediğin an bana ulaşabilirsin!',
    hintEn: '💬 Click my photo anytime to open our chat!',
    icon: Sparkles,
  },
];

export const TancoOnboardingTour: React.FC = () => {
  const {
    language,
    userProfile,
    hasSeenTancoTour,
    isTancoTourActive,
    tancoTourStep = 0,
    startTancoTour,
    nextTancoTourStep,
    prevTancoTourStep,
    setTancoTourStep,
    endTancoTour,
  } = useAppStore();

  const [showInitialPrompt, setShowInitialPrompt] = useState(false);

  // Show friendly initial prompt for users who haven't completed the tour
  useEffect(() => {
    if (!hasSeenTancoTour && !isTancoTourActive) {
      const timer = setTimeout(() => {
        setShowInitialPrompt(true);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      setShowInitialPrompt(false);
    }
  }, [hasSeenTancoTour, isTancoTourActive]);

  const studentName = formatStudentGreetingName(
    userProfile?.fullName,
    language === 'tr' ? 'Öğrenci' : 'Student'
  );

  const isEn = language === 'en';
  const currentStepConfig = TOUR_STEPS[tancoTourStep] || TOUR_STEPS[0];
  const StepIcon = currentStepConfig.icon;
  const isLastStep = tancoTourStep === TOUR_STEPS.length - 1;

  const handleFinishTour = () => {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#ff7a00', '#f59e0b', '#3b82f6', '#10b981'],
    });
    endTancoTour(true);
  };

  // 1. Initial Prompt Dialog
  if (showInitialPrompt && !isTancoTourActive) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-orange-200/90 shadow-2xl relative text-left overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff7a00]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close / Skip button */}
          <button
            onClick={() => {
              setShowInitialPrompt(false);
              endTancoTour(false);
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title={isEn ? 'Skip for now' : 'Şimdilik Atla'}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tanco Mascot with Speech */}
          <div className="flex items-center space-x-3.5 mb-4">
            <div className="relative shrink-0">
              <TanCoreMascotAvatar size="lg" className="shadow-md shadow-[#ff7a00]/30" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-black text-slate-900">Tanco</span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#ff7a00] font-mono">
                  TA
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isEn ? 'Industrial Engineering Assistant' : 'Endüstri Mühendisliği Asistanı'}
              </p>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug mb-2">
            {isEn ? `Welcome ${studentName}! 🚀` : `Hoş Geldin ${studentName}! 🚀`}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
            {isEn
              ? 'Would you like a quick 1-minute interactive tour? I will walk you through live courses, simulation labs, and tools so you can hit the ground running!'
              : 'Platformu, canlı simülasyon laboratuvarlarını ve Endüstri Mühendisliği araçlarını 1 dakikalık hızlı bir turla gezdirmemi ister misin? Canlı ekranlar eşliğinde birlikte bakalım!'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => {
                setShowInitialPrompt(false);
                startTancoTour();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'Start Tour (+50 XP)' : 'Turu Başlat (+50 XP)'}</span>
            </button>
            <button
              onClick={() => {
                setShowInitialPrompt(false);
                endTancoTour(false);
              }}
              className="w-full sm:w-auto py-3 px-4 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              {isEn ? 'Later' : 'Daha Sonra'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Tour Controller Floating Bar
  if (!isTancoTourActive) {
    return null;
  }

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl animate-fade-in-up">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-[#ff7a00]/30 shadow-[0_20px_50px_rgba(0,0,0,0.22)] p-4 sm:p-5 relative text-left">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#ff7a00]/10 rounded-full blur-xl pointer-events-none" />

        {/* Top Header Row: Mascot, Badge, Step Progress & Close */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center space-x-3">
            <div className="relative shrink-0">
              <TanCoreMascotAvatar size="md" className="shadow-sm ring-2 ring-[#ff7a00]/40" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#ff7a00] font-mono tracking-wider">
                  {isEn ? currentStepConfig.tagEn : currentStepConfig.tagTr}
                </span>
                <span className="text-[11px] font-bold text-slate-400 font-mono">
                  {tancoTourStep + 1} / {TOUR_STEPS.length}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5 mt-0.5">
                <StepIcon className="w-3.5 h-3.5 text-[#ff7a00]" />
                {isEn ? currentStepConfig.titleEn : currentStepConfig.titleTr}
              </h4>
            </div>
          </div>

          <button
            onClick={() => endTancoTour(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title={isEn ? 'Close tour' : 'Turu Kapat'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description Body */}
        <p className="text-[11.5px] sm:text-xs text-slate-700 font-medium leading-relaxed mb-2">
          {isEn ? currentStepConfig.descEn : currentStepConfig.descTr}
        </p>

        {/* Live Action Hint Pill */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-[11px] font-bold mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>{isEn ? currentStepConfig.hintEn : currentStepConfig.hintTr}</span>
        </div>

        {/* Bottom Controls: Step Dots & Navigation Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Step Dots */}
          <div className="flex items-center space-x-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTancoTourStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === tancoTourStep
                    ? 'w-6 bg-[#ff7a00]'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`${isEn ? 'Step' : 'Adım'} ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buttons: Back / Next */}
          <div className="flex items-center space-x-2">
            {tancoTourStep > 0 && (
              <button
                onClick={prevTancoTourStep}
                className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{isEn ? 'Back' : 'Geri'}</span>
              </button>
            )}

            {isLastStep ? (
              <button
                onClick={handleFinishTour}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 cursor-pointer animate-pulse"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Finish (+50 XP)' : 'Turu Tamamla 🎉 (+50 XP)'}</span>
              </button>
            ) : (
              <button
                onClick={nextTancoTourStep}
                className="py-2 px-4 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{isEn ? 'Next' : 'İleri'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
