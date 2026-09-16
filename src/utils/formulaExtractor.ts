import { Lesson, CaseExam } from '../types/stats';
import { getLocalized } from './localization';

export const extractTopicFormula = (
  lesson?: Lesson,
  caseExam?: CaseExam,
  language: 'tr' | 'en' = 'tr'
): string | null => {
  const textToSearch = lesson
    ? getLocalized(lesson.conceptCard, language)
    : caseExam
    ? getLocalized(caseExam.businessQuestion, language)
    : '';

  const titleText = lesson
    ? getLocalized(lesson.title, language)
    : caseExam
    ? getLocalized(caseExam.title, language)
    : '';

  // 1. Explicit "Formül: ..." or "Formula: ..." pattern in text
  if (textToSearch) {
    const matchExplicit = textToSearch.match(/(?:Formül|Formula):\s*([^.!\n]+[.!]?)/i);
    if (matchExplicit && matchExplicit[1]) {
      return matchExplicit[1].trim();
    }

    // 2. Explicit equation pattern matching (e.g. P(A|B) = [P(B|A) * P(A)] / P(B), SE = σ / √n, Z = (X - µ) / σ, etc.)
    const matchEq = textToSearch.match(
      /(\b(?:P\([^\)]+\)|SE|Z|C\([^\)]+\)|N\([^\)]+\)|ŷ|IQR|PDF|CDF|E\(X\)|Var\(X\)|s²|F|Y)\s*[\=\:\≈]\s*[^.!\n;\?]+(?:\.|\b|$))/i
    );
    if (matchEq && matchEq[1]) {
      let formulaStr = matchEq[1].trim();
      if (formulaStr.endsWith('.')) {
        formulaStr = formulaStr.slice(0, -1).trim();
      }
      return formulaStr;
    }
  }

  // 3. Check guidedSteps if present in CaseExam
  if (caseExam?.guidedSteps && caseExam.guidedSteps.length > 0) {
    for (const step of caseExam.guidedSteps) {
      const stepText = getLocalized(step, language);
      const stepMatch = stepText.match(/(?:Formül|Formula):\s*([^.!\n]+[.!]?)/i);
      if (stepMatch && stepMatch[1]) {
        return stepMatch[1].trim();
      }
    }
  }

  // 4. Primary Topic Formula Mapping for Math/Stats Lessons (Matched by Lesson Title / Primary Focus)
  const combinedTitle = titleText.toLowerCase();

  if (/ortalama|mean/i.test(combinedTitle) && !/standart/i.test(combinedTitle)) {
    return '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i';
  }
  if (/medyan|median/i.test(combinedTitle)) {
    return 'x_{\\text{medyan}} = \\text{Ortadaki Değer (Sıralı Veri)}';
  }
  if (/mod\b|mode\b/i.test(combinedTitle)) {
    return '\\text{Mod} = \\text{En Çok Tekrar Eden Değer}';
  }
  if (/varyans|variance/i.test(combinedTitle)) {
    return 's^2 = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n - 1}';
  }
  if (/standart sapma|standard deviation/i.test(combinedTitle)) {
    return 's = \\sqrt{\\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n - 1}}';
  }
  if (/standart hata|standard error/i.test(combinedTitle)) {
    return '\\text{SE} = \\frac{\\sigma}{\\sqrt{n}}';
  }
  if (/z-skor|z skoru|z score|z-score/i.test(combinedTitle)) {
    return 'Z = \\frac{X - \\mu}{\\sigma}';
  }
  if (/iqr|çeyrekler arası/i.test(combinedTitle)) {
    return '\\text{IQR} = Q_3 - Q_1';
  }
  if (/koşullu olasılık|conditional probability/i.test(combinedTitle)) {
    return 'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}';
  }
  if (/bayes/i.test(combinedTitle)) {
    return 'P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{\\sum P(B \\mid A_i) P(A_i)}';
  }
  if (/binom/i.test(combinedTitle)) {
    return 'P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}';
  }
  if (/poisson/i.test(combinedTitle)) {
    return 'P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}';
  }
  if (/geometrik|geometric/i.test(combinedTitle)) {
    return 'P(X = k) = (1-p)^{k-1} p';
  }
  if (/üstel|exponential/i.test(combinedTitle)) {
    return 'f(x) = \\lambda e^{-\\lambda x}, \\quad x \\ge 0';
  }
  if (/düzgün|uniform/i.test(combinedTitle)) {
    return 'f(x) = \\frac{1}{b - a}, \\quad a \\le x \\le b';
  }
  if (/pdf|yoğunluk|density|sürekli rastgele/i.test(combinedTitle)) {
    return 'P(a \\le X \\le b) = \\int_{a}^{b} f(x) \\, dx, \\quad \\int_{-\\infty}^{\\infty} f(x) \\, dx = 1';
  }
  if (/cdf|birikimli/i.test(combinedTitle)) {
    return 'F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(t) \\, dt';
  }
  if (/normal dağılım|normal distribution|gauss/i.test(combinedTitle)) {
    return 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^{\\!2}\\right)';
  }
  if (/beklenen değer|expected value/i.test(combinedTitle)) {
    return '\\mathbb{E}[X] = \\int_{-\\infty}^{\\infty} x \\cdot f(x) \\, dx \\quad \\text{veya} \\quad \\sum x_i P(X = x_i)';
  }
  if (/markov/i.test(combinedTitle)) {
    return '\\boldsymbol{\\pi} P = \\boldsymbol{\\pi}, \\quad \\sum_{i} \\pi_i = 1';
  }
  if (/kuyruk|queue|m\/m\/1/i.test(combinedTitle)) {
    return 'L = \\frac{\\lambda}{\\mu - \\lambda}, \\quad W = \\frac{1}{\\mu - \\lambda}';
  }
  if (/simplex|doğrusal programlama|linear programming/i.test(combinedTitle)) {
    return '\\max \\; \\mathbf{c}^T \\mathbf{x} \\quad \\text{s.t.} \\quad A\\mathbf{x} \\le \\mathbf{b}, \\; \\mathbf{x} \\ge \\mathbf{0}';
  }
  if (/korelasyon|correlation|pearson/i.test(combinedTitle)) {
    return 'r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}';
  }
  if (/regresyon|regression/i.test(combinedTitle)) {
    return 'Y = \\beta_0 + \\beta_1 X + \\epsilon';
  }
  if (/güven aralığı|confidence interval/i.test(combinedTitle)) {
    return '\\text{Güven Aralığı} = \\bar{x} \\pm t_{\\alpha/2, \\, n-1} \\cdot \\frac{s}{\\sqrt{n}}';
  }
  if (/t-test|hipotez/i.test(combinedTitle)) {
    return 't = \\frac{\\bar{X} - \\mu_0}{s / \\sqrt{n}}';
  }
  if (/f-test|anova/i.test(combinedTitle)) {
    return 'F = \\frac{\\text{MS}_{\\text{between}}}{\\text{MS}_{\\text{within}}}';
  }
  if (/ki-kare|chi-square/i.test(combinedTitle)) {
    return '\\chi^2 = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i}';
  }

  return null;
};

