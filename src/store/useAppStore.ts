import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserState, PublicProfile, RegisteredAccount } from '../types/stats';
import { saveUserProfileToSupabase, syncUserProgress, fetchUserProfileFromSupabase, isSupabaseConfigured, signInWithSupabase, supabase, deleteUserProfileFromSupabase } from '../lib/supabase';
import { isSameStudent } from '../utils/leaderboardHelper';
import { soundService } from '../services/soundService';
import { getDefaultAvatarForUser } from '../utils/avatarHelper';

export function isValidStudentEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const e = email.trim().toLowerCase();
  if (!e.includes('@')) return false;

  // Custom admin email exception
  if (e === 'admin@tancorelab.com') return true;

  // Accept any valid email format
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export const PROBABILITY_TRACK_MODULE_IDS = [
  'module-13', 'module-2', 'module-14', 'module-3', 'module-16', 'module-15', 'module-4', 'module-12'
];

export const STATISTICS_TRACK_MODULE_IDS = [
  'module-1', 'module-4', 'module-5', 'module-6', 'module-7', 'module-8', 'module-9', 'module-10', 'module-11'
];

export const INDR100_TRACK_MODULE_IDS = [
  'module-17', 'module-18', 'module-19', 'module-20', 'module-21', 'module-22', 'module-23', 'module-24'
];

export const INDR262_TRACK_MODULE_IDS = [
  'module-25', 'module-26', 'module-27', 'module-28', 'module-29', 'module-30', 'module-31', 'module-32', 'module-33'
];

export const ALL_SYSTEM_MODULE_IDS = [
  ...STATISTICS_TRACK_MODULE_IDS,
  ...PROBABILITY_TRACK_MODULE_IDS,
  ...INDR100_TRACK_MODULE_IDS,
  ...INDR262_TRACK_MODULE_IDS,
];


interface AppStoreActions {
  setLanguage: (lang: 'tr' | 'en') => void;
  toggleLanguage: () => void;
  completeLesson: (lessonId: string, moduleId: string, xpEarned?: number) => void;
  completeCaseExam: (caseId: string, moduleId: string, xpEarned?: number) => void;
  checkAndUpdateStreak: () => void;
  resetProgress: () => void;
  updateUserProfile: (profile: Partial<UserProfile>, newPassword?: string) => void;
  unlockUpToModule: (targetModuleId: string) => void;

