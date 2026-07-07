import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Upload, Trash2, Sigma, Play, Copy, LayoutGrid, Database, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ExcelSQLPanel({ sim }: { sim: any }) {
  const { simData, selectedModel, metrics } = sim;
  const [tab, setTab] = useState('excel');
  const [isQuerying, setIsQuerying] = useState(false);
  const { toast } = useToast();

  const displayData = simData.slice(0, 15);

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
      case 'normal': return '=NORM.INV(RAND(), 0, 1)';
      case 'hypothesis': return '=T.TEST(A2:A20, B2:B20)';
      default: return '';
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
          <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:text-[#1F8A4C] hover:bg-green-50 rounded-lg" title="CSV Yükle"><Upload className="w-4 h-4" /></Button>
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
                          <TableCell key={k} className={`border-r border-gray-200 text-center font-mono text-gray-700 ${i===0 && k==='x' ? 'bg-green-50 ring-1 ring-[#1F8A4C] rounded shadow-sm relative z-0' : ''}`}>
                            {typeof v === 'number' ? v.toFixed(3) : String(v)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="sql" className="h-full m-0 data-[state=inactive]:hidden flex flex-col gap-4">
              <div className="bg-[#1e1e2e] rounded-[1.25rem] p-5 font-mono text-[13px] text-gray-300 h-44 shrink-0 border-2 border-gray-800 shadow-xl overflow-auto leading-relaxed">
                <div className="text-[#F5AE50] font-bold">SELECT</div>
                <div className="pl-6">
                  {Object.keys(displayData[0] || {}).filter(k => k !== 'id').slice(0, 3).join(', ')},<br/>
                  <span className="text-[#BDEBE8]">ABS</span>(y - prediction) AS error
                </div>
                <div className="text-[#F5AE50] font-bold mt-1">FROM</div>
                <div className="pl-6 text-green-400">simulation_data</div>
                <div className="text-[#F5AE50] font-bold mt-1">WHERE</div>
                <div className="pl-6 text-gray-400">model_type = <span className="text-orange-300">'{selectedModel}_regression'</span></div>
              </div>
              
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
                    <div className="text-xl font-bold text-[#232323]">{simData.length} Satır</div>
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