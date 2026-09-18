import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserState, PublicProfile, RegisteredAccount } from '../types/stats';
import { saveUserProfileToSupabase, syncUserProgress, fetchUserProfileFromSupabase, isSupabaseConfigured, signInWithSupabase, supabase } from '../lib/supabase';
import { isSameStudent } from '../utils/leaderboardHelper';
import { soundService } from '../services/soundService';

export function isValidStudentEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const e = email.trim().toLowerCase();
  if (!e.includes('@')) return false;

  // Custom admin email exception
  if (e === 'admin@tancorelab.com') return true;

  // Accept any valid email format
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export const ALL_SYSTEM_MODULE_IDS = [
  'module-1', 'module-2', 'module-3', 'module-4', 'module-5', 'module-6', 'module-7', 'module-8',
  'module-9', 'module-10', 'module-11', 'module-12', 'module-13', 'module-14', 'module-15', 'module-16'
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
  resetPasswordWithOtp: (email: string, token: string, newPass: string) => { success: boolean; message?: string };
  // Navigation actions (persisted on refresh)
  setCurrentView: (view: 'home' | 'course' | 'profile' | 'leaderboard' | 'lesson' | 'caseExam' | 'placementTest') => void;
  setSelectedLessonId: (id: string | null) => void;
  setSelectedCaseId: (id: string | null) => void;
  setSelectedTrack: (track: 'probability' | 'statistics') => void;
  setCustomActiveModuleName: (name: string | null) => void;
  logout: () => void;
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
  isVerified: false,
  isPremium: false,
};

const DEFAULT_DEMO_ACCOUNTS: RegisteredAccount[] = [];

export function getInitialDemoActivityDates(streakCount = 3): string[] {
  const dates: string[] = [];
  const now = new Date();
  const todayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday

  // 1. Current continuous active streak days leading up to today
  for (let s = 0; s < streakCount; s++) {
    const d = new Date(now);
    d.setDate(now.getDate() - s);
    dates.push(d.toISOString().split('T')[0]);
  }

  // 2. If today is Wednesday or later, include Sunday (& Monday) as earlier solved days
  // before an interrupted streak day (e.g. Tuesday was missed) so they appear icy (buzlu)
  if (todayIndex >= 3) {
    const sunDate = new Date(now);
    sunDate.setDate(now.getDate() - todayIndex);
    dates.push(sunDate.toISOString().split('T')[0]);

    if (todayIndex >= 4) {
      const monDate = new Date(now);
      monDate.setDate(now.getDate() - todayIndex + 1);
      dates.push(monDate.toISOString().split('T')[0]);
    }
  }

  return Array.from(new Set(dates));
}

const initialTanco = typeof window !== 'undefined' ? loadTancoSession() : { isTancoActive: false, isTancoMoved: false, tancoPosition: null };

