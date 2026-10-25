import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  INDR_COURSES_DATA,
  IndrCourseKey,
  CourseModuleItem,
  AdvancedCourse,
} from '../data/indrCoursesData';
import { INDR_MENTOR_DATA, CourseMentorGuide } from '../data/indrMentorData';
import { KatexFormula } from './KatexFormula';
import { MathFormulaText } from './MathFormulaText';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Search,
  BookOpen,
  Activity,
  Layers,
  Calculator,
  RotateCcw,
  Sparkles,
  MapPin,
  Check,
  TrendingUp,
  Cpu,
} from 'lucide-react';

interface IndrCourseHubProps {
  initialCourseKey?: IndrCourseKey;
  onBackToHome: () => void;
  onSelectCourse?: (key: IndrCourseKey) => void;
}

export const IndrCourseHub: React.FC<IndrCourseHubProps> = ({
  initialCourseKey = 'indr343',
  onBackToHome,
  onSelectCourse,
}) => {
  const { language, toggleLanguage } = useAppStore();
  const [selectedCourseKey, setSelectedCourseKey] = useState<IndrCourseKey>(initialCourseKey);
  const [activeTab, setActiveTab] = useState<'mentor' | 'syllabus' | 'lab'>('mentor');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('slide-0');

  useEffect(() => {
    setSelectedCourseKey(initialCourseKey);
  }, [initialCourseKey]);

  const course: AdvancedCourse = INDR_COURSES_DATA[selectedCourseKey] || INDR_COURSES_DATA.indr343;
  const isTr = language === 'tr';

  const handleCourseChange = (key: IndrCourseKey) => {
    setSelectedCourseKey(key);
    setSearchQuery('');
    setExpandedModuleId('slide-0');
    if (onSelectCourse) {
      onSelectCourse(key);
    }
  };

  // Filter modules by search
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return course.modules;
    const q = searchQuery.toLowerCase().trim();
    return course.modules.filter((m) => {
      const title = isTr ? m.title_tr : m.title_en;
      const desc = isTr ? m.desc_tr : m.desc_en;
      const badge = isTr ? m.badge_tr : m.badge_en;
      return (
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        badge.toLowerCase().includes(q)
      );
    });
  }, [course, searchQuery, isTr]);

  const COURSE_TABS: { key: IndrCourseKey; label: string; code: string }[] = [
    { key: 'indr100', code: 'INDR 100', label: isTr ? 'Giriş' : 'Intro' },
    { key: 'indr343', code: 'INDR 343', label: isTr ? 'Stokastik' : 'Stochastic' },
    { key: 'indr344', code: 'INDR 344', label: isTr ? 'Simülasyon' : 'Simulation' },
    { key: 'indr363', code: 'INDR 363', label: isTr ? 'Matematiksel Prog.' : 'Math Prog' },
    { key: 'indr371', code: 'INDR 371', label: isTr ? 'Tesis Tasarımı' : 'Facilities' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-20">
      {/* Top Breadcrumb & Control Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isTr ? 'Derslere Dön' : 'All Courses'}</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                {course.meta.code}
              </span>
              <span className="text-sm font-semibold text-slate-800 hidden md:inline">
                {isTr ? course.meta.title_tr : course.meta.title_en}
              </span>
            </div>
          </div>

          {/* Right Tools: View Tabs & Language */}
          <div className="flex items-center space-x-3">
            {/* View Switcher: 95+ Mentor vs Syllabus vs Lab */}
            <div className="inline-flex rounded-lg border border-slate-200/90 bg-slate-100/80 p-0.5 text-xs font-medium">
              <button
                onClick={() => setActiveTab('mentor')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'mentor'
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTr ? '95+ Özel Ders' : '95+ Mentor'}</span>
              </button>
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'syllabus'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isTr ? 'Müfredat' : 'Syllabus'}</span>
              </button>
              <button
                onClick={() => setActiveTab('lab')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'lab'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{isTr ? 'Akademik Lab' : 'Lab'}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title={isTr ? 'Dili İngilizceye Değiştir' : 'Switch to Turkish'}
            >
              {language.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Course Pills Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-1 overflow-x-auto scrollbar-none flex items-center space-x-2">
          {COURSE_TABS.map((tab) => {
            const isSelected = tab.key === selectedCourseKey;
            return (
              <button
                key={tab.key}
                onClick={() => handleCourseChange(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200/90 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                <span className="font-mono font-bold mr-1.5">{tab.code}</span>
                <span className="opacity-80">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Course Hero Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5 mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  {course.meta.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {course.meta.term}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {course.meta.code}: {isTr ? course.meta.title_tr : course.meta.title_en}
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                {isTr
                  ? `Koç Üniversitesi Endüstri Mühendisliği standart müfredatı. Öğretim Üyesi: ${course.meta.instructor}. Toplam ${course.modules.length} kapsamlı akademik modül, KaTeX formül ispatları ve interaktif hesaplama laboratuvarı.`
                  : `Koç University Industrial Engineering standard curriculum. Instructor: ${course.meta.instructor}. Complete ${course.modules.length} academic modules with full KaTeX mathematical proofs and interactive solvers.`}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center min-w-[90px]">
                <div className="font-mono text-xl font-black text-slate-900">
                  {course.modules.length}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isTr ? 'Modül' : 'Modules'}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center min-w-[90px]">
                <div className="font-mono text-xl font-black text-emerald-600">
                  100%
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isTr ? 'Tam Müfredat' : 'Coverage'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Syllabus & Module Breakdown */}
                {/* Tab 0: 95+ Mentor & Exam Strategy View */}
        {activeTab === 'mentor' && (
          <IndrMentorView courseKey={selectedCourseKey} isTr={isTr} onSwitchToLab={() => setActiveTab('lab')} />
        )}

        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            {/* Search Bar & Module Counter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isTr
                      ? 'Modül veya konu ara (örn: Markov, Kuyruk, LCG, Simplex)...'
                      : 'Search modules or topics (e.g. Markov, Queue, LCG)...'
                  }
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder-slate-400"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                {isTr
                  ? `${filteredModules.length} modül listeleniyor`
                  : `Showing ${filteredModules.length} modules`}
              </div>
            </div>

            {/* Modules Accordion / Cards List */}
            <div className="space-y-3.5">
              {filteredModules.map((mod, idx) => {
                const isExpanded = expandedModuleId === mod.id;
                const title = isTr ? mod.title_tr : mod.title_en;
                const badge = isTr ? mod.badge_tr : mod.badge_en;
                const desc = isTr ? mod.desc_tr : mod.desc_en;
                const contentHtml = isTr ? mod.content_tr : mod.content_en;

                return (
                  <div
                    key={mod.id || idx}
                    className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'border-slate-400/90 shadow-xs ring-1 ring-slate-900/5'
                        : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Header Row */}
                    <button
                      onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/70">
                            {badge}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug pt-0.5">
                          {title}
                        </h3>

                        {desc && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {desc}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 pt-1 text-slate-400">
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-slate-900' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expanded Content Panel */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30">
                        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
                          <div
                            className="indr-html-content"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredModules.length === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                  <p className="text-sm font-medium">
                    {isTr
                      ? 'Aradığınız kritere uygun modül bulunamadı.'
                      : 'No modules matched your search query.'}
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs font-semibold text-slate-900 underline cursor-pointer"
                  >
                    {isTr ? 'Aramayı Temizle' : 'Clear search'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Academic Lab Solver */}
        {activeTab === 'lab' && (
          <div className="space-y-6">
            {selectedCourseKey === 'indr343' && <Indr343MarkovLab isTr={isTr} />}
            {selectedCourseKey === 'indr344' && <Indr344SimulationLab isTr={isTr} />}
            {selectedCourseKey === 'indr363' && <Indr363DijkstraLab isTr={isTr} />}
            {selectedCourseKey === 'indr371' && <Indr371FacilityLocationLab isTr={isTr} />}
            {selectedCourseKey === 'indr100' && <Indr100NewsvendorLab isTr={isTr} />}
          </div>
        )}
      </main>
    </div>
  );
};

/* ─── INDR 343 LAB: MARKOV CHAIN MATRIX POWER & STEADY STATE ───────────── */
const Indr343MarkovLab: React.FC<{ isTr: boolean }> = ({ isTr }) => {
  const [matrixSize, setMatrixSize] = useState<2 | 3>(2);
  const [matrix, setMatrix] = useState<number[][]>([
    [0.7, 0.3],
    [0.4, 0.6],
  ]);
  const [steps, setSteps] = useState<number>(5);

  const presets = [
    {
      name: isTr ? 'Kampüs Hava Durumu (2x2)' : 'Campus Weather (2x2)',
      size: 2,
      data: [
        [0.7, 0.3],
        [0.4, 0.6],
      ],
    },
    {
      name: isTr ? 'Marka Sadakati (3x3)' : 'Brand Switching (3x3)',
      size: 3,
      data: [
        [0.8, 0.1, 0.1],
        [0.1, 0.7, 0.2],
        [0.2, 0.2, 0.6],
      ],
    },
    {
      name: isTr ? 'Makine Arıza & Bakım (3x3)' : 'Machine Repair (3x3)',
      size: 3,
      data: [
        [0.9, 0.1, 0.0],
        [0.0, 0.8, 0.2],
        [0.5, 0.0, 0.5],
      ],
    },
  ];

  const handleApplyPreset = (p: (typeof presets)[0]) => {
    setMatrixSize(p.size as 2 | 3);
    setMatrix(p.data);
  };

  const handleCellChange = (r: number, c: number, valStr: string) => {
    const val = parseFloat(valStr) || 0;
    const next = matrix.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setMatrix(next);
  };

  // Matrix multiplication helper
  const multiplyMatrices = (A: number[][], B: number[][]): number[][] => {
    const n = A.length;
    const result: number[][] = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  };

  // Compute P^n
  const powerMatrix = useMemo(() => {
    let current = matrix;
    for (let step = 1; step < steps; step++) {
      current = multiplyMatrices(current, matrix);
    }
    return current;
  }, [matrix, steps]);

  // Compute steady-state vector pi via simple power iteration
  const steadyState = useMemo(() => {
    let current = matrix;
    for (let i = 0; i < 40; i++) {
      current = multiplyMatrices(current, matrix);
    }
    return current[0] || [];
  }, [matrix]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-amber-600 uppercase tracking-widest">
            INDR 343 • STOCHASTIC LAB
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            {isTr
              ? 'Markov Zinciri Geçiş Matrisi & Denge Dağılımı'
              : 'Markov Chain Transition Matrix & Stationary Distribution'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isTr
              ? 'Tek adımlı geçiş matrisi P üzerinden Chapman-Kolmogorov n-adımlı olasılıkları ve durağan pi dağılımını hesaplayın.'
              : 'Compute Chapman-Kolmogorov n-step probabilities and stationary distribution pi from transition matrix P.'}
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase">
              {isTr ? '1. Tek Adımlı Geçiş Matrisi P' : '1. Single-Step Matrix P'}
            </span>
            <div className="inline-flex rounded-md border border-slate-200 p-0.5 text-xs">
              <button
                onClick={() => {
                  setMatrixSize(2);
                  setMatrix([
                    [0.7, 0.3],
                    [0.4, 0.6],
                  ]);
                }}
                className={`px-2 py-0.5 rounded ${
                  matrixSize === 2 ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'
                }`}
              >
                2x2
              </button>
              <button
                onClick={() => {
                  setMatrixSize(3);
                  setMatrix([
                    [0.8, 0.1, 0.1],
                    [0.1, 0.7, 0.2],
                    [0.2, 0.2, 0.6],
                  ]);
                }}
                className={`px-2 py-0.5 rounded ${
                  matrixSize === 3 ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'
                }`}
              >
                3x3
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/90 overflow-x-auto">
            <div
              className="grid gap-2 text-center"
              style={{
                gridTemplateColumns: `repeat(${matrixSize}, minmax(60px, 1fr))`,
              }}
            >
              {matrix.map((row, r) =>
                row.map((cell, c) => (
                  <div key={`${r}-${c}`} className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">
                      P({r + 1},{c + 1})
                    </span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={cell}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      className="w-full text-center py-1.5 px-1 bg-white border border-slate-300 rounded font-mono text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Row Sum Validity Check */}
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2 text-[11px] text-slate-500 font-mono">
              {matrix.map((row, idx) => {
                const sum = row.reduce((a, b) => a + b, 0);
                const isValid = Math.abs(sum - 1.0) < 0.001;
                return (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded ${
                      isValid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600 font-bold'
                    }`}
                  >
                    Row {idx + 1} Σ = {sum.toFixed(2)}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Step Selector Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                {isTr ? 'Adım Sayısı (n):' : 'Number of Steps (n):'}
              </span>
              <span className="font-mono font-bold text-amber-600 text-sm">
                n = {steps}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>n = 1</span>
              <span>n = 5</span>
              <span>n = 10</span>
              <span>n = 20</span>
            </div>
          </div>
        </div>

        {/* Right: Output Matrix P^n & Steady State */}
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase">
              {isTr ? `2. n-Adımlı Geçiş Matrisi P^${steps}` : `2. n-Step Matrix P^${steps}`}
            </span>
            <div className="p-4 bg-slate-900 text-white rounded-xl font-mono text-xs overflow-x-auto shadow-inner">
              <div
                className="grid gap-2 text-center"
                style={{
                  gridTemplateColumns: `repeat(${matrixSize}, minmax(60px, 1fr))`,
                }}
              >
                {powerMatrix.map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={`res-${r}-${c}`}
                      className="p-2 bg-slate-800/80 rounded border border-slate-700/60"
                    >
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        p^({steps})_{r + 1}{c + 1}
                      </div>
                      <div className="font-bold text-amber-400 text-sm">
                        {cell.toFixed(4)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Stationary Distribution Card */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
            <span className="text-xs font-mono font-bold text-amber-900 uppercase">
              {isTr ? '3. Denge Dağılımı (Stationary Distribution π)' : '3. Stationary Vector π'}
            </span>
            <p className="text-xs text-amber-800">
              {isTr
                ? 'n sonsuza giderken P matrisi satırları bu denge olasılıklarına yakınsar (πP = π, Σπ = 1).'
                : 'As n approaches infinity, rows of P^n converge to stationary probabilities (πP = π, Σπ = 1).'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs font-bold text-amber-900">
              {steadyState.map((val, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg shadow-2xs"
                >
                  π_{idx + 1} = {(val || 0).toFixed(4)} ({((val || 0) * 100).toFixed(1)}%)
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── INDR 344 LAB: DISCRETE EVENT SIMULATION SINGLE-SERVER QUEUE ─────── */
const Indr344SimulationLab: React.FC<{ isTr: boolean }> = ({ isTr }) => {
  const [lambda, setLambda] = useState<number>(3.0); // Arrival rate
  const [mu, setMu] = useState<number>(4.0); // Service rate
  const [custCount, setCustCount] = useState<number>(10);

  // Simulation run
  const simResults = useMemo(() => {
    const records = [];
    let clock = 0;
    let prevArrival = 0;
    let serverAvailableAt = 0;

    let totalWaitTime = 0;
    let totalSystemTime = 0;

    // Use deterministic exponential inverse based on fixed pseudo intervals for repeatability
    for (let i = 1; i <= custCount; i++) {
      // Pseudo random uniform for interarrival & service
      const u1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const u2 = (Math.cos(i * 78.233) * 43758.5453) % 1;
      const posU1 = Math.abs(u1);
      const posU2 = Math.abs(u2);

      const interArrival = -Math.log(Math.max(0.05, posU1)) / lambda;
      const arrivalTime = prevArrival + interArrival;
      prevArrival = arrivalTime;

      const serviceDuration = -Math.log(Math.max(0.05, posU2)) / mu;
      const serviceStartTime = Math.max(arrivalTime, serverAvailableAt);
      const waitTime = serviceStartTime - arrivalTime;
      const serviceEndTime = serviceStartTime + serviceDuration;
      const systemTime = serviceEndTime - arrivalTime;

      serverAvailableAt = serviceEndTime;
      totalWaitTime += waitTime;
      totalSystemTime += systemTime;

      records.push({
        id: i,
        arrivalTime: arrivalTime.toFixed(2),
        serviceStartTime: serviceStartTime.toFixed(2),
        serviceDuration: serviceDuration.toFixed(2),
        serviceEndTime: serviceEndTime.toFixed(2),
        waitTime: waitTime.toFixed(2),
        systemTime: systemTime.toFixed(2),
      });
    }

    const rho = lambda / mu;
    const avgWait = totalWaitTime / custCount;
    const avgSystem = totalSystemTime / custCount;
    const avgQueueLen = lambda * avgWait;

    return { records, rho, avgWait, avgSystem, avgQueueLen };
  }, [lambda, mu, custCount]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="font-mono text-xs font-bold text-teal-600 uppercase tracking-widest">
          INDR 344 • DISCRETE-EVENT SIMULATION LAB
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
          {isTr
            ? 'M/M/1 Ayrık Olay Simülasyonu & Kuyruk Performansı'
            : 'M/M/1 Discrete-Event Queue Simulation & Output Analysis'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isTr
            ? 'Geliş ve servis olaylarını adım adım simüle ederek Little Kanunu metriklerini (Wq, W, Lq, ρ) canlı test edin.'
            : 'Simulate customer arrival and service event dynamics to evaluate Little\'s Law metrics (Wq, W, Lq, ρ).'}
        </p>
      </div>

      {/* Control Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
        <div>
          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
            {isTr ? 'Geliş Oranı λ (müşteri/saat)' : 'Arrival Rate λ (cust/hr)'}
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            max="20"
            value={lambda}
            onChange={(e) => setLambda(parseFloat(e.target.value) || 1)}
            className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
            {isTr ? 'Servis Oranı μ (müşteri/saat)' : 'Service Rate μ (cust/hr)'}
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            max="20"
            value={mu}
            onChange={(e) => setMu(parseFloat(e.target.value) || 1)}
            className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
            {isTr ? 'Simüle Edilecek Müşteri (N)' : 'Customer Count (N)'}
          </label>
          <input
            type="number"
            step="5"
            min="5"
            max="50"
            value={custCount}
            onChange={(e) => setCustCount(parseInt(e.target.value, 10) || 10)}
            className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            {isTr ? 'Sunucu Doluluğu (ρ)' : 'Utilization (ρ)'}
          </div>
          <div
            className={`font-mono text-lg font-black mt-0.5 ${
              simResults.rho < 1 ? 'text-teal-600' : 'text-red-600'
            }`}
          >
            {(simResults.rho * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500">
            {simResults.rho < 1 ? (isTr ? 'Kararlı Sistem' : 'Stable') : (isTr ? 'Aşırı Yük!' : 'Unstable!')}
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            {isTr ? 'Ortalama Bekleme (Wq)' : 'Avg Queue Wait (Wq)'}
          </div>
          <div className="font-mono text-lg font-black text-slate-900 mt-0.5">
            {simResults.avgWait.toFixed(2)} saat
          </div>
          <div className="text-[10px] text-slate-500">
            {(simResults.avgWait * 60).toFixed(1)} dk
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            {isTr ? 'Sistemde Süre (W)' : 'Avg System Time (W)'}
          </div>
          <div className="font-mono text-lg font-black text-slate-900 mt-0.5">
            {simResults.avgSystem.toFixed(2)} saat
          </div>
          <div className="text-[10px] text-slate-500">
            {(simResults.avgSystem * 60).toFixed(1)} dk
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            {isTr ? 'Kuyruk Uzunluğu (Lq)' : 'Avg Queue Length (Lq)'}
          </div>
          <div className="font-mono text-lg font-black text-slate-900 mt-0.5">
            {simResults.avgQueueLen.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500">
            {isTr ? 'bekleyen kişi' : 'customers'}
          </div>
        </div>
      </div>

      {/* Event Trace Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900 text-white text-[11px] uppercase">
            <tr>
              <th className="p-2.5">#</th>
              <th className="p-2.5">{isTr ? 'Varış (t)' : 'Arrival (t)'}</th>
              <th className="p-2.5">{isTr ? 'Servis Başlangıç' : 'Service Start'}</th>
              <th className="p-2.5">{isTr ? 'Servis Süresi' : 'Service Time'}</th>
              <th className="p-2.5">{isTr ? 'Ayrılış (t)' : 'Departure (t)'}</th>
              <th className="p-2.5">{isTr ? 'Bekleme (Wq)' : 'Wait (Wq)'}</th>
              <th className="p-2.5">{isTr ? 'Sistem Süresi (W)' : 'System Time (W)'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {simResults.records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80">
                <td className="p-2.5 font-bold text-slate-400">{r.id}</td>
                <td className="p-2.5 text-slate-700">{r.arrivalTime}</td>
                <td className="p-2.5 text-slate-700">{r.serviceStartTime}</td>
                <td className="p-2.5 text-teal-700 font-semibold">{r.serviceDuration}</td>
                <td className="p-2.5 text-slate-700">{r.serviceEndTime}</td>
                <td className="p-2.5 text-amber-700 font-semibold">{r.waitTime}</td>
                <td className="p-2.5 font-bold text-slate-900">{r.systemTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── INDR 363 LAB: DIJKSTRA SHORTEST PATH NETWORK SOLVER ─────────────── */
const Indr363DijkstraLab: React.FC<{ isTr: boolean }> = ({ isTr }) => {
  const [origin, setOrigin] = useState<string>('S');
  const [destination, setDestination] = useState<string>('T');

  const nodes = ['S', 'A', 'B', 'C', 'D', 'T'];

  // Weighted directed graph
  const edges: { from: string; to: string; weight: number }[] = [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 2 },
  ];

  // Run Dijkstra
  const dijkstraResult = useMemo(() => {
    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const unvisited = new Set(nodes);
    const stepsLog: { step: number; node: string; dist: number; prev: string }[] = [];

    nodes.forEach((n) => {
      dist[n] = Infinity;
      prev[n] = null;
    });
    dist[origin] = 0;

    let stepNum = 1;
    while (unvisited.size > 0) {
      // Find node with min dist in unvisited
      let current: string | null = null;
      let minVal = Infinity;
      unvisited.forEach((n) => {
        if (dist[n] < minVal) {
          minVal = dist[n];
          current = n;
        }
      });

      if (!current || minVal === Infinity) break;
      unvisited.delete(current);

      stepsLog.push({
        step: stepNum++,
        node: current,
        dist: dist[current],
        prev: prev[current] || '-',
      });

      // Update neighbors
      edges
        .filter((e) => e.from === current)
        .forEach((e) => {
          if (unvisited.has(e.to)) {
            const alt = dist[current!] + e.weight;
            if (alt < dist[e.to]) {
              dist[e.to] = alt;
              prev[e.to] = current;
            }
          }
        });
    }

    // Reconstruct path
    const path: string[] = [];
    let curr: string | null = destination;
    while (curr) {
      path.unshift(curr);
      curr = prev[curr];
    }

    return {
      totalCost: dist[destination],
      path: path[0] === origin ? path : [],
      stepsLog,
    };
  }, [origin, destination]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="font-mono text-xs font-bold text-purple-600 uppercase tracking-widest">
          INDR 363 • MATHEMATICAL PROGRAMMING LAB
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
          {isTr
            ? 'Dijkstra En Kısa Yol Algoritması & Ağ Çözücü'
            : 'Dijkstra Shortest Path Network Visualizer'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isTr
            ? 'Yönlendirilmiş ağırlıklı çizge üzerinde kalıcı ve geçici etiket adımlarını inceleyerek optimum rotayı bulun.'
            : 'Step through Dijkstra label setting algorithm on a weighted directed graph to find minimum cost path.'}
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
        <div>
          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
            {isTr ? 'Başlangıç Düğümü (Origin)' : 'Origin Node'}
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900"
          >
            {nodes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
            {isTr ? 'Hedef Düğüm (Destination)' : 'Destination Node'}
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900"
          >
            {nodes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:ml-auto p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center space-x-3">
          <div>
            <div className="text-[10px] font-mono font-bold text-purple-700 uppercase">
              {isTr ? 'Optimum Yol / Toplam Maliyet' : 'Optimal Path / Total Cost'}
            </div>
            <div className="text-sm font-mono font-black text-purple-900">
              {dijkstraResult.path.join(' → ')} (Cost: {dijkstraResult.totalCost})
            </div>
          </div>
        </div>
      </div>

      {/* Network Edges & Algorithm Steps Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-xs font-mono font-bold text-slate-700 block mb-2 uppercase">
            {isTr ? 'Ağ Bağlantıları & Yay Maliyetleri' : 'Network Arcs & Weights'}
          </span>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {edges.map((e, idx) => (
              <div key={idx} className="py-1.5 flex justify-between">
                <span className="font-semibold text-slate-700">
                  Arc ({e.from} → {e.to})
                </span>
                <span className="text-purple-700 font-bold">Cost: {e.weight}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-slate-700 block mb-2 uppercase">
            {isTr ? 'Kalıcı Etiket Atama Sırası' : 'Permanent Label Assignments'}
          </span>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-white text-[11px] uppercase">
                <tr>
                  <th className="p-2">Adım</th>
                  <th className="p-2">Düğüm</th>
                  <th className="p-2">Mesafe d(v)</th>
                  <th className="p-2">Öncül p(v)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {dijkstraResult.stepsLog.map((s) => (
                  <tr key={s.step} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-400">Step {s.step}</td>
                    <td className="p-2 font-bold text-purple-700">{s.node}</td>
                    <td className="p-2 text-slate-900">{s.dist}</td>
                    <td className="p-2 text-slate-500">{s.prev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── INDR 371 LAB: FACILITY LOCATION & CENTER OF GRAVITY SOLVER ───────── */
const Indr371FacilityLocationLab: React.FC<{ isTr: boolean }> = ({ isTr }) => {
  const [points, setPoints] = useState<
    { name: string; x: number; y: number; weight: number }[]
  >([
    { name: 'İstanbul', x: 29.0, y: 41.0, weight: 500 },
    { name: 'Ankara', x: 32.8, y: 39.9, weight: 350 },
    { name: 'İzmir', x: 27.1, y: 38.4, weight: 300 },
    { name: 'Bursa', x: 29.0, y: 40.2, weight: 250 },
    { name: 'Antalya', x: 30.7, y: 36.9, weight: 200 },
  ]);

  // Compute Center of Gravity
  const cogResult = useMemo(() => {
    let totalWeight = 0;
    let sumWX = 0;
    let sumWY = 0;

    points.forEach((p) => {
      totalWeight += p.weight;
      sumWX += p.weight * p.x;
      sumWY += p.weight * p.y;
    });

    const cogX = totalWeight > 0 ? sumWX / totalWeight : 0;
    const cogY = totalWeight > 0 ? sumWY / totalWeight : 0;

    return { cogX, cogY, totalWeight };
  }, [points]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-widest">
          INDR 371 • FACILITIES DESIGN LAB
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
          {isTr
            ? 'Ağırlık Merkezi (Center of Gravity) & Tesis Yerleşimi'
            : 'Center of Gravity Facility Location Model'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isTr
            ? 'Talep noktalarının tonaj ağırlıklı koordinatları üzerinden lojistik nakliye maliyetini minimize eden optimum depolama merkezini hesaplayın.'
            : 'Find optimal logistics warehouse location minimizing weighted transportation costs via Center of Gravity.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Table of Points */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-700 block uppercase">
            {isTr ? 'Talep Noktaları (Şehirler & Yıllık Tonaj w_i)' : 'Demand Nodes & Volumes'}
          </span>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-white text-[11px] uppercase">
                <tr>
                  <th className="p-2.5">Şehir</th>
                  <th className="p-2.5">X</th>
                  <th className="p-2.5">Y</th>
                  <th className="p-2.5">Tonaj (w_i)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {points.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-800">{p.name}</td>
                    <td className="p-2.5 text-slate-600">{p.x.toFixed(1)}</td>
                    <td className="p-2.5 text-slate-600">{p.y.toFixed(1)}</td>
                    <td className="p-2.5 font-bold text-slate-900">{p.weight} ton</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CoG Result & Visual Preview */}
        <div className="space-y-4">
          <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-inner space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              {isTr ? 'Optimum Ağırlık Merkezi (Center of Gravity)' : 'Optimal CoG Coordinates'}
            </span>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-mono font-black text-emerald-400">
                  X* = {cogResult.cogX.toFixed(2)}, Y* = {cogResult.cogY.toFixed(2)}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {isTr
                    ? `Toplam taşınan hacim: ${cogResult.totalWeight} ton`
                    : `Total annual throughput: ${cogResult.totalWeight} tons`}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              {isTr
                ? 'Bu koordinat, Eskişehir/Bilecik kavşağı lojistik koridoruna denk gelmekte olup Marmara ve İç Anadolu dağıtımını optimum kılar.'
                : 'Corresponds to the central Marmara/Anatolian transport corridor, minimizing total freight ton-km.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── INDR 100 LAB: NEWSVENDOR CRITICAL FRACTILE SOLVER ────────────────── */
const Indr100NewsvendorLab: React.FC<{ isTr: boolean }> = ({ isTr }) => {
  const [sellingPrice, setSellingPrice] = useState<number>(100);
  const [cost, setCost] = useState<number>(40);
  const [salvage, setSalvage] = useState<number>(10);
  const [meanDemand, setMeanDemand] = useState<number>(1000);
  const [stdDemand, setStdDemand] = useState<number>(200);

  // Newsvendor calculation
  const result = useMemo(() => {
    const Cu = sellingPrice - cost; // Understocking cost
    const Co = cost - salvage; // Overstocking cost
    const CR = Cu + Co > 0 ? Cu / (Cu + Co) : 0.5;

    // Approximate standard normal quantile
    // Rational approximation for norm.ppf
    const calcZ = (p: number) => {
      if (p <= 0 || p >= 1) return 0;
      const t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p));
      const c0 = 2.515517;
      const c1 = 0.802853;
      const c2 = 0.010328;
      const d1 = 1.432788;
      const d2 = 0.189269;
      const d3 = 0.001308;
      let z =
        t -
        (c0 + c1 * t + c2 * t * t) /
          (1 + d1 * t + d2 * t * t + d3 * t * t * t);
      return p < 0.5 ? -z : z;
    };

    const z = calcZ(CR);
    const Qstar = Math.round(meanDemand + z * stdDemand);
    const safetyStock = Qstar - meanDemand;

    return { Cu, Co, CR, z, Qstar, safetyStock };
  }, [sellingPrice, cost, salvage, meanDemand, stdDemand]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="font-mono text-xs font-bold text-cyan-600 uppercase tracking-widest">
          INDR 100 • NEWSSVENDOR LAB
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
          {isTr
            ? 'Newsvendor Modeli & Kritik Oran (Critical Fractile)'
            : 'Newsvendor Inventory Model & Critical Ratio'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isTr
            ? 'Belirsiz talep altında eksik ve fazla stoklama maliyetlerini dengeleyen optimum sipariş adedi Q* değerini hesaplayın.'
            : 'Determine optimal order quantity Q* balancing underage (Cu) and overage (Co) costs under stochastic demand.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                {isTr ? 'Satış Fiyatı (P)' : 'Price (P)'}
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                {isTr ? 'Birim Maliyet (C)' : 'Cost (C)'}
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                {isTr ? 'Hurda Değer (S)' : 'Salvage (S)'}
              </label>
              <input
                type="number"
                value={salvage}
                onChange={(e) => setSalvage(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                {isTr ? 'Ortalama Talep (μ)' : 'Mean Demand (μ)'}
              </label>
              <input
                type="number"
                value={meanDemand}
                onChange={(e) => setMeanDemand(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                {isTr ? 'Talep Standart Sapma (σ)' : 'Demand Std Dev (σ)'}
              </label>
              <input
                type="number"
                value={stdDemand}
                onChange={(e) => setStdDemand(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-inner space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              {isTr ? 'Optimum Sipariş Miktarı (Q*)' : 'Optimal Order Quantity (Q*)'}
            </span>
            <div className="text-3xl font-mono font-black text-white">
              Q* = {result.Qstar} adet
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Emniyet Stoğu (Safety Stock): {result.safetyStock > 0 ? `+${result.safetyStock}` : result.safetyStock} adet
            </div>

            <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 bg-slate-800/80 rounded">
                <div className="text-[10px] text-slate-400">Cu</div>
                <div className="font-bold text-white">{result.Cu} TL</div>
              </div>
              <div className="p-2 bg-slate-800/80 rounded">
                <div className="text-[10px] text-slate-400">Co</div>
                <div className="font-bold text-white">{result.Co} TL</div>
              </div>
              <div className="p-2 bg-slate-800/80 rounded">
                <div className="text-[10px] text-cyan-400">CR (Cu / Cu+Co)</div>
                <div className="font-bold text-cyan-300">{(result.CR * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ─── 95+ PRIVATE TUTOR & ACADEMIC MENTOR VIEW ─────────────────────────── */
interface IndrMentorViewProps {
  courseKey: string;
  isTr: boolean;
  onSwitchToLab: () => void;
}

const IndrMentorView: React.FC<IndrMentorViewProps> = ({ courseKey, isTr, onSwitchToLab }) => {
  const guide: CourseMentorGuide = INDR_MENTOR_DATA[courseKey] || INDR_MENTOR_DATA.indr343;

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Mentor Philosophy Card */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[11px] font-black uppercase tracking-widest text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded-md border border-amber-200">
                {isTr ? '95+ AKADEMİK ÖZEL DERS METODOLOJİSİ' : '95+ ACADEMIC MENTORSHIP SYSTEM'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isTr ? 'Ezberlemek Yok, Mantığını Kavrayıp Sınavı Dağıtmak Var' : 'No Rote Memorization: Master Intuition & Ace Exams'}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "{isTr ? guide.mentorQuote : guide.mentorQuote_en}"
            </p>
          </div>
        </div>
      </div>

      {/* 1. Mental Model (Sezgisel Kavrayış) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isTr ? 'ADIM 1' : 'STEP 1'}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            {isTr ? 'Gözünde Canlandır' : 'Mental Model'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          {isTr ? guide.mentalModelTitle : guide.mentalModelTitle_en}
        </h3>

        <div className="p-4 sm:p-5 bg-amber-50/50 rounded-xl border border-amber-200/70 text-slate-800 text-sm leading-relaxed">
          {isTr ? guide.mentalModelText : guide.mentalModelText_en}
        </div>
      </div>

      {/* 2. Exam Blueprint (Sınav Röntgeni - Hoca Ne Sorar?) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isTr ? 'ADIM 2' : 'STEP 2'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {isTr ? '📋 Sınav Röntgeni: Vize & Finalde Kesin Çıkacak 3 Soru Şablonu' : '📋 Exam Blueprint: Guaranteed 3 Problem Templates'}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            100 Puan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {guide.blueprint.map((b, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-slate-500 uppercase">{b.questionNumber}</span>
                  <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {b.points} Puan
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {isTr ? b.topic : b.topic_en}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {isTr ? b.expectedQuestionType : b.expectedQuestionType_en}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase block mb-0.5">
                  {isTr ? '💡 95+ Kurtarma Tüyosu' : '💡 Survival Tip'}
                </span>
                <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                  {isTr ? b.survivalTip : b.survivalTip_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Top Traps (Hoca Nereden Vurur? Öğrencilerin %85'inin Düştüğü Hatalar) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
        <div>
          <span className="font-mono text-xs font-bold text-red-600 uppercase tracking-wider">
            {isTr ? 'ADIM 3 • KRİTİK ALAN' : 'STEP 3 • CRITICAL ZONE'}
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            {isTr ? "⚠️ Hoca Nereden Vurur? Öğrencilerin %85'inin 15-20 Puan Kaybettiği Tuzaklar" : "⚠️ Top Midterm Traps where 85% of Students Lose Points"}
          </h3>
        </div>

        <div className="space-y-4 pt-1">
          {guide.traps.map((t, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-xl border border-red-200/80 bg-red-50/20 space-y-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  !
                </span>
                <h4 className="text-sm sm:text-base font-bold text-red-950">
                  {isTr ? t.trapTitle : t.trapTitle_en}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-mono font-bold text-slate-400 uppercase block mb-1">
                    {isTr ? '❌ Öğrenciler Nerede Çuvallıyor?' : '❌ Why Students Fail'}
                  </span>
                  <p className="text-slate-600">
                    {isTr ? t.whyStudentsFail : t.whyStudentsFail_en}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-mono font-bold text-emerald-600 uppercase block mb-1">
                    {isTr ? '✅ 95+ Alanlar Nasıl Çözüyor?' : '✅ How 95+ Students Solve It'}
                  </span>
                  <p className="text-slate-700 font-medium">
                    {isTr ? t.howToSolve : t.howToSolve_en}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs font-mono font-bold flex items-center space-x-2">
                <span>⚡</span>
                <span>{isTr ? t.goldenRule : t.goldenRule_en}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Cheat Sheet Formulas */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
        <div>
          <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isTr ? 'ADIM 4' : 'STEP 4'}
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            {isTr ? '📐 Sınav Kurtaran Formül Hileleri (KaTeX)' : '📐 Exam Formula Cheat Sheet (KaTeX)'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.formulas.map((f, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-xs text-slate-900 block">
                {isTr ? f.name : f.name_en}
              </span>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80 font-mono text-sm overflow-x-auto text-center">
                <KatexFormula formula={f.latex} displayMode={true} />
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                <strong className="text-slate-700">{isTr ? 'Ne Zaman Kullanılır:' : 'When to use:'}</strong> {isTr ? f.whenToUse : f.whenToUse_en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Real Solved Exam Question with Rubric */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-inner space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isTr ? 'ADIM 5 • RESMİ ÇÖZÜMLÜ SINAV SORUSU' : 'STEP 5 • OFFICIAL EXAM WALKTHROUGH'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {isTr ? guide.sampleQuestion.title : guide.sampleQuestion.title_en}
            </h3>
          </div>
          <span className="font-mono text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-md self-start sm:self-auto">
            {guide.sampleQuestion.points} {isTr ? 'Puan' : 'Pts'}
          </span>
        </div>

        {/* Question Prompt */}
        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          <strong>{isTr ? 'Soru Metni:' : 'Question:'}</strong> {isTr ? guide.sampleQuestion.prompt : guide.sampleQuestion.prompt_en}
        </div>

        {/* Step-by-Step Rubric */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {isTr ? 'Puan Kazandıran Çözüm Adımları (Hocanın Puan Anahtarı)' : 'Point-Scoring Solution Steps (Professor Rubric)'}
          </span>

          <div className="space-y-3">
            {guide.sampleQuestion.steps.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-amber-400">{isTr ? s.stepTitle : s.stepTitle_en}</span>
                  <span className="text-slate-400">+{s.points} Puan</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isTr ? s.explanation : s.explanation_en}
                </p>
                {s.math && (
                  <div className="p-2.5 bg-slate-950/80 rounded-lg font-mono text-xs sm:text-sm text-center text-amber-300 overflow-x-auto">
                    <KatexFormula formula={s.math} displayMode={true} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final Answer Banner */}
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs sm:text-sm font-bold flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 stroke-[3] text-emerald-400 shrink-0" />
            <span>{isTr ? guide.sampleQuestion.finalAnswer : guide.sampleQuestion.finalAnswer_en}</span>
          </div>
          <button
            onClick={onSwitchToLab}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-black transition-colors shrink-0 cursor-pointer"
          >
            {isTr ? 'Simülatörde Test Et →' : 'Test in Lab →'}
          </button>
        </div>
      </div>
    </div>
  );
};
