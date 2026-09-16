import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserState, PublicProfile, RegisteredAccount } from '../types/stats';
import { saveUserProfileToSupabase, syncUserProgress } from '../lib/supabase';

export function isValidStudentEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (!e.includes('@')) return false;

  // Allow student email domains ending with .edu.tr or .edu, or admin emails
  if (e === 'admin@tancorelab.com' || e.startsWith('admin@')) return true;

  return e.endsWith('.edu.tr') || e.endsWith('.edu');
}

interface AppStoreActions {
  setLanguage: (lang: 'tr' | 'en') => void;
  toggleLanguage: () => void;
  completeLesson: (lessonId: string, moduleId: string, xpEarned?: number) => void;
  completeCaseExam: (caseId: string, moduleId: string, xpEarned?: number) => void;
  checkAndUpdateStreak: () => void;
  resetProgress: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  unlockUpToModule: (targetModuleId: string) => void;

  // Auth actions
  registerAccountAndSendOtp: (account: Partial<RegisteredAccount>, simulatedCode?: string) => void;
  verifyOtpAndActivateAccount: (token: string) => { success: boolean; message?: string };
  loginWithPassword: (email: string, pass: string) => { success: boolean; errorType?: 'INVALID_EMAIL_DOMAIN' | 'EMAIL_NOT_FOUND' | 'WRONG_PASSWORD'; message?: string };
  resetPasswordWithOtp: (email: string, token: string, newPass: string) => { success: boolean; message?: string };
  logout: () => void;
  setSelectedPublicProfile: (profile: PublicProfile | null) => void;
  syncRegisteredUserInList: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: '',
  schoolEmail: '',
  university: '',
  departmentAndClass: '',
  avatarEmoji: '👨‍🎓',
  isVerified: false,
};

const DEFAULT_DEMO_ACCOUNTS: RegisteredAccount[] = [
  {
    schoolEmail: 'ogrenci@marun.edu.tr',
    fullName: 'Öğrenci',
    university: 'Marmara Üniversitesi',
    departmentAndClass: 'Endüstri Mühendisliği - 3. Sınıf',
    password: '123456password',
    avatarEmoji: '👨‍🎓',
    isVerified: true,
    xp: 450,
    streak: 3,
    completedLessons: ['lesson-1-1', 'lesson-1-2'],
    completedCaseExams: [],
    unlockedModules: ['module-1', 'module-2'],
    unlockedBadges: ['badge-first-lesson'],
  },
  {
    schoolEmail: 'zeynep.k@itu.edu.tr',
    fullName: 'Zeynep K.',
    university: 'İstanbul Teknik Üniversitesi',
    departmentAndClass: 'Veri Bilimi - 4. Sınıf',
    password: '123456password',
    avatarEmoji: '👧',
    isVerified: true,
    xp: 755217,
    streak: 14,
    completedLessons: [],
    completedCaseExams: [],
    unlockedModules: ['module-1'],
    unlockedBadges: ['badge-first-lesson'],
  },
  {
    schoolEmail: 'admin@tancorelab.com',
    fullName: 'TanCore Admin',
    university: 'Marmara Üniversitesi',
    departmentAndClass: 'Sistem Yöneticisi',
    password: '123456password',
    avatarEmoji: '👑',
    isVerified: true,
    xp: 99999,
    streak: 30,
    completedLessons: [],
    completedCaseExams: [],
    unlockedModules: ['module-1', 'module-2', 'module-3'],
    unlockedBadges: ['badge-first-lesson', 'badge-case-master'],
  }
];

const INITIAL_STATE: UserState = {
  language: 'tr',
  xp: 0,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
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
};

function syncUserInList(state: UserState): PublicProfile[] {
  const profile = state.userProfile;
  if (!profile.schoolEmail || !state.isVerified) {
    return state.registeredUsers || [];
  }

  const currentEmail = profile.schoolEmail.trim().toLowerCase();

  const userEntry: PublicProfile = {
    id: profile.id || `usr_${currentEmail}`,
    fullName: profile.fullName || 'Öğrenci',
    schoolEmail: profile.schoolEmail,
    university: profile.university || 'Marmara Üniversitesi',
    departmentAndClass: profile.departmentAndClass || 'Endüstri Mühendisliği - 3. Sınıf',
    avatarEmoji: profile.avatarEmoji || '👨‍🎓',
    xp: state.xp,
    streak: state.streak,
    rank: 1,
    level: Math.floor(state.xp / 100) + 1,
    completedCount: state.completedLessons.length + state.completedCaseExams.length,
    unlockedBadges: state.unlockedBadges,
  };

  const existingList = state.registeredUsers || [];
  const existingIdx = existingList.findIndex(
    (u) => u.schoolEmail?.toLowerCase() === currentEmail || u.fullName === profile.fullName
  );

  let newList: PublicProfile[];
  if (existingIdx >= 0) {
    newList = [...existingList];
    newList[existingIdx] = { ...newList[existingIdx], ...userEntry };
  } else {
    newList = [...existingList, userEntry];
  }

  newList.sort((a, b) => b.xp - a.xp);
  return newList.map((u, i) => ({ ...u, rank: i + 1 }));
}

