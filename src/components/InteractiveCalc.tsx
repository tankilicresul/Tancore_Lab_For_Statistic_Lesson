import React, { useState } from 'react';
import {
  mean,
  median,
  mode,
  stdDev,
  bayesRule,
  normalPDF,
  normalCDF,
  binomialPMF,
  poissonPMF,
  getPValueT,
  simulateCoinFlips,
} from '../utils/stats';
import {
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
  Calculator,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ProbabilityLab } from './ProbabilityLab';
import { KatexFormula } from './KatexFormula';

interface InteractiveCalcProps {
  type?: string;
  initialData?: number[];
}

export const InteractiveCalc: React.FC<InteractiveCalcProps> = ({
  type,
  initialData = [10, 12, 12, 15, 9, 50],
}) => {
  const { language } = useAppStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Helper for generating initial correlation data
  const generateRegressionData = (targetR: number, n: number) => {
    const data = [];
    for (let i = 0; i < n; i++) {
      const x = Math.round(10 + Math.random() * 40);
      const noise = (Math.random() - 0.5) * 30 * (1 - Math.abs(targetR));
      const slope = targetR >= 0 ? 1.5 : -1.5;
      const y = Math.round(Math.max(5, 20 + slope * x + noise));
      data.push({ x, y, name: `#${i + 1}` });
    }
    return data;
  };

  // State for raw data list (Mean / Median / Mode)
  const [dataPoints, setDataPoints] = useState<number[]>(initialData);
  const [inputVal, setInputVal] = useState<string>('');

  // State for Probability Rules (Intersection & Union)
  const [probA, setProbA] = useState<number>(0.40);
  const [probB, setProbB] = useState<number>(0.30);
  const [isIndependent, setIsIndependent] = useState<boolean>(true);

  // State for Conditional Probability
  const [condPB, setCondPB] = useState<number>(0.40);
  const [condPAB, setCondPAB] = useState<number>(0.12);

  // State for Combinatorics
  const [combN, setCombN] = useState<number>(6);
  const [combK, setCombK] = useState<number>(2);

  // State for Coin Flip
  const [coinCount, setCoinCount] = useState<number>(100);
  const [coinP, setCoinP] = useState<number>(0.5);
  const [coinSim, setCoinSim] = useState(() => simulateCoinFlips(100, 0.5));

  // State for Bayes
  const [priorA, setPriorA] = useState<number>(0.10);
  const [pBGivenA, setPBGivenA] = useState<number>(0.80);
  const [pBGivenNotA, setPBGivenNotA] = useState<number>(0.05);

  // State for Normal
  const [normMean, setNormMean] = useState<number>(100);
  const [normStd, setNormStd] = useState<number>(15);
  const [targetX, setTargetX] = useState<number>(115);

  // State for Binomial
  const [binN, setBinN] = useState<number>(20);
  const [binP, setBinP] = useState<number>(0.4);

  // State for Poisson
  const [poisLambda, setPoisLambda] = useState<number>(4.0);

  // State for Sample Size
  const [confLevel, setConfLevel] = useState<number>(95);
  const [sampleStd, setSampleStd] = useState<number>(15);
  const [errorMargin, setErrorMargin] = useState<number>(3.0);

  // State for Confidence Interval
  const [ciMean, setCiMean] = useState<number>(138.5);
  const [ciStd, setCiStd] = useState<number>(4.5);
  const [ciN, setCiN] = useState<number>(25);
  const [ciConfLevel, setCiConfLevel] = useState<number>(95);

  // State for Hypothesis Test
  const [h0Mean, setH0Mean] = useState<number>(140);
  const [htSampleMean, setHtSampleMean] = useState<number>(136.5);
  const [htSampleStd, setHtSampleStd] = useState<number>(6.0);
  const [htSampleN, setHtSampleN] = useState<number>(20);

  // State for Regression
  const [regTargetR, setRegTargetR] = useState<number>(0.85);
  const [regN, setRegN] = useState<number>(30);
  const [regPoints, setRegPoints] = useState(() => generateRegressionData(0.85, 30));

  // If no interactive calculator is defined for this lesson, do not render
  if (!type || type === 'none') {
    return null;
  }

  // Accordion Header (when collapsed)
  if (!isOpen) {
    return (
      <div className="my-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans overflow-hidden transition-all">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left focus:outline-none group"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
              <Calculator className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                {language === 'tr' ? '3. İnteraktif Hesaplama Laboratuvarı' : '3. Interactive Calculation Lab'}
              </h4>
              <p className="text-xs text-slate-500 font-medium truncate">
                {language === 'tr' ? 'Parametreleri değiştir, canlı grafik ve istatistikleri gözlemle' : 'Modify parameters & observe live graphs'}
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-[#ff7a00]/15 group-hover:text-[#ff7a00] border border-slate-200 shrink-0 ml-3 transition-colors">
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          </div>
        </button>
      </div>
    );
  }

  // Wrapper Header & Collapse Component
  const renderLabContainer = (title: string, subtitle: string, children: React.ReactNode) => (
    <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
            <Calculator className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight truncate">{title}</h4>
            <p className="text-xs text-slate-500 font-medium truncate">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-[#ff7a00]/15 text-slate-700 hover:text-[#ff7a00] border border-slate-200 transition-colors shrink-0 ml-2"
          title={language === 'tr' ? 'Daralt' : 'Collapse'}
        >
          <ChevronDown className="w-4 h-4 stroke-[2.5] rotate-180" />
        </button>
      </div>
      {children}
    </div>
  );

  // Complex Labs Route (ProbabilityLab)
  if (type === 'probability_lab' || type === 'monte_carlo_clt' || type === 'markov_chain' || type === 'bayes_visualizer') {
    const tabMap: { [key: string]: 'distributions' | 'montecarlo' | 'clt' | 'bayes' | 'markov' } = {
      probability_lab: 'distributions',
      monte_carlo_clt: 'montecarlo',
      bayes_visualizer: 'bayes',
      markov_chain: 'markov',
    };
    return renderLabContainer(
      language === 'tr' ? '3. Gelişmiş İstatistik & Olasılık Laboratuvarı' : '3. Advanced Probability Lab',
      language === 'tr' ? 'Simülasyonlar, dağılımlar ve Bayes analizi' : 'Simulations & distributions',
      <ProbabilityLab defaultTab={tabMap[type] || 'distributions'} />
    );
  }

  // Probability Rules (Multiplication & Addition)
  if (type === 'probability_rules') {
    const intersectionProb = isIndependent ? probA * probB : 0;
    const unionProb = isIndependent
      ? probA + probB - intersectionProb
      : Math.min(1.0, probA + probB);

    return renderLabContainer(
      language === 'tr' ? '3. Olasılık Kuralları & Küme Cebiri Laboratuvarı' : '3. Probability Rules & Set Theory Lab',
      language === 'tr' ? 'P(A), P(B) ve bağımsızlık durumunu değiştirerek kesişim ve birleşim olasılıklarını hesapla' : 'Adjust P(A), P(B) and independence',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>A Olayı Olasılığı</span>
              <KatexFormula formula="P(A)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{(probA * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              value={probA}
              onChange={(e) => setProbA(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>B Olayı Olasılığı</span>
              <KatexFormula formula="P(B)" displayMode={false} />:
              <span className="text-[#38bdf8] font-mono font-bold ml-1">{(probB * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              value={probB}
              onChange={(e) => setProbB(parseFloat(e.target.value))}
              className="w-full accent-[#38bdf8]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              {language === 'tr' ? 'Olayların İlişkisi:' : 'Event Relationship:'}
            </label>
            <div className="flex rounded-xl bg-slate-200/70 p-1 border border-slate-300">
              <button
                onClick={() => setIsIndependent(true)}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-black transition-all ${
                  isIndependent ? 'bg-white text-[#ff7a00] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'tr' ? 'Bağımsız' : 'Independent'}
              </button>
              <button
                onClick={() => setIsIndependent(false)}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-black transition-all ${
                  !isIndependent ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'tr' ? 'Ayrık (Disjoint)' : 'Disjoint'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center justify-center gap-1 mb-1">
              <span>Kesişim Olasılığı</span>
              <KatexFormula formula="P(A \cap B)" displayMode={false} />
            </span>
            <span className="text-3xl font-black text-amber-700 font-mono">
              {(intersectionProb * 100).toFixed(1)}%
            </span>
            <p className="text-[11px] text-amber-800/80 font-mono mt-1 font-semibold">
              {isIndependent
                ? `P(A) · P(B) = ${probA.toFixed(2)} × ${probB.toFixed(2)} = ${intersectionProb.toFixed(4)}`
                : 'Ayrık Olaylar için Kesişim P(A ∩ B) = 0'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
            <span className="text-xs font-black text-sky-800 uppercase tracking-wider flex items-center justify-center gap-1 mb-1">
              <span>Birleşim (Toplam) Olasılığı</span>
              <KatexFormula formula="P(A \cup B)" displayMode={false} />
            </span>
            <span className="text-3xl font-black text-sky-700 font-mono">
              {(unionProb * 100).toFixed(1)}%
            </span>
            <p className="text-[11px] text-sky-800/80 font-mono mt-1 font-semibold">
              {isIndependent
                ? `P(A) + P(B) - P(A ∩ B) = ${(unionProb * 100).toFixed(1)}%`
                : `P(A) + P(B) = ${(unionProb * 100).toFixed(1)}%`}
            </p>
          </div>
        </div>
      </>
    );
  }

  // Conditional Probability Calculator
  if (type === 'conditional_prob') {
    const validPAB = Math.min(condPAB, condPB);
    const condProb = condPB > 0 ? validPAB / condPB : 0;

    return renderLabContainer(
      language === 'tr' ? '3. Koşullu Olasılık & Çarpım Kuralı Laboratuvarı' : '3. Conditional Probability Calculator',
      language === 'tr' ? 'P(B) koşul olasılığı ve P(A ∩ B) kesişimini değiştirerek P(A | B) hesapla' : 'Adjust P(B) and P(A ∩ B)',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Koşul Olayı</span>
              <KatexFormula formula="P(B)" displayMode={false} />:
              <span className="text-[#38bdf8] font-mono font-bold ml-1">{(condPB * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={condPB}
              onChange={(e) => {
                const newPB = parseFloat(e.target.value);
                setCondPB(newPB);
                if (condPAB > newPB) setCondPAB(parseFloat((newPB * 0.5).toFixed(2)));
              }}
              className="w-full accent-[#38bdf8]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Ortak Kesişim</span>
              <KatexFormula formula="P(A \cap B)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{(validPAB * 100).toFixed(1)}%</span>
            </label>
            <input
              type="range"
              min="0.01"
              max={condPB}
              step="0.01"
              value={validPAB}
              onChange={(e) => setCondPAB(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-center shadow-xs">
          <span className="text-xs text-[#ff7a00] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 mb-1">
            <span>Hesaplanan Koşullu Olasılık</span>
            <KatexFormula formula="P(A \mid B) = \frac{P(A \cap B)}{P(B)}" displayMode={false} />
          </span>
          <span className="text-4xl font-black text-[#ff7a00] font-mono tracking-tight">
            {(condProb * 100).toFixed(1)}%
          </span>
          <p className="text-xs text-slate-600 font-mono mt-2 font-semibold">
            {`P(A | B) = ${validPAB.toFixed(2)} / ${condPB.toFixed(2)} = ${condProb.toFixed(4)} (%${(condProb * 100).toFixed(1)})`}
          </p>
        </div>
      </>
    );
  }

  // Combinatorics Calculator (Permutation & Combination)
  if (type === 'combinatorics_calc') {
    const factorial = (num: number): number => {
      let res = 1;
      for (let i = 2; i <= num; i++) res *= i;
      return res;
    };

    const validK = Math.min(combK, combN);
    const nFact = factorial(combN);
    const permResult = factorial(combN) / factorial(combN - validK);
    const combResult = factorial(combN) / (factorial(validK) * factorial(combN - validK));

    return renderLabContainer(
      language === 'tr' ? '3. Kombinatorik: Permütasyon & Kombinasyon Laboratuvarı' : '3. Combinatorics Calculator',
      language === 'tr' ? 'n eleman sayısı ve k seçim sayısını değiştirerek sıralı/sırasız seçimleri hesapla' : 'Adjust n and k to compute P(n,k) and C(n,k)',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Toplam Küme Eleman Sayısı</span>
              <KatexFormula formula="(n)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{combN}</span>
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={combN}
              onChange={(e) => {
                const newN = parseInt(e.target.value, 10);
                setCombN(newN);
                if (combK > newN) setCombK(newN);
              }}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Seçilecek Eleman Sayısı</span>
              <KatexFormula formula="(k)" displayMode={false} />:
              <span className="text-[#38bdf8] font-mono font-bold ml-1">{validK}</span>
            </label>
            <input
              type="range"
              min="0"
              max={combN}
              value={validK}
              onChange={(e) => setCombK(parseInt(e.target.value, 10))}
              className="w-full accent-[#38bdf8]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-600 block mb-1">Faktöriyel n!</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{nFact.toLocaleString()}</span>
            <p className="text-[10px] text-slate-500 font-mono mt-1">{combN}! farklı dizilim</p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center">
            <span className="text-xs font-black text-[#ff7a00] flex items-center justify-center gap-1 mb-1">
              <span>Permütasyon</span>
              <KatexFormula formula="P(n, k)" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-[#ff7a00] font-mono">{permResult.toLocaleString()}</span>
            <p className="text-[10px] text-orange-700/80 font-mono mt-1">Sıralama Önemli: n!/(n-k)!</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center">
            <span className="text-xs font-black text-sky-700 flex items-center justify-center gap-1 mb-1">
              <span>Kombinasyon</span>
              <KatexFormula formula="\binom{n}{k}" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-sky-700 font-mono">{combResult.toLocaleString()}</span>
            <p className="text-[10px] text-sky-700/80 font-mono mt-1">Grup Seçimi: n!/[k!(n-k)!]</p>
          </div>
        </div>
      </>
    );
  }

  // 1. Mean / Median / Mode & Variance Lab
  if (type === 'mean_median_mode' || type === 'variance_stddev') {
    const currentMean = mean(dataPoints);
    const currentMedian = median(dataPoints);
    const currentModes = mode(dataPoints);
    const currentStd = stdDev(dataPoints);

    const chartData = dataPoints.map((val, idx) => ({
      name: `#${idx + 1}`,
      Değer: val,
      Ortalama: currentMean,
      Medyan: currentMedian,
    }));

    const handleAddDataPoint = () => {
      const num = parseFloat(inputVal);
      if (!isNaN(num)) {
        setDataPoints([...dataPoints, num]);
        setInputVal('');
      }
    };

    return renderLabContainer(
      language === 'tr' ? '3. İnteraktif İstatistik & Veri Seti Laboratuvarı' : '3. Interactive Statistics Lab',
      language === 'tr' ? 'Verileri ekle/çıkar, ortalama, medyan ve mod değişimini gözlemle' : 'Add/remove numbers and observe live metrics',
      <>
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#ff7a00] tracking-wide">
              {language === 'tr' ? 'Veri Seti Elemanları:' : 'Dataset Elements:'}
            </label>
            <button
              onClick={() => setDataPoints(initialData)}
              className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-[#ff7a00]" />
              <span>{language === 'tr' ? 'Sıfırla' : 'Reset'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {dataPoints.map((val, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-sm font-mono font-bold text-[#ff7a00] shadow-2xs"
              >
                <span>{val}</span>
                <button
                  onClick={() => setDataPoints(dataPoints.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-rose-600 ml-1.5 text-xs font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={language === 'tr' ? 'Yeni sayı girin...' : 'Enter new number...'}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-[#ff7a00] w-48 font-medium"
              onKeyDown={(e) => e.key === 'Enter' && handleAddDataPoint()}
            />
            <button
              onClick={handleAddDataPoint}
              className="px-4 py-2 bg-[#ff7a00] hover:bg-[#e56d00] text-white font-black text-xs rounded-xl transition-colors shadow-md shadow-[#ff7a00]/20 uppercase tracking-wide"
            >
              {language === 'tr' ? 'Ekle' : 'Add'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center gap-1 mb-0.5 tracking-wide">
              <span>Ortalama</span>
              <KatexFormula formula="\bar{x}" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentMean}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center gap-1 mb-0.5 tracking-wide">
              <span>Medyan</span>
              <KatexFormula formula="\tilde{x}" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentMedian}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center gap-1 mb-0.5 tracking-wide">
              <span>Mod</span>
              <KatexFormula formula="\text{Mode}" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentModes.join(', ')}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center gap-1 mb-0.5 tracking-wide">
              <span>Std Sapma</span>
              <KatexFormula formula="s" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentStd}</span>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ff7a00', borderRadius: '12px' }} />
              <Bar dataKey="Değer" fill="#ff7a00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  // 2. Probability & Coin Flip Simulator
  if (type === 'probability_coin') {
    const coinChartData = [
      { name: language === 'tr' ? 'Tura (Heads)' : 'Heads', Adet: coinSim.heads },
      { name: language === 'tr' ? 'Yazı (Tails)' : 'Tails', Adet: coinSim.tails },
    ];

    return renderLabContainer(
      language === 'tr' ? '3. Olasılık & Parapara Atış Simülatörü' : '3. Probability Coin Flip Simulator',
      language === 'tr' ? 'Büyük Sayılar Yasası (Law of Large Numbers) Deneyi' : 'Law of Large Numbers Experiment',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              {language === 'tr' ? 'Toplam Atış Sayısı (N):' : 'Total Flips (N):'}{' '}
              <span className="text-[#ff7a00] font-mono font-bold">{coinCount}</span>
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={coinCount}
              onChange={(e) => setCoinCount(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>{language === 'tr' ? 'Tura Olasılığı' : 'Probability'}</span>
              <KatexFormula formula="P(\text{Tura})" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{(coinP * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={coinP}
              onChange={(e) => setCoinP(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setCoinSim(simulateCoinFlips(coinCount, coinP))}
            className="px-6 py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-[#ff7a00]/20 flex items-center space-x-2 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-white" />
            <span>{language === 'tr' ? 'Simülasyonu Yeniden Çalıştır' : 'Run Simulation'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center">
            <span className="text-xs font-bold text-slate-700 block mb-1">Teorik Olasılık</span>
            <span className="text-2xl font-black text-[#ff7a00] font-mono">{(coinP * 100).toFixed(1)}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs font-bold text-slate-700 block mb-1">Empirik Tura Oranı</span>
            <span className="text-2xl font-black text-amber-700 font-mono">{(coinSim.headsRatio * 100).toFixed(1)}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-700 block mb-1">Tura / Toplam</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{coinSim.heads} / {coinSim.heads + coinSim.tails}</span>
          </div>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coinChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ff7a00', borderRadius: '12px' }} />
              <Bar dataKey="Adet" fill="#ff7a00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  // 3. Bayes Theorem Simulator
  if (type === 'bayes_rule') {
    const posterior = bayesRule(priorA, pBGivenA, pBGivenNotA);

    return renderLabContainer(
      language === 'tr' ? '3. Bayes Teoremi İnteraktif Simülatörü' : '3. Interactive Bayes Theorem Simulator',
      language === 'tr' ? 'Ön olasılık ve kanıtları değiştirerek güncellenmiş sonsal olasılığı hesapla' : 'Adjust priors & evidence',
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Ön Olasılık</span>
              <KatexFormula formula="P(\text{Spam})" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{(priorA * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.99"
              step="0.01"
              value={priorA}
              onChange={(e) => setPriorA(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <KatexFormula formula="P(\text{FREE} \mid \text{Spam})" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{(pBGivenA * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.99"
              step="0.01"
              value={pBGivenA}
              onChange={(e) => setPBGivenA(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <KatexFormula formula="P(\text{FREE} \mid \text{Normal})" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{(pBGivenNotA * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.99"
              step="0.01"
              value={pBGivenNotA}
              onChange={(e) => setPBGivenNotA(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-center shadow-xs">
          <span className="text-xs text-[#ff7a00] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 mb-1">
            <span>Güncellenmiş Sonsal Olasılık</span>
            <KatexFormula formula="P(\text{Spam} \mid \text{FREE})" displayMode={false} />
          </span>
          <span className="text-4xl font-black text-[#ff7a00] font-mono tracking-tight">
            {(posterior * 100).toFixed(1)}%
          </span>
          <div className="w-full bg-slate-200 rounded-full h-3 mt-3 overflow-hidden">
            <div
              className="bg-[#ff7a00] h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, posterior * 100))}%` }}
            />
          </div>
        </div>
      </>
    );
  }

  // 4. Normal Distribution Bell Curve Interactive
  if (type === 'normal_dist') {
    const curvePoints = [];
    const step = normStd / 4;
    for (let x = normMean - 3.5 * normStd; x <= normMean + 3.5 * normStd; x += step) {
      curvePoints.push({
        x: Math.round(x),
        Olasılık: parseFloat(normalPDF(x, normMean, normStd).toFixed(5)),
      });
    }

    const zScore = Number(((targetX - normMean) / normStd).toFixed(2));
    const probLess = Number((normalCDF(targetX, normMean, normStd) * 100).toFixed(1));

    return renderLabContainer(
      language === 'tr' ? '3. Normal Dağılım Çan Eğrisi Simülatörü' : '3. Normal Distribution Simulator',
      language === 'tr' ? 'Ortalama (µ), Standart Sapma (σ) ve Hedef X değerini değiştir' : 'Adjust µ, σ and target X',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Ortalama</span>
              <KatexFormula formula="(\mu)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{normMean}</span>
            </label>
            <input
              type="range"
              min="50"
              max="150"
              value={normMean}
              onChange={(e) => setNormMean(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Standart Sapma</span>
              <KatexFormula formula="(\sigma)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{normStd}</span>
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={normStd}
              onChange={(e) => setNormStd(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Hedef Değer</span>
              <KatexFormula formula="(X)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{targetX}</span>
            </label>
            <input
              type="range"
              min={normMean - 3 * normStd}
              max={normMean + 3 * normStd}
              value={targetX}
              onChange={(e) => setTargetX(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff7a00]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20 text-center">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center justify-center gap-1 mb-0.5">
              <span>Z-Skoru</span>
              <KatexFormula formula="Z = \frac{X - \mu}{\sigma}" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{zScore}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20 text-center">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center justify-center gap-1 mb-0.5">
              <KatexFormula formula={`P(X \\le ${targetX})`} displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">%{probLess}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center justify-center gap-1 mb-0.5">
              <KatexFormula formula={`P(X > ${targetX})`} displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">%{(100 - probLess).toFixed(1)}</span>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curvePoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ff7a00', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="Olasılık" stroke="#ff7a00" strokeWidth={3} dot={false} />
              <ReferenceLine x={targetX} stroke="#0f172a" strokeDasharray="4 4" label={{ value: `X=${targetX}`, fill: '#0f172a', fontSize: 12, fontWeight: 'bold' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  // 5. Binomial Distribution Interactive
  if (type === 'binomial_dist') {
    const binomialPoints = [];
    for (let k = 0; k <= binN; k++) {
      const prob = binomialPMF(k, binN, binP);
      binomialPoints.push({ k: `k=${k}`, Olasılık: parseFloat(prob.toFixed(4)) });
    }

    const expectedVal = Number((binN * binP).toFixed(2));
    const varianceVal = Number((binN * binP * (1 - binP)).toFixed(2));

    return renderLabContainer(
      language === 'tr' ? '3. Binom Dağılımı İnteraktif Simülatörü' : '3. Interactive Binomial Simulator',
      language === 'tr' ? 'Deneme sayısı (n) ve başarı olasılığını (p) değiştir' : 'Adjust n and p',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Deneme Sayısı (n): <span className="text-[#ff7a00] font-mono font-bold">{binN}</span>
            </label>
            <input
              type="range"
              min="5"
              max="40"
              value={binN}
              onChange={(e) => setBinN(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Başarı Olasılığı (p): <span className="text-[#ff7a00] font-mono font-bold">{(binP * 100).toFixed(0)}%</span>
            </label>
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

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20 text-center">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center justify-center gap-1 mb-0.5">
              <span>Beklenen Değer</span>
              <KatexFormula formula="\mathbb{E}[X] = n \cdot p" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{expectedVal}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20 text-center">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center justify-center gap-1 mb-0.5">
              <span>Varyans</span>
              <KatexFormula formula="\text{Var}(X) = n \cdot p(1-p)" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{varianceVal}</span>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={binomialPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="k" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ff7a00', borderRadius: '12px' }} />
              <Bar dataKey="Olasılık" fill="#ff7a00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  // 6. Poisson Distribution Interactive
  if (type === 'poisson_dist') {
    const maxK = Math.max(12, Math.ceil(poisLambda * 2.2));
    const poissonPoints = [];
    for (let k = 0; k <= maxK; k++) {
      const prob = poissonPMF(k, poisLambda);
      poissonPoints.push({ k: `k=${k}`, Olasılık: parseFloat(prob.toFixed(4)) });
    }

    return renderLabContainer(
      language === 'tr' ? '3. Poisson Dağılımı İnteraktif Simülatörü' : '3. Interactive Poisson Simulator',
      language === 'tr' ? 'Ortalama geliş/olay hızını (λ) değiştir' : 'Adjust arrival rate λ',
      <>
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
            <span>Ortalama Varış Oranı</span>
            <KatexFormula formula="(\lambda)" displayMode={false} />:
            <span className="text-[#ff7a00] font-mono font-bold ml-1">{poisLambda.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="15.0"
            step="0.5"
            value={poisLambda}
            onChange={(e) => setPoisLambda(parseFloat(e.target.value))}
            className="w-full accent-[#ff7a00]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20 text-center">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center justify-center gap-1 mb-0.5">
              <span>Beklenen Değer</span>
              <KatexFormula formula="\mathbb{E}[X] = \lambda" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{poisLambda.toFixed(1)}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20 text-center">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center justify-center gap-1 mb-0.5">
              <span>Varyans</span>
              <KatexFormula formula="\text{Var}(X) = \lambda" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{poisLambda.toFixed(1)}</span>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={poissonPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="k" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ff7a00', borderRadius: '12px' }} />
              <Bar dataKey="Olasılık" fill="#ff7a00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  // 7. Sample Size Calculator
  if (type === 'sample_size') {
    const zVal = confLevel === 90 ? 1.645 : confLevel === 99 ? 2.576 : 1.96;
    const requiredN = Math.ceil(Math.pow((zVal * sampleStd) / errorMargin, 2));

    return renderLabContainer(
      language === 'tr' ? '3. Örneklem Boyutu (Sample Size) & CLT Hesaplayıcı' : '3. Sample Size Calculator',
      language === 'tr' ? 'Güven düzeyi, standart sapma ve kabul edilebilir hata payını değiştir' : 'Adjust Confidence, σ and Error Margin E',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">Güven Düzeyi:</label>
            <select
              value={confLevel}
              onChange={(e) => setConfLevel(parseInt(e.target.value, 10))}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#ff7a00]"
            >
              <option value={90}>%90 Güven (Z = 1.645)</option>
              <option value={95}>%95 Güven (Z = 1.960)</option>
              <option value={99}>%99 Güven (Z = 2.576)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Standart Sapma</span>
              <KatexFormula formula="(\sigma)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{sampleStd}</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={sampleStd}
              onChange={(e) => setSampleStd(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Hata Payı</span>
              <KatexFormula formula="(E)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">± {errorMargin.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              value={errorMargin}
              onChange={(e) => setErrorMargin(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-center shadow-xs">
          <span className="text-xs text-[#ff7a00] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 mb-1">
            <span>Gerekli Minimum Örneklem Boyutu</span>
            <KatexFormula formula="(n)" displayMode={false} />
          </span>
          <span className="text-4xl font-black text-[#ff7a00] font-mono tracking-tight">
            n ≥ {requiredN}
          </span>
          <div className="text-xs text-slate-600 mt-2 font-medium flex items-center justify-center gap-1 flex-wrap">
            <span>Formül:</span>
            <KatexFormula formula={`n = \\left(\\frac{Z_{\\alpha/2} \\cdot \\sigma}{E}\\right)^2 = \\left(\\frac{${zVal} \\cdot ${sampleStd}}{${errorMargin.toFixed(1)}}\\right)^2`} displayMode={false} />
          </div>
        </div>
      </>
    );
  }

  // 8. Confidence & Prediction Intervals
  if (type === 'confidence_interval') {
    const zVal = ciConfLevel === 90 ? 1.645 : ciConfLevel === 99 ? 2.576 : 1.96;
    const me = zVal * (ciStd / Math.sqrt(ciN));
    const ciLow = (ciMean - me).toFixed(2);
    const ciHigh = (ciMean + me).toFixed(2);

    const piMargin = zVal * ciStd * Math.sqrt(1 + 1 / ciN);
    const piLow = (ciMean - piMargin).toFixed(2);
    const piHigh = (ciMean + piMargin).toFixed(2);

    return renderLabContainer(
      language === 'tr' ? '3. Güven (CI) & Tahmin (PI) Aralıkları Simülatörü' : '3. CI & PI Interval Simulator',
      language === 'tr' ? 'Ortalama, sapma, örneklem boyutu ve güven düzeyini değiştir' : 'Adjust Mean, Std, N and Confidence Level',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Ortalama</span>
              <KatexFormula formula="(\bar{x})" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{ciMean.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="50"
              max="200"
              step="0.5"
              value={ciMean}
              onChange={(e) => setCiMean(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Standart Sapma</span>
              <KatexFormula formula="(s)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{ciStd.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="0.5"
              value={ciStd}
              onChange={(e) => setCiStd(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Örneklem</span>
              <KatexFormula formula="(n)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{ciN}</span>
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={ciN}
              onChange={(e) => setCiN(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">Güven Düzeyi:</label>
            <select
              value={ciConfLevel}
              onChange={(e) => setCiConfLevel(parseInt(e.target.value, 10))}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#ff7a00]"
            >
              <option value={90}>%90 Güven</option>
              <option value={95}>%95 Güven</option>
              <option value={99}>%99 Güven</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center">
            <span className="text-xs font-black text-[#ff7a00] flex items-center justify-center gap-1 mb-1">
              <span>%{ciConfLevel} Güven Aralığı</span>
              <KatexFormula formula="\text{(CI)}" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">({ciLow}, {ciHigh})</span>
            <span className="text-[11px] text-slate-600 block mt-1 font-medium">Hata Marjı: ± {me.toFixed(2)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs font-black text-amber-700 flex items-center justify-center gap-1 mb-1">
              <span>%{ciConfLevel} Tahmin Aralığı</span>
              <KatexFormula formula="\text{(PI)}" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">({piLow}, {piHigh})</span>
            <span className="text-[11px] text-slate-600 block mt-1 font-medium flex items-center justify-center gap-1">
              <span>Gelecek tekil değer</span>
              <KatexFormula formula="X_{n+1}" displayMode={false} />
              <span>için</span>
            </span>
          </div>
        </div>
      </>
    );
  }

  // 9. Hypothesis Testing Z/T Calculator
  if (type === 'hypothesis_z_t') {
    const se = htSampleStd / Math.sqrt(htSampleN);
    const tStat = Number(((htSampleMean - h0Mean) / se).toFixed(2));
    const pValue = getPValueT(tStat, htSampleN - 1, true);
    const isReject = pValue < 0.05;

    return renderLabContainer(
      language === 'tr' ? '3. Hipotez Testi İstatistik Simülatörü' : '3. Hypothesis Test Simulator',
      language === 'tr' ? 'H0 hipotez ortalaması, örneklem ortalaması, sapma ve N değerini değiştir' : 'Adjust H0, Mean, Std & N',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>H0 Ortalaması</span>
              <KatexFormula formula="(\mu_0)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{h0Mean}</span>
            </label>
            <input
              type="range"
              min="100"
              max="200"
              value={h0Mean}
              onChange={(e) => setH0Mean(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Örneklem</span>
              <KatexFormula formula="(\bar{x})" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{htSampleMean.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="100"
              max="200"
              step="0.5"
              value={htSampleMean}
              onChange={(e) => setHtSampleMean(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Std Sapma</span>
              <KatexFormula formula="(s)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{htSampleStd.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="0.5"
              value={htSampleStd}
              onChange={(e) => setHtSampleStd(parseFloat(e.target.value))}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Örneklem</span>
              <KatexFormula formula="(n)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{htSampleN}</span>
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={htSampleN}
              onChange={(e) => setHtSampleN(parseInt(e.target.value, 10))}
              className="w-full accent-[#ff7a00]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-extrabold text-slate-600 flex items-center justify-center gap-1 mb-0.5">
              <span>Test İstatistiği</span>
              <KatexFormula formula="(t_0)" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{tStat}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-center">
            <span className="text-[11px] font-extrabold text-[#ff7a00] block mb-0.5">P-Value</span>
            <span className="text-2xl font-black text-[#ff7a00] font-mono">{pValue.toFixed(4)}</span>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center col-span-2 sm:col-span-1 ${isReject ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <span className={`text-[11px] font-extrabold flex items-center justify-center gap-1 mb-0.5 ${isReject ? 'text-rose-700' : 'text-emerald-700'}`}>
              <span>Karar</span>
              <KatexFormula formula="(\alpha = 0.05)" displayMode={false} />
            </span>
            <span className={`text-base font-black uppercase ${isReject ? 'text-rose-800' : 'text-emerald-800'}`}>
              {isReject ? (language === 'tr' ? 'Reddet H0' : 'Reject H0') : (language === 'tr' ? 'H0 Reddedilemez' : 'Fail to Reject H0')}
            </span>
          </div>
        </div>
      </>
    );
  }

  // 10. Correlation & Regression Simulator
  if (type === 'correlation_regression') {
    const calcR = Number(regTargetR.toFixed(2));
    const r2Val = Number((Math.pow(calcR, 2) * 100).toFixed(1));

    return renderLabContainer(
      language === 'tr' ? '3. Regresyon & Korelasyon İnteraktif Simülatörü' : '3. Interactive Regression Simulator',
      language === 'tr' ? 'Korelasyon katsayısı (r) ve veri sayısı N değerini değiştir' : 'Adjust target correlation r & N',
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Hedef Korelasyon</span>
              <KatexFormula formula="(r)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{regTargetR.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="-0.95"
              max="0.95"
              step="0.05"
              value={regTargetR}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setRegTargetR(val);
                setRegPoints(generateRegressionData(val, regN));
              }}
              className="w-full accent-[#ff7a00]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <span>Veri Noktası Sayısı</span>
              <KatexFormula formula="(N)" displayMode={false} />:
              <span className="text-[#ff7a00] font-mono font-bold ml-1">{regN}</span>
            </label>
            <input
              type="range"
              min="10"
              max="60"
              value={regN}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                setRegN(n);
                setRegPoints(generateRegressionData(regTargetR, n));
              }}
              className="w-full accent-[#ff7a00]"
            />
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setRegPoints(generateRegressionData(regTargetR, regN))}
            className="px-6 py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#e56d00] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-[#ff7a00]/20 flex items-center space-x-2 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-white" />
            <span>{language === 'tr' ? 'Yeni Veri Seti Oluştur' : 'Regenerate Dataset'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-extrabold text-slate-600 flex items-center justify-center gap-1 mb-0.5">
              <span>Korelasyon</span>
              <KatexFormula formula="(r)" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{calcR}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-center">
            <span className="text-[11px] font-extrabold text-[#ff7a00] flex items-center justify-center gap-1 mb-0.5">
              <span>Belirtlilik Katsayısı</span>
              <KatexFormula formula="(R^2)" displayMode={false} />
            </span>
            <span className="text-2xl font-black text-[#ff7a00] font-mono">%{r2Val}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] font-extrabold text-slate-600 block mb-0.5">Model İlişkisi</span>
            <span className="text-sm font-black text-slate-900 uppercase">
              {Math.abs(calcR) > 0.7 ? 'Güçlü' : Math.abs(calcR) > 0.3 ? 'Orta' : 'Zayıf'} {calcR >= 0 ? 'Pozitif' : 'Negatif'}
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={regPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ff7a00', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="y" stroke="#ff7a00" strokeWidth={2} dot={{ r: 4, fill: '#ff7a00' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  return null;
};
