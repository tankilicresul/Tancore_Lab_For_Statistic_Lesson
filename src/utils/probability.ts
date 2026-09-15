/**
 * StatSim AI Lab - Probability Engine & Math Core
 * Provides probability distributions (PDF/PMF, CDF, PPF/Quantile), combinatorics,
 * Bayes rule, Monte Carlo sampling, and p-value/critical-value functions.
 */

// ==========================================
// 1. COMBINATORICS & SPECIAL FUNCTIONS
// ==========================================

/** Factorial with safety check */
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
    if (!isFinite(res)) return Infinity;
  }
  return res;
}

/** Natural log of factorial using Lanczos/Stirling for large N to avoid overflow */
export function logFactorial(n: number): number {
  if (n < 0) return -Infinity;
  if (n <= 1) return 0;
  if (n <= 170) {
    let fact = 1;
    for (let i = 2; i <= n; i++) fact *= i;
    return Math.log(fact);
  }
  // Ramanujan approximation for log(n!)
  return n * Math.log(n) - n + (1 / 6) * Math.log(n * (1 + 4 * n * (1 + 2 * n))) + 0.5 * Math.log(Math.PI);
}

/** Permutations P(n, k) = n! / (n - k)! */
export function permutations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (n <= 170) {
    return factorial(n) / factorial(n - k);
  }
  return Math.exp(logFactorial(n) - logFactorial(n - k));
}

/** Combinations C(n, k) = n! / (k! * (n - k)!) */
export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k === 1 || k === n - 1) return n;
  if (n <= 100) {
    let res = 1;
    for (let i = 1; i <= k; i++) {
      res = (res * (n - k + i)) / i;
    }
    return Math.round(res);
  }
  const logComb = logFactorial(n) - logFactorial(k) - logFactorial(n - k);
  return Math.round(Math.exp(logComb));
}

/** Error function erf(x) approximation (Abramowitz & Stegun max error: 1.5e-7) */
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const a = Math.abs(x);

  // Constants
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const t = 1.0 / (1.0 + p * a);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-a * a);

  return sign * y;
}

/** Complementary error function erfc(x) = 1 - erf(x) */
export function erfc(x: number): number {
  return 1 - erf(x);
}

// ==========================================
// 2. DISCRETE DISTRIBUTIONS
// ==========================================

/** Binomial Probability Mass Function (PMF) P(X = k) */
export function binomialPMF(k: number, n: number, p: number): number {
  if (k < 0 || k > n || p < 0 || p > 1) return 0;
  const comb = combinations(n, k);
  const prob = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
  return Number(prob.toFixed(6));
}

/** Binomial Cumulative Distribution Function (CDF) P(X <= k) */
export function binomialCDF(k: number, n: number, p: number): number {
  if (k < 0) return 0;
  if (k >= n) return 1;
  let sum = 0;
  for (let i = 0; i <= Math.floor(k); i++) {
    sum += binomialPMF(i, n, p);
  }
  return Number(Math.min(1, sum).toFixed(6));
}