export const stripFormulaFromText = (text: string, formula: string | null): string => {
  if (!text || !formula) return text;

  // Remove trailing period from formula if any for flexible matching
  const cleanedFormula = formula.replace(/\.$/, '').trim();
  if (!cleanedFormula) return text;

  // Regex to match the formula and optional "Formül:" / "Formula:" / "formülü:" prefix and optional trailing period
  const escapedFormula = cleanedFormula.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const formulaRegex = new RegExp(
    `(?:(?:Formül|Formula|formülü)\\s*:?\\s*)?` + escapedFormula + `\\.?`,
    'gi'
  );

  let result = text.replace(formulaRegex, '');

  // Normalize double spaces and fix punctuation like ". ." or ": ."
  result = result
    .replace(/\s{2,}/g, ' ')
    .replace(/:\s*\./g, '.')
    .replace(/\s+\./g, '.')
    .replace(/\.\s*\./g, '.')
    .trim();

  // If stripping left almost nothing, fallback to original text
  if (!result || result.length < 5) {
    return text;
  }

  return result;
};

export const convertSymbolsToLatex = (str: string): string => {
  if (!str) return '';

  let res = str.trim().replace(/\.$/, '').trim();

  // If already contains valid LaTeX commands, return directly
  if (/\\(frac|sum|int|bar|binom|mathbb|sigma|mu|alpha|beta|hat|quad|text|cap|cup|sqrt|implies|iff)/.test(res)) {
    return res;
  }

  // 1. Replace "veya" / "ve" / "and" / "or"
  res = res
    .replace(/\bveya\b/gi, ' \\cup ')
    .replace(/\bor\b/gi, ' \\cup ')
    .replace(/\bve\b/gi, ' \\cap ')
    .replace(/\band\b/gi, ' \\cap ');

  // 2. Logic & Set Theory Symbols
  res = res
    .replace(/∧/g, ' \\cap ')
    .replace(/∨/g, ' \\cup ')
    .replace(/¬/g, ' \\neg ')
    .replace(/⇒|->/g, ' \\implies ')
    .replace(/⇔|<->/g, ' \\iff ')
    .replace(/∀/g, ' \\forall ')
    .replace(/∃/g, ' \\exists ')
    .replace(/∈/g, ' \\in ')
    .replace(/∉/g, ' \\notin ')
    .replace(/⊂/g, ' \\subset ')
    .replace(/⊆/g, ' \\subseteq ')
    .replace(/∅/g, ' \\emptyset ')
    .replace(/∩/g, ' \\cap ')
    .replace(/∪/g, ' \\cup ');

  // 3. Greek letters & Math Operators
  res = res
    .replace(/σ/g, '\\sigma ')
    .replace(/[µμ]/g, '\\mu ')
    .replace(/λ/g, '\\lambda ')
    .replace(/θ/g, '\\theta ')
    .replace(/α/g, '\\alpha ')
    .replace(/β/g, '\\beta ')
    .replace(/π/g, '\\pi ')
    .replace(/√n/gi, '\\sqrt{n}')
    .replace(/√(\w+)/gi, '\\sqrt{$1}')
    .replace(/√/g, '\\sqrt{}')
    .replace(/ŷ/g, '\\hat{y}')
    .replace(/x̄/g, '\\bar{x}')
    .replace(/±/g, '\\pm ')
    .replace(/\*/g, ' \\cdot ')
    .replace(/·/g, ' \\cdot ')
    .replace(/≈/g, ' \\approx ')
    .replace(/\|/g, ' \\mid ');

  // 4. Statistical terms & Subscripts / Superscripts
  res = res
    .replace(/\bE\(X\)/g, '\\mathbb{E}[X]')
    .replace(/\bVar\(X\)/g, '\\text{Var}(X)')
    .replace(/\bSE\b/g, '\\text{SE}')
    .replace(/\bIQR\b/g, '\\text{IQR}')
    .replace(/s1²/g, 's_1^2')
    .replace(/s2²/g, 's_2^2')
    .replace(/std_dev²/g, '\\text{std\\_dev}^2')
    .replace(/s²/g, 's^2')
    .replace(/σ1²/g, '\\sigma_1^2')
    .replace(/σ2²/g, '\\sigma_2^2')
    .replace(/Q3/g, 'Q_3')
    .replace(/Q1/g, 'Q_1')
    .replace(/b0/g, '\\beta_0')
    .replace(/b1/g, '\\beta_1');

  return res;
};

