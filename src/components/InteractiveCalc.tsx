import React, { useState } from 'react';
import { mean, median, mode, variance, stdDev, bayesRule, normalPDF } from '../utils/stats';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sliders, RefreshCw, Calculator, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ProbabilityLab } from './ProbabilityLab';

interface InteractiveCalcProps {
  type?: string;
  initialData?: number[];
}

export const InteractiveCalc: React.FC<InteractiveCalcProps> = ({
  type = 'mean_median_mode',
  initialData = [10, 12, 12, 15, 9, 50],
}) => {
  const { language } = useAppStore();

  if (type === 'probability_lab') {
    return <ProbabilityLab defaultTab="distributions" />;
  }
  if (type === 'monte_carlo_clt' || type === 'probability_coin') {
    return <ProbabilityLab defaultTab="montecarlo" />;
  }
  if (type === 'bayes_visualizer' || type === 'bayes_rule') {
    return <ProbabilityLab defaultTab="bayes" />;
  }
  if (type === 'binomial_dist' || type === 'poisson_dist' || type === 'normal_dist') {
    return <ProbabilityLab defaultTab="distributions" />;
  }
  if (type === 'markov_chain') {
    return <ProbabilityLab defaultTab="markov" />;
  }

  // State for raw data list
  const [dataPoints, setDataPoints] = useState<number[]>(initialData);
  const [inputVal, setInputVal] = useState<string>('');

  // State for Bayes
  const [priorA, setPriorA] = useState<number>(0.10);
  const [pBGivenA, setPBGivenA] = useState<number>(0.80);
  const [pBGivenNotA, setPBGivenNotA] = useState<number>(0.05);

  // State for Normal
  const [normMean, setNormMean] = useState<number>(100);
  const [normStd, setNormStd] = useState<number>(15);

  const handleAddDataPoint = () => {
    const num = parseFloat(inputVal);
    if (!isNaN(num)) {
      setDataPoints([...dataPoints, num]);
      setInputVal('');
    }
  };

  const handleRemoveDataPoint = (idx: number) => {
    setDataPoints(dataPoints.filter((_, i) => i !== idx));
  };

  const handleResetData = () => {
    setDataPoints(initialData);
  };

  // Render Mean/Median/Mode & Variance Interactives
  if (type === 'mean_median_mode' || type === 'variance_stddev') {
    const currentMean = mean(dataPoints);
    const currentMedian = median(dataPoints);
    const currentModes = mode(dataPoints);
    const currentStd = stdDev(dataPoints);

    // Chart dataset
    const chartData = dataPoints.map((val, idx) => ({
      name: `#${idx + 1}`,
      Değer: val,
      Ortalama: currentMean,
      Medyan: currentMedian,
    }));

    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
              <Calculator className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                {language === 'tr' ? 'İnteraktif Hesaplama Laboratuvarı' : 'Interactive Calculation Lab'}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'tr' ? 'Sayıları değiştir, canlı grafik ve istatistikleri gözlemle' : 'Modify numbers and observe live stats & graphs'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetData}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#ff7a00]" />
            <span>{language === 'tr' ? 'Sıfırla' : 'Reset'}</span>
          </button>
        </div>

        {/* Data inputs list */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[#ff7a00] block mb-2 tracking-wide">
            {language === 'tr' ? 'Veri Seti Sayıları:' : 'Dataset Values:'}
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {dataPoints.map((val, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-sm font-mono font-bold text-[#ff7a00] shadow-2xs"
              >
                <span>{val}</span>
                <button
                  onClick={() => handleRemoveDataPoint(idx)}
                  className="text-slate-400 hover:text-rose-600 ml-1.5 text-xs font-bold"
                  title="Sil"
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
              placeholder={language === 'tr' ? 'Yeni sayı ekle...' : 'Add new number...'}
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

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20">
            <span className="text-[11px] font-extrabold text-[#ff7a00] block mb-0.5 tracking-wide">Mean (Ortalama)</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentMean}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20">
            <span className="text-[11px] font-extrabold text-[#ff7a00] block mb-0.5 tracking-wide">Median (Medyan)</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentMedian}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20">
            <span className="text-[11px] font-extrabold text-[#ff7a00] block mb-0.5 tracking-wide">Mode (Mod)</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentModes.join(', ')}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20">
            <span className="text-[11px] font-extrabold text-[#ff7a00] block mb-0.5 tracking-wide">Std Dev (Std Sapma)</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentStd}</span>
          </div>
        </div>

        {/* Live Recharts Visualization with TanCoreLab Electric Orange Bars */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ff7a00', borderRadius: '12px', color: '#0f172a', fontFamily: 'Poppins' }}
              />
              <Bar dataKey="Değer" fill="#ff7a00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Render Bayes Rule Interactive
  if (type === 'bayes_rule') {
    const posterior = bayesRule(priorA, pBGivenA, pBGivenNotA);

    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
            <Sliders className="w-5 h-5" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
            {language === 'tr' ? 'Bayes Teoremi Simülatörü' : 'Bayes Theorem Simulator'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Ön Olasılık P(Spam): <span className="text-[#ff7a00] font-mono">{(priorA * 100).toFixed(0)}%</span>
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
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              P('FREE' | Spam): <span className="text-[#ff7a00] font-mono">{(pBGivenA * 100).toFixed(0)}%</span>
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
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              P('FREE' | Normal): <span className="text-[#ff7a00] font-mono">{(pBGivenNotA * 100).toFixed(0)}%</span>
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

        {/* Result Card */}
        <div className="p-5 rounded-2xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-center shadow-xs">
          <span className="text-xs text-[#ff7a00] font-bold uppercase tracking-wider block mb-1">
            Güncellenmiş Sonsal Olasılık P(Spam | 'FREE')
          </span>
          <span className="text-4xl font-black text-[#ff7a00] font-mono tracking-tight">{(posterior * 100).toFixed(1)}%</span>
        </div>
      </div>
    );
  }

  // Normal Distribution Bell Curve Interactive
  if (type === 'normal_dist') {
    const curvePoints = [];
    for (let x = normMean - 4 * normStd; x <= normMean + 4 * normStd; x += normStd / 5) {
      curvePoints.push({
        x: Math.round(x),
        Olasılık: normalPDF(x, normMean, normStd),
      });
    }

    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
            {language === 'tr' ? 'Normal Dağılım Çan Eğrisi' : 'Normal Distribution Bell Curve'}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Ortalama (µ): <span className="text-[#ff7a00] font-mono">{normMean}</span>
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
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Standart Sapma (σ): <span className="text-[#ff7a00] font-mono">{normStd}</span>
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
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curvePoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ff7a00', borderRadius: '12px', color: '#0f172a', fontFamily: 'Poppins' }}
              />
              <Line type="monotone" dataKey="Olasılık" stroke="#ff7a00" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Probability Coin Flip Interactive
  if (type === 'probability_coin') {
    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
            <Calculator className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              {language === 'tr' ? 'Olasılık & Parapara Atış Simülatörü' : 'Probability & Coin Flip Simulator'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'tr' ? 'Büyük Sayılar Yasası (Law of Large Numbers) Deneyi' : 'Law of Large Numbers Experiment'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center">
            <span className="text-xs font-bold text-slate-700 block mb-1">Teorik Olasılık P(Tura)</span>
            <span className="text-3xl font-black text-[#ff7a00] font-mono">%50.0</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs font-bold text-slate-700 block mb-1">Empirik Olasılık (1,000 Atış)</span>
            <span className="text-3xl font-black text-amber-700 font-mono">%49.8</span>
          </div>
        </div>
      </div>
    );
  }

  // Binomial Distribution Interactive
  if (type === 'binomial_dist') {
    const nVal = 20;
    const pVal = 0.4;
    const binomialPoints = [];
    for (let k = 0; k <= nVal; k++) {
      // nCr * p^k * (1-p)^(n-k)
      let comb = 1;
      for (let i = 1; i <= k; i++) comb = (comb * (nVal - i + 1)) / i;
      const prob = comb * Math.pow(pVal, k) * Math.pow(1 - pVal, nVal - k);
      binomialPoints.push({ k: `k=${k}`, Olasılık: parseFloat(prob.toFixed(4)) });
    }

    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              {language === 'tr' ? 'Binomial Dağılım Grafiği (n=20, p=0.4)' : 'Binomial Distribution PMF (n=20, p=0.4)'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              E(X) = n·p = 8.0, Var(X) = n·p·(1-p) = 4.8
            </p>
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
      </div>
    );
  }

  // Poisson Distribution Interactive
  if (type === 'poisson_dist') {
    const lambdaVal = 4;
    const poissonPoints = [];
    let fact = 1;
    for (let k = 0; k <= 12; k++) {
      if (k > 0) fact *= k;
      const prob = (Math.exp(-lambdaVal) * Math.pow(lambdaVal, k)) / fact;
      poissonPoints.push({ k: `k=${k}`, Olasılık: parseFloat(prob.toFixed(4)) });
    }

    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              {language === 'tr' ? 'Poisson Dağılımı (λ=4.0 Geliş/Saat)' : 'Poisson Distribution (λ=4.0 arrivals/hr)'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              E(X) = λ = 4.0, Var(X) = λ = 4.0
            </p>
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
      </div>
    );
  }

  // Sample Size & CLT Calculator
  if (type === 'sample_size') {
    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
            <Calculator className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              {language === 'tr' ? 'Örneklem Boyutu (Sample Size) & CLT Hesaplayıcı' : 'Sample Size & CLT Calculator'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              n = (z_α/2 · σ / E)² formülü ile gerekli örneklem hacmi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-extrabold text-slate-600 block mb-0.5">%95 Güven için Z</span>
            <span className="text-xl font-black text-slate-900 font-mono">1.96</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-extrabold text-slate-600 block mb-0.5">Kabul Edilebilir Hata (E)</span>
            <span className="text-xl font-black text-slate-900 font-mono">± 2.0</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/10 border border-[#ff7a00]/30">
            <span className="text-[11px] font-extrabold text-[#ff7a00] block mb-0.5">Gerekli Örneklem (n)</span>
            <span className="text-xl font-black text-[#ff7a00] font-mono">n ≥ 97</span>
          </div>
        </div>
      </div>
    );
  }

  // Confidence / Prediction / Tolerance Interval Calculator (CI vs PI vs TI)
  if (type === 'confidence_interval') {
    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
            <Calculator className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              {language === 'tr' ? 'Güven (CI), Tahmin (PI) ve Tolerans (TI) Aralıkları' : 'CI vs PI vs TI Calculator'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Kitle Ortalaması (µ), Tekil Gelecek Değer (X_n+1) ve Kitle Kapsamı
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
            <span className="text-xs font-black text-[#ff7a00] block mb-1">95% Confidence Interval (CI)</span>
            <span className="text-base font-bold text-slate-900 font-mono">(137.23, 139.71)</span>
            <span className="text-[10px] text-slate-500 block mt-1">Popülasyon ortalaması µ için</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-black text-amber-700 block mb-1">95% Prediction Interval (PI)</span>
            <span className="text-base font-bold text-slate-900 font-mono">(135.16, 141.78)</span>
            <span className="text-[10px] text-slate-500 block mt-1">Gelecek tekil pil X_n+1 için</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
            <span className="text-xs font-black text-slate-800 block mb-1">95% TI for 90% Coverage</span>
            <span className="text-base font-bold text-slate-900 font-mono">(123.32, 153.62)</span>
            <span className="text-[10px] text-slate-500 block mt-1">Ürünlerin %90'ını kapsama</span>
          </div>
        </div>
      </div>
    );
  }

  // Hypothesis Testing Z / T Calculator
  if (type === 'hypothesis_z_t') {
    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
            <Calculator className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              {language === 'tr' ? 'Hipotez Testi İstatistik Hesabı (Z / T Skoru & P-Value)' : 'Hypothesis Test Calculator (Z/T & P-Value)'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              H0: µ = 140.0 vs H1: µ ≠ 140.0 (α = 0.05)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-extrabold text-slate-600 block mb-0.5">Test İstatistiği (t0)</span>
            <span className="text-xl font-black text-slate-900 font-mono">-2.57</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-extrabold text-slate-600 block mb-0.5">Kritik Değer t_α/2,19</span>
            <span className="text-xl font-black text-slate-900 font-mono">± 2.093</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#ff7a00]/10 border border-[#ff7a00]/30">
            <span className="text-[11px] font-extrabold text-[#ff7a00] block mb-0.5">P-Value</span>
            <span className="text-xl font-black text-[#ff7a00] font-mono">0.0187</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-extrabold text-emerald-700 block mb-0.5">Karar</span>
            <span className="text-sm font-black text-emerald-800 uppercase">Reject H0</span>
          </div>
        </div>
      </div>
    );
  }

  // Correlation & Regression Calculator
  if (type === 'correlation_regression') {
    return (
      <div className="my-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              {language === 'tr' ? 'Regresyon & Korelasyon Analizi (SLR / MLR)' : 'Regression & Correlation Analysis'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Fitted Model: ŷ = b0 + b1·x, ANOVA Tablosu & Düzeltilmiş R²
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-extrabold text-slate-600 block mb-0.5">Korelasyon (r_xy)</span>
            <span className="text-xl font-black text-slate-900 font-mono">0.912</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-extrabold text-slate-600 block mb-0.5">Belirtlilik (R²)</span>
            <span className="text-xl font-black text-slate-900 font-mono">%83.2</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200">
            <span className="text-[11px] font-extrabold text-[#ff7a00] block mb-0.5">Düzeltilmiş R² (Adj R²)</span>
            <span className="text-xl font-black text-[#ff7a00] font-mono">%81.8</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-extrabold text-emerald-700 block mb-0.5">Model ANOVA F</span>
            <span className="text-xl font-black text-emerald-800 font-mono">F = 44.5*</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

