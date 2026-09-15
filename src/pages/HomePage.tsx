import React, { useState } from 'react';
import { ALL_MODULES } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import { getLocalized } from '../utils/localization';
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
} from 'lucide-react';
import { Lesson, CaseExam, Module } from '../types/stats';

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
    default:
      return <PawPrint className={`${strokeClass} ${iconColorClass}`} />;
  }
};

export const getNodeAnimalIcon = (subStepIndex: number, colorClass: string) => {
  const iconClass = `w-7 h-7 sm:w-9 sm:h-9 ${colorClass} stroke-[1.75]`;

  if (subStepIndex === 1) {
    // 1. Alt Konu / Adım (En Kolay): Tavşan 🐰
    return <Rabbit className={iconClass} />;
  } else if (subStepIndex === 2) {
    // 2. Alt Konu / Adım (Orta Zorluk): Kedi 🐱
    return <Cat className={iconClass} />;
  } else if (subStepIndex === 3) {
    // 3. Alt Konu / Adım (Orta Üstü Zorluk): Pati / Kanguru 🐾
    return <PawPrint className={iconClass} />;
  } else {
    // 4. veya 5. Alt Konu / Adım (En Zor / Zirve): Köpek / Aslan 🐶
    return <Dog className={iconClass} />;
  }
};

interface HomePageProps {
  onSelectLesson: (lessonId: string) => void;
  onSelectCaseExam: (caseId: string) => void;
  onStartPlacementTest: () => void;
}

// Node item in the Duolingo path sequence
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

