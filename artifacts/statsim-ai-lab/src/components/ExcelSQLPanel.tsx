import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Upload, Trash2, Sigma, Play, Copy, LayoutGrid, Database, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

export function ExcelSQLPanel({ sim }: { sim: any }) {
  const { simData, selectedModel, metrics } = sim;
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
        <Tabs value={tab} onValueChange={setTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 bg-green-50/70 p-1.5 rounded-[1rem] mb-4 shrink-0 shadow-inner">
            <TabsTrigger value="excel" className="rounded-xl data-[state=active]:bg-[#1F8A4C] data-[state=active]:text-white font-bold transition-all">Excel</TabsTrigger>
            <TabsTrigger value="sql" className="rounded-xl data-[state=active]:bg-[#1F8A4C] data-[state=active]:text-white font-bold transition-all">SQL</TabsTrigger>
            <TabsTrigger value="summary" className="rounded-xl data-[state=active]:bg-[#1F8A4C] data-[state=active]:text-white font-bold transition-all">Veri Özeti</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="excel" className="h-full m-0 data-[state=inactive]:hidden flex flex-col bg-white rounded-[1rem] border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50/80 border-b border-gray-200 p-2.5 flex items-center gap-2 text-sm font-mono shrink-0">
                <div className="bg-white border border-gray-200 px-3 py-1.5 text-gray-500 font-bold w-12 text-center rounded-lg shadow-sm italic">fx</div>
                <div className="bg-white border border-green-200 px-4 py-1.5 flex-1 text-[#1F8A4C] rounded-lg shadow-inner ring-1 ring-green-500/20">
                  {getFormula()}
                </div>
              </div>
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

            <TabsContent value="summary" className="h-full m-0 data-[state=inactive]:hidden overflow-y-auto pr-2 pb-2">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(metrics).map(([k, v]) => (
                  <div key={k} className="bg-gradient-to-br from-green-50 to-white border border-green-100/60 p-5 rounded-[1.25rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-white border border-green-100 flex items-center justify-center text-[#1F8A4C] shadow-sm shrink-0">
                      <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">{k}</div>
                      <div className="text-xl font-bold text-[#232323]">{v as string}</div>
                    </div>
                  </div>
                ))}
                <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100/60 p-5 rounded-[1.25rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-[#F5AE50] shadow-sm shrink-0">
                    <Sigma className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Örneklem</div>
                    <div className="text-xl font-bold text-[#232323]">
                      {Array.isArray(simData) ? simData.length : (simData.intervals?.length || simData.qqData?.length || simData.sampleMeans?.length || sim.params?.n || 0)} Gözlem
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