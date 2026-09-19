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

  // Split by newlines so lists and separate rules are formatted as clean blocks
  const lines = normalizedText.split(/\r?\n/);
  if (lines.length > 1) {
    return (
      <div className={`space-y-3 ${className}`}>
        {lines.map((line, lineIdx) => {
          if (!line.trim()) return <div key={lineIdx} className="h-1" />;
          return (
            <div key={lineIdx} className="leading-relaxed">
              <ParagraphMathParser text={line} darkBg={darkBg} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`leading-relaxed ${className}`}>
      <ParagraphMathParser text={normalizedText} darkBg={darkBg} />
    </div>
  );
};

const ParagraphMathParser: React.FC<{ text: string; darkBg?: boolean }> = ({ text, darkBg = false }) => {
  if (!text) return null;

  const blockRegex = /\$\$([\s\S]*?)\$\$/g;
  if (!blockRegex.test(text)) {
    return <InlineMathParser text={text} darkBg={darkBg} />;
  }

  blockRegex.lastIndex = 0;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const formulaContent = match[1].trim();

    if (matchIndex > lastIndex) {
      const textChunk = text.substring(lastIndex, matchIndex);
      if (textChunk.trim()) {
        elements.push(
          <InlineMathParser key={`text-${lastIndex}`} text={textChunk} darkBg={darkBg} />
        );
      }
    }

    if (formulaContent) {
      elements.push(
        <div
          key={`block-${matchIndex}`}
          className={`my-3 py-3 px-4 text-center overflow-x-auto max-w-full touch-pan-x rounded-2xl border shadow-2xs scrollbar-none ${
            darkBg
              ? 'bg-slate-800/80 border-slate-700/80 text-amber-300'
              : 'bg-slate-50/90 border-slate-200/90 text-slate-900'
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

  if (lastIndex < text.length) {
    const textChunk = text.substring(lastIndex);
    if (textChunk.trim()) {
      elements.push(
        <InlineMathParser key={`text-${lastIndex}`} text={textChunk} darkBg={darkBg} />
      );
    }
  }

  return <>{elements}</>;
};

const InlineMathParser: React.FC<{ text: string; className?: string; darkBg?: boolean }> = ({
  text,
  className = '',
  darkBg = false,
}) => {
  if (!text) return null;

  const inlineRegex = /\$([^$\n]+)\$/g;
  if (!inlineRegex.test(text)) {
    return <MarkdownTextParser text={text} className={className} darkBg={darkBg} />;
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
        <MarkdownTextParser key={`chunk-${lastIndex}`} text={textChunk} darkBg={darkBg} />
      );
    }

    if (formulaContent) {
      elements.push(
        <span
          key={`inline-${matchIndex}`}
          className={`inline-flex items-center align-baseline mx-0.5 font-normal ${
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
      <MarkdownTextParser key={`chunk-${lastIndex}`} text={textChunk} darkBg={darkBg} />
    );
  }

  return <span className={className}>{elements}</span>;
};

const MarkdownTextParser: React.FC<{ text: string; className?: string; darkBg?: boolean }> = ({
  text,
  className = '',
  darkBg = false,
}) => {
  if (!text) return null;

  // Check for bold markdown (**bold**)
  const boldRegex = /\*\*([^*]+)\*\*/g;
  if (!boldRegex.test(text)) {
    return <LegacyMathParser text={text} className={className} darkBg={darkBg} />;
  }

  boldRegex.lastIndex = 0;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const boldContent = match[1];

    if (matchIndex > lastIndex) {
      const textChunk = text.substring(lastIndex, matchIndex);
      elements.push(
        <LegacyMathParser key={`plain-${lastIndex}`} text={textChunk} darkBg={darkBg} />
      );
    }

    elements.push(
      <strong
        key={`bold-${matchIndex}`}
        className={`font-black tracking-tight ${darkBg ? 'text-white' : 'text-slate-900'}`}
      >
        {boldContent}
      </strong>
    );

    lastIndex = matchIndex + match[0].length;
    if (match.index === boldRegex.lastIndex) {
      boldRegex.lastIndex++;
    }
  }

  if (lastIndex < text.length) {
    const textChunk = text.substring(lastIndex);
    elements.push(
      <LegacyMathParser key={`plain-${lastIndex}`} text={textChunk} darkBg={darkBg} />
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
          className={`inline-flex items-center align-baseline mx-0.5 font-normal ${
            darkBg ? 'text-amber-300' : 'text-inherit'
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
