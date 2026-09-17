import React, { useState } from 'react';
import { VocabTerm } from '../types/stats';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { MathFormulaText } from './MathFormulaText';

interface VocabBoxProps {
  terms: VocabTerm[];
}

export const VocabBox: React.FC<VocabBoxProps> = ({ terms }) => {
  const { language } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!terms || terms.length === 0) return null;

  return (
    <div className="my-6 rounded-3xl bg-[#ff7a00]/5 border border-[#ff7a00]/25 shadow-xs relative overflow-hidden font-sans transition-all">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Clickable Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left focus:outline-none group relative z-10"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide flex items-center gap-2">
              <span className="truncate">{language === 'tr' ? '5. İngilizce Terim Kutusu' : '5. English Vocabulary Box'}</span>
            </h4>
            <p className="text-xs text-slate-600 font-medium truncate">
              {language === 'tr'
                ? 'Küresel istatistik ve veri analitiği terminolojisi'
                : 'Global statistics & analytics terminology'}
            </p>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-[#ff7a00]/10 text-[#ff7a00] group-hover:bg-[#ff7a00]/20 border border-[#ff7a00]/30 shrink-0 ml-3 transition-colors flex items-center space-x-1 font-bold text-xs">
          {isOpen ? (
            <>
              <span className="hidden sm:inline">{language === 'tr' ? 'Kapat' : 'Close'}</span>
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
            </>
          ) : (
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          )}
        </div>
      </button>

      {/* Accordion Collapsible Body */}
      {isOpen && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-[#ff7a00]/20 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 animate-fade-in">
          {terms.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-[#ff7a00]/20 hover:border-[#ff7a00]/50 transition-colors shadow-xs"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-black text-[#ff7a00] font-mono tracking-wider">
                  {item.term_en}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff7a00] bg-[#ff7a00]/10 px-2 py-0.5 rounded border border-[#ff7a00]/20">
                  EN Term
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed mb-2.5 font-medium">
                <strong className="text-[#ff7a00] font-bold">{language === 'tr' ? 'Açıklama: ' : 'Meaning: '}</strong>
                <MathFormulaText text={language === 'tr' ? item.explanation_tr : item.explanation_en} />
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-mono italic leading-normal">
                "{item.exampleSentence_en}"
              </div>
            </div>
          ))}

          {/* Bottom Close Button */}
          <div className="col-span-1 md:col-span-2 flex justify-end pt-1">
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#ff7a00]/15 hover:bg-[#ff7a00]/25 text-[#ff7a00] font-bold text-xs border border-[#ff7a00]/30 transition-colors"
            >
              <span>{language === 'tr' ? 'Kapat' : 'Close'}</span>
              <ChevronUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
