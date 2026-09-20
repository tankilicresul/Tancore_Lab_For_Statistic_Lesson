import React, { useState, useEffect } from 'react';
import { Lesson, Module } from '../types/stats';
import { getLocalized } from '../utils/localization';
import { useAppStore } from '../store/useAppStore';
import { VocabBox } from '../components/VocabBox';
import { RealWorldBox } from '../components/RealWorldBox';
import { InteractiveCalc } from '../components/InteractiveCalc';
import { TanCoreMascotAvatar } from '../components/TanCoreMascotAvatar';
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Building2,
  Lightbulb,
  Trophy,
  Calculator,
  ChevronDown,
  ChevronUp,
  PartyPopper,
  Eye,
  Loader2,
  Bot,
  ArrowRight,
  Home,
  RefreshCw,
  Lock,
  Flame,
  Sparkles,
  BookOpen,
  Check,
  AlertCircle,
  HelpCircle as QuestionIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';

import { ConceptDiagram } from '../components/ConceptDiagram';
import { MathFormulaText } from '../components/MathFormulaText';
import { KatexFormula } from '../components/KatexFormula';
import { extractTopicFormula, stripFormulaFromText } from '../utils/formulaExtractor';
import { getNextTopicItem } from '../data/modules';

interface LessonPageProps {
  lesson: Lesson;
  module: Module;
  onBack: () => void;
  onSelectNextTopic?: (nextId: string, nextType: 'lesson' | 'case') => void;
  onBackToHomeWithScroll?: (lastId: string) => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  lesson,
  module,
  onBack,
  onSelectNextTopic,
  onBackToHomeWithScroll,
}) => {
  const { language, completeLesson, completedLessons, setIsTancoChatOpen, addXp } = useAppStore();

  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [questionId: string]: boolean }>({});
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(completedLessons.includes(lesson.id));
  const [isQuestionsOpen, setIsQuestionsOpen] = useState<boolean>(true);
  const [isNextLoading, setIsNextLoading] = useState<boolean>(false);
  const [showHintMap, setShowHintMap] = useState<{ [questionId: string]: boolean }>({});
  const [comboCount, setComboCount] = useState<number>(() => {
    try {
      return parseInt(sessionStorage.getItem('tancore_combo_count') || '0', 10) || 0;
    } catch {
      return 0;
    }
  });
  const [showComboAnimation, setShowComboAnimation] = useState<boolean>(false);
  const [comboBonusAwarded, setComboBonusAwarded] = useState<number>(0);

  const nextTopic = getNextTopicItem(lesson.id);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextTopicClick = () => {
    if (isNextLoading || !nextTopic) return;

    // If lesson has questions and is not completed yet, scroll to the practice question
    if (!isCompleted && !lesson.isOrientation) {
      setIsQuestionsOpen(true);
      const el = document.getElementById('lesson-question-box');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsNextLoading(true);

    setTimeout(() => {
      // Only orientation intro lessons without test questions auto-complete on continue
      if (lesson.isOrientation && !isCompleted) {
        completeLesson(lesson.id, module.id, 15);
        setIsCompleted(true);
      }
      if (onSelectNextTopic) {
        onSelectNextTopic(nextTopic.id, nextTopic.type);
      }
      setIsNextLoading(false);
    }, 600);
  };

  const handleAnswerSubmit = (qId: string) => {
    if (isSubmittingAnswer) return;
    setIsSubmittingAnswer(true);
    setSubmittedQuestions((prev) => ({ ...prev, [qId]: true }));
    const q = lesson.questions?.find((item) => item.id === qId);
    if (!q) {
      setIsSubmittingAnswer(false);
      return;
    }

    const userAnswer = selectedAnswers[qId];
    let isCorrect = false;

    if (typeof q.correctAnswer === 'number') {
      const parsedUser = parseFloat(String(userAnswer).replace(',', '.').trim());
      isCorrect =
        !isNaN(parsedUser) &&
        (Math.abs(parsedUser - q.correctAnswer) <= 0.01 || parsedUser === q.correctAnswer);
    } else {
      isCorrect =
        String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
    }

    if (isCorrect) {
      soundService.playCorrect();
      completeLesson(lesson.id, module.id, 15);
      setIsCompleted(true);
      triggerConfetti();

      // Combo System: increment combo streak
      const newCombo = comboCount + 1;
      setComboCount(newCombo);
      try {
        sessionStorage.setItem('tancore_combo_count', String(newCombo));
      } catch {}

      if (newCombo >= 2) {
        const bonus = newCombo === 2 ? 5 : 10;
        setComboBonusAwarded(bonus);
        addXp(bonus);
        setShowComboAnimation(true);
        setTimeout(() => setShowComboAnimation(false), 3000);
      }
    } else {
      soundService.playWrong();
      setComboCount(0);
      try {
        sessionStorage.setItem('tancore_combo_count', '0');
      } catch {}
    }

    setTimeout(() => {
      setIsSubmittingAnswer(false);
    }, 400);
  };

  const handleRetryQuestion = (qId: string) => {
    setSubmittedQuestions((prev) => ({ ...prev, [qId]: false }));
    setSelectedAnswers((prev) => ({ ...prev, [qId]: '' }));
    setShowHintMap((prev) => ({ ...prev, [qId]: false }));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  // Dedicated Orientation / Roadmap view for the first introductory lesson
  if (lesson.isOrientation) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-1 sm:pt-2 pb-32 sm:pb-24 font-sans animate-fade-in">
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
          <button
            onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border border-slate-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff7a00] shrink-0" />
            <span className="whitespace-nowrap">{language === 'tr' ? 'Ders Paneline Dön' : 'Back to Course'}</span>
          </button>

          <div className="flex items-center text-[10.5px] sm:text-xs font-extrabold text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#ff7a00]/30 min-w-0">
            <span className="truncate whitespace-nowrap">{language === 'tr' ? 'DERS REHBERİ' : 'COURSE GUIDE'}</span>
          </div>
        </div>

        {/* Lesson Main Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-2">
            <MathFormulaText text={getLocalized(lesson.title, language)} inline />
          </h1>
          <div className="h-1.5 w-24 bg-[#ff7a00] rounded-full" />
        </div>

        {/* Tanco Mascot Speech Card */}
        <div className="mb-6 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 border border-[#ff7a00]/30 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-3.5 sm:gap-4 mb-3.5">
            <button
              onClick={() => setIsTancoChatOpen(true)}
              className="relative shrink-0 cursor-pointer group focus:outline-none"
              title={language === 'tr' ? "Tanco ile Sohbet Et" : "Chat with Tanco"}
            >
              <TanCoreMascotAvatar size="md" className="shadow-md shadow-[#ff7a00]/25 group-hover:scale-105 transition-transform" />
            </button>

            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] text-[11px] sm:text-xs font-black uppercase tracking-wider border border-[#ff7a00]/20">
              <span>{language === 'tr' ? 'Tanco Rehberin Konuşuyor' : 'Guide Tanco Speaking'}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {lesson.tancoSpeech ? getLocalized(lesson.tancoSpeech, language) : getLocalized(lesson.conceptCard, language)}
          </p>
        </div>

        {/* Tanco Assistant Floating Reminder Card */}
        <div className="mb-8 p-5 rounded-3xl bg-slate-900 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#ff7a00] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#ff7a00]/30">
              <Bot className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white tracking-tight">
                {language === 'tr' ? 'Hey, unutmadan!' : "Hey, don't forget!"}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium leading-relaxed mt-0.5 max-w-lg">
                {language === 'tr'
                  ? 'Çalışırken aklına takılan herhangi bir formülü veya soruyu sol alttaki Tanco Asistan butonuna tıklayarak bana anında sorabilirsin.'
                  : 'Whenever you get stuck or have questions about formulas, you can chat with Assistant Tanco on the bottom-left.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTancoChatOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black transition-all shrink-0 cursor-pointer shadow-sm active:scale-95 text-center"
          >
            {language === 'tr' ? 'Tanco ile Konuş' : 'Chat with Tanco'}
          </button>
        </div>

        {/* Bottom Navigation / Next Topic Start Button */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#ff7a00]" />
              <span>{language === 'tr' ? 'Ders Paneli' : 'Course Panel'}</span>
            </button>

            {nextTopic && (
              <button
                disabled={isNextLoading}
                onClick={handleNextTopicClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                {isNextLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{language === 'tr' ? 'Açılıyor...' : 'Opening...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      <MathFormulaText text={(language === 'tr' ? 'Başla: ' : 'Start: ') + getLocalized(nextTopic.title, language)} inline />
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-1 sm:pt-2 pb-32 sm:pb-24 font-sans animate-fade-in">
      {/* Combo Streak Float Banner */}
      {showComboAnimation && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm shadow-xl border border-white/40">
            <Flame className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-pulse" />
            <span>
              {language === 'tr'
                ? `🔥 ${comboCount}x COMBO! (+${comboBonusAwarded} Bonus XP)`
                : `🔥 ${comboCount}x COMBO! (+${comboBonusAwarded} Bonus XP)`}
            </span>
          </div>
        </div>
      )}

      {/* Top Breadcrumb Navigation & Course Track Badge */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-3.5">
        <button
          onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
          className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border border-slate-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff7a00] shrink-0" />
          <span className="whitespace-nowrap">{language === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
        </button>

        <div className="flex items-center space-x-2">
          {comboCount >= 2 && (
            <div className="hidden xs:flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-1 rounded-full text-[11px] font-black shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{comboCount}x Combo</span>
            </div>
          )}
          <div className="flex items-center text-[10.5px] sm:text-xs font-extrabold text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#ff7a00]/30 min-w-0 max-w-[60%] xs:max-w-none">
            <span className="truncate whitespace-nowrap">
              <MathFormulaText text={getLocalized(module.title, language)} inline />
            </span>
          </div>
        </div>
      </div>

      {/* Modern 4-Step Learning Progress Bar (Sticky Navigation Stepper) */}
      <div className="mb-6 p-2 rounded-2xl bg-slate-100/90 border border-slate-200/90 shadow-2xs grid grid-cols-4 gap-1.5 text-[10.5px] sm:text-xs font-black">
        <button
          onClick={() => scrollToSection('section-theory')}
          className="py-1.5 px-2 rounded-xl bg-white text-slate-800 shadow-2xs flex items-center justify-center space-x-1 hover:text-[#ff7a00] transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
          <span className="truncate">{language === 'tr' ? '1. Teori' : '1. Theory'}</span>
        </button>

        <button
          onClick={() => scrollToSection('section-example')}
          className="py-1.5 px-2 rounded-xl bg-white text-slate-800 shadow-2xs flex items-center justify-center space-x-1 hover:text-[#ff7a00] transition-colors cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{language === 'tr' ? '2. Örnek' : '2. Example'}</span>
        </button>

        <button
          onClick={() => scrollToSection('lesson-question-box')}
          className={`py-1.5 px-2 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-700 font-black border border-emerald-200'
              : 'bg-[#ff7a00]/15 text-[#ff7a00] font-black border border-[#ff7a00]/30 shadow-xs'
          }`}
        >
          <QuestionIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{isCompleted ? (language === 'tr' ? '3. Çözüldü ✓' : '3. Solved ✓') : (language === 'tr' ? '3. Soru (+15XP)' : '3. Practice')}</span>
        </button>

        <button
          onClick={() => scrollToSection('section-finish')}
          className={`py-1.5 px-2 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'bg-white text-slate-500 hover:text-slate-800'
          }`}
        >
          <PartyPopper className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{language === 'tr' ? '4. Bitiş' : '4. Finish'}</span>
        </button>
      </div>

      {/* Lesson Main Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-2">
          <MathFormulaText text={getLocalized(lesson.title, language)} inline />
        </h1>
        <div className="h-1.5 w-20 bg-[#ff7a00] rounded-full" />
      </div>

      {/* SECTION 1: Konunun Kendisi & Teori */}
      <div id="section-theory" className="mb-6 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative">
        <div className="flex items-center space-x-3 mb-3.5">
          <div className="p-2.5 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#ff7a00]">
              {language === 'tr' ? '1: Konunun Kendisi & Formül Mantığı' : '1: Core Concept & Theory'}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate">
              {language === 'tr' ? 'Temel teorik açıklamalar, kurallar ve formüller' : 'Theoretical foundations, rules and formulas'}
            </p>
          </div>
        </div>

        {(() => {
          const rawConcept = getLocalized(lesson.conceptCard, language);

          return (
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mb-4">
              <MathFormulaText text={rawConcept} />
            </div>
          );
        })()}

        {/* Sınav Tüyosu / Pro-Tip Callout Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11.5px] font-medium leading-relaxed">
            <strong className="font-bold text-amber-950">
              {language === 'tr' ? '💡 Sınav & Akran Tüyosu: ' : '💡 Exam & Pro Tip: '}
            </strong>
            {language === 'tr'
              ? 'Bu konudaki formülleri uygularken verilen birimlerin ve bağımsızlık koşullarının doğruluğunu kontrol etmeyi unutmayın.'
              : 'Always verify unit consistency and independence conditions before directly applying the standard formula.'}
          </div>
        </div>
      </div>

      {/* Visual Concept Diagram */}
      <ConceptDiagram moduleId={module.id} lessonId={lesson.id} />

      {/* SECTION 2: Varsa Örnek Soru Çözümü */}
      {lesson.companyExample && (
        <div id="section-example" className="mb-6 p-5 sm:p-6 rounded-3xl bg-[#ff7a00]/5 border border-[#ff7a00]/25 shadow-xs">
          <div className="flex items-center space-x-3 mb-3.5">
            <div className="p-2.5 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
              <Lightbulb className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#ff7a00]">
                {language === 'tr' ? '2: Varsa Örnek Soru Çözümü' : '2: Worked Example & Solution'}
              </h3>
              <p className="text-xs text-slate-600 font-medium truncate">
                {language === 'tr' ? 'Adım adım çözümlü pratik uygulama ve soru çözümü' : 'Step-by-step practical problem solving & scenario'}
              </p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
            <MathFormulaText text={getLocalized(lesson.companyExample, language)} />
          </div>
        </div>
      )}

      {/* Interactive Calculation Area (if applicable) */}
      <InteractiveCalc
        type={lesson.interactiveType}
        initialData={lesson.interactiveInitialData}
      />

      {/* SECTION 3: Örnek Soru & Pratik */}
      {lesson.questions && lesson.questions.length > 0 && (
        <div id="lesson-question-box" className="my-8 rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <button
            onClick={() => setIsQuestionsOpen(!isQuestionsOpen)}
            className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left focus:outline-none cursor-pointer"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
                <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#ff7a00]">
                    {language === 'tr' ? '3: Kavrama Sorusu' : '3: Practice Question'}
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-[#ff7a00] border border-orange-200">
                    +15 XP
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {language === 'tr' ? 'Soruyu çözerek kendini dene ve +15 XP kazan' : 'Test your understanding and earn +15 XP'}
                </p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600 transition-colors shrink-0 ml-2">
              {isQuestionsOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-700" />
              )}
            </div>
          </button>

          {isQuestionsOpen && (
            <div className="p-6 pt-2 space-y-6 border-t border-slate-100">
              {lesson.questions.map((q) => {
                const isSubmitted = submittedQuestions[q.id];
                const userAnswer = selectedAnswers[q.id];
                let isCorrect = false;

                if (isSubmitted) {
                  if (typeof q.correctAnswer === 'number') {
                    const parsedUser = parseFloat(String(userAnswer).replace(',', '.').trim());
                    isCorrect =
                      !isNaN(parsedUser) &&
                      (Math.abs(parsedUser - q.correctAnswer) <= 0.01 || parsedUser === q.correctAnswer);
                  } else {
                    isCorrect =
                      String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
                  }
                }

                const isHintOpen = showHintMap[q.id];

                return (
                  <div
                    key={q.id}
                    className="p-6 rounded-3xl bg-slate-50/50 border border-slate-200/80 shadow-xs"
                  >
                    <div className="text-base font-medium text-[#ff7a00] mb-4 leading-snug break-words">
                      <MathFormulaText text={getLocalized(q.prompt, language)} />
                    </div>

                    {/* Multiple Choice Options */}
                    {q.type === 'multiple_choice' && q.options && (
                      <div className="space-y-3 mb-4">
                        {q.options.map((opt, oIdx) => {
                          const optText = getLocalized(opt, language);
                          const isSelected = userAnswer === optText;

                          return (
                            <button
                              key={oIdx}
                              disabled={isSubmitted && isCorrect}
                              onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optText })}
                              className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all break-words cursor-pointer ${
                                isSelected
                                  ? 'bg-[#ff7a00]/15 border-[#ff7a00] text-[#ff7a00] shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-800 hover:border-[#ff7a00]/40'
                              }`}
                            >
                              <MathFormulaText text={optText} />
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Numeric Input */}
                    {q.type === 'numeric' && (
                      <div className="mb-4">
                        <input
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck="false"
                          disabled={isSubmitted && isCorrect}
                          value={userAnswer !== undefined ? String(userAnswer) : ''}
                          onChange={(e) =>
                            setSelectedAnswers({ ...selectedAnswers, [q.id]: e.target.value })
                          }
                          placeholder={language === 'tr' ? 'Örn: 0.25 veya 0,25' : 'e.g. 0.25 or 0,25'}
                          className="w-full sm:w-64 p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-mono text-base focus:outline-none focus:border-[#ff7a00] font-bold"
                        />
                      </div>
                    )}

                    {/* Smart Hint / Tanco'dan İpucu Al Button & Accordion */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowHintMap((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200/80 transition-colors cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'tr' ? '💡 Tanco\'dan İpucu Al' : '💡 Ask Tanco for a Hint'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsTancoChatOpen(true)}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5 text-[#ff7a00]" />
                        <span>{language === 'tr' ? 'Tanco\'ya Doğrudan Sor' : 'Ask Tanco Directly'}</span>
                      </button>
                    </div>

                    {isHintOpen && (
                      <div className="mb-4 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 leading-relaxed font-medium animate-fade-in">
                        <div className="font-bold flex items-center space-x-1.5 text-amber-800 mb-1">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span>{language === 'tr' ? 'Kavramsal Çözüm İpucu' : 'Conceptual Hint'}</span>
                        </div>
                        <p>
                          {language === 'tr'
                            ? 'Yukarıdaki formülde verilen değerleri yerine koyarken dikkat edin. Gerekirse Tanco Asistan butonuna tıklayarak adım adım yardım alabilirsiniz.'
                            : 'Check the formula variables carefully. You can also click the assistant button to get step-by-step guidance from Tanco.'}
                        </p>
                      </div>
                    )}

                    {/* Submit button for question */}
                    {!isSubmitted ? (
                      <button
                        disabled={isSubmittingAnswer || userAnswer === undefined || String(userAnswer).trim() === ''}
                        onClick={() => handleAnswerSubmit(q.id)}
                        className="px-6 py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#ff7a00]/20 cursor-pointer"
                      >
                        {language === 'tr' ? 'Cevabı Gönder (+15 XP)' : 'Submit Answer (+15 XP)'}
                      </button>
                    ) : (
                      <div
                        className={`p-4 rounded-2xl border mt-3 ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center space-x-2 font-black">
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                <span className="text-emerald-700">
                                  {language === 'tr' ? 'Tebrikler, Doğru Cevap! (+15 XP)' : 'Congratulations, Correct! (+15 XP)'}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-rose-600 font-black text-base">✕</span>
                                <span className="text-rose-700">
                                  {language === 'tr' ? 'Yanlış Cevap' : 'Incorrect Answer'}
                                </span>
                              </>
                            )}
                          </div>

                          {!isCorrect && (
                            <button
                              onClick={() => handleRetryQuestion(q.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 flex items-center space-x-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>{language === 'tr' ? 'Tekrar Dene' : 'Try Again'}</span>
                            </button>
                          )}
                        </div>

                        <div className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                          <MathFormulaText text={getLocalized(q.explanation, language)} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STEP 5: English Vocabulary Box */}
      <VocabBox terms={lesson.vocabTerms} />

      {/* STEP 6: Real World Tool Box */}
      <RealWorldBox data={lesson.realWorldBox} />

      {/* Finish Lesson Banner & Action Buttons */}
      <div id="section-finish" className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
        <div
          className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
            isCompleted
              ? 'bg-emerald-500 shadow-emerald-500/20'
              : 'bg-[#ff7a00] shadow-[#ff7a00]/20'
          }`}
        >
          {isCompleted ? (
            <PartyPopper className="w-7 h-7 stroke-[2.2]" />
          ) : (
            <HelpCircle className="w-7 h-7 stroke-[2.2]" />
          )}
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">
          {isCompleted
            ? language === 'tr'
              ? '🎉 Dersi Başarıyla Tamamladın!'
              : '🎉 Lesson Successfully Completed!'
            : language === 'tr'
              ? 'Dersi Tamamlamak ve +15 XP Kazanmak İçin Soruyu Doğru Çöz'
              : 'Answer Question Correctly to Complete & Earn +15 XP'}
        </h3>

        <p className="text-xs text-slate-500 mb-6 font-medium max-w-lg mx-auto">
          {isCompleted
            ? language === 'tr'
              ? 'Ders sorusunu doğru yanıtlayarak +15 XP kazandınız.'
              : 'You earned +15 XP by answering the lesson question correctly.'
            : language === 'tr'
              ? 'XP kazanmak ve bu dersi tamamlamak için yukarıdaki kavrama sorusunu doğru çözmeniz gerekmektedir.'
              : 'You must answer the practice question above correctly to complete this lesson and earn +15 XP.'}
        </p>

        {!isCompleted && (
          <div className="mb-6">
            <button
              onClick={() => {
                setIsQuestionsOpen(true);
                const el = document.getElementById('lesson-question-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 cursor-pointer active:scale-95 inline-flex items-center space-x-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{language === 'tr' ? 'Soruyu Doğru Çöz (+15 XP Kazan)' : 'Solve Question to Earn +15 XP'}</span>
            </button>
          </div>
        )}

        {/* Action Buttons Group: Ana Sayfa - Yönetici Özeti - Sıradaki Konu */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* 1. Back to Home */}
          <button
            onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs tracking-wide border border-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#ff7a00]" />
            <span>{language === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
          </button>

          {/* 2. Yönetici Özeti */}
          <button
            onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs tracking-wide border border-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#ff7a00]" />
            <span>{language === 'tr' ? 'Yönetici Özeti' : 'Executive Summary'}</span>
          </button>

          {/* 3. Next Topic Button with dynamic completion state */}
          {nextTopic && (
            <button
              disabled={isNextLoading}
              onClick={handleNextTopicClick}
              title={
                !isCompleted && !lesson.isOrientation
                  ? language === 'tr'
                    ? 'Dersi tamamlamak ve sonraki konuyu açmak için yukarıdaki soruyu çözün'
                    : 'Solve practice question to complete lesson and unlock next topic'
                  : undefined
              }
              className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-xs tracking-wide border transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                isNextLoading
                  ? 'bg-[#ff7a00] text-white border-[#ff7a00] shadow-lg shadow-[#ff7a00]/20'
                  : isCompleted || lesson.isOrientation
                  ? 'bg-[#ff7a00] hover:bg-[#e66e00] text-white border-[#ff7a00] shadow-md shadow-[#ff7a00]/25 active:scale-95'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 active:scale-95'
              }`}
            >
              {isNextLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>
                    <MathFormulaText text={getLocalized(nextTopic.title, language)} inline />
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {isCompleted || lesson.isOrientation
                      ? language === 'tr'
                        ? 'Sıradaki Konu: '
                        : 'Next: '
                      : language === 'tr'
                      ? 'Sonraki Konu: '
                      : 'Next Topic: '}
                    <MathFormulaText text={getLocalized(nextTopic.title, language)} inline />
                  </span>
                  {isCompleted || lesson.isOrientation ? (
                    <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
                  )}
                </>
              )}
            </button>
          )}

          {/* Replay Confetti */}
          {isCompleted && (
            <button
              onClick={triggerConfetti}
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ff7a00] font-bold text-xs border border-orange-200 transition-colors flex items-center justify-center space-x-1.5"
              title={language === 'tr' ? 'Kutlamayı Tekrar Başlat' : 'Replay Celebration'}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'tr' ? 'Tekrar Kutla' : 'Replay'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
