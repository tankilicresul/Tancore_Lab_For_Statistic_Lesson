import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { ComposedChart, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, Line, Area, ResponsiveContainer } from 'recharts';

// Build two overlapping density histograms from raw groupA/groupB arrays
function buildHypothesisChartData(data: any[]) {
  if (!data.length) return [];
  const allA = data.map((d: any) => d.groupA);
  const allB = data.map((d: any) => d.groupB);
  const allVals = [...allA, ...allB];
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const bins = 30;
  const step = (max - min) / bins;
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

export function SimulationsPanel({ sim }: { sim: any }) {
  const { selectedModel, setSelectedModel, params, setParams, simData, metrics, randomizeData, resetParams } = sim;

  return (
    <Card className="shadow-2xl rounded-[1.5rem] border-0 bg-[#FAF7EF] h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold" style={{ color: '#4B232D' }}>Simülasyonlar</CardTitle>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px] bg-white border-[#F5AE50]/50 shadow-sm focus:ring-[#F5AE50] font-medium text-[#232323]">
              <SelectValue placeholder="Model Seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="logistic">Lojistik Regresyon</SelectItem>
              <SelectItem value="linear">Lineer Regresyon</SelectItem>
              <SelectItem value="normal">Normal Dağılım</SelectItem>
              <SelectItem value="hypothesis">Hipotez Testi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col">
        
        {/* Chart Area */}
        <div className="h-[320px] w-full bg-white rounded-[1.25rem] p-4 shadow-inner border border-[#F5AE50]/20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            {selectedModel === 'logistic' ? (
              <ComposedChart data={simData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#ccc" />
                <XAxis dataKey="x" type="number" name="Model Output" domain={[-20, 20]} stroke="#666" />
                <YAxis dataKey="y" name="Probability" domain={[0, 1]} stroke="#666" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Scatter name="0's (Reddet)" data={simData.filter((d: any) => d.y === 0)} fill="#EF4444" />
                <Scatter name="1's (Kabul)" data={simData.filter((d: any) => d.y === 1)} fill="#2563EB" />
                <Line type="monotone" dataKey="p" stroke="#4B232D" strokeWidth={3} dot={false} name="Sigmoid" />
              </ComposedChart>
            ) : selectedModel === 'linear' ? (
              <ComposedChart data={simData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#ccc" />
                <XAxis dataKey="x" type="number" name="X" domain={[-10, 10]} stroke="#666" />
                <YAxis dataKey="y" name="Y" stroke="#666" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Scatter name="Veri Noktaları" data={simData} fill="#2563EB" />
                <Line type="monotone" dataKey="cleanY" stroke="#F5AE50" strokeWidth={4} dot={false} name="Regresyon Doğrusu" />
              </ComposedChart>
            ) : selectedModel === 'normal' ? (
              <AreaChart data={simData.map((d: any) => ({ bin: Math.round(d.value), count: 1 })).reduce((acc: any[], curr: any) => {
                const existing = acc.find(a => a.bin === curr.bin);
                if (existing) existing.count += 1;
                else acc.push(curr);
                return acc;
              }, []).sort((a: any, b: any) => a.bin - b.bin)}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#ccc" />
                <XAxis dataKey="bin" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#F5AE50" strokeWidth={3} fill="#F5AE50" fillOpacity={0.4} />
              </AreaChart>
            ) : (
              <AreaChart data={buildHypothesisChartData(simData)}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#ccc" />
                <XAxis dataKey="x" stroke="#666" tick={{ fontSize: 11 }} />
                <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="A" name="Grup A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.35} strokeWidth={2} />
                <Area type="monotone" dataKey="B" name="Grup B" stroke="#EF4444" fill="#EF4444" fillOpacity={0.35} strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Controls */}
        <div className="space-y-5 bg-white p-5 rounded-[1.25rem] shadow-sm border border-[#F5AE50]/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold flex justify-between text-[#232323]">
                <span>Örneklem Sayısı</span>
                <span className="text-[#F5AE50]">{params.n}</span>
              </label>
              <Slider min={50} max={500} step={10} value={[params.n]} onValueChange={([v]) => setParams({...params, n: v})} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold flex justify-between text-[#232323]">
                <span>Gürültü Seviyesi</span>
                <span className="text-[#F5AE50]">{params.noise}</span>
              </label>
              <Slider min={0} max={3} step={0.1} value={[params.noise]} onValueChange={([v]) => setParams({...params, noise: v})} />
            </div>
            
            {/* Conditional controls based on selected model */}
            {selectedModel === 'logistic' && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-semibold flex justify-between text-[#232323]"><span>Eğim (Slope)</span><span className="text-[#F5AE50]">{params.slope}</span></label>
                  <Slider min={-3} max={3} step={0.1} value={[params.slope]} onValueChange={([v]) => setParams({...params, slope: v})} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold flex justify-between text-[#232323]"><span>Karar Eşiği</span><span className="text-[#F5AE50]">{params.threshold}</span></label>
                  <Slider min={0.1} max={0.9} step={0.1} value={[params.threshold]} onValueChange={([v]) => setParams({...params, threshold: v})} />
                </div>
              </>
            )}
            
            {selectedModel === 'linear' && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-semibold flex justify-between text-[#232323]"><span>Eğim (Slope)</span><span className="text-[#F5AE50]">{params.slope}</span></label>
                  <Slider min={-5} max={5} step={0.1} value={[params.slope]} onValueChange={([v]) => setParams({...params, slope: v})} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold flex justify-between text-[#232323]"><span>Kesişim (Intercept)</span><span className="text-[#F5AE50]">{params.intercept}</span></label>
                  <Slider min={-10} max={10} step={0.5} value={[params.intercept]} onValueChange={([v]) => setParams({...params, intercept: v})} />
                </div>
              </>
            )}

            {selectedModel === 'normal' && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-semibold flex justify-between text-[#232323]"><span>Ortalama (Mean)</span><span className="text-[#F5AE50]">{params.mean}</span></label>
                  <Slider min={-5} max={5} step={0.1} value={[params.mean]} onValueChange={([v]) => setParams({...params, mean: v})} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold flex justify-between text-[#232323]"><span>Standart Sapma</span><span className="text-[#F5AE50]">{params.std}</span></label>
                  <Slider min={0.5} max={5} step={0.1} value={[params.std]} onValueChange={([v]) => setParams({...params, std: v})} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          {Object.entries(metrics).map(([key, val]) => (
            <div key={key} className="bg-white p-3 rounded-[1rem] border border-[#F5AE50]/20 shadow-sm text-center transform transition-transform hover:-translate-y-1">
              <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">{key}</div>
              <div className="text-xl font-bold text-[#4B232D]">{val as string}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 shrink-0">
          <Button onClick={randomizeData} className="flex-1 bg-[#F5AE50] hover:bg-[#e09e45] text-[#232323] font-bold shadow-md rounded-xl text-md h-12">Simülasyonu Çalıştır</Button>
          <Button onClick={randomizeData} variant="outline" className="flex-1 border-[#F5AE50] text-[#4B232D] hover:bg-[#F5AE50]/10 font-bold rounded-xl h-12">Rastgele Veri Üret</Button>
          <Button onClick={resetParams} variant="ghost" className="flex-none text-gray-500 hover:text-gray-800 rounded-xl h-12 px-4">Sıfırla</Button>
        </div>

        {/* Advanced Models */}
        <div className="mt-auto pt-4 border-t border-[#F5AE50]/20">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white/60 rounded-[1rem] hover:bg-white transition-colors">
              <span className="font-bold text-[#4B232D]">Gelişmiş Modeller (Yakında)</span>
              <ChevronDown className="h-5 w-5 text-[#F5AE50]" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="flex flex-wrap gap-2">
                {['Çoklu Regresyon', 'Polinom', 'Ridge', 'Lasso', 'Zaman Serisi', 'Monte Carlo'].map(m => (
                  <Badge key={m} variant="secondary" className="bg-white text-gray-500 border border-gray-200">
                    {m} <span className="ml-1 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">Yakında</span>
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