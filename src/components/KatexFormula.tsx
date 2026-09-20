import React from 'react';
import katex from 'katex';
import { toLatexFormula } from '../utils/formulaExtractor';

interface KatexFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export const KatexFormula: React.FC<KatexFormulaProps> = ({
  formula,
  displayMode = true,
  className = '',
}) => {
  if (!formula) return null;

  const latex = toLatexFormula(formula);

  try {
    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
    });

    if (displayMode) {
      return (
        <div
          className={`block text-center max-w-full overflow-x-auto overflow-y-hidden py-1 touch-pan-x scrollbar-none ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    return (
      <span
        className={`inline-flex items-center align-baseline font-normal max-w-full overflow-x-auto overflow-y-hidden touch-pan-x ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (err) {
    return <span className={`font-mono text-sm font-bold max-w-full overflow-x-auto ${className}`}>{formula}</span>;
  }
};
