import React from 'react';
import { ALL_MODULES } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import { getLocalized } from '../utils/localization';
import { Lock, CheckCircle2, ChevronRight, BarChart3, Dices, Activity, Users, ShieldCheck, GitCompare, TrendingUp, Layers, PieChart, Clock, Trophy, Sparkles } from 'lucide-react';

const ICON_MAP: { [key: string]: React.ElementType } = {
  BarChart3,
  Dices,
  Activity,
  Users,
  ShieldCheck,
  GitCompare,
  TrendingUp,
  Layers,
  PieChart,
  Clock,
  Trophy,
};

interface HomePageProps {
  onSelectLesson: (lessonId: string) => void;
  onSelectCaseExam: (caseId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectLesson, onSelectCaseExam }) => {
  const { language, unlockedModules, completedLessons, completedCaseExams } = useAppStore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      {/* Hero Banner with Clean Light Background and Amber Glow */}
      <div className="relative mb-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/30 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-800 text-xs font-black border border-amber-500/30 mb-4 tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500/20" />
            <span>{language === 'tr' ? 'Etkileşimli İstatistik Öğrenme' : 'Interactive Statistics Learning'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4">
            {language === 'tr'
              ? 'Gerçek Şirket Case’leriyle İstatistikte Ustalaş'
              : 'Master Statistics through Real Company Cases'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium mb-6">
            {language === 'tr'
              ? 'Formül ezberi yok. Duolingo tarzı 6 adımlık mikro-dersler, canlı interaktif grafikler ve gerçek şirket vakalarıyla ilerle.'
              : 'No formula memorization. Learn through Duolingo-style 6-step micro-lessons, live interactive charts, and real company cases.'}
          </p>
        </div>
      </div>

      {/* Curriculum Modules Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {language === 'tr' ? 'Müfredat Haritası (11 Modül)' : 'Curriculum Map (11 Modules)'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {language === 'tr'
              ? 'Tamamlanan dersler yeni modül kilitlerini açar'
              : 'Completed lessons unlock subsequent modules'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {ALL_MODULES.map((module) => {
          const isUnlocked = unlockedModules.includes(module.id);
          const IconComp = module.iconName && ICON_MAP[module.iconName] ? ICON_MAP[module.iconName] : BarChart3;

          // Calculate progress percentage
          const totalItems = module.lessons.length + module.caseExams.length;
          const completedCount =
            module.lessons.filter((l) => completedLessons.includes(l.id)).length +
            module.caseExams.filter((c) => completedCaseExams.includes(c.id)).length;
          const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

          return (
            <div
              key={module.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isUnlocked
                  ? 'bg-white border-slate-200 hover:border-amber-500/40 shadow-xs'
                  : 'bg-slate-100/60 border-slate-200 opacity-60'
              }`}
            >
              {/* Module Header */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white shadow-md shadow-amber-500/20'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? <IconComp className="w-7 h-7 stroke-[2.5]" /> : <Lock className="w-7 h-7" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black uppercase tracking-widest text-amber-700 font-mono">
                        {language === 'tr' ? `Modül ${module.order}` : `Module ${module.order}`}
                      </span>
                      {progressPercent === 100 && (
                        <span className="flex items-center text-[10px] font-extrabold text-amber-800 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-amber-600" />
                          {language === 'tr' ? 'Tamamlandı' : 'Completed'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5 tracking-tight">
                      {getLocalized(module.title, language)}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium line-clamp-2">
                      {getLocalized(module.description, language)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {isUnlocked && (
                  <div className="sm:w-44 shrink-0">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>{language === 'tr' ? 'İlerleme' : 'Progress'}</span>
                      <span className="font-mono text-amber-700 font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Module Content List (Lessons & Case Exams) */}
              {isUnlocked && (
                <div className="p-6 bg-slate-50/70 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Micro-lessons list */}
                  <div>
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-3">
                      {language === 'tr' ? 'Mikro-Dersler' : 'Micro-Lessons'} ({module.lessons.length})
                    </h4>
                    <div className="space-y-2.5">
                      {module.lessons.map((lesson) => {
                        const isDone = completedLessons.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson.id)}
                            className="w-full p-3.5 rounded-2xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 flex items-center justify-between text-left transition-all group shadow-2xs"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
                                  isDone
                                    ? 'bg-amber-500/20 text-amber-800 border border-amber-500/30'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4 text-amber-600" /> : lesson.order}
                              </div>
                              <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800 transition-colors">
                                {getLocalized(lesson.title, language)}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Case Exams list */}
                  <div>
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'tr' ? 'Şirket Vaka Sınavları (Case Exams)' : 'Company Case Exams'}</span>
                    </h4>
                    <div className="space-y-2.5">
                      {module.caseExams.map((caseExam) => {
                        const isCaseDone = completedCaseExams.includes(caseExam.id);
                        const difficultyColor =
                          caseExam.difficulty === 'kolay'
                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                            : caseExam.difficulty === 'orta'
                            ? 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-700 border-rose-500/20';

                        return (
                          <button
                            key={caseExam.id}
                            onClick={() => onSelectCaseExam(caseExam.id)}
                            className="w-full p-3.5 rounded-2xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 flex items-center justify-between text-left transition-all group shadow-2xs"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                                  isCaseDone
                                    ? 'bg-amber-500/20 text-amber-800 border border-amber-500/30'
                                    : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                                }`}
                              >
                                {isCaseDone ? <CheckCircle2 className="w-4 h-4 text-amber-600" /> : <Trophy className="w-3.5 h-3.5 text-amber-600" />}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800 transition-colors block">
                                  {getLocalized(caseExam.title, language)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${difficultyColor}`}>
                                {caseExam.difficulty}
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
