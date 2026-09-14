import React, { useState } from 'react';
import { RealWorldBox as RealWorldBoxType } from '../types/stats';
import { Code2, Copy, Check, Terminal, FileSpreadsheet, Database, BarChart } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getLocalized } from '../utils/localization';

interface RealWorldBoxProps {
  data?: RealWorldBoxType;
}

export const RealWorldBox: React.FC<RealWorldBoxProps> = ({ data }) => {
  const { language } = useAppStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!data || (!data.excelFormula && !data.pythonCode && !data.sqlQuery && !data.powerBiNote)) {
    return null;
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="my-6 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white">
            {language === 'tr' ? 'Gerçek Hayatta Nasıl Yapılır?' : 'How It Works in Real Tools'}
          </h4>
          <p className="text-xs text-slate-400">
            {language === 'tr'
              ? 'Excel, Python, SQL ve Power BI araçlarında pratik kullanım'
              : 'Practical usage in Excel, Python, SQL, and Power BI'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Excel Formula */}
        {data.excelFormula && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel Formülü</span>
              </span>
              <button
                onClick={() => handleCopy(data.excelFormula!, 'excel')}
                className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copiedKey === 'excel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'excel' ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-emerald-300 bg-slate-900/90 p-2.5 rounded-xl overflow-x-auto border border-slate-800/80">
              {data.excelFormula}
            </pre>
          </div>
        )}

        {/* Python Code */}
        {data.pythonCode && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center space-x-1.5 text-xs font-bold text-sky-400">
                <Code2 className="w-4 h-4" />
                <span>Python Kodu (pandas / scipy)</span>
              </span>
              <button
                onClick={() => handleCopy(data.pythonCode!, 'python')}
                className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copiedKey === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'python' ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-sky-300 bg-slate-900/90 p-2.5 rounded-xl overflow-x-auto border border-slate-800/80">
              {data.pythonCode}
            </pre>
          </div>
        )}

        {/* SQL Query */}
        {data.sqlQuery && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                <Database className="w-4 h-4" />
                <span>SQL Sorgusu</span>
              </span>
              <button
                onClick={() => handleCopy(data.sqlQuery!, 'sql')}
                className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sql' ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-amber-300 bg-slate-900/90 p-2.5 rounded-xl overflow-x-auto border border-slate-800/80">
              {data.sqlQuery}
            </pre>
          </div>
        )}

        {/* Power BI Note */}
        {data.powerBiNote && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-500 mb-1.5">
              <BarChart className="w-4 h-4" />
              <span>Power BI Notu</span>
            </div>
            <p className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
              {getLocalized(data.powerBiNote, language)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
