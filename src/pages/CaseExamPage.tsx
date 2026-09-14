import React, { useState } from 'react';
import { CaseExam, Module } from '../types/stats';
import { getLocalized } from '../utils/localization';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Trophy, CheckCircle2, Table, HelpCircle, Eye, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaseExamPageProps {
  caseExam: CaseExam;
  module: Module;
  onBack: () => void;
}

export const CaseExamPage: React.FC<CaseExamPageProps> = ({ caseExam, module, onBack }) => {
  const { language, completeCaseExam, completedCaseExams } = useAppStore();

  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<{ [questionId: string]: boolean }>({});
  const [showExpectedApproach, setShowExpectedApproach] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(completedCaseExams.includes(caseExam.id));

  const difficultyColor =
    caseExam.difficulty === 'kolay'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : caseExam.difficulty === 'orta'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

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
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-white bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'tr' ? 'Modül Listesine Dön' : 'Back to Modules'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${difficultyColor}`}>
            {caseExam.difficulty}
          </span>
        </div>
      </div>

      {/* Case Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-400 mb-2">
          <Trophy className="w-4 h-4" />
          <span>{language === 'tr' ? 'Şirket Vaka Sınavı (Case Exam)' : 'Company Case Exam'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          {getLocalized(caseExam.title, language)}
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full" />
      </div>

      {/* Business Question Box */}
      <div className="mb-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-2">
          {language === 'tr' ? 'İş Vakası & Problem Tanımı' : 'Business Question & Case Problem'}
        </h3>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
          {getLocalized(caseExam.businessQuestion, language)}
        </p>
      </div>

      {/* Dataset Preview Table */}
      <div className="mb-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 text-indigo-400 mb-4">
          <Table className="w-5 h-5" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            {language === 'tr' ? 'Vaka Veri Seti' : 'Case Dataset'}
          </h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-indigo-300 font-extrabold uppercase tracking-wider border-b border-slate-800">
              <tr>
                {caseExam.dataset.columns.map((col, cIdx) => (
                  <th key={cIdx} className="p-3.5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-mono">
              {caseExam.dataset.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3.5 text-slate-200">
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
      <div className="mb-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <h3 className="text-sm font-extrabold text-indigo-400 uppercase tracking-wider mb-4">
          {language === 'tr' ? 'Adım Adım Yol Haritası (Guided Steps)' : 'Step-by-Step Guided Roadmap'}
        </h3>
        <div className="space-y-3">
          {caseExam.guidedSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 font-medium"
            >
              {getLocalized(step, language)}
            </div>
          ))}
        </div>
      </div>

      {/* Solution Questions */}
      {caseExam.solutionQuestions && caseExam.solutionQuestions.length > 0 && (
        <div className="my-8 space-y-6">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">
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
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl"
              >
                <p className="text-base font-bold text-white mb-4">
                  {getLocalized(q.prompt, language)}
                </p>

                {/* Multiple Choice */}
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
                              ? 'bg-amber-600/30 border-amber-500 text-white shadow-lg'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
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
                      className="w-full sm:w-64 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Submit button */}
                {!isSubmitted ? (
                  <button
                    disabled={userAnswer === undefined || String(userAnswer).trim() === ''}
                    onClick={() => handleAnswerSubmit(q.id)}
                    className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-sm transition-colors"
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
                          <span>{language === 'tr' ? 'Doğru Çözüm!' : 'Correct Solution!'}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-rose-400" />
                          <span>
                            {language === 'tr'
                              ? `Doğru Cevap: ${q.correctAnswer}`
                              : `Correct Answer: ${q.correctAnswer}`}
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

      {/* Expected Approach Box (Reveals upon finishing or clicking toggle) */}
      {(showExpectedApproach || isCompleted) && (
        <div className="my-8 p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/40 shadow-2xl animate-fade-in">
          <div className="flex items-center space-x-2 text-emerald-400 mb-3">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-base font-extrabold">
              {language === 'tr' ? 'Örnek Yönetici Özet Yaklaşımı (Expected Approach)' : 'Executive Summary Approach'}
            </h3>
          </div>
          <p className="text-sm text-emerald-100 leading-relaxed font-medium">
            {getLocalized(caseExam.expectedApproach, language)}
          </p>
        </div>
      )}

      {/* Finish Case Exam Action Banner */}
      <div className="mt-10 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <Trophy className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-extrabold text-white mb-1">
          {isCompleted
            ? language === 'tr' ? 'Bu Case Exam’i Tamamladın!' : 'Case Exam Completed!'
            : language === 'tr' ? 'Case Exam’i Tamamla & Yeni Modül Kilidini Aç' : 'Complete Case Exam & Unlock Next Module'}
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          {language === 'tr'
            ? 'Vaka sınavını başarıyla tamamlayarak +50 XP kazanın ve sonraki modülün kilidini açın.'
            : 'Complete the case exam to earn +50 XP and unlock the next module.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleFinishCase}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isCompleted
                ? language === 'tr' ? 'Tamamlandı (Tekrar İncele)' : 'Completed (Review)'
                : language === 'tr' ? 'Vaka Sınavını Tamamla (+50 XP)' : 'Complete Case Exam (+50 XP)'}
            </span>
          </button>

          {!showExpectedApproach && (
            <button
              onClick={() => setShowExpectedApproach(true)}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>{language === 'tr' ? 'Yönetici Özetini Gör' : 'Show Approach'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
