import React, { useState } from 'react';
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
  Sparkles,
  Calculator,
  ChevronDown,
  ChevronUp,
  PartyPopper,
  Check,
  Eye,
  Loader2,
  Bot,
  ArrowRight,
  Home,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const { language, completeLesson, completedLessons, setIsTancoChatOpen } = useAppStore();

  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [questionId: string]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(completedLessons.includes(lesson.id));
  const [isQuestionsOpen, setIsQuestionsOpen] = useState<boolean>(true);
  const [isNextLoading, setIsNextLoading] = useState<boolean>(false);

  const nextTopic = getNextTopicItem(lesson.id);

  const handleNextTopicClick = () => {
    if (isNextLoading || !nextTopic) return;
    setIsNextLoading(true);

    setTimeout(() => {
      if (!isCompleted) handleFinishLesson();
      if (onSelectNextTopic) {
        onSelectNextTopic(nextTopic.id, nextTopic.type);
      }
      setIsNextLoading(false);
    }, 1200);
  };

  const handleAnswerSubmit = (qId: string) => {
    setSubmittedQuestions((prev) => ({ ...prev, [qId]: true }));
    const q = lesson.questions?.find((item) => item.id === qId);
    const userAnswer = selectedAnswers[qId];
    const isCorrect =
      q &&
      (typeof q.correctAnswer === 'number'
        ? parseFloat(String(userAnswer)) === q.correctAnswer
        : String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase());

    if (isCorrect || !q) {
      completeLesson(lesson.id, module.id, 15);
      setIsCompleted(true);
      triggerConfetti();
    }
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

  const handleFinishLesson = () => {
    completeLesson(lesson.id, module.id, 15);
    setIsCompleted(true);
    triggerConfetti();
  };

  // Dedicated Orientation / Roadmap view for the first introductory lesson
  if (lesson.isOrientation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 font-sans animate-fade-in">
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <button
            onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border border-slate-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff7a00] shrink-0" />
            <span className="whitespace-nowrap">{language === 'tr' ? 'Ders Paneline Dön' : 'Back to Course'}</span>
          </button>

          <div className="flex items-center text-[10.5px] sm:text-xs font-extrabold text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#ff7a00]/30 min-w-0">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span className="truncate whitespace-nowrap">{language === 'tr' ? 'DERS REHBERİ' : 'COURSE GUIDE'}</span>
          </div>
        </div>

        {/* Lesson Main Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-2">
            {getLocalized(lesson.title, language)}
          </h1>
          <div className="h-1.5 w-24 bg-[#ff7a00] rounded-full" />
        </div>

        {/* Tanco Mascot Speech Card */}
        <div className="mb-6 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 border border-[#ff7a00]/30 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <button
              onClick={() => setIsTancoChatOpen(true)}
              className="relative shrink-0 cursor-pointer group focus:outline-none"
              title={language === 'tr' ? "Tanco ile Sohbet Et" : "Chat with Tanco"}
            >
              <TanCoreMascotAvatar size="lg" className="shadow-lg shadow-[#ff7a00]/30 group-hover:scale-105 transition-transform" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </button>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] text-[11px] font-black uppercase tracking-wider mb-2">
                <span>🤖 {language === 'tr' ? 'Tanco Rehberin Konuşuyor' : 'Guide Tanco Speaking'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {lesson.tancoSpeech ? getLocalized(lesson.tancoSpeech, language) : getLocalized(lesson.conceptCard, language)}
              </p>
            </div>
          </div>
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
                      {language === 'tr' ? `Başla: ${getLocalized(nextTopic.title, language)}` : `Start: ${getLocalized(nextTopic.title, language)}`}
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
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans animate-fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <button
          onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
          className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border border-slate-200 shadow-2xs transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff7a00] shrink-0" />
          <span className="whitespace-nowrap">{language === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
        </button>

        <div className="flex items-center text-[10.5px] sm:text-xs font-extrabold text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#ff7a00]/30 min-w-0 max-w-[60%] xs:max-w-none">
          <span className="truncate whitespace-nowrap">{getLocalized(module.title, language)}</span>
        </div>
      </div>

      {/* Lesson Main Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-2">
          {getLocalized(lesson.title, language)}
        </h1>
        <div className="h-1.5 w-20 bg-[#ff7a00] rounded-full" />
      </div>

      {/* STEP 1: Concept Card (Kavram Kartı) */}
      <div className="mb-5 p-5 rounded-3xl bg-white border border-slate-200 shadow-xs relative">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
            <Lightbulb className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#ff7a00]">
              {language === 'tr' ? '1. Kavram Kartı' : '1. Concept Card'}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate">
              {language === 'tr' ? 'Temel teorik açıklama ve mantık' : 'Core theoretical explanation & logic'}
            </p>
          </div>
        </div>

        {(() => {
          const rawConcept = getLocalized(lesson.conceptCard, language);

          return (
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mb-3">
              <MathFormulaText text={rawConcept} />
            </div>
          );
        })()}
      </div>

      {/* STEP 1.5: High-Quality Visual Concept Diagram (Grafik & Görsel Şema) */}
      <ConceptDiagram moduleId={module.id} lessonId={lesson.id} />

      {/* STEP 2: Company Example (Şirket Örneği) */}
      <div className="mb-5 p-5 rounded-3xl bg-[#ff7a00]/5 border border-[#ff7a00]/25 shadow-xs">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
            <Building2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#ff7a00]">
              {language === 'tr' ? '2. Gerçek Şirket Örneği' : '2. Real Company Example'}
            </h3>
            <p className="text-xs text-slate-600 font-medium truncate">
              {language === 'tr' ? 'Pratik e-ticaret & iş dünyası senaryosu' : 'Practical e-commerce & business scenario'}
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
          <MathFormulaText text={getLocalized(lesson.companyExample, language)} />
        </p>
      </div>

      {/* STEP 3: Interactive Calculation Area */}
      <InteractiveCalc
        type={lesson.interactiveType}
        initialData={lesson.interactiveInitialData}
      />

      {/* STEP 4: Mini Questions (Sorular) */}
      {lesson.questions && lesson.questions.length > 0 && (
        <div className="my-8 rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <button
            onClick={() => setIsQuestionsOpen(!isQuestionsOpen)}
            className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left focus:outline-none"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
                <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#ff7a00]">
                    {language === 'tr' ? '4. Mini Kavrama Soruları' : '4. Mini Check Questions'}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {lesson.questions.length} {language === 'tr' ? 'Soru' : 'Questions'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {language === 'tr' ? 'Bilgilerini test et ve XP kazan' : 'Test your knowledge & earn XP'}
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
                const isCorrect =
                  isSubmitted &&
                  (typeof q.correctAnswer === 'number'
                    ? parseFloat(String(userAnswer)) === q.correctAnswer
                    : String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase());

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
                              disabled={isSubmitted}
                              onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optText })}
                              className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all break-words ${
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
                          type="number"
                          disabled={isSubmitted}
                          value={userAnswer !== undefined ? String(userAnswer) : ''}
                          onChange={(e) =>
                            setSelectedAnswers({ ...selectedAnswers, [q.id]: e.target.value })
                          }
                          placeholder={language === 'tr' ? 'Sayısal cevabınızı girin...' : 'Enter numerical answer...'}
                          className="w-full sm:w-64 p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-mono text-base focus:outline-none focus:border-[#ff7a00] font-bold"
                        />
                      </div>
                    )}

                    {/* Submit button for question */}
                    {!isSubmitted ? (
                      <button
                        disabled={userAnswer === undefined || String(userAnswer).trim() === ''}
                        onClick={() => handleAnswerSubmit(q.id)}
                        className="px-6 py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#ff7a00]/20 cursor-pointer"
                      >
                        {language === 'tr' ? 'Kontrol Et (+15 XP)' : 'Check Answer (+15 XP)'}
                      </button>
                    ) : (
                      <div
                        className={`p-4 rounded-2xl border mt-3 ${
                          isCorrect
                            ? 'bg-[#ff7a00]/10 border-[#ff7a00]/30 text-[#ff7a00]'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2 font-black mb-1">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-[#ff7a00]" />
                              <span>{language === 'tr' ? 'Doğru Cevap! (+15 XP)' : 'Correct Answer! (+15 XP)'}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-rose-600 font-black">✕</span>
                              <span>
                                {language === 'tr'
                                  ? `Yanlış. Doğru cevap: ${q.correctAnswer}`
                                  : `Incorrect. Correct answer: ${q.correctAnswer}`}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
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
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#ff7a00] flex items-center justify-center text-white shadow-lg shadow-[#ff7a00]/20">
          {isCompleted ? (
            <PartyPopper className="w-7 h-7 stroke-[2.2]" />
          ) : (
            <HelpCircle className="w-7 h-7 stroke-[2.2]" />
          )}
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">
          {isCompleted
            ? language === 'tr' ? 'Dersi Başarıyla Tamamladın!' : 'Lesson Successfully Completed!'
            : language === 'tr' ? 'Dersi Tamamla & XP Kazan' : 'Complete Lesson & Earn XP'}
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          {isCompleted
            ? language === 'tr'
              ? 'Ders sorularını başarıyla yanıtlayarak +15 XP kazandınız.'
              : 'You earned +15 XP by completing the lesson.'
            : language === 'tr'
              ? 'Ders içindeki soruları yanıtlayarak +15 XP kazanabilirsin.'
              : 'Answer the questions to earn +15 XP.'}
        </p>

        {/* Action Buttons Group: Ana Sayfa - Yönetici Özeti - Sıradaki Konu */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* 1. Back to Home */}
          <button
            onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs tracking-wide border border-slate-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4 text-[#ff7a00]" />
            <span>{language === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
          </button>

          {/* 2. Yönetici Özeti */}
          <button
            onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs tracking-wide border border-slate-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4 text-[#ff7a00]" />
            <span>{language === 'tr' ? 'Yönetici Özeti' : 'Executive Summary'}</span>
          </button>

          {/* 3. Next Topic Button with 3s loader */}
          {nextTopic && (
            <button
              disabled={isNextLoading}
              onClick={handleNextTopicClick}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-xs tracking-wide border transition-all flex items-center justify-center space-x-2 ${
                isNextLoading
                  ? 'bg-[#ff7a00] text-white border-[#ff7a00] shadow-lg shadow-[#ff7a00]/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              {isNextLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{getLocalized(nextTopic.title, language)}</span>
                </>
              ) : (
                <>
                  <span>{getLocalized(nextTopic.title, language)}</span>
                  <Check className="w-4 h-4 text-[#ff7a00] stroke-[2.5]" />
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
