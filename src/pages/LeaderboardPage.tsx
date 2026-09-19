import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PublicProfile } from '../types/stats';
import { fetchAllProfilesFromSupabase } from '../lib/supabase';
import { Crown, Lock } from 'lucide-react';
import { UserAvatar } from '../components/UserAvatar';
import { computeUnifiedLeaderboard, isSameStudent } from '../utils/leaderboardHelper';
import { soundService } from '../services/soundService';

const DUMMY_BLURRED_STUDENTS = [
  { rank: 4, name: 'Zeynep Kaya', university: 'İTÜ - Endüstri Mühendisliği', emoji: '👩‍💻', xp: 420 },
  { rank: 5, name: 'Burak Demir', university: 'ODTÜ - Bilgisayar Mühendisliği', emoji: '👨‍🎓', xp: 390 },
  { rank: 6, name: 'Selin Yılmaz', university: 'Boğaziçi Üniversitesi', emoji: '👩‍🔬', xp: 360 },
  { rank: 7, name: 'Emre Akın', university: 'Koç Üniversitesi', emoji: '🧑‍💻', xp: 315 },
  { rank: 8, name: 'Elif Şahin', university: 'Bilkent Üniversitesi', emoji: '👩‍🎓', xp: 280 },
  { rank: 9, name: 'Caner Özkan', university: 'Sabancı Üniversitesi', emoji: '👨‍💼', xp: 240 },
  { rank: 10, name: 'Merve Çelik', university: 'Yıldız Teknik Üniversitesi', emoji: '👩‍🎨', xp: 195 },
  { rank: 11, name: 'Deniz Aydın', university: 'Hacettepe Üniversitesi', emoji: '🧑‍🎓', xp: 150 },
  { rank: 12, name: 'Berk Tan', university: 'TOBB ETÜ', emoji: '👨‍💻', xp: 90 },
];