const INITIAL_STATE: UserState = {
  language: 'tr',
  xp: 0,
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  activityDates: getInitialDemoActivityDates(3),
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
    avatarUrl: profile.avatarUrl,
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

      setIsTancoChatOpen: (open) => set({ isTancoChatOpen: open }),

      syncRegisteredUserInList: () => {
        set((state) => ({
          registeredUsers: syncUserInList(state),
        }));
      },

      registerAccountAndSendOtp: (accountInput, simulatedCode) => {
        const email = accountInput.schoolEmail?.trim().toLowerCase() || '';
        const currentStore = get();
        const newAccount: RegisteredAccount = {
          schoolEmail: email,
          fullName: accountInput.fullName?.trim() || 'Öğrenci',
          university: accountInput.university?.trim() || '',
          departmentAndClass: accountInput.departmentAndClass?.trim() || '',
          password: accountInput.password || '',
          avatarEmoji: accountInput.avatarEmoji || '👨‍🎓',
          avatarUrl: accountInput.avatarUrl || currentStore.userProfile?.avatarUrl || undefined,
          isVerified: false,
          xp: Math.max(15, currentStore.xp || 15),
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
        let userXp = Math.max(15, state.xp || 15);
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
            avatarUrl: accounts[accIdx].avatarUrl || state.userProfile?.avatarUrl || undefined,
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
            avatarUrl: state.userProfile?.avatarUrl || undefined,
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
            avatarUrl: remoteProfile?.avatar_url || state.userProfile?.avatarUrl || undefined,
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
          const userXp = remoteXp > 0 ? remoteXp : Math.max(15, state.xp || 15);
          const remoteStreak = typeof remoteProfile?.streak === 'number' ? remoteProfile.streak : 1;
          const userStreak = Math.max(remoteStreak, state.streak || 1);

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
            streak: userStreak,
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
            streak: userStreak,
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
            streak: userStreak,
            completedLessons: Math.max(remoteLessonsCount, mergedLessons.length + mergedCases.length),
          });
          syncUserProgress({
            totalXp: userXp,
            level: Math.floor(userXp / 100) + 1,
            streak: userStreak,
            completedLessons: mergedLessons,
            completedCaseExams: mergedCases,
          });

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
        const userStreak = Math.max(account.streak || 1, state.streak || 1);
        const unlockedModules = Array.from(new Set([...(account.unlockedModules || ['module-1', 'module-2']), ...(state.unlockedModules || [])]));

        set({
          userProfile: loggedInProfile,
          isAuthenticated: true,
          isVerified: true,
          xp: userXp,
          streak: userStreak,
          completedLessons: mergedLessons,
          completedCaseExams: mergedCases,
          unlockedModules,
        });

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

      setLanguage: (language) => set({ language }),

      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'tr' ? 'en' : 'tr' })),

      checkAndUpdateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        const lastActive = state.lastActiveDate;
        const currentDates = state.activityDates && state.activityDates.length > 0
          ? state.activityDates
          : getInitialDemoActivityDates(state.streak || 3);
        const updatedDates = currentDates.includes(today) ? currentDates : [...currentDates, today];

        if (!lastActive) {
          set({ lastActiveDate: today, streak: 1, activityDates: updatedDates });
          if (state.userProfile?.schoolEmail) {
            saveUserProfileToSupabase({ ...state.userProfile, streak: 1, xp: state.xp, completedLessons: state.completedLessons.length + state.completedCaseExams.length });
          }
          return;
        }

        const lastDateObj = new Date(lastActive);
        const todayDateObj = new Date(today);
        const diffTime = Math.abs(todayDateObj.getTime() - lastDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          const newStreak = state.streak + 1;
          set({ streak: newStreak, lastActiveDate: today, activityDates: updatedDates });
          if (state.userProfile?.schoolEmail) {
            saveUserProfileToSupabase({ ...state.userProfile, streak: newStreak, xp: state.xp, completedLessons: state.completedLessons.length + state.completedCaseExams.length });
          }
        } else if (diffDays > 1) {
          // Interrupted streak: reset active streak to 1, but retain historical dates so older days appear icy (buzlu)
          set({ streak: 1, lastActiveDate: today, activityDates: updatedDates });
          if (state.userProfile?.schoolEmail) {
            saveUserProfileToSupabase({ ...state.userProfile, streak: 1, xp: state.xp, completedLessons: state.completedLessons.length + state.completedCaseExams.length });
          }
        } else {
          // Same day: ensure activityDates has today
          if (!currentDates.includes(today)) {
            set({ activityDates: updatedDates });
          }
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

        const modIdx = parseInt(moduleId.replace('module-', ''), 10);
        const nextModuleId = `module-${modIdx + 1}`;
        const newUnlocked = state.unlockedModules.includes(nextModuleId)
          ? state.unlockedModules
          : [...state.unlockedModules, nextModuleId];

        const newBadges = [...state.unlockedBadges];
        if (!newBadges.includes('badge-first-lesson')) {
          newBadges.push('badge-first-lesson');
        }
        if (newCompleted.length >= 10 && !newBadges.includes('badge-10-lessons')) {
          newBadges.push('badge-10-lessons');
        }

        const guestTimestamp = !state.isAuthenticated ? Date.now() : state.guestProgressTimestamp;

        const today = new Date().toISOString().split('T')[0];
        const currentDates = state.activityDates && state.activityDates.length > 0
          ? state.activityDates
          : getInitialDemoActivityDates(state.streak || 3);
        const updatedDates = currentDates.includes(today) ? currentDates : [...currentDates, today];

        const nextState: UserState = {
          ...state,
          completedLessons: newCompleted,
          xp: newXp,
          activityDates: updatedDates,
          unlockedModules: newUnlocked,
          unlockedBadges: newBadges,
          guestProgressTimestamp: guestTimestamp,
        };

        const updatedUsers = syncUserInList(nextState);

        set({
          completedLessons: newCompleted,
          xp: newXp,
          activityDates: updatedDates,
          unlockedModules: newUnlocked,
          unlockedBadges: newBadges,
          guestProgressTimestamp: guestTimestamp,
          registeredUsers: updatedUsers,
        });

        syncUserProgress({
          totalXp: newXp,
          level: Math.floor(newXp / 100) + 1,
          streak: state.streak,
          completedLessons: newCompleted,
          completedCaseExams: state.completedCaseExams,
        });

        // Sync updated stats to profiles table
        if (state.userProfile?.schoolEmail) {
          saveUserProfileToSupabase({
            ...state.userProfile,
            xp: newXp,
            streak: state.streak,
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

        const guestTimestamp = !state.isAuthenticated ? Date.now() : state.guestProgressTimestamp;

        const today = new Date().toISOString().split('T')[0];
        const currentDates = state.activityDates && state.activityDates.length > 0
          ? state.activityDates
          : getInitialDemoActivityDates(state.streak || 3);
        const updatedDates = currentDates.includes(today) ? currentDates : [...currentDates, today];

        const nextState: UserState = {
          ...state,
          completedCaseExams: newCompleted,
          xp: newXp,
          activityDates: updatedDates,
          unlockedBadges: newBadges,
          guestProgressTimestamp: guestTimestamp,
        };

        const updatedUsers = syncUserInList(nextState);

        set({
          completedCaseExams: newCompleted,
          xp: newXp,
          activityDates: updatedDates,
          unlockedBadges: newBadges,
          guestProgressTimestamp: guestTimestamp,
          registeredUsers: updatedUsers,
        });

        syncUserProgress({
          totalXp: newXp,
          level: Math.floor(newXp / 100) + 1,
          streak: state.streak,
          completedLessons: state.completedLessons,
          completedCaseExams: newCompleted,
        });

        // Sync updated stats to profiles table
        if (state.userProfile?.schoolEmail) {
          saveUserProfileToSupabase({
            ...state.userProfile,
            xp: newXp,
            streak: state.streak,
            completedLessons: state.completedLessons.length + newCompleted.length,
          });
        }
      },

      unlockUpToModule: (targetModuleId) => {
        const targetIdx = parseInt(targetModuleId.replace('module-', ''), 10);
        const newUnlocked = [...get().unlockedModules];

        for (let i = 1; i <= targetIdx; i++) {
          const modId = `module-${i}`;
          if (!newUnlocked.includes(modId)) {
            newUnlocked.push(modId);
          }
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
          // Sound is always enabled
          state.isSoundEnabled = true;
          soundService.setEnabled(true);

          // Check Tanco session: if within 1 minute or returning from payment, preserve position; otherwise reset to card!
          const tancoSession = loadTancoSession();
          state.isTancoActive = tancoSession.isTancoActive;
          state.isTancoMoved = tancoSession.isTancoMoved;
          state.tancoPosition = tancoSession.tancoPosition;

          // Anti-tamper sanity check on rehydration
          const completedCount = (state.completedLessons?.length || 0) + (state.completedCaseExams?.length || 0);
          const maxAllowedXp = completedCount * 45 + Math.min(state.streak || 1, 365) * 50 + 2000;

          if (typeof state.xp !== 'number' || isNaN(state.xp) || state.xp < 0) {
            state.xp = 0;
          } else if (state.xp > maxAllowedXp) {
            console.warn('TanCoreLab Security: Storage XP clamped to verified maximum.');
            state.xp = maxAllowedXp;
          }

          // 1-day device retention check for unauthenticated guest users
          if (!state.isAuthenticated && state.guestProgressTimestamp) {
            const ONE_DAY_MS = 24 * 60 * 60 * 1000;
            if (Date.now() - state.guestProgressTimestamp > ONE_DAY_MS) {
              state.completedLessons = [];
              state.completedCaseExams = [];
              state.xp = 0;
              state.streak = 0;
              state.unlockedBadges = [];
              state.unlockedModules = ['module-1'];
            }
          }

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

            // Sync real stats, avatar & PLUS status from Supabase on app load
            if (state.isAuthenticated && state.userProfile.schoolEmail && isSupabaseConfigured) {
              fetchUserProfileFromSupabase(state.userProfile.schoolEmail).then((remote) => {
                if (remote) {
                  const store = useAppStore.getState();
                  const remoteXp = typeof remote.xp === 'number' ? Math.min(remote.xp, maxAllowedXp) : store.xp;
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
                    xp: remoteXp,
                    streak: typeof remote.streak === 'number' ? Math.min(remote.streak, 365) : store.streak,
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