/** Poisson PMF P(X = k) */
export function poissonPMF(k: number, lambda: number): number {
  if (k < 0 || lambda <= 0) return 0;
  let prob: number;
  if (k <= 100) {
    prob = (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
  } else {
    const logP = k * Math.log(lambda) - lambda - logFactorial(k);
    prob = Math.exp(logP);
  }
  return Number(prob.toFixed(6));
}

/** Poisson CDF P(X <= k) */
export function poissonCDF(k: number, lambda: number): number {
  if (k < 0) return 0;
  let sum = 0;
  for (let i = 0; i <= Math.floor(k); i++) {
    sum += poissonPMF(i, lambda);
  }
  return Number(Math.min(1, sum).toFixed(6));
}

/** Geometric PMF P(X = k) = (1 - p)^(k - 1) * p for trial number k */
export function geometricPMF(k: number, p: number): number {
  if (k < 1 || p <= 0 || p > 1) return 0;
  return Number((Math.pow(1 - p, k - 1) * p).toFixed(6));
}

// ==========================================
// 3. CONTINUOUS DISTRIBUTIONS
// ==========================================

/** Normal (Gaussian) Probability Density Function (PDF) */
export function normalPDF(x: number, mu = 0, sigma = 1): number {
  if (sigma <= 0) return 0;
  const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
  const denom = sigma * Math.sqrt(2 * Math.PI);
  return Number((Math.exp(exponent) / denom).toFixed(6));
}

/** Normal Cumulative Distribution Function (CDF) P(X <= x) */
export function normalCDF(x: number, mu = 0, sigma = 1): number {
  if (sigma <= 0) return 0;
  const z = (x - mu) / sigma;
  const cdf = 0.5 * (1 + erf(z / Math.sqrt(2)));
  return Number(cdf.toFixed(6));
}

/**
 * Standard Normal Inverse CDF (Percent Point Function / Quantile) Z(p)
 * Uses Acklam's algorithm (accurate to ~1.15e-9)
 */
export function standardNormalPPF(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  // Coefficients in rational approximations
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0, -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0, 3.754408661907416e0];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q: number, r: number;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return ((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5] /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}

/** Normal Quantile / PPF X(p) = mu + z(p) * sigma */
export function normalPPF(p: number, mu = 0, sigma = 1): number {
  return mu + standardNormalPPF(p) * sigma;
}

/** Continuous Uniform PDF */
export function uniformPDF(x: number, a: number, b: number): number {
  if (x < a || x > b || a >= b) return 0;
  return Number((1 / (b - a)).toFixed(6));
}

/** Continuous Uniform CDF */
export function uniformCDF(x: number, a: number, b: number): number {
  if (x < a) return 0;
  if (x > b) return 1;
  return Number(((x - a) / (b - a)).toFixed(6));
}

/** Exponential PDF */
export function exponentialPDF(x: number, lambda: number): number {
  if (x < 0 || lambda <= 0) return 0;
  return Number((lambda * Math.exp(-lambda * x)).toFixed(6));
}

/** Exponential CDF */
export function exponentialCDF(x: number, lambda: number): number {
  if (x < 0 || lambda <= 0) return 0;
  return Number((1 - Math.exp(-lambda * x)).toFixed(6));
}

/** Student's t-distribution PDF approximation */
export function studentTPDF(t: number, df: number): number {
  if (df <= 0) return 0;
  const term1 = Math.exp(logFactorial(Math.floor((df + 1) / 2) - 1) - logFactorial(Math.floor(df / 2) - 1)); // gamma approx
  const coef = (1 / (Math.sqrt(df * Math.PI))) * (term1 > 0 ? term1 : 1);
  const pdf = coef * Math.pow(1 + (t * t) / df, -(df + 1) / 2);
  return Number(pdf.toFixed(6));
}

/** Student's t CDF approximation */
export function studentTCDF(t: number, df: number): number {
  if (df <= 0) return 0;
  if (df >= 30) {
    // Normal approximation for large df
    return normalCDF(t, 0, Math.sqrt(df / (df - 2)));
  }
  // Hill's approximation / standard normal mapping with Cornish-Fisher expansion
  const a = df - 0.5;
  const b = 48 * a * a;
  const z2 = a * Math.log(1 + (t * t) / df);
  const z = Math.sqrt(z2) * (t < 0 ? -1 : 1);
  const normZ = z * (1 - (z * z + 3) / (b * 4));
  return normalCDF(normZ);
}

// ==========================================
// 4. BAYES RULE & EVENT PROBABILITY
// ==========================================

export interface BayesResult {
  pA: number;
  pNotA: number;
  pBGivenA: number;
  pBGivenNotA: number;
  pBTotal: number;
  pAGivenB: number; // Posterior probability
  pNotAGivenB: number;
}

/** Calculates posterior probability P(A|B) using Bayes' Theorem */
export function bayesRule(priorA: number, pBGivenA: number, pBGivenNotA: number): number {
  const priorNotA = 1 - priorA;
  const totalB = pBGivenA * priorA + pBGivenNotA * priorNotA;
  if (totalB === 0) return 0;
  return Number(((pBGivenA * priorA) / totalB).toFixed(4));
}

/** Computes complete Bayes Analysis breakdown */
export function fullBayesAnalysis(priorA: number, pBGivenA: number, pBGivenNotA: number): BayesResult {
  const pA = priorA;
  const pNotA = 1 - priorA;
  const pBTotal = pBGivenA * pA + pBGivenNotA * pNotA;
  const pAGivenB = pBTotal > 0 ? (pBGivenA * pA) / pBTotal : 0;
  const pNotAGivenB = 1 - pAGivenB;

  return {
    pA: Number(pA.toFixed(4)),
    pNotA: Number(pNotA.toFixed(4)),
    pBGivenA: Number(pBGivenA.toFixed(4)),
    pBGivenNotA: Number(pBGivenNotA.toFixed(4)),
    pBTotal: Number(pBTotal.toFixed(4)),
    pAGivenB: Number(pAGivenB.toFixed(4)),
    pNotAGivenB: Number(pNotAGivenB.toFixed(4)),
  };
}

// ==========================================
// 5. MONTE CARLO & SAMPLING SIMULATION ENGINE
// ==========================================

/** Box-Muller transform for standard Normal distribution N(0, 1) */
export function sampleStandardNormal(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/** Sample from Normal distribution N(mu, sigma) */
export function sampleNormal(mu = 0, sigma = 1): number {
  return mu + sampleStandardNormal() * sigma;
}

/** Simulate N coin flips with probability p of heads */
export function simulateCoinFlips(numFlips: number, p = 0.5): { heads: number; tails: number; headsRatio: number; history: number[] } {
  let heads = 0;
  const history: number[] = [];
  for (let i = 1; i <= numFlips; i++) {
    if (Math.random() < p) heads++;
    history.push(Number((heads / i).toFixed(4)));
  }
  return {
    heads,
    tails: numFlips - heads,
    headsRatio: Number((heads / numFlips).toFixed(4)),
    history,
  };
}

/** Simulate rolling N dice M times */
export function simulateDiceRolls(numDice: number, numRolls: number): { counts: Record<number, number>; history: number[] } {
  const minSum = numDice;
  const maxSum = numDice * 6;
  const counts: Record<number, number> = {};
  for (let i = minSum; i <= maxSum; i++) counts[i] = 0;

  const history: number[] = [];
  let sumTotal = 0;

  for (let r = 1; r <= numRolls; r++) {
    let rollSum = 0;
    for (let d = 0; d < numDice; d++) {
      rollSum += Math.floor(Math.random() * 6) + 1;
    }
    counts[rollSum] = (counts[rollSum] || 0) + 1;
    sumTotal += rollSum;
    history.push(Number((sumTotal / r).toFixed(2)));
  }

  return { counts, history };
}

/**
 * Central Limit Theorem (CLT) Simulation:
 * Draws `numSamples` of size `sampleSize` from a specified population distribution (Uniform, Exponential, Skewed)
 * Returns array of sample means to demonstrate convergence to Normal distribution.
 */
export function runCLTSimulation(
  populationType: 'uniform' | 'exponential' | 'bimodal' | 'skewed',
  sampleSize: number,
  numSamples: number
): { sampleMeans: number[]; popMean: number; popStd: number; sampleMeansMean: number; sampleMeansStd: number } {
  const sampleMeans: number[] = [];

  // Generator helper for population item
  const drawFromPop = (): number => {
    switch (populationType) {
      case 'uniform':
        return Math.random() * 100; // Uniform [0, 100], mean = 50
      case 'exponential':
        return -Math.log(1 - Math.random()) * 20; // Exp(lambda=0.05), mean = 20
      case 'bimodal':
        return Math.random() < 0.5 ? sampleNormal(20, 5) : sampleNormal(80, 5);
      case 'skewed':
        return Math.pow(Math.random(), 3) * 100; // Skewed left
      default:
        return Math.random() * 100;
    }
  };

  for (let s = 0; s < numSamples; s++) {
    let sum = 0;
    for (let i = 0; i < sampleSize; i++) {
      sum += drawFromPop();
    }
    sampleMeans.push(Number((sum / sampleSize).toFixed(2)));
  }

  // Calculate statistics of sample means
  const meanOfMeans = sampleMeans.reduce((a, b) => a + b, 0) / sampleMeans.length;
  const varianceOfMeans = sampleMeans.reduce((a, b) => a + Math.pow(b - meanOfMeans, 2), 0) / sampleMeans.length;

  return {
    sampleMeans,
    popMean: populationType === 'uniform' ? 50 : populationType === 'exponential' ? 20 : 50,
    popStd: populationType === 'uniform' ? 28.87 : 20,
    sampleMeansMean: Number(meanOfMeans.toFixed(2)),
    sampleMeansStd: Number(Math.sqrt(varianceOfMeans).toFixed(2)),
  };
}

// ==========================================
// 6. STATISTICAL HELPERS (P-VALUE & CRITICAL VALUES)
// ==========================================

/** Calculates p-value from Z-score */
export function getPValueZ(zScore: number, twoTailed = true): number {
  const absZ = Math.abs(zScore);
  const oneTailedP = 1 - normalCDF(absZ);
  const pVal = twoTailed ? 2 * oneTailedP : oneTailedP;
  return Number(Math.max(0.0001, pVal).toFixed(4));
}

/** Calculates p-value from t-score and df */
export function getPValueT(tScore: number, df: number, twoTailed = true): number {
  const absT = Math.abs(tScore);
  const oneTailedP = 1 - studentTCDF(absT, df);
  const pVal = twoTailed ? 2 * oneTailedP : oneTailedP;
  return Number(Math.max(0.0001, pVal).toFixed(4));
}

/** Calculates critical Z-score for alpha (e.g. alpha = 0.05 two-tailed -> z = 1.96) */
export function getCriticalZ(alpha = 0.05, twoTailed = true): number {
  const p = twoTailed ? 1 - alpha / 2 : 1 - alpha;
  return Number(standardNormalPPF(p).toFixed(3));
}

/** Calculates critical t-score for alpha and df */
export function getCriticalT(alpha = 0.05, df = 30, twoTailed = true): number {
  const critZ = getCriticalZ(alpha, twoTailed);
  if (df >= 30) return critZ;
  // Cornish-Fisher expansion correction for finite df
  const correction = (critZ * critZ + 1) / (4 * df);
  return Number((critZ + critZ * correction).toFixed(3));
}

// ==========================================
// 7. MARKOV CHAINS & STOCHASTIC PROCESSES
// ==========================================

/** Multiplies two square matrices A and B */
export function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const C: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

/** Computes matrix power P^steps for transition matrix P */
export function matrixPower(P: number[][], steps: number): number[][] {
  const n = P.length;
  if (steps === 0) {
    return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  }
  let result = P;
  for (let s = 1; s < steps; s++) {
    result = matrixMultiply(result, P);
  }
  return result;
}

/** Multiplies row vector v (1 x N) with transition matrix P (N x N) */
export function vectorMatrixMultiply(v: number[], P: number[][]): number[] {
  const n = P.length;
  const res: number[] = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += v[i] * P[i][j];
    }
    res[j] = sum;
  }
  return res;
}

