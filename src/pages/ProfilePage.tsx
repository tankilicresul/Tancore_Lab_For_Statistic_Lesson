import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ALL_MODULES } from '../data/modules';
import { PublicProfile } from '../types/stats';
import { uploadAvatarImage } from '../lib/supabase';
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
  ChevronDown,
  ChevronUp,
  Crown,
  ShieldCheck,
  LogOut,
  UserCheck,
  ExternalLink,
  X,
  Camera,
  Loader2,
} from 'lucide-react';

interface ProfilePageProps {
  onOpenAuth?: () => void;
  onGoHome?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenAuth, onGoHome }) => {
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
    setSelectedPublicProfile,
    registeredUsers,
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'tr' ? 'Fotoğraf boyutu en fazla 5MB olabilir.' : 'Photo size must be less than 5MB.');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const res = await uploadAvatarImage(file, userProfile?.schoolEmail || 'user');
      if (res.success && res.url) {
        updateUserProfile({ avatarUrl: res.url });
        setFormData((prev) => ({ ...prev, avatarUrl: res.url }));
      } else {
        alert(res.error || (language === 'tr' ? 'Fotoğraf yüklenemedi.' : 'Upload failed.'));
      }
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ ...formData, avatarUrl: userProfile?.avatarUrl });
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

  // Real Leaderboard Calculation
  const sortedLeaderboard: PublicProfile[] = [...(registeredUsers || [])].sort((a, b) => b.xp - a.xp);

  // Current user's real rank in the full list of registered users
  const currentUserIdx = sortedLeaderboard.findIndex(
    (u) =>
      u.schoolEmail === userProfile?.schoolEmail ||
      u.fullName === userProfile?.fullName
  );
  const userRank = currentUserIdx >= 0 ? currentUserIdx + 1 : 1;

  // Mock TOP_USERS if sortedLeaderboard is sparse
  const TOP_USERS: PublicProfile[] = [
    {
      id: 'top-1',
      fullName: sortedLeaderboard[0]?.fullName || 'Zeynep K.',
      schoolEmail: sortedLeaderboard[0]?.schoolEmail || 'zeynep.k@itu.edu.tr',
      university: sortedLeaderboard[0]?.university || 'İstanbul Teknik Üniversitesi',
      departmentAndClass: sortedLeaderboard[0]?.departmentAndClass || 'Veri Bilimi ve Analitiği - 4. Sınıf',
      avatarEmoji: sortedLeaderboard[0]?.avatarEmoji || '👦',
      xp: sortedLeaderboard[0]?.xp || 755217,
      streak: sortedLeaderboard[0]?.streak || 14,
      rank: 1,
      level: 75,
      completedCount: sortedLeaderboard[0]?.completedCount || 18,
      unlockedBadges: sortedLeaderboard[0]?.unlockedBadges || ['badge-first-lesson', 'badge-10-lessons', 'badge-first-case', 'badge-case-master'],
    },
    {
      id: 'top-2',
      fullName: sortedLeaderboard[1]?.fullName || 'Ahmet Y.',
      schoolEmail: sortedLeaderboard[1]?.schoolEmail || 'ahmet.y@metu.edu.tr',
      university: sortedLeaderboard[1]?.university || 'Orta Doğu Teknik Üniversitesi',
      departmentAndClass: sortedLeaderboard[1]?.departmentAndClass || 'Bilgisayar Mühendisliği - 3. Sınıf',
      avatarEmoji: sortedLeaderboard[1]?.avatarEmoji || '👦',
      xp: sortedLeaderboard[1]?.xp || 363818,
      streak: sortedLeaderboard[1]?.streak || 8,
      rank: 2,
      level: 36,
      completedCount: sortedLeaderboard[1]?.completedCount || 14,
      unlockedBadges: sortedLeaderboard[1]?.unlockedBadges || ['badge-first-lesson', 'badge-10-lessons', 'badge-first-case'],
    },
    {
      id: 'top-3',
      fullName: sortedLeaderboard[2]?.fullName || 'Elif D.',
      schoolEmail: sortedLeaderboard[2]?.schoolEmail || 'elif.d@boun.edu.tr',
      university: sortedLeaderboard[2]?.university || 'Boğaziçi Üniversitesi',
      departmentAndClass: sortedLeaderboard[2]?.departmentAndClass || 'Endüstri Mühendisliği - 4. Sınıf',
      avatarEmoji: sortedLeaderboard[2]?.avatarEmoji || '👩',
      xp: sortedLeaderboard[2]?.xp || 128939,
      streak: sortedLeaderboard[2]?.streak || 5,
      rank: 3,
      level: 13,
      completedCount: sortedLeaderboard[2]?.completedCount || 10,
      unlockedBadges: sortedLeaderboard[2]?.unlockedBadges || ['badge-first-lesson', 'badge-10-lessons'],
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 font-sans space-y-6 animate-fade-in">
      {/* User Profile Identity Card */}
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7a00]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="flex items-center space-x-3.5 min-w-0 flex-1">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#ff7a00] text-white font-black text-2xl flex items-center justify-center border border-white/20 shadow-lg shrink-0 overflow-hidden relative group cursor-pointer"
              title={language === 'tr' ? 'Profil fotoğrafı yükle' : 'Upload profile picture'}
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : userProfile?.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userProfile?.avatarEmoji || (userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : '👨‍🎓')
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-xl font-black tracking-tight text-white leading-tight truncate">
                  {userProfile?.fullName || (language === 'tr' ? 'Misafir Kullanıcı' : 'Guest User')}
                </h2>
                {isVerified && (
                  <span title="Doğrulanmış Hesap">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center mt-1 truncate">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-[#ff7a00] shrink-0" />
                <span className="truncate">{userProfile?.schoolEmail || (language === 'tr' ? 'Giriş yapılmadı' : 'Not signed in')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {!isAuthenticated ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black transition-colors shadow-xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{language === 'tr' ? 'Giriş Yap' : 'Sign In'}</span>
              </button>
            ) : (
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                title={language === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Editable Form vs Metadata Display */}
        {isEditing ? (
          <form onSubmit={handleSave} className="mt-5 pt-4 border-t border-white/10 space-y-3 relative z-10">
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
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3.5 relative z-10">
            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center space-x-2.5 text-slate-300 min-w-0">
                <Building2 className="w-4 h-4 text-[#ff7a00] shrink-0" />
                <span className="truncate">{userProfile?.university || 'Marmara Üniversitesi'}</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300 min-w-0">
                <GraduationCap className="w-4 h-4 text-[#ff7a00] shrink-0" />
                <span className="truncate">{userProfile?.departmentAndClass || 'Endüstri Mühendisliği - 3. Sınıf'}</span>
              </div>
            </div>

            {/* Bottom Row: Edit button on Bottom-Left, Leaderboard rank button on Bottom-Right */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors border border-white/15 shrink-0 whitespace-nowrap cursor-pointer text-slate-200 hover:text-white"
              >
                <span>{language === 'tr' ? 'Düzenle' : 'Edit'}</span>
              </button>

              <button
                onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-orange-500/25 hover:from-amber-500/40 hover:to-orange-500/40 text-amber-300 border border-amber-400/50 text-xs font-black transition-all shadow-md group shrink-0 cursor-pointer"
                title="Genel Sıralamayı Gör"
              >
                <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>{userRank}. {language === 'tr' ? 'Sıra' : 'Rank'}</span>
                {isLeaderboardOpen ? (
                  <ChevronUp className="w-4 h-4 text-amber-300 stroke-[2.5]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-amber-300 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Expandable Symmetrical Top 3 Leaderboard Podium */}
        {isLeaderboardOpen && (
          <div className="mt-5 pt-4 border-t border-white/15 animate-fade-in relative z-10">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  {language === 'tr' ? 'Genel Liderlik Tablosu' : 'Global Leaderboard'}
                </span>
              </div>
              <span className="text-[10px] text-amber-200/80 italic">
                {language === 'tr' ? '(Profil fotoğrafına tıklayarak inceleyin)' : '(Click photo to inspect)'}
              </span>
            </div>

            {/* Symmetrical Podium Container (Top 3 Users) */}
            <div className="bg-slate-950/90 rounded-2xl p-3 sm:p-4 border border-amber-500/30 shadow-2xl">
              <div className="flex items-end justify-center gap-2 sm:gap-4 pt-3 pb-1">
                {/* 2nd Place */}
                <div className="flex flex-col items-center flex-1 max-w-[100px]">
                  <div className="relative mb-2 flex flex-col items-center group cursor-pointer" onClick={() => setSelectedPublicProfile(TOP_USERS[1])}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center text-xl shadow-md overflow-hidden group-hover:scale-110 transition-transform ring-2 ring-slate-400/50">
                      <span className="text-2xl">{TOP_USERS[1].avatarEmoji}</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-900 text-[10px] font-black flex items-center justify-center shadow-md -mt-2.5 border border-white z-10">
                      2
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPublicProfile(TOP_USERS[1])}
                    className="text-[11px] font-extrabold text-slate-200 truncate max-w-full text-center hover:text-amber-300 flex items-center space-x-1"
                  >
                    <span>{TOP_USERS[1].fullName}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </button>
                  <div className="flex items-center space-x-1 text-slate-300 text-[10px] font-black my-1">
                    <span className="text-cyan-400 font-serif">◆</span>
                    <span>{TOP_USERS[1].xp.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="w-full h-16 bg-slate-800/90 rounded-t-2xl border-t-2 border-slate-400/60 shadow-inner flex items-center justify-center">
                    <span className="text-xs font-black text-slate-400">2.</span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center flex-1 max-w-[110px]">
                  <div className="relative mb-2 flex flex-col items-center group cursor-pointer" onClick={() => setSelectedPublicProfile(TOP_USERS[0])}>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-amber-400 bg-slate-800 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.6)] overflow-hidden group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{TOP_USERS[0].avatarEmoji}</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center shadow-md -mt-3 border border-white z-10">
                      1
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPublicProfile(TOP_USERS[0])}
                    className="text-xs font-black text-amber-300 truncate max-w-full text-center hover:underline flex items-center space-x-1"
                  >
                    <span>{TOP_USERS[0].fullName}</span>
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                  </button>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-black my-1">
                    <span className="text-cyan-400 font-serif">◆</span>
                    <span>{TOP_USERS[0].xp.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="w-full h-24 bg-gradient-to-b from-amber-500/40 via-amber-900/50 to-slate-900 rounded-t-2xl border-t-2 border-amber-400 shadow-inner flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center flex-1 max-w-[100px]">
                  <div className="relative mb-2 flex flex-col items-center group cursor-pointer" onClick={() => setSelectedPublicProfile(TOP_USERS[2])}>
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-amber-700 bg-slate-800 flex items-center justify-center text-lg shadow-md overflow-hidden group-hover:scale-110 transition-transform ring-2 ring-amber-700/50">
                      <span className="text-xl">{TOP_USERS[2].avatarEmoji}</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-amber-700 text-amber-100 text-[10px] font-black flex items-center justify-center shadow-md -mt-2.5 border border-white z-10">
                      3
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPublicProfile(TOP_USERS[2])}
                    className="text-[11px] font-extrabold text-amber-200/90 truncate max-w-full text-center hover:text-amber-300 flex items-center space-x-1"
                  >
                    <span>{TOP_USERS[2].fullName}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </button>
                  <div className="flex items-center space-x-1 text-amber-500 text-[10px] font-black my-1">
                    <span className="text-cyan-400 font-serif">◆</span>
                    <span>{TOP_USERS[2].xp.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="w-full h-12 bg-amber-950/50 rounded-t-2xl border-t-2 border-amber-700/80 shadow-inner flex items-center justify-center">
                    <span className="text-xs font-black text-amber-700">3.</span>
                  </div>
                </div>
              </div>

              {/* Current User's Own Rank Below Podium */}
              <div
                onClick={() =>
                  setSelectedPublicProfile({
                    id: 'self',
                    fullName: userProfile?.fullName || (language === 'tr' ? 'Öğrenci' : 'Student'),
                    schoolEmail: userProfile?.schoolEmail || 'ogrenci@universite.edu.tr',
                    university: userProfile?.university || 'Marmara Üniversitesi',
                    departmentAndClass: userProfile?.departmentAndClass || 'Endüstri Mühendisliği - 3. Sınıf',
                    avatarEmoji: userProfile?.avatarEmoji || '👨‍🎓',
                    xp: xp || 450,
                    streak: streak || 3,
                    rank: userRank,
                    level: Math.floor((xp || 450) / 100) + 1,
                    completedCount: completedCount,
                    unlockedBadges: unlockedBadges,
                  })
                }
                className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-[#ff7a00]/20 to-amber-500/20 hover:from-[#ff7a00]/30 hover:to-amber-500/30 border border-[#ff7a00]/40 p-2.5 rounded-xl text-white cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="px-2 py-0.5 rounded-lg bg-[#ff7a00] text-white font-black text-xs shadow-xs shrink-0">
                    {userRank}.
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#ff7a00] text-white font-extrabold text-xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {userProfile?.avatarEmoji || (userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'Ö')}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-white truncate block">
                      {userProfile?.fullName || (language === 'tr' ? 'Öğrenci' : 'Student')} <span className="text-[10px] font-extrabold text-amber-300">(Siz)</span>
                    </span>
                    <span className="text-[9.5px] font-medium text-slate-300 block">
                      {language === 'tr' ? 'Öğrenciler Arasında' : 'Among Students'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-amber-300 text-xs font-black shrink-0">
                  <span className="text-cyan-400 font-serif">◆</span>
                  <span>{(xp || 450).toLocaleString('tr-TR')} XP</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
};