export const HomePage: React.FC<HomePageProps> = ({
  onSelectLesson,
  onSelectCaseExam,
  onStartPlacementTest,
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

  // Derive dynamic user first name
  const firstName = userProfile?.fullName
    ? userProfile.fullName.trim().split(' ')[0]
    : language === 'tr'
    ? 'Resul'
    : 'Resul';

  // Current highest unlocked module title
  const latestModuleId = unlockedModules[unlockedModules.length - 1] || 'module-1';
  const latestModule = ALL_MODULES.find((m) => m.id === latestModuleId) || ALL_MODULES[0];
  const latestModuleTitle = getLocalized(latestModule.title, language);

  // Find next active uncompleted topic across unlocked modules
  let nextTopicItem: { title: string; concept: string } | null = null;
  for (const module of ALL_MODULES) {
    if (!unlockedModules.includes(module.id)) continue;

    for (const l of module.lessons) {
      if (!completedLessons.includes(l.id)) {
        nextTopicItem = {
          title: getLocalized(l.title, language),
          concept: getLocalized(l.conceptCard, language),
        };
        break;
      }
    }
    if (nextTopicItem) break;

    for (const c of module.caseExams) {
      if (!completedCaseExams.includes(c.id)) {
        nextTopicItem = {
          title: getLocalized(c.title, language),
          concept: getLocalized(c.businessQuestion, language),
        };
        break;
      }
    }
    if (nextTopicItem) break;
  }

  // Fallback if all unlocked items are completed
  if (!nextTopicItem) {
    const firstLesson = ALL_MODULES[0].lessons[0];
    nextTopicItem = {
      title: getLocalized(firstLesson.title, language),
      concept: getLocalized(firstLesson.conceptCard, language),
    };
  }

  // S-Curve horizontal offsets for nodes in sequence (authentic Duolingo vertical snake path)
  const getXOffsetClass = (index: number) => {
    const pattern = [
      'self-center',
      'translate-x-6 sm:translate-x-12',
      'translate-x-10 sm:translate-x-20',
      'translate-x-6 sm:translate-x-12',
      'self-center',
      '-translate-x-6 sm:-translate-x-12',
      '-translate-x-10 sm:-translate-x-20',
      '-translate-x-6 sm:-translate-x-12',
    ];
    return pattern[index % pattern.length];
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 font-sans">
      {/* Top Welcome Banner with Personalized Speech Greeting */}
      <div className="relative mb-8 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-[#ff7a00] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#ff7a00]/30 shrink-0">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] text-[10px] font-black border border-[#ff7a00]/30 uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'tr' ? 'Kişisel İstatistik Rehberi' : 'Personal Stats Guide'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'tr' ? `Selam ${firstName}! 👋` : `Hi ${firstName}! 👋`}
            </h1>
          </div>
        </div>

        {/* Dynamic Personal Progress & Next Topic Speech Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-2xs">
          <p>
            {language === 'tr' ? (
              <>
                Bugüne kadar <strong className="text-slate-900 font-extrabold">Modül {latestModule.order}: {latestModuleTitle}</strong> seviyesine kadar gelip toplam <strong className="text-[#ff7a00] font-black">{xp} XP</strong> topladın! 🎯
              </>
            ) : (
              <>
                So far you have reached <strong className="text-slate-900 font-extrabold">Module {latestModule.order}: {latestModuleTitle}</strong> and earned <strong className="text-[#ff7a00] font-black">{xp} XP</strong>! 🎯
              </>
            )}
          </p>

          <p className="pt-2 border-t border-slate-200/60">
            {language === 'tr' ? (
              <>
                Sıradaki konumuz <strong className="text-slate-900 font-extrabold">{nextTopicItem.title}</strong>: <em>"{nextTopicItem.concept}"</em>
                <br />
                <span className="font-extrabold text-[#ff7a00] inline-block mt-1.5">
                  Haydi haritada sıradaki konunun ikonuna bas, çalışmaya başlayalım! 🚀
                </span>
              </>
            ) : (
              <>
                Our next topic is <strong className="text-slate-900 font-extrabold">{nextTopicItem.title}</strong>: <em>"{nextTopicItem.concept}"</em>
                <br />
                <span className="font-extrabold text-[#ff7a00] inline-block mt-1.5">
                  Let's click the next topic icon on the map to start studying! 🚀
                </span>
              </>
            )}
          </p>
        </div>

        {/* Placement Test CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={onStartPlacementTest}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 group"
          >
            <Sparkles className="w-4 h-4 fill-white group-hover:rotate-12 transition-transform" />
            <span>
              {language === 'tr'
                ? 'İstatistik Seviyeni Biliyor musun? Seviye Belirleme Sınavına Gir 🚀'
                : 'Know Your Stats Level? Take Placement Test 🚀'}
            </span>
          </button>
        </div>
      </div>

      {/* Modules Flow */}
      <div className="space-y-12">
        {ALL_MODULES.map((module) => {
          const isModuleUnlocked = unlockedModules.includes(module.id);

          // Flatten lessons + case exams into a unified sequential path list for this module
          const pathNodes: PathNodeItem[] = [
            ...module.lessons.map((l) => ({
              id: l.id,
              type: 'lesson' as const,
              title: getLocalized(l.title, language),
              order: l.order,
              isCompleted: completedLessons.includes(l.id),
              isUnlocked: isModuleUnlocked,
              lesson: l,
              module,
            })),
            ...module.caseExams.map((c, cIdx) => ({
              id: c.id,
              type: 'case' as const,
              title: getLocalized(c.title, language),
              order: module.lessons.length + cIdx + 1,
              isCompleted: completedCaseExams.includes(c.id),
              isUnlocked: isModuleUnlocked,
              caseExam: c,
              module,
            })),
          ];

          // Determine active next node in module
          let activeFound = false;

          return (
            <div key={module.id} className="relative">
              {/* Module Header Card (Duolingo Banner) */}
              <div
                className={`sticky top-16 z-30 p-5 rounded-3xl mb-8 border transition-all shadow-md ${
                  isModuleUnlocked
                    ? 'bg-[#ff7a00] text-white border-[#ff7a00] shadow-[#ff7a00]/20'
                    : 'bg-slate-200 text-slate-500 border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-90 font-mono">
                      {language === 'tr' ? `MODÜL ${module.order}` : `MODULE ${module.order}`}
                    </span>
                    <h2 className="text-lg font-black tracking-tight leading-snug">
                      {getLocalized(module.title, language)}
                    </h2>
                    <p className="text-xs opacity-90 font-medium mt-0.5">
                      {getLocalized(module.description, language)}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-xs">
                    {getModuleMascotIcon(module.order, isModuleUnlocked)}
                  </div>
                </div>
              </div>

              {/* Authentic Duolingo Vertical S-Curve Path Nodes */}
              <div className="relative flex flex-col items-center py-4 space-y-6">
                {/* Connecting Path Line */}
                <div className="absolute top-4 bottom-4 w-1 bg-slate-200 -z-10 rounded-full" />

                {pathNodes.map((node, nIdx) => {
                  let isCurrentTarget = false;
                  if (isModuleUnlocked && !node.isCompleted && !activeFound) {
                    isCurrentTarget = true;
                    activeFound = true;
                  }

                  const offsetClass = getXOffsetClass(nIdx);

                  return (
                    <div
                      key={node.id}
                      className={`relative flex flex-col items-center transition-all duration-300 ${offsetClass}`}
                    >
                      {/* Floating 'BAŞLA / START' Badge for active target */}
                      {isCurrentTarget && (
                        <div className="absolute -top-9 z-20 animate-bounce">
                          <div className="bg-[#ff7a00] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center space-x-1 border border-white">
                            <Play className="w-3 h-3 fill-white" />
                            <span>{language === 'tr' ? 'BAŞLA' : 'START'}</span>
                          </div>
                        </div>
                      )}

                      {/* 3D Duolingo Circular Level Button */}
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
                        {/* Inner Ring with High-Contrast Border */}
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
                              <Trophy className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[1.75]" />
                            ) : (
                              getNodeAnimalIcon(node.order, 'text-white')
                            )
                          ) : isCurrentTarget ? (
                            node.type === 'case' ? (
                              <Trophy className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[1.75]" />
                            ) : (
                              getNodeAnimalIcon(node.order, 'text-white')
                            )
                          ) : node.isUnlocked ? (
                            node.type === 'case' ? (
                              <Trophy className="w-7 h-7 sm:w-9 sm:h-9 text-[#ff7a00] stroke-[1.75]" />
                            ) : (
                              getNodeAnimalIcon(node.order, 'text-[#ff7a00]')
                            )
                          ) : node.type === 'case' ? (
                            <Trophy className="w-7 h-7 sm:w-9 sm:h-9 text-slate-400 stroke-[1.75]" />
                          ) : (
                            getNodeAnimalIcon(node.order, 'text-slate-400')
                          )}
                        </div>
                      </button>

                      {/* Node Label Below */}
                      <span className="mt-2 text-[11px] font-extrabold text-slate-700 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-2xl border border-slate-200 shadow-2xs max-w-[240px] sm:max-w-[300px] text-center leading-tight whitespace-nowrap truncate">
                        {node.type === 'case' ? `🏆 ${node.title}` : node.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Duolingo Floating Detail Card Modal upon clicking a Node */}
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
                {selectedNode.type === 'case' ? <Trophy className="w-6 h-6" /> : getNodeAnimalIcon(selectedNode.order, 'text-white')}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-[#ff7a00] tracking-widest font-mono">
                  {selectedNode.type === 'case' ? 'ŞİRKET VAKA SINAVI' : `DERS ${selectedNode.order}`}
                </span>
                <h3 className="text-base font-black text-slate-900 leading-tight">
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
                  ? language === 'tr' ? 'TEKRAR İNCELE' : 'REPLAY'
                  : language === 'tr' ? 'BAŞLA (+15 XP)' : 'START (+15 XP)'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