/**
 * Solves stationary distribution vector pi for transition matrix P (where pi * P = pi and sum(pi) = 1)
 * Uses power iteration method for numerical stability.
 */
export function solveStationaryDistribution(P: number[][], maxIter = 200, tol = 1e-7): number[] {
  const n = P.length;
  let pi = Array(n).fill(1 / n);

  for (let iter = 0; iter < maxIter; iter++) {
    const nextPi = vectorMatrixMultiply(pi, P);
    let diff = 0;
    for (let i = 0; i < n; i++) diff += Math.abs(nextPi[i] - pi[i]);
    pi = nextPi;
    if (diff < tol) break;
  }

  return pi.map((val) => Number(val.toFixed(4)));
}

/**
 * Simulates N steps of a Markov Chain given initial state index (0..n-1) and transition matrix P.
 * Returns array of visited state indices, counts, and proportions.
 */
export function simulateMarkovChain(
  P: number[][],
  initialState = 0,
  numSteps = 100
): { visitedStates: number[]; stateCounts: number[]; stateProportions: number[] } {
  const n = P.length;
  let currentState = initialState;
  const visitedStates: number[] = [currentState];
  const stateCounts = Array(n).fill(0);
  stateCounts[currentState]++;

  for (let step = 0; step < numSteps; step++) {
    const rand = Math.random();
    let cumProb = 0;
    let nextState = n - 1;

    for (let j = 0; j < n; j++) {
      cumProb += P[currentState][j];
      if (rand <= cumProb) {
        nextState = j;
        break;
      }
    }

    currentState = nextState;
    visitedStates.push(currentState);
    stateCounts[currentState]++;
  }

  const total = numSteps + 1;
  const stateProportions = stateCounts.map((count) => Number((count / total).toFixed(4)));

  return { visitedStates, stateCounts, stateProportions };
}

