import React from 'react';
import { VocabTerm } from '../types/stats';
import { BookOpen, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface VocabBoxProps {
  terms: VocabTerm[];
}

export const VocabBox: React.FC<VocabBoxProps> = ({ terms }) => {
  const { language } = useAppStore();

  if (!terms || terms.length === 0) return null;

  return (
    <div className="my-6 p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-1.5">
            <span>{language === 'tr' ? 'İngilizce Terim Kutusu' : 'English Vocabulary Box'}</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </h4>
          <p className="text-xs text-indigo-300/70">
            {language === 'tr'
              ? 'Küresel istatistik ve veri analitiği terminolojisi'
              : 'Global statistics & analytics terminology'}
          </p>
        </div>
      </div>

      {/* Terms list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {terms.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors"
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-sm font-extrabold text-indigo-300 font-mono tracking-wide">
                {item.term_en}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                EN Term
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              <strong className="text-slate-400 font-semibold">{language === 'tr' ? 'Açıklama: ' : 'Meaning: '}</strong>
              {language === 'tr' ? item.explanation_tr : item.explanation_en}
            </p>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-indigo-200/90 italic font-mono">
              "{item.exampleSentence_en}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
