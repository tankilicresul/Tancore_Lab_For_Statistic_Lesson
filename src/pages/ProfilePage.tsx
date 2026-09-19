import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore, computeContiguousStreak } from '../store/useAppStore';
import { ALL_MODULES } from '../data/modules';
import { PublicProfile } from '../types/stats';
import { uploadAvatarImage, deleteUserAvatar, fetchAllProfilesFromSupabase, saveUserProfileToSupabase, updateUserAccountCredentials } from '../lib/supabase';
import { computeUnifiedLeaderboard } from '../utils/leaderboardHelper';
import { AvatarCropModal } from '../components/AvatarCropModal';
import { UserAvatar } from '../components/UserAvatar';
import { soundService } from '../services/soundService';
import { DEFAULT_AVATARS, isPresetDefaultAvatar, getDefaultAvatarForUser } from '../utils/avatarHelper';
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
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Check,
  Menu,
  Globe,
  ChevronRight,
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
    setLanguage,
    userProfile,
    updateUserProfile,
    completedLessons,
    completedCaseExams,
    xp,
    streak,
    activityDates,
    unlockedBadges,
    isAuthenticated,
    isVerified,
    logout,
    registeredUsers,
  } = useAppStore();

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const displayStreak = Math.max(computeContiguousStreak(activityDates), streak || 1);

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
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Keep form fields in sync with userProfile
  useEffect(() => {
    if (userProfile && !isEditing) {
      setFormData(userProfile);
    }
  }, [userProfile, isEditing]);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const cleanEmail = formData.schoolEmail?.trim().toLowerCase() || '';
      const cleanName = formData.fullName?.trim() || '';
      const cleanUniversity = formData.university?.trim() || '';
      const cleanDept = formData.departmentAndClass?.trim() || '';

      // Always update Supabase Auth user metadata & password
      await updateUserAccountCredentials({
        newPassword: editPassword.trim().length >= 4 ? editPassword.trim() : undefined,
        fullName: cleanName,
        university: cleanUniversity,
        departmentAndClass: cleanDept,
      });

      const selectedAvatar = formData.avatarUrl || userProfile?.avatarUrl;

      // Update local store
      updateUserProfile(
        {
          ...formData,
          fullName: cleanName,
          schoolEmail: cleanEmail,
          university: cleanUniversity,
          departmentAndClass: cleanDept,
          avatarUrl: selectedAvatar,
        },
        editPassword.trim() ? editPassword.trim() : undefined
      );

      // Save to Supabase profiles table
      if (cleanEmail) {
        await saveUserProfileToSupabase({
          ...userProfile,
          ...formData,
          fullName: cleanName,
          schoolEmail: cleanEmail,
          university: cleanUniversity,
          departmentAndClass: cleanDept,
          avatarUrl: selectedAvatar,
          xp: xp || 0,
          streak: streak || 1,
          completedLessons: completedLessons.length + completedCaseExams.length,
        });
      }

      setSaveStatus(language === 'tr' ? 'Hesap bilgileriniz başarıyla güncellendi!' : 'Account updated successfully!');
      setTimeout(() => {
        setIsEditing(false);
        setEditPassword('');
        setSaveStatus(null);
      }, 700);
    } catch (err: any) {
      setSaveStatus(err.message || (language === 'tr' ? 'Güncelleme yapılamadı.' : 'Update failed.'));
    } finally {
      setIsSaving(false);
    }
  };

  // Curriculum statistics calculations
  const totalLessons = ALL_MODULES.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const totalCases = ALL_MODULES.reduce((acc, m) => acc + (m.caseExams?.length || 0), 0);
  const totalItems = totalLessons + totalCases;
  const completedCount = completedLessons.length + completedCaseExams.length;
  const progressPercent = totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : 0;

  // Topic Success Rate: real completion percentage
  const successRate = totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : 0;

  // Real Leaderboard Calculation (Strictly Deduplicated via computeUnifiedLeaderboard)
  const { sortedLeaderboard, userRank } = computeUnifiedLeaderboard({
    dbProfiles,
    registeredUsers,
    currentUserProfile: userProfile,
    isAuthenticated: Boolean(isAuthenticated),
    currentXp: xp,
    currentStreak: streak,
    completedCount,
    unlockedBadges,
  });


  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 pt-1 sm:pt-2 pb-8 font-sans space-y-5 sm:space-y-6 animate-fade-in">
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
                    ? (userProfile?.fullName || (userProfile?.schoolEmail ? userProfile.schoolEmail.split('@')[0] : (language === 'tr' ? 'Kullanıcı' : 'User')))
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
            <button
              onClick={() => setIsSideMenuOpen(true)}
              className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/35 transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
              title={language === 'tr' ? 'Menüyü Aç' : 'Open Menu'}
              aria-label="Menüyü Aç"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Editable Form vs Metadata Display */}
        {isEditing ? (
          <form onSubmit={handleSave} className="mt-5 pt-4 border-t border-white/10 space-y-4 relative z-10">
            {/* Profil Fotoğrafı Düzenleme & 3D Karakter Seçimi Bölümü */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-3.5">
              <div className="flex flex-col sm:flex-row items-center gap-3.5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] sm:max-w-[80px] sm:max-h-[80px] rounded-full bg-white/25 text-white font-black text-2xl flex items-center justify-center border-2 border-white/50 shadow-md shrink-0 overflow-hidden relative">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  ) : (
                    <UserAvatar
                      avatarUrl={formData.avatarUrl || userProfile?.avatarUrl}
                      avatarEmoji={userProfile?.avatarEmoji || '👨‍🎓'}
                      fullName={userProfile?.fullName}
                      size="xl"
                      className="w-full h-full"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full">
                  <p className="text-xs sm:text-sm font-black text-white">
                    {language === 'tr' ? 'Profil Fotoğrafı & Avatar' : 'Profile Picture & Avatar'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white text-[#ff7a00] hover:bg-orange-50 text-xs font-black transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{language === 'tr' ? 'Kendi Fotoğrafını Yükle' : 'Upload Your Photo'}</span>
                    </button>

                    {userProfile?.avatarUrl && !isPresetDefaultAvatar(userProfile.avatarUrl) && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (userProfile?.schoolEmail) {
                            await deleteUserAvatar(userProfile.schoolEmail);
                          }
                          const defaultAv = getDefaultAvatarForUser(userProfile?.fullName || userProfile?.schoolEmail, userProfile?.avatarEmoji);
                          updateUserProfile({ avatarUrl: defaultAv });
                          setFormData((prev) => ({ ...prev, avatarUrl: defaultAv }));
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-rose-500/30 text-white hover:text-rose-100 text-xs font-bold transition-colors border border-white/25 cursor-pointer active:scale-95"
                      >
                        {language === 'tr' ? 'Varsayılana Dön' : 'Reset to Default'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3D Karakter Avatar Paleti */}
              <div className="pt-3 border-t border-white/15">
                <p className="text-[11px] font-extrabold text-white/90 uppercase tracking-wider mb-2 text-center sm:text-left">
                  {language === 'tr' ? '🎨 Veya Hazır 3D Karakterini Seç:' : '🎨 Or Pick a 3D Character Avatar:'}
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {DEFAULT_AVATARS.map((avatarPath, idx) => {
                    const currentEffective = formData.avatarUrl || userProfile?.avatarUrl || getDefaultAvatarForUser(userProfile?.fullName || userProfile?.schoolEmail, userProfile?.avatarEmoji);
                    const isSelected = currentEffective === avatarPath;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          soundService.playBtnPress();
                          setFormData((prev) => ({ ...prev, avatarUrl: avatarPath }));
                          updateUserProfile({ avatarUrl: avatarPath });
                        }}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer p-0.5 bg-white/20 hover:bg-white/40 ${
                          isSelected
                            ? 'border-white ring-2 ring-yellow-300 scale-105 shadow-lg shadow-black/20'
                            : 'border-white/30 hover:border-white/70 hover:scale-105 opacity-85 hover:opacity-100'
                        }`}
                        title={`3D Avatar #${idx + 1}`}
                      >
                        <img
                          src={avatarPath}
                          alt={`Avatar ${idx + 1}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/30 backdrop-blur-[0.5px] flex items-center justify-center rounded-xl">
                            <div className="w-5 h-5 rounded-full bg-[#ff7a00] text-white flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {saveStatus && (
              <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${saveStatus.includes('başarıyla') || saveStatus.includes('successfully') ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200' : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'}`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveStatus}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {language === 'tr' ? 'İsim Soyisim' : 'Full Name'} *
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
                  {language === 'tr' ? 'E-posta' : 'Email'} *
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
                  {language === 'tr' ? 'Okul / Üniversite' : 'School / University'}
                  <span className="text-[10px] text-slate-400 font-normal ml-1">({language === 'tr' ? 'İsteğe bağlı' : 'Optional'})</span>
                </label>
                <input
                  type="text"
                  placeholder={language === 'tr' ? 'Örn: Koç Üniversitesi' : 'e.g. University'}
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {language === 'tr' ? 'Bölüm' : 'Department'}
                  <span className="text-[10px] text-slate-400 font-normal ml-1">({language === 'tr' ? 'İsteğe bağlı' : 'Optional'})</span>
                </label>
                <input
                  type="text"
                  placeholder={language === 'tr' ? 'Örn: Endüstri Mühendisliği' : 'e.g. Department'}
                  value={formData.departmentAndClass}
                  onChange={(e) => setFormData({ ...formData, departmentAndClass: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {language === 'tr' ? 'Şifre Değiştir / Belirle' : 'Change / Set Password'}
                  <span className="text-[10px] text-slate-400 font-normal ml-1">({language === 'tr' ? 'Değiştirmek istemiyorsanız boş bırakın' : 'Leave blank to keep unchanged'})</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    placeholder={language === 'tr' ? 'Yeni şifreniz (en az 4 karakter)' : 'New password (min 4 chars)'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
                    tabIndex={-1}
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditPassword('');
                  setSaveStatus(null);
                }}
                disabled={isSaving}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/15 cursor-pointer disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                <span>{language === 'tr' ? 'İptal' : 'Cancel'}</span>
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'tr' ? 'Kaydediliyor...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'Kaydet' : 'Save'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-3.5 pt-3.5 border-t border-white/25 space-y-2 relative z-10 text-xs sm:text-sm font-medium">
            <div className="flex items-center space-x-2.5 text-white/90 min-w-0">
              <Building2 className="w-4 h-4 text-white shrink-0" />
              <span className="truncate">{userProfile?.university || (language === 'tr' ? 'Üniversite belirtilmedi' : 'University not specified')}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-white/90 min-w-0">
              <GraduationCap className="w-4 h-4 text-white shrink-0" />
              <span className="truncate">{userProfile?.departmentAndClass || (language === 'tr' ? 'Bölüm belirtilmedi' : 'Department not specified')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Standalone Action Panels: Profili Düzenle & Sıralama (Leaderboard) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <button
          onClick={() => setIsEditing(true)}
          className="py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-2xl bg-white hover:bg-orange-50/60 border border-slate-200/90 hover:border-[#ff7a00]/40 shadow-xs transition-all flex items-center justify-center text-center group cursor-pointer active:scale-98"
        >
          <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-[#ff7a00] transition-colors whitespace-nowrap truncate text-center">
            {language === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}
          </span>
        </button>

        <button
          onClick={() => onNavigateLeaderboard?.()}
          className="py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-2xl bg-white hover:bg-amber-50/60 border border-slate-200/90 hover:border-amber-400/50 shadow-xs transition-all flex items-center justify-center text-center group cursor-pointer active:scale-98"
          title={language === 'tr' ? 'Genel Sıralamayı Gör' : 'View Leaderboard'}
        >
          <div className="flex items-center justify-center space-x-1.5 min-w-0">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0 stroke-[2.2]" />
            <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors whitespace-nowrap truncate">
              {userRank}. {language === 'tr' ? 'Sıra' : 'Rank'}
            </span>
          </div>
        </button>
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
            <span className="text-base sm:text-lg font-black">{displayStreak}</span>
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

      {/* 2/3 Width Side Drawer Panel (Ekranın Sağ Tarafından Açılan Panel) */}
      {isSideMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex justify-end font-sans">
          {/* Backdrop */}
          <div
            onClick={() => setIsSideMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* 2/3 Width Slide Panel */}
          <div
            className="relative z-10 w-[78vw] sm:w-[66.666%] max-w-sm h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-slide-in-right p-5 sm:p-6"
          >
            {/* Drawer Top Header & User Card */}
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#ff7a00]/15 flex items-center justify-center text-[#ff7a00] shrink-0 border border-[#ff7a00]/30">
                    <UserAvatar
                      avatarUrl={userProfile?.avatarUrl}
                      avatarEmoji={isAuthenticated ? userProfile?.avatarEmoji || '👨‍🎓' : '👤'}
                      fullName={userProfile?.fullName}
                      size="sm"
                      className="w-9 h-9"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-slate-900 truncate">
                      {isAuthenticated
                        ? userProfile?.fullName || (userProfile?.schoolEmail ? userProfile.schoolEmail.split('@')[0] : (language === 'tr' ? 'Kullanıcı' : 'User'))
                        : (language === 'tr' ? 'Misafir Kullanıcı' : 'Guest User')}
                    </h3>
                    <p className="text-[10.5px] text-slate-500 font-semibold truncate">
                      {isAuthenticated ? userProfile?.schoolEmail || (language === 'tr' ? 'Öğrenci Hesabı' : 'Student Account') : (language === 'tr' ? 'Giriş yapılmadı' : 'Not signed in')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
                  aria-label="Kapat"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Navigation & Action Items */}
              <div className="space-y-2.5">
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setIsSideMenuOpen(false);
                      setIsEditing(true);
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/80 border border-slate-200/80 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded-xl bg-orange-100 text-[#ff7a00] group-hover:scale-105 transition-transform shrink-0">
                        <Edit3 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{language === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}</div>
                        <div className="text-[10px] text-slate-500">{language === 'tr' ? 'İsim, avatar ve şifre' : 'Name, avatar and password'}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ff7a00] group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {onNavigateLeaderboard && (
                  <button
                    onClick={() => {
                      setIsSideMenuOpen(false);
                      onNavigateLeaderboard();
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/80 border border-slate-200/80 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-600 group-hover:scale-105 transition-transform shrink-0">
                        <Trophy className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{language === 'tr' ? 'Liderlik Tablosu' : 'Leaderboard'}</div>
                        <div className="text-[10px] text-slate-500">{language === 'tr' ? 'Sıralamanı ve puanları gör' : 'View rankings and scores'}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ff7a00] group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* Language Selector */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                      <Globe className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">{language === 'tr' ? 'Uygulama Dili' : 'Language'}</div>
                      <div className="text-[10px] text-slate-500">{language === 'tr' ? 'Türkçe / English' : 'Turkish / English'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setLanguage('tr')}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black transition-colors cursor-pointer ${
                        language === 'tr' ? 'bg-[#ff7a00] text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      TR
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black transition-colors cursor-pointer ${
                        language === 'en' ? 'bg-[#ff7a00] text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="pt-4 border-t border-slate-100 mt-6 space-y-2">
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onOpenAuth?.();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black transition-all shadow-md shadow-[#ff7a00]/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{language === 'tr' ? 'Giriş Yap / Kayıt Ol' : 'Sign In / Register'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-black transition-colors flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'tr' ? 'Oturumu Kapat' : 'Sign Out'}</span>
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
