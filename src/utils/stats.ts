export function mean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return Number((sum / numbers.length).toFixed(2));
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
  }
  return Number(sorted[mid].toFixed(2));
}

export function mode(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  const freq: { [key: number]: number } = {};
  let maxFreq = 0;
  for (const n of numbers) {
    freq[n] = (freq[n] || 0) + 1;
    if (freq[n] > maxFreq) maxFreq = freq[n];
  }
  const modes: number[] = [];
  for (const key in freq) {
    if (freq[key] === maxFreq) modes.push(Number(key));
  }
  return modes;
}

export function variance(numbers: number[], isSample = true): number {
  if (numbers.length <= 1) return 0;
  const m = mean(numbers);
  const sumSquaredDiffs = numbers.reduce((sum, val) => sum + Math.pow(val - m, 2), 0);
  const divisor = isSample ? numbers.length - 1 : numbers.length;
  return Number((sumSquaredDiffs / divisor).toFixed(2));
}

export function stdDev(numbers: number[], isSample = true): number {
  const v = variance(numbers, isSample);
  return Number(Math.sqrt(v).toFixed(2));
}

export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

export function bayesRule(priorA: number, pBGivenA: number, pBGivenNotA: number): number {
  const priorNotA = 1 - priorA;
  const totalB = (pBGivenA * priorA) + (pBGivenNotA * priorNotA);
  if (totalB === 0) return 0;
  return Number(((pBGivenA * priorA) / totalB).toFixed(4));
}

export function binomialPMF(k: number, n: number, p: number): number {
  if (k < 0 || k > n) return 0;
  const comb = combinations(n, k);
  const prob = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
  return Number(prob.toFixed(4));
}

export function poissonPMF(k: number, lambda: number): number {
  if (k < 0) return 0;
  const prob = (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
  return Number(prob.toFixed(4));
}

export function normalPDF(x: number, m: number, s: number): number {
  if (s <= 0) return 0;
  const exponent = -Math.pow(x - m, 2) / (2 * Math.pow(s, 2));
  const denom = s * Math.sqrt(2 * Math.PI);
  return Number((Math.exp(exponent) / denom).toFixed(4));
}
