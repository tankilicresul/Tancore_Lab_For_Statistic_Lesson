import React, { useState } from 'react';
import { RealWorldBox as RealWorldBoxType } from '../types/stats';
import { Code2, Copy, Check, Terminal, FileSpreadsheet, Database, BarChart, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getLocalized } from '../utils/localization';

interface RealWorldBoxProps {
  data?: RealWorldBoxType;
}

export const RealWorldBox: React.FC<RealWorldBoxProps> = ({ data }) => {
  const { language } = useAppStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!data || (!data.excelFormula && !data.pythonCode && !data.sqlQuery && !data.powerBiNote)) {
    return null;
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="my-6 rounded-3xl bg-white border border-slate-200 shadow-xs font-sans overflow-hidden transition-all">
      {/* Clickable Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 shrink-0">
            <Terminal className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
              {language === 'tr' ? '6. Gerçek Hayatta Nasıl Yapılır?' : '6. How It Works in Real Tools'}
            </h4>
            <p className="text-xs text-slate-500 font-medium truncate">
              {language === 'tr'
                ? 'Excel, Python, SQL ve Power BI araçlarında pratik kullanım'
                : 'Practical usage in Excel, Python, SQL, and Power BI'}
            </p>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-[#ff7a00]/15 group-hover:text-[#ff7a00] border border-slate-200 shrink-0 ml-3 transition-colors flex items-center space-x-1 font-bold text-xs">
          {isOpen ? (
            <>
              <span className="hidden sm:inline">{language === 'tr' ? 'Kapat' : 'Close'}</span>
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
            </>
          ) : (
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          )}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-slate-100 space-y-3.5 animate-fade-in">
        {/* Excel Formula */}
        {data.excelFormula && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-2 text-xs font-bold text-[#ff7a00]">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel Formülü</span>
              </span>
              <button
                onClick={() => handleCopy(data.excelFormula!, 'excel')}
                className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                {copiedKey === 'excel' ? <Check className="w-3.5 h-3.5 text-[#ff7a00]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'excel' ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] sm:text-xs text-orange-300 bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-800 font-medium whitespace-pre-wrap break-words">
              {data.excelFormula}
            </pre>
          </div>
        )}

        {/* Python Code */}
        {data.pythonCode && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-2 text-xs font-bold text-[#ff7a00]">
                <Code2 className="w-4 h-4" />
                <span>Python Kodu (pandas / scipy)</span>
              </span>
              <button
                onClick={() => handleCopy(data.pythonCode!, 'python')}
                className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                {copiedKey === 'python' ? <Check className="w-3.5 h-3.5 text-[#ff7a00]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'python' ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] sm:text-xs text-orange-200 bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-800 font-medium whitespace-pre-wrap break-words">
              {data.pythonCode}
            </pre>
          </div>
        )}

        {/* SQL Query */}
        {data.sqlQuery && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-2 text-xs font-bold text-[#ff7a00]">
                <Database className="w-4 h-4" />
                <span>SQL Sorgusu</span>
              </span>
              <button
                onClick={() => handleCopy(data.sqlQuery!, 'sql')}
                className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5 text-[#ff7a00]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sql' ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] sm:text-xs text-orange-300 bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-800 font-medium whitespace-pre-wrap break-words">
              {data.sqlQuery}
            </pre>
          </div>
        )}

        {/* Power BI Note */}
        {data.powerBiNote && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#ff7a00] mb-2">
              <BarChart className="w-4 h-4" />
              <span>Power BI Notu</span>
            </div>
            <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
              {getLocalized(data.powerBiNote, language)}
            </p>
          </div>
        )}

        {/* Bottom Close Button */}
        <div className="flex justify-end pt-1">
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#ff7a00]/15 text-slate-700 hover:text-[#ff7a00] border border-slate-200 font-bold text-xs transition-colors"
          >
            <span>{language === 'tr' ? 'Kapat' : 'Close'}</span>
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    )}
    </div>
  );
};
