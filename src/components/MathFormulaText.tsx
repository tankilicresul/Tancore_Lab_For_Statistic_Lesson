import React from 'react';
import { KatexFormula } from './KatexFormula';

interface MathFormulaTextProps {
  text: string;
  className?: string;
  darkBg?: boolean;
  inline?: boolean;
}

export const MathFormulaText: React.FC<MathFormulaTextProps> = ({
  text,
  className = '',
  darkBg = false,
  inline = false,
}) => {
  if (!text || typeof text !== 'string') return null;

  // Normalize standard LaTeX \[...\] to $$...$$ and \(...\) to $...$
  const normalizedText = text
    .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
    .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

  if (inline) {
    return <InlineMathParser text={normalizedText} className={className} darkBg={darkBg} />;
  }

  // Process block formulas ($$...$$) first
  const blockRegex = /\$\$([\s\S]*?)\$\$/g;
  
  if (!blockRegex.test(normalizedText)) {
    // No block formulas, parse inline formulas
    return <InlineMathParser text={normalizedText} className={className} darkBg={darkBg} />;
  }

  // Reset regex index
  blockRegex.lastIndex = 0;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(normalizedText)) !== null) {
    const matchIndex = match.index;
    const formulaContent = match[1].trim();

    if (matchIndex > lastIndex) {
      const textChunk = normalizedText.substring(lastIndex, matchIndex);
      elements.push(
        <InlineMathParser key={`text-${lastIndex}`} text={textChunk} darkBg={darkBg} />
      );
    }

    if (formulaContent) {
      elements.push(
        <div
          key={`block-${matchIndex}`}
          className={`my-2.5 sm:my-3 py-2 px-2 sm:px-3 text-center overflow-x-auto max-w-full touch-pan-x rounded-2xl bg-slate-50/70 border border-slate-100/80 scrollbar-thin ${
            darkBg ? 'text-amber-300' : 'text-slate-900'
          }`}
        >
          <KatexFormula formula={formulaContent} displayMode={true} />
        </div>
      );
    }

    lastIndex = matchIndex + match[0].length;
    if (match.index === blockRegex.lastIndex) {
      blockRegex.lastIndex++;
    }
  }

  if (lastIndex < normalizedText.length) {
    const textChunk = normalizedText.substring(lastIndex);
    elements.push(
      <InlineMathParser key={`text-${lastIndex}`} text={textChunk} darkBg={darkBg} />
    );
  }

  return <div className={`space-y-2 ${className}`}>{elements}</div>;
};

const InlineMathParser: React.FC<{ text: string; className?: string; darkBg?: boolean }> = ({
  text,
  className = '',
  darkBg = false,
}) => {
  if (!text) return null;

  const inlineRegex = /\$([^$\n]+)\$/g;
  if (!inlineRegex.test(text)) {
    return <LegacyMathParser text={text} className={className} darkBg={darkBg} />;
  }

  inlineRegex.lastIndex = 0;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const formulaContent = match[1].trim();

    if (matchIndex > lastIndex) {
      const textChunk = text.substring(lastIndex, matchIndex);
      elements.push(
        <LegacyMathParser key={`chunk-${lastIndex}`} text={textChunk} darkBg={darkBg} />
      );
    }

    if (formulaContent) {
      elements.push(
        <span
          key={`inline-${matchIndex}`}
          className={`inline-block align-baseline mx-0.5 font-normal max-w-full overflow-x-auto touch-pan-x whitespace-nowrap ${
            darkBg ? 'text-amber-300' : 'text-inherit'
          }`}
        >
          <KatexFormula formula={formulaContent} displayMode={false} />
        </span>
      );
    }

    lastIndex = matchIndex + match[0].length;
    if (match.index === inlineRegex.lastIndex) {
      inlineRegex.lastIndex++;
    }
  }

  if (lastIndex < text.length) {
    const textChunk = text.substring(lastIndex);
    elements.push(
      <LegacyMathParser key={`chunk-${lastIndex}`} text={textChunk} darkBg={darkBg} />
    );
  }

  return <span className={className}>{elements}</span>;
};

const LegacyMathParser: React.FC<{ text: string; className?: string; darkBg?: boolean }> = ({
  text,
  className = '',
  darkBg = false,
}) => {
  if (!text) return null;

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
          className="inline-flex items-center align-baseline mx-1 font-normal"
        >
          <span className="text-xs font-bold text-slate-500 mr-1 font-sans">
            {label}
          </span>
          <KatexFormula formula={formulaContent} displayMode={false} />
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
          className={`inline-block align-baseline mx-0.5 font-normal ${
            darkBg ? 'text-amber-300' : 'text-slate-900'
          }`}
        >
          <KatexFormula formula={standaloneEquation} displayMode={false} />
        </span>
      );
      if (trailingDot) {
        parts.push(trailingDot);
      }
    }

    lastIndex = matchIndex + matchedFull.length;
    if (match.index === combinedRegex.lastIndex) {
      combinedRegex.lastIndex++;
    }
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  if (parts.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return <span className={className}>{parts}</span>;
};
