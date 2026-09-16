import React, { useState, useEffect } from 'react';
import { ALL_MODULES } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import { getLocalized } from '../utils/localization';
import { TanCoreMascotAvatar } from '../components/TanCoreMascotAvatar';
import { MathFormulaText } from '../components/MathFormulaText';
import { KatexFormula } from '../components/KatexFormula';
import { extractTopicFormula, stripFormulaFromText } from '../utils/formulaExtractor';
import {
  Lock,
  Trophy,
  Sparkles,
  BookOpen,
  Star,
  Play,
  PawPrint,
  Cat,
  Rabbit,
  Dog,
  Bird,
  Turtle,
  Fish,
  Flame,
  Target,
  Crown,
  Dices,
  BarChart3,
  Layers,
  ArrowLeft,
  ArrowRight,
  Zap,
  Loader2,
  Send,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Lesson, CaseExam, Module } from '../types/stats';
import { CourseTrack } from './HomePage';

export const SpiderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <ellipse cx="12" cy="15" rx="3" ry="4" />
    <circle cx="12" cy="8.5" r="1.8" />
    <path d="M 9.5 8 C 6.5 5.5, 3.5 6.5, 2.5 9.5" />
    <path d="M 9 11.5 C 5.5 10, 3 11.5, 2 14.5" />
    <path d="M 9 14.5 C 5.5 15, 3 17, 2.5 20" />
    <path d="M 9.5 17.5 C 7 19.5, 5 21, 4.5 23" />
    <path d="M 14.5 8 C 17.5 5.5, 20.5 6.5, 21.5 9.5" />
    <path d="M 15 11.5 C 18.5 10, 21 11.5, 22 14.5" />
    <path d="M 15 14.5 C 18.5 15, 21 17, 21.5 20" />
    <path d="M 14.5 17.5 C 17 19.5, 19 21, 19.5 23" />
  </svg>
);

export const CaseExamIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3.5" y="2.5" width="13" height="19" rx="2" />
    <line x1="6.5" y1="6" x2="13.5" y2="6" strokeWidth="1.75" />
    <line x1="6.5" y1="9.5" x2="13.5" y2="9.5" />
    <line x1="6.5" y1="13" x2="11.5" y2="13" />
    <line x1="6.5" y1="16.5" x2="10.5" y2="16.5" />
    <path d="M 14 20 L 21 13 L 18.5 10.5 L 11.5 17.5 L 11.5 20 Z" />
    <line x1="16.5" y1="12.5" x2="19" y2="15" />
  </svg>
);

export const getModuleMascotIcon = (moduleOrder: number, isUnlocked: boolean) => {
  const iconColorClass = isUnlocked ? 'text-white' : 'text-slate-500';
  const strokeClass = 'w-6 h-6 stroke-[2]';

  if (!isUnlocked) {
    return <Lock className={`w-5 h-5 ${iconColorClass}`} />;
  }

  switch (moduleOrder) {
    case 1:
      return <PawPrint className={`${strokeClass} ${iconColorClass}`} />;
    case 2:
      return <Cat className={`${strokeClass} ${iconColorClass}`} />;
    case 3:
      return <Rabbit className={`${strokeClass} ${iconColorClass}`} />;
    case 4:
      return <Dog className={`${strokeClass} ${iconColorClass}`} />;
    case 5:
      return <Bird className={`${strokeClass} ${iconColorClass}`} />;
    case 6:
      return <Turtle className={`${strokeClass} ${iconColorClass}`} />;
    case 7:
      return <Fish className={`${strokeClass} ${iconColorClass}`} />;
    case 8:
      return <Flame className={`${strokeClass} ${iconColorClass}`} />;
    case 9:
      return <Target className={`${strokeClass} ${iconColorClass}`} />;
    case 10:
      return <Sparkles className={`${strokeClass} ${iconColorClass}`} />;
    case 11:
      return <Crown className={`${strokeClass} ${iconColorClass}`} />;
    case 12:
      return <Dices className={`${strokeClass} ${iconColorClass}`} />;
    case 13:
      return <BarChart3 className={`${strokeClass} ${iconColorClass}`} />;
    case 14:
      return <Layers className={`${strokeClass} ${iconColorClass}`} />;
    case 15:
      return <Trophy className={`${strokeClass} ${iconColorClass}`} />;
    case 16:
      return <Star className={`${strokeClass} ${iconColorClass}`} />;
    default:
      return <PawPrint className={`${strokeClass} ${iconColorClass}`} />;
  }
};

