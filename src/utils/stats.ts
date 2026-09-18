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
  // No mode when every value appears only once
  if (maxFreq === 1) return [];
  const modes: number[] = [];
  for (const key in freq) {
    if (freq[key] === maxFreq) modes.push(Number(key));
  }
  // No mode when all values have the same frequency (multimodal == no mode)
  if (modes.length === Object.keys(freq).length) return [];
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

// Re-export high precision probability utilities from probability core
export {
  factorial,
  combinations,
  permutations,
  bayesRule,
  binomialPMF,
  binomialCDF,
  poissonPMF,
  poissonCDF,
  normalPDF,
  normalCDF,
  normalPPF,
  standardNormalPPF,
  getPValueZ,
  getPValueT,
  getCriticalZ,
  getCriticalT,
  fullBayesAnalysis,
  runCLTSimulation,
  simulateCoinFlips,
  simulateDiceRolls,
} from './probability';
