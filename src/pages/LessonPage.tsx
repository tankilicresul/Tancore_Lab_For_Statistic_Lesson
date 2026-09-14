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
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback if confetti fails
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-white bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'tr' ? 'Modül Listesine Dön' : 'Back to Modules'}</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
          <span>{getLocalized(module.title, language)}</span>
          <span>•</span>
          <span>{language === 'tr' ? `Ders ${lesson.order}` : `Lesson ${lesson.order}`}</span>
        </div>
      </div>

      {/* Lesson Main Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {getLocalized(lesson.title, language)}
        </h1>
        <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
      </div>

      {/* STEP 1: Concept Card (Kavram Kartı) */}
      <div className="mb-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative">
        <div className="flex items-center space-x-3 mb-3 text-indigo-400">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            {language === 'tr' ? '1. Kavram Kartı' : '1. Concept Card'}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
          {getLocalized(lesson.conceptCard, language)}
        </p>
      </div>

      {/* STEP 2: Company Example (Şirket Örneği) */}
      <div className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 shadow-xl">
        <div className="flex items-center space-x-3 mb-3 text-emerald-400">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            {language === 'tr' ? '2. Gerçek Şirket Örneği' : '2. Real Company Example'}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
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
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">
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
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl"
              >
                <p className="text-base font-bold text-white mb-4">
                  {getLocalized(q.prompt, language)}
                </p>

                {/* Multiple Choice Options */}
                {q.type === 'multiple_choice' && q.options && (
                  <div className="space-y-2.5 mb-4">
                    {q.options.map((opt, oIdx) => {
                      const optText = getLocalized(opt, language);
                      const isSelected = userAnswer === optText;

                      return (
                        <button
                          key={oIdx}
                          disabled={isSubmitted}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optText })}
                          className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm transition-all ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
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
                      className="w-full sm:w-64 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Submit button for question */}
                {!isSubmitted ? (
                  <button
                    disabled={userAnswer === undefined || String(userAnswer).trim() === ''}
                    onClick={() => handleAnswerSubmit(q.id)}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm transition-colors"
                  >
                    {language === 'tr' ? 'Cevabı Kontrol Et' : 'Check Answer'}
                  </button>
                ) : (
                  <div
                    className={`p-4 rounded-2xl border mt-3 ${
                      isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-bold mb-1">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>{language === 'tr' ? 'Doğru Cevap! (+15 XP)' : 'Correct Answer! (+15 XP)'}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-rose-400">✕</span>
                          <span>
                            {language === 'tr'
                              ? `Yanlış. Doğru cevap: ${q.correctAnswer}`
                              : `Incorrect. Correct answer: ${q.correctAnswer}`}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
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
      <div className="mt-10 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-lg">
          <Trophy className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-extrabold text-white mb-1">
          {isCompleted
            ? language === 'tr' ? 'Bu Dersi Tamamladın!' : 'Lesson Completed!'
            : language === 'tr' ? 'Dersi Tamamla & XP Kazan' : 'Complete Lesson & Earn XP'}
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          {language === 'tr'
            ? 'Tebrikler! Kavramı ve gerçek hayat kullanımını inceledin.'
            : 'Great job! You reviewed the concept and real-world tools.'}
        </p>

        <button
          onClick={handleFinishLesson}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 mx-auto"
        >
          <Sparkles className="w-4 h-4" />
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
