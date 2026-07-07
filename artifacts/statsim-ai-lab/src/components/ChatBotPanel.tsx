import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User } from 'lucide-react';

export function ChatBotPanel({ sim }: { sim: any }) {
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
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "Bu konuda sana yardımcı olmak isterim! Hangi istatistiksel kavramı daha iyi anlamak istiyorsun?";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('logistik') || lower.includes('lojistik')) {
        aiResponse = "Lojistik regresyon, bağımlı değişkenin kategorik olduğu durumlarda (örneğin 0 ve 1) kullanılan bir sınıflandırma algoritmasıdır. Çıktı olasılık olarak 0 ile 1 arasında değer alır ve genellikle sigmoid fonksiyonu kullanılır.";
      } else if (lower.includes('lineer')) {
        aiResponse = "Lineer regresyon, bağımsız değişkenler ile sürekli bir bağımlı değişken arasındaki ilişkiyi modellemek için kullanılır. Veri noktalarına en iyi uyan doğruyu (regression line) bularak tahmin yapar.";
      } else if (lower.includes('normal') || lower.includes('dağılım')) {
        aiResponse = "Normal dağılım (çan eğrisi), verilerin ortalama etrafında simetrik olarak dağıldığı istatistiksel bir modeldir. Doğadaki birçok fenomen normal dağılıma uyar.";
      } else if (lower.includes('hipotez') || lower.includes('p-değer') || lower.includes('p-value')) {
        aiResponse = "Hipotez testi, bir iddiayı verilerle test etme yöntemidir. p-değeri, sıfır hipotezi doğruyken elde edilen test istatistiğinin gözlemlenme olasılığıdır.";
      } else if (lower.includes('excel') || lower.includes('formül')) {
        aiResponse = "Excel'de regresyon yapmak için EĞİM (SLOPE) veya KESİŞİM (INTERCEPT) formüllerini kullanabilirsin. Ayrıca Veri Çözümleme Eklentisi ile detaylı raporlar alabilirsin.";
      } else if (lower.includes('sql') || lower.includes('sorgu')) {
        aiResponse = "SQL ile model sonuçlarını filtreleyebilir, ABS(y - tahmin) gibi fonksiyonlarla mutlak hata paylarını hesaplayabilir ve veri özetlerini GROUP BY ile çekebilirsin.";
      } else if (lower.includes('kod') || lower.includes('açıkla')) {
        aiResponse = "Kod panelindeki blok, rastgele veriler üretir, modeli eğitir ve doğruluk metriklerini (Accuracy, R²) ekrana yazdırır. Satır satır çalıştırarak deneyebilirsin.";
      } else if (lower.includes('simülasyon')) {
        aiResponse = "Sol paneldeki kaydırıcıları (slider) kullanarak gürültü miktarını veya örneklem sayısını değiştirebilirsin. Grafikler anında güncellenecektir!";
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Card className="shadow-2xl rounded-[1.5rem] border-0 bg-[#1a1a1a] text-white flex flex-col h-[450px]">
      <CardHeader className="pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="bg-[#F5AE50] text-[#1a1a1a] p-1.5 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            AI Chat Bot
          </CardTitle>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            AI hazır
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md ${m.role === 'ai' ? 'bg-[#F5AE50] text-[#1a1a1a]' : 'bg-[#2563EB] text-white'}`}>
                {m.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${m.role === 'ai' ? 'bg-[#2d2d2d] text-gray-200 rounded-tl-sm border border-white/5' : 'bg-[#2563EB] text-white rounded-tr-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#F5AE50] text-[#1a1a1a] shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-[#2d2d2d] rounded-tl-sm border border-white/5 flex items-center gap-1.5 h-12">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/10 shrink-0 bg-[#1e1e1e] rounded-b-[1.5rem]">
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="İstatistik, veri veya kod hakkında soru sor..." 
              className="bg-[#2d2d2d] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#F5AE50] rounded-xl h-12 text-base"
            />
            <Button type="submit" size="icon" className="bg-[#F5AE50] hover:bg-[#e09e45] text-[#1a1a1a] rounded-xl shrink-0 h-12 w-12 shadow-lg transition-transform hover:scale-105">
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}