export interface LeaderboardPageProps {
  onGoHome?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  onGoHome: _onGoHome,
  onOpenAuth,
  onOpenProfile: _onOpenProfile,
}) => {
  const {
    language,
    userProfile,
    isAuthenticated,
    registeredUsers,
    xp,
    streak,
    completedLessons,
    completedCaseExams,
    unlockedBadges,
    setSelectedPublicProfile,
  } = useAppStore();

  const [hasScrolledInLeaderboard, setHasScrolledInLeaderboard] = useState(false);
  const [dbProfiles, setDbProfiles] = useState<PublicProfile[]>([]);
  const [_isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);

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

  // Effective active profile: only for authenticated user
  const effectiveProfile = isAuthenticated && userProfile
    ? userProfile
    : null;

  // Real Leaderboard Calculation (Strictly Deduplicated via computeUnifiedLeaderboard)
  const completedCount = completedLessons.length + completedCaseExams.length;

  const { sortedLeaderboard, userRank } = computeUnifiedLeaderboard({
    dbProfiles,
    registeredUsers,
    currentUserProfile: effectiveProfile,
    isAuthenticated: Boolean(isAuthenticated),
    currentXp: xp,
    currentStreak: streak,
    completedCount,
    unlockedBadges,
  });

  // Ambient soothing lava flow if user is in Top 3
  useEffect(() => {
    if (isAuthenticated && userRank && userRank <= 3) {
      soundService.playLavaFlow(0.12);
    } else {
      soundService.stopAmbient();
    }
    return () => {
      soundService.stopAmbient();
    };
  }, [userRank, isAuthenticated]);

  // Auto-Scroll to keep user row in view on load
  useEffect(() => {
    if (isAuthenticated && userRank) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`leaderboard-row-${userRank}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [userRank, isAuthenticated]);

  // Real Top 3 users based on sortedLeaderboard
  const user1 = sortedLeaderboard[0] || null;
  const user2 = sortedLeaderboard[1] || null;
  const user3 = sortedLeaderboard[2] || null;

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 pb-8 font-sans -mt-4 sm:-mt-6 relative">
      {/* Pinned Top Podium & Section Subtitle (Sticky with zero initial jump) */}
      <div className="sticky top-[52px] sm:top-[68px] z-30 pt-1 pb-1.5 bg-[#f8fafc]">
        {/* Seamless Top 3 Leaderboard Podium */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-md relative overflow-hidden transition-all">
          <div className="flex items-end justify-center gap-2 sm:gap-4 pt-2 pb-1">
            {/* 2nd Place (Silver) */}
            <div id="leaderboard-row-2" className="flex flex-col items-center flex-1 min-w-0 max-w-[110px]">
              {user2 ? (
                <>
                  <div
                    className="relative mb-2 flex flex-col items-center group cursor-pointer"
                    onClick={() => setSelectedPublicProfile(user2)}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-300 bg-slate-100 flex items-center justify-center text-xl shadow-md overflow-hidden group-hover:scale-105 transition-transform ring-2 ring-slate-300/80 animate-podium-2">
                      <UserAvatar
                        avatarUrl={user2.avatarUrl}
                        avatarEmoji={user2.avatarEmoji || '👨‍🎓'}
                        fullName={user2.fullName}
                        size="md"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black flex items-center justify-center shadow-md -mt-2.5 border border-white z-10">
                      2
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPublicProfile(user2)}
                    className="text-xs font-bold text-slate-800 text-center hover:text-[#ff7a00] truncate max-w-full px-0.5 cursor-pointer"
                    title={user2.fullName}
                  >
                    {user2.fullName}
                  </button>
                  <div className="flex items-center space-x-1 text-slate-600 text-[10px] font-black my-1">
                    <span className="text-amber-500 font-serif">◆</span>
                    <span>{user2.xp.toLocaleString('tr-TR')}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 shadow-xs">
                      <span className="text-xs font-black text-slate-400">2</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center shadow-xs -mt-2.5 border border-slate-200 z-10">
                      2
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 truncate max-w-full text-center">
                    {language === 'tr' ? 'Açık Sıra' : 'Open Spot'}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-400 text-[9.5px] font-bold my-1">
                    <span>{language === 'tr' ? 'Sıradaki Sen Ol' : 'Next is You'}</span>
                  </div>
                </>
              )}
              <div className="w-full h-16 sm:h-20 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400/90 rounded-t-2xl border-t-2 border-slate-100 shadow-inner flex items-center justify-center">
                <span className="text-xs sm:text-sm font-black text-slate-700">2.</span>
              </div>
            </div>

            {/* 1st Place (Gold / Warm Amber) */}
            <div id="leaderboard-row-1" className="flex flex-col items-center flex-1 min-w-0 max-w-[125px]">
              {user1 ? (
                <>
                  <div
                    className="relative mb-2 flex flex-col items-center group cursor-pointer"
                    onClick={() => setSelectedPublicProfile(user1)}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-amber-400 bg-amber-50 flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform ring-4 ring-amber-300/80 animate-podium-1">
                      <UserAvatar
                        avatarUrl={user1.avatarUrl}
                        avatarEmoji={user1.avatarEmoji || '👨‍🎓'}
                        fullName={user1.fullName}
                        size="lg"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-[#ff7a00] text-white text-xs font-black flex items-center justify-center shadow-md -mt-3 border border-white z-10">
                      1
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPublicProfile(user1)}
                    className="text-xs sm:text-sm font-black text-slate-900 text-center hover:text-[#ff7a00] truncate max-w-full px-0.5 cursor-pointer"
                    title={user1.fullName}
                  >
                    {user1.fullName}
                  </button>
                  <div className="flex items-center space-x-1 text-[#ff7a00] text-xs font-black my-1">
                    <span className="text-amber-500 font-serif">◆</span>
                    <span>{user1.xp.toLocaleString('tr-TR')}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-amber-300 bg-amber-50/50 flex items-center justify-center text-amber-500 shadow-xs">
                      <span className="text-sm font-black text-amber-500/70">1</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-xs font-black flex items-center justify-center shadow-xs -mt-3 border border-amber-300 z-10">
                      1
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-600 truncate max-w-full text-center">
                    {language === 'tr' ? 'Açık Sıra' : 'Open Spot'}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-500 text-[10px] font-bold my-1">
                    <span>{language === 'tr' ? 'Sıradaki Sen Ol' : 'Next is You'}</span>
                  </div>
                </>
              )}
              <div className="w-full h-24 sm:h-28 bg-gradient-to-b from-amber-400 via-[#ff7a00] to-[#ea580c] rounded-t-2xl border-t-2 border-amber-300 shadow-md flex items-center justify-center">
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white/90 animate-pulse" />
              </div>
            </div>

            {/* 3rd Place (Bronze) */}
            <div id="leaderboard-row-3" className="flex flex-col items-center flex-1 min-w-0 max-w-[110px]">
              {user3 ? (
                <>
                  <div
                    className="relative mb-2 flex flex-col items-center group cursor-pointer"
                    onClick={() => setSelectedPublicProfile(user3)}
                  >
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-amber-700 bg-amber-50 flex items-center justify-center text-lg shadow-md overflow-hidden group-hover:scale-105 transition-transform ring-2 ring-amber-600/60 animate-podium-3">
                      <UserAvatar
                        avatarUrl={user3.avatarUrl}
                        avatarEmoji={user3.avatarEmoji || '👨‍🎓'}
                        fullName={user3.fullName}
                        size="md"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-amber-700 text-white text-[10px] font-black flex items-center justify-center shadow-md -mt-2.5 border border-white z-10">
                      3
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPublicProfile(user3)}
                    className="text-xs font-bold text-slate-800 text-center hover:text-[#ff7a00] truncate max-w-full px-0.5 cursor-pointer"
                    title={user3.fullName}
                  >
                    {user3.fullName}
                  </button>
                  <div className="flex items-center space-x-1 text-amber-800 text-[10px] font-black my-1">
                    <span className="text-amber-500 font-serif">◆</span>
                    <span>{user3.xp.toLocaleString('tr-TR')}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-dashed border-amber-200 bg-amber-50/50 flex items-center justify-center text-amber-700 shadow-xs">
                      <span className="text-xs font-black text-amber-700/70">3</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black flex items-center justify-center shadow-xs -mt-2.5 border border-amber-200 z-10">
                      3
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 truncate max-w-full text-center">
                    {language === 'tr' ? 'Açık Sıra' : 'Open Spot'}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-400 text-[9.5px] font-bold my-1">
                    <span>{language === 'tr' ? 'Sıradaki Sen Ol' : 'Next is You'}</span>
                  </div>
                </>
              )}
              <div className="w-full h-12 sm:h-16 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 rounded-t-2xl border-t-2 border-amber-400 shadow-xs flex items-center justify-center">
                <span className="text-xs sm:text-sm font-black text-white drop-shadow-xs">3.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Subheader Bar (Üniversite Ligi Sıralaması / Tüm Öğrenciler) */}
        <div className="flex items-center justify-between px-2 pt-3 pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {!isAuthenticated
              ? (language === 'tr' ? 'Üniversite Ligi Sıralaması' : 'University League Ranking')
              : (language === 'tr' ? 'Tüm Öğrenciler' : 'All Students')}
          </span>
          {!isAuthenticated ? (
            <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              🔥 {language === 'tr' ? 'Canlı Lig' : 'Live League'}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">
              {sortedLeaderboard.length} {language === 'tr' ? 'kayıtlı' : 'registered'}
            </span>
          )}
        </div>
      </div>

      {/* Current User Floating/Top Preview Row (Visible only when user is authenticated, Rank 4+ and has not scrolled down yet) */}
      {isAuthenticated && userRank > 3 && effectiveProfile && (
        <div
          className={`transition-all duration-300 ease-in-out ${
            hasScrolledInLeaderboard
              ? 'opacity-0 max-h-0 pointer-events-none -mt-2 overflow-hidden'
              : 'opacity-100 max-h-24'
          }`}
        >
          <div
            onClick={() =>
              setSelectedPublicProfile({
                id: effectiveProfile.id || 'current_user',
                fullName: effectiveProfile.fullName || (language === 'tr' ? 'Öğrenci' : 'Student'),
                schoolEmail: effectiveProfile.schoolEmail,
                university: effectiveProfile.university || 'Üniversite',
                departmentAndClass: effectiveProfile.departmentAndClass || '',
                avatarEmoji: effectiveProfile.avatarEmoji || '👨‍🎓',
                avatarUrl: effectiveProfile.avatarUrl,
                xp: xp || 0,
                streak: streak || 0,
                rank: userRank,
                level: Math.floor((xp || 0) / 100) + 1,
                completedCount: completedCount,
                unlockedBadges: unlockedBadges,
              })
            }
            className="flex items-center justify-between p-3.5 rounded-2xl text-slate-900 cursor-pointer transition-all shadow-xs group bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 hover:from-orange-100 hover:to-amber-100 border-2 border-[#ff7a00]/40"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="px-2.5 py-1 rounded-xl bg-[#ff7a00] text-white font-black text-xs shadow-xs shrink-0 flex items-center space-x-1">
                <span>{userRank}.</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-orange-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform overflow-hidden shadow-2xs">
                <UserAvatar
                  avatarUrl={effectiveProfile.avatarUrl}
                  avatarEmoji={effectiveProfile.avatarEmoji || '👨‍🎓'}
                  fullName={effectiveProfile.fullName}
                  size="xs"
                  className="w-full h-full"
                />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 truncate block">
                  {effectiveProfile.fullName || (language === 'tr' ? 'Öğrenci' : 'Student')}{' '}
                  <span className="text-[10px] font-black text-[#ff7a00] bg-orange-100 px-1.5 py-0.5 rounded-md">
                    (Sen)
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 truncate block">
                  {effectiveProfile.university || (language === 'tr' ? 'Üniversite' : 'University')}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-[#ff7a00] text-xs font-black shrink-0">
              <span className="text-amber-500 font-serif">◆</span>
              <span>{(xp || 0).toLocaleString('tr-TR')} XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Additional Registered Users (Rank 4+) or Blurred Preview when Unauthenticated */}
      {!isAuthenticated ? (
        <div className="space-y-2.5">
          {/* Blurred Background Mock Students List with Centered Frosted Lock Card */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-3 shadow-xs">
            <div className="space-y-2 select-none pointer-events-none filter blur-[4.5px] opacity-35">
              {DUMMY_BLURRED_STUDENTS.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-black min-w-6 text-slate-400 text-center">
                      {item.rank}.
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm shadow-2xs">
                      {item.emoji}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 block">{item.university}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-[#ff7a00] text-xs font-black">
                    <span className="text-amber-500 font-serif">◆</span>
                    <span>{item.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lock / Sign Up CTA Overlay in Center */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-white via-white/85 to-white/40 backdrop-blur-[1.5px]">
              <div className="w-13 h-13 rounded-3xl bg-gradient-to-tr from-[#ff7a00] to-amber-400 text-white flex items-center justify-center shadow-lg shadow-[#ff7a00]/30 mb-3 animate-pulse">
                <Lock className="w-6 h-6 stroke-[2.5]" />
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-1 max-w-xs">
                {language === 'tr'
                  ? 'Tüm Sıralamayı ve Kendi Dereceni Gör'
                  : 'Unlock Full Leaderboard & Your Rank'}
              </h3>

              <p className="text-xs text-slate-600 font-medium max-w-sm mb-4 leading-relaxed">
                {language === 'tr'
                  ? 'Ücretsiz kayıt ol, dersleri tamamlayarak XP kazan ve üniversiteni liderlik tablosunun zirvesine taşı!'
                  : 'Sign up for free, earn XP by finishing lessons, and carry your university to the top of the leaderboard!'}
              </p>

              <button
                onClick={onOpenAuth}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff7a00] to-amber-500 hover:from-[#e66e00] hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ff7a00]/30 active:scale-95 transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>{language === 'tr' ? 'Ücretsiz Kayıt Ol / Giriş Yap' : 'Sign Up / Sign In Free'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated: Render real list when rank > 3 */
        sortedLeaderboard.length > 3 ? (
          <div className="space-y-2">
            <div
              ref={listRef}
              onScroll={(e) => {
                const st = e.currentTarget.scrollTop;
                setHasScrolledInLeaderboard(st > 35);
              }}
              className="space-y-2 max-h-[480px] overflow-y-auto pr-1"
            >
              {sortedLeaderboard.slice(3).map((user) => {
                const isSelf = Boolean(isAuthenticated && effectiveProfile && isSameStudent(user, effectiveProfile));
                const currentVisualRank = user.rank;

                return (
                  <div
                    id={`leaderboard-row-${currentVisualRank}`}
                    key={user.id}
                    onClick={() => setSelectedPublicProfile(user)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      isSelf
                        ? 'bg-orange-50/90 border-2 border-[#ff7a00] text-slate-900 shadow-xs ring-1 ring-[#ff7a00]/30'
                        : 'bg-white hover:bg-orange-50/40 border-slate-200/80 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span
                        className={`text-xs font-black min-w-6 text-center flex items-center justify-center space-x-0.5 ${
                          isSelf ? 'text-[#ff7a00]' : 'text-slate-400'
                        }`}
                      >
                        <span>{currentVisualRank}.</span>
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden shrink-0">
                        <UserAvatar
                          avatarUrl={user.avatarUrl}
                          avatarEmoji={user.avatarEmoji || '👨‍🎓'}
                          fullName={user.fullName}
                          size="xs"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`text-xs truncate block ${
                              isSelf ? 'font-black text-slate-900' : 'font-bold text-slate-800'
                            }`}
                          >
                            {user.fullName}
                          </span>
                          {isSelf && (
                            <span className="text-[10px] font-black text-[#ff7a00] bg-orange-100 px-1.5 py-0.2 rounded-md">
                              {language === 'tr' ? 'Sen' : 'You'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 truncate block">{user.university}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-[#ff7a00] text-xs font-black shrink-0">
                      <span className="text-amber-500 font-serif">◆</span>
                      <span>{user.xp.toLocaleString('tr-TR')} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};
