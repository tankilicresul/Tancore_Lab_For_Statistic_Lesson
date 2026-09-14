import React, { useState } from 'react';
import { mean, median, mode, variance, stdDev, bayesRule, normalPDF } from '../utils/stats';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sliders, RefreshCw, Calculator, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface InteractiveCalcProps {
  type?: string;
  initialData?: number[];
}

export const InteractiveCalc: React.FC<InteractiveCalcProps> = ({
  type = 'mean_median_mode',
  initialData = [10, 12, 12, 15, 9, 50],
}) => {
  const { language } = useAppStore();

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
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-700 border border-amber-500/30">
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
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'tr' ? 'Sıfırla' : 'Reset'}</span>
          </button>
        </div>

        {/* Data inputs list */}
        <div className="mb-5">
          <label className="text-xs font-bold text-amber-800 block mb-2 tracking-wide">
            {language === 'tr' ? 'Veri Seti Sayıları:' : 'Dataset Values:'}
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {dataPoints.map((val, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-300 text-sm font-mono font-bold text-amber-800 shadow-2xs"
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
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-500 w-48 font-medium"
              onKeyDown={(e) => e.key === 'Enter' && handleAddDataPoint()}
            />
            <button
              onClick={handleAddDataPoint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-black text-xs rounded-xl transition-colors shadow-md shadow-amber-500/20 uppercase tracking-wide"
            >
              {language === 'tr' ? 'Ekle' : 'Add'}
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-200">
            <span className="text-[11px] font-extrabold text-amber-800 block mb-0.5 tracking-wide">Mean (Ortalama)</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentMean}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-200">
            <span className="text-[11px] font-extrabold text-amber-800 block mb-0.5 tracking-wide">Median (Medyan)</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentMedian}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-200">
            <span className="text-[11px] font-extrabold text-amber-800 block mb-0.5 tracking-wide">Mode (Mod)</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentModes.join(', ')}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-200">
            <span className="text-[11px] font-extrabold text-amber-800 block mb-0.5 tracking-wide">Std Dev (Std Sapma)</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{currentStd}</span>
          </div>
        </div>

        {/* Live Recharts Visualization with Warm Amber Bars */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f59e0b', borderRadius: '12px', color: '#0f172a', fontFamily: 'Poppins' }}
              />
              <Bar dataKey="Değer" fill="#f59e0b" radius={[8, 8, 0, 0]} />
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
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 border border-amber-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
            {language === 'tr' ? 'Bayes Teoremi Simülatörü' : 'Bayes Theorem Simulator'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Ön Olasılık P(Spam): <span className="text-amber-700 font-mono">{(priorA * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.99"
              step="0.01"
              value={priorA}
              onChange={(e) => setPriorA(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              P('FREE' | Spam): <span className="text-amber-700 font-mono">{(pBGivenA * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.99"
              step="0.01"
              value={pBGivenA}
              onChange={(e) => setPBGivenA(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              P('FREE' | Normal): <span className="text-amber-700 font-mono">{(pBGivenNotA * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.99"
              step="0.01"
              value={pBGivenNotA}
              onChange={(e) => setPBGivenNotA(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Result Card */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300 text-center shadow-xs">
          <span className="text-xs text-amber-800 font-bold uppercase tracking-wider block mb-1">
            Güncellenmiş Sonsal Olasılık P(Spam | 'FREE')
          </span>
          <span className="text-4xl font-black text-amber-600 font-mono tracking-tight">{(posterior * 100).toFixed(1)}%</span>
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
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 border border-amber-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
            {language === 'tr' ? 'Normal Dağılım Çan Eğrisi' : 'Normal Distribution Bell Curve'}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Ortalama (µ): <span className="text-amber-700 font-mono">{normMean}</span>
            </label>
            <input
              type="range"
              min="50"
              max="150"
              value={normMean}
              onChange={(e) => setNormMean(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500"
            />
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Standart Sapma (σ): <span className="text-amber-700 font-mono">{normStd}</span>
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={normStd}
              onChange={(e) => setNormStd(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500"
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
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f59e0b', borderRadius: '12px', color: '#0f172a', fontFamily: 'Poppins' }}
              />
              <Line type="monotone" dataKey="Olasılık" stroke="#f59e0b" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
};