  // Auth actions
  registerAccountAndSendOtp: (account: Partial<RegisteredAccount>, simulatedCode?: string) => void;
  verifyOtpAndActivateAccount: (token: string, forceActivate?: boolean) => { success: boolean; message?: string };
  loginWithPassword: (email: string, pass: string) => Promise<{ success: boolean; errorType?: 'INVALID_EMAIL_DOMAIN' | 'EMAIL_NOT_FOUND' | 'WRONG_PASSWORD'; message?: string }>;
  loginWithOtpSession: (email: string, sessionUser?: any) => Promise<{ success: boolean; message?: string }>;
  resetPasswordWithOtp: (email: string, token: string, newPass: string) => { success: boolean; message?: string };
  // Navigation actions (persisted on refresh)
  setCurrentView: (view: 'home' | 'course' | 'profile' | 'leaderboard' | 'lesson' | 'caseExam' | 'placementTest') => void;
  setSelectedLessonId: (id: string | null) => void;
  setSelectedCaseId: (id: string | null) => void;
  setSelectedTrack: (track: 'probability' | 'statistics' | 'indr100' | 'indr262') => void;
  setCustomActiveModuleName: (name: string | null) => void;
  logout: () => void;
  deleteAccount: (email?: string) => Promise<void>;
  setSelectedPublicProfile: (profile: PublicProfile | null) => void;
  syncRegisteredUserInList: () => void;
  setIsTancoChatOpen: (open: boolean) => void;
  addXp: (amount: number) => void;
  isPlusUpgradeModalOpen?: boolean;
  setIsPlusUpgradeModalOpen: (open: boolean) => void;
  openLemonCheckout: (customEmail?: string) => void;
  setSubscriptionStatus: (isPremium: boolean, status?: string) => void;
  isTancoActive?: boolean;
  isTancoMoved?: boolean;
  tancoPosition?: { x: number; y: number } | null;
  activateTanco: (initialPos: { x: number; y: number }) => void;
  setTancoPosition: (pos: { x: number; y: number }, isMoved?: boolean) => void;
  deactivateTanco: () => void;
  markTancoPaymentPending: () => void;
  isSoundEnabled?: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const TANCO_SESSION_KEY = 'tancore_tanco_session_v2';
const TANCO_TIMEOUT_MS = 60 * 1000; // 1 minute inactivity timeout

export interface TancoStoredSession {
  isTancoActive: boolean;
  isTancoMoved: boolean;
  tancoPosition: { x: number; y: number } | null;
  lastSeen: number;
  paymentPending?: boolean;
}

export function loadTancoSession(): {
  isTancoActive: boolean;
  isTancoMoved: boolean;
  tancoPosition: { x: number; y: number } | null;
} {
  try {
    const raw = localStorage.getItem(TANCO_SESSION_KEY);
    if (!raw) return { isTancoActive: false, isTancoMoved: false, tancoPosition: null };

    const parsed: TancoStoredSession = JSON.parse(raw);
    const now = Date.now();
    const lastSeen = typeof parsed.lastSeen === 'number' ? parsed.lastSeen : 0;
    const isPaymentPending = Boolean(parsed.paymentPending);

    // If payment was opened, or if less than 1 minute elapsed since user left app:
    const isValid = isPaymentPending || (now - lastSeen <= TANCO_TIMEOUT_MS);

    if (isValid && parsed.isTancoActive && parsed.tancoPosition) {
      parsed.lastSeen = now;
      parsed.paymentPending = false; // Reset payment flag once restored
      localStorage.setItem(TANCO_SESSION_KEY, JSON.stringify(parsed));
      return {
        isTancoActive: true,
        isTancoMoved: Boolean(parsed.isTancoMoved),
        tancoPosition: parsed.tancoPosition,
      };
    } else {
      // Expired (> 1 minute elapsed since user closed/left app): return to original card spot!
      localStorage.removeItem(TANCO_SESSION_KEY);
      return { isTancoActive: false, isTancoMoved: false, tancoPosition: null };
    }
  } catch {
    return { isTancoActive: false, isTancoMoved: false, tancoPosition: null };
  }
}

export function saveTancoSession(data: {
  isTancoActive: boolean;
  isTancoMoved?: boolean;
  tancoPosition: { x: number; y: number } | null;
  paymentPending?: boolean;
}) {
  try {
    if (!data.isTancoActive || !data.tancoPosition) {
      localStorage.removeItem(TANCO_SESSION_KEY);
      return;
    }
    const payload: TancoStoredSession = {
      isTancoActive: true,
      isTancoMoved: Boolean(data.isTancoMoved),
      tancoPosition: data.tancoPosition,
      lastSeen: Date.now(),
      paymentPending: Boolean(data.paymentPending),
    };
    localStorage.setItem(TANCO_SESSION_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: '',
  schoolEmail: '',
  university: '',
  departmentAndClass: '',
  avatarEmoji: '👨‍🎓',
  avatarUrl: '/avatars/avatar-1.jpg',
  isVerified: false,
  isPremium: false,
};

const DEFAULT_DEMO_ACCOUNTS: RegisteredAccount[] = [];

/**
 * Computes contiguous active streak count backwards from today (or reference date)
 */
export function computeContiguousStreak(activityDates?: string[], referenceDateStr?: string): number {
  const dates = Array.isArray(activityDates) ? activityDates : [];
  if (dates.length === 0) return 1;

  const today = referenceDateStr || new Date().toISOString().split('T')[0];
  const todayParts = today.split('-').map(Number);
  const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);

  let streak = 0;
  let checkDate = new Date(todayDate);
  const checkStr = checkDate.toISOString().split('T')[0];

  // If today is not in recorded dates, check if yesterday was recorded
  if (!dates.includes(checkStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    if (!dates.includes(yesterdayStr)) {
      return 1;
    }
  }

  // Walk backwards day by day to count unbroken active chain
  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (dates.includes(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return Math.max(1, streak);
}

const initialTanco = typeof window !== 'undefined' ? loadTancoSession() : { isTancoActive: false, isTancoMoved: false, tancoPosition: null };

const INITIAL_STATE: UserState = {
  language: 'tr',
  xp: 0,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  activityDates: [new Date().toISOString().split('T')[0]],
  completedLessons: [],
  completedCaseExams: [],
  unlockedModules: ['module-1', 'module-2'],
  unlockedBadges: [],
  userProfile: DEFAULT_PROFILE,
  isAuthenticated: false,
  isVerified: false,
  pendingOtpEmail: undefined,
  simulatedOtpCode: undefined,
  selectedPublicProfile: null,
  registeredUsers: [],
  userAccounts: DEFAULT_DEMO_ACCOUNTS,
  currentView: 'home',
  selectedLessonId: null,
  selectedCaseId: null,
  selectedTrack: 'probability',
  customActiveModuleName: null,
  isTancoChatOpen: false,
  isPlusUpgradeModalOpen: false,
  isTancoActive: initialTanco.isTancoActive,
  isTancoMoved: initialTanco.isTancoMoved,
  tancoPosition: initialTanco.tancoPosition,
  isSoundEnabled: true,
};

function syncUserInList(state: UserState): PublicProfile[] {
  const profile = state.userProfile;
  const currentEmail = profile.schoolEmail ? profile.schoolEmail.trim().toLowerCase() : '';
  const existingList = (state.registeredUsers || []).filter(Boolean);

  // Filter out any duplicates matching current user by normalized name, email, or database id
  const otherUsers = existingList.filter((u) => !isSameStudent(u, profile));

  if (!profile.schoolEmail || !state.isVerified) {
    otherUsers.sort((a, b) => b.xp - a.xp);
    return otherUsers.map((u, i) => ({ ...u, rank: i + 1 }));
  }

  const userEntry: PublicProfile = {
    id: profile.id || `usr_${currentEmail}`,
    fullName: profile.fullName || 'Öğrenci',
    schoolEmail: profile.schoolEmail,
    university: profile.university || '',
    departmentAndClass: profile.departmentAndClass || '',
    avatarEmoji: profile.avatarEmoji || '👨‍🎓',
    avatarUrl: profile.avatarUrl || getDefaultAvatarForUser(profile.fullName || currentEmail, profile.avatarEmoji),
    xp: state.xp,
    streak: state.streak,
    rank: 1,
    level: Math.floor(state.xp / 100) + 1,
    completedCount: state.completedLessons.length + state.completedCaseExams.length,
    unlockedBadges: state.unlockedBadges,
    isPremium: Boolean(profile.isPremium),
  };

  const newList = [userEntry, ...otherUsers];
  newList.sort((a, b) => b.xp - a.xp);
  return newList.map((u, i) => ({ ...u, rank: i + 1 }));
}

export const useAppStore = create<UserState & AppStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'tr' ? 'en' : 'tr' })),

      setIsTancoChatOpen: (open) => set({ isTancoChatOpen: open }),

      syncRegisteredUserInList: () => {
        set((state) => ({
          registeredUsers: syncUserInList(state),
        }));
      },

      registerAccountAndSendOtp: (accountInput, simulatedCode) => {
        const email = accountInput.schoolEmail?.trim().toLowerCase() || '';
        const currentStore = get();
        const defaultAvatar = getDefaultAvatarForUser(accountInput.fullName || email, accountInput.avatarEmoji);
        const newAccount: RegisteredAccount = {
          schoolEmail: email,
          fullName: accountInput.fullName?.trim() || 'Öğrenci',
          university: accountInput.university?.trim() || '',
          departmentAndClass: accountInput.departmentAndClass?.trim() || '',
          password: accountInput.password || '',
          avatarEmoji: accountInput.avatarEmoji || '👨‍🎓',
          avatarUrl: accountInput.avatarUrl || currentStore.userProfile?.avatarUrl || defaultAvatar,
          isVerified: false,
          xp: currentStore.xp || 0,
          streak: Math.max(1, currentStore.streak || 1),
          completedLessons: currentStore.completedLessons || [],
          completedCaseExams: currentStore.completedCaseExams || [],
          unlockedModules: currentStore.unlockedModules || ['module-1', 'module-2'],
          unlockedBadges: currentStore.unlockedBadges || [],
        };

        set((state) => {
          const accounts = state.userAccounts || [];
          const existingIdx = accounts.findIndex((a) => a.schoolEmail.toLowerCase() === email);
          let updatedAccounts: RegisteredAccount[];
          if (existingIdx >= 0) {
            updatedAccounts = [...accounts];
            updatedAccounts[existingIdx] = newAccount;
          } else {
            updatedAccounts = [...accounts, newAccount];
          }

          return {
            userAccounts: updatedAccounts,
            pendingOtpEmail: email,
            simulatedOtpCode: simulatedCode || undefined,
            userProfile: {
              fullName: newAccount.fullName,
              schoolEmail: newAccount.schoolEmail,
              university: newAccount.university,
              departmentAndClass: newAccount.departmentAndClass,
              avatarEmoji: newAccount.avatarEmoji,
              avatarUrl: newAccount.avatarUrl,
              isVerified: false,
              password: newAccount.password,
            },
          };
        });
      },

      verifyOtpAndActivateAccount: (token, forceActivate = false) => {
        const state = get();
        const pendingEmail = (state.pendingOtpEmail || state.userProfile.schoolEmail || '').trim().toLowerCase();
        const expectedCode = state.simulatedOtpCode;

        const isMatch = forceActivate || (Boolean(expectedCode) && token.trim() === expectedCode);

        if (!isMatch) {
          return { success: false, message: 'Girdiğiniz doğrulama kodu hatalı.' };
        }

        // Find or update account
        const accounts = state.userAccounts || [];
        const accIdx = accounts.findIndex((a) => a.schoolEmail.toLowerCase() === pendingEmail);

        let activeProfile: UserProfile;
        const currentCompletedLessons = state.completedLessons || [];
        const currentCompletedCases = state.completedCaseExams || [];
        const currentBadges = state.unlockedBadges || [];
        const currentUnlockedModules = state.unlockedModules || ['module-1', 'module-2'];
        let userXp = state.xp || 0;
        let userStreak = Math.max(1, state.streak || 1);

        if (accIdx >= 0) {
          accounts[accIdx].isVerified = true;
          activeProfile = {
            id: `usr_${pendingEmail}`,
            fullName: accounts[accIdx].fullName,
            schoolEmail: accounts[accIdx].schoolEmail,
            university: accounts[accIdx].university,
            departmentAndClass: accounts[accIdx].departmentAndClass,
            avatarEmoji: accounts[accIdx].avatarEmoji || '👨‍🎓',
            avatarUrl: accounts[accIdx].avatarUrl || state.userProfile?.avatarUrl || getDefaultAvatarForUser(accounts[accIdx].fullName || pendingEmail, accounts[accIdx].avatarEmoji),
            isVerified: true,
            createdAt: new Date().toISOString(),
          };
          userXp = Math.max(accounts[accIdx].xp || 0, userXp);
          userStreak = Math.max(accounts[accIdx].streak || 1, userStreak);
          accounts[accIdx].xp = userXp;
          accounts[accIdx].streak = userStreak;
          accounts[accIdx].completedLessons = Array.from(new Set([...(accounts[accIdx].completedLessons || []), ...currentCompletedLessons]));
          accounts[accIdx].completedCaseExams = Array.from(new Set([...(accounts[accIdx].completedCaseExams || []), ...currentCompletedCases]));
        } else {
          activeProfile = {
            id: `usr_${pendingEmail}`,
            fullName: state.userProfile.fullName || 'Öğrenci',
            schoolEmail: pendingEmail,
            university: state.userProfile.university || '',
            departmentAndClass: state.userProfile.departmentAndClass || '',
            avatarEmoji: state.userProfile.avatarEmoji || '👨‍🎓',
            avatarUrl: state.userProfile?.avatarUrl || getDefaultAvatarForUser(state.userProfile.fullName || pendingEmail, state.userProfile.avatarEmoji),
            isVerified: true,
            createdAt: new Date().toISOString(),
          };
        }

        const nextState = {
          ...state,
          userProfile: activeProfile,
          isAuthenticated: true,
          isVerified: true,
          xp: userXp,
          streak: userStreak,
          completedLessons: currentCompletedLessons,
          completedCaseExams: currentCompletedCases,
          unlockedBadges: currentBadges,
          unlockedModules: currentUnlockedModules,
          userAccounts: accounts,
        };

        const updatedLeaderboard = syncUserInList(nextState);

        set({
          userProfile: activeProfile,
          isAuthenticated: true,
          isVerified: true,
          xp: userXp,
          streak: userStreak,
          completedLessons: currentCompletedLessons,
          completedCaseExams: currentCompletedCases,
          unlockedBadges: currentBadges,
          unlockedModules: currentUnlockedModules,
          pendingOtpEmail: undefined,
          simulatedOtpCode: undefined,
          registeredUsers: updatedLeaderboard,
          userAccounts: accounts,
        });

        saveUserProfileToSupabase({
          ...activeProfile,
          xp: userXp,
          streak: userStreak,
          completedLessons: currentCompletedLessons.length + currentCompletedCases.length,
        });
        syncUserProgress({
          totalXp: userXp,
          level: Math.floor(userXp / 100) + 1,
          streak: userStreak,
          completedLessons: currentCompletedLessons,
          completedCaseExams: currentCompletedCases,
        });

        return { success: true };
      },

      loginWithPassword: async (email, pass) => {
        const cleanEmail = email.trim().toLowerCase();

        // 1. Check valid email
        if (!isValidStudentEmail(cleanEmail)) {
          return {
            success: false,
            errorType: 'INVALID_EMAIL_DOMAIN',
            message: 'Lütfen geçerli bir e-posta adresi giriniz.',
          };
        }

        const state = get();

        // 2. Authenticate via Supabase Auth (bcrypt hashed)
        if (isSupabaseConfigured) {
          const authRes = await signInWithSupabase(cleanEmail, pass);
          if (!authRes.success) {
            return {
              success: false,
              errorType: authRes.errorType === 'WRONG_PASSWORD' ? 'WRONG_PASSWORD' : 'EMAIL_NOT_FOUND',
              message: authRes.error || 'Giriş yapılamadı.',
            };
          }

          // Fetch full profile from Supabase profiles table
          const remoteProfile = await fetchUserProfileFromSupabase(cleanEmail);

          const loggedInProfile: UserProfile = {
            id: authRes.user?.id || `usr_${cleanEmail}`,
            fullName: remoteProfile?.full_name || authRes.user?.user_metadata?.full_name || cleanEmail.split('@')[0],
            schoolEmail: cleanEmail,
            university: remoteProfile?.university || 'Üniversite',
            departmentAndClass: remoteProfile?.department_and_class || 'Öğrenci',
            avatarEmoji: remoteProfile?.avatar_emoji || '👨‍🎓',
            avatarUrl: remoteProfile?.avatar_url || state.userProfile?.avatarUrl || getDefaultAvatarForUser(remoteProfile?.full_name || cleanEmail, remoteProfile?.avatar_emoji),
            isVerified: true,
            createdAt: new Date().toISOString(),
            isPremium: Boolean(remoteProfile?.is_premium || remoteProfile?.isPremium),
            subscriptionStatus: remoteProfile?.subscription_status || undefined,
            subscriptionRenewsAt: remoteProfile?.subscription_renews_at || undefined,
          };

          // Seamlessly merge guest progress with remote account progress
          const guestLessons = state.completedLessons || [];
          const guestCases = state.completedCaseExams || [];
          const remoteLessonsCount = typeof remoteProfile?.completed_lessons === 'number' ? remoteProfile.completed_lessons : 0;
          const mergedLessons = Array.from(new Set(guestLessons));
          const mergedCases = Array.from(new Set(guestCases));
          const remoteXp = typeof remoteProfile?.xp === 'number' ? remoteProfile.xp : 0;
          // Cloud remote XP is the authoritative source of truth; never double/sum XP upon login
          const userXp = remoteXp > 0 ? remoteXp : (state.xp || 0);
          const accounts = state.userAccounts || [];
          const existingAccount = accounts.find((a) => a.schoolEmail.trim().toLowerCase() === cleanEmail);

          // Email-based streak and activity history
          const emailStreak = typeof remoteProfile?.streak === 'number'
            ? remoteProfile.streak
            : (existingAccount?.streak || 1);

          const emailLastActive = remoteProfile?.last_active_date || existingAccount?.lastActiveDate || new Date().toISOString().split('T')[0];

          const emailActivityDates = Array.isArray(remoteProfile?.activity_dates) && remoteProfile.activity_dates.length > 0
            ? remoteProfile.activity_dates
            : (Array.isArray(existingAccount?.activityDates) && existingAccount.activityDates.length > 0
                ? existingAccount.activityDates
                : [new Date().toISOString().split('T')[0]]);

          const remoteUnlocked = Array.isArray(remoteProfile?.unlocked_modules) && remoteProfile.unlocked_modules.length > 0
            ? remoteProfile.unlocked_modules
            : ['module-1', 'module-2'];
          const unlockedModules = Array.from(new Set([...remoteUnlocked, ...(state.unlockedModules || [])]));

          const nextState = {
            ...state,
            userProfile: loggedInProfile,
            isAuthenticated: true,
            isVerified: true,
            xp: userXp,
            streak: emailStreak,
            lastActiveDate: emailLastActive,
            activityDates: emailActivityDates,
            completedLessons: mergedLessons,
            completedCaseExams: mergedCases,
            unlockedModules,
          };

          const updatedUsers = syncUserInList(nextState);

          set({
            userProfile: loggedInProfile,
            isAuthenticated: true,
            isVerified: true,
            xp: userXp,
            streak: emailStreak,
            lastActiveDate: emailLastActive,
            activityDates: emailActivityDates,
            completedLessons: mergedLessons,
            completedCaseExams: mergedCases,
            unlockedModules,
            pendingOtpEmail: undefined,
            simulatedOtpCode: undefined,
            registeredUsers: updatedUsers,
          });

          // Sync merged stats to remote
          saveUserProfileToSupabase({
            ...loggedInProfile,
            xp: userXp,
            streak: emailStreak,
            completedLessons: Math.max(remoteLessonsCount, mergedLessons.length + mergedCases.length),
          });
          syncUserProgress({
            totalXp: userXp,
            level: Math.floor(userXp / 100) + 1,
            streak: emailStreak,
            completedLessons: mergedLessons,
            completedCaseExams: mergedCases,
          });

          // Evaluate today's streak for this email account
          get().checkAndUpdateStreak();

          return { success: true };
        }

        // Fallback for offline/local accounts
        const accounts = state.userAccounts || [];
        const account = accounts.find((a) => a.schoolEmail.trim().toLowerCase() === cleanEmail);

        if (!account) {
          return {
            success: false,
            errorType: 'EMAIL_NOT_FOUND',
            message: 'Bu e-posta adresi henüz sistemde kayıtlı değil. Lütfen önce kayıt olun.',
          };
        }

        if (account.password && account.password !== pass.trim()) {
          return {
            success: false,
            errorType: 'WRONG_PASSWORD',
            message: 'Şifreniz yanlış.',
          };
        }

        const loggedInProfile: UserProfile = {
          id: `usr_${cleanEmail}`,
          fullName: account.fullName,
          schoolEmail: account.schoolEmail,
          university: account.university,
          departmentAndClass: account.departmentAndClass,
          avatarEmoji: account.avatarEmoji || '👨‍🎓',
          avatarUrl: account.avatarUrl || state.userProfile?.avatarUrl,
          isVerified: true,
          createdAt: new Date().toISOString(),
        };

        const mergedLessons = Array.from(new Set([...(account.completedLessons || []), ...(state.completedLessons || [])]));
        const mergedCases = Array.from(new Set([...(account.completedCaseExams || []), ...(state.completedCaseExams || [])]));
        const userXp = Math.max(account.xp || 0, state.xp || 0, (account.xp || 0) + (state.xp || 0));
        const userStreak = account.streak || 1;
        const userLastActive = account.lastActiveDate || new Date().toISOString().split('T')[0];
        const userActivityDates = Array.isArray(account.activityDates) && account.activityDates.length > 0
          ? account.activityDates
          : [new Date().toISOString().split('T')[0]];
        const unlockedModules = Array.from(new Set([...(account.unlockedModules || ['module-1', 'module-2']), ...(state.unlockedModules || [])]));

        set({
          userProfile: loggedInProfile,
          isAuthenticated: true,
          isVerified: true,
          xp: userXp,
          streak: userStreak,
          lastActiveDate: userLastActive,
          activityDates: userActivityDates,
          completedLessons: mergedLessons,
          completedCaseExams: mergedCases,
          unlockedModules,
        });

        get().checkAndUpdateStreak();

        return { success: true };
      },

      loginWithOtpSession: async (email, sessionUser) => {
        const cleanEmail = email.trim().toLowerCase();
        const state = get();

        let remoteProfile = null;
        if (isSupabaseConfigured) {
          remoteProfile = await fetchUserProfileFromSupabase(cleanEmail);
        }

        const loggedInProfile: UserProfile = {
          id: sessionUser?.id || remoteProfile?.id || `usr_${cleanEmail}`,
          fullName: remoteProfile?.full_name || sessionUser?.user_metadata?.full_name || cleanEmail.split('@')[0],
          schoolEmail: cleanEmail,
          university: remoteProfile?.university || 'Üniversite',
          departmentAndClass: remoteProfile?.department_and_class || 'Öğrenci',
          avatarEmoji: remoteProfile?.avatar_emoji || '👨‍🎓',
          avatarUrl: remoteProfile?.avatar_url || state.userProfile?.avatarUrl || getDefaultAvatarForUser(remoteProfile?.full_name || sessionUser?.user_metadata?.full_name || cleanEmail, remoteProfile?.avatar_emoji),
          isVerified: true,
          createdAt: new Date().toISOString(),
          isPremium: Boolean(remoteProfile?.is_premium || remoteProfile?.isPremium),
          subscriptionStatus: remoteProfile?.subscription_status || undefined,
          subscriptionRenewsAt: remoteProfile?.subscription_renews_at || undefined,
        };

        const guestLessons = state.completedLessons || [];
        const guestCases = state.completedCaseExams || [];
        const remoteLessonsCount = typeof remoteProfile?.completed_lessons === 'number' ? remoteProfile.completed_lessons : 0;
        const mergedLessons = Array.from(new Set(guestLessons));
        const mergedCases = Array.from(new Set(guestCases));
        const remoteXp = typeof remoteProfile?.xp === 'number' ? remoteProfile.xp : 0;
        const userXp = remoteXp > 0 ? remoteXp : (state.xp || 0);

        const accounts = state.userAccounts || [];
        const existingAccount = accounts.find((a) => a.schoolEmail.trim().toLowerCase() === cleanEmail);

        // Email-based streak and activity history
        const emailStreak = typeof remoteProfile?.streak === 'number'
          ? remoteProfile.streak
          : (existingAccount?.streak || 1);

        const emailLastActive = remoteProfile?.last_active_date || existingAccount?.lastActiveDate || new Date().toISOString().split('T')[0];

        const emailActivityDates = Array.isArray(remoteProfile?.activity_dates) && remoteProfile.activity_dates.length > 0
          ? remoteProfile.activity_dates
          : (Array.isArray(existingAccount?.activityDates) && existingAccount.activityDates.length > 0
              ? existingAccount.activityDates
              : [new Date().toISOString().split('T')[0]]);

        const remoteUnlocked = Array.isArray(remoteProfile?.unlocked_modules) && remoteProfile.unlocked_modules.length > 0
          ? remoteProfile.unlocked_modules
          : ['module-1', 'module-2'];
        const unlockedModules = Array.from(new Set([...remoteUnlocked, ...(state.unlockedModules || [])]));

        const nextState = {
          ...state,
          userProfile: loggedInProfile,
          isAuthenticated: true,
          isVerified: true,
          xp: userXp,
          streak: emailStreak,
          lastActiveDate: emailLastActive,
          activityDates: emailActivityDates,
          completedLessons: mergedLessons,
          completedCaseExams: mergedCases,
          unlockedModules,
        };

        const updatedUsers = syncUserInList(nextState);

        set({
          userProfile: loggedInProfile,
          isAuthenticated: true,
          isVerified: true,
          xp: userXp,
          streak: emailStreak,
          lastActiveDate: emailLastActive,
          activityDates: emailActivityDates,
          completedLessons: mergedLessons,
          completedCaseExams: mergedCases,
          unlockedModules,
          pendingOtpEmail: undefined,
          simulatedOtpCode: undefined,
          registeredUsers: updatedUsers,
        });

        saveUserProfileToSupabase({
          ...loggedInProfile,
          xp: userXp,
          streak: emailStreak,
          completedLessons: Math.max(remoteLessonsCount, mergedLessons.length + mergedCases.length),
        });
        syncUserProgress({
          totalXp: userXp,
          level: Math.floor(userXp / 100) + 1,
          streak: emailStreak,
          completedLessons: mergedLessons,
          completedCaseExams: mergedCases,
        });

        // Evaluate today's streak for this email account
        get().checkAndUpdateStreak();

        return { success: true };
      },

      resetPasswordWithOtp: (email, token, newPass) => {
        const cleanEmail = email.trim().toLowerCase();
        const state = get();
        const accounts = state.userAccounts || [];
        const accIdx = accounts.findIndex((a) => a.schoolEmail.toLowerCase() === cleanEmail);

        if (accIdx < 0) {
          return { success: false, message: 'Bu e-posta adresi sistemde kayıtlı değil.' };
        }

        if (token.trim() !== state.simulatedOtpCode) {
          return { success: false, message: 'Doğrulama kodu yanlış.' };
        }

        accounts[accIdx].password = newPass.trim();
        set({ userAccounts: accounts });
        return { success: true, message: 'Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.' };
      },

      updateUserProfile: (profile, newPassword) => {
        set((state) => {
          const updatedProfile = { ...state.userProfile, ...profile };
          if (newPassword && newPassword.trim()) {
            updatedProfile.password = newPassword.trim();
          }

          saveUserProfileToSupabase(updatedProfile);

          let updatedAccounts = state.userAccounts || [];
          const currentEmail = (state.userProfile.schoolEmail || '').toLowerCase();
          const targetEmail = (updatedProfile.schoolEmail || currentEmail).toLowerCase();
          const accIdx = updatedAccounts.findIndex((a) => a.schoolEmail.toLowerCase() === currentEmail);

          if (accIdx >= 0) {
            updatedAccounts = [...updatedAccounts];
            updatedAccounts[accIdx] = {
              ...updatedAccounts[accIdx],
              ...updatedProfile,
              schoolEmail: targetEmail,
              password: newPassword && newPassword.trim() ? newPassword.trim() : (updatedAccounts[accIdx].password || ''),
            };
          }

          const newState = { ...state, userProfile: updatedProfile, userAccounts: updatedAccounts };
          return {
            userProfile: updatedProfile,
            userAccounts: updatedAccounts,
            registeredUsers: syncUserInList(newState),
          };
        });
      },

      logout: () => {
        if (supabase) {
          supabase.auth.signOut().catch(() => {});
        }
        set((state) => {
          const newState = {
            ...state,
            isAuthenticated: false,
            isVerified: false,
            pendingOtpEmail: undefined,
            simulatedOtpCode: undefined,
            userProfile: DEFAULT_PROFILE,
            xp: 0,
            streak: 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
            activityDates: [new Date().toISOString().split('T')[0]],
            completedLessons: [],
            completedCaseExams: [],
            currentView: 'home' as const,
            selectedLessonId: null,
            selectedCaseId: null,
            customActiveModuleName: null,
            unlockedModules: ['module-1', 'module-2'],
          };
          return {
            ...newState,
            registeredUsers: syncUserInList(newState),
          };
        });
      },

      deleteAccount: async (email?: string) => {
        const state = get();
        const currentEmail = (email || state.userProfile?.schoolEmail || '').trim().toLowerCase();

        if (currentEmail) {
          await deleteUserProfileFromSupabase(currentEmail);
        }

        if (supabase) {
          try {
            await supabase.auth.signOut();
          } catch {}
        }

        const remainingAccounts = (state.userAccounts || []).filter(
          (a) => a.schoolEmail.trim().toLowerCase() !== currentEmail
        );

        set((prevState) => {
          const newState = {
            ...prevState,
            userAccounts: remainingAccounts,
            isAuthenticated: false,
            isVerified: false,
            pendingOtpEmail: undefined,
            simulatedOtpCode: undefined,
            userProfile: DEFAULT_PROFILE,
            xp: 0,
            streak: 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
            activityDates: [new Date().toISOString().split('T')[0]],
            completedLessons: [],
            completedCaseExams: [],
            currentView: 'home' as const,
            selectedLessonId: null,
            selectedCaseId: null,
            customActiveModuleName: null,
            unlockedModules: ['module-1', 'module-2'],
          };
          return {
            ...newState,
            registeredUsers: syncUserInList(newState),
          };
        });
      },

      setCurrentView: (view) => set({ currentView: view }),
      setSelectedLessonId: (id) => set({ selectedLessonId: id }),
      setSelectedCaseId: (id) => set({ selectedCaseId: id }),
      setSelectedTrack: (track) => set({ selectedTrack: track }),
      setCustomActiveModuleName: (name) => set({ customActiveModuleName: name }),

      setSelectedPublicProfile: (profile) => {
        set({ selectedPublicProfile: profile });
      },

      checkAndUpdateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        const activeEmail = state.userProfile?.schoolEmail?.trim().toLowerCase();
        const currentDates = Array.isArray(state.activityDates) ? state.activityDates : [];
        const updatedDates = currentDates.includes(today) ? currentDates : [...currentDates, today];

        const calculatedStreak = computeContiguousStreak(updatedDates, today);

        // Sync to accounts list for this email
        let updatedAccounts = state.userAccounts || [];
        if (activeEmail) {
          const accIdx = updatedAccounts.findIndex((a) => a.schoolEmail.toLowerCase() === activeEmail);
          if (accIdx >= 0) {
            updatedAccounts = [...updatedAccounts];
            updatedAccounts[accIdx] = {
              ...updatedAccounts[accIdx],
              streak: calculatedStreak,
              lastActiveDate: today,
              activityDates: updatedDates,
            };
          }
        }

        const nextState: UserState = {
          ...state,
          streak: calculatedStreak,
          lastActiveDate: today,
          activityDates: updatedDates,
          userAccounts: updatedAccounts,
        };

        const updatedUsers = syncUserInList(nextState);

        set({
          streak: calculatedStreak,
          lastActiveDate: today,
          activityDates: updatedDates,
          userAccounts: updatedAccounts,
          registeredUsers: updatedUsers,
        });

        if (state.userProfile?.schoolEmail) {
          saveUserProfileToSupabase({
            ...state.userProfile,
            streak: calculatedStreak,
            xp: state.xp,
            completedLessons: state.completedLessons.length + state.completedCaseExams.length,
          });
        }
      },

