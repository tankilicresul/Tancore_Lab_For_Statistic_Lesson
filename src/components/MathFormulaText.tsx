import React from 'react';
import { KatexFormula } from './KatexFormula';

interface MathFormulaTextProps {
  text: string;
  className?: string;
  darkBg?: boolean;
}

export const MathFormulaText: React.FC<MathFormulaTextProps> = ({
  text,
  className = '',
  darkBg = false,
}) => {
  if (!text) return null;

  // Pattern 1: Explicit "Formül: ..." or "Formula: ..."
  // Pattern 2: Standalone equations like P(Fraud) = 0.05, P(A|B) = [P(B|A) * P(A)] / P(B), SE = σ / √n, Z = (X - µ) / σ, etc.
  const combinedRegex = /(Formül:|Formula:)\s*([^.!\n]+[.!]?)|(\b(?:P\([^\)]+\)|SE|Z|C\([^\)]+\)|N\([^\)]+\)|ŷ|E\(X\)|Var\(X\)|IQR|PDF|CDF|s²|F|Y)\s*[\=\:\≈]\s*[^.!\n;\?]+)/gi;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchedFull = match[0];
    const isExplicitFormula = !!match[1];
    const label = match[1];
    const formulaContent = match[2];
    let standaloneEquation = match[3];

    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    if (isExplicitFormula && formulaContent) {
      parts.push(
        <span
          key={`f-${matchIndex}`}
          className={`inline-flex items-center align-middle mx-1 my-0.5 px-2.5 py-1 rounded-xl border shadow-2xs font-sans text-xs font-bold leading-none transition-all ${
            darkBg
              ? 'bg-slate-800/95 text-amber-400 border-slate-700/90'
              : 'bg-orange-500/10 text-[#ff7a00] border-[#ff7a00]/35'
          }`}
        >
          <span className="text-[10px] uppercase font-black tracking-wider opacity-90 mr-1.5 font-sans px-1.5 py-0.5 rounded bg-[#ff7a00]/20 text-[#ff7a00] shrink-0">
            {label.replace(':', '')}
          </span>
          <KatexFormula formula={formulaContent} displayMode={false} className="text-[#ff7a00]" />
        </span>
      );
    } else if (standaloneEquation) {
      let trailingDot = '';
      if (standaloneEquation.endsWith('.')) {
        standaloneEquation = standaloneEquation.slice(0, -1).trim();
        trailingDot = '.';
      }
      parts.push(
        <span
          key={`eq-${matchIndex}`}
          className={`inline-flex items-center align-middle mx-1 my-0.5 px-2 py-1 rounded-lg border font-sans text-xs font-extrabold transition-all ${
            darkBg
              ? 'bg-slate-800 text-amber-400 border-slate-700'
              : 'bg-orange-500/10 text-[#ff7a00] border-[#ff7a00]/30 shadow-2xs'
          }`}
        >
          <KatexFormula formula={standaloneEquation} displayMode={false} className="text-[#ff7a00]" />
        </span>
      );
      if (trailingDot) {
        parts.push(trailingDot);
      }
    }

    lastIndex = matchIndex + matchedFull.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  if (parts.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return <span className={className}>{parts}</span>;
};
