import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Code, Laptop, Bot, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CodePanel({ sim }: { sim: any }) {
  const { getCode, selectedModel } = sim;
  const [activeTab, setActiveTab] = useState<'code' | 'ai'>('code');
  const [lang, setLang] = useState<'python' | 'r' | 'sql' | 'javascript'>('python');
  const { toast } = useToast();

  // Chatbot states
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
  }, [lang, selectedModel]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedCode);
    toast({ title: "Kopyalandı!", description: "Düzenlenmiş kod panoya başarıyla kopyalandı.", duration: 2500 });
  };

  const getExplanation = () => {
    switch(selectedModel) {
      case 'logistic': return "Bu blok, Lojistik Regresyon için veri simülasyonunu ve model eğitimini gerçekleştirir. Sınıflandırma problemi olduğu için olasılıklar üretilir ve accuracy (doğruluk) hesaplanır.";
      case 'linear': return "Lineer regresyon modeli için sürekli bir bağımlı değişken ve gürültü eklenmiş bağımsız değişkenler üretilir. En küçük kareler yöntemiyle (OLS) regresyon doğrusu oluşturulur.";
      case 'normal': return "Box-Muller veya benzeri dönüşüm algoritmaları kullanılarak belirli bir ortalama ve standart sapmaya sahip, normal dağılımlı sentetik veriler üretilir.";
      case 'hypothesis': return "İki farklı grubun normal dağılım varsayımıyla üretilen verileri üzerinde bağımsız örneklemler t-testi veya Z-testi uygulanır. p-değeri anlamlılığı gösterir.";
      default: return "";
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

    const { selectedModel, params, metrics } = sim;

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
      
      if (lower.includes('metrik') || lower.includes('sonuç') || lower.includes('değer') || lower.includes('tahmin') || lower.includes('ölçüm')) {
        aiResponse = `Şu anki **${currentModelName}** simülasyon sonuçlarınız ve hesaplanan metrikleriniz şu şekildedir:\n\n${metricsText}\n\nBu metrikler, yaptığınız parametre değişikliklerine veya Excel tablosundaki veri hücrelerine yaptığınız elle müdahalelere göre dinamik olarak anında güncellenmektedir. Hangi metriği açıklayayım?`;
      } else if (lower.includes('logistik') || lower.includes('lojistik')) {
        aiResponse = `Lojistik regresyon, sınıflandırma problemlerinde olasılık üretmek için kullanılır. Şu anki parametrelerinize göre eğim: **${params.slope}** ve karar eşiği: **${params.threshold}** olarak ayarlanmış durumdadır.`;
      } else if (lower.includes('lineer')) {
        aiResponse = `Lineer regresyon, değişkenler arasındaki doğrusal ilişkiyi inceler. Şu anki modelinizde eğim: **${params.slope}** ve gürültü seviyesi: **${params.noise}** olarak ayarlanmıştır.`;
      } else if (lower.includes('normal') || lower.includes('dağılım') || lower.includes('güven')) {
        aiResponse = `Normal dağılım simülasyonunda şu anki ortalamanız: **${params.mean}** ve standart sapmanız: **${params.std}** olarak ayarlanmıştır. Güven düzeyiniz ise **%${Math.round((params.confidence ?? 0.95) * 100)}** CI olarak seçilmiştir.`;
      } else if (lower.includes('clt') || lower.includes('limit') || lower.includes('teorem')) {
        aiResponse = `Merkezi Limit Teoremi simülasyonunda örneklem boyutu n: **${params.cltSampleSize ?? 30}** ve simülasyon adedi M: **${params.cltSamplesCount ?? 200}** olarak ayarlanmıştır. Örneklem boyutu arttıkça ortalamaların dağılımı daha düzgün bir çan eğrisi halini alacaktır.`;
      } else {
        aiResponse = `Şu an aktif olarak **${currentModelName}** simülasyonunu çalıştırıyorsunuz.\n\n**Aktif Parametreleriniz:**\n- Gözlem Sayısı (n): ${params.n}\n- Ortalama (μ): ${params.mean}\n- Standart Sapma (σ): ${params.std}\n\n**Hesaplanan Canlı Metrikler:**\n${metricsText}\n\nİstediğiniz istatistiksel konuyu sorabilirsiniz. Excel tablosundaki değerleri değiştirerek grafiklerin ve bu metriklerin nasıl anında güncellendiğini izleyebilirsiniz!`;
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Card className="shadow-2xl rounded-[1.5rem] border-0 bg-[#FFF4BC] flex flex-col h-full overflow-hidden">
      {/* Top Segmented Tabs inside CardHeader */}
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
            <Tabs value={lang} onValueChange={(v: any) => setLang(v)} className="w-full flex-1 flex flex-col min-h-0">
              <TabsList className="grid grid-cols-4 bg-white/70 p-1.5 rounded-[1rem] shadow-sm shrink-0">
                <TabsTrigger value="python" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">Python</TabsTrigger>
                <TabsTrigger value="r" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">R</TabsTrigger>
                <TabsTrigger value="sql" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">SQL</TabsTrigger>
                <TabsTrigger value="javascript" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">JS</TabsTrigger>
              </TabsList>
              
              <div className="mt-4 relative bg-[#1e1e2e] rounded-[1.25rem] overflow-hidden shadow-inner flex flex-1 min-h-[150px]">
                <div className="w-10 flex-none bg-[#181825] py-4 flex flex-col items-center text-xs text-gray-600 font-mono select-none">
                  {editedCode.split('\n').map((_: any, i: number) => <div key={i}>{i + 1}</div>)}
                </div>
                <textarea
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value)}
                  className="p-4 text-sm text-gray-300 font-mono overflow-auto flex-1 leading-relaxed bg-[#1e1e2e] border-0 focus:outline-none focus:ring-0 resize-none h-full outline-none focus-visible:ring-0"
                />
              </div>
            </Tabs>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Button onClick={handleCopy} variant="secondary" className="bg-white hover:bg-gray-50 text-[#4B232D] font-bold rounded-xl shadow-sm">
                <Copy className="w-4 h-4 mr-2" /> Kopyala
              </Button>
              <Button onClick={handleExplainCode} variant="secondary" className="bg-white hover:bg-gray-50 text-[#4B232D] font-bold rounded-xl shadow-sm">
                <Bot className="w-4 h-4 mr-2 text-[#F5AE50]" /> AI Açıkla
              </Button>
              <Button variant="secondary" className="bg-[#F5AE50]/20 text-[#4B232D] hover:bg-[#F5AE50]/30 border border-[#F5AE50]/50 font-bold rounded-xl shadow-sm">
                Kod Üret
              </Button>
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