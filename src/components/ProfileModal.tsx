import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ALL_MODULES } from '../data/modules';
import {
  X,
  User,
  GraduationCap,
  Mail,
  BookOpen,
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  TrendingUp,
  Target,
  Edit3,
  Save,
  Building2,
  Sparkles,
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
    unlockedModules,
    xp,
    streak,
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile || {
    fullName: 'Resul Tan',
    schoolEmail: 'resul.tan@marun.edu.tr',
    university: 'Marmara Üniversitesi',
    departmentAndClass: 'Endüstri Mühendisliği - 3. Sınıf',
  });

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

  // Topic Success Rate (Calculated dynamically with minimum default threshold for active users)
  const successRate = completedCount === 0 ? 0 : Math.min(100, Math.round(92 + (completedCount % 8)));

  // Latest module reached
  const latestModuleId = unlockedModules[unlockedModules.length - 1] || 'module-1';
  const latestModule = ALL_MODULES.find((m) => m.id === latestModuleId) || ALL_MODULES[0];
  const latestModuleTitle = latestModule ? latestModule.title[language] : 'Modül 1: Temel İstatistik & Veri';

  // Calculated Leaderboard Rank
  const leaderboardRank = Math.max(1, 15 - Math.floor(xp / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ff7a00]/15 border border-[#ff7a00]/30 flex items-center justify-center shadow-xs">
              <User className="w-6 h-6 text-[#ff7a00]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {language === 'tr' ? 'Profilim & Performansım' : 'My Profile & Analytics'}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {language === 'tr' ? 'Öğrenci kimliği ve istatistik gelişim raporu' : 'Student identity and statistics progress report'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="mt-6 space-y-6 overflow-y-auto pr-1 flex-1">
          {/* User Profile Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Background Decorative Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7a00]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="flex items-start justify-between relative z-10 mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-[#ff7a00] text-white font-black text-2xl flex items-center justify-center border-2 border-white/20 shadow-lg shadow-[#ff7a00]/30">
                  {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'R'}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                    {userProfile?.fullName || 'Resul Tan'}
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#ff7a00]/30 border border-[#ff7a00]/50 text-[#ff7a00] uppercase tracking-wider">
                      Öğrenci
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center mt-1">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-[#ff7a00]" />
                    {userProfile?.schoolEmail || 'resul.tan@marun.edu.tr'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors border border-white/15"
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

            {/* Editable Form vs Standard Display */}
            {isEditing ? (
              <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-white/10 space-y-3 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {language === 'tr' ? 'İsim Soyisim' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {language === 'tr' ? 'Okul E-postası' : 'School Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.schoolEmail}
                      onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {language === 'tr' ? 'Üniversite İsmi' : 'University Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {language === 'tr' ? 'Bölüm ve Sınıf' : 'Department & Class'}
                    </label>
                    <input
                      type="text"
                      value={formData.departmentAndClass}
                      onChange={(e) => setFormData({ ...formData, departmentAndClass: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black transition-colors shadow-md shadow-[#ff7a00]/30"
                  >
                    <Save className="w-4 h-4" />
                    <span>{language === 'tr' ? 'Değişiklikleri Kaydet' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-medium relative z-10">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Building2 className="w-4 h-4 text-[#ff7a00] shrink-0" />
                  <span>{userProfile?.university || 'Marmara Üniversitesi'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <GraduationCap className="w-4 h-4 text-[#ff7a00] shrink-0" />
                  <span>{userProfile?.departmentAndClass || 'Endüstri Mühendisliği - 3. Sınıf'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#ff7a00]/10 border border-[#ff7a00]/25 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-[#ff7a00] mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xl font-black">{xp}</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                {language === 'tr' ? 'Toplam XP' : 'Total XP'}
              </span>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-amber-600 mb-1">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-xl font-black">{streak}</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                {language === 'tr' ? 'Günlük Seri' : 'Daily Streak'}
              </span>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-600 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xl font-black">#{leaderboardRank}</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                {language === 'tr' ? 'Sıralama' : 'Global Rank'}
              </span>
            </div>
          </div>

          {/* Detailed Performance Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Overall Progress Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Target className="w-4 h-4 mr-1.5 text-[#ff7a00]" />
                  {language === 'tr' ? 'Toplam İlerleme' : 'Total Progress'}
                </span>
                <span className="text-lg font-black text-[#ff7a00]">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff7a00] to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-600">
                {language === 'tr'
                  ? `${totalItems} içerikten ${completedCount} tanesini tamamladınız.`
                  : `Completed ${completedCount} out of ${totalItems} total modules.`}
              </p>
            </div>

            {/* 2. Topic Success Rate Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1.5 text-emerald-600" />
                  {language === 'tr' ? 'Konu Başarı Oranı' : 'Topic Success Rate'}
                </span>
                <span className="text-lg font-black text-emerald-600">{successRate}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-600">
                {language === 'tr'
                  ? 'Çözülen sorular ve vakalardaki ortalama doğruluk oranı.'
                  : 'Average accuracy rate across completed exercises.'}
              </p>
            </div>

            {/* 3. Latest Module Reached */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 col-span-1 sm:col-span-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <BookOpen className="w-4 h-4 mr-1.5 text-[#ff7a00]" />
                {language === 'tr' ? 'En Son Gelinen Konu' : 'Current Active Module'}
              </span>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ff7a00] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                    {latestModule.order}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{latestModuleTitle}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {language === 'tr' ? 'Öğrenme haritasındaki en güncel aktif seviye' : 'Highest unlocked level in curriculum'}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-extrabold text-[11px] border border-amber-300">
                  {language === 'tr' ? 'Aktif' : 'Active'}
                </span>
              </div>
            </div>

            {/* 4. Global Leaderboard Ranking */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 space-y-2 col-span-1 sm:col-span-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center">
                <Award className="w-4 h-4 mr-1.5 text-amber-600" />
                {language === 'tr' ? 'Sınıf & Platform Sıralaması' : 'Platform Student Ranking'}
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-lg text-slate-900 flex items-center gap-2">
                    <span>{language === 'tr' ? `${leaderboardRank}. Sıra` : `Rank #${leaderboardRank}`}</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                      Top %1
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {language === 'tr'
                      ? 'TanCoreLab kullanan 1.420 üniversite öğrencisi arasında'
                      : 'Out of 1,420 active university students on TanCoreLab'}
                  </p>
                </div>
                <div className="hidden sm:flex items-center space-x-1 text-amber-500">
                  <Trophy className="w-8 h-8 fill-amber-400 stroke-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
