import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PublicProfile } from '../types/stats';
import { fetchAllProfilesFromSupabase } from '../lib/supabase';
import { Crown, Flame, Sparkles, RefreshCw } from 'lucide-react';
import { UserAvatar } from '../components/UserAvatar';
import { computeUnifiedLeaderboard, isSameStudent } from '../utils/leaderboardHelper';

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
  const [_isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  // Animation State for Rank Climbing:
  const [displayRank, setDisplayRank] = useState<number | null>(null);
  const [isClimbing, setIsClimbing] = useState(false);
  const [justArrived, setJustArrived] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
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

  // Real Leaderboard Calculation (Strictly Deduplicated via computeUnifiedLeaderboard)
  const completedCount = completedLessons.length + completedCaseExams.length;

  const { sortedLeaderboard, userRank } = computeUnifiedLeaderboard({
    dbProfiles,
    registeredUsers,
    currentUserProfile: isAuthenticated ? userProfile : null,
    currentXp: xp,
    currentStreak: streak,
    completedCount,
    unlockedBadges,
  });

  // Rank Climb Init & Trigger Logic
  const startRankClimbAnimation = (fromRankOverride?: number) => {
    if (!isAuthenticated || !userRank || sortedLeaderboard.length === 0) return;

    let prev = fromRankOverride;
    if (prev === undefined) {
      const savedStr = localStorage.getItem('tancore_last_seen_rank');
      prev = savedStr ? parseInt(savedStr, 10) : NaN;
    }

    if (isNaN(prev) || prev === null) {
      prev = Math.min(sortedLeaderboard.length, userRank + 6);
      localStorage.setItem('tancore_last_seen_rank', String(prev));
    }

    if (userRank < prev) {
      setDisplayRank(prev);
      const t = setTimeout(() => {
        setIsClimbing(true);
      }, 550);
      return () => clearTimeout(t);
    } else {
      setDisplayRank(userRank);
      localStorage.setItem('tancore_last_seen_rank', String(userRank));
    }
  };

  useEffect(() => {
    startRankClimbAnimation();
  }, [userRank, isAuthenticated, sortedLeaderboard.length]);

  // Step-by-Step Rank Climbing Interval
  useEffect(() => {
    if (!isClimbing || displayRank === null || !userRank) return;

    if (displayRank > userRank) {
      const timer = setTimeout(() => {
        setDisplayRank((current) => (current ? current - 1 : userRank));
      }, 210);

      return () => clearTimeout(timer);
    } else if (displayRank === userRank) {
      setIsClimbing(false);
      setJustArrived(true);
      setShowSparkles(true);

      localStorage.setItem('tancore_last_seen_rank', String(userRank));

      const popTimer = setTimeout(() => {
        setJustArrived(false);
      }, 850);

      const sparkleTimer = setTimeout(() => {
        setShowSparkles(false);
      }, 2500);

      return () => {
        clearTimeout(popTimer);
        clearTimeout(sparkleTimer);
      };
    }
  }, [isClimbing, displayRank, userRank]);

  // Auto-Scroll to keep climbing user row in view
  useEffect(() => {
    if (isClimbing && displayRank !== null) {
      const el = document.getElementById(`leaderboard-row-${displayRank}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [displayRank, isClimbing]);

  // Construct dynamically positioned leaderboard array during rank climb
  const getRenderedLeaderboard = () => {
    if (!isAuthenticated || displayRank === null || displayRank === userRank) {
      return sortedLeaderboard;
    }

    const currentUserObj = sortedLeaderboard.find((p) => isSameStudent(p, userProfile));
    if (!currentUserObj) return sortedLeaderboard;

    const others = sortedLeaderboard.filter((p) => !isSameStudent(p, userProfile));
    const targetIdx = Math.max(0, Math.min(others.length, displayRank - 1));

    const result = [...others];
    result.splice(targetIdx, 0, currentUserObj);

    return result.map((p, idx) => ({
      ...p,
      visualRank: idx + 1,
    }));
  };

  const renderedList = getRenderedLeaderboard();

  // Real Top 3 users based on rendered list
  const user1 = sortedLeaderboard[0] || null;
  const user2 = sortedLeaderboard[1] || null;
  const user3 = sortedLeaderboard[2] || null;

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 pb-8 font-sans space-y-4 animate-fade-in relative">
      {/* Sparkles / Confetti Celebration Overlay on Arrival */}
      {showSparkles && (
        <div className="fixed top-20 left-0 right-0 z-50 pointer-events-none flex justify-center items-center">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-full shadow-2xl font-black text-xs sm:text-sm tracking-wide flex items-center space-x-2 animate-bounce border-2 border-amber-300">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            <span>{language === 'tr' ? '🎉 PUF! SIRA YÜKSELDİ!' : '🎉 RANK UPGRADE COMPLETE!'}</span>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
          </div>
        </div>
      )}

      {/* Unauthenticated Guest Alert Banner */}
      {!isAuthenticated && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md shadow-orange-500/20">
          <div className="flex items-center space-x-2.5 text-center sm:text-left">
            <Crown className="w-5 h-5 text-amber-200 shrink-0 hidden sm:block" />
            <span className="font-bold text-xs leading-snug">
              {language === 'tr'
                ? 'Sıralamada yer almak ve XP puanları kazanmak için kayıt ol!'
                : 'Sign up to earn XP points and join the global leaderboard!'}
            </span>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-4 py-1.5 rounded-xl bg-white text-orange-600 font-black text-xs shadow-sm hover:bg-orange-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider"
          >
            {language === 'tr' ? 'KAYIT OL' : 'SIGN UP'}
          </button>
        </div>
      )}

      {/* Seamless Top 3 Leaderboard Podium */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex items-end justify-center gap-2 sm:gap-4 pt-2 pb-1">
          {/* 2nd Place (Silver) */}
          <div className="flex flex-col items-center flex-1 min-w-0 max-w-[110px]">
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
          <div className="flex flex-col items-center flex-1 min-w-0 max-w-[125px]">
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
          <div className="flex flex-col items-center flex-1 min-w-0 max-w-[110px]">
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

      {/* Current User Floating/Top Preview Row (Visible only when user is Rank 4+ and has not scrolled down yet) */}
      {isAuthenticated && userRank > 3 && (
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
                id: userProfile?.id || 'current_user',
                fullName: userProfile?.fullName || (language === 'tr' ? 'Öğrenci' : 'Student'),
                schoolEmail: userProfile?.schoolEmail,
                university: userProfile?.university || 'Üniversite',
                departmentAndClass: userProfile?.departmentAndClass || '',
                avatarEmoji: userProfile?.avatarEmoji || '👨‍🎓',
                avatarUrl: userProfile?.avatarUrl,
                xp: xp || 0,
                streak: streak || 0,
                rank: userRank,
                level: Math.floor((xp || 0) / 100) + 1,
                completedCount: completedCount,
                unlockedBadges: unlockedBadges,
              })
            }
            className={`flex items-center justify-between p-3.5 rounded-2xl text-slate-900 cursor-pointer transition-all shadow-xs group ${
              isClimbing
                ? 'bg-gradient-to-r from-amber-500/25 via-orange-500/30 to-amber-500/25 border-2 border-amber-400 animate-climb-pulse scale-102'
                : justArrived
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl animate-rank-pop border-2 border-amber-300 ring-4 ring-amber-400/40'
                : 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 hover:from-orange-100 hover:to-amber-100 border-2 border-[#ff7a00]/40'
            }`}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="px-2.5 py-1 rounded-xl bg-[#ff7a00] text-white font-black text-xs shadow-xs shrink-0 flex items-center space-x-1">
                <span>{displayRank !== null ? displayRank : userRank}.</span>
                {isClimbing && <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />}
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-orange-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform overflow-hidden shadow-2xs">
                <UserAvatar
                  avatarUrl={userProfile?.avatarUrl}
                  avatarEmoji={userProfile?.avatarEmoji || '👨‍🎓'}
                  fullName={userProfile?.fullName}
                  size="xs"
                  className="w-full h-full"
                />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 truncate block">
                  {userProfile?.fullName || (language === 'tr' ? 'Öğrenci' : 'Student')}{' '}
                  <span className="text-[10px] font-black text-[#ff7a00] bg-orange-100 px-1.5 py-0.5 rounded-md">
                    (Sen)
                  </span>
                </span>
                {isClimbing ? (
                  <span className="text-[10px] font-black text-orange-600 animate-pulse block">
                    🔥 SIRA YÜKSELİYOR! ↑
                  </span>
                ) : justArrived ? (
                  <span className="text-[10px] font-black text-amber-200 block">
                    🎉 YENİ SIRA YERLEŞTİ!
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center space-x-1 text-[#ff7a00] text-xs font-black shrink-0">
              <span className="text-amber-500 font-serif">◆</span>
              <span>{(xp || 0).toLocaleString('tr-TR')} XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Additional Registered Users (Rank 4+) with onScroll tracking */}
      {renderedList.length > 3 && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {language === 'tr' ? 'Tüm Öğrenciler' : 'All Students'}
            </span>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400 font-medium">
                {renderedList.length} {language === 'tr' ? 'kayıtlı' : 'registered'}
              </span>
              {isAuthenticated && (
                <button
                  onClick={() => startRankClimbAnimation(userRank + 6)}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-[#ff7a00] font-black text-[10px] transition-colors cursor-pointer active:scale-95"
                  title="Yükselme Animasyonunu Tekrar Test Et"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{language === 'tr' ? 'Tırmanışı Test Et' : 'Test Climb'}</span>
                </button>
              )}
            </div>
          </div>

          <div
            ref={listRef}
            onScroll={(e) => {
              const st = e.currentTarget.scrollTop;
              setHasScrolledInLeaderboard(st > 35);
            }}
            className="space-y-2 max-h-[480px] overflow-y-auto pr-1"
          >
            {renderedList.slice(3).map((user) => {
              const isSelf = isAuthenticated && isSameStudent(user, userProfile);
              const currentVisualRank = (user as any).visualRank || user.rank;

              return (
                <div
                  id={`leaderboard-row-${currentVisualRank}`}
                  key={user.id}
                  onClick={() => setSelectedPublicProfile(user)}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    isSelf
                      ? isClimbing
                        ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-amber-500/20 border-2 border-amber-400 shadow-xl animate-climb-pulse scale-102 z-20'
                        : justArrived
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-2xl animate-rank-pop border-2 border-amber-300 ring-4 ring-amber-400/50 z-20'
                        : 'bg-orange-50/90 border-2 border-[#ff7a00] text-slate-900 shadow-xs ring-1 ring-[#ff7a00]/30'
                      : 'bg-white hover:bg-orange-50/40 border-slate-200/80 text-slate-800 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span
                      className={`text-xs font-black w-6 text-center ${
                        isSelf ? 'text-[#ff7a00]' : 'text-slate-400'
                      }`}
                    >
                      {currentVisualRank}.
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
                      {isSelf && isClimbing ? (
                        <span className="text-[10px] font-black text-orange-600 animate-pulse block">
                          🔥 SIRA YÜKSELİYOR! ↑
                        </span>
                      ) : isSelf && justArrived ? (
                        <span className="text-[10px] font-black text-amber-200 block">
                          🎉 PUF! YENİ YERİNE OTURDU!
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 truncate block">{user.university}</span>
                      )}
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
      )}
    </div>
  );
};
