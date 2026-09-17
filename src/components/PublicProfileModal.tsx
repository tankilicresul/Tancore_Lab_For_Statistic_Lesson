import React from 'react';
import { PublicProfile } from '../types/stats';
import { getLocalized } from '../utils/localization';
import { UserAvatar } from './UserAvatar';
import { useAppStore } from '../store/useAppStore';
import {
  X,
  Trophy,
  Flame,
  Award,
  GraduationCap,
  Building2,
  TrendingUp,
  Target,
  ShieldCheck,
} from 'lucide-react';

interface PublicProfileModalProps {
  profile: PublicProfile;
  onClose: () => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({ profile, onClose }) => {
  const { language } = useAppStore();

  const rankColor =
    profile.rank === 1
      ? 'from-amber-400 to-yellow-500 text-slate-950 border-amber-300'
      : profile.rank === 2
      ? 'from-slate-300 to-slate-400 text-slate-950 border-slate-200'
      : profile.rank === 3
      ? 'from-amber-700 to-amber-800 text-amber-100 border-amber-600'
      : 'from-slate-700 to-slate-800 text-slate-100 border-slate-600';

  const accuracyRate = Math.min(99, Math.max(88, 92 + (profile.xp % 7)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 overflow-y-auto pr-0.5 flex-1">
          {/* Main User Card Header */}
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff7a00]/20 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />

            <div className="flex items-start space-x-3.5 relative z-10 pr-8">
              {/* Avatar Photo / Emoji */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-[#ff7a00]/60 flex items-center justify-center text-3xl sm:text-4xl shadow-lg overflow-hidden">
                  <UserAvatar
                    avatarUrl={profile.avatarUrl}
                    avatarEmoji={profile.avatarEmoji || '👨‍🎓'}
                    fullName={profile.fullName}
                    size="xl"
                    className="w-full h-full"
                  />
                </div>
                <div
                  className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black border shadow-md bg-gradient-to-r ${rankColor}`}
                >
                  #{profile.rank}
                </div>
              </div>

              {/* User Metadata */}
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white truncate">
                    {profile.fullName}
                  </h3>
                  <span title="Doğrulanmış Öğrenci Hesabı">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  </span>
                </div>

                <div className="space-y-1 mt-1 text-xs text-slate-300 font-medium">
                  <p className="flex items-center space-x-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
                    <span className="truncate">{profile.university}</span>
                  </p>
                  <p className="flex items-center space-x-1.5 truncate">
                    <GraduationCap className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
                    <span className="truncate">{profile.departmentAndClass}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Rank Banner Tag */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold relative z-10">
              <span className="text-slate-400 flex items-center">
                <Trophy className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                {language === 'tr' ? 'Liderlik Sıralaması' : 'Global Rank'}
              </span>
              <span className="text-amber-300 font-black text-sm">
                #{profile.rank} / 120 Öğrenci
              </span>
            </div>
          </div>

          {/* Key Performance Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 text-[#ff7a00] mb-0.5">
                <Trophy className="w-4 h-4" />
                <span className="text-base sm:text-lg font-black">
                  {(profile.xp || 0).toLocaleString('tr-TR')}
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block leading-tight">
                {language === 'tr' ? 'Toplam XP' : 'Total XP'}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 text-amber-600 mb-0.5">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-base sm:text-lg font-black">{profile.streak || 1}</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block leading-tight">
                {language === 'tr' ? 'Günlük Seri' : 'Streak'}
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 text-emerald-600 mb-0.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-base sm:text-lg font-black">{accuracyRate}%</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block leading-tight">
                {language === 'tr' ? 'Başarı Oranı' : 'Accuracy'}
              </span>
            </div>
          </div>

          {/* Curriculum Stats */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Target className="w-3.5 h-3.5 mr-1.5 text-[#ff7a00] shrink-0" />
                {language === 'tr' ? 'Tamamlanan İçerikler' : 'Completed Modules'}
              </span>
              <span className="text-sm font-black text-[#ff7a00]">{profile.completedCount || 12} Modül</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff7a00] to-amber-500 rounded-full"
                style={{ width: `${Math.min(100, Math.round(((profile.completedCount || 12) / 20) * 100))}%` }}
              />
            </div>
          </div>

          {/* Badges Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Award className="w-3.5 h-3.5 mr-1.5 text-[#ff7a00] shrink-0" />
                {language === 'tr' ? 'Kazanılan Rozetler' : 'Badges Earned'}
              </span>
              <span className="text-[11px] font-extrabold text-[#ff7a00] font-mono">
                {(profile.unlockedBadges || []).length} / 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'badge-first-lesson', titleTr: 'İlk Adım', descTr: 'İlk istatistik mikro-dersini tamamladı.' },
                { id: 'badge-10-lessons', titleTr: 'İstatistik Çırağı', descTr: '10 mikro-dersi başarıyla bitirdi.' },
                { id: 'badge-first-case', titleTr: 'Case Çözücü', descTr: 'Gerçek bir şirket vaka sınavını çözdü.' },
                { id: 'badge-case-master', titleTr: 'Outlier Avcısı', descTr: '5 şirket vaka sınavını tamamladı.' },
              ].map((b) => {
                const isUnlocked = (profile.unlockedBadges || ['badge-first-lesson', 'badge-10-lessons']).includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-2.5 rounded-xl border flex items-center space-x-2.5 transition-all ${
                      isUnlocked
                        ? 'bg-white border-orange-200/90 text-slate-900 shadow-2xs'
                        : 'bg-white/60 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isUnlocked ? 'bg-[#ff7a00] text-white shadow-xs' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Award className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{b.titleTr}</h4>
                      <p className="text-[9.5px] text-slate-500 font-medium leading-tight mt-0.5">{b.descTr}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