export const useAppStore = create<UserState & AppStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      syncRegisteredUserInList: () => {
        set((state) => ({
          registeredUsers: syncUserInList(state),
        }));
      },

      registerAccountAndSendOtp: (accountInput, simulatedCode) => {
        const email = accountInput.schoolEmail?.trim().toLowerCase() || '';
        const newAccount: RegisteredAccount = {
          schoolEmail: email,
          fullName: accountInput.fullName?.trim() || 'Öğrenci',
          university: accountInput.university?.trim() || 'Marmara Üniversitesi',
          departmentAndClass: accountInput.departmentAndClass?.trim() || 'Endüstri Mühendisliği - 3. Sınıf',
          password: accountInput.password || '',
          avatarEmoji: accountInput.avatarEmoji || '👨‍🎓',
          isVerified: false,
          xp: 15,
          streak: 1,
          completedLessons: [],
          completedCaseExams: [],
          unlockedModules: ['module-1', 'module-2'],
          unlockedBadges: [],
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
            simulatedOtpCode: simulatedCode || '123456',
            userProfile: {
              fullName: newAccount.fullName,
              schoolEmail: newAccount.schoolEmail,
              university: newAccount.university,
              departmentAndClass: newAccount.departmentAndClass,
              avatarEmoji: newAccount.avatarEmoji,
              isVerified: false,
              password: newAccount.password,
            },
          };
        });
      },

      verifyOtpAndActivateAccount: (token) => {
        const state = get();
        const pendingEmail = (state.pendingOtpEmail || state.userProfile.schoolEmail || '').trim().toLowerCase();
        const expectedCode = state.simulatedOtpCode || '123456';

        const isMatch = token.trim() === expectedCode || token.trim() === '123456';

        if (!isMatch) {
          return { success: false, message: 'Girdiğiniz doğrulama kodu hatalı.' };
        }

        // Find or update account
        const accounts = state.userAccounts || [];
        const accIdx = accounts.findIndex((a) => a.schoolEmail.toLowerCase() === pendingEmail);

        let activeProfile: UserProfile;
        let userXp = state.xp || 15;
        let userStreak = state.streak || 1;

        if (accIdx >= 0) {
          accounts[accIdx].isVerified = true;
          activeProfile = {
            id: `usr_${pendingEmail}`,
            fullName: accounts[accIdx].fullName,
            schoolEmail: accounts[accIdx].schoolEmail,
            university: accounts[accIdx].university,
            departmentAndClass: accounts[accIdx].departmentAndClass,
            avatarEmoji: accounts[accIdx].avatarEmoji || '👨‍🎓',
            isVerified: true,
            createdAt: new Date().toISOString(),
          };
          userXp = accounts[accIdx].xp;
          userStreak = accounts[accIdx].streak;
        } else {
          activeProfile = {
            id: `usr_${pendingEmail}`,
            fullName: state.userProfile.fullName || 'Öğrenci',
            schoolEmail: pendingEmail,
            university: state.userProfile.university || 'Marmara Üniversitesi',
            departmentAndClass: state.userProfile.departmentAndClass || 'Endüstri Mühendisliği - 3. Sınıf',
            avatarEmoji: state.userProfile.avatarEmoji || '👨‍🎓',
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
          userAccounts: accounts,
        };

        const updatedLeaderboard = syncUserInList(nextState);

        set({
          userProfile: activeProfile,
          isAuthenticated: true,
          isVerified: true,
          pendingOtpEmail: undefined,
          simulatedOtpCode: undefined,
          registeredUsers: updatedLeaderboard,
          userAccounts: accounts,
        });

        saveUserProfileToSupabase(activeProfile);
        return { success: true };
      },

      loginWithPassword: (email, pass) => {
        const cleanEmail = email.trim().toLowerCase();

        // 1. Check valid student email domain
        if (!isValidStudentEmail(cleanEmail)) {
          return {
            success: false,
            errorType: 'INVALID_EMAIL_DOMAIN',
            message: 'Lütfen geçerli bir üniversite e-posta adresi giriniz (ör: ad.soyad@ku.edu.tr).',
          };
        }

        const state = get();
        const accounts = state.userAccounts || DEFAULT_DEMO_ACCOUNTS;
        const account = accounts.find((a) => a.schoolEmail.trim().toLowerCase() === cleanEmail);

        // 2. Check if email exists in system
        if (!account) {
          return {
            success: false,
            errorType: 'EMAIL_NOT_FOUND',
            message: 'Bu e-posta adresi henüz sistemde kayıtlı değil. Lütfen önce kayıt olun.',
          };
        }

        // 3. Check password matching
        if (account.password && account.password !== pass.trim()) {
          return {
            success: false,
            errorType: 'WRONG_PASSWORD',
            message: 'Şifreniz yanlış.',
          };
        }

        // Successful login
        const loggedInProfile: UserProfile = {
          id: `usr_${cleanEmail}`,
          fullName: account.fullName,
          schoolEmail: account.schoolEmail,
          university: account.university,
          departmentAndClass: account.departmentAndClass,
          avatarEmoji: account.avatarEmoji || '👨‍🎓',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };

        const nextState = {
          ...state,
          userProfile: loggedInProfile,
          isAuthenticated: true,
          isVerified: true,
          xp: account.xp || 450,
          streak: account.streak || 3,
          completedLessons: account.completedLessons || [],
          completedCaseExams: account.completedCaseExams || [],
          unlockedModules: account.unlockedModules || ['module-1', 'module-2'],
          unlockedBadges: account.unlockedBadges || [],
        };

        const updatedUsers = syncUserInList(nextState);

        set({
          userProfile: loggedInProfile,
          isAuthenticated: true,
          isVerified: true,
          xp: nextState.xp,
          streak: nextState.streak,
          completedLessons: nextState.completedLessons,
          completedCaseExams: nextState.completedCaseExams,
          unlockedModules: nextState.unlockedModules,
          unlockedBadges: nextState.unlockedBadges,
          pendingOtpEmail: undefined,
          simulatedOtpCode: undefined,
          registeredUsers: updatedUsers,
        });

        saveUserProfileToSupabase(loggedInProfile);
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

        if (token.trim() !== '123456' && token.trim() !== state.simulatedOtpCode) {
          return { success: false, message: 'Doğrulama kodu yanlış.' };
        }

        accounts[accIdx].password = newPass.trim();
        set({ userAccounts: accounts });
        return { success: true, message: 'Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.' };
      },

      updateUserProfile: (profile) => {
        set((state) => {
          const updatedProfile = { ...state.userProfile, ...profile };
          saveUserProfileToSupabase(updatedProfile);
          const newState = { ...state, userProfile: updatedProfile };
          return {
            userProfile: updatedProfile,
            registeredUsers: syncUserInList(newState),
          };
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isVerified: false,
          pendingOtpEmail: undefined,
          simulatedOtpCode: undefined,
          userProfile: DEFAULT_PROFILE,
        });
      },

      setSelectedPublicProfile: (profile) => {
        set({ selectedPublicProfile: profile });
      },

      setLanguage: (language) => set({ language }),

      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'tr' ? 'en' : 'tr' })),

      checkAndUpdateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = get().lastActiveDate;

        if (!lastActive) {
          set({ lastActiveDate: today, streak: 1 });
          return;
        }

        const lastDateObj = new Date(lastActive);
        const todayDateObj = new Date(today);
        const diffTime = Math.abs(todayDateObj.getTime() - lastDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          set((state) => ({ streak: state.streak + 1, lastActiveDate: today }));
        } else if (diffDays > 1) {
          set({ streak: 1, lastActiveDate: today });
        }
      },

      completeLesson: (lessonId, moduleId, xpEarned = 15) => {
        const state = get();
        const alreadyCompleted = state.completedLessons.includes(lessonId);
        const newCompleted = alreadyCompleted
          ? state.completedLessons
          : [...state.completedLessons, lessonId];
        const newXp = alreadyCompleted ? state.xp : state.xp + xpEarned;

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

        const nextState: UserState = {
          ...state,
          completedLessons: newCompleted,
          xp: newXp,
          unlockedModules: newUnlocked,
          unlockedBadges: newBadges,
        };

        const updatedUsers = syncUserInList(nextState);

        set({
          completedLessons: newCompleted,
          xp: newXp,
          unlockedModules: newUnlocked,
          unlockedBadges: newBadges,
          registeredUsers: updatedUsers,
        });

        syncUserProgress({
          totalXp: newXp,
          level: Math.floor(newXp / 100) + 1,
          streak: state.streak,
          completedLessons: newCompleted,
          completedCaseExams: state.completedCaseExams,
        });
      },

      completeCaseExam: (caseId, moduleId, xpEarned = 25) => {
        const state = get();
        const alreadyCompleted = state.completedCaseExams.includes(caseId);
        const newCompleted = alreadyCompleted
          ? state.completedCaseExams
          : [...state.completedCaseExams, caseId];
        const newXp = alreadyCompleted ? state.xp : state.xp + xpEarned;

        const newBadges = [...state.unlockedBadges];
        if (!newBadges.includes('badge-first-case')) {
          newBadges.push('badge-first-case');
        }
        if (newCompleted.length >= 5 && !newBadges.includes('badge-case-master')) {
          newBadges.push('badge-case-master');
        }

        const nextState: UserState = {
          ...state,
          completedCaseExams: newCompleted,
          xp: newXp,
          unlockedBadges: newBadges,
        };

        const updatedUsers = syncUserInList(nextState);

        set({
          completedCaseExams: newCompleted,
          xp: newXp,
          unlockedBadges: newBadges,
          registeredUsers: updatedUsers,
        });

        syncUserProgress({
          totalXp: newXp,
          level: Math.floor(newXp / 100) + 1,
          streak: state.streak,
          completedLessons: state.completedLessons,
          completedCaseExams: newCompleted,
        });
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
    }),
    {
      name: 'tancorelab-statsim-v3',
    }
  )
);
