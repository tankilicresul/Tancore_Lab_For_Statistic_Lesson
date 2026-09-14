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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {language === 'tr' ? 'Başarı Rozetleri' : 'Achievement Badges'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'tr' ? 'Kazanılan rozetler ve hedefler' : 'Unlocked badges and goals'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges List */}
        <div className="mt-6 grid grid-cols-1 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {BADGE_DEFINITIONS.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`flex items-start space-x-4 p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/5 border-amber-300 text-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? <Award className="w-6 h-6 stroke-[2.5]" /> : <Lock className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">
                      {badge.title[language]}
                    </h3>
                    {isUnlocked && (
                      <span className="flex items-center text-[10px] font-extrabold text-amber-700 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-amber-600" />
                        {language === 'tr' ? 'Kazanıldı' : 'Unlocked'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
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
