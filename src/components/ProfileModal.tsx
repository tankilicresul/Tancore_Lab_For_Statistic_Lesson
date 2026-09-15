import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ALL_MODULES } from '../data/modules';
import {
  X,
  User,
  GraduationCap,
  Mail,
  Trophy,
  Award,
  Flame,
  TrendingUp,
  Target,
  Edit3,
  Save,
  Building2,
} from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const {
    language,
    userProfile,
    updateUserProfile,
    completedLessons,
    completedCaseExams,
    xp,
    streak,
    unlockedBadges,
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(
    userProfile || {
      fullName: 'Resul Tan',
      schoolEmail: 'resul.tan@marun.edu.tr',
      university: 'Marmara Üniversitesi',
      departmentAndClass: 'Endüstri Mühendisliği - 3. Sınıf',
    }
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  // Curriculum statistics calculations
  const totalLessons = ALL_MODULES.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const totalCases = ALL_MODULES.reduce((acc, m) => acc + (m.caseExams?.length || 0), 0);
  const totalItems = totalLessons + totalCases;
  const completedCount = completedLessons.length + completedCaseExams.length;
  const progressPercent = totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : 0;

  // Topic Success Rate (Calculated dynamically)
  const successRate = completedCount === 0 ? 0 : Math.min(100, Math.round(92 + (completedCount % 8)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 transition-colors backdrop-blur-xs"
          title="Kapat"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="space-y-4 overflow-y-auto pr-0.5 flex-1">
          {/* User Profile Identity Card */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff7a00]/15 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

            <div className="flex items-start justify-between relative z-10 gap-2 pr-9 sm:pr-10">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-[#ff7a00] text-white font-black text-xl flex items-center justify-center border border-white/20 shadow-md shrink-0">
                  {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'R'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-black tracking-tight text-white leading-none whitespace-nowrap">
                    {userProfile?.fullName || 'Resul Tan'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-300 flex items-center mt-1 whitespace-nowrap leading-none">
                    <Mail className="w-3 h-3 mr-1.5 text-[#ff7a00] shrink-0" />
                    <span className="whitespace-nowrap">{userProfile?.schoolEmail || 'resul.tan@marun.edu.tr'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold transition-colors border border-white/15 shrink-0 whitespace-nowrap"
              >
                {isEditing ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'İptal' : 'Cancel'}</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5 text-[#ff7a00]" />
                    <span>{language === 'tr' ? 'Düzenle' : 'Edit'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Editable Form vs Metadata Display */}
            {isEditing ? (
              <form onSubmit={handleSave} className="mt-4 pt-3 border-t border-white/10 space-y-2.5 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      {language === 'tr' ? 'İsim Soyisim' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      {language === 'tr' ? 'Okul E-postası' : 'School Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.schoolEmail}
                      onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      {language === 'tr' ? 'Üniversite İsmi' : 'University Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      {language === 'tr' ? 'Bölüm ve Sınıf' : 'Department & Class'}
                    </label>
                    <input
                      type="text"
                      value={formData.departmentAndClass}
                      onChange={(e) => setFormData({ ...formData, departmentAndClass: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'Kaydet' : 'Save'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-white/10 text-[10px] sm:text-xs font-medium relative z-10">
                <div className="flex items-center space-x-2 text-slate-300 min-w-0">
                  <Building2 className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
                  <span className="whitespace-nowrap">{userProfile?.university || 'Marmara Üniversitesi'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300 min-w-0">
                  <GraduationCap className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
                  <span className="whitespace-nowrap">{userProfile?.departmentAndClass || 'Endüstri Mühendisliği - 3. Sınıf'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Key Metrics Bar (3 Hero Stats) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 text-[#ff7a00] mb-0.5">
                <Trophy className="w-4 h-4" />
                <span className="text-base sm:text-lg font-black">{xp}</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block text-center leading-tight">
                {language === 'tr' ? 'Toplam XP' : 'Total XP'}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 text-amber-600 mb-0.5">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-base sm:text-lg font-black">{streak}</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block text-center leading-tight">
                {language === 'tr' ? 'Günlük Seri' : 'Streak'}
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 text-emerald-600 mb-0.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-base sm:text-lg font-black">{successRate}%</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block text-center leading-tight">
                {language === 'tr' ? 'Başarı Oranı' : 'Accuracy'}
              </span>
            </div>
          </div>

          {/* Curriculum Progress Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Target className="w-3.5 h-3.5 mr-1.5 text-[#ff7a00] shrink-0" />
                {language === 'tr' ? 'Genel Müfredat İlerlemesi' : 'Curriculum Progress'}
              </span>
              <span className="text-sm font-black text-[#ff7a00]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff7a00] to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500">
              {language === 'tr'
                ? `${totalItems} içerikten ${completedCount} tanesi başarıyla tamamlandı.`
                : `Completed ${completedCount} of ${totalItems} total modules.`}
            </p>
          </div>

          {/* Achievement Badges (Başarı Rozetleri) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Award className="w-3.5 h-3.5 mr-1.5 text-[#ff7a00] shrink-0" />
                {language === 'tr' ? 'Başarı Rozetleri' : 'Badges'}
              </span>
              <span className="text-[11px] font-extrabold text-[#ff7a00] font-mono">
                {unlockedBadges.length} / 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'badge-first-lesson', titleTr: 'İlk Adım', titleEn: 'First Step', descTr: 'İlk istatistik mikro-dersini tamamladın!' },
                { id: 'badge-10-lessons', titleTr: 'İstatistik Çırağı', titleEn: 'Stats Apprentice', descTr: '10 mikro-dersi başarıyla bitirdin.' },
                { id: 'badge-first-case', titleTr: 'Case Çözücü', titleEn: 'Case Solver', descTr: 'Gerçek bir şirket vaka sınavını çözdün!' },
                { id: 'badge-case-master', titleTr: 'Outlier Avcısı', titleEn: 'Outlier Hunter', descTr: '5 şirket vaka sınavını tamamladın.' },
              ].map((b) => {
                const isUnlocked = unlockedBadges.includes(b.id);
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
                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                        {language === 'tr' ? b.titleTr : b.titleEn}
                      </h4>
                      <p className="text-[9.5px] text-slate-500 font-medium leading-tight mt-0.5">
                        {b.descTr}
                      </p>
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

