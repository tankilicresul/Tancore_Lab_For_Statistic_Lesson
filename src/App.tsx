import React, { useState } from 'react';
import { XpStreakBar } from './components/XpStreakBar';
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { CaseExamPage } from './pages/CaseExamPage';
import { getLessonById, getCaseExamById } from './data/modules';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'lesson' | 'caseExam'>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCaseExam = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView('caseExam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedLessonId(null);
    setSelectedCaseId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lessonData = selectedLessonId ? getLessonById(selectedLessonId) : undefined;
  const caseData = selectedCaseId ? getCaseExamById(selectedCaseId) : undefined;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Sticky Navigation Header */}
      <XpStreakBar />

      {/* Main Page Body */}
      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <HomePage
            onSelectLesson={handleSelectLesson}
            onSelectCaseExam={handleSelectCaseExam}
          />
        )}

        {currentView === 'lesson' && lessonData && (
          <LessonPage
            lesson={lessonData.lesson}
            module={lessonData.module}
            onBack={handleBackToHome}
          />
        )}

        {currentView === 'caseExam' && caseData && (
          <CaseExamPage
            caseExam={caseData.caseExam}
            module={caseData.module}
            onBack={handleBackToHome}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500 font-medium">
        <p>StatLingo — Step-by-Step Statistics & Business Analytics Platform</p>
      </footer>
    </div>
  );
};
