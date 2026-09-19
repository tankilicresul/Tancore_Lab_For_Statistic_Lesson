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

    return (
      <span
        className={`inline-block align-middle max-w-full overflow-x-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (err) {
    return <span className={`font-mono text-sm font-bold ${className}`}>{formula}</span>;
  }
};