export const getNodeAnimalIcon = (subStepIndex: number, colorClass: string) => {
  const iconClass = `w-7 h-7 sm:w-9 sm:h-9 ${colorClass} stroke-[1.75]`;

  if (subStepIndex === 1) {
    return <Rabbit className={iconClass} />;
  } else if (subStepIndex === 2) {
    return <Cat className={iconClass} />;
  } else if (subStepIndex === 3) {
    return <SpiderIcon className={iconClass} />;
  } else {
    return <Dog className={iconClass} />;
  }
};

interface CoursePageProps {
  selectedTrack: 'probability' | 'statistics';
  inDesignCourse?: CourseTrack | null;
  onSelectLesson: (lessonId: string) => void;
  onSelectCaseExam: (caseId: string) => void;
  onBackToHome: () => void;
  scrollToNodeId?: string | null;
  onStartPlacementTest?: () => void;
  onGuestGateRequired?: () => void;
}

interface PathNodeItem {
  id: string;
  type: 'lesson' | 'case';
  title: string;
  order: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  lesson?: Lesson;
  module: Module;
  completedCasesCount?: number;
  totalCasesCount?: number;
}

const PROBABILITY_MODULE_IDS = ['module-2', 'module-13', 'module-14', 'module-3', 'module-15', 'module-16', 'module-4', 'module-12'];
const STATISTICS_MODULE_IDS = ['module-1', 'module-5', 'module-6', 'module-7', 'module-8', 'module-9', 'module-10', 'module-11'];

