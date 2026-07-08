import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Code, Laptop, Bot, Send, User, Play, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CodePanel({ sim }: { sim: any }) {
  const { getCode, selectedModel, params, metrics, simData } = sim;
  const [activeTab, setActiveTab] = useState<'code' | 'ai'>('code');
  const [lang, setLang] = useState<'python' | 'r' | 'sql' | 'javascript'>('python');
  const { toast } = useToast();

  // Local execution state for Jupyter-like behavior
  const [localExecutionCount, setLocalExecutionCount] = useState<number>(0);
  const [localConsoleLogs, setLocalConsoleLogs] = useState<string[]>([]);

  // Original Chatbot states
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Merhaba! Ben StatSim AI. Hangi istatistiksel modeli simüle etmek istiyorsun? Normal dağılım, güven aralığı, hipotez testi, lineer regresyon veya lojistik regresyonla başlayabiliriz.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeTab]);

  const [editedCode, setEditedCode] = useState<string>('');

  useEffect(() => {
    setEditedCode(getCode(lang));
  }, [lang, selectedModel, getCode]);

  useEffect(() => {
    // Reset local logs and counter ONLY when switching model or language to keep cell state clean
    setLocalConsoleLogs([]);
    setLocalExecutionCount(0);
  }, [lang, selectedModel]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedCode);
    toast({ title: "Kopyalandı!", description: "Düzenlenmiş kod panoya başarıyla kopyalandı.", duration: 2500 });
  };

  const getExplanation = () => {
    const metricsText = Object.entries(metrics).map(([k,v]) => `- **${k}**: ${v}`).join('\n');
    
    switch(selectedModel) {
      case 'logistic':
        return `Lojistik Regresyon analizi için yazılan kod ${lang.toUpperCase()} dilindedir.
        
**Önemli Parametreleriniz:**
- Eğim (Slope): ${params.slope} (Katsayı büyüdükçe sınıf sınırı dikleşir)
- Karar Eşiği (Threshold): ${params.threshold} (0.5 üzerindekiler 1 sınıfına atanır)

**Canlı Metrikler:**
${metricsText}

**Neye Dikkat Etmeliyim?**
- Eğim katsayısının işareti pozitif ise X arttıkça Y'nin 1 olma olasılığı artar.
- Karar eşiğini artırdığınızda (örn. 0.8), modelin 1 sınıfı tahmin etmesi zorlaşır ve Duyarlılık (Recall) düşerken, Keskinlik (Precision) yükselebilir.`;

      case 'linear':
        return `Lineer Regresyon analizi için yazılan kod ${lang.toUpperCase()} dilindedir.
        
**Önemli Parametreleriniz:**
- Eğim (Slope): ${params.slope} (X'teki 1 birimlik artışın Y'deki değişim etkisi)
- Kesişim (Intercept): ${params.intercept} (X = 0 iken Y'nin aldığı değer)
- Gürültü (Noise): ${params.noise} (Noktaların doğrudan sapma miktarı)

**Canlı Metrikler:**
${metricsText}

**Neye Dikkat Etmeliyim?**
- R² (Açıklayıcılık Skoru) 1.0'a ne kadar yakınsa model veriyi o kadar iyi açıklar.
- Gürültüyü (Noise) artırdığınızda verilerin saçılımı artar, MSE yükselir ve R² düşer.`;

      case 'normal':
        return `Normal Dağılım ve Güven Aralığı (CI) simülasyonu için yazılan kod ${lang.toUpperCase()} dilindedir.
        
**Önemli Parametreleriniz:**
- Ortalama (μ): ${params.mean} (Çan eğrisinin tepe noktası)
- Standart Sapma (σ): ${params.std} (Çan eğrisinin genişliği ve yayılımı)
- Örneklem Boyutu (n): ${params.n} (Çekilen veri adedi)
- Güven Düzeyi: %${Math.round((params.confidence ?? 0.95) * 100)}

**Canlı Metrikler:**
${metricsText}

**Neye Dikkat Etmeliyim?**
- Güven düzeyini artırdığınızda (örn. %95'ten %99'a), güven aralığı genişliği (w) artar.
- Örneklem sayısını (n) artırdığınızda ise Standart Hata düşer ve güven aralığı daralarak daha hassas bir tahmin sunar.
- Kapsama Oranı, simüle edilen 25 aralıktan kaç tanesinin gerçek μ değerini içerdiğini gösterir.`;

      case 'hypothesis':
        return `İki Örneklem t-Testi hipotez analizi için yazılan kod ${lang.toUpperCase()} dilindedir.
        
**Önemli Parametreleriniz:**
- Grup Farkı (Diff): ${params.meanDiff} (A ve B grupları arasındaki gerçek ortalama farkı)
- Anlamlılık Eşiği (Alpha): ${params.alpha} (Hata yapma payı eşiği, genellikle 0.05)

**Canlı Metrikler:**
${metricsText}

**Neye Dikkat Etmeliyim?**
- P-değeri (p-value), anlamlılık eşiğinden (Alpha) küçükse "Grup A ile Grup B arasında istatistiksel olarak anlamlı bir fark vardır" deriz (H0 reddedilir).
- Grup farkını (Diff) artırdığınızda p-değerinin hızla düştüğünü ve testin gücünün arttığını göreceksiniz.`;

      case 'clt':
        return `Merkezi Limit Teoremi (CLT) analizi için yazılan kod ${lang.toUpperCase()} dilindedir.
        
**Önemli Parametreleriniz:**
- Dağılım Tipi: ${params.cltSource ?? 'uniform'} (Ana kütlenin orijinal dağılımı)
- Örneklem Boyutu (n): ${params.cltSampleSize ?? 30} (Her örneklemdeki gözlem sayısı)
- Simülasyon Adedi (M): ${params.cltSamplesCount ?? 200} (Toplam çekilen örneklem sayısı)

**Canlı Metrikler:**
${metricsText}

**Neye Dikkat Etmeliyim?**
- Orijinal kaynak dağılım ne kadar çarpık olursa olsun, n örneklem boyutu arttıkça ortalamaların dağılımı normal dağılıma (çan eğrisine) yakınsar.
- Standart Hata (SE), n arttıkça yayılımı daraltır.`;

      case 'qq_plot':
        return `Q-Q Grafiği normal olasılık analizi için yazılan kod ${lang.toUpperCase()} dilindedir.
        
**Önemli Parametreleriniz:**
- Dağılım Tipi: ${params.qqDistribution ?? 'normal'}
- Örneklem Adedi (n): ${params.n}

**Canlı Metrikler:**
${metricsText}

**Neye Dikkat Etmeliyim?**
- Noktalar referans doğrusu üzerinde sıralanıyorsa veri normal dağılıma uymaktadır.
- Sağa çarpık dağılım seçildiğinde noktaların referans doğrusundan bükülerek saptığını ve normal dağılım varsayımının ihlal edildiğini görebilirsiniz.`;

      default:
        return `Seçili simülasyon modelinin kod yapısı ve matematiksel formülasyonu hakkında bilgi almak için soru sorabilirsiniz.`;
    }
  };

  const handleExplainCode = () => {
    setActiveTab('ai');
    setIsTyping(true);
    setTimeout(() => {
      const explanation = getExplanation();
      setMessages(prev => [
        ...prev,
        { role: 'user', text: `${lang.toUpperCase()} kodunun açıklamasını üret.` },
        { role: 'ai', text: explanation }
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const currentModelName = selectedModel === 'logistic' ? 'Lojistik Regresyon'
      : selectedModel === 'linear' ? 'Lineer Regresyon'
      : selectedModel === 'normal' ? 'Normal Dağılım & CI'
      : selectedModel === 'hypothesis' ? 'Hipotez Testi'
      : selectedModel === 'error_propagation' ? 'Hata Yayılımı'
      : selectedModel === 'clt' ? 'Merkezi Limit Teoremi'
      : 'Q-Q Olasılık Grafiği';

    setTimeout(() => {
      let aiResponse = "";
      const lower = userMsg.toLowerCase();
      const metricsText = Object.entries(metrics).map(([k,v]) => `- **${k}**: ${v}`).join('\n');
      
      if (lower.includes('açıkla') || lower.includes('kod') || lower.includes('anlat') || lower.includes('nedir')) {
        aiResponse = getExplanation();
      } else if (lower.includes('metrik') || lower.includes('sonuç') || lower.includes('değer') || lower.includes('tahmin') || lower.includes('ölçüm')) {
        aiResponse = `Şu anki **${currentModelName}** simülasyon sonuçlarınız ve hesaplanan metrikleriniz şu şekildedir:\n\n${metricsText}\n\n**Neye Dikkat Etmeliyim?**\n- Metrikler, Excel tablosundaki veri hücrelerine veya parametre slider'larına yaptığınız müdahalelere göre anlık hesaplanır.\n- Modelinizin açıklayıcılığını artırmak için parametreleri veya veri noktalarını düzenleyip "Run" butonu ile çıktıyı analiz edebilirsiniz.`;
      } else if (lower.includes('logistik') || lower.includes('lojistik')) {
        aiResponse = `Lojistik regresyon, sınıflandırma problemlerinde olasılık üretmek için kullanılır. Şu anki parametrelerinize göre eğim: **${params.slope}** ve karar eşiği: **${params.threshold}** olarak ayarlanmış durumdadır. Sınıf sınırını dikleştirmek için eğim değerini artırabilirsiniz.`;
      } else if (lower.includes('lineer')) {
        aiResponse = `Lineer regresyon, değişkenler arasındaki doğrusal ilişkiyi inceler. Şu anki modelinizde eğim: **${params.slope}** ve gürültü seviyesi: **${params.noise}** olarak ayarlanmıştır. Gürültü arttıkça tahmin hatası (MSE) büyüyecektir.`;
      } else if (lower.includes('normal') || lower.includes('dağılım') || lower.includes('güven')) {
        aiResponse = `Normal dağılım simülasyonunda şu anki ortalamanız: **${params.mean}** ve standart sapmanız: **${params.std}** olarak ayarlanmıştır. Güven düzeyiniz ise **%${Math.round((params.confidence ?? 0.95) * 100)}** CI olarak seçilmiştir.`;
      } else if (lower.includes('clt') || lower.includes('limit') || lower.includes('teorem')) {
        aiResponse = `Merkezi Limit Teoremi simülasyonunda örneklem boyutu n: **${params.cltSampleSize ?? 30}** ve simülasyon adedi M: **${params.cltSamplesCount ?? 200}** olarak ayarlanmıştır. Örneklem boyutu arttıkça ortalamaların dağılımı daha düzgün bir çan eğrisi halini alacaktır.`;
      } else {
        aiResponse = `Şu an aktif olarak **${currentModelName}** simülasyonunu çalıştırıyorsunuz.\n\n**Aktif Parametreleriniz:**\n- Gözlem Sayısı (n): ${getSampleSize()}\n- Ortalama (μ): ${params.mean ?? 'N/A'}\n- Standart Sapma (σ): ${params.std ?? 'N/A'}\n\n**Hesaplanan Canlı Metrikler:**\n${metricsText}\n\nİstediğiniz istatistiksel konuyu sorabilirsiniz. Excel tablosundaki değerleri değiştirerek grafiklerin ve bu metriklerin nasıl anında güncellendiğini izleyebilirsiniz!`;
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  const getSampleSize = () => {
    if (!simData) return 0;
    if (Array.isArray(simData)) return simData.length;
    if (simData.intervals) return simData.intervals.length;
    if (simData.qqData) return simData.qqData.length;
    if (simData.sampleMeans) return simData.sampleMeans.length;
    return params.n || 0;
  };

  // Helper to generate simulated output logs based on current model parameters and metrics
  const generateConsoleLogs = (model: string, activeParams: any, activeMetrics: any) => {
    const logs = [];
    logs.push(`Python 3.10.12 (main, Jun  8 2026, 14:02:18)`);
    logs.push(`Type "help", "copyright", "credits" or "license" for more information.`);
    logs.push(`>>> Executing model_run.py ...\n`);
    
    logs.push(`[VERİ ANALİZİ]`);
    logs.push(`- Veri Kaynağı: Aktif simülasyon ve tablo verileri yüklendi.`);
    logs.push(`- Toplam Satır Sayısı: ${getSampleSize()} satır`);
    
    const currentModelName = model === 'logistic' ? 'Lojistik Regresyon'
      : model === 'linear' ? 'Lineer Regresyon'
      : model === 'normal' ? 'Normal Dağılım & Güven Aralığı (CI)'
      : model === 'hypothesis' ? 'Hipotez Testi'
      : model === 'error_propagation' ? 'Hata Yayılımı'
      : model === 'clt' ? 'Merkezi Limit Teoremi'
      : 'Q-Q Olasılık Grafiği';

    logs.push(`- Aktif İstatistiksel Model: ${currentModelName}`);
    logs.push(``); // Blank line

    logs.push(`[HESAPLANAN CANLI METRİKLER]`);
    if (activeMetrics && Object.keys(activeMetrics).length > 0) {
      Object.entries(activeMetrics).forEach(([k, v]) => {
        logs.push(`- ${k}: ${v}`);
      });
    } else {
      logs.push(`- (Veri bulunamadı veya henüz hesaplanmadı)`);
    }
    logs.push(``); // Blank line

    logs.push(`[SİMÜLASYON PARAMETRELERİ]`);
    let hasParams = false;
    if (typeof activeParams.mean !== 'undefined') { logs.push(`- Ortalama (μ): ${activeParams.mean}`); hasParams = true; }
    if (typeof activeParams.std !== 'undefined') { logs.push(`- Standart Sapma (σ): ${activeParams.std}`); hasParams = true; }
    if (typeof activeParams.slope !== 'undefined') { logs.push(`- Eğim (Slope): ${activeParams.slope}`); hasParams = true; }
    if (typeof activeParams.intercept !== 'undefined') { logs.push(`- Kesişim (Intercept): ${activeParams.intercept}`); hasParams = true; }
    if (typeof activeParams.noise !== 'undefined') { logs.push(`- Gürültü Seviyesi (Noise): ${activeParams.noise}`); hasParams = true; }
    if (!hasParams) {
      logs.push(`- Model parametreleri varsayılan değerlerde.`);
    }
    
    logs.push(`\n>>> Execution finished successfully. Active dataset analyzed without changes.`);
    return logs;
  };

  const handleRunCode = () => {
    setLocalExecutionCount(prev => prev + 1);
    // Generates logs directly from the current model state without randomizing data
    const logs = generateConsoleLogs(selectedModel, params, metrics);
    setLocalConsoleLogs(logs);
  };

  return (
    <Card className="shadow-2xl rounded-[1.5rem] border-0 bg-[#FFF4BC] flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2 pt-4 border-b border-[#F5AE50]/20 bg-[#FFF4BC] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 bg-white/60 p-1 rounded-xl border border-[#F5AE50]/20 shadow-sm">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'code' ? 'bg-[#F5AE50] text-[#232323] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Code className="w-4 h-4" />
              Kodlar
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-1.5 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'ai' ? 'bg-[#1a1a1a] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Bot className="w-4 h-4" />
              AI Asistanı
            </button>
          </div>
          <Laptop className="w-6 h-6 text-[#F5AE50] hidden sm:block" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col min-h-0">
        {activeTab === 'code' ? (
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden min-h-0">
            {/* Language tabs */}
            <Tabs value={lang} onValueChange={(v: any) => setLang(v)} className="w-full shrink-0">
              <TabsList className="grid grid-cols-4 bg-white/70 p-1.5 rounded-[1rem] shadow-sm">
                <TabsTrigger value="python" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">Python</TabsTrigger>
                <TabsTrigger value="r" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">R</TabsTrigger>
                <TabsTrigger value="sql" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">SQL</TabsTrigger>
                <TabsTrigger value="javascript" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">JS</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Jupyter Notebook style code cell wrapper */}
            <div className="flex-1 flex flex-col min-h-0 space-y-4 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#F5AE50]/30 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="flex items-start gap-1">
                {/* Jupyter Execution Counter Input */}
                <div className="text-[12px] font-mono text-blue-600 font-bold w-16 pt-2.5 text-right pr-2 select-none shrink-0">
                  In [{localExecutionCount || ' '}]:
                </div>
                
                {/* Textarea code container */}
                <div className="flex-1 relative bg-[#1e1e2e] rounded-[1.25rem] overflow-hidden shadow-md flex min-h-[250px] border border-gray-200/10 border-l-4 border-l-blue-500">
                  <div className="w-8 flex-none bg-[#181825] py-4 flex flex-col items-center text-[10px] text-gray-500 font-mono select-none border-r border-gray-800">
                    {editedCode.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <textarea
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    className="p-4 text-xs md:text-sm text-gray-200 font-mono overflow-auto flex-1 leading-relaxed bg-[#1e1e2e] border-0 focus:outline-none focus:ring-0 resize-none h-full outline-none focus-visible:ring-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pl-16 shrink-0">
                <Button 
                  onClick={handleRunCode}
                  className="bg-[#4B232D] hover:bg-[#3d1c24] text-white font-bold rounded-xl shadow-md px-6 h-10 text-xs transition-all duration-200 flex items-center gap-2 transform active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" /> Kodu Çalıştır (Run)
                </Button>
                <Button 
                  onClick={handleCopy} 
                  variant="secondary" 
                  className="bg-white hover:bg-gray-50 text-[#4B232D] border border-gray-200 font-bold rounded-xl shadow-sm h-10 text-xs px-4"
                >
                  <Copy className="w-3.5 h-3.5 mr-2" /> Kopyala
                </Button>
                <Button 
                  onClick={handleExplainCode} 
                  variant="secondary" 
                  className="bg-white hover:bg-gray-50 text-[#4B232D] border border-gray-200 font-bold rounded-xl shadow-sm h-10 text-xs px-4"
                >
                  <Bot className="w-3.5 h-3.5 mr-2 text-[#F5AE50]" /> AI Açıkla
                </Button>
              </div>

              {/* Jupyter Terminal/Console output area */}
              <div className="flex items-start gap-1">
                {/* Jupyter Execution Counter Output */}
                <div className="text-[12px] font-mono text-red-500 font-bold w-16 pt-2.5 text-right pr-2 select-none shrink-0">
                  Out [{localExecutionCount || ' '}]:
                </div>
                
                {/* Console Log window */}
                <div className="flex-1 bg-[#0f0f16] border border-gray-800 rounded-[1.25rem] p-5 font-mono text-[13px] text-green-400 min-h-[180px] max-h-[300px] overflow-y-auto shadow-lg relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <div className="flex items-center gap-2 text-gray-500 mb-3 border-b border-gray-900 pb-1.5 select-none text-xs">
                    <Terminal className="w-4 h-4" />
                    <span>Python Console Output</span>
                  </div>
                  {localConsoleLogs.length > 0 ? (
                    localConsoleLogs.map((log: string, i: number) => (
                      <div key={i} className="leading-relaxed whitespace-pre-wrap mb-1">{log}</div>
                    ))
                  ) : (
                    <div className="text-gray-600 italic py-6 text-center select-none">
                      <p className="text-sm font-semibold mb-1">Konsol Hazır</p>
                      <p className="text-xs">Yukarıdaki "Kodu Çalıştır (Run)" butonuna basarak bu hücreyi derleyebilir ve güncel simülasyon sonuçlarını yazdırabilirsiniz.</p>
                    </div>
                  )}
                  <div className="mt-4 text-[10px] text-gray-600 border-t border-gray-900/60 pt-2 select-none italic text-right">
                    * Bu çıktı eğitim amaçlı simüle edilmiş çıktıdır. Gerçek Python çalıştırma sonraki aşamada eklenecektir.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#1a1a1a] text-white">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${m.role === 'ai' ? 'bg-[#F5AE50] text-[#1a1a1a]' : 'bg-[#2563EB] text-white'}`}>
                    {m.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${m.role === 'ai' ? 'bg-[#2d2d2d] text-gray-200 rounded-tl-sm border border-white/5' : 'bg-[#2563EB] text-white rounded-tr-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#F5AE50] text-[#1a1a1a] shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-2xl bg-[#2d2d2d] rounded-tl-sm border border-white/5 flex items-center gap-1.5 h-10">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-white/10 shrink-0 bg-[#1e1e1e]">
              <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="İstatistik, veri veya kod hakkında soru sor..." 
                  className="bg-[#2d2d2d] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#F5AE50] rounded-xl h-10 text-sm"
                />
                <Button type="submit" size="icon" className="bg-[#F5AE50] hover:bg-[#e09e45] text-[#1a1a1a] rounded-xl shrink-0 h-10 w-10 shadow-lg transition-transform hover:scale-105">
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}