import React, { useState } from 'react';
import { CaseExam, Module } from '../types/stats';
import { getLocalized } from '../utils/localization';
import { useAppStore } from '../store/useAppStore';
import { getNextTopicItem } from '../data/modules';
import { ArrowLeft, Trophy, CheckCircle2, Table, HelpCircle, Eye, Sparkles, AlertCircle, ArrowRight, Home, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaseExamPageProps {
  caseExam: CaseExam;
  module: Module;
  onBack: () => void;
  onSelectNextTopic?: (nextId: string, nextType: 'lesson' | 'case') => void;
  onBackToHomeWithScroll?: (lastId: string) => void;
}

export const CaseExamPage: React.FC<CaseExamPageProps> = ({
  caseExam,
  module,
  onBack,
  onSelectNextTopic,
  onBackToHomeWithScroll,
}) => {
  const { language, completeCaseExam, completedCaseExams } = useAppStore();

  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [questionId: string]: boolean }>({});
  const [showExpectedApproach, setShowExpectedApproach] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(completedCaseExams.includes(caseExam.id));

  const nextTopic = getNextTopicItem(caseExam.id);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  const difficultyColor =
    caseExam.difficulty === 'kolay'
      ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30'
      : caseExam.difficulty === 'orta'
      ? 'bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30'
      : 'bg-rose-500/15 text-rose-800 border-rose-500/30';

  const handleAnswerSubmit = (qId: string) => {
    setSubmittedQuestions({ ...submittedQuestions, [qId]: true });
  };

  const handleFinishCase = () => {
    completeCaseExam(caseExam.id, module.id, 50);
    setIsCompleted(true);
    setShowExpectedApproach(true);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#ff7a00]" />
          <span>{language === 'tr' ? 'Modül Listesine Dön' : 'Back to Modules'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className={`text-xs font-black uppercase px-3.5 py-1 rounded-full border tracking-wider ${difficultyColor}`}>
            {caseExam.difficulty}
          </span>
        </div>
      </div>

      {/* Case Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#ff7a00] mb-2">
          <Trophy className="w-4 h-4 text-[#ff7a00]" />
          <span>{language === 'tr' ? 'Şirket Vaka Sınavı (Case Exam)' : 'Company Case Exam'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-2">
          {getLocalized(caseExam.title, language)}
        </h1>
        <div className="h-1.5 w-20 bg-[#ff7a00] rounded-full" />
      </div>

      {/* Business Question Box */}
      <div className="mb-5 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <h3 className="text-xs font-black text-[#ff7a00] uppercase tracking-widest mb-2.5">
          {language === 'tr' ? 'İş Vakası & Problem Tanımı' : 'Business Question & Case Problem'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          {getLocalized(caseExam.businessQuestion, language)}
        </p>
      </div>

      {/* Dataset Preview Table */}
      <div className="mb-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 text-[#ff7a00] mb-4">
          <Table className="w-5 h-5 stroke-[2.2] text-[#ff7a00]" />
          <h3 className="text-xs font-black uppercase tracking-widest">
            {language === 'tr' ? 'Vaka Veri Seti' : 'Case Dataset'}
          </h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#ff7a00]/10 text-[#ff7a00] font-extrabold uppercase tracking-wider border-b border-[#ff7a00]/20">
              <tr>
                {caseExam.dataset.columns.map((col, cIdx) => (
                  <th key={cIdx} className="p-3.5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-mono">
              {caseExam.dataset.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#ff7a00]/5 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3.5 text-slate-800 font-medium">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guided Steps */}
      <div className="mb-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <h3 className="text-xs font-black text-[#ff7a00] uppercase tracking-widest mb-4">
          {language === 'tr' ? 'Adım Adım Yol Haritası (Guided Steps)' : 'Step-by-Step Guided Roadmap'}
        </h3>
        <div className="space-y-3">
          {caseExam.guidedSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed"
            >
              {getLocalized(step, language)}
            </div>
          ))}
        </div>
      </div>

      {/* Solution Questions */}
      {caseExam.solutionQuestions && caseExam.solutionQuestions.length > 0 && (
        <div className="my-8 space-y-6">
          <div className="flex items-center space-x-2.5 text-[#ff7a00] mb-2">
            <HelpCircle className="w-5 h-5 stroke-[2.2] text-[#ff7a00]" />
            <h3 className="text-xs font-black uppercase tracking-widest">
              {language === 'tr' ? 'Vaka Çözüm Soruları' : 'Case Solution Questions'}
            </h3>
          </div>

          {caseExam.solutionQuestions.map((q) => {
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
                <p className="text-base font-extrabold text-slate-900 mb-4">
                  {getLocalized(q.prompt, language)}
                </p>

                {/* Multiple Choice */}
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

                {/* Numeric */}
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

                {/* Submit button */}
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
                          <span>{language === 'tr' ? 'Doğru Çözüm!' : 'Correct Solution!'}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-rose-600" />
                          <span>
                            {language === 'tr'
                              ? `Doğru Cevap: ${q.correctAnswer}`
                              : `Correct Answer: ${q.correctAnswer}`}
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

      {/* Expected Approach Box (Reveals upon finishing or clicking toggle) */}
      {(showExpectedApproach || isCompleted) && (
        <div className="my-8 p-6 rounded-3xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 shadow-xs animate-fade-in">
          <div className="flex items-center space-x-2 text-[#ff7a00] mb-3">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2] text-[#ff7a00]" />
            <h3 className="text-base font-extrabold text-slate-900">
              {language === 'tr' ? 'Örnek Yönetici Özet Yaklaşımı (Expected Approach)' : 'Executive Summary Approach'}
            </h3>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {getLocalized(caseExam.expectedApproach, language)}
          </p>
        </div>
      )}

      {/* Finish Case Exam Action Banner */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#ff7a00] flex items-center justify-center text-white shadow-lg shadow-[#ff7a00]/20">
          <Trophy className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">
          {isCompleted
            ? language === 'tr' ? 'Vaka Sınavını Harika Bir Şekilde Tamamladın!' : 'Case Exam Successfully Completed!'
            : language === 'tr' ? 'Case Exam’i Tamamla & XP Kazan' : 'Complete Case Exam & Earn XP'}
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          {language === 'tr'
            ? 'Vaka sınavını başarıyla tamamlayarak +50 XP kazandın.'
            : 'Completed the case exam to earn +50 XP.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* First Time Completion Trigger */}
          {!isCompleted && (
            <button
              onClick={() => {
                completeCaseExam(caseExam.id, module.id, 50);
                setIsCompleted(true);
                setShowExpectedApproach(true);
                triggerConfetti();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-[#ff7a00]/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{language === 'tr' ? 'Vaka Sınavını Tamamla (+50 XP)' : 'Complete Case Exam (+50 XP)'}</span>
            </button>
          )}

          {/* Next Topic Button */}
          {nextTopic && (
            <button
              onClick={() => {
                if (!isCompleted) {
                  completeCaseExam(caseExam.id, module.id, 50);
                  setIsCompleted(true);
                }
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
            onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(caseExam.id) : onBack())}
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

          {!showExpectedApproach && (
            <button
              onClick={() => setShowExpectedApproach(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4 text-[#ff7a00]" />
              <span>{language === 'tr' ? 'Yönetici Özetini Gör' : 'Show Approach'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
