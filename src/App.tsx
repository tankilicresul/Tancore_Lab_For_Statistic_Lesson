import React, { useState, useEffect, useRef } from 'react';
import { XpStreakBar } from './components/XpStreakBar';
import { HomePage, CourseTrack } from './pages/HomePage';
import { CoursePage } from './pages/CoursePage';
import { ProfilePage } from './pages/ProfilePage';
import { LessonPage } from './pages/LessonPage';
import { CaseExamPage } from './pages/CaseExamPage';
import { PlacementTestPage } from './pages/PlacementTestPage';
import { TancoChatModal } from './components/TancoChatModal';
import { FloatingTancoButton } from './components/FloatingTancoButton';
import { GuestGateModal } from './components/GuestGateModal';
import { getLessonById, getCaseExamById } from './data/modules';
import { useAppStore } from './store/useAppStore';
import { getLocalized } from './utils/localization';
import { fetchUserProfileFromSupabase } from './lib/supabase';

export const App: React.FC = () => {
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
  } = useAppStore();

  const [scrollToNodeId, setScrollToNodeId] = useState<string | null>(null);
  const [selectedInDesignCourse, setSelectedInDesignCourse] = useState<CourseTrack | null>(null);

  // Guest session: track how many distinct lessons/cases have been opened this session
  // Stored in sessionStorage so it resets on new tab/browser close (but persists on refresh)
  const [showGuestGate, setShowGuestGate] = useState(false);
  const getGuestViewCount = () => {
    try { return parseInt(sessionStorage.getItem('tanco_guest_views') || '0', 10); } catch { return 0; }
  };
  const incrementGuestViewCount = () => {
    try { sessionStorage.setItem('tanco_guest_views', String(getGuestViewCount() + 1)); } catch {}
  };

  // Automatically sync profile details from Supabase cloud so registered name is always present
  useEffect(() => {
    const email = userProfile?.schoolEmail;
    if (!email) return;

    fetchUserProfileFromSupabase(email)
      .then((remoteProfile) => {
        if (remoteProfile && remoteProfile.full_name) {
          updateUserProfile({
            fullName: remoteProfile.full_name,
            university: remoteProfile.university || userProfile.university,
            departmentAndClass: remoteProfile.department_and_class || userProfile.departmentAndClass,
            avatarEmoji: remoteProfile.avatar_emoji || userProfile.avatarEmoji,
            avatarUrl: remoteProfile.avatar_url || userProfile.avatarUrl,
          });
        }
      })
      .catch((err) => {
        console.warn('Profile sync error:', err);
      });
  }, [userProfile?.schoolEmail]);

  // ── Swipe-back edge gesture ──────────────────────────────────────────────
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

      const view = useAppStore.getState().currentView;
      if (view === 'lesson' || view === 'caseExam' || view === 'placementTest') {
        useAppStore.getState().setCurrentView('course');
        useAppStore.getState().setSelectedLessonId(null);
        useAppStore.getState().setSelectedCaseId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (view === 'course' || view === 'profile') {
        useAppStore.getState().setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
  // ────────────────────────────────────────────────────────────────────────

  // Guest-aware lesson/case opener
  // Authenticated users: always open. Guests: first lesson free, second triggers GuestGateModal.
  const openLessonOrCase = (
    type: 'lesson' | 'case',
    id: string
  ) => {
    if (isAuthenticated && isVerified) {
      // Authenticated: full access
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

    // Guest: allow the very first view, gate the second+
    const count = getGuestViewCount();
    if (count >= 1) {
      setShowGuestGate(true);
      return;
    }

    incrementGuestViewCount();
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

  const handleOpenProfile = () => {
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

  const handleSelectTrack = (track: 'probability' | 'statistics') => {
    setSelectedTrack(track);
    setSelectedInDesignCourse(null);
    setCustomActiveModuleName(null);
    setCurrentView('course');
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans flex flex-col selection:bg-[#ff7a00] selection:text-white overflow-x-hidden">
      {/* Sticky Navigation Header */}
      <XpStreakBar
        onGoHome={handleBackToHome}
        onOpenProfile={handleOpenProfile}
        currentView={currentView}
        activeModuleName={activeModuleName}
      />

      {/* Main Page Body */}
      <main className="flex-1 pt-20 sm:pt-24 pb-16">
        {currentView === 'home' && (
          <HomePage
            onSelectTrack={handleSelectTrack}
            onSelectInDesignCourse={handleSelectInDesignCourse}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {currentView === 'course' && (
          <CoursePage
            selectedTrack={selectedTrack}
            inDesignCourse={selectedInDesignCourse}
            onSelectLesson={handleSelectLesson}
            onSelectCaseExam={handleSelectCaseExam}
            onBackToHome={handleBackToHome}
            scrollToNodeId={scrollToNodeId}
            onStartPlacementTest={handleStartPlacementTest}
          />
        )}

        {currentView === 'profile' && (
          <ProfilePage
            onGoHome={handleBackToHome}
            onOpenAuth={() => setShowGuestGate(true)}
          />
        )}

        {currentView === 'lesson' && lessonData && (
          <LessonPage
            lesson={lessonData.lesson}
            module={lessonData.module}
            onBack={handleBackToCourse}
            onSelectNextTopic={handleSelectNextTopic}
            onBackToHomeWithScroll={handleBackToHomeWithScroll}
          />
        )}

        {currentView === 'caseExam' && caseData && (
          <CaseExamPage
            caseExam={caseData.caseExam}
            module={caseData.module}
            onBack={handleBackToCourse}
            onSelectNextTopic={handleSelectNextTopic}
            onBackToHomeWithScroll={handleBackToHomeWithScroll}
          />
        )}

        {currentView === 'placementTest' && (
          <PlacementTestPage onBackToHome={handleBackToHomeWithScroll} />
        )}
      </main>

      {/* Tanco Assistant Chat Modal & Floating Launcher */}
      <TancoChatModal />
      <FloatingTancoButton />

      {/* Guest Gate Modal: shown when unauthenticated user tries to access 2nd lesson/case */}
      {showGuestGate && (
        <GuestGateModal onClose={() => setShowGuestGate(false)} />
      )}
    </div>
  );
};