      completeLesson: (lessonId, moduleId, xpEarned = 15) => {
        const state = get();
        const safeXp = Math.max(0, Math.min(xpEarned || 15, 50));
        const alreadyCompleted = state.completedLessons.includes(lessonId);
        const newCompleted = alreadyCompleted
          ? state.completedLessons
          : [...state.completedLessons, lessonId];
        const newXp = alreadyCompleted ? state.xp : state.xp + safeXp;

        const newBadges = [...state.unlockedBadges];
        if (!newBadges.includes('badge-first-lesson')) {
          newBadges.push('badge-first-lesson');
        }
        if (newCompleted.length >= 10 && !newBadges.includes('badge-10-lessons')) {
          newBadges.push('badge-10-lessons');
        }

        const guestTimestamp = !state.isAuthenticated ? Date.now() : state.guestProgressTimestamp;

        const today = new Date().toISOString().split('T')[0];
        const currentDates = Array.isArray(state.activityDates) ? state.activityDates : [];
        const updatedDates = currentDates.includes(today) ? currentDates : [...currentDates, today];
        const calculatedStreak = computeContiguousStreak(updatedDates, today);

        const nextState: UserState = {
          ...state,
          completedLessons: newCompleted,
          xp: newXp,
          streak: calculatedStreak,
          lastActiveDate: today,
          activityDates: updatedDates,
          unlockedBadges: newBadges,
          guestProgressTimestamp: guestTimestamp,
        };

        const updatedUsers = syncUserInList(nextState);

        set({
          completedLessons: newCompleted,
          xp: newXp,
          streak: calculatedStreak,
          lastActiveDate: today,
          activityDates: updatedDates,
          unlockedBadges: newBadges,
          guestProgressTimestamp: guestTimestamp,
          registeredUsers: updatedUsers,
        });

        syncUserProgress({
          totalXp: newXp,
          level: Math.floor(newXp / 100) + 1,
          streak: calculatedStreak,
          completedLessons: newCompleted,
          completedCaseExams: state.completedCaseExams,
        });

        // Sync updated stats to profiles table
        if (state.userProfile?.schoolEmail) {
          saveUserProfileToSupabase({
            ...state.userProfile,
            xp: newXp,
            streak: calculatedStreak,
            completedLessons: newCompleted.length + state.completedCaseExams.length,
          });
        }
      },

