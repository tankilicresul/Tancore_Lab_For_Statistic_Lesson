import React, { useState } from 'react';
import { Lesson, Module } from '../types/stats';
import { getLocalized } from '../utils/localization';
import { useAppStore } from '../store/useAppStore';
import { VocabBox } from '../components/VocabBox';
import { RealWorldBox } from '../components/RealWorldBox';
import { InteractiveCalc } from '../components/InteractiveCalc';
import { ArrowLeft, CheckCircle2, HelpCircle, Building2, Lightbulb, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

import { ConceptDiagram } from '../components/ConceptDiagram';

import { getNextTopicItem } from '../data/modules';
import { ArrowRight, Home, RefreshCw } from 'lucide-react';

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
  const { language, completeLesson, completedLessons } = useAppStore();

  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [questionId: string]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(completedLessons.includes(lesson.id));

  const nextTopic = getNextTopicItem(lesson.id);

  const handleAnswerSubmit = (qId: string) => {
    setSubmittedQuestions({ ...submittedQuestions, [qId]: true });
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans animate-fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
          className="flex items-center space-x-2 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#ff7a00]" />
          <span>{language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-extrabold text-[#ff7a00] bg-[#ff7a00]/10 px-3.5 py-1.5 rounded-full border border-[#ff7a00]/30">
          <span>{getLocalized(module.title, language)}</span>
          <span>•</span>
          <span>{language === 'tr' ? `Ders ${lesson.order}` : `Lesson ${lesson.order}`}</span>
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
        <div className="flex items-center space-x-3 mb-2.5 text-[#ff7a00]">
          <div className="p-2 rounded-2xl bg-[#ff7a00]/15 border border-[#ff7a00]/30">
            <Lightbulb className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-[#ff7a00]">
            {language === 'tr' ? '1. Kavram Kartı' : '1. Concept Card'}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          {getLocalized(lesson.conceptCard, language)}
        </p>
      </div>

      {/* STEP 1.5: High-Quality Visual Concept Diagram (Grafik & Görsel Şema) */}
      <ConceptDiagram moduleId={module.id} lessonId={lesson.id} />

      {/* STEP 2: Company Example (Şirket Örneği) */}
      <div className="mb-5 p-5 rounded-3xl bg-[#ff7a00]/5 border border-[#ff7a00]/25 shadow-xs">
        <div className="flex items-center space-x-3 mb-2.5 text-[#ff7a00]">
          <div className="p-2 rounded-2xl bg-[#ff7a00]/15 border border-[#ff7a00]/30">
            <Building2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-[#ff7a00]">
            {language === 'tr' ? '2. Gerçek Şirket Örneği' : '2. Real Company Example'}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
          {getLocalized(lesson.companyExample, language)}
        </p>
      </div>

      {/* STEP 3: Interactive Calculation Area */}
      <InteractiveCalc
        type={lesson.interactiveType}
        initialData={lesson.interactiveInitialData}
      />

      {/* STEP 4: Mini Questions (Sorular) */}
      {lesson.questions && lesson.questions.length > 0 && (
        <div className="my-8 space-y-6">
          <div className="flex items-center space-x-2.5 text-[#ff7a00] mb-2">
            <HelpCircle className="w-5 h-5 stroke-[2.2] text-[#ff7a00]" />
            <h3 className="text-sm font-black uppercase tracking-widest">
              {language === 'tr' ? '4. Mini Kavrama Sorusu' : '4. Mini Check Questions'}
            </h3>
          </div>

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
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs"
              >
                <p className="text-base font-extrabold text-slate-900 mb-4 leading-snug">
                  {getLocalized(q.prompt, language)}
                </p>

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
                          className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all ${
                            isSelected
                              ? 'bg-[#ff7a00]/15 border-[#ff7a00] text-[#ff7a00] shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#ff7a00]/40'
                          }`}
                        >
                          {optText}
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
                      className="w-full sm:w-64 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-base focus:outline-none focus:border-[#ff7a00] font-bold"
                    />
                  </div>
                )}

                {/* Submit button for question */}
                {!isSubmitted ? (
                  <button
                    disabled={userAnswer === undefined || String(userAnswer).trim() === ''}
                    onClick={() => handleAnswerSubmit(q.id)}
                    className="px-6 py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#ff7a00]/20"
                  >
                    {language === 'tr' ? 'Cevabı Kontrol Et' : 'Check Answer'}
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
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                      {getLocalized(q.explanation, language)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 5: English Vocabulary Box */}
      <VocabBox terms={lesson.vocabTerms} />

      {/* STEP 6: Real World Tool Box */}
      <RealWorldBox data={lesson.realWorldBox} />

      {/* Finish Lesson Banner & Action Buttons */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#ff7a00] flex items-center justify-center text-white shadow-lg shadow-[#ff7a00]/20">
          <Trophy className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">
          {isCompleted
            ? language === 'tr' ? 'Bu Dersi Harika Bir Şekilde Tamamladın!' : 'Lesson Successfully Completed!'
            : language === 'tr' ? 'Dersi Tamamla & XP Kazan' : 'Complete Lesson & Earn XP'}
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          {language === 'tr'
            ? 'Tebrikler! Kavramı, grafik şemasını ve gerçek şirket uygulamasını inceledin.'
            : 'Great job! You reviewed the concept, visual diagram, and real-world tools.'}
        </p>

        {/* Action Buttons Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* First Time Completion Trigger */}
          {!isCompleted && (
            <button
              onClick={handleFinishLesson}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-[#ff7a00]/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{language === 'tr' ? 'Dersi Tamamla (+15 XP)' : 'Complete Lesson (+15 XP)'}</span>
            </button>
          )}

          {/* Next Topic Button */}
          {nextTopic && (
            <button
              onClick={() => {
                if (!isCompleted) handleFinishLesson();
                if (onSelectNextTopic) {
                  onSelectNextTopic(nextTopic.id, nextTopic.type);
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-[#ff7a00]/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>
                {language === 'tr'
                  ? `Sıradaki Konu: ${getLocalized(nextTopic.title, language)}`
                  : `Next: ${getLocalized(nextTopic.title, language)}`}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Back to Home with Scroll */}
          <button
            onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(lesson.id) : onBack())}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4 text-[#ff7a00]" />
            <span>{language === 'tr' ? 'Ana Sayfa (Haritada Göster)' : 'Home (Show on Map)'}</span>
          </button>

          {/* Replay Confetti */}
          {isCompleted && (
            <button
              onClick={triggerConfetti}
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ff7a00] font-bold text-xs border border-orange-200 transition-colors flex items-center justify-center space-x-1.5"
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
