import React, { useState } from 'react';
import { PLACEMENT_QUESTIONS, PlacementQuestion } from '../data/placementQuestions';
import { ALL_MODULES } from '../data/modules';
import { useAppStore } from '../store/useAppStore';
import { getLocalized } from '../utils/localization';
import { MathFormulaText } from '../components/MathFormulaText';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
  BookOpen,
  ArrowLeft,
  Zap,
  Check,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlacementTestPageProps {
  onBackToHome: (targetNodeId?: string) => void;
}

export const PlacementTestPage: React.FC<PlacementTestPageProps> = ({ onBackToHome }) => {
  const { language, unlockUpToModule } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [customModuleId, setCustomModuleId] = useState<string>('module-1');

  const currentQuestion = PLACEMENT_QUESTIONS[currentIndex];

  const handleSelectOption = (optionText: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionText,
    }));
  };

  const handleNext = () => {
    if (currentIndex < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all 10 diagnostic questions
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setShowConfirmationModal(true);
    }
  };

  // Calculate score & recommended module placement
  let correctAnswersCount = 0;
  PLACEMENT_QUESTIONS.forEach((q) => {
    const selected = selectedAnswers[q.id];
    if (!selected) return;

    if (selected === q.correctAnswer) {
      correctAnswersCount++;
    } else if (q.options) {
      const matchedOpt = q.options.find(
        (opt) => (typeof opt === 'string' ? opt : getLocalized(opt, language)) === selected
      );
      if (matchedOpt) {
        const trVal = typeof matchedOpt === 'string' ? matchedOpt : matchedOpt.tr;
        const enVal = typeof matchedOpt === 'string' ? matchedOpt : matchedOpt.en;
        if (q.correctAnswer === trVal || q.correctAnswer === enVal) {
          correctAnswersCount++;
        }
      }
    }
  });

  const getRecommendedModule = (score: number) => {
    if (score <= 1) return ALL_MODULES.find((m) => m.id === 'module-13') || ALL_MODULES[0];
    if (score <= 3) return ALL_MODULES.find((m) => m.id === 'module-2') || ALL_MODULES[1];
    if (score <= 5) return ALL_MODULES.find((m) => m.id === 'module-14') || ALL_MODULES[2];
    if (score <= 7) return ALL_MODULES.find((m) => m.id === 'module-3') || ALL_MODULES[3];
    if (score <= 9) return ALL_MODULES.find((m) => m.id === 'module-15') || ALL_MODULES[4];
    return ALL_MODULES.find((m) => m.id === 'module-12') || ALL_MODULES[11];
  };

  const recommendedModule = getRecommendedModule(correctAnswersCount);

  const handleConfirmPlacement = (targetModId: string) => {
    unlockUpToModule(targetModId);
    const mod = ALL_MODULES.find((m) => m.id === targetModId);
    const firstLessonId = mod?.lessons[0]?.id;
    onBackToHome(firstLessonId);
  };

  const currentAnswer = selectedAnswers[currentQuestion.id];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onBackToHome()}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#ff7a00]/15 text-[#ff7a00] rounded-full border border-[#ff7a00]/30 text-xs font-black">
          <Sparkles className="w-4 h-4" />
          <span>{language === 'tr' ? 'Seviye Belirleme Sınavı' : 'Placement Assessment'}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Progress Bar Top */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-500">
            <span>
              {language === 'tr'
                ? `Soru ${currentIndex + 1} / ${PLACEMENT_QUESTIONS.length}`
                : `Question ${currentIndex + 1} of ${PLACEMENT_QUESTIONS.length}`}
            </span>
            <span className="text-[#ff7a00] font-black">
              {getLocalized(currentQuestion.topicTitle, language)}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff7a00] rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / PLACEMENT_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Prompt */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug tracking-tight">
            <MathFormulaText text={getLocalized(currentQuestion.prompt, language)} />
          </h2>
        </div>

        {/* Answer Options List */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options?.map((opt, oIdx) => {
            const optText = typeof opt === 'string' ? opt : getLocalized(opt, language);
            const isSelected = currentAnswer === optText;

            return (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(optText)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#ff7a00]/10 border-[#ff7a00] text-slate-900 shadow-md shadow-[#ff7a00]/10'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      isSelected
                        ? 'bg-[#ff7a00] text-white'
                        : 'bg-white border border-slate-300 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </div>
                  <span className="font-extrabold text-sm sm:text-base leading-snug">
                    <MathFormulaText text={optText} />
                  </span>
                </div>
                {isSelected && <Check className="w-5 h-5 text-[#ff7a00] stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Next / Submit Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className={`flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-md ${
              currentAnswer
                ? 'bg-[#ff7a00] hover:bg-[#e66e00] text-white shadow-[#ff7a00]/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>
              {currentIndex < PLACEMENT_QUESTIONS.length - 1
                ? language === 'tr' ? 'Sonraki Soru' : 'Next Question'
                : language === 'tr' ? 'Sınavı Tamamla' : 'Finish Test'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Explicit User Confirmation & Level Placement Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header Badge */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#ff7a00]/15 border border-[#ff7a00]/30 text-[#ff7a00] shadow-sm mb-1">
                <Trophy className="w-8 h-8 stroke-[2]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {language === 'tr' ? 'Seviye Belirleme Tamamlandı!' : 'Placement Assessment Complete!'}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {language === 'tr'
                  ? 'Teşhis sorularına verdiğiniz yanıtlar analiz edildi.'
                  : 'Your diagnostic exam responses have been evaluated.'}
              </p>
            </div>

            {/* Score & Recommended Level Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4 mb-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {language === 'tr' ? 'Test Sonucunuz' : 'Your Test Score'}
                </span>
                <span className="text-lg font-black text-[#ff7a00] bg-[#ff7a00]/20 px-3 py-1 rounded-full border border-[#ff7a00]/40">
                  {correctAnswersCount} / {PLACEMENT_QUESTIONS.length} {language === 'tr' ? 'Doğru' : 'Correct'}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {language === 'tr' ? 'Hesaplanan Önerilen Seviye' : 'Recommended Placement Level'}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ff7a00] text-white flex items-center justify-center font-black text-base shrink-0 shadow-md">
                    {recommendedModule.order}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white leading-tight">
                      {getLocalized(recommendedModule.title, language)}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed mt-0.5">
                      {getLocalized(recommendedModule.description, language)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Explicit Confirmation Actions ("Kişinin onayını alıp geçir") */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 text-center mb-1">
                {language === 'tr'
                  ? 'Uygulama seviyenizi güncellemek için onayınızı seçin:'
                  : 'Please select your preferred placement level:'}
              </p>

              {/* Action 1: Recommended Jump (Primary) */}
              <button
                onClick={() => handleConfirmPlacement(recommendedModule.id)}
                className="w-full py-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ff7a00]/30 transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>
                  {language === 'tr'
                    ? `Önerilen Seviyeye Atla (Modül ${recommendedModule.order})`
                    : `Jump to Level (Module ${recommendedModule.order})`}
                </span>
              </button>

              {/* Action 2: Start from Beginning */}
              <button
                onClick={() => handleConfirmPlacement('module-1')}
                className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors border border-slate-200"
              >
                {language === 'tr'
                  ? 'Sıfırdan (1. Modülden) Devam Et'
                  : 'Start from Beginning (Module 1)'}
              </button>

              {/* Action 3: Custom Level Select */}
              <div className="pt-2 flex items-center space-x-2">
                <select
                  value={customModuleId}
                  onChange={(e) => setCustomModuleId(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#ff7a00]"
                >
                  {ALL_MODULES.map((m) => (
                    <option key={m.id} value={m.id}>
                      Modül {m.order}: {getLocalized(m.title, language)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleConfirmPlacement(customModuleId)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors shrink-0"
                >
                  {language === 'tr' ? 'Seçileni Aç' : 'Unlock Selected'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
