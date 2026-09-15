import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserState } from '../types/stats';

interface AppStoreActions {
  setLanguage: (lang: 'tr' | 'en') => void;
  toggleLanguage: () => void;
  completeLesson: (lessonId: string, moduleId: string, xpEarned?: number) => void;
  completeCaseExam: (caseId: string, moduleId: string, xpEarned?: number) => void;
  checkAndUpdateStreak: () => void;
  resetProgress: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  unlockUpToModule: (targetModuleId: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Resul Tan',
  schoolEmail: 'resul.tan@marun.edu.tr',
  university: 'Marmara Üniversitesi',
  departmentAndClass: 'Endüstri Mühendisliği - 3. Sınıf',
};

const INITIAL_STATE: UserState = {
  language: 'tr',
  xp: 0,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: [],
  completedCaseExams: [],
  unlockedModules: ['module-1'],
  unlockedBadges: [],
  userProfile: DEFAULT_PROFILE,
};

export const useAppStore = create<UserState & AppStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      updateUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),

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