      completeCaseExam: (caseId, moduleId, xpEarned = 25) => {
        const state = get();
        const safeXp = Math.max(0, Math.min(xpEarned || 25, 100));
        const alreadyCompleted = state.completedCaseExams.includes(caseId);
        const newCompleted = alreadyCompleted
          ? state.completedCaseExams
          : [...state.completedCaseExams, caseId];
        const newXp = alreadyCompleted ? state.xp : state.xp + safeXp;

        const newBadges = [...state.unlockedBadges];
        if (!newBadges.includes('badge-first-case')) {
          newBadges.push('badge-first-case');
        }
        if (newCompleted.length >= 5 && !newBadges.includes('badge-case-master')) {
          newBadges.push('badge-case-master');
        }

        // Unlock next module in the relevant course track sequence
        const isProb = PROBABILITY_TRACK_MODULE_IDS.includes(moduleId);
        const isIndr = INDR100_TRACK_MODULE_IDS.includes(moduleId);
        const trackList = isProb
          ? PROBABILITY_TRACK_MODULE_IDS
          : isIndr
          ? INDR100_TRACK_MODULE_IDS
          : STATISTICS_TRACK_MODULE_IDS;
        const trackIdx = trackList.indexOf(moduleId);
        const updatedUnlocked = [...state.unlockedModules];
        if (trackIdx >= 0 && trackIdx < trackList.length - 1) {
          const nextModId = trackList[trackIdx + 1];
          if (!updatedUnlocked.includes(nextModId)) {
            updatedUnlocked.push(nextModId);
          }
        }

        const guestTimestamp = !state.isAuthenticated ? Date.now() : state.guestProgressTimestamp;

        const today = new Date().toISOString().split('T')[0];
        const currentDates = Array.isArray(state.activityDates) ? state.activityDates : [];
        const updatedDates = currentDates.includes(today) ? currentDates : [...currentDates, today];
        const calculatedStreak = computeContiguousStreak(updatedDates, today);

        const nextState: UserState = {
          ...state,
          completedCaseExams: newCompleted,
          xp: newXp,
          streak: calculatedStreak,
          lastActiveDate: today,
          activityDates: updatedDates,
          unlockedModules: updatedUnlocked,
          unlockedBadges: newBadges,
          guestProgressTimestamp: guestTimestamp,
        };

        const updatedUsers = syncUserInList(nextState);

        set({
          completedCaseExams: newCompleted,
          xp: newXp,
          streak: calculatedStreak,
          lastActiveDate: today,
          activityDates: updatedDates,
          unlockedModules: updatedUnlocked,
          unlockedBadges: newBadges,
          guestProgressTimestamp: guestTimestamp,
          registeredUsers: updatedUsers,
        });

        syncUserProgress({
          totalXp: newXp,
          level: Math.floor(newXp / 100) + 1,
          streak: calculatedStreak,
          completedLessons: state.completedLessons,
          completedCaseExams: newCompleted,
        });

        // Sync updated stats to profiles table
        if (state.userProfile?.schoolEmail) {
          saveUserProfileToSupabase({
            ...state.userProfile,
            xp: newXp,
            streak: calculatedStreak,
            completedLessons: state.completedLessons.length + newCompleted.length,
          });
        }
      },

