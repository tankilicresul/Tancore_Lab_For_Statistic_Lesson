export interface LocalizedText {
  tr: string;
  en: string;
}

export interface VocabTerm {
  term_en: string;
  explanation_tr: string;
  explanation_en: string;
  exampleSentence_en: string;
}

export interface RealWorldBox {
  excelFormula?: string;
  pythonCode?: string;
  sqlQuery?: string;
  powerBiNote?: LocalizedText;
}

export interface Question {
  id: string;
  type: "multiple_choice" | "numeric";
  prompt: LocalizedText;
  options?: LocalizedText[];
  correctAnswer: string | number;
  explanation: LocalizedText;
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  difficulty?: "basit" | "orta" | "orta-ustu" | "zor";
  title: LocalizedText;
  conceptCard: LocalizedText;
  companyExample: LocalizedText;
  interactiveType?: "mean_median_mode" | "variance_stddev" | "probability_coin" | "bayes_rule" | "normal_dist" | "binomial_dist" | "poisson_dist" | "sample_size" | "confidence_interval" | "hypothesis_z_t" | "correlation_regression" | "probability_lab" | "monte_carlo_clt" | "bayes_visualizer" | "markov_chain";
  interactiveInitialData?: number[];
  vocabTerms: VocabTerm[];
  questions: Question[];
  realWorldBox?: RealWorldBox;
}

export interface CaseExam {
  id: string;
  moduleId: string;
  difficulty: "kolay" | "orta" | "zor";
  title: LocalizedText;
  businessQuestion: LocalizedText;
  dataset: {
    columns: string[];
    rows: (string | number)[][];
  };
  guidedSteps: LocalizedText[];
  expectedApproach: LocalizedText;
  solutionQuestions?: Question[];
}

export interface Module {
  id: string;
  order: number;
  title: LocalizedText;
  description?: LocalizedText;
  iconName?: string;
  lessons: Lesson[];
  caseExams: CaseExam[];
}

export interface Badge {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
}

export interface UserProfile {
  id?: string;
  fullName: string;
  schoolEmail: string;
  university: string;
  departmentAndClass: string;
  avatarEmoji?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  createdAt?: string;
  password?: string;
}

export interface RegisteredAccount {
  schoolEmail: string;
  fullName: string;
  university: string;
  departmentAndClass: string;
  password: string;
  avatarEmoji?: string;
  avatarUrl?: string;
  isVerified: boolean;
  xp: number;
  streak: number;
  completedLessons: string[];
  completedCaseExams: string[];
  unlockedModules: string[];
  unlockedBadges: string[];
}

export interface PublicProfile {
  id: string;
  fullName: string;
  schoolEmail?: string;
  university: string;
  departmentAndClass: string;
  avatarEmoji?: string;
  avatarUrl?: string;
  xp: number;
  streak: number;
  rank: number;
  level: number;
  completedCount: number;
  unlockedBadges: string[];
}

export interface UserState {
  language: "tr" | "en";
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  completedCaseExams: string[];
  unlockedModules: string[];
  unlockedBadges: string[];
  userProfile: UserProfile;
  isAuthenticated: boolean;
  isVerified: boolean;
  pendingOtpEmail?: string;
  simulatedOtpCode?: string;
  selectedPublicProfile?: PublicProfile | null;
  registeredUsers: PublicProfile[];
  userAccounts?: RegisteredAccount[];
  currentView?: 'home' | 'course' | 'profile' | 'lesson' | 'caseExam' | 'placementTest';
  selectedLessonId?: string | null;
  selectedCaseId?: string | null;
  selectedTrack?: 'probability' | 'statistics';
  customActiveModuleName?: string | null;
  isTancoChatOpen?: boolean;
  hasSeenTancoTour?: boolean;
  isTancoTourActive?: boolean;
  tancoTourStep?: number;
}

export interface PlacementTestResult {
  score: number;
  totalQuestions: number;
  recommendedModuleId: string;
  recommendedModuleOrder: number;
}
