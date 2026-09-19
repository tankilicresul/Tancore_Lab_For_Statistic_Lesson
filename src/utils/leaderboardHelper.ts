import { PublicProfile, UserProfile } from '../types/stats';
import { DEFAULT_LEADERBOARD_STUDENTS } from '../data/leaderboardData';

/**
 * Normalizes full name using Turkish collation rules and collapsing multiple whitespaces
 */
export function normalizeStudentName(name?: string): string {
  return (name || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/\s+/g, ' ');
}

/**
 * Normalizes email address
 */
export function normalizeStudentEmail(email?: string): string {
  return (email || '').trim().toLowerCase();
}

/**
 * Checks whether two profile records belong to the same student.
 * Compares by:
 * 1. Normalized full name (handles Turkish letter cases and extra spaces)
 * 2. School email address (case-insensitive)
 * 3. Database UUID (excluding generic 'mock-' or 'self' or 'usr_' prefixes)
 */
export function isSameStudent(
  a: { id?: string; schoolEmail?: string; fullName?: string },
  b?: { id?: string; schoolEmail?: string; fullName?: string } | null
): boolean {
  if (!b) return false;

  const nameA = normalizeStudentName(a.fullName);
  const nameB = normalizeStudentName(b.fullName);
  if (nameA && nameB && nameA === nameB) return true;

  const emailA = normalizeStudentEmail(a.schoolEmail);
  const emailB = normalizeStudentEmail(b.schoolEmail);
  if (emailA && emailB && emailA === emailB) return true;

  const idA = (a.id || '').trim();
  const idB = (b.id || '').trim();
  if (
    idA &&
    idB &&
    idA === idB &&
    !idA.startsWith('mock-') &&
    idA !== 'self' &&
    !idA.startsWith('usr_')
  ) {
    return true;
  }

  return false;
}

export interface UnifiedLeaderboardResult {
  sortedLeaderboard: PublicProfile[];
  userRank: number;
  currentUserIdx: number;
}

/**
 * Builds a strictly deduplicated, consistently ranked leaderboard from:
 * 1. Default static mock students
 * 2. Supabase live database students
 * 3. Local store registered users
 * 4. Currently logged in user (with their authentic active stats)
 */
export function computeUnifiedLeaderboard(params: {
  dbProfiles?: PublicProfile[];
  registeredUsers?: PublicProfile[];
  currentUserProfile?: UserProfile | null;
  isAuthenticated?: boolean;
  currentXp?: number;
  currentStreak?: number;
  completedCount?: number;
  unlockedBadges?: string[];
}): UnifiedLeaderboardResult {
  const {
    dbProfiles = [],
    registeredUsers = [],
    currentUserProfile = null,
    isAuthenticated = false,
    currentXp = 0,
    currentStreak = 1,
    completedCount = 0,
    unlockedBadges = [],
  } = params;

  const list: PublicProfile[] = [];

  const upsertProfile = (incoming: PublicProfile, isCurrentActiveUser = false) => {
    if (!incoming) return;

    const existingIndex = list.findIndex((existing) => isSameStudent(existing, incoming));

    if (existingIndex >= 0) {
      const existing = list[existingIndex];

      const cleanIncomingId =
        incoming.id && !incoming.id.startsWith('mock-') && incoming.id !== 'self' && !incoming.id.startsWith('usr_')
          ? incoming.id
          : '';
      const cleanExistingId =
        existing.id && !existing.id.startsWith('mock-') && existing.id !== 'self' && !existing.id.startsWith('usr_')
          ? existing.id
          : '';

      const finalId = cleanIncomingId || cleanExistingId || incoming.id || existing.id;
      const finalEmail = incoming.schoolEmail || existing.schoolEmail || '';
      const finalFullName = incoming.fullName || existing.fullName || 'Öğrenci';
      const finalUniversity = incoming.university || existing.university || 'Üniversite';
      const finalDept = incoming.departmentAndClass || existing.departmentAndClass || '';
      const finalAvatarEmoji = incoming.avatarEmoji || existing.avatarEmoji || '👨‍🎓';
      const finalAvatarUrl = incoming.avatarUrl || existing.avatarUrl || undefined;

      // When merging the currently active user, prioritize current session XP and streak
      const finalXp = isCurrentActiveUser
        ? currentXp
        : Math.max(incoming.xp || 0, existing.xp || 0);

      const finalStreak = isCurrentActiveUser
        ? currentStreak
        : Math.max(incoming.streak || 1, existing.streak || 1);

      const finalCompletedCount = isCurrentActiveUser
        ? completedCount
        : Math.max(incoming.completedCount || 0, existing.completedCount || 0);

      const mergedBadges = Array.from(
        new Set([...(existing.unlockedBadges || []), ...(incoming.unlockedBadges || [])])
      );

      list[existingIndex] = {
        ...existing,
        ...incoming,
        id: finalId,
        fullName: finalFullName,
        schoolEmail: finalEmail,
        university: finalUniversity,
        departmentAndClass: finalDept,
        avatarEmoji: finalAvatarEmoji,
        avatarUrl: finalAvatarUrl,
        xp: finalXp,
        streak: finalStreak,
        level: Math.floor(finalXp / 100) + 1,
        completedCount: finalCompletedCount,
        unlockedBadges: mergedBadges,
        isPremium: Boolean(incoming.isPremium || existing.isPremium),
      };
    } else {
      list.push({ ...incoming });
    }
  };

  // 1. Add remote Supabase profiles (live database students)
  dbProfiles.forEach((p) => upsertProfile(p));

  // 3. Add local registered users
  registeredUsers.forEach((p) => upsertProfile(p));

  // 4. Upsert active logged in user ONLY IF authenticated
  if (isAuthenticated && currentUserProfile && (currentUserProfile.fullName || currentUserProfile.schoolEmail)) {
    const activeEntry: PublicProfile = {
      id: currentUserProfile.id || 'self',
      fullName: currentUserProfile.fullName || 'Öğrenci',
      schoolEmail: currentUserProfile.schoolEmail || '',
      university: currentUserProfile.university || 'Üniversite',
      departmentAndClass: currentUserProfile.departmentAndClass || '',
      avatarEmoji: currentUserProfile.avatarEmoji || '👨‍🎓',
      avatarUrl: currentUserProfile.avatarUrl || undefined,
      xp: currentXp,
      streak: currentStreak,
      rank: 1,
      level: Math.floor(currentXp / 100) + 1,
      completedCount,
      unlockedBadges: Array.isArray(unlockedBadges) ? unlockedBadges : [],
      isPremium: Boolean(currentUserProfile.isPremium),
    };
    upsertProfile(activeEntry, true);
  }

  // Sort descending by XP
  list.sort((a, b) => b.xp - a.xp);

  // Assign exact sequential 1-based ranks
  list.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  // Calculate current user's real index and rank
  let currentUserIdx = -1;
  if (isAuthenticated && currentUserProfile) {
    currentUserIdx = list.findIndex((p) => isSameStudent(p, currentUserProfile));
  }
  const userRank = currentUserIdx >= 0 ? currentUserIdx + 1 : 1;

  return {
    sortedLeaderboard: list,
    userRank,
    currentUserIdx,
  };
}