      unlockUpToModule: (targetModuleId) => {
        const isProb = PROBABILITY_TRACK_MODULE_IDS.includes(targetModuleId);
        const trackList = isProb ? PROBABILITY_TRACK_MODULE_IDS : STATISTICS_TRACK_MODULE_IDS;
        const targetIdx = trackList.indexOf(targetModuleId);
        const newUnlocked = [...get().unlockedModules];

        if (targetIdx >= 0) {
          for (let i = 0; i <= targetIdx; i++) {
            const modId = trackList[i];
            if (!newUnlocked.includes(modId)) {
              newUnlocked.push(modId);
            }
          }
        } else if (!newUnlocked.includes(targetModuleId)) {
          newUnlocked.push(targetModuleId);
        }

        const nextState = { ...get(), unlockedModules: newUnlocked };
        const updatedUsers = syncUserInList(nextState);

        set({
          unlockedModules: newUnlocked,
          registeredUsers: updatedUsers,
        });
      },

      addXp: (amount: number) => {
        const state = get();
        // Guard against arbitrary injection: limit per addition
        const safeAmount = Math.max(0, Math.min(Math.round(amount || 0), 100));
        const totalCompleted = state.completedLessons.length + state.completedCaseExams.length;
        const maxAllowedXp = totalCompleted * 45 + Math.min(state.streak || 1, 365) * 50 + 2000;
        const newXp = Math.min((state.xp || 0) + safeAmount, maxAllowedXp);

        const nextState = { ...state, xp: newXp };
        const updatedUsers = syncUserInList(nextState);

        set({
          xp: newXp,
          registeredUsers: updatedUsers,
        });

        if (state.userProfile?.schoolEmail) {
          saveUserProfileToSupabase({
            ...state.userProfile,
            xp: newXp,
            streak: state.streak,
            completedLessons: state.completedLessons.length + state.completedCaseExams.length,
          });
        }
        syncUserProgress({
          totalXp: newXp,
          level: Math.floor(newXp / 100) + 1,
          streak: state.streak,
          completedLessons: state.completedLessons,
          completedCaseExams: state.completedCaseExams,
        });
      },

