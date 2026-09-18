import React, { useState } from 'react';
import { CaseExam, Module } from '../types/stats';
import { getLocalized } from '../utils/localization';
import { useAppStore } from '../store/useAppStore';
import { getNextTopicItem } from '../data/modules';
import { MathFormulaText } from '../components/MathFormulaText';
import { ArrowLeft, Trophy, CheckCircle2, Table, HelpCircle, Eye, AlertCircle, ArrowRight, Home, RefreshCw, PartyPopper, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';

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
  const [isNextLoading, setIsNextLoading] = useState<boolean>(false);

  const nextTopic = getNextTopicItem(caseExam.id);

  const handleNextTopicClick = () => {
    if (isNextLoading || !nextTopic) return;
    setIsNextLoading(true);

    setTimeout(() => {
      if (onSelectNextTopic) {
        onSelectNextTopic(nextTopic.id, nextTopic.type);
      }
      setIsNextLoading(false);
    }, 2000);
  };

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
    setSubmittedQuestions((prev) => ({ ...prev, [qId]: true }));
    const q = caseExam.solutionQuestions?.find((item) => item.id === qId);
    const userAnswer = selectedAnswers[qId];
    const isCorrect =
      q &&
      (typeof q.correctAnswer === 'number'
        ? (() => {
            const normalizedStr = String(userAnswer).replace(',', '.').trim();
            const parsed = parseFloat(normalizedStr);
            return !isNaN(parsed) && Math.abs(parsed - q.correctAnswer) <= 0.01;
          })()
        : String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase());

    if (isCorrect || !q) {
      soundService.playCorrect();
      completeCaseExam(caseExam.id, module.id, 50);
      setIsCompleted(true);
      setShowExpectedApproach(true);
      triggerConfetti();
    } else {
      soundService.playWrong();
    }
  };

  const handleFinishCase = () => {
    soundService.playCorrect();
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
      <div className="flex flex-col xs:flex-row gap-2.5 xs:items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs transition-colors shrink-0 self-start xs:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-[#ff7a00]" />
          <span className="whitespace-nowrap">{language === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
        </button>

        <div className="flex items-center space-x-2 shrink-0 self-start xs:self-auto">
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs font-extrabold text-[#ff7a00] bg-[#ff7a00]/10 px-3 py-1.5 rounded-full border border-[#ff7a00]/30 max-w-full">
            <span className="whitespace-nowrap">{getLocalized(module.title, language)}</span>
          </div>
          <span className={`text-[11px] sm:text-xs font-black uppercase px-3 py-1 rounded-full border tracking-wider ${difficultyColor}`}>
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
        <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          <MathFormulaText text={getLocalized(caseExam.businessQuestion, language)} />
        </div>
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
                  <th key={cIdx} className="p-3.5 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-mono">
              {caseExam.dataset.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#ff7a00]/5 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3.5 text-slate-800 font-medium whitespace-nowrap">
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
              <MathFormulaText text={getLocalized(step, language)} />
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
                <div className="text-base font-medium text-[#ff7a00] mb-4 leading-snug">
                  <MathFormulaText text={getLocalized(q.prompt, language)} />
                </div>

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
                          <MathFormulaText text={optText} />
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
                    className="px-6 py-3.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#ff7a00]/20 flex items-center space-x-2"
                  >
                    <span>{language === 'tr' ? 'Kontrol Et (+50 XP)' : 'Check Answer (+50 XP)'}</span>
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

      {/* Expected Approach Box (Reveals upon finishing or clicking toggle) */}
      {(showExpectedApproach || isCompleted) && (
        <div id="expected-approach-section" className="my-8 p-6 rounded-3xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 shadow-xs animate-fade-in">
          <div className="flex items-center space-x-2 text-[#ff7a00] mb-3">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2] text-[#ff7a00]" />
            <h3 className="text-base font-extrabold text-slate-900">
              {language === 'tr' ? 'Örnek Yönetici Özet Yaklaşımı (Expected Approach)' : 'Executive Summary Approach'}
            </h3>
          </div>
          <div className="text-sm text-slate-800 leading-relaxed font-medium">
            <MathFormulaText text={getLocalized(caseExam.expectedApproach, language)} />
          </div>
        </div>
      )}

      {/* Finish Case Exam Action Banner */}
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
            ? language === 'tr' ? 'Vaka Sınavını Başarıyla Tamamladın!' : 'Case Exam Successfully Completed!'
            : language === 'tr' ? "Case Exam'i Tamamla & XP Kazan" : 'Complete Case Exam & Earn XP'}
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          {isCompleted
            ? language === 'tr'
              ? 'Vaka sınavını başarıyla tamamlayarak +50 XP kazandınız.'
              : 'Successfully completed the case exam and earned +50 XP.'
            : language === 'tr'
              ? 'Vaka sınavındaki soruları yanıtlayarak +50 XP kazanabilirsin.'
              : 'Answer the questions in the case exam to earn +50 XP.'}
        </p>

        {/* Action Buttons Group: Ana Sayfa - Yönetici Özeti - Sıradaki Konu */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* 1. Back to Home */}
          <button
            onClick={() => (onBackToHomeWithScroll ? onBackToHomeWithScroll(caseExam.id) : onBack())}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs tracking-wide border border-slate-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4 text-[#ff7a00]" />
            <span>{language === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
          </button>

          {/* 2. Yönetici Özeti */}
          <button
            onClick={() => {
              setShowExpectedApproach(true);
              setTimeout(() => {
                const elem = document.getElementById('expected-approach-section');
                if (elem) {
                  elem.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
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
