import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Upload, Trash2, Sigma, Play, Copy, LayoutGrid, Database, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

export function ExcelSQLPanel({ sim }: { sim: any }) {
  const { simData, selectedModel, metrics, params } = sim;
  const [tab, setTab] = useState('excel');
  const [isQuerying, setIsQuerying] = useState(false);
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (event) => {
      try {
        let rawData: any[] = [];

        if (fileExtension === 'csv') {
          const text = event.target?.result as string;
          const lines = text.split('\n').map(l => l.trim()).filter(l => l);
          if (lines.length === 0) throw new Error("Dosya boş.");
          
          const headerLine = lines[0];
          const separator = headerLine.includes(';') ? ';' : ',';
          const headers = headerLine.split(separator).map(h => h.trim().replace(/^["']|["']$/g, ''));
          
          for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(separator);
            const row: any = {};
            headers.forEach((header, index) => {
              const val = currentLine[index]?.trim().replace(/^["']|["']$/g, '') || '';
              row[header] = val;
            });
            rawData.push(row);
          }
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          rawData = XLSX.utils.sheet_to_json(worksheet);
        } else {
          throw new Error("Desteklenmeyen dosya formatı. Lütfen .xlsx, .xls veya .csv yükleyin.");
        }

        if (rawData.length === 0) {
          throw new Error("Okunabilir veri satırı bulunamadı.");
        }

        const keys = Object.keys(rawData[0]);
        const xKey = keys.find(k => /^(x|x_val|xval|input|feature|age|height|weight)$/i.test(k)) || keys[0];
        const yKey = keys.find(k => /^(y|y_val|yval|target|label|class|prediction|outcome)$/i.test(k)) || keys[1];
        const valKey = keys.find(k => /^(value|val|score|measurement|result|data)$/i.test(k)) || keys[0];

        const mappedData = rawData.map((row: any, idx: number) => {
          const xVal = parseFloat(row[xKey]);
          const yVal = parseFloat(row[yKey]);
          const val = parseFloat(row[valKey]);

          return {
            id: idx + 1,
            x: isNaN(xVal) ? 0 : xVal,
            y: isNaN(yVal) ? 0 : yVal,
            value: isNaN(val) ? 0 : val,
            prediction: isNaN(yVal) ? 0 : (yVal > 0.5 ? 1 : 0),
            p: isNaN(xVal) ? 0.5 : 1 / (1 + Math.exp(-xVal)),
            cleanY: isNaN(yVal) ? 0 : yVal,
            error: 0
          };
        });

        sim.loadCustomData(mappedData);

        toast({
          title: "Dosya Yüklendi!",
          description: `"${file.name}" dosyasındaki ${mappedData.length} satır başarıyla aktarıldı.`,
          duration: 3000
        });
      } catch (err: any) {
        toast({
          title: "Hata oluştu",
          description: err.message || "Dosya ayrıştırılamadı.",
          variant: "destructive",
          duration: 4000
        });
      }
    };

    if (fileExtension === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }

    e.target.value = '';
  };

  const getTableData = () => {
    if (!simData) return [];
    switch (selectedModel) {
      case 'logistic':
      case 'linear':
      case 'hypothesis':
        return Array.isArray(simData) ? simData : [];
      case 'normal':
        return simData.intervals || [];
      case 'error_propagation':
        return simData[2]?.shots?.map((s: any, idx: number) => ({ id: idx + 1, x: s.x, y: s.y })) || [];
      case 'clt':
        return simData.sampleMeans?.map((v: any, idx: number) => ({ id: idx + 1, 'X̄': Number(v.toFixed(3)) })) || [];
      case 'qq_plot':
        return simData.qqData || [];
      default:
        return [];
    }
  };

  const displayData = getTableData().slice(0, 15);

  const runQuery = () => {
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
      toast({ title: "Sorgu Başarılı", description: "Veritabanından güncel sonuçlar çekildi.", duration: 2000 });
    }, 800);
  };

  const getFormula = () => {
    switch (selectedModel) {
      case 'logistic': return '=LOGEST(Y2:Y20, X2:X20)';
      case 'linear': return '=LINEST(Y2:Y20, X2:X20)';
      case 'normal': return '=CONFIDENCE.NORM(0.05, 1.5, 100)';
      case 'hypothesis': return '=T.TEST(A2:A20, B2:B20, 2, 2)';
      case 'error_propagation': return '=AVERAGE(POWER(A2:A41, 2) + POWER(B2:B41, 2))';
      case 'clt': return '=AVERAGE(A2:A31)';
      case 'qq_plot': return '=NORM.S.INV((ROW()-0.5)/100)';
      default: return '';
    }
  };

  const getSQLQuery = () => {
    switch (selectedModel) {
      case 'logistic':
        return `SELECT x, y, prediction, ABS(y - prediction) AS error\nFROM simulation_data\nWHERE model_type = 'logistic';`;
      case 'linear':
        return `SELECT x, y, prediction, POWER(y - prediction, 2) AS sq_error\nFROM simulation_data\nWHERE model_type = 'linear';`;
      case 'normal':
        return `SELECT\n  sample_id,\n  AVG(value) AS sample_mean,\n  AVG(value) - 1.960 * (1.5 / SQRT(COUNT(*))) AS ci_lower,\n  AVG(value) + 1.960 * (1.5 / SQRT(COUNT(*))) AS ci_upper\nFROM normal_samples\nGROUP BY sample_id;`;
      case 'hypothesis':
        return `SELECT group_name, AVG(value) as mean, COUNT(*) as n\nFROM hypothesis_data\nGROUP BY group_name;`;
      case 'error_propagation':
        return `SELECT\n  AVG(x) AS mean_x, AVG(y) AS mean_y,\n  AVG(POWER(x, 2) + POWER(y, 2)) AS mean_square_error\nFROM shooter_shots\nWHERE shooter = 'Shooter 1';`;
      case 'clt':
        return `SELECT sample_id, AVG(val) as sample_mean\nFROM clt_simulations\nGROUP BY sample_id;`;
      case 'qq_plot':
        return `WITH OrderedSamples AS (\n  SELECT value, ROW_NUMBER() OVER(ORDER BY value) AS j, COUNT(*) OVER() AS n\n  FROM raw_samples\n)\nSELECT value, (j - 0.5)/n AS probability\nFROM OrderedSamples;`;
      default:
        return '';
    }
  };

  // Helper translations and metrics info for educational layout
  const getModelNameTurkish = (model: string) => {
    switch (model) {
      case 'logistic': return 'Lojistik Regresyon';
      case 'linear': return 'Lineer Regresyon';
      case 'normal': return 'Normal Dağılım & CI';
      case 'hypothesis': return 'Hipotez Testi (Z/t)';
      case 'error_propagation': return 'Hata Yayılımı';
      case 'clt': return 'Merkezi Limit Teoremi';
      case 'qq_plot': return 'Q-Q Olasılık Grafiği';
      default: return model;
    }
  };

  const getSampleSize = () => {
    if (Array.isArray(simData)) return simData.length;
    if (simData.intervals) return simData.intervals.length;
    if (simData.qqData) return simData.qqData.length;
    if (simData.sampleMeans) return simData.sampleMeans.length;
    return params.n || 0;
  };

  const getColumnCount = () => {
    const firstRow = getTableData()[0];
    if (!firstRow) return 0;
    return Object.keys(firstRow).filter(k => k !== 'id').length;
  };

  const getFormulaExplanation = () => {
    switch (selectedModel) {
      case 'logistic': return 'Bu formül, bağımlı kategorik değişken Y ile bağımsız değişken X arasındaki lojistik regresyon ilişkisinin katsayılarını Excel üzerinde hesaplamak için kullanılır.';
      case 'linear': return 'Bu formül, bağımlı değişken Y ile bağımsız değişken X arasındaki en uygun regresyon doğrusunun (OLS) eğim ve kesişim katsayılarını döner.';
      case 'normal': return 'Bu formül, belirli bir alpha değeri (%95 CI için 0.05) ve standart sapma üzerinden normal dağılım tabanlı güven aralığı hata payını verir.';
      case 'hypothesis': return 'Bu formül, iki bağımsız örneklem grubunun ortalamaları arasında anlamlı bir fark olup olmadığını t-testi ile kontrol eder.';
      case 'error_propagation': return 'Bu formül, koordinat çiftlerinin karelerinin ortalamasını alarak atıcının hedef merkezine olan MSE (Hata Kareler Ortalaması) oranını hesaplar.';
      case 'clt': return 'Bu formül, ana kütleden çekilen örneklemlerin alt ortalamalarını (X̄) bularak CLT grafiği için örneklem ortalaması veri serisini hazırlar.';
      case 'qq_plot': return 'Bu formül, sıralı olasılık düzeylerine karşılık gelen standart normal dağılımın teorik çeyrekliklerini (z-skorlarını) bulur.';
      default: return 'Bu formül, seçili istatistiksel model için güven aralığı veya özet metrik hesaplamasını temsil eder.';
    }
  };

  const getColumnGuide = () => {
    switch (selectedModel) {
      case 'logistic':
        return [
          { col: 'x', desc: 'bağımsız değişken' },
          { col: 'y', desc: 'gerçek sınıf (0/1)' },
          { col: 'p', desc: 'sigmoid olasılığı' },
          { col: 'prediction', desc: 'tahmin sınıfı' },
          { col: 'error', desc: 'mutlak hata' }
        ];
      case 'linear':
        return [
          { col: 'x', desc: 'bağımsız değişken' },
          { col: 'y', desc: 'gürültülü gözlem' },
          { col: 'cleanY', desc: 'gerçek doğru değeri' },
          { col: 'prediction', desc: 'tahmin edilen Y' },
          { col: 'error', desc: 'hata payı (ABS)' }
        ];
      case 'normal':
        return [
          { col: 'mean', desc: 'örneklem ortalaması' },
          { col: 'lower', desc: 'sol güven sınırı' },
          { col: 'upper', desc: 'sağ güven sınırı' },
          { col: 'covers', desc: 'gerçek μ aralıkta mı?' }
        ];
      case 'hypothesis':
        return [
          { col: 'groupA', desc: 'Grup A gözlem değeri' },
          { col: 'groupB', desc: 'Grup B gözlem değeri' }
        ];
      case 'error_propagation':
        return [
          { col: 'x', desc: 'atışın X koordinatı' },
          { col: 'y', desc: 'atışın Y koordinatı' }
        ];
      case 'clt':
        return [
          { col: 'X̄', desc: 'örneklem ortalaması' }
        ];
      case 'qq_plot':
        return [
          { col: 'z', desc: 'teorik standart normal çeyrekliği' },
          { col: 'value', desc: 'sıralı örneklem değeri' },
          { col: 'Teorik Çizgi', desc: 'normal referans doğrusu' }
        ];
      default:
        return [];
    }
  };

  const getModelEducationalDescription = (model: string) => {
    switch (model) {
      case 'logistic':
        return 'Lojistik regresyon, sınıflandırma analizi için kullanılır. Tablodaki "y" değeri gerçek sınıfları (0 veya 1), "p" ise modelin o verinin 1 olma olasılığına dair tahminini gösterir. Hücrelerdeki X değerlerini değiştirerek tahmin olasılığının sigmoid eğrisi boyunca nasıl kaydığını izleyebilirsiniz.';
      case 'linear':
        return 'Lineer regresyon, iki sürekli değişken arasındaki en uygun düz doğruyu arar. Tablodaki "cleanY" gürültüsüz asıl değeri, "y" ise gürültü eklenmiş gerçek gözlemi temsil eder. Tablodaki X veya Y değerlerini düzenlediğinizde, en küçük kareler regresyon doğrusunun eğiminin nasıl saptığını gözlemleyebilirsiniz.';
      case 'normal':
        return 'Burada normal dağılımdan çekilen örneklemler için simüle edilmiş güven aralıkları (CI) listelenmektedir. "covers" sütunu, hesaplanan alt (lower) ve üst (upper) limitlerin gerçek ana kütle ortalamasını (μ) içerip içermediğini (true/false) test eder. Örneklem boyutu (n) arttıkça aralık genişliğinin daraldığını görebilirsiniz.';
      case 'hypothesis':
        return 'Bu veri seti iki bağımsız grubun (Grup A ve Grup B) ölçüm değerlerini içerir. İki grup arasındaki ortalama farkı test etmek için iki-örneklemli t-testi simüle edilir. Excel sekmesindeki veri hücrelerini değiştirerek ortalamaların ve dolayısıyla p-değerinin nasıl etkilendiğini test edebilirsiniz.';
      case 'error_propagation':
        return 'Hata yayılımı modunda, hedef tahtasındaki (0,0) merkezine yapılan atışların koordinatları (X, Y) listelenmektedir. Ortalama karesel farklar alınarak Bias, Varyans ve MSE (Hata Kareler Ortalaması) hesaplanır. Hataların koordinatlardaki yayılımını ve kümülatif MSE etkisini inceleyebilirsiniz.';
      case 'clt':
        return 'Merkezi Limit Teoremi modunda, çekilen rastgele örneklemlerin hesaplanan ortalamaları (X̄) listelenir. Başlangıç dağılımı (uniform, poisson vb.) ne olursa olsun, bu ortalamaların dağılımı her zaman çan eğrisine (normal dağılım) yakınsar. Hücre değerlerini değiştirerek ortalamanın nasıl kaydığını görebilirsiniz.';
      case 'qq_plot':
        return 'Q-Q Plot tablosunda, sıralanmış örneklem değerleri ("value") ile standart normal dağılımın teorik çeyreklikleri ("z") eşleştirilmektedir. Eğer veriler normal dağılıyorsa, z ve value çiftleri doğrusal bir çizgi üzerinde yer alacaktır. Uyum kalitesini eğim katsayısı üzerinden inceleyebilirsiniz.';
      default:
        return 'Bu istatistiksel model simülasyonu, öğrencilerin veri manipülasyonu, formülasyon ve görselleştirme arasındaki doğrudan ilişkiyi kavrayabilmesi amacıyla kurgulanmıştır.';
    }
  };

  return (
    <Card className="shadow-2xl rounded-[1.5rem] border-0 bg-white h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: '#1F8A4C' }}>
          <FileSpreadsheet className="w-6 h-6" />
          Excel / SQL
        </CardTitle>
        <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUploadClick}
            className="w-9 h-9 text-gray-500 hover:text-[#1F8A4C] hover:bg-green-50 rounded-lg"
            title="Excel / CSV Yükle"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:text-[#1F8A4C] hover:bg-green-50 rounded-lg" title="CSV İndir"><Download className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Veriyi Temizle"><Trash2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 text-[#1F8A4C] bg-green-50 rounded-lg" title="Formül Uygula"><Sigma className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col">
        {/* Veri Kaynağı Bilgi Kartı */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-green-50/40 border border-green-100/50 p-2.5 rounded-xl text-xs mb-3">
          <div>
            <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wider">Veri Kaynağı</span>
            <span className="font-bold text-gray-700">Simülasyon Datası</span>
          </div>
          <div>
            <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wider">Model</span>
            <span className="font-bold text-[#1F8A4C]">{getModelNameTurkish(selectedModel)}</span>
          </div>
          <div>
            <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wider">Gözlem Sayısı</span>
            <span className="font-bold text-gray-700">{getSampleSize()} Satır</span>
          </div>
          <div>
            <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wider">Çalışma Modu</span>
            <span className="font-bold text-gray-700">Eğitim / Mock Lab</span>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="h-full flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-3 bg-green-50/70 p-1.5 rounded-[1rem] mb-4 shrink-0 shadow-inner">
            <TabsTrigger value="excel" className="rounded-xl data-[state=active]:bg-[#1F8A4C] data-[state=active]:text-white font-bold transition-all">Excel</TabsTrigger>
            <TabsTrigger value="sql" className="rounded-xl data-[state=active]:bg-[#1F8A4C] data-[state=active]:text-white font-bold transition-all">SQL</TabsTrigger>
            <TabsTrigger value="summary" className="rounded-xl data-[state=active]:bg-[#1F8A4C] data-[state=active]:text-white font-bold transition-all">Veri Özeti</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="excel" className="h-full m-0 data-[state=inactive]:hidden flex flex-col bg-white rounded-[1rem] border border-gray-200 overflow-hidden shadow-sm">
              {/* Formula Bar + Educational Explanation */}
              <div className="bg-gray-50/80 border-b border-gray-200 p-2.5 flex flex-col gap-1.5 text-xs shrink-0 select-none">
                <div className="flex items-center gap-2 font-mono">
                  <div className="bg-white border border-gray-200 px-3 py-1.5 text-gray-500 font-bold w-12 text-center rounded-lg shadow-sm italic">fx</div>
                  <div className="bg-white border border-green-200 px-4 py-1.5 flex-1 text-[#1F8A4C] rounded-lg shadow-inner ring-1 ring-green-500/20 font-bold">
                    {getFormula()}
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 italic pl-14">
                  {getFormulaExplanation()}
                </div>
              </div>

              {/* Kolon Rehberi */}
              {getColumnGuide().length > 0 && (
                <div className="bg-green-50/20 border-b border-gray-100 p-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500 shrink-0 select-none">
                  <span className="font-semibold text-gray-600 uppercase">Kolon Rehberi:</span>
                  {getColumnGuide().map((g, idx) => (
                    <span key={idx}>
                      <strong className="text-[#1F8A4C]">{g.col}:</strong> {g.desc}
                    </span>
                  ))}
                </div>
              )}

              {/* Excel Table */}
              <div className="flex-1 overflow-auto bg-white">
                <Table className="text-xs">
                  <TableHeader className="bg-gray-50 sticky top-0 z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-14 text-center border-r border-b border-gray-200 font-bold text-gray-600 bg-gray-100">NO</TableHead>
                      {Object.keys(displayData[0] || {}).filter(k => k !== 'id').map((k, i) => (
                        <TableHead key={k} className="border-r border-b border-gray-200 font-bold text-gray-600 bg-gray-50 text-center uppercase tracking-wider">
                          {String.fromCharCode(65 + i)}<br/>
                          <span className="text-[10px] font-normal lowercase text-gray-400">{k}</span>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.map((row: any, i: number) => (
                      <TableRow key={row.id || i} className="hover:bg-green-50/30 transition-colors">
                        <TableCell className="text-center border-r border-gray-200 text-gray-500 font-bold bg-gray-50 w-14">{i + 1}</TableCell>
                        {Object.entries(row).filter(([k]) => k !== 'id').map(([k, v]) => (
                          <TableCell key={k} className="p-0 border-r border-gray-200 text-center font-mono">
                            <input
                              type="text"
                              defaultValue={typeof v === 'number' ? Number(v.toFixed(3)) : String(v)}
                              onBlur={(e) => {
                                const newVal = parseFloat(e.target.value);
                                if (!isNaN(newVal)) {
                                  sim.updateDataCell(row.id, k, newVal);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newVal = parseFloat((e.target as HTMLInputElement).value);
                                  if (!isNaN(newVal)) {
                                    sim.updateDataCell(row.id, k, newVal);
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }
                              }}
                              className="w-full text-center bg-transparent border-0 focus:bg-green-50 focus:ring-1 focus:ring-green-500 rounded px-2 py-2 outline-none font-mono text-xs text-gray-700 h-9 transition-colors"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="sql" className="h-full m-0 data-[state=inactive]:hidden flex flex-col gap-4">
              <pre className="bg-[#1e1e2e] rounded-[1.25rem] p-5 font-mono text-[13px] text-gray-300 h-44 shrink-0 border-2 border-gray-800 shadow-xl overflow-auto leading-relaxed whitespace-pre-wrap">
                {getSQLQuery()}
              </pre>
              
              <div className="flex gap-3 shrink-0">
                <Button onClick={runQuery} className="bg-[#1F8A4C] hover:bg-[#186a3a] text-white font-bold rounded-xl shadow-md px-6">
                  <Play className="w-4 h-4 mr-2" /> Çalıştır
                </Button>
                <Button variant="outline" className="border-gray-200 font-bold text-gray-600 rounded-xl hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" /> Aktar
                </Button>
                <Button variant="secondary" className="bg-gray-100 text-gray-600 font-bold rounded-xl px-4 ml-auto">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto border border-gray-200 rounded-[1.25rem] bg-white relative shadow-sm">
                {isQuerying ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-[#1F8A4C] font-bold text-lg bg-green-50 px-6 py-3 rounded-full shadow-sm border border-green-100">
                      <Database className="w-5 h-5 animate-pulse" />
                      Sorgulanıyor...
                    </div>
                  </div>
                ) : (
                  <Table className="text-xs">
                    <TableHeader className="bg-gray-50 sticky top-0 shadow-sm">
                      <TableRow>
                        {Object.keys(displayData[0] || {}).filter(k => k !== 'id').map(k => (
                          <TableHead key={k} className="font-bold text-gray-600 uppercase tracking-wider">{k}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayData.slice(0, 10).map((row: any, i: number) => (
                        <TableRow key={row.id || i} className="hover:bg-gray-50/50">
                          {Object.entries(row).filter(([k]) => k !== 'id').map(([k, v]) => (
                            <TableCell key={k} className="font-mono text-gray-600">
                              {typeof v === 'number' ? v.toFixed(3) : String(v)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="h-full m-0 data-[state=inactive]:hidden overflow-y-auto pr-2 pb-2 space-y-4">
              {/* Eğitim Rehberi ve Açıklama Bandı */}
              <div className="bg-green-50/50 border border-green-100/60 p-4 rounded-[1.25rem] text-sm text-gray-700 leading-relaxed shadow-sm">
                <h4 className="font-bold text-[#1F8A4C] mb-1.5 flex items-center gap-1.5 uppercase text-[10px] tracking-wider select-none">
                  <LayoutGrid className="w-4 h-4 text-[#1F8A4C]" /> Model Açıklaması & Eğitim Rehberi
                </h4>
                <p className="text-[12px] leading-relaxed text-gray-600">{getModelEducationalDescription(selectedModel)}</p>
              </div>

              {/* Veri Kümesi Özellikleri */}
              <div className="bg-gray-50 border border-gray-200/50 p-4 rounded-[1.25rem] grid grid-cols-3 gap-4 shadow-inner text-center shrink-0">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5 select-none">Satır Sayısı</span>
                  <span className="text-base font-bold text-gray-700">{getSampleSize()} Satır</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5 select-none">Kolon Sayısı</span>
                  <span className="text-base font-bold text-gray-700">{getColumnCount()} Sütun</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5 select-none">Aktif Model</span>
                  <span className="text-base font-bold text-[#1F8A4C]">{getModelNameTurkish(selectedModel)}</span>
                </div>
              </div>

              {/* İstatistiksel Metrikler Grid */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(metrics).map(([k, v]) => (
                  <div key={k} className="bg-gradient-to-br from-green-50/50 to-white border border-green-100/40 p-4 rounded-[1.25rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-white border border-green-100 flex items-center justify-center text-[#1F8A4C] shadow-sm shrink-0">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{k}</div>
                      <div className="text-base font-bold text-[#232323]">{v as string}</div>
                    </div>
                  </div>
                ))}
                <div className="bg-gradient-to-br from-orange-50/50 to-white border border-orange-100/40 p-4 rounded-[1.25rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-white border border-orange-100 flex items-center justify-center text-[#F5AE50] shadow-sm shrink-0">
                    <Sigma className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Örneklem</div>
                    <div className="text-base font-bold text-[#232323]">
                      {getSampleSize()} Gözlem
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}