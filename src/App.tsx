import React, { useState } from 'react';
import { XpStreakBar } from './components/XpStreakBar';
import { AuthLandingScreen } from './components/AuthLandingScreen';
import { HomePage } from './pages/HomePage';
import { CoursePage } from './pages/CoursePage';
import { ProfilePage } from './pages/ProfilePage';
import { LessonPage } from './pages/LessonPage';
import { CaseExamPage } from './pages/CaseExamPage';
import { PlacementTestPage } from './pages/PlacementTestPage';
import { getLessonById, getCaseExamById, getModuleById } from './data/modules';
import { useAppStore } from './store/useAppStore';
import { getLocalized } from './utils/localization';

export const App: React.FC = () => {
  const { language, isAuthenticated, isVerified } = useAppStore();
  const [currentView, setCurrentView] = useState<'home' | 'course' | 'profile' | 'lesson' | 'caseExam' | 'placementTest'>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [scrollToNodeId, setScrollToNodeId] = useState<string | null>(null);
  const [customActiveModuleName, setCustomActiveModuleName] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<'probability' | 'statistics'>('probability');

  // If user is not authenticated or not verified, display full-screen Auth Onboarding Screen
  if (!isAuthenticated || !isVerified) {
    return <AuthLandingScreen onSuccess={() => setCurrentView('home')} />;
  }

  const handleSelectLesson = (lessonId: string) => {
    const data = getLessonById(lessonId);
    if (data && data.module.order >= 6) {
      setSelectedTrack('statistics');
    } else if (data) {
      setSelectedTrack('probability');
    }
    setSelectedLessonId(lessonId);
    setSelectedCaseId(null);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCaseExam = (caseId: string) => {
    const data = getCaseExamById(caseId);
    if (data && data.module.order >= 6) {
      setSelectedTrack('statistics');
    } else if (data) {
      setSelectedTrack('probability');
    }
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
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(null);
    setCustomActiveModuleName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfile = () => {
    setCurrentView('profile');
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(null);
    setCustomActiveModuleName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCourse = (targetNodeId?: string) => {
    setCurrentView('course');
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(targetNodeId || null);
    setCustomActiveModuleName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHomeWithScroll = (lastNodeId: string) => {
    setCurrentView('course');
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(lastNodeId);
  };

  const lessonData = selectedLessonId ? getLessonById(selectedLessonId) : undefined;
  const caseData = selectedCaseId ? getCaseExamById(selectedCaseId) : undefined;

  let activeModuleName: string | undefined = undefined;
  if (currentView === 'lesson' && lessonData) {
    activeModuleName = getLocalized(lessonData.module.title, language);
  } else if (currentView === 'caseExam' && caseData) {
    activeModuleName = getLocalized(caseData.module.title, language);
  } else if (customActiveModuleName) {
    activeModuleName = customActiveModuleName;
  }

  const handleSelectTrack = (track: 'probability' | 'statistics') => {
    setSelectedTrack(track);
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
            onStartPlacementTest={handleStartPlacementTest}
          />
        )}

        {currentView === 'course' && (
          <CoursePage
            selectedTrack={selectedTrack}
            onSelectLesson={handleSelectLesson}
            onSelectCaseExam={handleSelectCaseExam}
            onBackToHome={handleBackToHome}
            scrollToNodeId={scrollToNodeId}
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
          <PlacementTestPage onBackToHome={handleBackToHome} />
        )}
      </main>
    </div>
  );
};
