import React, { useState } from 'react';
import { ALL_MODULES } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import { getLocalized } from '../utils/localization';
import { Lock, CheckCircle2, Trophy, Sparkles, BookOpen, Star, Play, ArrowRight, ArrowLeft } from 'lucide-react';
import { Lesson, CaseExam, Module } from '../types/stats';

interface HomePageProps {
  onSelectLesson: (lessonId: string) => void;
  onSelectCaseExam: (caseId: string) => void;
}

// Node item in the TanCoreLab snake path sequence
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

export const HomePage: React.FC<HomePageProps> = ({ onSelectLesson, onSelectCaseExam }) => {
  const { language, unlockedModules, completedLessons, completedCaseExams } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<PathNodeItem | null>(null);

  // Group items into rows of 4 for Desktop Horizontal Snake Layout
  const ITEMS_PER_ROW = 4;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      {/* Top Welcome Banner */}
      <div className="relative mb-10 p-8 rounded-3xl bg-gradient-to-r from-[#ff7a00]/10 via-[#ff7a00]/5 to-[#ff7a00]/10 border border-[#ff7a00]/30 shadow-xs text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] text-xs font-black border border-[#ff7a00]/30 mb-3 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#ff7a00] fill-[#ff7a00]/20" />
          <span>{language === 'tr' ? 'TanCoreLab Masaüstü Öğrenme Haritası' : 'TanCoreLab Desktop Learning Map'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {language === 'tr' ? 'Masaüstü Yılan Kıvrımlı Öğrenme Yolu' : 'Desktop Winding Snake Learning Path'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 max-w-2xl mx-auto">
          {language === 'tr'
            ? 'Soldan sağa, sonra aşağıya ve sağdan sola kıvrılan masaüstüne özel yılan haritasıyla konuları adım adım tamamla!'
            : 'Complete subjects step-by-step across a desktop-optimized horizontal winding snake path!'}
        </p>
      </div>

      {/* Modules Flow */}
      <div className="space-y-16">
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

          // Chunk nodes into rows of 4 for horizontal winding
          const rows: PathNodeItem[][] = [];
          for (let i = 0; i < pathNodes.length; i += ITEMS_PER_ROW) {
            rows.push(pathNodes.slice(i, i + ITEMS_PER_ROW));
          }

          // Track current active node in module
          let activeFound = false;

          return (
            <div key={module.id} className="relative">
              {/* Module Banner */}
              <div
                className={`p-6 rounded-3xl mb-10 border transition-all shadow-md ${
                  isModuleUnlocked
                    ? 'bg-[#ff7a00] text-white border-[#ff7a00] shadow-[#ff7a00]/20'
                    : 'bg-slate-200 text-slate-500 border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest opacity-90 font-mono">
                      {language === 'tr' ? `MODÜL ${module.order}` : `MODULE ${module.order}`}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                      {getLocalized(module.title, language)}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-90 font-medium line-clamp-1 mt-1">
                      {getLocalized(module.description, language)}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    {isModuleUnlocked ? <BookOpen className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-slate-500" />}
                  </div>
                </div>
              </div>

              {/* Desktop Horizontal Winding Snake Map */}
              <div className="space-y-12 relative px-4">
                {rows.map((rowNodes, rIdx) => {
                  const isEvenRow = rIdx % 2 === 0; // even: Left -> Right, odd: Right -> Left
                  const displayNodes = isEvenRow ? rowNodes : [...rowNodes].reverse();
                  const isLastRow = rIdx === rows.length - 1;

                  return (
                    <div key={rIdx} className="relative">
                      {/* Row Direction Indicator */}
                      <div className="hidden md:flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 px-4">
                        <span>
                          {isEvenRow
                            ? language === 'tr' ? 'Soldan Sağa ➔' : 'Left to Right ➔'
                            : language === 'tr' ? '◄ Sağdan Sola' : '◄ Right to Left'}
                        </span>
                        <span className="font-mono">Satır {rIdx + 1}</span>
                      </div>

                      {/* Horizontal Row Nodes Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative items-center">
                        {displayNodes.map((node) => {
                          let isCurrentTarget = false;
                          if (isModuleUnlocked && !node.isCompleted && !activeFound) {
                            isCurrentTarget = true;
                            activeFound = true;
                          }

                          return (
                            <div
                              key={node.id}
                              className="relative flex flex-col items-center justify-center py-2"
                            >
                              {/* Floating 'BAŞLA / START' Badge for active target */}
                              {isCurrentTarget && (
                                <div className="absolute -top-10 z-20 animate-bounce">
                                  <div className="bg-[#ff7a00] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center space-x-1 border-2 border-white">
                                    <Play className="w-3 h-3 fill-white" />
                                    <span>{language === 'tr' ? 'BAŞLA' : 'START'}</span>
                                  </div>
                                </div>
                              )}

                              {/* 3D Duolingo Level Button */}
                              <button
                                onClick={() => {
                                  if (!node.isUnlocked) return;
                                  setSelectedNode(node);
                                }}
                                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-200 active:translate-y-1 ${
                                  node.isCompleted
                                    ? 'bg-[#ff7a00] text-white shadow-[0_8px_0_0_#cc6100] hover:bg-[#e56d00]'
                                    : isCurrentTarget
                                    ? 'bg-[#ff7a00] text-white shadow-[0_10px_0_0_#cc6100] ring-4 ring-[#ff7a00]/30 animate-pulse'
                                    : node.isUnlocked
                                    ? 'bg-orange-50 text-[#ff7a00] border-3 border-[#ff7a00] shadow-[0_8px_0_0_#ffc299]'
                                    : 'bg-slate-200 text-slate-400 shadow-[0_6px_0_0_#cbd5e1] cursor-not-allowed'
                                }`}
                              >
                                {/* Inner Ring */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/40 flex items-center justify-center">
                                  {node.isCompleted ? (
                                    <CheckCircle2 className="w-10 h-10 text-white stroke-[2.5]" />
                                  ) : node.type === 'case' ? (
                                    <Trophy className="w-9 h-9 text-white stroke-[2.5]" />
                                  ) : isCurrentTarget ? (
                                    <Star className="w-9 h-9 text-white fill-white stroke-[2.5]" />
                                  ) : node.isUnlocked ? (
                                    <BookOpen className="w-8 h-8 text-[#ff7a00]" />
                                  ) : (
                                    <Lock className="w-8 h-8 text-slate-400" />
                                  )}
                                </div>
                              </button>

                              {/* Title Label Below */}
                              <span className="mt-3 text-xs font-black text-slate-800 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs text-center max-w-[160px] truncate">
                                {node.type === 'case' ? `🏆 ${node.title}` : node.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop Winding Snake Connecting Curved Turn on Right or Left */}
                      {!isLastRow && (
                        <div className="hidden md:block absolute -bottom-10 inset-x-0 h-10 pointer-events-none">
                          {isEvenRow ? (
                            // Curved turn down on the RIGHT side
                            <div className="absolute right-12 top-0 bottom-0 w-24 border-r-4 border-b-4 border-[#ff7a00]/40 rounded-br-3xl" />
                          ) : (
                            // Curved turn down on the LEFT side
                            <div className="absolute left-12 top-0 bottom-0 w-24 border-l-4 border-b-4 border-[#ff7a00]/40 rounded-bl-3xl" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal upon clicking Node */}
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
                {selectedNode.type === 'case' ? <Trophy className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
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
