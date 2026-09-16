import React, { useState, useEffect } from 'react';
import { XpStreakBar } from './components/XpStreakBar';
import { AuthLandingScreen } from './components/AuthLandingScreen';
import { HomePage, CourseTrack } from './pages/HomePage';
import { CoursePage } from './pages/CoursePage';
import { ProfilePage } from './pages/ProfilePage';
import { LessonPage } from './pages/LessonPage';
import { CaseExamPage } from './pages/CaseExamPage';
import { PlacementTestPage } from './pages/PlacementTestPage';
import { TancoChatModal } from './components/TancoChatModal';
import { FloatingTancoButton } from './components/FloatingTancoButton';
import { TancoOnboardingTour } from './components/TancoOnboardingTour';
import { getLessonById, getCaseExamById, getModuleById } from './data/modules';
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

  // If user is not authenticated or not verified, display full-screen Auth Onboarding Screen
  if (!isAuthenticated || !isVerified) {
    return <AuthLandingScreen onSuccess={() => setCurrentView('home')} />;
  }

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setSelectedCaseId(null);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCaseExam = (caseId: string) => {
    setSelectedCaseId(caseId);
    setSelectedLessonId(null);
    setCurrentView('caseExam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNextTopic = (nextId: string, nextType: 'lesson' | 'case') => {
    if (nextType === 'lesson') {
      handleSelectLesson(nextId);
    } else {
      handleSelectCaseExam(nextId);
    }
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-[#ff7a00] selection:text-white overflow-x-hidden">
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
      <TancoOnboardingTour />
    </div>
  );
};