export const toLatexFormula = (formula: string): string => {
  if (!formula) return '';

  let raw = formula.trim().replace(/^(?:Formül|Formula|formülü)\s*:?\s*/i, '').replace(/\.$/, '').trim();

  // If raw is ALREADY valid LaTeX (e.g. contains \frac, \sum, \int, \bar, \binom, \mathbb, \text), return directly!
  if (/\\(frac|sum|int|bar|binom|mathbb|sigma|mu|alpha|beta|hat|quad|text|cap|cup|sqrt|implies|iff)/.test(raw)) {
    return raw;
  }

  // 1. Joint probability fraction with "ve" / "and" / "∩": P(A|B) = P(A ve B) / P(B)
  const jointProbMatch = raw.match(
    /P\(([^|]+)\|([^)]+)\)\s*=\s*P\(([^)]+)\)\s*\/\s*P\(([^)]+)\)/i
  );
  if (jointProbMatch) {
    const [, a1, b1, num, den] = jointProbMatch;
    const cleanNum = convertSymbolsToLatex(num.trim());
    const cleanDen = convertSymbolsToLatex(den.trim());
    return `P(${convertSymbolsToLatex(a1.trim())} \\mid ${convertSymbolsToLatex(b1.trim())}) = \\frac{P(${cleanNum})}{P(${cleanDen})}`;
  }

  // 2. Combinations / Binomial Coefficient: C(n, k) -> \binom{n}{k}
  const combMatch = raw.match(/C\((\w+),\s*(\w+)\)\s*=\s*(.+)/i);
  if (combMatch) {
    const [, n, k, rhs] = combMatch;
    if (rhs.includes('/')) {
      const parts = rhs.split('/');
      const num = parts[0].replace(/^[\(\[\s]+|[\)\]\s]+$/g, '').trim();
      const den = parts[1].replace(/^[\(\[\s\.]+|[\)\]\s\.]+\.?$/g, '').trim();
      return `\\binom{${n}}{${k}} = \\frac{${convertSymbolsToLatex(num)}}{${convertSymbolsToLatex(den)}}`;
    }
  }

  // 3. Bayes Rule / Conditional Probability Fraction: P(A|B) = [P(B|A) * P(A)] / P(B)
  const bayesMatch = raw.match(
    /P\(([^|]+)\|([^)]+)\)\s*=\s*(?:\[|\()?P\(([^|]+)\|([^)]+)\)\s*\*?\s*P\(([^)]+)\)(?:\]|\)?)\s*\/\s*P\(([^)]+)\)/i
  );
  if (bayesMatch) {
    const [, a1, b1, b2, a2, a3, b3] = bayesMatch;
    const cleanB3 = b3.trim().replace(/\.$/, '').trim();
    return `P(${convertSymbolsToLatex(a1.trim())} \\mid ${convertSymbolsToLatex(b1.trim())}) = \\frac{P(${convertSymbolsToLatex(b2.trim())} \\mid ${convertSymbolsToLatex(a2.trim())}) \\cdot P(${convertSymbolsToLatex(a3.trim())})}{P(${convertSymbolsToLatex(cleanB3)})}`;
  }

  // 4. Conditional Probability with Intersection: P(B\A) = P(B ∩ A) / P(A) or P(A|B) = P(A ∩ B) / P(B)
  const intersectMatch = raw.match(
    /P\(([^\\|]+)[\\|]([^)]+)\)\s*=\s*P\(([^∩]+)∩([^)]+)\)\s*\/\s*P\(([^)]+)\)/i
  );
  if (intersectMatch) {
    const [, a1, b1, i1, i2, pDen] = intersectMatch;
    const cleanPDen = pDen.trim().replace(/\.$/, '').trim();
    return `P(${convertSymbolsToLatex(a1.trim())} \\mid ${convertSymbolsToLatex(b1.trim())}) = \\frac{P(${convertSymbolsToLatex(i1.trim())} \\cap ${convertSymbolsToLatex(i2.trim())})}{P(${convertSymbolsToLatex(cleanPDen)})}`;
  }

  // 5. Standard Error: SE = σ / √n
  if (/SE\s*=\s*σ\s*\/\s*√n/i.test(raw)) {
    return '\\text{SE} = \\frac{\\sigma}{\\sqrt{n}}';
  }

  // 6. Z-score: Z = (X - µ) / σ
  if (/Z\s*=\s*\(?\s*X\s*-\s*[µμ]\s*\)?\s*\/\s*σ/i.test(raw)) {
    return 'Z = \\frac{X - \\mu}{\\sigma}';
  }

  // 7. F-statistic: F = s1² / s2²
  if (/F\s*=\s*s1²\s*\/\s*s2²/i.test(raw)) {
    return 'F = \\frac{s_1^2}{s_2^2}';
  }

  // 8. Generic Fraction equation: LHS = (num) / (den) or num / den
  if (raw.includes('/') && !raw.includes('\\frac')) {
    const parts = raw.split('=');
    if (parts.length === 2) {
      const lhs = convertSymbolsToLatex(parts[0].trim());
      const rhs = parts[1].trim();
      const slashIdx = rhs.indexOf('/');
      const num = rhs.substring(0, slashIdx).replace(/^[\(\[\s]+|[\)\]\s]+$/g, '').trim();
      const den = rhs.substring(slashIdx + 1).replace(/^[\(\[\s\.]+|[\)\]\s\.]+\.?$/g, '').trim();
      return `${lhs} = \\frac{${convertSymbolsToLatex(num)}}{${convertSymbolsToLatex(den)}}`;
    }
  }

  // 9. General symbol conversion
  return convertSymbolsToLatex(raw);
};