      setIsPlusUpgradeModalOpen: (open) => set({ isPlusUpgradeModalOpen: open }),

      openLemonCheckout: (customEmail) => {
        const state = get();
        state.markTancoPaymentPending();
        const email = customEmail || state.userProfile?.schoolEmail || '';
        const name = state.userProfile?.fullName || '';
        const baseUrl = 'https://tancorelab.lemonsqueezy.com/checkout/buy/7f8fd627-8384-4a2c-9b36-da2f05a7b216';
        const params = new URLSearchParams({
          desc: '0',
          discount: '0',
        });
        if (email) {
          params.set('checkout[email]', email);
          params.set('checkout[custom][user_email]', email);
        }
        if (name) {
          params.set('checkout[name]', name);
        }
        const finalUrl = `${baseUrl}?${params.toString()}`;
        window.open(finalUrl, '_blank');
      },

      setSubscriptionStatus: (isPremium, status) => {
        const state = get();
        const updatedProfile: UserProfile = {
          ...state.userProfile,
          isPremium,
          subscriptionStatus: status || (isPremium ? 'active' : 'inactive'),
        };
        set({
          userProfile: updatedProfile,
        });
        if (state.isAuthenticated && updatedProfile.schoolEmail) {
          saveUserProfileToSupabase({
            ...updatedProfile,
            xp: state.xp,
            streak: state.streak,
            completedLessons: state.completedLessons.length + state.completedCaseExams.length,
          });
        }
      },

