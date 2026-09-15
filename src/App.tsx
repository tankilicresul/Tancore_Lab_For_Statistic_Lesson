import React, { useState } from 'react';
import { XpStreakBar } from './components/XpStreakBar';
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { CaseExamPage } from './pages/CaseExamPage';
import { PlacementTestPage } from './pages/PlacementTestPage';
import { getLessonById, getCaseExamById, getModuleById } from './data/modules';
import { useAppStore } from './store/useAppStore';
import { getLocalized } from './utils/localization';

export const App: React.FC = () => {
  const { language } = useAppStore();
  const [currentView, setCurrentView] = useState<'home' | 'lesson' | 'caseExam' | 'placementTest'>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [scrollToNodeId, setScrollToNodeId] = useState<string | null>(null);
  const [customActiveModuleName, setCustomActiveModuleName] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<'probability' | 'statistics'>('probability');

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

  const handleBackToHome = (targetNodeId?: string) => {
    setCurrentView('home');
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    setScrollToNodeId(targetNodeId || null);
    setCustomActiveModuleName(null);
  };

  const handleBackToHomeWithScroll = (lastNodeId: string) => {
    setCurrentView('home');
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
    setCurrentView('home');
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModuleFromHeader = (moduleId: string) => {
    const mod = getModuleById(moduleId);
    if (mod) {
      const title = getLocalized(mod.title, language);
      setCustomActiveModuleName(title);
      setCurrentView('home');
      setSelectedLessonId(null);
      setSelectedCaseId(null);

      if (mod.lessons && mod.lessons[0]) {
        setScrollToNodeId(mod.lessons[0].id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-[#ff7a00] selection:text-white overflow-x-hidden">
      {/* Sticky Navigation Header with Track & Module Switcher */}
      <XpStreakBar
        onGoHome={handleBackToHome}
        activeModuleName={activeModuleName}
        selectedTrack={selectedTrack}
        onSelectTrack={handleSelectTrack}
        onSelectModuleId={handleSelectModuleFromHeader}
      />

      {/* Main Page Body */}
      <main className="flex-1 pt-16 sm:pt-20 pb-16">
        {currentView === 'home' && (
          <HomePage
            onSelectLesson={handleSelectLesson}
            onSelectCaseExam={handleSelectCaseExam}
            onStartPlacementTest={handleStartPlacementTest}
            scrollToNodeId={scrollToNodeId}
            selectedTrack={selectedTrack}
          />
        )}

        {currentView === 'lesson' && lessonData && (
          <LessonPage
            lesson={lessonData.lesson}
            module={lessonData.module}
            onBack={handleBackToHome}
            onSelectNextTopic={handleSelectNextTopic}
            onBackToHomeWithScroll={handleBackToHomeWithScroll}
          />
        )}

        {currentView === 'caseExam' && caseData && (
          <CaseExamPage
            caseExam={caseData.caseExam}
            module={caseData.module}
            onBack={handleBackToHome}
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
