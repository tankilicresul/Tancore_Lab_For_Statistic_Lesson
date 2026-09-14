import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Trophy, Award, Target, Zap, CheckCircle2, Lock } from 'lucide-react';
import { Badge } from '../types/stats';

const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'badge-first-lesson',
    title: { tr: 'İlk Adım', en: 'First Step' },
    description: { tr: 'İlk istatistik mikro-dersini tamamladın!', en: 'Completed your first statistics micro-lesson!' },
    icon: 'Target',
  },
  {
    id: 'badge-10-lessons',
    title: { tr: 'İstatistik Çırağı', en: 'Stats Apprentice' },
    description: { tr: '10 mikro-dersi başarıyla bitirdin.', en: 'Completed 10 micro-lessons.' },
    icon: 'Zap',
  },
  {
    id: 'badge-first-case',
    title: { tr: 'Case Çözücü', en: 'Case Solver' },
    description: { tr: 'Gerçek bir şirket vaka sınavını (Case Exam) çözdün!', en: 'Solved your first real company case exam!' },
    icon: 'Award',
  },
  {
    id: 'badge-case-master',
    title: { tr: 'Outlier Avcısı', en: 'Outlier Hunter' },
    description: { tr: '5 şirket vaka sınavını başarıyla tamamladın.', en: 'Completed 5 company case exams.' },
    icon: 'Trophy',
  },
];

interface BadgesModalProps {
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ onClose }) => {
  const { language, unlockedBadges } = useAppStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {language === 'tr' ? 'Başarı Rozetleri' : 'Achievement Badges'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'tr' ? 'Kazanılan rozetler ve hedefler' : 'Unlocked badges and goals'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges List */}
        <div className="mt-6 grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {BADGE_DEFINITIONS.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`flex items-start space-x-4 p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-indigo-950/20 border-indigo-500/30 text-white'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-indigo-600 to-amber-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-200">
                      {badge.title[language]}
                    </h3>
                    {isUnlocked && (
                      <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        {language === 'tr' ? 'Kazanıldı' : 'Unlocked'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {badge.description[language]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
