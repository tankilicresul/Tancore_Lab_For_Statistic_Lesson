import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { ComposedChart, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, Line, Area, Bar, Cell, ReferenceLine, ResponsiveContainer } from 'recharts';

// Build overlapping density histograms for Hypothesis test
function buildHypothesisChartData(data: any[]) {
  if (!data || !data.length) return [];
  const allA = data.map((d: any) => d.groupA);
  const allB = data.map((d: any) => d.groupB);
  const allVals = [...allA, ...allB];
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const bins = 30;
  const step = (max - min) / bins || 1;
  const result: { x: number; A: number; B: number }[] = [];
  for (let i = 0; i <= bins; i++) {
    const lo = min + i * step;
    const hi = lo + step;
    result.push({
      x: Number((lo + step / 2).toFixed(2)),
      A: allA.filter(v => v >= lo && v < hi).length,
      B: allB.filter(v => v >= lo && v < hi).length,
    });
  }
  return result;
}

// Build histogram data for normal distribution
function buildNormalHistogramData(data: any[]) {
  if (!data || !data.length) return [];
  const vals = data.map((d: any) => d.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const bins = 20;
  const step = (max - min) / bins || 1;
  const result = [];
  for (let i = 0; i < bins; i++) {
    const lo = min + i * step;
    const hi = lo + step;
    const center = lo + step / 2;
    const count = vals.filter(v => v >= lo && v < hi).length;
    result.push({
      x: Number(center.toFixed(2)),
      'Veri Sıklığı': count
    });
  }
  return result;
}

export function SimulationsPanel({ sim }: { sim: any }) {
  const { selectedModel, setSelectedModel, params, setParams, simData, metrics, randomizeData, resetParams } = sim;
  const [normalSubMode, setNormalSubMode] = useState<'dist' | 'ci'>('dist');
  const [selectedShooter, setSelectedShooter] = useState<number>(0);

  // Model explanation helpers for educational widgets
  const getModelExplanationText = () => {
    switch (selectedModel) {
      case 'logistic':
        return 'Lojistik Regresyon: X eksenindeki değişimler sigmoid eğrisiyle 0 ile 1 aralığında olasılıklara dönüştürülür. Eğim (Slope) arttıkça olasılık geçişi daha dik hale gelir.';
      case 'linear':
        return "Lineer Regresyon: X ile Y arasındaki doğrusal ilişkiyi gösterir. Eğim (Slope), X arttığında Y'nin nasıl değişeceğini belirtir. Gürültü (Noise) arttıkça noktalar doğrudan uzaklaşır.";
      case 'normal':
        return normalSubMode === 'dist' 
          ? 'Normal Dağılım: Verilerin ortalama (μ) etrafında simetrik çan eğrisi şeklinde yayılımıdır. Standart Sapma (σ) arttıkça çan eğrisi basıklaşır ve yayılır.'
          : 'Güven Aralığı (CI): Simüle edilen 25 örneklem aralığından gerçek μ değerini (kırmızı çizgi) kapsayanlar yeşil, ıskalayanlar kırmızıyla gösterilmiştir.';
      case 'hypothesis':
        return 'Hipotez Testi: İki grubun dağılım çakışmasıdır. Aralarındaki fark (Diff) arttıkça dağılümlar birbirinden uzaklaşır ve anlamlılık (p-değeri) düşer (H₀ reddedilir).';
      case 'error_propagation':
        return 'Hata Yayılımı (Atıcı): Atış koordinatlarının hedeften sapma analizidir. Varyans belirsizliği (dağılım çapını), Bias ise hedeften ortalama kaymayı gösterir.';
      case 'clt':
        return 'Merkezi Limit Teoremi: Örneklem ortalamalarının dağılımıdır. Örneklem boyutu (n) büyüdükçe bu dağılım teorik normal eğriye (çan eğrisi) yakınsar.';
      case 'qq_plot':
        return 'Q-Q Grafiği: Verilerin normal dağılıma uyumunu test eder. Noktalar referans çizgisine ne kadar yakınsa, veri o kadar normal dağılımlıdır.';
      default:
        return 'Bu grafik seçili istatistiksel modelin parametreler doğrultusundaki reaktif çıktısını temsil eder.';
    }
  };

  const getMetricShortLabel = (key: string) => {
    switch (key) {
      case 'R²': return 'açıklama gücü';
      case 'MSE': return 'tahmin hatası';
      case 'MAE': return 'mutlak hata';
      case 'Accuracy': return 'doğruluk';
      case 'Precision': return 'keskinlik';
      case 'Recall': return 'duyarlılık';
      case 'p-değer': return 'anlamlılık';
      case 'Test İstatistiği': return 'z-stat';
      case 'Kapsama Oranı': return 'kapsama';
      case 'Kritik Z Değeri': return 'z-skor';
      case 'İdeal Genişlik (w)': return 'ci-en';
      case 'Eğim (reg)': return 'eğim';
      case 'Kesişim (reg)': return 'kesişim';
      case 'X̄ Simüle Ortalama': return 'ortalama';
      case 'Simüle Hata (SE)': return 'standart hata';
      default: return 'metrik';
    }
  };

  const getMetricTooltip = (key: string) => {
    switch (key) {
      case 'R²': return 'Modelin açıklama gücü. 1.000 ideal uyumu gösterir.';
      case 'MSE': return 'Ortalama tahmin hatasının karesi. Düşük olması iyidir.';
      case 'MAE': return 'Ortalama mutlak hata derecesi.';
      case 'Accuracy': return 'Doğru tahminlerin toplam veriye oranı.';
      case 'p-değer': return 'İstatistiksel anlamlılık göstergesi. 0.05 altı anlamlı kabul edilir.';
      case 'Kapsama Oranı': return 'Güven aralıklarının ne kadarının gerçek μ değerini içerdiğini gösterir.';
      default: return '';
    }
  };

  const getWarningMessage = () => {
    if (selectedModel === 'clt' && params.cltSampleSize && params.cltSampleSize <= 5) {
      return `Düşük örneklem boyutu (n = ${params.cltSampleSize}) ortalamaların normal dağılıma yakınsamasını zorlaştırabilir. Teoremin çan eğrisini görmek için örneklem boyutunu artırmayı deneyin.`;
    }
    if (selectedModel === 'normal' && params.n && params.n <= 15) {
      return `Düşük örneklem sayısı (n = ${params.n}) çan eğrisi histogramında düzensiz barlara yol açabilir veya güven aralıklarının hata payını çok genişletebilir.`;
    }
    if ((selectedModel === 'linear' || selectedModel === 'logistic' || selectedModel === 'qq_plot') && params.n && params.n <= 25) {
      return `Küçük veri kümesi boyutu (n = ${params.n}) modelin istatistiksel genellenebilirliğini ve metrik kararlılığını azaltabilir.`;
    }
    return null;
  };

  return (
    <Card className="shadow-2xl rounded-[1.5rem] border-0 bg-[#FAF7EF] h-full flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-xl md:text-2xl font-bold" style={{ color: '#4B232D' }}>
              Simülasyonlar
            </CardTitle>
            
            {selectedModel === 'normal' && (
              <div className="flex gap-1.5 bg-white/60 p-1 rounded-xl border border-gray-200/50 shadow-sm text-xs">
                <button
                  type="button"
                  onClick={() => setNormalSubMode('dist')}
                  className={`px-3 py-1 font-bold rounded-lg transition-all ${normalSubMode === 'dist' ? 'bg-[#F5AE50] text-[#232323] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Dağılım
                </button>
                <button
                  type="button"
                  onClick={() => setNormalSubMode('ci')}
                  className={`px-3 py-1 font-bold rounded-lg transition-all ${normalSubMode === 'ci' ? 'bg-[#F5AE50] text-[#232323] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  CI (Güven Aralığı)
                </button>
              </div>
            )}

            <Select value={selectedModel} onValueChange={(v: any) => setSelectedModel(v)}>
              <SelectTrigger className="w-[180px] bg-white border-[#F5AE50]/50 shadow-sm focus:ring-[#F5AE50] font-medium text-[#232323] rounded-xl">
                <SelectValue placeholder="Model Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="error_propagation">Hata Yayılımı & Shooter</SelectItem>
                <SelectItem value="hypothesis">Hipotez Testi (Z/t)</SelectItem>
                <SelectItem value="linear">Lineer Regresyon</SelectItem>
                <SelectItem value="logistic">Lojistik Regresyon</SelectItem>
                <SelectItem value="clt">Merkezi Limit Teoremi</SelectItem>
                <SelectItem value="normal">Normal Dağılım & CI</SelectItem>
                <SelectItem value="qq_plot">Olasılık Grafiği (Q-Q)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-[11px] text-[#4B232D]/70 font-semibold select-none">
            Bu grafik, seçili modelin ürettiği veri dağılımini ve parametrelerin sonuç üzerindeki etkisini gösterir.
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 flex flex-col overflow-y-auto pr-1">
        
        {/* Chart Area */}
        <div className="h-[250px] w-full bg-white rounded-[1.25rem] p-3 shadow-inner border border-[#F5AE50]/20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            {selectedModel === 'logistic' ? (
              <ComposedChart data={simData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#ccc" />
                <XAxis dataKey="x" type="number" name="Model Output" domain={[-20, 20]} stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Scatter name="Veri Noktaları" dataKey="y" fill="#F5AE50" line={false} />
                <Line name="Sigmoid Olasılık" dataKey="p" stroke="#4B232D" strokeWidth={3} dot={false} activeDot={false} />
              </ComposedChart>
            ) : selectedModel === 'linear' ? (
              <ComposedChart data={simData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#ccc" />
                <XAxis dataKey="x" type="number" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Scatter name="Gözlenen Değerler" dataKey="y" fill="#4B232D" line={false} />
                <Line name="Regresyon Doğrusu" dataKey="cleanY" stroke="#F5AE50" strokeWidth={3} dot={false} activeDot={false} />
              </ComposedChart>
            ) : selectedModel === 'normal' ? (
              normalSubMode === 'dist' ? (
                <ComposedChart data={buildNormalHistogramData(simData.histogramData)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="x" type="number" stroke="#666" domain={['auto', 'auto']} />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Bar name="Veri Sıklığı" dataKey="Veri Sıklığı" fill="#F5AE50" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              ) : (
                <ComposedChart data={simData.intervals} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" domain={['auto', 'auto']} stroke="#666" />
                  <YAxis dataKey="id" type="category" stroke="#666" width={20} tickFormatter={(v) => `#${v}`} />
                  <Tooltip />
                  <ReferenceLine x={params.mean} stroke="red" strokeWidth={2} strokeDasharray="3 3" label={{ value: 'μ', position: 'top', fill: 'red' }} />
                  <Bar name="Güven Aralığı" dataKey="range" barSize={3}>
                    {simData.intervals.map((entry: any, index: number) => {
                      return <Cell key={`cell-${index}`} fill={entry.covers ? "#16A34A" : "#DC2626"} />;
                    })}
                  </Bar>
                  <Scatter name="Örneklem Ortalaması (X̄)" dataKey="mean" fill="#4B232D" />
                </ComposedChart>
              )
            ) : selectedModel === 'hypothesis' ? (
              <AreaChart data={buildHypothesisChartData(simData)}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#ccc" />
                <XAxis dataKey="x" stroke="#666" tick={{ fontSize: 11 }} />
                <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="A" name="Grup A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.35} strokeWidth={2} />
                <Area type="monotone" dataKey="B" name="Grup B" stroke="#EF4444" fill="#EF4444" fillOpacity={0.35} strokeWidth={2} />
              </AreaChart>
            ) : selectedModel === 'error_propagation' ? (
              <ComposedChart data={simData[selectedShooter]?.shots}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="x" type="number" domain={[-3, 3]} stroke="#666" />
                <YAxis dataKey="y" type="number" domain={[-3, 3]} stroke="#666" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <ReferenceLine x={0} stroke="#ccc" />
                <ReferenceLine y={0} stroke="#ccc" />
                <Scatter name="Atış Koordinatları" dataKey="y" fill={selectedShooter === 0 ? "#EF4444" : selectedShooter === 1 ? "#2563EB" : "#16A34A"} />
              </ComposedChart>
            ) : selectedModel === 'clt' ? (
              <ComposedChart data={simData.bins}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="binCenter" type="number" domain={['auto', 'auto']} stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Bar name="Simüle Ortalamalar" dataKey="Simüle Ortalamalar" fill="#F5AE50" radius={[4, 4, 0, 0]} />
                <Line name="Teorik Limit (Normal)" dataKey="Teorik Limit (Normal)" stroke="#4B232D" strokeWidth={3} dot={false} activeDot={false} type="monotone" />
              </ComposedChart>
            ) : (
              <ComposedChart data={simData.qqData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="z" type="number" domain={[-3, 3]} stroke="#666" />
                <YAxis dataKey="value" type="number" stroke="#666" />
                <Tooltip />
                <Legend />
                <Scatter name="Gözlem Noktaları" dataKey="value" fill="#4B232D" />
                <Line name="Referans Çizgisi" dataKey="Teorik Çizgi" stroke="#16A34A" strokeWidth={2} dot={false} activeDot={false} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Model Yorumu ve Canlı Metrikler Bilgi Kartı */}
        <div className="bg-white border border-[#F5AE50]/20 p-3.5 rounded-[1.25rem] shadow-sm shrink-0 space-y-2.5 select-none">
          <div className="text-[10px] font-bold text-[#4B232D] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5AE50]" /> Model Yorumu & Canlı Metrikler
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            {getModelExplanationText()}
          </p>
          
          {/* Metrikler listesi ve kısa açıklamaları */}
          {metrics && Object.keys(metrics).length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-gray-100/50">
              {Object.entries(metrics).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center text-[10px] bg-gray-50/50 p-1.5 rounded-lg border border-gray-100/30">
                  <span className="text-gray-500 font-bold" title={getMetricTooltip(key)}>
                    {key} <span className="text-[8px] font-normal text-gray-400">({getMetricShortLabel(key)})</span>:
                  </span>
                  <span className="font-mono font-bold text-gray-800">{val as string}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Parametre Uç Değer / Düşük Gözlem Uyarısı */}
        {getWarningMessage() && (
          <div className="bg-orange-50 border border-orange-100 p-2.5 rounded-xl text-[10px] text-orange-700 leading-relaxed select-none">
            <strong>Not / Uyarı:</strong> {getWarningMessage()} Parametreleri değiştirerek dağılımı daha düzgün gözlemleyebilirsiniz.
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4 bg-white p-4 rounded-[1.25rem] shadow-sm border border-[#F5AE50]/10 shrink-0">
          {(selectedModel === 'logistic' || selectedModel === 'linear') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Örneklem Sayısı</span>
                  <span className="text-[#F5AE50]">{params.n}</span>
                </label>
                <Slider min={50} max={300} step={10} value={[params.n]} onValueChange={([v]) => setParams({...params, n: v})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Gürültü Seviyesi</span>
                  <span className="text-[#F5AE50]">{params.noise}</span>
                </label>
                <Slider min={0.1} max={3} step={0.1} value={[params.noise]} onValueChange={([v]) => setParams({...params, noise: v})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Eğim (Slope)</span>
                  <span className="text-[#F5AE50]">{params.slope}</span>
                </label>
                <Slider min={-2} max={2} step={0.05} value={[params.slope]} onValueChange={([v]) => setParams({...params, slope: v})} />
              </div>
              {selectedModel === 'logistic' ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold flex justify-between text-[#232323]">
                    <span>Karar Eşiği</span>
                    <span className="text-[#F5AE50]">{params.threshold}</span>
                  </label>
                  <Slider min={0.1} max={0.9} step={0.05} value={[params.threshold]} onValueChange={([v]) => setParams({...params, threshold: v})} />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-semibold flex justify-between text-[#232323]">
                    <span>Sabit (Intercept)</span>
                    <span className="text-[#F5AE50]">{params.intercept}</span>
                  </label>
                  <Slider min={-5} max={5} step={0.1} value={[params.intercept]} onValueChange={([v]) => setParams({...params, intercept: v})} />
                </div>
              )}
            </div>
          )}

          {selectedModel === 'normal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Gerçek Ortalama (μ)</span>
                  <span className="text-[#F5AE50]">{params.mean}</span>
                </label>
                <Slider min={-5} max={5} step={0.5} value={[params.mean]} onValueChange={([v]) => setParams({...params, mean: v})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Std. Sapma (σ)</span>
                  <span className="text-[#F5AE50]">{params.std}</span>
                </label>
                <Slider min={0.5} max={3} step={0.1} value={[params.std]} onValueChange={([v]) => setParams({...params, std: v})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Örneklem Sayısı (n)</span>
                  <span className="text-[#F5AE50]">{params.n}</span>
                </label>
                <Slider min={10} max={200} step={5} value={[params.n]} onValueChange={([v]) => setParams({...params, n: v})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#232323] block">Güven (% CI)</label>
                  <Select value={(params.confidence ?? 0.95).toString()} onValueChange={(v) => setParams({...params, confidence: parseFloat(v)})}>
                    <SelectTrigger className="h-8 text-xs bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.90">90% CI</SelectItem>
                      <SelectItem value="0.95">95% CI</SelectItem>
                      <SelectItem value="0.99">99% CI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#232323] block">Hedef Genişlik (w)</label>
                  <Select value={(params.ciWidth ?? 0.8).toString()} onValueChange={(v) => setParams({...params, ciWidth: parseFloat(v)})}>
                    <SelectTrigger className="h-8 text-xs bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.4">w = 0.4</SelectItem>
                      <SelectItem value="0.6">w = 0.6</SelectItem>
                      <SelectItem value="0.8">w = 0.8</SelectItem>
                      <SelectItem value="1.0">w = 1.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {selectedModel === 'hypothesis' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Grup Farkı (Diff)</span>
                  <span className="text-[#F5AE50]">{params.meanDiff}</span>
                </label>
                <Slider min={0} max={3} step={0.1} value={[params.meanDiff]} onValueChange={([v]) => setParams({...params, meanDiff: v})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Anlamlılık Seviyesi (α)</span>
                  <span className="text-[#F5AE50]">{params.alpha}</span>
                </label>
                <Slider min={0.01} max={0.1} step={0.01} value={[params.alpha]} onValueChange={([v]) => setParams({...params, alpha: v})} />
              </div>
            </div>
          )}

          {selectedModel === 'error_propagation' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#232323] block">
                Atıcı (Tahmin Edici) Karşılaştırması
              </label>
              <div className="flex gap-2">
                {['Atıcı 1', 'Atıcı 2', 'Atıcı 3'].map((label, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    variant={selectedShooter === idx ? 'default' : 'outline'}
                    className={`flex-1 text-[11px] font-bold rounded-lg h-9 transition-colors ${selectedShooter === idx ? 'bg-[#F5AE50] text-[#232323] hover:bg-[#e09e45]' : 'border-gray-200 text-gray-600'}`}
                    onClick={() => setSelectedShooter(idx)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 italic mt-1 text-center">
                Atıcı 1: Düşük Varyans, Yüksek Sapma | Atıcı 2: Yüksek Varyans, Sıfır Sapma | Atıcı 3: İdeal Tahminci.
              </p>
            </div>
          )}

          {selectedModel === 'clt' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#232323] block">
                  Kaynak Dağılımı
                </label>
                <Select value={params.cltSource ?? 'uniform'} onValueChange={(v) => setParams({...params, cltSource: v})}>
                  <SelectTrigger className="h-8 text-xs bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uniform">Uniform (10, 70)</SelectItem>
                    <SelectItem value="binomial">Binomial (100, 0.5)</SelectItem>
                    <SelectItem value="poisson">Poisson (27)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Örneklem Boyutu (n)</span>
                  <span className="text-[#F5AE50]">{params.cltSampleSize ?? 30}</span>
                </label>
                <Slider min={2} max={100} step={2} value={[params.cltSampleSize ?? 30]} onValueChange={([v]) => setParams({...params, cltSampleSize: v})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Simülasyon Adedi (M)</span>
                  <span className="text-[#F5AE50]">{params.cltSamplesCount ?? 200}</span>
                </label>
                <Slider min={50} max={300} step={25} value={[params.cltSamplesCount ?? 200]} onValueChange={([v]) => setParams({...params, cltSamplesCount: v})} />
              </div>
              <div className="text-[11px] text-gray-500 italic flex items-center justify-center p-2 text-center">
                M adet örneklem ortalamasının limit dağılımı (CLT) teorik normal eğri ile kıyaslanır.
              </div>
            </div>
          )}

          {selectedModel === 'qq_plot' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#232323] block">
                  Dağılım Tipi
                </label>
                <Select value={params.qqDistribution ?? 'normal'} onValueChange={(v) => setParams({...params, qqDistribution: v})}>
                  <SelectTrigger className="h-8 text-xs bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Dağılım</SelectItem>
                    <SelectItem value="skewed">Sağa Çarpık</SelectItem>
                    <SelectItem value="heavy">Ağır Kuyruklu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold flex justify-between text-[#232323]">
                  <span>Örneklem Adedi (n)</span>
                  <span className="text-[#F5AE50]">{params.n}</span>
                </label>
                <Slider min={15} max={150} step={5} value={[params.n]} onValueChange={([v]) => setParams({...params, n: v})} />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button onClick={randomizeData} className="bg-[#4B232D] hover:bg-[#3d1c24] text-white font-bold rounded-xl shadow-md flex-1">
            Simülasyonu Çalıştır
          </Button>
          <Button onClick={randomizeData} variant="outline" className="border-gray-300 hover:bg-gray-50 font-bold text-gray-700 rounded-xl">
            Rastgele Veri Üret
          </Button>
          <Button onClick={resetParams} variant="ghost" className="text-gray-500 hover:text-gray-900 rounded-xl">
            Sıfırla
          </Button>
        </div>

        {/* Collapsible Block */}
        <div className="mt-auto pt-2 border-t border-[#F5AE50]/20">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2.5 bg-white/60 rounded-[1rem] hover:bg-white transition-colors text-sm">
              <span className="font-bold text-[#4B232D]">Gelişmiş Modeller (Yakında)</span>
              <ChevronDown className="h-4 w-4 text-[#F5AE50]" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="flex flex-wrap gap-1.5">
                {['Çoklu Regresyon', 'Ridge', 'Lasso', 'Zaman Serisi', 'Monte Carlo'].map(m => (
                  <Badge key={m} variant="secondary" className="bg-white text-[10px] text-gray-500 border border-gray-200 py-0.5 px-2">
                    {m} <span className="ml-1 text-[8px] bg-gray-100 px-1 py-0.2 rounded text-gray-400">Yakında</span>
                  </Badge>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}