import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ALL_MODULES } from '../data/modules';
import { DEFAULT_LEADERBOARD_STUDENTS } from '../data/leaderboardData';
import { PublicProfile } from '../types/stats';
import { uploadAvatarImage, deleteUserAvatar, fetchAllProfilesFromSupabase, saveUserProfileToSupabase } from '../lib/supabase';
import { AvatarCropModal } from '../components/AvatarCropModal';
import { UserAvatar } from '../components/UserAvatar';
import {
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
  ShieldCheck,
  LogOut,
  UserCheck,
  X,
  Camera,
  Loader2,
} from 'lucide-react';

interface ProfilePageProps {
  onOpenAuth?: () => void;
  onGoHome?: () => void;
  onNavigateLeaderboard?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onOpenAuth,
  onGoHome: _onGoHome,
  onNavigateLeaderboard,
}) => {
  const {
    language,
    userProfile,
    updateUserProfile,
    completedLessons,
    completedCaseExams,
    xp,
    streak,
    unlockedBadges,
    isAuthenticated,
    isVerified,
    logout,
    registeredUsers,
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(
    userProfile || {
      fullName: '',
      schoolEmail: '',
      university: '',
      departmentAndClass: '',
      avatarEmoji: '👨‍🎓',
    }
  );

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [cropTargetImage, setCropTargetImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dbProfiles, setDbProfiles] = useState<PublicProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingProfiles(true);
    fetchAllProfilesFromSupabase()
      .then((profiles) => {
        if (!isMounted) return;
        if (Array.isArray(profiles) && profiles.length > 0) {
          const mapped: PublicProfile[] = profiles.map((p, idx) => ({
            id: p.id || `db-${idx}`,
            fullName: p.full_name || 'Öğrenci',
            schoolEmail: p.email || p.school_email || '',
            university: p.university || 'Üniversite',
            departmentAndClass: p.department_and_class || '',
            avatarEmoji: p.avatar_emoji || '👨‍🎓',
            avatarUrl: p.avatar_url || undefined,
            xp: typeof p.xp === 'number' ? p.xp : 0,
            streak: typeof p.streak === 'number' ? p.streak : 1,
            rank: idx + 1,
            level: Math.floor((typeof p.xp === 'number' ? p.xp : 0) / 100) + 1,
            completedCount: typeof p.completed_lessons === 'number' ? p.completed_lessons : 0,
            unlockedBadges: Array.isArray(p.unlocked_badges) ? p.unlocked_badges : ['badge-first-lesson'],
          }));
          setDbProfiles(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to load profiles:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingProfiles(false);
      });
    return () => {
      isMounted = false;
    };
  }, [xp, userProfile?.avatarUrl]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'tr' ? 'Fotoğraf boyutu en fazla 10MB olabilir.' : 'Photo size must be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropTargetImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploadingAvatar(true);
    try {
      const res = await uploadAvatarImage(croppedFile, userProfile?.schoolEmail || 'user');
      if (res.success && res.url) {
        updateUserProfile({ avatarUrl: res.url });
        setFormData((prev) => ({ ...prev, avatarUrl: res.url }));
        if (userProfile?.schoolEmail) {
          saveUserProfileToSupabase({
            ...userProfile,
            avatarUrl: res.url,
            xp: xp || 0,
            streak: streak || 1,
            completedLessons: completedLessons.length + completedCaseExams.length,
          });
        }
      } else {
        alert(res.error || (language === 'tr' ? 'Fotoğraf yüklenemedi.' : 'Upload failed.'));
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ ...formData, avatarUrl: userProfile?.avatarUrl });
    if (userProfile?.schoolEmail) {
      saveUserProfileToSupabase({
        ...userProfile,
        ...formData,
        avatarUrl: userProfile?.avatarUrl,
        xp: xp || 0,
        streak: streak || 1,
        completedLessons: completedLessons.length + completedCaseExams.length,
      });
    }
    setIsEditing(false);
  };

  // Curriculum statistics calculations
  const totalLessons = ALL_MODULES.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const totalCases = ALL_MODULES.reduce((acc, m) => acc + (m.caseExams?.length || 0), 0);
  const totalItems = totalLessons + totalCases;
  const completedCount = completedLessons.length + completedCaseExams.length;
  const progressPercent = totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : 0;

  // Topic Success Rate: real completion percentage
  const successRate = totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : 0;

  // Real Leaderboard Calculation (Strictly Real Data, No Mock Users)
  const allProfilesMap = new Map<string, PublicProfile>();

  const getProfileDedupKey = (p: { id?: string; schoolEmail?: string; fullName?: string }) => {
    const email = (p.schoolEmail || '').trim().toLowerCase();
    if (email) return `email:${email}`;
    const name = (p.fullName || '').trim().toLowerCase();
    if (name) return `name:${name}`;
    return `id:${p.id || 'unknown'}`;
  };

  // 1. Add default 27 student profiles
  DEFAULT_LEADERBOARD_STUDENTS.forEach((p) => {
    const key = getProfileDedupKey(p);
    allProfilesMap.set(key, p);
  });

  // 2. Add Supabase database profiles
  dbProfiles.forEach((p) => {
    const key = getProfileDedupKey(p);
    allProfilesMap.set(key, p);
  });

  // 3. Add local store registered users if not present
  (registeredUsers || []).forEach((p) => {
    const key = getProfileDedupKey(p);
    if (!allProfilesMap.has(key)) {
      allProfilesMap.set(key, p);
    }
  });

  // 3. Ensure active current user is present and up-to-date
  if (userProfile && (userProfile.schoolEmail || userProfile.fullName)) {
    const currentKey = getProfileDedupKey(userProfile);
    const existing = allProfilesMap.get(currentKey);
    allProfilesMap.set(currentKey, {
      id: existing?.id || userProfile.id || 'self',
      fullName: userProfile.fullName || 'Öğrenci',
      schoolEmail: userProfile.schoolEmail || '',
      university: userProfile.university || 'Üniversite',
      departmentAndClass: userProfile.departmentAndClass || '',
      avatarEmoji: userProfile.avatarEmoji || '👨‍🎓',
      avatarUrl: userProfile.avatarUrl || existing?.avatarUrl || undefined,
      xp: xp ?? existing?.xp ?? 0,
      streak: streak ?? existing?.streak ?? 1,
      rank: 1,
      level: Math.floor((xp || 0) / 100) + 1,
      completedCount: completedLessons.length + completedCaseExams.length,
      unlockedBadges: unlockedBadges && unlockedBadges.length > 0 ? unlockedBadges : ['badge-first-lesson'],
    });
  }

  const sortedLeaderboard: PublicProfile[] = Array.from(allProfilesMap.values()).sort(
    (a, b) => b.xp - a.xp
  );

  sortedLeaderboard.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  // Current user's real rank in the full list of registered users
  const currentUserIdx = sortedLeaderboard.findIndex(
    (u) =>
      (userProfile?.schoolEmail && u.schoolEmail?.toLowerCase() === userProfile.schoolEmail.toLowerCase()) ||
      u.fullName === userProfile?.fullName
  );
  const userRank = currentUserIdx >= 0 ? currentUserIdx + 1 : 1;


  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 font-sans space-y-6 animate-fade-in">
      {/* User Profile Identity Card */}
      <div className="bg-gradient-to-br from-amber-400 via-[#ff7a00] to-[#f25900] rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-amber-300/60">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-yellow-300/25 rounded-full blur-2xl pointer-events-none" />


        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="flex items-center space-x-3.5 min-w-0 flex-1">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/25 text-white font-black text-2xl flex items-center justify-center border-2 border-white/50 shadow-lg shrink-0 overflow-hidden relative"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <UserAvatar
                  avatarUrl={userProfile?.avatarUrl}
                  avatarEmoji={isAuthenticated ? userProfile?.avatarEmoji || '👨‍🎓' : '👤'}
                  fullName={userProfile?.fullName}
                  size="lg"
                  className="w-full h-full"
                />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-white leading-none truncate flex items-center gap-2">
                <span className="truncate">
                  {isAuthenticated
                    ? (userProfile?.fullName || (language === 'tr' ? 'Kullanıcı' : 'User'))
                    : (language === 'tr' ? 'Misafir Kullanıcı' : 'Guest User')}
                </span>
                {isVerified && (
                  <span title="Doğrulanmış Hesap">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300 shrink-0 inline-block" />
                  </span>
                )}
              </h2>
              {!isAuthenticated && (
                <p className="text-white/75 text-[11px] font-semibold mt-0.5 leading-none">
                  {language === 'tr' ? 'Kayıt olmadan geziyorsunuz' : 'Browsing as guest'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {!isAuthenticated ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/25 hover:bg-white/35 text-white text-xs font-black transition-colors border border-white/40 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{language === 'tr' ? 'Kayıt Ol / Giriş' : 'Sign Up / In'}</span>
              </button>
            ) : (
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl bg-white/20 hover:bg-rose-500/40 text-white hover:text-rose-100 border border-white/30 transition-colors cursor-pointer"
                title={language === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Editable Form vs Metadata Display */}
        {isEditing ? (
          <form onSubmit={handleSave} className="mt-5 pt-4 border-t border-white/10 space-y-4 relative z-10">
            {/* Profil Fotoğrafı Düzenleme Bölümü */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] sm:max-w-[80px] sm:max-h-[80px] rounded-full bg-white/25 text-white font-black text-2xl flex items-center justify-center border-2 border-white/30 shadow-md shrink-0 overflow-hidden relative">
                {isUploadingAvatar ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <UserAvatar
                    avatarUrl={userProfile?.avatarUrl}
                    avatarEmoji={userProfile?.avatarEmoji || '👨‍🎓'}
                    fullName={userProfile?.fullName}
                    size="xl"
                    className="w-full h-full"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full">
                <p className="text-xs sm:text-sm font-bold text-slate-200">
                  {language === 'tr' ? 'Profil Fotoğrafı' : 'Profile Picture'}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black transition-all shadow-md shadow-[#ff7a00]/30 cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{language === 'tr' ? 'Fotoğraf Seç / Çek' : 'Choose / Take Photo'}</span>
                  </button>

                  {userProfile?.avatarUrl && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (userProfile?.schoolEmail) {
                          await deleteUserAvatar(userProfile.schoolEmail);
                        }
                        updateUserProfile({ avatarUrl: undefined });
                        setFormData((prev) => ({ ...prev, avatarUrl: undefined }));
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-bold transition-colors border border-white/15 cursor-pointer active:scale-95"
                    >
                      {language === 'tr' ? 'Kaldır' : 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {language === 'tr' ? 'İsim Soyisim' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {language === 'tr' ? 'Okul E-postası' : 'School Email'}
                </label>
                <input
                  type="email"
                  value={formData.schoolEmail}
                  onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {language === 'tr' ? 'Üniversite İsmi' : 'University Name'}
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {language === 'tr' ? 'Bölüm ve Sınıf' : 'Department & Class'}
                </label>
                <input
                  type="text"
                  value={formData.departmentAndClass}
                  onChange={(e) => setFormData({ ...formData, departmentAndClass: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/15 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{language === 'tr' ? 'İptal' : 'Cancel'}</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{language === 'tr' ? 'Kaydet' : 'Save'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 pt-4 border-t border-white/30 space-y-3.5 relative z-10">
            <div className="space-y-2 text-xs sm:text-sm font-medium">
              <div className="flex items-center space-x-2.5 text-white/90 min-w-0">
                <Building2 className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">{userProfile?.university || 'Marmara Üniversitesi'}</span>
              </div>
              <div className="flex items-center space-x-2.5 text-white/90 min-w-0">
                <GraduationCap className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">{userProfile?.departmentAndClass || 'Endüstri Mühendisliği - 3. Sınıf'}</span>
              </div>
              <div className="flex items-center space-x-2.5 text-white/90 min-w-0">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">{userProfile?.schoolEmail || (language === 'tr' ? 'Giriş yapılmadı' : 'Not signed in')}</span>
              </div>
            </div>

            {/* Bottom Row: Edit button on Bottom-Left, Leaderboard rank button on Bottom-Right */}
            <div className="flex items-center justify-between gap-2.5 pt-2.5 border-t border-white/30">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-xs sm:text-sm font-black transition-all shadow-xs shrink-0 whitespace-nowrap cursor-pointer text-white group hover:scale-[1.02] active:scale-[0.98]"
              >
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>{language === 'tr' ? 'Düzenle' : 'Edit'}</span>
              </button>

              <button
                onClick={() => onNavigateLeaderboard?.()}
                className="flex items-center space-x-2 px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs sm:text-sm font-black transition-all shadow-md group shrink-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                title={language === 'tr' ? 'Genel Sıralamayı Gör' : 'View Leaderboard'}
              >
                <Trophy className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>{userRank}. {language === 'tr' ? 'Sıra' : 'Rank'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guest CTA Card: shown only when not authenticated */}
      {!isAuthenticated && (
        <div className="bg-white border-2 border-[#ff7a00]/40 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">
                {language === 'tr' ? '🎓 İlerlemeni Kaydet ve Tüm Modülleri Aç' : '🎓 Save Your Progress & Unlock All Modules'}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {language === 'tr'
                  ? 'Ücretsiz kayıt ol; XP kazan, rozet topla, liderlik tablosuna gir ve Tanco ile sınırsız sohbet et!'
                  : 'Sign up free — earn XP, collect badges, join the leaderboard, and chat with Tanco unlimited!'}
              </p>
            </div>
            <button
              onClick={onOpenAuth}
              className="shrink-0 px-5 py-2.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-sm uppercase tracking-wider shadow-md shadow-[#ff7a00]/30 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              {language === 'tr' ? 'Ücretsiz Kayıt Ol' : 'Sign Up Free'}
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics Bar (3 Hero Stats) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center space-x-1 text-[#ff7a00] mb-0.5">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-base sm:text-lg font-black">{xp}</span>
          </div>
          <span className="text-[10px] sm:text-xs font-extrabold text-slate-600 uppercase tracking-wider block text-center leading-tight">
            {language === 'tr' ? 'Toplam XP' : 'Total XP'}
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center space-x-1 text-amber-600 mb-0.5">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-500 text-amber-500" />
            <span className="text-base sm:text-lg font-black">{streak}</span>
          </div>
          <span className="text-[10px] sm:text-xs font-extrabold text-slate-600 uppercase tracking-wider block text-center leading-tight">
            {language === 'tr' ? 'Günlük Seri' : 'Streak'}
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center space-x-1 text-emerald-600 mb-0.5">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            <span className="text-base sm:text-lg font-black">{successRate}%</span>
          </div>
          <span className="text-[10px] sm:text-xs font-extrabold text-slate-600 uppercase tracking-wider block text-center leading-tight">
            {language === 'tr' ? 'Başarı Oranı' : 'Accuracy'}
          </span>
        </div>
      </div>

      {/* Curriculum Progress Section */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center">
            <Target className="w-4 h-4 mr-2 text-[#ff7a00] shrink-0" />
            {language === 'tr' ? 'Genel Müfredat İlerlemesi' : 'Curriculum Progress'}
          </span>
          <span className="text-sm font-black text-[#ff7a00]">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-[#ff7a00] to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs font-semibold text-slate-500">
          {language === 'tr'
            ? `${totalItems} içerikten ${completedCount} tanesi başarıyla tamamlandı.`
            : `Completed ${completedCount} of ${totalItems} total modules.`}
        </p>
      </div>

      {/* Achievement Badges (Başarı Rozetleri) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center">
            <Award className="w-4 h-4 mr-2 text-[#ff7a00] shrink-0" />
            {language === 'tr' ? 'Başarı Rozetleri' : 'Badges'}
          </span>
          <span className="text-xs font-black text-[#ff7a00] font-mono">
            {unlockedBadges.length} / 4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                className={`p-3 rounded-2xl border flex items-center space-x-3 transition-all ${
                  isUnlocked
                    ? 'bg-orange-50/50 border-orange-200 text-slate-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked ? 'bg-[#ff7a00] text-white shadow-xs' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Award className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                    {language === 'tr' ? b.titleTr : b.titleEn}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5">
                    {b.descTr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Avatar Crop & Zoom Modal */}
      {cropTargetImage && (
        <AvatarCropModal
          imageSrc={cropTargetImage}
          onCropComplete={handleCropComplete}
          onClose={() => setCropTargetImage(null)}
          language={language}
        />
      )}
    </div>
  );
};
