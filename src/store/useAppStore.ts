import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserState, PublicProfile } from '../types/stats';
import { syncUserProgress, saveUserProfileToSupabase } from '../lib/supabase';

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
  registerAndSendOtp: (profile: UserProfile, simulatedCode?: string) => void;
  verifyOtpAndLogin: (token: string) => boolean;
  logout: () => void;
  setSelectedPublicProfile: (profile: PublicProfile | null) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Resul Tan',
  schoolEmail: 'resul.tan@marun.edu.tr',
  university: 'Marmara Üniversitesi',
  departmentAndClass: 'Endüstri Mühendisliği - 3. Sınıf',
  avatarEmoji: '👨‍🎓',
  isVerified: true,
};

const INITIAL_STATE: UserState = {
  language: 'tr',
  xp: 450,
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: ['lesson-1-1', 'lesson-1-2'],
  completedCaseExams: [],
  unlockedModules: ['module-1', 'module-2'],
  unlockedBadges: ['badge-first-lesson'],
  userProfile: DEFAULT_PROFILE,
  isAuthenticated: true,
  isVerified: true,
  pendingOtpEmail: undefined,
  simulatedOtpCode: undefined,
  selectedPublicProfile: null,
};

export const useAppStore = create<UserState & AppStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      updateUserProfile: (profile) => {
        set((state) => {
          const updatedProfile = { ...state.userProfile, ...profile };
          saveUserProfileToSupabase(updatedProfile);
          return { userProfile: updatedProfile };
        });
      },

      registerAndSendOtp: (profile: UserProfile, simulatedCode?: string) => {
        set({
          userProfile: { ...profile, isVerified: false },
          pendingOtpEmail: profile.schoolEmail,
          simulatedOtpCode: simulatedCode,
        });
      },

      verifyOtpAndLogin: (token: string) => {
        const state = get();
        const expectedCode = state.simulatedOtpCode;

        // Master bypass code '123456' or matching simulated OTP code
        const isMatch =
          token.trim() === '123456' ||
          (expectedCode && token.trim() === expectedCode.trim());

        if (isMatch) {
          const verifiedProfile = {
            ...state.userProfile,
            isVerified: true,
            createdAt: new Date().toISOString(),
          };

          set({
            userProfile: verifiedProfile,
            isAuthenticated: true,
            isVerified: true,
            pendingOtpEmail: undefined,
            simulatedOtpCode: undefined,
          });

          saveUserProfileToSupabase(verifiedProfile);
          return true;
        }

        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isVerified: false,
          pendingOtpEmail: undefined,
          simulatedOtpCode: undefined,
        });
      },

      setSelectedPublicProfile: (profile: PublicProfile | null) => {
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
          // Continuous streak
          set((state) => ({ streak: state.streak + 1, lastActiveDate: today }));
        } else if (diffDays > 1) {
          // Streak broken
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

        // Check badge unlocks
        const newBadges = [...state.unlockedBadges];
        if (newCompleted.length >= 1 && !newBadges.includes('badge-first-lesson')) {
          newBadges.push('badge-first-lesson');
        }
        if (newCompleted.length >= 10 && !newBadges.includes('badge-10-lessons')) {
          newBadges.push('badge-10-lessons');
        }

        set({
          completedLessons: newCompleted,
          xp: newXp,
          unlockedBadges: newBadges,
        });

        get().checkAndUpdateStreak();
        syncUserProgress({
          userId: state.userProfile.schoolEmail,
          totalXp: newXp,
          level: Math.floor(newXp / 100) + 1,
          streak: state.streak,
          completedLessons: newCompleted,
          completedCaseExams: state.completedCaseExams,
        });
      },

      completeCaseExam: (caseId, moduleId, xpEarned = 50) => {
        const state = get();
        const alreadyCompleted = state.completedCaseExams.includes(caseId);

        const newCompletedCases = alreadyCompleted
          ? state.completedCaseExams
          : [...state.completedCaseExams, caseId];

        const newXp = alreadyCompleted ? state.xp : state.xp + xpEarned;

        // Unlock next module if case exam completed
        const currentModNum = parseInt(moduleId.replace('module-', ''), 10);
        const nextModId = `module-${currentModNum + 1}`;
        const newUnlockedModules = state.unlockedModules.includes(nextModId)
          ? state.unlockedModules
          : [...state.unlockedModules, nextModId];

        // Check badges
        const newBadges = [...state.unlockedBadges];
        if (newCompletedCases.length >= 1 && !newBadges.includes('badge-first-case')) {
          newBadges.push('badge-first-case');
        }
        if (newCompletedCases.length >= 5 && !newBadges.includes('badge-case-master')) {
          newBadges.push('badge-case-master');
        }

        set({
          completedCaseExams: newCompletedCases,
          unlockedModules: newUnlockedModules,
          xp: newXp,
          unlockedBadges: newBadges,
        });

        get().checkAndUpdateStreak();
        syncUserProgress({
          userId: state.userProfile.schoolEmail,
          totalXp: newXp,
          level: Math.floor(newXp / 100) + 1,
          streak: state.streak,
          completedLessons: state.completedLessons,
          completedCaseExams: newCompletedCases,
        });
      },

      unlockUpToModule: (targetModuleId: string) => {
        const targetOrder = parseInt(targetModuleId.replace('module-', ''), 10) || 1;
        const modulesToUnlock: string[] = [];
        for (let i = 1; i <= targetOrder; i++) {
          modulesToUnlock.push(`module-${i}`);
        }

        const state = get();
        const updatedUnlocked = Array.from(new Set([...state.unlockedModules, ...modulesToUnlock]));
        const bonusXp = state.xp + 150;

        set({
          unlockedModules: updatedUnlocked,
          xp: bonusXp,
        });

        get().checkAndUpdateStreak();
      },

      resetProgress: () => {
        set(INITIAL_STATE);
      },
    }),
    {
      name: 'tancorelab-user-storage',
    }
  )
);
