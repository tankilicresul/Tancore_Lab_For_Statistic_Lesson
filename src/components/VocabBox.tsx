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
    <div className="my-6 p-6 rounded-3xl bg-amber-500/5 border border-amber-200/80 shadow-xs relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-4 relative z-10">
        <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-700 border border-amber-500/30">
          <BookOpen className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h4 className="text-base font-extrabold text-slate-900 tracking-wide flex items-center gap-2">
            <span>{language === 'tr' ? 'İngilizce Terim Kutusu' : 'English Vocabulary Box'}</span>
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </h4>
          <p className="text-xs text-slate-600 font-medium">
            {language === 'tr'
              ? 'Küresel istatistik ve veri analitiği terminolojisi'
              : 'Global statistics & analytics terminology'}
          </p>
        </div>
      </div>

      {/* Terms list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {terms.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-amber-200/60 hover:border-amber-400 transition-colors shadow-xs"
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-black text-amber-700 font-mono tracking-wider">
                {item.term_en}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                EN Term
              </span>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed mb-2.5 font-medium">
              <strong className="text-amber-800 font-bold">{language === 'tr' ? 'Açıklama: ' : 'Meaning: '}</strong>
              {language === 'tr' ? item.explanation_tr : item.explanation_en}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-mono italic leading-normal">
              "{item.exampleSentence_en}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
