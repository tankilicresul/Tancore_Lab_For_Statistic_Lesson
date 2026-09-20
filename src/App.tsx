import React, { useState, useEffect, useRef } from 'react';
import { XpStreakBar } from './components/XpStreakBar';
import { HomePage, CourseTrack } from './pages/HomePage';
import { CoursePage } from './pages/CoursePage';
import { ProfilePage } from './pages/ProfilePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { LessonPage } from './pages/LessonPage';
import { CaseExamPage } from './pages/CaseExamPage';
import { PlacementTestPage } from './pages/PlacementTestPage';
import { TancoChatModal } from './components/TancoChatModal';
import { FloatingTancoButton } from './components/FloatingTancoButton';
import { GuestGateModal } from './components/GuestGateModal';
import { PlusUpgradeModal } from './components/PlusUpgradeModal';
import { AuthModal } from './components/AuthModal';
import { BottomNavBar } from './components/BottomNavBar';
import { AppSplashScreen } from './components/AppSplashScreen';
import { getLessonById, getCaseExamById } from './data/modules';
import { useAppStore, saveTancoSession } from './store/useAppStore';
import { getLocalized } from './utils/localization';
import { fetchUserProfileFromSupabase, supabase } from './lib/supabase';

export const App: React.FC = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const {
    language,
    isAuthenticated,
    isVerified,
    userProfile,
    updateUserProfile,
    currentView = 'home',
    setCurrentView,
    selectedLessonId = null,
    setSelectedLessonId,
    selectedCaseId = null,
    setSelectedCaseId,
    selectedTrack = 'probability',
    setSelectedTrack,
    customActiveModuleName = null,
    setCustomActiveModuleName,
    isTancoChatOpen,
    setIsTancoChatOpen,
  } = useAppStore();

  const [scrollToNodeId, setScrollToNodeId] = useState<string | null>(null);
  const [selectedInDesignCourse, setSelectedInDesignCourse] = useState<CourseTrack | null>(null);
  const [showDirectAuthModal, setShowDirectAuthModal] = useState(false);

  // Guest session: track how many distinct lessons/cases have been opened this session
  // Stored in sessionStorage so it resets on new tab/browser close (but persists on refresh)
  const [showGuestGate, setShowGuestGate] = useState(false);
  const getGuestViewCount = () => {
    try { return parseInt(sessionStorage.getItem('tanco_guest_views') || '0', 10); } catch { return 0; }
  };
  const incrementGuestViewCount = () => {
    try { sessionStorage.setItem('tanco_guest_views', String(getGuestViewCount() + 1)); } catch {}
  };

  // Automatically evaluate and update daily streak on initial load
  useEffect(() => {
    useAppStore.getState().checkAndUpdateStreak();
  }, []);

  // Automatically sync profile details from Supabase cloud so registered name is always present
  useEffect(() => {
    // Only perform sync if user is authenticated and has an email
    if (!isAuthenticated) return;
    const email = userProfile?.schoolEmail;
    if (!email) return;

    fetchUserProfileFromSupabase(email)
      .then((remoteProfile) => {
        if (remoteProfile) {
          updateUserProfile({
            fullName: remoteProfile.full_name || userProfile.fullName,
            university: remoteProfile.university || userProfile.university,
            departmentAndClass: remoteProfile.department_and_class || userProfile.departmentAndClass,
            avatarEmoji: remoteProfile.avatar_emoji || userProfile.avatarEmoji,
            avatarUrl: remoteProfile.avatar_url || userProfile.avatarUrl,
            isPremium: Boolean(remoteProfile.is_premium || remoteProfile.isPremium),
            subscriptionStatus: remoteProfile.subscription_status || userProfile.subscriptionStatus,
            subscriptionRenewsAt: remoteProfile.subscription_renews_at || userProfile.subscriptionRenewsAt,
          });

          useAppStore.setState((state) => ({
            xp: typeof remoteProfile.xp === 'number' && remoteProfile.xp > 0 ? remoteProfile.xp : state.xp,
            streak: typeof remoteProfile.streak === 'number' ? remoteProfile.streak : state.streak,
            lastActiveDate: remoteProfile.last_active_date || state.lastActiveDate,
            activityDates: Array.isArray(remoteProfile.activity_dates) && remoteProfile.activity_dates.length > 0
              ? remoteProfile.activity_dates
              : state.activityDates,
          }));

          useAppStore.getState().checkAndUpdateStreak();
        }
      })
      .catch((err) => {
        console.warn('Profile sync error:', err);
      });
  }, [userProfile?.schoolEmail, isAuthenticated]);

  // Listen to Supabase Auth state changes in real-time
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        if (useAppStore.getState().isAuthenticated) {
          useAppStore.getState().logout();
        }
      } else if (session?.user && !useAppStore.getState().isAuthenticated) {
        const meta = session.user.user_metadata || {};
        const email = session.user.email || '';
        const currentStored = useAppStore.getState().userProfile;
        if (email) {
          updateUserProfile({
            id: session.user.id,
            schoolEmail: email,
            fullName: currentStored?.fullName || meta.full_name || meta.name || email.split('@')[0],
            university: currentStored?.university || meta.university || '',
            departmentAndClass: currentStored?.departmentAndClass || meta.department_and_class || '',
            isVerified: true,
          });
          useAppStore.setState({ isAuthenticated: true, isVerified: true });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated]);

  // ── Native OS Edge Swipe-Back & History Management ─────────────────────
  // Initial root state setup
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ view: 'home' }, '');
    }
  }, []);

  // ── Tanco Inactivity & Session Heartbeat ─────────────────────────
  // Keeps Tanco alive across page refreshes and short exits (< 1 minute),
  // while resetting Tanco to welcome card if user leaves for more than 1 minute.
  useEffect(() => {
    const persistHeartbeat = () => {
      const state = useAppStore.getState();
      if (state.isTancoActive && state.tancoPosition) {
        saveTancoSession({
          isTancoActive: true,
          isTancoMoved: state.isTancoMoved,
          tancoPosition: state.tancoPosition,
        });
      }
    };

    const interval = setInterval(persistHeartbeat, 8000);
    window.addEventListener('beforeunload', persistHeartbeat);
    const onVisChange = () => {
      if (document.visibilityState === 'hidden') {
        persistHeartbeat();
      }
    };
    document.addEventListener('visibilitychange', onVisChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', persistHeartbeat);
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, []);

  // Strict guard: Guests / unauthenticated users must never see profile page on reload/refresh
  useEffect(() => {
    if ((!isAuthenticated || !isVerified) && currentView === 'profile') {
      setCurrentView('home');
    }
  }, [isAuthenticated, isVerified, currentView, setCurrentView]);

  // Sync active view / modal state to browser history stack
  useEffect(() => {
    const currentState = {
      view: currentView,
      lessonId: selectedLessonId,
      caseId: selectedCaseId,
      chatOpen: isTancoChatOpen,
      guestGate: showGuestGate,
      inDesign: Boolean(selectedInDesignCourse),
    };

    const historyState = window.history.state;
    if (!historyState || JSON.stringify(historyState) !== JSON.stringify(currentState)) {
      window.history.pushState(currentState, '');
    }
  }, [currentView, selectedLessonId, selectedCaseId, isTancoChatOpen, showGuestGate, selectedInDesignCourse]);

  // Handle popstate (triggered when user swiping from edge or clicking back button)
  useEffect(() => {
    const handlePopState = () => {
      const store = useAppStore.getState();

      // 1. Close open modals first
      if (store.isTancoChatOpen) {
        store.setIsTancoChatOpen(false);
        return;
      }
      if (showGuestGate) {
        setShowGuestGate(false);
        return;
      }
      if (selectedInDesignCourse) {
        setSelectedInDesignCourse(null);
        return;
      }

      // 2. Navigate backwards in view hierarchy
      const view = store.currentView;
      if (view === 'lesson' || view === 'caseExam' || view === 'placementTest') {
        store.setCurrentView('course');
        store.setSelectedLessonId(null);
        store.setSelectedCaseId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (view === 'course' || view === 'profile' || view === 'leaderboard') {
        store.setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (view === 'home') {
        // Prevent accidental app exit on home page back-swipe
        window.history.pushState({ view: 'home' }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showGuestGate, selectedInDesignCourse]);

  // Touch gesture fallback for edge swipes
  const swipeTouchRef = useRef<{ startX: number; startY: number } | null>(null);

  useEffect(() => {
    const EDGE_THRESHOLD = 30;
    const MIN_SWIPE_X = 60;
    const MAX_SWIPE_Y = 80;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const fromLeftEdge = touch.clientX <= EDGE_THRESHOLD;
      const fromRightEdge = touch.clientX >= window.innerWidth - EDGE_THRESHOLD;
      if (fromLeftEdge || fromRightEdge) {
        swipeTouchRef.current = { startX: touch.clientX, startY: touch.clientY };
      } else {
        swipeTouchRef.current = null;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!swipeTouchRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - swipeTouchRef.current.startX;
      const dy = touch.clientY - swipeTouchRef.current.startY;
      swipeTouchRef.current = null;

      if (Math.abs(dy) > MAX_SWIPE_Y || Math.abs(dx) < MIN_SWIPE_X) return;

      const isBackSwipe =
        (dx > 0 && e.changedTouches[0].clientX - dx <= EDGE_THRESHOLD) ||
        (dx < 0 && e.changedTouches[0].clientX - dx >= window.innerWidth - EDGE_THRESHOLD);

      if (!isBackSwipe) return;

      const store = useAppStore.getState();
      if (store.isTancoChatOpen) {
        store.setIsTancoChatOpen(false);
        return;
      }
      if (showGuestGate) {
        setShowGuestGate(false);
        return;
      }
      if (selectedInDesignCourse) {
        setSelectedInDesignCourse(null);
        return;
      }

      const view = store.currentView;
      if (view === 'lesson' || view === 'caseExam' || view === 'placementTest') {
        store.setCurrentView('course');
        store.setSelectedLessonId(null);
        store.setSelectedCaseId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (view === 'course' || view === 'profile' || view === 'leaderboard') {
        store.setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [showGuestGate, selectedInDesignCourse]);
  // ────────────────────────────────────────────────────────────────────────

  // Guest-aware lesson/case opener:
  // Authenticated users: full access.
  // Guests: can freely complete up to 2 modules in each track (Module 1 and Module 2).
  // When attempting to access Module 3 or higher, GuestGateModal is automatically shown.
  const openLessonOrCase = (
    type: 'lesson' | 'case',
    id: string
  ) => {
    if (isAuthenticated && isVerified) {
      if (type === 'lesson') {
        setSelectedLessonId(id);
        setSelectedCaseId(null);
        setCurrentView('lesson');
      } else {
        setSelectedCaseId(id);
        setSelectedLessonId(null);
        setCurrentView('caseExam');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check which module this topic belongs to
    let topicModuleId = '';
    if (type === 'lesson') {
      const data = getLessonById(id);
      topicModuleId = data?.module.id || '';
    } else {
      const data = getCaseExamById(id);
      topicModuleId = data?.module.id || '';
    }

    // Guests can complete up to 2 modules in any track:
    // Probability track: Mod 1 ('module-13'), Mod 2 ('module-2')
    // Statistics track: Mod 1 ('module-1'), Mod 2 ('module-4')
    // INDR 100 track: Mod 1 ('module-17'), Mod 2 ('module-18')
    const GUEST_ALLOWED_MODULE_IDS = [
      'module-13',
      'module-2',
      'module-1',
      'module-4',
      'module-17',
      'module-18',
    ];

    const isGuestAllowed = GUEST_ALLOWED_MODULE_IDS.includes(topicModuleId);

    if (!isGuestAllowed) {
      setShowGuestGate(true);
      return;
    }

    if (type === 'lesson') {
      setSelectedLessonId(id);
      setSelectedCaseId(null);
      setCurrentView('lesson');
    } else {
      setSelectedCaseId(id);
      setSelectedLessonId(null);
      setCurrentView('caseExam');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLesson = (lessonId: string) => openLessonOrCase('lesson', lessonId);
  const handleSelectCaseExam = (caseId: string) => openLessonOrCase('case', caseId);

  const handleSelectNextTopic = (nextId: string, nextType: 'lesson' | 'case') => {
    openLessonOrCase(nextType, nextId);
  };

  const handleStartPlacementTest = () => {
    setCurrentView('placementTest');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedInDesignCourse(null);
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(null);
    setCustomActiveModuleName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLeaderboard = () => {
    setCurrentView('leaderboard');
    setSelectedInDesignCourse(null);
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(null);
    setCustomActiveModuleName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfile = () => {
    if (!isAuthenticated || !isVerified) {
      setShowDirectAuthModal(true);
      return;
    }
    setCurrentView('profile');
    setSelectedInDesignCourse(null);
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(null);
    setCustomActiveModuleName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCourse = (targetNodeId?: string) => {
    setCurrentView('course');
    setSelectedInDesignCourse(null);
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(targetNodeId || null);
    setCustomActiveModuleName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHomeWithScroll = (lastNodeId?: string) => {
    setCurrentView('course');
    setSelectedInDesignCourse(null);
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(lastNodeId || null);
  };

  const handleSelectInDesignCourse = (course: CourseTrack) => {
    setSelectedInDesignCourse(course);
    setCurrentView('course');
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setCustomActiveModuleName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lessonData = selectedLessonId ? getLessonById(selectedLessonId) : undefined;
  const caseData = selectedCaseId ? getCaseExamById(selectedCaseId) : undefined;

  let activeModuleName: string | undefined = undefined;
  if (currentView === 'lesson' && lessonData) {
    activeModuleName = getLocalized(lessonData.module.title, language);
  } else if (currentView === 'caseExam' && caseData) {
    activeModuleName = getLocalized(caseData.module.title, language);
  } else if (currentView === 'course' && selectedInDesignCourse) {
    activeModuleName = selectedInDesignCourse.code;
  } else if (customActiveModuleName) {
    activeModuleName = customActiveModuleName;
  }

  const handleSelectTrack = (track: 'probability' | 'statistics' | 'indr100' | 'indr262') => {
    setSelectedTrack(track);
    setSelectedInDesignCourse(null);
    setCustomActiveModuleName(null);
    setCurrentView('course');
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-[#ff7a00] selection:text-white overflow-x-clip relative">

      {/* 3-Second App Loading Splash Screen with Logo Animation */}
      {isSplashVisible && (
        <AppSplashScreen onComplete={() => setIsSplashVisible(false)} />
      )}

      {/* Sticky Navigation Header */}
      <XpStreakBar
        onGoHome={handleBackToHome}
        onOpenProfile={handleOpenProfile}
        currentView={currentView}
        activeModuleName={activeModuleName}
      />

      {/* Main Page Body */}
      <main className="flex-1 pt-[68px] sm:pt-[88px] pb-24 sm:pb-28">
        {currentView === 'home' && (
          <div key="home" className="animate-page-enter">
            <HomePage
              onSelectTrack={handleSelectTrack}
              onSelectInDesignCourse={handleSelectInDesignCourse}
              onOpenProfile={handleOpenProfile}
            />
          </div>
        )}

        {currentView === 'course' && (
          <div key={`course-${selectedTrack}-${selectedInDesignCourse?.code ?? ''}`} className="animate-page-enter">
            <CoursePage
              selectedTrack={selectedTrack}
              inDesignCourse={selectedInDesignCourse}
              onSelectLesson={handleSelectLesson}
              onSelectCaseExam={handleSelectCaseExam}
              onBackToHome={handleBackToHome}
              scrollToNodeId={scrollToNodeId}
              onStartPlacementTest={handleStartPlacementTest}
              onGuestGateRequired={() => setShowGuestGate(true)}
            />
          </div>
        )}

        {currentView === 'profile' && (
          (!isAuthenticated || !isVerified) ? (
            <div key="profile-guest" className="animate-page-enter">
              <HomePage
                onSelectTrack={handleSelectTrack}
                onSelectInDesignCourse={handleSelectInDesignCourse}
                onOpenProfile={handleOpenProfile}
              />
            </div>
          ) : (
            <div key="profile-auth" className="animate-page-enter">
              <ProfilePage
                onGoHome={handleBackToHome}
                onOpenAuth={() => setShowDirectAuthModal(true)}
                onNavigateLeaderboard={handleOpenLeaderboard}
              />
            </div>
          )
        )}

        {currentView === 'leaderboard' && (
          <div key="leaderboard" className="animate-page-enter">
            <LeaderboardPage
              onGoHome={handleBackToHome}
              onOpenAuth={() => setShowDirectAuthModal(true)}
              onOpenProfile={handleOpenProfile}
            />
          </div>
        )}

        {currentView === 'lesson' && lessonData && (
          <div key={`lesson-${selectedLessonId}`} className="animate-page-enter">
            <LessonPage
              lesson={lessonData.lesson}
              module={lessonData.module}
              onBack={handleBackToCourse}
              onSelectNextTopic={handleSelectNextTopic}
              onBackToHomeWithScroll={handleBackToHomeWithScroll}
            />
          </div>
        )}

        {currentView === 'caseExam' && caseData && (
          <div key={`case-${selectedCaseId}`} className="animate-page-enter">
            <CaseExamPage
              caseExam={caseData.caseExam}
              module={caseData.module}
              onBack={handleBackToCourse}
              onSelectNextTopic={handleSelectNextTopic}
              onBackToHomeWithScroll={handleBackToHomeWithScroll}
            />
          </div>
        )}

        {currentView === 'placementTest' && (
          <div key="placementTest" className="animate-page-enter">
            <PlacementTestPage onBackToHome={handleBackToHomeWithScroll} />
          </div>
        )}
      </main>


      {/* Full-width Bottom Navigation Bar (Ana Sayfa, Skor Tablosu, Profilim) */}
      <BottomNavBar
        currentView={currentView}
        onGoHome={handleBackToHome}
        onOpenLeaderboard={handleOpenLeaderboard}
        onOpenProfile={handleOpenProfile}
        onOpenAuth={() => setShowDirectAuthModal(true)}
      />

      {/* Tanco Assistant Chat Modal & Floating Launcher */}
      <TancoChatModal />
      <FloatingTancoButton />

      {/* Plus Upgrade Modal */}
      <PlusUpgradeModal />

      {/* Direct Auth Modal when unauthenticated user clicks Profile */}
      {showDirectAuthModal && (
        <AuthModal onClose={() => setShowDirectAuthModal(false)} />
      )}

      {/* Guest Gate Modal: shown when unauthenticated user tries to access 2nd lesson/case */}
      {showGuestGate && (
        <GuestGateModal onClose={() => setShowGuestGate(false)} />
      )}
    </div>
  );
};
