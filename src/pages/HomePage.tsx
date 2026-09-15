import React, { useState, useEffect } from 'react';
import { ALL_MODULES } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import { getLocalized } from '../utils/localization';
import { TanCoreMascotAvatar } from '../components/TanCoreMascotAvatar';
import {
  Lock,
  CheckCircle2,
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
  Zap,
} from 'lucide-react';
import { Lesson, CaseExam, Module } from '../types/stats';

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

interface HomePageProps {
  onSelectLesson: (lessonId: string) => void;
  onSelectCaseExam: (caseId: string) => void;
  onStartPlacementTest: () => void;
  scrollToNodeId?: string | null;
  selectedTrack?: 'probability' | 'statistics';
}

interface PathNodeItem {
  id: string;
  type: 'lesson' | 'case';
  title: string;
  order: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  lesson?: Lesson;
  caseExam?: CaseExam;
  module: Module;
}

const PROBABILITY_MODULE_IDS = ['module-2', 'module-13', 'module-14', 'module-3', 'module-15', 'module-16', 'module-4', 'module-12'];
const STATISTICS_MODULE_IDS = ['module-1', 'module-5', 'module-6', 'module-7', 'module-8', 'module-9', 'module-10', 'module-11'];

export const HomePage: React.FC<HomePageProps> = ({
  onSelectLesson,
  onSelectCaseExam,
  onStartPlacementTest,
  scrollToNodeId,
  selectedTrack = 'probability',
}) => {
  const {
    language,
    unlockedModules,
    completedLessons,
    completedCaseExams,
    xp,
    userProfile,
  } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<PathNodeItem | null>(null);
  const [isBtnLogoSpinning, setIsBtnLogoSpinning] = useState(false);

  // Periodic logo spin animation every 3 seconds (matching navbar)
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

  // Derive dynamic user first name
  const firstName = userProfile?.fullName
    ? userProfile.fullName.trim().split(' ')[0]
    : 'Resul';

  // Filter and order modules based on selected track
  const targetIds = selectedTrack === 'statistics' ? STATISTICS_MODULE_IDS : PROBABILITY_MODULE_IDS;

  const activeModulesList = targetIds
    .map((id) => ALL_MODULES.find((m) => m.id === id))
    .filter((m): m is Module => m !== undefined);

  // Unlocked modules in active track (first module of active track is always unlocked by default)
  const unlockedActiveModules = activeModulesList.filter(
    (m, idx) =>
      idx === 0 ||
      unlockedModules.includes(m.id) ||
      m.lessons.some((l) => completedLessons.includes(l.id))
  );

  // Current highest unlocked module in active track
  const latestUnlockedModule =
    unlockedActiveModules[unlockedActiveModules.length - 1] || activeModulesList[0];
  const latestModuleTitle = getLocalized(latestUnlockedModule.title, language);

  // Determine the single global target node ID for "SIRADAKİ ADIM"
  const getGlobalTargetNodeId = (): string => {
    if (unlockedActiveModules.length === 0) return activeModulesList[0]?.lessons[0]?.id || 'm1-l1';

    // Search unlocked modules backwards (starting from highest unlocked e.g. Placement Test placement)
    for (let mIdx = unlockedActiveModules.length - 1; mIdx >= 0; mIdx--) {
      const mod = unlockedActiveModules[mIdx];
      const lessons = mod.lessons || [];
      const cases = mod.caseExams || [];
      const modNodes: { id: string; isCompleted: boolean }[] = [];

      if (lessons[0]) modNodes.push({ id: lessons[0].id, isCompleted: completedLessons.includes(lessons[0].id) });
      if (lessons[1]) modNodes.push({ id: lessons[1].id, isCompleted: completedLessons.includes(lessons[1].id) });
      if (cases[0]) modNodes.push({ id: cases[0].id, isCompleted: completedCaseExams.includes(cases[0].id) });
      for (let i = 2; i < lessons.length; i++) {
        modNodes.push({ id: lessons[i].id, isCompleted: completedLessons.includes(lessons[i].id) });
      }
      for (let c = 1; c < cases.length; c++) {
        modNodes.push({ id: cases[c].id, isCompleted: completedCaseExams.includes(cases[c].id) });
      }

      const firstUncompleted = modNodes.find((n) => !n.isCompleted);
      if (firstUncompleted) {
        return firstUncompleted.id;
      }
    }

    return latestUnlockedModule.lessons[0]?.id || 'm1-l1';
  };

  const globalTargetNodeId = getGlobalTargetNodeId();

  // Smooth scroll ONLY when an explicit scrollToNodeId is requested
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

  // Derive next topic item for welcome speech box
  let nextTopicItem: { title: string; concept: string } | null = null;

  // Search active target node details
  for (const module of activeModulesList) {
    const foundLesson = module.lessons.find((l) => l.id === globalTargetNodeId);
    if (foundLesson) {
      nextTopicItem = {
        title: getLocalized(foundLesson.title, language),
        concept: getLocalized(foundLesson.conceptCard, language),
      };
      break;
    }
    const foundCase = module.caseExams.find((c) => c.id === globalTargetNodeId);
    if (foundCase) {
      nextTopicItem = {
        title: getLocalized(foundCase.title, language),
        concept: getLocalized(foundCase.businessQuestion, language),
      };
      break;
    }
  }

  const getXOffsetClass = (index: number) => {
    const pattern = [
      'self-center',
      'translate-x-3 sm:translate-x-12',
      'translate-x-6 sm:translate-x-20',
      'translate-x-3 sm:translate-x-12',
      'self-center',
      '-translate-x-3 sm:-translate-x-12',
      '-translate-x-6 sm:-translate-x-20',
      '-translate-x-3 sm:-translate-x-12',
    ];
    return pattern[index % pattern.length];
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 font-sans overflow-x-hidden">
      {/* Top Welcome Banner with Course Track Context */}
      <div className="relative mb-8 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <TanCoreMascotAvatar size="lg" className="shadow-md shadow-[#ff7a00]/20 hover:scale-105 transition-transform" />
            <div>
              <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                <span>{language === 'tr' ? `Selam ${firstName}!` : `Hi ${firstName}!`}</span>
              </h1>
            </div>
          </div>

          {/* Placement Test CTA */}
          <button
            onClick={onStartPlacementTest}
            onMouseEnter={() => {
              setIsBtnLogoSpinning(true);
              setTimeout(() => setIsBtnLogoSpinning(false), 1300);
            }}
            className="flex items-center justify-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-[9.5px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all shadow-xs shadow-[#ff7a00]/25 group shrink-0 whitespace-nowrap"
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

        {/* Speech Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4.5 space-y-2.5 text-[11px] sm:text-xs text-slate-700 leading-relaxed shadow-2xs relative">
          <p>
            {language === 'tr' ? (
              <>
                {selectedTrack === 'probability'
                  ? 'Olasılık dersinde '
                  : selectedTrack === 'statistics'
                  ? 'İstatistik dersinde '
                  : 'Müfredatta '}
                şu an <strong className="text-slate-900 font-extrabold">{latestModuleTitle}</strong> aşamasındasın. Toplam <strong className="text-[#ff7a00] font-black">{xp} XP</strong> topladın! 🎯
              </>
            ) : (
              <>
                You are currently studying <strong className="text-slate-900 font-extrabold">{latestModuleTitle}</strong> with total <strong className="text-[#ff7a00] font-black">{xp} XP</strong>! 🎯
              </>
            )}
          </p>

          {nextTopicItem && (
            <p className="pt-2 border-t border-slate-200/60">
              {language === 'tr' ? (
                <>
                  Sıradaki konumuz <strong className="text-slate-900 font-extrabold">{nextTopicItem.title}</strong>: <em>"{nextTopicItem.concept}"</em>
                </>
              ) : (
                <>
                  Next topic is <strong className="text-slate-900 font-extrabold">{nextTopicItem.title}</strong>: <em>"{nextTopicItem.concept}"</em>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Modules Flow */}
      <div className="space-y-12">
        {activeModulesList.map((module, trackIdx) => {
          const isModuleUnlocked =
            trackIdx === 0 ||
            unlockedModules.includes(module.id) ||
            module.id === latestUnlockedModule.id ||
            module.lessons.some((l) => l.id === globalTargetNodeId) ||
            module.caseExams.some((c) => c.id === globalTargetNodeId) ||
            module.lessons.some((l) => completedLessons.includes(l.id));
          const trackModuleOrder = trackIdx + 1; // 1, 2, 3... for active track

          const lessons = module.lessons || [];
          const cases = module.caseExams || [];

          const interleavedNodes: PathNodeItem[] = [];

          if (lessons[0])
            interleavedNodes.push({
              id: lessons[0].id,
              type: 'lesson',
              title: getLocalized(lessons[0].title, language),
              order: 1,
              isCompleted: completedLessons.includes(lessons[0].id),
              isUnlocked: isModuleUnlocked,
              lesson: lessons[0],
              module,
            });
          if (lessons[1])
            interleavedNodes.push({
              id: lessons[1].id,
              type: 'lesson',
              title: getLocalized(lessons[1].title, language),
              order: 2,
              isCompleted: completedLessons.includes(lessons[1].id),
              isUnlocked: isModuleUnlocked,
              lesson: lessons[1],
              module,
            });

          if (cases[0])
            interleavedNodes.push({
              id: cases[0].id,
              type: 'case',
              title: getLocalized(cases[0].title, language),
              order: 3,
              isCompleted: completedCaseExams.includes(cases[0].id),
              isUnlocked: isModuleUnlocked,
              caseExam: cases[0],
              module,
            });

          for (let i = 2; i < lessons.length; i++) {
            interleavedNodes.push({
              id: lessons[i].id,
              type: 'lesson',
              title: getLocalized(lessons[i].title, language),
              order: interleavedNodes.length + 1,
              isCompleted: completedLessons.includes(lessons[i].id),
              isUnlocked: isModuleUnlocked,
              lesson: lessons[i],
              module,
            });
          }

          for (let c = 1; c < cases.length; c++) {
            interleavedNodes.push({
              id: cases[c].id,
              type: 'case',
              title: getLocalized(cases[c].title, language),
              order: interleavedNodes.length + 1,
              isCompleted: completedCaseExams.includes(cases[c].id),
              isUnlocked: isModuleUnlocked,
              caseExam: cases[c],
              module,
            });
          }

          const pathNodes = interleavedNodes;
          const totalNodesCount = pathNodes.length;
          const completedNodesCount = pathNodes.filter((n) => n.isCompleted).length;
          const progressPercent =
            totalNodesCount > 0 ? Math.round((completedNodesCount / totalNodesCount) * 100) : 0;

          let activeFound = false;

          return (
            <div key={module.id} id={`module-section-${module.id}`} className="relative">
              {/* Module Header Card with Local Order Number for active track */}
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
                  </div>

                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-xs">
                    {getModuleMascotIcon(trackModuleOrder, isModuleUnlocked)}
                  </div>
                </div>

                {isModuleUnlocked && (
                  <div className="pt-2 border-t border-white/20">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="opacity-90">
                        {language === 'tr'
                          ? `${completedNodesCount}/${totalNodesCount} Adım Tamamlandı`
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
                          if (!node.isUnlocked) return;
                          setSelectedNode(node);
                        }}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 active:translate-y-1 ${
                          node.isCompleted
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
                              ? 'border-[#ff7a00]/30'
                              : 'border-slate-300'
                          }`}
                        >
                          {node.isCompleted ? (
                            node.type === 'case' ? (
                              <CaseExamIcon className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[1.75]" />
                            ) : (
                              getNodeAnimalIcon(node.order, 'text-white')
                            )
                          ) : isCurrentTarget ? (
                            node.type === 'case' ? (
                              <CaseExamIcon className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[1.75]" />
                            ) : (
                              getNodeAnimalIcon(node.order, 'text-white')
                            )
                          ) : node.isUnlocked ? (
                            node.type === 'case' ? (
                              <CaseExamIcon className="w-7 h-7 sm:w-9 sm:h-9 text-[#ff7a00] stroke-[1.75]" />
                            ) : (
                              getNodeAnimalIcon(node.order, 'text-[#ff7a00]')
                            )
                          ) : node.type === 'case' ? (
                            <CaseExamIcon className="w-7 h-7 sm:w-9 sm:h-9 text-slate-400 stroke-[1.75]" />
                          ) : (
                            getNodeAnimalIcon(node.order, 'text-slate-400')
                          )}
                        </div>
                      </button>

                      <div className="mt-2 flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#ff7a00] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md mb-0.5">
                          {node.type === 'case'
                            ? language === 'tr'
                              ? `VAKA SINAVI (${node.caseExam?.difficulty.toUpperCase()})`
                              : `CASE EXAM (${node.caseExam?.difficulty.toUpperCase()})`
                            : language === 'tr'
                            ? `DERS ${node.lesson?.order}`
                            : `LESSON ${node.lesson?.order}`}
                        </span>
                        <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-extrabold text-slate-800 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-2xl border border-slate-200 shadow-2xs text-center leading-none whitespace-nowrap">
                          {node.title}
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

      {/* Modal Detail Dialog */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ff7a00] text-white flex items-center justify-center shadow-md">
                {selectedNode.type === 'case' ? (
                  <CaseExamIcon className="w-6 h-6" />
                ) : (
                  getNodeAnimalIcon(selectedNode.order, 'text-white')
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-[#ff7a00] tracking-widest font-mono">
                  {selectedNode.type === 'case' ? 'ŞİRKET VAKA SINAVI' : `DERS ${selectedNode.order}`}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-none whitespace-nowrap">
                  {selectedNode.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
              {selectedNode.type === 'case'
                ? selectedNode.caseExam
                  ? getLocalized(selectedNode.caseExam.businessQuestion, language)
                  : ''
                : selectedNode.lesson
                ? getLocalized(selectedNode.lesson.conceptCard, language)
                : ''}
            </p>

            <button
              onClick={() => {
                const node = selectedNode;
                setSelectedNode(null);
                if (node.type === 'lesson') {
                  onSelectLesson(node.id);
                } else {
                  onSelectCaseExam(node.id);
                }
              }}
              className="w-full py-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff7a00]/30 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {selectedNode.isCompleted
                  ? language === 'tr'
                    ? 'TEKRAR İNCELE'
                    : 'REPLAY'
                  : language === 'tr'
                  ? 'BAŞLA (+15 XP)'
                  : 'START (+15 XP)'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