export const CoursePage: React.FC<CoursePageProps> = ({
  selectedTrack,
  inDesignCourse,
  onSelectLesson,
  onSelectCaseExam,
  onBackToHome,
  scrollToNodeId,
  onStartPlacementTest,
  onGuestGateRequired,
}) => {
  const { language, unlockedModules, completedLessons, completedCaseExams, isAuthenticated, isVerified, setIsTancoChatOpen } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<PathNodeItem | null>(null);
  const [selectedCaseHubModule, setSelectedCaseHubModule] = useState<Module | null>(null);

  // If viewing an in-design course, render dedicated placeholder view
  if (inDesignCourse) {
    const isEn = language === 'en';
    const Icon = inDesignCourse.icon;
    const title = isEn ? inDesignCourse.name.en : inDesignCourse.name.tr;
    const desc = isEn ? inDesignCourse.desc.en : inDesignCourse.desc.tr;

    return (
      <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 font-sans overflow-x-hidden animate-fade-in space-y-6">
        {/* Top Header Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 text-xs font-black text-slate-700 hover:text-[#ff7a00] hover:border-[#ff7a00]/40 transition-all shadow-2xs group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#ff7a00] group-hover:-translate-x-0.5 transition-transform" />
            <span>{isEn ? 'Back to Courses' : 'Ana Sayfaya Dön'}</span>
          </button>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 font-mono text-[10px] sm:text-xs font-black">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
            <span>{isEn ? 'IN DESIGN PHASE' : 'TASARIM AŞAMASINDA'}</span>
          </div>
        </div>

        {/* Course Header Card */}
        <div className="relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden text-left">
          <div className="flex items-start space-x-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${inDesignCourse.iconBg}`}>
              <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.25]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-black font-mono tracking-wider text-slate-500 uppercase">
                {inDesignCourse.code}
              </span>
              <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                {inDesignCourse.code} – {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        </div>

        {/* In-Design Message Card with Mascot Tanco */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 border border-amber-200/80 shadow-sm text-center flex flex-col items-center">
          <button
            onClick={() => setIsTancoChatOpen(true)}
            className="relative mb-4 cursor-pointer group focus:outline-none"
            title={isEn ? "Chat with Tanco" : "Tanco ile Sohbet Et"}
          >
            <TanCoreMascotAvatar size="xl" className="shadow-lg shadow-[#ff7a00]/25 group-hover:scale-105 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </button>

          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-2">
            {isEn ? 'We Are Designing This Course!' : 'Bu Dersi Şu Anda Tasarlıyoruz!'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed mb-6 font-medium">
            {isEn
              ? "We are currently designing this course for you. To support our development or submit your curriculum and topic requests, feel free to write to your assistant Tanco anytime!"
              : "Bu dersi şu anda sizler için tasarlıyoruz! Bize destek olmak ve müfredat/içerik taleplerinizi iletmek için asistanınız Tanco'ya yazabilirsiniz."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsTancoChatOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEn ? 'Write to Assistant Tanco' : "Asistanınız Tanco'ya Yazın"}</span>
            </button>

            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Return to Courses' : 'Ders Listesine Dön'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter modules based on track
  const targetIds = selectedTrack === 'statistics' ? STATISTICS_MODULE_IDS : PROBABILITY_MODULE_IDS;

  const activeModulesList = targetIds
    .map((id) => ALL_MODULES.find((m) => m.id === id))
    .filter((m): m is Module => m !== undefined);

  // Check if a module is unlocked
  const isModuleUnlockedCheck = (module: Module, trackIdx: number): boolean => {
    if (trackIdx === 0) return true;
    if (!isAuthenticated || !isVerified) return false;

    if (unlockedModules.includes(module.id)) return true;

    // Check if the previous module in track has all lessons completed AND at least 1 case completed
    const prevModule = activeModulesList[trackIdx - 1];
    if (prevModule) {
      const allPrevLessonsDone = prevModule.lessons.every((l) => completedLessons.includes(l.id));
      const anyPrevCaseDone = prevModule.caseExams.some((c) => completedCaseExams.includes(c.id));
      if (allPrevLessonsDone && anyPrevCaseDone) return true;
    }

    // Check if user already started lessons or cases in this module
    if (module.lessons.some((l) => completedLessons.includes(l.id))) return true;
    if (module.caseExams.some((c) => completedCaseExams.includes(c.id))) return true;

    return false;
  };

  const unlockedActiveModules = activeModulesList.filter((m, idx) => isModuleUnlockedCheck(m, idx));

  const latestUnlockedModule =
    unlockedActiveModules[unlockedActiveModules.length - 1] || activeModulesList[0];

  // Determine global target node ID
  const getGlobalTargetNodeId = (): string => {
    if (unlockedActiveModules.length === 0) return activeModulesList[0]?.lessons[0]?.id || 'm1-l0';

    for (let mIdx = 0; mIdx < unlockedActiveModules.length; mIdx++) {
      const mod = unlockedActiveModules[mIdx];
      const lessons = mod.lessons || [];
      const cases = mod.caseExams || [];

      // 1. Check if any lesson is not completed
      const uncompletedLesson = lessons.find((l) => !completedLessons.includes(l.id));
      if (uncompletedLesson) {
        return uncompletedLesson.id;
      }

      // 2. If all lessons completed, check if at least one case is completed
      const anyCaseDone = cases.some((c) => completedCaseExams.includes(c.id));
      if (!anyCaseDone && cases.length > 0) {
        return `${mod.id}-cases`;
      }
    }

    return latestUnlockedModule.lessons[0]?.id || 'm1-l0';
  };

  const globalTargetNodeId = getGlobalTargetNodeId();

  // Scroll to node if requested
  useEffect(() => {
    if (scrollToNodeId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`node-${scrollToNodeId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [scrollToNodeId]);

  const getXOffsetClass = (index: number) => {
    const pattern = [
      'translate-x-0',
      'translate-x-12 sm:translate-x-20',
      'translate-x-0',
      '-translate-x-12 sm:-translate-x-20',
    ];
    return pattern[index % pattern.length];
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 font-sans overflow-x-hidden animate-fade-in">
      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 text-xs font-black text-slate-700 hover:text-[#ff7a00] hover:border-[#ff7a00]/40 transition-all shadow-2xs group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#ff7a00] group-hover:-translate-x-0.5 transition-transform" />
          <span>{language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-[#ff7a00] font-mono text-[10px] sm:text-xs font-black">
          {selectedTrack === 'statistics' ? <BarChart3 className="w-3.5 h-3.5" /> : <Dices className="w-3.5 h-3.5" />}
          <span>{selectedTrack === 'statistics' ? 'APPLIED STATISTICS' : 'PROBABILITY & RANDOM VARIABLES'}</span>
        </div>
      </div>

      {/* Placement Test CTA Card */}
      {onStartPlacementTest && (
        <div className="relative mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-white border border-[#ff7a00]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#ff7a00] text-white flex items-center justify-center shadow-md shadow-[#ff7a00]/25 shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white stroke-[2]" />
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {language === 'tr' ? 'Seviyeni Belirle' : 'Placement Test'}
                </h3>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff7a00]/10 text-[#ff7a00] font-mono border border-[#ff7a00]/20">
                  {language === 'tr' ? 'Hızlı İlerle' : 'Fast-Track'}
                </span>
              </div>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium leading-snug mt-0.5">
                {language === 'tr'
                  ? 'Daha önce bu konuları gördün mü? Seviye tespit sınavı ile bildiğin modülleri doğrudan tamamla.'
                  : 'Already familiar with these topics? Test out of mastered modules directly.'}
              </p>
            </div>
          </div>

          <button
            onClick={onStartPlacementTest}
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs shadow-[#ff7a00]/25 group shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-white fill-white stroke-[2]" />
            <span>{language === 'tr' ? 'Sınava Başla' : 'Start Test'}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Modules Flow */}
      <div className="space-y-12">
        {activeModulesList.map((module, trackIdx) => {
          const isModuleUnlocked = isModuleUnlockedCheck(module, trackIdx);
          const trackModuleOrder = trackIdx + 1;

          const lessons = module.lessons || [];
          const cases = module.caseExams || [];
          const isAnyCaseCompleted = cases.some((c) => completedCaseExams.includes(c.id));
          const completedCasesCount = cases.filter((c) => completedCaseExams.includes(c.id)).length;

          // 1. All lessons strictly in sequential order (Intro -> Basic Core -> Advanced)
          const pathNodes: PathNodeItem[] = [];

          lessons.forEach((lesson, lIdx) => {
            pathNodes.push({
              id: lesson.id,
              type: 'lesson',
              title: getLocalized(lesson.title, language),
              order: lIdx + 1,
              isCompleted: completedLessons.includes(lesson.id),
              isUnlocked: isModuleUnlocked,
              lesson,
              module,
            });
          });

          // 2. Single Capstone Case node at the END of the module
          if (cases.length > 0) {
            pathNodes.push({
              id: `${module.id}-cases`,
              type: 'case',
              title: language === 'tr' ? 'Şirket Vaka Sınavları' : 'Company Case Studies',
              order: lessons.length + 1,
              isCompleted: isAnyCaseCompleted,
              isUnlocked: isModuleUnlocked,
              module,
              completedCasesCount,
              totalCasesCount: cases.length,
            });
          }

          const totalNodesCount = pathNodes.length;
          const completedNodesCount = pathNodes.filter((n) => n.isCompleted).length;
          const progressPercent =
            totalNodesCount > 0 ? Math.round((completedNodesCount / totalNodesCount) * 100) : 0;

          return (
            <div key={module.id} id={`module-section-${module.id}`} className="relative">
              {/* Module Header Card */}
              <div
                className={`sticky top-16 z-30 p-5 sm:p-6 rounded-3xl mb-8 border transition-all shadow-md ${
                  isModuleUnlocked
                    ? 'bg-[#ff7a00] text-white border-[#ff7a00] shadow-[#ff7a00]/20'
                    : 'bg-slate-200 text-slate-500 border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest opacity-90 font-mono">
                      {language === 'tr' ? `MODÜL ${trackModuleOrder}` : `MODULE ${trackModuleOrder}`}
                    </span>
                    <h2 className="text-base xs:text-lg sm:text-xl font-black tracking-tight leading-snug mt-0.5">
                      {getLocalized(module.title, language)}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-90 font-medium mt-1 leading-relaxed">
                      {getLocalized(module.description, language)}
                    </p>
                    {!isModuleUnlocked && (!isAuthenticated || !isVerified) && (
                      <button
                        onClick={onGuestGateRequired}
                        className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-300 shadow-2xs transition-all cursor-pointer"
                      >
                        <span>🔒 {language === 'tr' ? '2. Modül ve sonrası için ücretsiz kayıt olun' : 'Sign up to unlock Module 2+'}</span>
                      </button>
                    )}
                  </div>

                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-xs">
                    {getModuleMascotIcon(trackModuleOrder, isModuleUnlocked)}
                  </div>
                </div>

                {isModuleUnlocked && (
                  <div className="pt-2 border-t border-white/20">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="opacity-90">
                        {language === 'tr'
                          ? `${completedNodesCount}/${totalNodesCount} Aşama Tamamlandı`
                          : `${completedNodesCount}/${totalNodesCount} Steps Completed`}
                      </span>
                      <span className="font-mono">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/20">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Duolingo Vertical Path */}
              <div className="relative flex flex-col items-center py-4 space-y-6">
                <div className="absolute top-4 bottom-4 w-1 bg-slate-200 -z-10 rounded-full" />

                {pathNodes.map((node, nIdx) => {
                  const isCurrentTarget = node.id === globalTargetNodeId;
                  const offsetClass = getXOffsetClass(nIdx);

                  return (
                    <div
                      key={node.id}
                      id={`node-${node.id}`}
                      className={`relative flex flex-col items-center transition-all duration-300 ${offsetClass}`}
                    >
                      {isCurrentTarget && (
                        <div className="absolute -top-9 z-20 animate-bounce">
                          <div className="bg-[#ff7a00] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center space-x-1 border border-white">
                            <Play className="w-3 h-3 fill-white" />
                            <span>{language === 'tr' ? 'SIRADAKİ ADIM' : 'NEXT STEP'}</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          if (!node.isUnlocked) {
                            if (!isAuthenticated || !isVerified) {
                              onGuestGateRequired?.();
                            }
                            return;
                          }
                          if (node.type === 'case') {
                            setSelectedCaseHubModule(node.module);
                          } else {
                            setSelectedNode(node);
                          }
                        }}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 active:translate-y-1 ${
                          node.type === 'case'
                            ? node.isCompleted
                              ? 'bg-gradient-to-tr from-amber-500 to-[#ff7a00] text-white shadow-[0_6px_0_0_#b35300] hover:brightness-110 ring-4 ring-amber-300/40'
                              : isCurrentTarget
                              ? 'bg-gradient-to-tr from-amber-500 to-[#ff7a00] text-white shadow-[0_8px_0_0_#b35300] ring-4 ring-amber-400/50 animate-pulse'
                              : node.isUnlocked
                              ? 'bg-amber-50 text-[#ff7a00] border-2 border-amber-500 shadow-[0_6px_0_0_#fed7aa]'
                              : 'bg-slate-200 text-slate-400 shadow-[0_6px_0_0_#cbd5e1] cursor-not-allowed'
                            : node.isCompleted
                            ? 'bg-[#ff7a00] text-white shadow-[0_6px_0_0_#cc6100] hover:bg-[#e56d00]'
                            : isCurrentTarget
                            ? 'bg-[#ff7a00] text-white shadow-[0_8px_0_0_#cc6100] ring-4 ring-[#ff7a00]/30 animate-pulse'
                            : node.isUnlocked
                            ? 'bg-orange-50 text-[#ff7a00] border-2 border-[#ff7a00] shadow-[0_6px_0_0_#ffc299]'
                            : 'bg-slate-200 text-slate-400 shadow-[0_6px_0_0_#cbd5e1] cursor-not-allowed'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center ${
                            node.isCompleted || isCurrentTarget
                              ? 'border-white/40'
                              : node.isUnlocked
                              ? node.type === 'case' ? 'border-amber-400/50' : 'border-[#ff7a00]/30'
                              : 'border-slate-300'
                          }`}
                        >
                          {node.type === 'case' ? (
                            <Trophy
                              className={`w-7 h-7 sm:w-9 sm:h-9 ${
                                node.isCompleted || isCurrentTarget
                                  ? 'text-white'
                                  : node.isUnlocked
                                  ? 'text-[#ff7a00]'
                                  : 'text-slate-400'
                              } stroke-[2]`}
                            />
                          ) : node.isCompleted ? (
                            getNodeAnimalIcon(node.order, 'text-white')
                          ) : isCurrentTarget ? (
                            getNodeAnimalIcon(node.order, 'text-white')
                          ) : node.isUnlocked ? (
                            getNodeAnimalIcon(node.order, 'text-[#ff7a00]')
                          ) : (
                            getNodeAnimalIcon(node.order, 'text-slate-400')
                          )}
                        </div>
                      </button>

                      <div className="mt-2 flex flex-col items-center">
                        <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-extrabold text-slate-800 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-2xl border border-slate-200 shadow-2xs text-center leading-none whitespace-nowrap mb-0.5">
                          {node.title}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            node.type === 'case'
                              ? node.isCompleted
                                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                : 'text-amber-700 bg-amber-50 border-amber-200'
                              : 'text-[#ff7a00] bg-orange-50 border-orange-200'
                          }`}
                        >
                          {node.type === 'case'
                            ? node.isCompleted
                              ? language === 'tr'
                                ? `✓ ${node.completedCasesCount}/${node.totalCasesCount} VAKA ÇÖZÜLDÜ`
                                : `✓ ${node.completedCasesCount}/${node.totalCasesCount} CASES SOLVED`
                              : language === 'tr'
                              ? '🏆 3 VAKA SEÇENEĞİ'
                              : '🏆 3 CASE OPTIONS'
                            : language === 'tr'
                            ? `DERS ${node.lesson?.order || node.order}`
                            : `LESSON ${node.lesson?.order || node.order}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson Detail Dialog */}
      {selectedNode && selectedNode.lesson && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#ff7a00] text-white flex items-center justify-center shadow-md shrink-0">
                {getNodeAnimalIcon(selectedNode.order, 'text-white')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug break-words mb-0.5">
                  {selectedNode.title}
                </h3>
                <span className="text-[10px] font-black uppercase text-[#ff7a00] tracking-widest font-mono block">
                  {`DERS ${selectedNode.lesson.order || selectedNode.order}`}
                </span>
              </div>
            </div>

            {(() => {
              const rawText = getLocalized(selectedNode.lesson.conceptCard, language);
              const topicFormula = extractTopicFormula(selectedNode.lesson, undefined, language);
              const displayText = topicFormula ? stripFormulaFromText(rawText, topicFormula) : rawText;

              return (
                <>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    <MathFormulaText text={displayText} />
                  </p>

                  {/* Dedicated Formula Card */}
                  {topicFormula && (
                    <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-orange-500/10 border border-[#ff7a00]/30 shadow-2xs flex items-center justify-center text-center overflow-x-auto min-h-[64px]">
                      <KatexFormula formula={topicFormula} displayMode={true} className="text-[#ff7a00] text-sm sm:text-base [&_.katex-display]:my-0" />
                    </div>
                  )}
                </>
              );
            })()}

            <button
              onClick={() => {
                const node = selectedNode;
                setSelectedNode(null);
                onSelectLesson(node.id);
              }}
              className="w-full py-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff7a00]/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {selectedNode.isCompleted
                  ? language === 'tr'
                    ? 'TEKRAR İNCELE'
                    : 'REPLAY'
                  : language === 'tr'
                  ? 'DERSE BAŞLA (+15 XP)'
                  : 'START LESSON (+15 XP)'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 3-Case Exam Selection Modal */}
      {selectedCaseHubModule && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-orange-500 via-[#ff7a00] to-amber-500 text-white relative">
              <button
                onClick={() => setSelectedCaseHubModule(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white font-black text-lg bg-black/10 hover:bg-black/20 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-inner shrink-0">
                  <Trophy className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-100 font-mono">
                    {language === 'tr' ? 'MODÜL BİTİRME VAKALARI' : 'MODULE CAPSTONE CASES'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {getLocalized(selectedCaseHubModule.title, language)}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-orange-50 font-medium mt-2 leading-relaxed">
                {language === 'tr'
                  ? 'Aşağıdaki 3 gerçek dünya şirket vakasından dilediğini seçip çözebilirsin. En az bir tanesini tamamladığında sonraki modülün kilidi açılır!'
                  : 'Choose and solve any of the 3 real-world company case studies below. Completing at least one unlocks the next module!'}
              </p>
            </div>

            {/* Cases List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100">
              {selectedCaseHubModule.caseExams.map((caseItem, idx) => {
                const isCaseCompleted = completedCaseExams.includes(caseItem.id);
                const diffLabel =
                  caseItem.difficulty === 'kolay'
                    ? language === 'tr' ? 'Kolay' : 'Easy'
                    : caseItem.difficulty === 'orta'
                    ? language === 'tr' ? 'Orta' : 'Medium'
                    : language === 'tr' ? 'Zor' : 'Hard';

                const diffBadgeColor =
                  caseItem.difficulty === 'kolay'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : caseItem.difficulty === 'orta'
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200';

                return (
                  <div
                    key={caseItem.id}
                    className={`pt-3.5 first:pt-0 rounded-2xl p-4 transition-all border ${
                      isCaseCompleted
                        ? 'bg-emerald-50/40 border-emerald-200/80 shadow-2xs'
                        : 'bg-white hover:bg-orange-50/20 border-slate-200 hover:border-orange-300/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded-md bg-slate-900 text-white">
                          {language === 'tr' ? `Vaka ${idx + 1}` : `Case ${idx + 1}`}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${diffBadgeColor}`}>
                          {diffLabel}
                        </span>
                        {isCaseCompleted ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>{language === 'tr' ? 'Tamamlandı (+50 XP)' : 'Completed (+50 XP)'}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                            +50 XP
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-slate-900 mb-1 leading-snug">
                      {getLocalized(caseItem.title, language)}
                    </h4>

                    <div className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed mb-3">
                      <MathFormulaText text={getLocalized(caseItem.businessQuestion, language)} />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 font-mono">
                        {caseItem.solutionQuestions?.length || 1} {language === 'tr' ? 'Soru / Analiz' : 'Question'}
                      </span>

                      <button
                        onClick={() => {
                          const targetCaseId = caseItem.id;
                          setSelectedCaseHubModule(null);
                          onSelectCaseExam(targetCaseId);
                        }}
                        className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 ${
                          isCaseCompleted
                            ? 'bg-slate-900 hover:bg-slate-800 text-white'
                            : 'bg-[#ff7a00] hover:bg-[#e66e00] text-white shadow-[#ff7a00]/25'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>
                          {isCaseCompleted
                            ? language === 'tr' ? 'Tekrar Çöz' : 'Review'
                            : language === 'tr' ? 'Vakayı Çöz' : 'Solve Case'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {language === 'tr'
                  ? `${selectedCaseHubModule.caseExams.filter((c) => completedCaseExams.includes(c.id)).length}/3 vaka tamamlandı`
                  : `${selectedCaseHubModule.caseExams.filter((c) => completedCaseExams.includes(c.id)).length}/3 cases completed`}
              </span>
              <button
                onClick={() => setSelectedCaseHubModule(null)}
                className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-300 transition-all cursor-pointer"
              >
                {language === 'tr' ? 'Kapat' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