      resetProgress: () => {
        set({
          completedLessons: [],
          completedCaseExams: [],
          xp: 0,
          streak: 1,
          unlockedModules: ['module-1', 'module-2'],
          unlockedBadges: [],
        });
      },

      activateTanco: (initialPos) => {
        set({
          isTancoActive: true,
          isTancoMoved: false,
          tancoPosition: initialPos,
        });
        saveTancoSession({
          isTancoActive: true,
          isTancoMoved: false,
          tancoPosition: initialPos,
        });
      },

      setTancoPosition: (pos, isMoved = false) => {
        set((state) => {
          const moved = isMoved || Boolean(state.isTancoMoved);
          saveTancoSession({
            isTancoActive: true,
            isTancoMoved: moved,
            tancoPosition: pos,
          });
          return {
            tancoPosition: pos,
            isTancoMoved: moved,
          };
        });
      },

      deactivateTanco: () => {
        set({
          isTancoActive: false,
          isTancoMoved: false,
          tancoPosition: null,
        });
        saveTancoSession({
          isTancoActive: false,
          isTancoMoved: false,
          tancoPosition: null,
        });
      },

      markTancoPaymentPending: () => {
        const state = get();
        if (state.isTancoActive && state.tancoPosition) {
          saveTancoSession({
            isTancoActive: true,
            isTancoMoved: state.isTancoMoved,
            tancoPosition: state.tancoPosition,
            paymentPending: true,
          });
        }
      },

      toggleSound: () => {
        set((state) => {
          const next = !(state.isSoundEnabled ?? true);
          soundService.setEnabled(next);
          return { isSoundEnabled: next };
        });
      },

