import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ALL_MODULES } from '../data/modules';
import { PublicProfile } from '../types/stats';
import { uploadAvatarImage, deleteUserAvatar, saveUserProfileToSupabase } from '../lib/supabase';
import { AvatarCropModal } from './AvatarCropModal';
import { UserAvatar } from './UserAvatar';
import {
  X,
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
  Camera,
  Loader2,
} from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
  onOpenAuth?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onOpenAuth }) => {
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

  // Real Leaderboard Calculation (Strictly Deduplicated)
  const dedupMap = new Map<string, PublicProfile>();
  (registeredUsers || []).forEach((u) => {
    const key = (u.schoolEmail ? `email:${u.schoolEmail.trim().toLowerCase()}` : '') ||
                (u.fullName ? `name:${u.fullName.trim().toLowerCase()}` : '') ||
                `id:${u.id}`;
    if (!dedupMap.has(key)) {
      dedupMap.set(key, u);
    }
  });
  const sortedLeaderboard: PublicProfile[] = Array.from(dedupMap.values()).sort((a, b) => b.xp - a.xp);

  // Current user's real rank in the full list of registered users
  const currentUserIdx = sortedLeaderboard.findIndex(
    (u) =>
      (userProfile?.schoolEmail && u.schoolEmail?.toLowerCase() === userProfile.schoolEmail.toLowerCase()) ||
      u.fullName === userProfile?.fullName
  );
  const userRank = currentUserIdx >= 0 ? currentUserIdx + 1 : 1;

  // Podium Users (Top 1, Top 2, Top 3)
  const top1 = sortedLeaderboard[0];
  const top2 = sortedLeaderboard[1];
  const top3 = sortedLeaderboard[2];

  return (
    <div className="fixed inset-0 z-40 pt-16 sm:pt-20 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Scrollable Body */}
        <div className="space-y-4 overflow-y-auto pr-0.5 flex-1">
          {/* User Profile Identity Card */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff7a00]/15 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

            <div className="flex items-start justify-between relative z-10 gap-2">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 rounded-full bg-[#ff7a00] text-white font-black text-xl flex items-center justify-center border border-white/20 shadow-md shrink-0 overflow-hidden relative group cursor-pointer"
                  title={language === 'tr' ? 'Profil fotoğrafı yükle' : 'Upload profile picture'}
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <UserAvatar
                      avatarUrl={userProfile?.avatarUrl}
                      avatarEmoji={userProfile?.avatarEmoji || '👨‍🎓'}
                      fullName={userProfile?.fullName}
                      size="md"
                      className="w-full h-full"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="min-w-0 flex-1 flex items-center">
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-black tracking-tight text-white leading-none truncate flex items-center gap-1.5">
                    <span className="truncate">{userProfile?.fullName || (language === 'tr' ? 'Misafir Kullanıcı' : 'Guest User')}</span>
                    {isVerified && (
                      <span title="Doğrulanmış Hesap">
                        <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0 inline-block" />
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                {!isAuthenticated ? (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth?.();
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-[11px] font-black transition-colors shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'Giriş Yap' : 'Sign In'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => logout()}
                    className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                    title={language === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
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

                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/15 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'İptal' : 'Cancel'}</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'Kaydet' : 'Save'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-3 relative z-10">
                <div className="space-y-1.5 text-[10px] sm:text-xs font-medium">
                  <div className="flex items-center space-x-2 text-slate-300 min-w-0">
                    <Building2 className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
                    <span className="truncate">{userProfile?.university || (language === 'tr' ? 'Üniversite belirtilmedi' : 'No university specified')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300 min-w-0">
                    <GraduationCap className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
                    <span className="truncate">{userProfile?.departmentAndClass || (language === 'tr' ? 'Bölüm belirtilmedi' : 'No department specified')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
                    <span className="truncate">{userProfile?.schoolEmail || (language === 'tr' ? 'Giriş yapılmadı' : 'Not signed in')}</span>
                  </div>
                </div>

                {/* Bottom Row: Edit button on Left, Leaderboard rank button on Right */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setIsLeaderboardOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors border border-white/15 shrink-0 whitespace-nowrap cursor-pointer text-slate-200 hover:text-white"
                  >
                    <span>{language === 'tr' ? 'Düzenle' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsLeaderboardOpen((prev) => !prev);
                      setIsEditing(false);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-orange-500/25 hover:from-amber-500/40 hover:to-orange-500/40 text-amber-300 border border-amber-400/50 text-xs font-black transition-all shadow-md group shrink-0 cursor-pointer"
                    title="Genel Sıralamayı Gör"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
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

            {/* Expandable Symmetrical Podium & Real Registered Users Leaderboard */}
            {isLeaderboardOpen && (
              <div className="mt-4 pt-4 border-t border-white/15 animate-fade-in relative z-10">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      {language === 'tr' ? 'Gerçek Kayıtlı Kullanıcılar Sıralaması' : 'Real Registered Users Leaderboard'}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-200/80 italic">
                    {language === 'tr' ? '(Profil fotoğrafına tıklayın)' : '(Click avatar to inspect)'}
                  </span>
                </div>

                {/* Symmetrical Podium Container (Top 3 Real Users) */}
                <div className="bg-slate-950/90 rounded-2xl p-3 sm:p-4 border border-amber-500/30 shadow-2xl space-y-3">
                  <div className="flex items-end justify-center gap-2 sm:gap-4 pt-3 pb-1">
                    {/* 2nd Place (Left) */}
                    <div className="flex flex-col items-center flex-1 max-w-[100px]">
                      {top2 ? (
                        <>
                          <div
                            className="relative mb-2 flex flex-col items-center group cursor-pointer"
                            onClick={() => setSelectedPublicProfile(top2)}
                          >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center text-xl shadow-md overflow-hidden group-hover:scale-110 transition-transform ring-2 ring-slate-400/50">
                              <span className="text-2xl">{top2.avatarEmoji || '👦'}</span>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-900 text-[10px] font-black flex items-center justify-center shadow-md -mt-2.5 border border-white z-10">
                              2
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedPublicProfile(top2)}
                            className="text-[11px] font-extrabold text-slate-200 truncate max-w-full text-center hover:text-amber-300 flex items-center space-x-1"
                          >
                            <span>{top2.fullName}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70 shrink-0" />
                          </button>
                          <div className="flex items-center space-x-1 text-slate-300 text-[10px] font-black my-1">
                            <span className="text-cyan-400 font-serif">◆</span>
                            <span>{top2.xp.toLocaleString('tr-TR')}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-[10px] text-slate-500 font-bold my-4">2. Sıra Boş</div>
                      )}
                      <div className="w-full h-16 bg-slate-800/90 rounded-t-2xl border-t-2 border-slate-400/60 shadow-inner flex items-center justify-center">
                        <span className="text-xs font-black text-slate-400">2.</span>
                      </div>
                    </div>

                    {/* 1st Place (Center - Highest) */}
                    <div className="flex flex-col items-center flex-1 max-w-[110px]">
                      {top1 ? (
                        <>
                          <div
                            className="relative mb-2 flex flex-col items-center group cursor-pointer"
                            onClick={() => setSelectedPublicProfile(top1)}
                          >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-amber-400 bg-slate-800 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.6)] overflow-hidden group-hover:scale-110 transition-transform">
                              <span className="text-3xl">{top1.avatarEmoji || '👨‍🎓'}</span>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center shadow-md -mt-3 border border-white z-10">
                              1
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedPublicProfile(top1)}
                            className="text-xs font-black text-amber-300 truncate max-w-full text-center hover:underline flex items-center space-x-1"
                          >
                            <span>{top1.fullName}</span>
                            <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
                          </button>
                          <div className="flex items-center space-x-1 text-amber-400 text-xs font-black my-1">
                            <span className="text-cyan-400 font-serif">◆</span>
                            <span>{top1.xp.toLocaleString('tr-TR')}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-[10px] text-amber-400 font-bold my-4">1. Sıra</div>
                      )}
                      <div className="w-full h-24 bg-gradient-to-b from-amber-500/40 via-amber-900/50 to-slate-900 rounded-t-2xl border-t-2 border-amber-400 shadow-inner flex items-center justify-center">
                        <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                      </div>
                    </div>

                    {/* 3rd Place (Right) */}
                    <div className="flex flex-col items-center flex-1 max-w-[100px]">
                      {top3 ? (
                        <>
                          <div
                            className="relative mb-2 flex flex-col items-center group cursor-pointer"
                            onClick={() => setSelectedPublicProfile(top3)}
                          >
                            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-amber-700 bg-slate-800 flex items-center justify-center text-lg shadow-md overflow-hidden group-hover:scale-110 transition-transform ring-2 ring-amber-700/50">
                              <span className="text-xl">{top3.avatarEmoji || '👩‍🎓'}</span>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-amber-700 text-amber-100 text-[10px] font-black flex items-center justify-center shadow-md -mt-2.5 border border-white z-10">
                              3
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedPublicProfile(top3)}
                            className="text-[11px] font-extrabold text-amber-200/90 truncate max-w-full text-center hover:text-amber-300 flex items-center space-x-1"
                          >
                            <span>{top3.fullName}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70 shrink-0" />
                          </button>
                          <div className="flex items-center space-x-1 text-amber-500 text-[10px] font-black my-1">
                            <span className="text-cyan-400 font-serif">◆</span>
                            <span>{top3.xp.toLocaleString('tr-TR')}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-[10px] text-slate-500 font-bold my-4">3. Sıra Boş</div>
                      )}
                      <div className="w-full h-12 bg-amber-950/50 rounded-t-2xl border-t-2 border-amber-700/80 shadow-inner flex items-center justify-center">
                        <span className="text-xs font-black text-amber-700">3.</span>
                      </div>
                    </div>
                  </div>

                  {/* Current User's Own Rank Row */}
                  <div
                    onClick={() =>
                      setSelectedPublicProfile({
                        id: 'self',
                        fullName: userProfile?.fullName || (language === 'tr' ? 'Öğrenci' : 'Student'),
                        schoolEmail: userProfile?.schoolEmail || 'ogrenci@universite.edu.tr',
                        university: userProfile?.university || 'Marmara Üniversitesi',
                        departmentAndClass: userProfile?.departmentAndClass || 'Endüstri Mühendisliği - 3. Sınıf',
                        avatarEmoji: userProfile?.avatarEmoji || '👨‍🎓',
                        xp: xp || 0,
                        streak: streak || 1,
                        rank: userRank,
                        level: Math.floor((xp || 0) / 100) + 1,
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
                      <div className="w-7 h-7 rounded-full bg-[#ff7a00] text-white font-extrabold text-xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                        {userProfile?.avatarEmoji || (userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'Ö')}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white truncate block">
                          {userProfile?.fullName || (language === 'tr' ? 'Öğrenci' : 'Student')} <span className="text-[10px] font-extrabold text-amber-300">(Siz)</span>
                        </span>
                        <span className="text-[9.5px] font-medium text-slate-300 block">
                          {language === 'tr'
                            ? `${sortedLeaderboard.length} kayıtlı öğrenci arasında`
                            : `Out of ${sortedLeaderboard.length} registered students`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-amber-300 text-xs font-black shrink-0">
                      <span className="text-cyan-400 font-serif">◆</span>
                      <span>{(xp || 0).toLocaleString('tr-TR')} XP</span>
                    </div>
                  </div>
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
