import React, { useState } from 'react';
import { Lesson, Module } from '../types/stats';
import { getLocalized } from '../utils/localization';
import { useAppStore } from '../store/useAppStore';
import { VocabBox } from '../components/VocabBox';
import { RealWorldBox } from '../components/RealWorldBox';
import { InteractiveCalc } from '../components/InteractiveCalc';
import { ArrowLeft, CheckCircle2, HelpCircle, Building2, Lightbulb, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonPageProps {
  lesson: Lesson;
  module: Module;
  onBack: () => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({ lesson, module, onBack }) => {
  const { language, completeLesson, completedLessons } = useAppStore();

  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [questionId: string]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(completedLessons.includes(lesson.id));

  const handleAnswerSubmit = (qId: string) => {
    setSubmittedQuestions({ ...submittedQuestions, [qId]: true });
  };

  const handleFinishLesson = () => {
    completeLesson(lesson.id, module.id, 15);
    setIsCompleted(true);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback if confetti fails
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans animate-fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#ff7a00]" />
          <span>{language === 'tr' ? 'Modül Listesine Dön' : 'Back to Modules'}</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-extrabold text-[#ff7a00] bg-[#ff7a00]/10 px-3.5 py-1.5 rounded-full border border-[#ff7a00]/30">
          <span>{getLocalized(module.title, language)}</span>
          <span>•</span>
          <span>{language === 'tr' ? `Ders ${lesson.order}` : `Lesson ${lesson.order}`}</span>
        </div>
      </div>

      {/* Lesson Main Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-3">
          {getLocalized(lesson.title, language)}
        </h1>
        <div className="h-1.5 w-24 bg-[#ff7a00] rounded-full" />
      </div>

      {/* STEP 1: Concept Card (Kavram Kartı) */}
      <div className="mb-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative">
        <div className="flex items-center space-x-3 mb-3 text-[#ff7a00]">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 border border-[#ff7a00]/30">
            <Lightbulb className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#ff7a00]">
            {language === 'tr' ? '1. Kavram Kartı' : '1. Concept Card'}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
          {getLocalized(lesson.conceptCard, language)}
        </p>
      </div>

      {/* STEP 2: Company Example (Şirket Örneği) */}
      <div className="mb-6 p-6 rounded-3xl bg-[#ff7a00]/5 border border-[#ff7a00]/25 shadow-xs">
        <div className="flex items-center space-x-3 mb-3 text-[#ff7a00]">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 border border-[#ff7a00]/30">
            <Building2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#ff7a00]">
            {language === 'tr' ? '2. Gerçek Şirket Örneği' : '2. Real Company Example'}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium">
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

      {/* Finish Lesson Banner & Action Button */}
      <div className="mt-10 p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#ff7a00] flex items-center justify-center text-white shadow-lg shadow-[#ff7a00]/20">
          <Trophy className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">
          {isCompleted
            ? language === 'tr' ? 'Bu Dersi Tamamladın!' : 'Lesson Completed!'
            : language === 'tr' ? 'Dersi Tamamla & XP Kazan' : 'Complete Lesson & Earn XP'}
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          {language === 'tr'
            ? 'Tebrikler! Kavramı ve gerçek hayat kullanımını inceledin.'
            : 'Great job! You reviewed the concept and real-world tools.'}
        </p>

        <button
          onClick={handleFinishLesson}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#ff7a00]/25 transition-all flex items-center justify-center space-x-2 mx-auto"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>
            {isCompleted
              ? language === 'tr' ? 'Tamamlandı (Tekrar Oyna)' : 'Completed (Replay)'
              : language === 'tr' ? 'Dersi Tamamla (+15 XP)' : 'Complete Lesson (+15 XP)'}
          </span>
        </button>
      </div>
    </div>
  );
};