      setSoundEnabled: (enabled: boolean) => {
        soundService.setEnabled(enabled);
        set({ isSoundEnabled: enabled });
      },
    }),
    {
      name: 'tancorelab-statsim-v5',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 1. Backward-compatible migration: If current storage key has no completed lessons/cases, restore from previous version keys
          if (typeof window !== 'undefined' && (state.completedLessons?.length || 0) === 0 && (state.completedCaseExams?.length || 0) === 0) {
            const legacyKeys = [
              'tancorelab-statsim-v4',
              'tancorelab-statsim-v3',
              'tancorelab-statsim-v2',
              'tancorelab-statsim-v1',
              'tancorelab-storage',
              'tancorelab-guest-progress',
            ];
            for (const k of legacyKeys) {
              try {
                const raw = localStorage.getItem(k);
                if (raw) {
                  const parsed = JSON.parse(raw);
                  const legacyState = parsed?.state || parsed;
                  if (
                    (Array.isArray(legacyState?.completedLessons) && legacyState.completedLessons.length > 0) ||
                    (Array.isArray(legacyState?.completedCaseExams) && legacyState.completedCaseExams.length > 0) ||
                    (typeof legacyState?.xp === 'number' && legacyState.xp > 0)
                  ) {
                    state.completedLessons = Array.isArray(legacyState.completedLessons) ? legacyState.completedLessons : state.completedLessons;
                    state.completedCaseExams = Array.isArray(legacyState.completedCaseExams) ? legacyState.completedCaseExams : state.completedCaseExams;
                    state.xp = typeof legacyState.xp === 'number' ? legacyState.xp : state.xp;
                    state.streak = typeof legacyState.streak === 'number' ? legacyState.streak : state.streak;
                    state.unlockedModules = Array.from(new Set([...(state.unlockedModules || ['module-1', 'module-2']), ...(legacyState.unlockedModules || [])]));
                    state.unlockedBadges = Array.from(new Set([...(state.unlockedBadges || []), ...(legacyState.unlockedBadges || [])]));
                    if (legacyState.userProfile && !state.userProfile?.schoolEmail && legacyState.userProfile.schoolEmail) {
                      state.userProfile = legacyState.userProfile;
                      state.isAuthenticated = Boolean(legacyState.isAuthenticated);
                      state.isVerified = Boolean(legacyState.isVerified);
                    }
                    if (Array.isArray(legacyState.userAccounts) && legacyState.userAccounts.length > 0) {
                      state.userAccounts = Array.from(new Set([...(state.userAccounts || []), ...legacyState.userAccounts]));
                    }
                    break;
                  }
                }
              } catch {
                // Ignore legacy parse errors
              }
            }
          }

          // 2. Ensure safe array defaults
          state.completedLessons = Array.isArray(state.completedLessons) ? state.completedLessons : [];
          state.completedCaseExams = Array.isArray(state.completedCaseExams) ? state.completedCaseExams : [];
          state.unlockedModules = Array.isArray(state.unlockedModules) && state.unlockedModules.length > 0
            ? state.unlockedModules
            : ['module-1', 'module-2'];
          state.unlockedBadges = Array.isArray(state.unlockedBadges) ? state.unlockedBadges : [];
          state.activityDates = Array.isArray(state.activityDates) && state.activityDates.length > 0
            ? state.activityDates
            : [new Date().toISOString().split('T')[0]];

          // 3. Sound is enabled
          state.isSoundEnabled = state.isSoundEnabled ?? true;
          soundService.setEnabled(state.isSoundEnabled);

          // 4. Check Tanco session: if within 1 minute or returning from payment, preserve position; otherwise reset to card!
          const tancoSession = loadTancoSession();
          state.isTancoActive = tancoSession.isTancoActive;
          state.isTancoMoved = tancoSession.isTancoMoved;
          state.tancoPosition = tancoSession.tancoPosition;

          // 5. Anti-tamper sanity check on XP
          const completedCount = state.completedLessons.length + state.completedCaseExams.length;
          const maxAllowedXp = completedCount * 45 + Math.min(state.streak || 1, 365) * 50 + 2000;

          if (typeof state.xp !== 'number' || isNaN(state.xp) || state.xp < 0) {
            state.xp = 0;
          } else if (state.xp > maxAllowedXp) {
            state.xp = maxAllowedXp;
          }

          // 6. User profile sync & remote preservation
          if (state.userProfile) {
            const acc = state.userAccounts?.find(
              (a) => a.schoolEmail.toLowerCase() === state.userProfile.schoolEmail?.toLowerCase()
            );
            if (acc && acc.fullName && !state.userProfile.fullName) {
              state.userProfile.fullName = acc.fullName;
            }
            if (acc && acc.avatarUrl && !state.userProfile.avatarUrl) {
              state.userProfile.avatarUrl = acc.avatarUrl;
            }

            // Sync real stats, avatar & PLUS status from Supabase on app load without overwriting local lesson progress
            if (state.isAuthenticated && state.userProfile.schoolEmail && isSupabaseConfigured) {
              fetchUserProfileFromSupabase(state.userProfile.schoolEmail).then((remote) => {
                if (remote) {
                  const store = useAppStore.getState();
                  const remoteXp = typeof remote.xp === 'number' ? Math.min(remote.xp, maxAllowedXp) : store.xp;
                  const mergedXp = Math.max(store.xp, remoteXp);
                  const mergedStreak = Math.max(store.streak, typeof remote.streak === 'number' ? remote.streak : 1);
                  const remoteUnlocked = Array.isArray(remote.unlocked_modules) ? remote.unlocked_modules : [];
                  const mergedUnlocked = Array.from(new Set([...(store.unlockedModules || ['module-1', 'module-2']), ...remoteUnlocked]));

                  useAppStore.setState({
                    userProfile: {
                      ...store.userProfile,
                      fullName: remote.full_name || store.userProfile.fullName,
                      avatarUrl: remote.avatar_url || store.userProfile.avatarUrl,
                      avatarEmoji: remote.avatar_emoji || store.userProfile.avatarEmoji,
                      university: remote.university || store.userProfile.university,
                      departmentAndClass: remote.department_and_class || store.userProfile.departmentAndClass,
                      isPremium: Boolean(remote.is_premium || remote.isPremium),
                      subscriptionStatus: remote.subscription_status || store.userProfile.subscriptionStatus,
                      subscriptionRenewsAt: remote.subscription_renews_at || store.userProfile.subscriptionRenewsAt,
                    },
                    xp: mergedXp,
                    streak: Math.min(mergedStreak, 365),
                    unlockedModules: mergedUnlocked,
                  });
                }
              }).catch(() => {});
            }
          }
        }
      },
    }
  )
);
