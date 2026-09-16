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

  // 1. Split block formulas $$ ... $$
  if (text.includes('$$')) {
    const blockParts = text.split(/(\$\$[\s\S]*?\$\$)/g);
    return (
      <div className={`space-y-2 ${className}`}>
        {blockParts.map((part, idx) => {
          if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
            const rawFormula = part.slice(2, -2).trim();
            return (
              <div
                key={idx}
                className={`my-3 p-3.5 sm:p-4 rounded-2xl text-center overflow-x-auto max-w-full touch-pan-x shadow-2xs border ${
                  darkBg
                    ? 'bg-slate-800/95 text-amber-300 border-slate-700'
                    : 'bg-orange-500/5 text-slate-900 border-orange-200/80'
                }`}
              >
                <KatexFormula formula={rawFormula} displayMode={true} />
              </div>
            );
          }
          return <MathFormulaText key={idx} text={part} darkBg={darkBg} />;
        })}
      </div>
    );
  }

  // 2. Split inline formulas $ ... $
  if (text.includes('$')) {
    const inlineParts = text.split(/(\$[^$\n]+\$)/g);
    return (
      <span className={className}>
        {inlineParts.map((part, idx) => {
          if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
            const rawFormula = part.slice(1, -1).trim();
            return (
              <span
                key={idx}
                className={`inline-block align-baseline mx-0.5 px-1.5 py-0.5 rounded-md border text-sm transition-all ${
                  darkBg
                    ? 'bg-slate-800/90 text-amber-300 border-slate-700/80 font-bold'
                    : 'bg-orange-500/10 text-orange-950 border-orange-300/50 font-bold'
                }`}
              >
                <KatexFormula formula={rawFormula} displayMode={false} />
              </span>
            );
          }
          return <MathFormulaLegacyParser key={idx} text={part} darkBg={darkBg} />;
        })}
      </span>
    );
  }

  return <MathFormulaLegacyParser text={text} className={className} darkBg={darkBg} />;
};

/**
 * Fallback parser for plain text containing legacy equation syntax or "Formül: ..." labels
 */
const MathFormulaLegacyParser: React.FC<{ text: string; className?: string; darkBg?: boolean }> = ({
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
