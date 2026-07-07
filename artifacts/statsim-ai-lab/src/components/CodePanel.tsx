import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Code, Laptop } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CodePanel({ sim }: { sim: any }) {
  const { getCode, selectedModel } = sim;
  const [lang, setLang] = useState<'python' | 'r' | 'sql' | 'javascript'>('python');
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();

  const code = getCode(lang);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({ title: "Kopyalandı!", description: "Kod panoya başarıyla kopyalandı.", duration: 2500 });
  };

  const getExplanation = () => {
    switch(selectedModel) {
      case 'logistic': return "Bu blok, Lojistik Regresyon için veri simülasyonunu ve model eğtimini gerçekleştirir. Sınıflandırma problemi olduğu için olasılıklar üretilir ve accuracy (doğruluk) hesaplanır.";
      case 'linear': return "Lineer regresyon modeli için sürekli bir bağımlı değişken ve gürültü eklenmiş bağımsız değişkenler üretilir. En küçük kareler yöntemiyle (OLS) regresyon doğrusu oluşturulur.";
      case 'normal': return "Box-Muller veya benzeri dönüşüm algoritmaları kullanılarak belirli bir ortalama ve standart sapmaya sahip, normal dağılımlı sentetik veriler üretilir.";
      case 'hypothesis': return "İki farklı grubun normal dağılım varsayımıyla üretilen verileri üzerinde bağımsız örneklemler t-testi veya Z-testi uygulanır. p-değeri anlamlılığı gösterir.";
      default: return "";
    }
  };

  return (
    <Card className="shadow-2xl rounded-[1.5rem] border-0 bg-[#FFF4BC] flex flex-col h-full">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-2xl font-bold flex items-center justify-between" style={{ color: '#4B232D' }}>
          <span>Kodlar</span>
          <Laptop className="w-6 h-6 text-[#F5AE50]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <Tabs value={lang} onValueChange={(v: any) => setLang(v)} className="w-full flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 bg-white/70 p-1.5 rounded-[1rem] shadow-sm shrink-0">
            <TabsTrigger value="python" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">Python</TabsTrigger>
            <TabsTrigger value="r" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">R</TabsTrigger>
            <TabsTrigger value="sql" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">SQL</TabsTrigger>
            <TabsTrigger value="javascript" className="rounded-xl data-[state=active]:bg-[#F5AE50] data-[state=active]:text-[#232323] font-bold transition-all">JS</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 relative bg-[#1e1e2e] rounded-[1.25rem] overflow-hidden shadow-inner flex flex-1 max-h-[350px]">
            <div className="w-10 flex-none bg-[#181825] py-4 flex flex-col items-center text-xs text-gray-600 font-mono select-none">
              {code.split('\n').map((_: any, i: number) => <div key={i}>{i + 1}</div>)}
            </div>
            <pre className="p-4 text-sm text-gray-300 font-mono overflow-auto flex-1 leading-relaxed">
              <code>
                {code.split(/(\bimport\b|\bfrom\b|\bSELECT\b|\bFROM\b|\bWHERE\b|\bconst\b|\b=>\b|\bprint\b|\bfunction\b|\bas\b|\bORDER BY\b|\bASC\b|\bDESC\b)/g).map((part: string, i: number) => {
                  if (['import', 'from', 'SELECT', 'FROM', 'WHERE', 'const', '=>', 'function', 'as', 'ORDER BY', 'ASC', 'DESC'].includes(part)) {
                    return <span key={i} className="text-[#F5AE50]">{part}</span>;
                  }
                  if (part === 'print' || part === 'console.log') {
                    return <span key={i} className="text-[#BDEBE8]">{part}</span>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </code>
            </pre>
          </div>
        </Tabs>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button onClick={handleCopy} variant="secondary" className="bg-white hover:bg-gray-50 text-[#4B232D] font-bold rounded-xl shadow-sm">
            <Copy className="w-4 h-4 mr-2" /> Kopyala
          </Button>
          <Button onClick={() => setShowExplanation(!showExplanation)} variant="secondary" className="bg-white hover:bg-gray-50 text-[#4B232D] font-bold rounded-xl shadow-sm">
            <Code className="w-4 h-4 mr-2" /> Açıkla
          </Button>
          <Button variant="secondary" className="bg-[#F5AE50]/20 text-[#4B232D] hover:bg-[#F5AE50]/30 border border-[#F5AE50]/50 font-bold rounded-xl shadow-sm">
            Kod Üret
          </Button>
        </div>

        {showExplanation && (
          <div className="bg-[#FAF7EF] p-4 rounded-[1.25rem] border border-[#F5AE50]/40 text-sm text-[#232323] shadow-md animate-in fade-in slide-in-from-top-2 shrink-0">
            <h4 className="font-bold text-[#4B232D] mb-1 text-base">Kodun İşlevi</h4>
            <p className="leading-relaxed">
              {getExplanation()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}