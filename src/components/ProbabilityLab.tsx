import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  normalPDF,
  normalCDF,
  binomialPMF,
  poissonPMF,
  exponentialPDF,
  studentTPDF,
  fullBayesAnalysis,
  simulateCoinFlips,
  simulateDiceRolls,
  runCLTSimulation,
  matrixPower,
  vectorMatrixMultiply,
  solveStationaryDistribution,
  simulateMarkovChain,
} from '../utils/probability';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  Dices,
  Sliders,
  TrendingUp,
  RefreshCw,
  Zap,
  Layers,
  PieChart,
  HelpCircle,
  Sparkles,
  GitCommit,
  Network,
  Repeat,
} from 'lucide-react';

interface ProbabilityLabProps {
  defaultTab?: 'distributions' | 'montecarlo' | 'clt' | 'bayes' | 'markov';
}

export const ProbabilityLab: React.FC<ProbabilityLabProps> = ({ defaultTab = 'distributions' }) => {
  const { language } = useAppStore();
  const [activeTab, setActiveTab] = useState<'distributions' | 'montecarlo' | 'clt' | 'bayes' | 'markov'>(defaultTab);

  // ------------------------------------------
  // Tab 1: Distribution Explorer State
  // ------------------------------------------
  const [distType, setDistType] = useState<'normal' | 'binomial' | 'poisson' | 'exponential' | 'studentt'>('normal');
  // Normal
  const [normMu, setNormMu] = useState<number>(0);
  const [normSigma, setNormSigma] = useState<number>(1);
  const [targetX, setTargetX] = useState<number>(1.5);
  // Binomial
  const [binN, setBinN] = useState<number>(20);
  const [binP, setBinP] = useState<number>(0.5);
  // Poisson
  const [poisLambda, setPoisLambda] = useState<number>(5);
  // Exponential
  const [expLambda, setExpLambda] = useState<number>(0.5);
  // Student T
  const [tDf, setTDf] = useState<number>(5);

  // ------------------------------------------
  // Tab 2: Monte Carlo Simulator State
  // ------------------------------------------
  const [simMode, setSimMode] = useState<'coin' | 'dice'>('coin');
  const [coinFlipsCount, setCoinFlipsCount] = useState<number>(100);
  const [coinP, setCoinP] = useState<number>(0.5);
  const [coinResult, setCoinResult] = useState(() => simulateCoinFlips(100, 0.5));

  const [diceCount, setDiceCount] = useState<number>(1);
  const [diceRollsCount, setDiceRollsCount] = useState<number>(200);
  const [diceResult, setDiceResult] = useState(() => simulateDiceRolls(1, 200));

  // ------------------------------------------
  // Tab 3: CLT State
  // ------------------------------------------
  const [popType, setPopType] = useState<'uniform' | 'exponential' | 'bimodal' | 'skewed'>('exponential');
  const [sampleSize, setSampleSize] = useState<number>(30);
  const [numSamples, setNumSamples] = useState<number>(500);
  const [cltResult, setCltResult] = useState(() => runCLTSimulation('exponential', 30, 500));

  // ------------------------------------------
  // Tab 4: Bayes State
  // ------------------------------------------
  const [bayesPrior, setBayesPrior] = useState<number>(0.05); // 5% base rate
  const [bayesSensitivity, setBayesSensitivity] = useState<number>(0.90);
  const [bayesFalsePos, setBayesFalsePos] = useState<number>(0.05);

  // ------------------------------------------
  // Tab 5: Markov Chains State
  // ------------------------------------------
  const [markovPreset, setMarkovPreset] = useState<'churn' | 'weather' | 'market'>('churn');
  const [matrixP, setMatrixP] = useState<number[][]>([
    [0.85, 0.15],
    [0.10, 0.90],
  ]);
  const [stateNames, setStateNames] = useState<string[]>(['Aktif Müşteri', 'Churn (Terk)']);
  const [initialStateIdx, setInitialStateIdx] = useState<number>(0);
  const [markovSteps, setMarkovSteps] = useState<number>(20);
  const [markovSimResult, setMarkovSimResult] = useState(() =>
    simulateMarkovChain(
      [
        [0.85, 0.15],
        [0.10, 0.90],
      ],
      0,
      200
    )
  );

  // Preset switch helper
  const handleSelectMarkovPreset = (preset: 'churn' | 'weather' | 'market') => {
    setMarkovPreset(preset);
    if (preset === 'churn') {
      const p = [
        [0.85, 0.15],
        [0.10, 0.90],
      ];
      setMatrixP(p);
      setStateNames(['Aktif Müşteri', 'Churn (Terk)']);
      setMarkovSimResult(simulateMarkovChain(p, 0, 200));
    } else if (preset === 'weather') {
      const p = [
        [0.70, 0.30],
        [0.40, 0.60],
      ];
      setMatrixP(p);
      setStateNames(['Güneşli', 'Yağmurlu']);
      setMarkovSimResult(simulateMarkovChain(p, 0, 200));
    } else if (preset === 'market') {
      const p = [
        [0.70, 0.20, 0.10],
        [0.15, 0.75, 0.10],
        [0.20, 0.20, 0.60],
      ];
      setMatrixP(p);
      setStateNames(['Marka A', 'Marka B', 'Marka C']);
      setMarkovSimResult(simulateMarkovChain(p, 0, 200));
    }
  };

  // Update a single transition probability P_ij
  const handleUpdateMatrixP = (i: number, j: number, val: number) => {
    const newP = matrixP.map((row) => [...row]);
    newP[i][j] = val;
    // Normalize row so sum = 1.0 if 2 states
    if (newP[i].length === 2) {
      newP[i][1 - j] = Number((1 - val).toFixed(2));
    }
    setMatrixP(newP);
    setMarkovSimResult(simulateMarkovChain(newP, initialStateIdx, 200));
  };

  const handleRunMarkovSimulation = () => {
    setMarkovSimResult(simulateMarkovChain(matrixP, initialStateIdx, 300));
  };

  // Handlers for Monte Carlo & CLT
  const handleRunCoinSim = () => {
    setCoinResult(simulateCoinFlips(coinFlipsCount, coinP));
  };

  const handleRunDiceSim = () => {
    setDiceResult(simulateDiceRolls(diceCount, diceRollsCount));
  };

  const handleRunCLT = () => {
    setCltResult(runCLTSimulation(popType, sampleSize, numSamples));
  };

  // ------------------------------------------
  // Data Generation for Distributions
  // ------------------------------------------
  const getDistributionData = () => {
    const data: { x: number | string; y: number; shaded?: number }[] = [];

    if (distType === 'normal') {
      const minX = normMu - 4 * normSigma;
      const maxX = normMu + 4 * normSigma;
      const step = (maxX - minX) / 80;

      for (let x = minX; x <= maxX; x += step) {
        const y = normalPDF(x, normMu, normSigma);
        const roundedX = Number(x.toFixed(2));
        data.push({
          x: roundedX,
          y: Number(y.toFixed(4)),
          shaded: roundedX <= targetX ? Number(y.toFixed(4)) : 0,
        });
      }
    } else if (distType === 'binomial') {
      for (let k = 0; k <= binN; k++) {
        const y = binomialPMF(k, binN, binP);
        data.push({
          x: k,
          y: Number(y.toFixed(4)),
          shaded: k <= targetX ? Number(y.toFixed(4)) : 0,
        });
      }
    } else if (distType === 'poisson') {
      const maxK = Math.max(15, Math.ceil(poisLambda * 3));
      for (let k = 0; k <= maxK; k++) {
        const y = poissonPMF(k, poisLambda);
        data.push({
          x: k,
          y: Number(y.toFixed(4)),
          shaded: k <= targetX ? Number(y.toFixed(4)) : 0,
        });
      }
    } else if (distType === 'exponential') {
      const maxX = 10 / expLambda;
      const step = maxX / 60;
      for (let x = 0; x <= maxX; x += step) {
        const y = exponentialPDF(x, expLambda);
        const roundedX = Number(x.toFixed(2));
        data.push({
          x: roundedX,
          y: Number(y.toFixed(4)),
          shaded: roundedX <= targetX ? Number(y.toFixed(4)) : 0,
        });
      }
    } else if (distType === 'studentt') {
      const minX = -4;
      const maxX = 4;
      const step = 0.1;
      for (let x = minX; x <= maxX; x += step) {
        const y = studentTPDF(x, tDf);
        const roundedX = Number(x.toFixed(2));
        data.push({
          x: roundedX,
          y: Number(y.toFixed(4)),
          shaded: roundedX <= targetX ? Number(y.toFixed(4)) : 0,
        });
      }
    }

    return data;
  };

  const distData = getDistributionData();
  const cdfValue =
    distType === 'normal'
      ? normalCDF(targetX, normMu, normSigma)
      : distType === 'binomial'
      ? distData.filter((d) => Number(d.x) <= targetX).reduce((s, d) => s + d.y, 0)
      : 0.5;

  const bayesAnalysis = fullBayesAnalysis(bayesPrior, bayesSensitivity, bayesFalsePos);

  // Markov calculations
  const stationaryDist = solveStationaryDistribution(matrixP);

  // Generate step-by-step Markov trajectory data for chart
  const getMarkovTrajectoryData = () => {
    const trajectory: Record<string, any>[] = [];
    const n = matrixP.length;
    let currentVector = Array(n).fill(0);
    currentVector[initialStateIdx] = 1.0;

    for (let step = 0; step <= markovSteps; step++) {
      const point: Record<string, any> = { step: `t=${step}` };
      stateNames.forEach((name, idx) => {
        point[name] = Number((currentVector[idx] * 100).toFixed(1));
      });
      trajectory.push(point);
      currentVector = vectorMatrixMultiply(currentVector, matrixP);
    }
    return trajectory;
  };

  const markovTrajectoryData = getMarkovTrajectoryData();

  return (
    <div className="my-6 p-5 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shadow-2xs">
            <Sparkles className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {language === 'tr' ? 'Olasılık & İstatistik Laboratuvarı' : 'Probability & Statistics Lab'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'tr'
                ? 'Dağılımlar, Monte Carlo, CLT, Bayes ve Markov Zincirlerini canlı deneyimleyin'
                : 'Explore distributions, Monte Carlo, CLT, Bayes, and Markov Chains live'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 sm:gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-x-auto max-w-full shrink-0">
          <button
            onClick={() => setActiveTab('distributions')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'distributions'
                ? 'bg-[#ff7a00] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'tr' ? '📊 Dağılımlar' : '📊 Distributions'}
          </button>
          <button
            onClick={() => setActiveTab('montecarlo')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'montecarlo'
                ? 'bg-[#ff7a00] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'tr' ? '🎲 Monte Carlo' : '🎲 Monte Carlo'}
          </button>
          <button
            onClick={() => setActiveTab('clt')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'clt'
                ? 'bg-[#ff7a00] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'tr' ? '📈 CLT Teoremi' : '📈 CLT Theorem'}
          </button>
          <button
            onClick={() => setActiveTab('bayes')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'bayes'
                ? 'bg-[#ff7a00] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'tr' ? '🌲 Bayes' : '🌲 Bayes'}
          </button>
          <button
            onClick={() => setActiveTab('markov')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'markov'
                ? 'bg-[#ff7a00] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'tr' ? '🔗 Markov' : '🔗 Markov'}
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: DISTRIBUTION EXPLORER                         */}
      {/* ==================================================== */}
      {activeTab === 'distributions' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                {language === 'tr' ? 'Dağılım Türü:' : 'Distribution Type:'}
              </label>
              <select
                value={distType}
                onChange={(e) => setDistType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs font-extrabold bg-white border border-slate-300 text-slate-800 shadow-2xs focus:ring-2 focus:ring-[#ff7a00] outline-none"
              >
                <option value="normal">{language === 'tr' ? 'Normal (Gaussian) Dağılım' : 'Normal (Gaussian) Distribution'}</option>
                <option value="binomial">{language === 'tr' ? 'Binom Dağılımı (Kesikli)' : 'Binomial Distribution'}</option>
                <option value="poisson">{language === 'tr' ? 'Poisson Dağılımı (Nadir Olaylar)' : 'Poisson Distribution'}</option>
                <option value="exponential">{language === 'tr' ? 'Üstel Dağılım (Bekleme Süresi)' : 'Exponential Distribution'}</option>
                <option value="studentt">{language === 'tr' ? 'Student t-Dağılımı' : "Student's t-Distribution"}</option>
              </select>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              {distType === 'normal' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-600">Ortalama μ: {normMu}</span>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.5"
                      value={normMu}
                      onChange={(e) => setNormMu(parseFloat(e.target.value))}
                      className="w-full accent-[#ff7a00]"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-600">Std Sapma σ: {normSigma}</span>
                    <input
                      type="range"
                      min="0.2"
                      max="5"
                      step="0.1"
                      value={normSigma}
                      onChange={(e) => setNormSigma(parseFloat(e.target.value))}
                      className="w-full accent-[#ff7a00]"
                    />
                  </div>
                </div>
              )}

              {distType === 'binomial' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-600">Deneme Sayısı n: {binN}</span>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={binN}
                      onChange={(e) => setBinN(parseInt(e.target.value))}
                      className="w-full accent-[#ff7a00]"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-600">Başarı Olasılığı p: {binP}</span>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.05"
                      value={binP}
                      onChange={(e) => setBinP(parseFloat(e.target.value))}
                      className="w-full accent-[#ff7a00]"
                    />
                  </div>
                </div>
              )}

              {distType === 'poisson' && (
                <div>
                  <span className="text-xs font-bold text-slate-600">Ortalama Oran λ (Lambda): {poisLambda}</span>
                  <input
                    type="range"
                    min="0.5"
                    max="15"
                    step="0.5"
                    value={poisLambda}
                    onChange={(e) => setPoisLambda(parseFloat(e.target.value))}
                    className="w-full accent-[#ff7a00]"
                  />
                </div>
              )}

              {distType === 'exponential' && (
                <div>
                  <span className="text-xs font-bold text-slate-600">Oran Parametresi λ: {expLambda}</span>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={expLambda}
                    onChange={(e) => setExpLambda(parseFloat(e.target.value))}
                    className="w-full accent-[#ff7a00]"
                  />
                </div>
              )}

              {distType === 'studentt' && (
                <div>
                  <span className="text-xs font-bold text-slate-600">Serbestlik Derecesi (df): {tDf}</span>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={tDf}
                    onChange={(e) => setTDf(parseInt(e.target.value))}
                    className="w-full accent-[#ff7a00]"
                  />
                </div>
              )}

              {/* Target X Slider */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-extrabold text-[#ff7a00]">
                  {language === 'tr' ? `Hedef Değer X <= ${targetX}` : `Target Value X <= ${targetX}`}
                </span>
                <input
                  type="range"
                  min={distType === 'normal' ? normMu - 3 * normSigma : 0}
                  max={distType === 'normal' ? normMu + 3 * normSigma : distType === 'binomial' ? binN : 15}
                  step="0.1"
                  value={targetX}
                  onChange={(e) => setTargetX(parseFloat(e.target.value))}
                  className="w-full accent-[#ff7a00]"
                />
              </div>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="h-64 sm:h-72 bg-slate-900 rounded-3xl p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              {distType === 'binomial' || distType === 'poisson' ? (
                <BarChart data={distData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="x" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="y" fill="#ff7a00" radius={[6, 6, 0, 0]} name="P(X=k)" />
                </BarChart>
              ) : (
                <AreaChart data={distData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="x" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="y" stroke="#ff7a00" strokeWidth={3} fill="#ff7a00" fillOpacity={0.2} name="PDF f(x)" />
                  <Area type="monotone" dataKey="shaded" stroke="transparent" fill="#ff7a00" fillOpacity={0.6} name="Cumulative Area" />
                  <ReferenceLine x={targetX} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `X=${targetX}`, fill: '#ef4444' }} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200">
              <span className="text-[10px] font-black uppercase text-[#ff7a00]">
                {language === 'tr' ? 'BEKLENEN DEĞER E[X]' : 'EXPECTED VALUE E[X]'}
              </span>
              <p className="text-base font-black text-slate-900 mt-1">
                {distType === 'normal'
                  ? normMu
                  : distType === 'binomial'
                  ? (binN * binP).toFixed(2)
                  : distType === 'poisson'
                  ? poisLambda
                  : (1 / expLambda).toFixed(2)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-500">
                {language === 'tr' ? 'VARYANS Var(X)' : 'VARIANCE Var(X)'}
              </span>
              <p className="text-base font-black text-slate-900 mt-1">
                {distType === 'normal'
                  ? (normSigma * normSigma).toFixed(2)
                  : distType === 'binomial'
                  ? (binN * binP * (1 - binP)).toFixed(2)
                  : distType === 'poisson'
                  ? poisLambda
                  : (1 / (expLambda * expLambda)).toFixed(2)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-500">
                {language === 'tr' ? `KÜMÜLATİF OLASILIK P(X <= ${targetX})` : `CUMULATIVE P(X <= ${targetX})`}
              </span>
              <p className="text-base font-black text-[#ff7a00] mt-1">
                {typeof cdfValue === 'number' ? (cdfValue * 100).toFixed(2) + '%' : cdfValue}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: MONTE CARLO SIMULATOR                         */}
      {/* ==================================================== */}
      {activeTab === 'montecarlo' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={() => setSimMode('coin')}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                simMode === 'coin' ? 'bg-[#ff7a00] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🪙 {language === 'tr' ? 'Madeni Para Atışı' : 'Coin Flips'}
            </button>
            <button
              onClick={() => setSimMode('dice')}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                simMode === 'dice' ? 'bg-[#ff7a00] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🎲 {language === 'tr' ? 'Zar Atma Simülasyonu' : 'Dice Rolls'}
            </button>
          </div>

          {simMode === 'coin' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    {language === 'tr' ? 'Atış Sayısı N:' : 'Flip Count N:'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={coinFlipsCount}
                    onChange={(e) => setCoinFlipsCount(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    {language === 'tr' ? 'Tura Olasılığı p:' : 'Heads Prob p:'}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                    value={coinP}
                    onChange={(e) => setCoinP(parseFloat(e.target.value))}
                    className="w-full accent-[#ff7a00]"
                  />
                  <span className="text-[10px] font-bold text-slate-500">{coinP}</span>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleRunCoinSim}
                    className="w-full py-2 bg-[#ff7a00] hover:bg-[#e66e00] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'Simülasyonu Çalıştır' : 'Run Simulation'}</span>
                  </button>
                </div>
              </div>

              {/* Coin Convergence Chart */}
              <div className="h-60 bg-slate-900 rounded-3xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={coinResult.history.map((val, idx) => ({ step: idx + 1, ratio: val }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="step" stroke="#94a3b8" />
                    <YAxis domain={[0, 1]} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <ReferenceLine y={coinP} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `Teorik (${coinP})`, fill: '#ef4444' }} />
                    <Line type="monotone" dataKey="ratio" stroke="#ff7a00" strokeWidth={2} dot={false} name="Görece Frekans" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-100 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-slate-500">Tura (Heads)</span>
                  <p className="text-base font-black text-[#ff7a00]">{coinResult.heads}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-slate-500">Yazı (Tails)</span>
                  <p className="text-base font-black text-slate-700">{coinResult.tails}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-slate-500">Gözlenen Oran</span>
                  <p className="text-base font-black text-[#ff7a00]">{(coinResult.headsRatio * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    {language === 'tr' ? 'Zar Adedi:' : 'Dice Count:'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={diceCount}
                    onChange={(e) => setDiceCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    {language === 'tr' ? 'Atış Sayısı:' : 'Roll Count:'}
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    value={diceRollsCount}
                    onChange={(e) => setDiceRollsCount(parseInt(e.target.value) || 200)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs font-bold"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleRunDiceSim}
                    className="w-full py-2 bg-[#ff7a00] hover:bg-[#e66e00] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'Zarları At' : 'Roll Dice'}</span>
                  </button>
                </div>
              </div>

              {/* Dice Distribution Bar Chart */}
              <div className="h-60 bg-slate-900 rounded-3xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(diceResult.counts).map(([sum, count]) => ({ sum, count }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="sum" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="count" fill="#ff7a00" radius={[6, 6, 0, 0]} name="Gözlenen Frekans" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: CENTRAL LIMIT THEOREM (CLT) VISUALIZER        */}
      {/* ==================================================== */}
      {activeTab === 'clt' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs text-slate-700 leading-relaxed">
            <p className="font-extrabold text-[#ff7a00] mb-1">💡 Merkezi Limit Teoremi (CLT) Nedir?</p>
            Ana kütle dağılımı ne kadar çarpık veya düzensiz olursa olsun (Üstel, İki tepeli vb.), çekilen rastgele örneklem büyüklüğü (n ≥ 30) olduğunda, <strong>örneklem ortalamalarının dağılımı Normal Dağılıma yakınsar!</strong>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Popülasyon Şekli:</label>
              <select
                value={popType}
                onChange={(e) => setPopType(e.target.value as any)}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="exponential">Üstel (Çarpık Sağa)</option>
                <option value="uniform">Düzgün (Uniform [0,100])</option>
                <option value="bimodal">Çift Tepeli (Bimodal)</option>
                <option value="skewed">Çarpık Sola</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Örneklem Boyutu n:</label>
              <input
                type="range"
                min="2"
                max="100"
                value={sampleSize}
                onChange={(e) => setSampleSize(parseInt(e.target.value))}
                className="w-full accent-[#ff7a00]"
              />
              <span className="text-[10px] font-bold text-slate-500">n = {sampleSize}</span>
            </div>
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Örneklem Sayısı K:</label>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={numSamples}
                onChange={(e) => setNumSamples(parseInt(e.target.value))}
                className="w-full accent-[#ff7a00]"
              />
              <span className="text-[10px] font-bold text-slate-500">K = {numSamples}</span>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleRunCLT}
                className="w-full py-2 bg-[#ff7a00] hover:bg-[#e66e00] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>CLT Çiz</span>
              </button>
            </div>
          </div>

          {/* CLT Sample Means Histogram */}
          <div className="h-64 bg-slate-900 rounded-3xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cltResult.sampleMeans.slice(0, 40).map((m, idx) => ({ name: `#${idx + 1}`, mean: m }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="mean" fill="#ff7a00" radius={[4, 4, 0, 0]} name="Örneklem Ortalaması X̄" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-100 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-500">Popülasyon Ortalaması μ</span>
              <p className="text-sm font-black text-slate-900">{cltResult.popMean}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-500">Örneklem Ortalamaları μ_X̄</span>
              <p className="text-sm font-black text-[#ff7a00]">{cltResult.sampleMeansMean}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-500">Standart Hata SE (σ / √n)</span>
              <p className="text-sm font-black text-slate-900">{cltResult.sampleMeansStd}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-500">Dağılım Şekli</span>
              <p className="text-sm font-black text-[#ff7a00]">Çan Eğrisi (Normal)</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: BAYES THEOREM ANALYSIS                         */}
      {/* ==================================================== */}
      {activeTab === 'bayes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                Önsel Olasılık P(A) [Base Rate]: {(bayesPrior * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.005"
                max="0.50"
                step="0.005"
                value={bayesPrior}
                onChange={(e) => setBayesPrior(parseFloat(e.target.value))}
                className="w-full accent-[#ff7a00]"
              />
              <span className="text-[10px] text-slate-500">Örn: Toplumdaki hastalık oranı veya fraud ihtimali</span>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                Duyarlılık P(B|A) [Sensitivity]: {(bayesSensitivity * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.50"
                max="0.99"
                step="0.01"
                value={bayesSensitivity}
                onChange={(e) => setBayesSensitivity(parseFloat(e.target.value))}
                className="w-full accent-[#ff7a00]"
              />
              <span className="text-[10px] text-slate-500">Örn: Gerçek hastayken testin Pozitif verme oranı</span>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                Yalancı Pozitif P(B|A') [False Alarm]: {(bayesFalsePos * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.01"
                max="0.30"
                step="0.01"
                value={bayesFalsePos}
                onChange={(e) => setBayesFalsePos(parseFloat(e.target.value))}
                className="w-full accent-[#ff7a00]"
              />
              <span className="text-[10px] text-slate-500">Örn: Sağlıklı kişiye yanlışlıkla Pozitif deme oranı</span>
            </div>
          </div>

          {/* Bayes Result Cards */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#ff7a00]">POSTERİOR OLASILIK (SONSAL RİSK)</span>
                <h4 className="text-2xl font-black text-white mt-0.5">
                  P(A | B) = {(bayesAnalysis.pAGivenB * 100).toFixed(2)}%
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Toplam Pozitif Test Oranı P(B):</span>
                <p className="text-base font-bold text-slate-200">{(bayesAnalysis.pBTotal * 100).toFixed(2)}%</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed font-sans">
              <p className="font-extrabold text-slate-100 mb-2">📌 Şaşırtıcı Bayes Sonucu Açıklaması:</p>
              Testiniz <strong>POZİTİF</strong> çıksa bile, hastalığın toplumdaki önsel oranı (%{(bayesPrior * 100).toFixed(1)}) çok düşük olduğundan, gerçekten hasta olma olasılığınız sadece <span className="text-[#ff7a00] font-bold">%{(bayesAnalysis.pAGivenB * 100).toFixed(2)}</span> kadardır! Geri kalan %{(bayesAnalysis.pNotAGivenB * 100).toFixed(2)} Pozitif sonuç yalancı alarmdır.
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: MARKOV CHAINS & STOCHASTIC PROCESSES          */}
      {/* ==================================================== */}
      {activeTab === 'markov' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs text-slate-700 leading-relaxed">
            <p className="font-extrabold text-[#ff7a00] mb-1">🔗 Markov Zinciri (Markov Chain) Nedir?</p>
            Gelecekteki durumun olasılığı, geçmişteki tüm geçmişten bağımsız olarak <strong>sadece bir önceki duruma bağlıdır (Belleksizlik Özelliği)</strong>.
            Geçiş matrisi $P$ ile zaman içinde durum olasılıkları durağan bir dengeye (Stationary Vector $\pi^*$) yakınsar.
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSelectMarkovPreset('churn')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                markovPreset === 'churn' ? 'bg-[#ff7a00] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              👥 Müşteri Terk (Churn vs Retention)
            </button>
            <button
              onClick={() => handleSelectMarkovPreset('weather')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                markovPreset === 'weather' ? 'bg-[#ff7a00] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ☀️ Weather (Güneşli vs Yağmurlu)
            </button>
            <button
              onClick={() => handleSelectMarkovPreset('market')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                markovPreset === 'market' ? 'bg-[#ff7a00] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              📊 Pazar Payı (3 Marka Rekabeti)
            </button>
          </div>

          {/* Transition Matrix Editor */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
              Geçiş Matrisi P (Transition Matrix):
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-sans">
                    <th className="p-2 text-left">Mevcut Durum</th>
                    {stateNames.map((name, idx) => (
                      <th key={idx} className="p-2 text-center text-[#ff7a00]">
                        ➔ {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixP.map((row, i) => (
                    <tr key={i} className="border-b border-slate-200/60">
                      <td className="p-2 font-bold font-sans text-slate-800">{stateNames[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className="p-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.05"
                            value={val}
                            onChange={(e) => handleUpdateMatrixP(i, j, parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:ring-2 focus:ring-[#ff7a00]"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600">Adım Sayısı N: {markovSteps}</span>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={markovSteps}
                  onChange={(e) => setMarkovSteps(parseInt(e.target.value))}
                  className="w-32 accent-[#ff7a00]"
                />
              </div>

              <button
                onClick={handleRunMarkovSimulation}
                className="px-4 py-2 bg-[#ff7a00] hover:bg-[#e66e00] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rastgele Yol Simüle Et (Stochastic Path)</span>
              </button>
            </div>
          </div>

          {/* Recharts Trajectory Plot */}
          <div className="h-64 bg-slate-900 rounded-3xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={markovTrajectoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="step" stroke="#94a3b8" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                {stateNames.map((name, idx) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={idx === 0 ? '#ff7a00' : idx === 1 ? '#38bdf8' : '#34d399'}
                    strokeWidth={3}
                    dot={false}
                    name={`${name} (%)`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stationary Equilibrium Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stateNames.map((name, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                <span className="text-[10px] font-black uppercase text-[#ff7a00]">
                  UZUN VADELİ DURAĞAN DENGE π* ({name})
                </span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {((stationaryDist[idx] || 0) * 100).toFixed(1)}%
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Simülasyonda Gözlenen: {((markovSimResult.stateProportions[idx] || 0) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
