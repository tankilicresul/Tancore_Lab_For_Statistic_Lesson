import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { KatexFormula } from './KatexFormula';

interface ConceptDiagramProps {
  type?: string;
  moduleId?: string;
  lessonId?: string;
}

export const ConceptDiagram: React.FC<ConceptDiagramProps> = ({ type, moduleId, lessonId }) => {
  const { language } = useAppStore();

  // Infer diagram type accurately if not explicitly provided
  let activeType = type;
  if (!activeType) {
    // Lesson-specific exact diagram matches
    if (lessonId) {
      if (lessonId === 'm2-l3' || lessonId === 'm14-l3' || lessonId === 'm14-l4') {
        activeType = 'bayes_tree';
      } else if (lessonId === 'm2-l4' || moduleId === 'module-13') {
        activeType = 'combinatorics';
      } else if (lessonId === 'm2-l5' || moduleId === 'module-12') {
        activeType = 'markov_chain';
      } else if (lessonId === 'm3-l1') {
        activeType = 'discrete_binomial';
      } else if (lessonId === 'm3-l2' || moduleId === 'module-15') {
        activeType = 'poisson_timeline';
      } else if (lessonId === 'm3-l3' || lessonId === 'm3-l4' || moduleId === 'module-16') {
        activeType = 'normal_curve';
      }
    }

    if (!activeType && moduleId) {
      switch (moduleId) {
        case 'module-1':
          activeType = 'boxplot_histogram';
          break;
        case 'module-2':
          activeType = 'probability_venn';
          break;
        case 'module-3':
          activeType = 'discrete_binomial';
          break;
        case 'module-4':
          activeType = 'sample_clt';
          break;
        case 'module-5':
          activeType = 'confidence_interval';
          break;
        case 'module-6':
          activeType = 'hypothesis_test';
          break;
        case 'module-7':
        case 'module-8':
          activeType = 'regression_scatter';
          break;
        case 'module-9':
          activeType = 'anova_f';
          break;
        case 'module-10':
          activeType = 'timeseries_trend';
          break;
        case 'module-11':
          activeType = 'full_pipeline';
          break;
        case 'module-12':
          activeType = 'markov_chain';
          break;
        case 'module-13':
          activeType = 'combinatorics';
          break;
        case 'module-14':
          activeType = 'bayes_tree';
          break;
        case 'module-15':
          activeType = 'poisson_timeline';
          break;
        case 'module-16':
          activeType = 'normal_curve';
          break;
        default:
          activeType = 'probability_venn';
      }
    }
  }

  // 1. Venn Diagram & Probability Rules (Module 2)
  if (activeType === 'probability_venn') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'GÖRSEL KÜME & OLASILIK ŞEMASI' : 'SET THEORY & PROBABILITY VENN DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Venn Şeması: Kesişim (A ∩ B) & Birleşim (A ∪ B)' : 'Venn Diagram: Intersection (A ∩ B) & Union (A ∪ B)'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="P(A \cup B)" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-3 flex justify-center">
          <svg viewBox="0 0 600 200" className="w-full max-w-lg h-auto overflow-visible">
            {/* Sample Space Box (S) */}
            <rect x="40" y="20" width="520" height="160" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="65" y="45" fill="#94a3b8" fontSize="13" fontWeight="bold">S (Örneklem Uzayı)</text>

            {/* Circle A */}
            <circle cx="240" cy="100" r="65" fill="#ff7a00" fillOpacity="0.25" stroke="#ff7a00" strokeWidth="3" />
            {/* Circle B */}
            <circle cx="360" cy="100" r="65" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="3" />

            {/* Intersection Highlight */}
            <path
              d="M 300 48 A 65 65 0 0 1 300 152 A 65 65 0 0 1 300 48 Z"
              fill="#fbbf24"
              fillOpacity="0.45"
            />

            {/* Labels */}
            <text x="210" y="105" fill="#ff7a00" fontSize="14" fontWeight="900" textAnchor="middle">A</text>
            <text x="390" y="105" fill="#38bdf8" fontSize="14" fontWeight="900" textAnchor="middle">B</text>
            <text x="300" y="105" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">A ∩ B</text>

            {/* Legend / Formulas in diagram */}
            <text x="140" y="165" fill="#ff7a00" fontSize="10" fontWeight="bold">P(A) [A Olayı]</text>
            <text x="460" y="165" fill="#38bdf8" fontSize="10" fontWeight="bold">P(B) [B Olayı]</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Birleşim kuralında ortak kesişim <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(A \cap B)" displayMode={false} /></span> iki kez sayılmamak için çıkarılır: <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(A \cup B) = P(A) + P(B) - P(A \cap B)" displayMode={false} /></span>.
            </>
          ) : (
            <>
              For any two events, subtract the joint intersection <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(A \cap B)" displayMode={false} /></span>: <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(A \cup B) = P(A) + P(B) - P(A \cap B)" displayMode={false} /></span>.
            </>
          )}
        </p>
      </div>
    );
  }

  // 2. Normal Distribution Bell Curve Diagram
  if (activeType === 'normal_curve') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'GÖRSEL KAVRAM ŞEMASI' : 'VISUAL CONCEPT DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Normal Dağılım (Çan Eğrisi) & Ampirik Kural (%68 - %95 - %99.7)' : 'Normal Distribution (Bell Curve) & Empirical Rule'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="\mathcal{N}(\mu, \sigma^2)" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 220" className="w-full max-w-lg h-auto overflow-visible">
            <line x1="50" y1="180" x2="550" y2="180" stroke="#334155" strokeWidth="2" />
            <line x1="300" y1="20" x2="300" y2="180" stroke="#ff7a00" strokeWidth="2" strokeDasharray="4 4" />

            <path
              d="M 216 180 Q 258 120 300 35 Q 342 120 384 180 Z"
              fill="#ff7a00"
              fillOpacity="0.35"
            />
            <path
              d="M 132 180 Q 216 170 216 180 L 384 180 Q 384 170 468 180 Z"
              fill="#ff7a00"
              fillOpacity="0.18"
            />

            <path
              d="M 50 178 Q 132 178 216 140 T 300 30 T 384 140 Q 468 178 550 178"
              fill="none"
              stroke="#ff7a00"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <line x1="50" y1="180" x2="50" y2="188" stroke="#94a3b8" strokeWidth="2" />
            <text x="50" y="205" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">µ-3σ</text>

            <line x1="132" y1="180" x2="132" y2="188" stroke="#94a3b8" strokeWidth="2" />
            <text x="132" y="205" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">µ-2σ</text>

            <line x1="216" y1="180" x2="216" y2="188" stroke="#ff7a00" strokeWidth="2" />
            <text x="216" y="205" fill="#ff7a00" fontSize="11" textAnchor="middle" fontWeight="bold">µ-1σ</text>

            <line x1="300" y1="180" x2="300" y2="190" stroke="#ff7a00" strokeWidth="3" />
            <text x="300" y="207" fill="#ffffff" fontSize="13" textAnchor="middle" fontWeight="900">µ (Ortalama)</text>

            <line x1="384" y1="180" x2="384" y2="188" stroke="#ff7a00" strokeWidth="2" />
            <text x="384" y="205" fill="#ff7a00" fontSize="11" textAnchor="middle" fontWeight="bold">µ+1σ</text>

            <line x1="468" y1="180" x2="468" y2="188" stroke="#94a3b8" strokeWidth="2" />
            <text x="468" y="205" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">µ+2σ</text>

            <line x1="550" y1="180" x2="550" y2="188" stroke="#94a3b8" strokeWidth="2" />
            <text x="550" y="205" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">µ+3σ</text>

            <text x="300" y="100" fill="#ffffff" fontSize="14" textAnchor="middle" fontWeight="900">%68.3 (±1σ)</text>
            <text x="300" y="155" fill="#ff7a00" fontSize="12" textAnchor="middle" fontWeight="bold">%95.4 (±2σ)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center mt-1">
          {language === 'tr' ? (
            <>
              Simetrik çan eğrisinde verilerin %68.3'ü <span className="text-amber-300 font-medium mx-1"><KatexFormula formula="\pm 1\sigma" displayMode={false} /></span>, %95.4'ü <span className="text-amber-300 font-medium mx-1"><KatexFormula formula="\pm 2\sigma" displayMode={false} /></span> ve %99.7'si <span className="text-amber-300 font-medium mx-1"><KatexFormula formula="\pm 3\sigma" displayMode={false} /></span> aralığında yer alır.
            </>
          ) : (
            <>
              In a symmetric bell curve, 68.3% of data lies within <span className="text-amber-300 font-medium mx-1"><KatexFormula formula="\pm 1\sigma" displayMode={false} /></span>, 95.4% within <span className="text-amber-300 font-medium mx-1"><KatexFormula formula="\pm 2\sigma" displayMode={false} /></span>, and 99.7% within <span className="text-amber-300 font-medium mx-1"><KatexFormula formula="\pm 3\sigma" displayMode={false} /></span>.
            </>
          )}
        </p>
      </div>
    );
  }

  // 3. Discrete Binomial / Poisson Distribution (Module 3)
  if (activeType === 'discrete_binomial') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'KESİKLİ DAĞILIM ŞEMASI' : 'DISCRETE DISTRIBUTION PMF'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Olasılık Kütle Fonksiyonu (PMF): Binom & Poisson' : 'Probability Mass Function (PMF)'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="P(X = k)" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 180" className="w-full max-w-lg h-auto overflow-visible">
            <line x1="60" y1="140" x2="540" y2="140" stroke="#475569" strokeWidth="2" />
            <line x1="60" y1="20" x2="60" y2="140" stroke="#475569" strokeWidth="2" />

            {/* PMF Bars */}
            <rect x="90" y="125" width="28" height="15" rx="4" fill="#ff7a00" fillOpacity="0.4" />
            <rect x="150" y="95" width="28" height="45" rx="4" fill="#ff7a00" fillOpacity="0.6" />
            <rect x="210" y="55" width="28" height="85" rx="4" fill="#ff7a00" fillOpacity="0.8" />
            <rect x="270" y="35" width="28" height="105" rx="4" fill="#ff7a00" />
            <rect x="330" y="55" width="28" height="85" rx="4" fill="#ff7a00" fillOpacity="0.8" />
            <rect x="390" y="95" width="28" height="45" rx="4" fill="#ff7a00" fillOpacity="0.6" />
            <rect x="450" y="125" width="28" height="15" rx="4" fill="#ff7a00" fillOpacity="0.4" />

            {/* X Labels */}
            <text x="104" y="158" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">k=0</text>
            <text x="164" y="158" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">k=1</text>
            <text x="224" y="158" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">k=2</text>
            <text x="284" y="158" fill="#ffffff" fontSize="12" textAnchor="middle" fontWeight="900">k=3 (Mod)</text>
            <text x="344" y="158" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">k=4</text>
            <text x="404" y="158" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">k=5</text>
            <text x="464" y="158" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">k=6</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Kesikli değişkenlerde her bir çubuğun boyu kesin gerçekleşme olasılığıdır: <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\sum P(X = k) = 1" displayMode={false} /></span>.
            </>
          ) : (
            <>
              For discrete variables, each bar height is the exact point probability: <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\sum P(X = k) = 1" displayMode={false} /></span>.
            </>
          )}
        </p>
      </div>
    );
  }

  // 4. Central Limit Theorem (CLT) & Sampling (Module 4)
  if (activeType === 'sample_clt') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'MÜHENDİSLİK ŞEMASI' : 'ENGINEERING DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Merkezi Limit Teoremi (CLT) & Standart Hata Daralması' : 'Central Limit Theorem (CLT) Shrinkage'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="\text{SE} = \frac{\sigma}{\sqrt{n}}" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 170" className="w-full max-w-lg h-auto overflow-visible">
            <line x1="60" y1="140" x2="540" y2="140" stroke="#475569" strokeWidth="2" />
            <line x1="300" y1="20" x2="300" y2="140" stroke="#ff7a00" strokeWidth="2" strokeDasharray="4 4" />

            <path d="M 100 140 Q 300 90 500 140" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 180 140 Q 300 50 420 140" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <path d="M 230 140 Q 300 20 370 140" fill="#ff7a00" fillOpacity="0.3" stroke="#ff7a00" strokeWidth="3.5" />

            <text x="300" y="155" fill="#ffffff" fontSize="12" textAnchor="middle" fontWeight="bold">µ (Popülasyon Ortalaması)</text>
            <text x="480" y="125" fill="#94a3b8" fontSize="11">n = 1 (Geniş)</text>
            <text x="410" y="90" fill="#f59e0b" fontSize="11">n = 10</text>
            <text x="360" y="45" fill="#ff7a00" fontSize="11" fontWeight="bold">n = 100 (Dar SE)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Örneklem büyüklüğü <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="n" displayMode={false} /></span> arttıkça Standart Hata <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{SE} = \frac{\sigma}{\sqrt{n}}" displayMode={false} /></span> küçülür ve ortalamalar kitle ortalaması <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\mu" displayMode={false} /></span> etrafında sıkıca kümelenir.
            </>
          ) : (
            <>
              As sample size <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="n" displayMode={false} /></span> increases, <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{SE} = \frac{\sigma}{\sqrt{n}}" displayMode={false} /></span> shrinks and sample means tightly cluster around true mean <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\mu" displayMode={false} /></span>.
            </>
          )}
        </p>
      </div>
    );
  }

  // 5. Boxplot & Histogram Diagram (Module 1)
  if (activeType === 'boxplot_histogram') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'GÖRSEL KAVRAM ŞEMASI' : 'VISUAL CONCEPT DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Kutu Grafiği (Boxplot) & Çeyreklikler (Q1, Medyan, Q3)' : 'Boxplot Diagram & Quartiles (Q1, Median, Q3)'}
            </h4>
          </div>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 620 185" className="w-full max-w-lg h-auto overflow-visible">
            <line x1="50" y1="140" x2="570" y2="140" stroke="#475569" strokeWidth="2" />
            <line x1="90" y1="70" x2="190" y2="70" stroke="#ff7a00" strokeWidth="3" />
            <line x1="390" y1="70" x2="490" y2="70" stroke="#ff7a00" strokeWidth="3" />
            <line x1="90" y1="50" x2="90" y2="90" stroke="#ff7a00" strokeWidth="3" />
            <line x1="490" y1="50" x2="490" y2="90" stroke="#ff7a00" strokeWidth="3" />

            <rect x="190" y="40" width="200" height="60" fill="#ff7a00" fillOpacity="0.25" stroke="#ff7a00" strokeWidth="3" rx="6" />
            <line x1="290" y1="40" x2="290" y2="100" stroke="#ffffff" strokeWidth="4" />
            <circle cx="560" cy="70" r="5" fill="#ef4444" />

            <text x="90" y="122" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Min</text>
            <text x="90" y="137" fill="#64748b" fontSize="10" textAnchor="middle">[Q1-1.5·IQR]</text>

            <text x="190" y="122" fill="#ff7a00" fontSize="12" textAnchor="middle" fontWeight="bold">Q1 (%25)</text>
            <text x="290" y="125" fill="#ffffff" fontSize="13" textAnchor="middle" fontWeight="900">Q2 (Medyan)</text>
            <text x="390" y="122" fill="#ff7a00" fontSize="12" textAnchor="middle" fontWeight="bold">Q3 (%75)</text>

            <text x="490" y="122" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Max</text>
            <text x="490" y="137" fill="#64748b" fontSize="10" textAnchor="middle">[Q3+1.5·IQR]</text>

            <text x="560" y="122" fill="#ef4444" fontSize="11" textAnchor="middle" fontWeight="bold">Aykırı</text>
            <text x="560" y="137" fill="#ef4444" fontSize="10" textAnchor="middle">(Outlier)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Kutu genişliği <span className="text-amber-300 font-medium mx-1"><KatexFormula formula="\text{IQR} = Q_3 - Q_1" displayMode={false} /></span> çeyreklikler arası genişliği gösterir. Ortadaki beyaz dikey çizgi Medyan değeridir.
            </>
          ) : (
            <>
              Box width is <span className="text-amber-300 font-medium mx-1"><KatexFormula formula="\text{IQR} = Q_3 - Q_1" displayMode={false} /></span>. The white vertical line inside represents the Median (Q2).
            </>
          )}
        </p>
      </div>
    );
  }

  // 6. Confidence Interval Diagram (Module 5)
  if (activeType === 'confidence_interval') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'MÜHENDİSLİK & İSTATİSTİK ŞEMASI' : 'ENGINEERING & STATISTICS DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'CI (Ortalama) vs. PI (Tekil Ürün) vs. TI (Tolerans Kapsamı)' : 'CI vs PI vs TI Comparison Diagram'}
            </h4>
          </div>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 170" className="w-full max-w-lg h-auto overflow-visible">
            <line x1="300" y1="20" x2="300" y2="150" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" />
            <text x="300" y="15" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="900">µ (Gerçek Ortalama)</text>

            <line x1="220" y1="45" x2="380" y2="45" stroke="#ff7a00" strokeWidth="4" />
            <circle cx="220" cy="45" r="5" fill="#ff7a00" />
            <circle cx="380" cy="45" r="5" fill="#ff7a00" />
            <text x="110" y="49" fill="#ff7a00" fontSize="12" fontWeight="bold">95% CI (Ortalama µ)</text>

            <line x1="140" y1="85" x2="460" y2="85" stroke="#f59e0b" strokeWidth="4" />
            <circle cx="140" cy="85" r="5" fill="#f59e0b" />
            <circle cx="460" cy="85" r="5" fill="#f59e0b" />
            <text x="50" y="89" fill="#f59e0b" fontSize="12" fontWeight="bold">95% PI (Gelecek X_n+1)</text>

            <line x1="80" y1="125" x2="520" y2="125" stroke="#38bdf8" strokeWidth="4" />
            <circle cx="80" cy="125" r="5" fill="#38bdf8" />
            <circle cx="520" cy="125" r="5" fill="#38bdf8" />
            <text x="20" y="129" fill="#38bdf8" fontSize="12" fontWeight="bold">95% TI (%90 Kapsam)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{CI}" displayMode={false} /></span> sadece kitle ortalamasını kapsar (en dar). <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{PI}" displayMode={false} /></span> tekil bir sonraki ürünü kapsar. <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{TI}" displayMode={false} /></span> ise üretimin %90'ını kapsama garantisi verir (en geniş).
            </>
          ) : (
            <>
              <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{CI}" displayMode={false} /></span> covers population mean (narrowest). <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{PI}" displayMode={false} /></span> covers a single future product. <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{TI}" displayMode={false} /></span> guarantees coverage for 90% of population (widest).
            </>
          )}
        </p>
      </div>
    );
  }

  // 7. Hypothesis Testing Rejection Region (Module 6)
  if (activeType === 'hypothesis_test') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'GÖRSEL HIPOTEZ ŞEMASI' : 'HYPOTHESIS VISUAL DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Kabul Bölgesi (1 - α) vs. Kritik Red Bölgesi (α & P-Değeri)' : 'Acceptance Region (1 - α) vs. Rejection Region (α)'}
            </h4>
          </div>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 180" className="w-full max-w-lg h-auto overflow-visible">
            <line x1="50" y1="140" x2="550" y2="140" stroke="#475569" strokeWidth="2" />
            <path
              d="M 50 140 Q 150 140 250 40 Q 300 15 350 40 Q 450 140 550 140"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />
            <path
              d="M 440 140 Q 470 140 550 140 L 440 140 Z"
              fill="#ef4444"
              fillOpacity="0.7"
            />
            <line x1="440" y1="75" x2="440" y2="140" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />

            <text x="280" y="100" fill="#38bdf8" fontSize="13" textAnchor="middle" fontWeight="900">Kabul Bölgesi H0 (1 - α = %95)</text>
            <text x="475" y="60" fill="#ef4444" fontSize="11" textAnchor="middle" fontWeight="bold">Red Bölgesi (α = 0.05)</text>
            <text x="440" y="160" fill="#ef4444" fontSize="11" textAnchor="middle" fontWeight="bold">z_α (1.645)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Hesaplanan test istatistiği <span className="text-sky-300 font-semibold mx-1"><KatexFormula formula="z_0 > z_\alpha" displayMode={false} /></span> ise kırmızı kritik bölgeye düşer ve <span className="text-red-400 font-semibold mx-1"><KatexFormula formula="H_0" displayMode={false} /></span> hipotezi reddedilir.
            </>
          ) : (
            <>
              If calculated test statistic <span className="text-sky-300 font-semibold mx-1"><KatexFormula formula="z_0 > z_\alpha" displayMode={false} /></span>, it falls into the red rejection region and <span className="text-red-400 font-semibold mx-1"><KatexFormula formula="H_0" displayMode={false} /></span> is rejected.
            </>
          )}
        </p>
      </div>
    );
  }

  // 8. Regression Scatterplot Diagram (Module 7 & 8)
  if (activeType === 'regression_scatter') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'REGRESYON ŞEMASI' : 'REGRESSION DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'En Küçük Kareler Doğrusu (ŷ = b0 + b1·x) & Kalıntılar (e_i)' : 'Least Squares Line & Residuals (e_i)'}
            </h4>
          </div>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 170" className="w-full max-w-lg h-auto overflow-visible">
            <line x1="60" y1="140" x2="540" y2="140" stroke="#475569" strokeWidth="2" />
            <line x1="60" y1="20" x2="60" y2="140" stroke="#475569" strokeWidth="2" />

            <line x1="80" y1="125" x2="520" y2="35" stroke="#ff7a00" strokeWidth="3" />

            <line x1="150" y1="110" x2="150" y2="95" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="150" cy="95" r="5" fill="#38bdf8" />

            <line x1="280" y1="84" x2="280" y2="105" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="280" cy="105" r="5" fill="#38bdf8" />

            <line x1="420" y1="55" x2="420" y2="40" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="420" cy="40" r="5" fill="#38bdf8" />

            <text x="350" y="30" fill="#ff7a00" fontSize="12" fontWeight="bold">Regresyon Doğrusu: ŷ = b0 + b1·x</text>
            <text x="160" y="105" fill="#ef4444" fontSize="10" fontWeight="bold">Kalıntı e_i = y - ŷ</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              En Küçük Kareler Yöntemi, gözlenen noktalar ile doğru <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\hat{y} = \beta_0 + \beta_1 x" displayMode={false} /></span> arasındaki dikey hata kareleri toplamını <span className="text-red-400 font-semibold mx-1"><KatexFormula formula="\text{SSE}" displayMode={false} /></span> en aza indirir.
            </>
          ) : (
            <>
              Ordinary Least Squares minimizes the sum of squared vertical residual distances <span className="text-red-400 font-semibold mx-1"><KatexFormula formula="\text{SSE}" displayMode={false} /></span> for <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\hat{y} = \beta_0 + \beta_1 x" displayMode={false} /></span>.
            </>
          )}
        </p>
      </div>
    );
  }

  // 9. ANOVA F-Ratio Diagram (Module 9)
  if (activeType === 'anova_f') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'VARYANS ANALİZİ ŞEMASI' : 'ANOVA F-RATIO DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'ANOVA: Gruplar Arası Varyans (MSB) / Grup İçi Varyans (MSW)' : 'ANOVA F-Ratio Decomposition'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="F = \frac{\text{MSB}}{\text{MSW}}" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 160" className="w-full max-w-lg h-auto overflow-visible">
            {/* Group 1 */}
            <circle cx="150" cy="90" r="35" fill="#ff7a00" fillOpacity="0.25" stroke="#ff7a00" strokeWidth="2" />
            <text x="150" y="95" fill="#ff7a00" fontSize="12" fontWeight="bold" textAnchor="middle">Grup 1</text>

            {/* Group 2 */}
            <circle cx="300" cy="65" r="35" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2" />
            <text x="300" y="70" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Grup 2</text>

            {/* Group 3 */}
            <circle cx="450" cy="100" r="35" fill="#a855f7" fillOpacity="0.25" stroke="#a855f7" strokeWidth="2" />
            <text x="450" y="105" fill="#a855f7" fontSize="12" fontWeight="bold" textAnchor="middle">Grup 3</text>

            <line x1="150" y1="90" x2="300" y2="65" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="300" y1="65" x2="450" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
            <text x="300" y="145" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">Gruplar Arası Ayrışma (MSB Büyükse F Artar)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Gruplar arasındaki fark grup içi rastgele dalgalanmaya göre ne kadar büyükse, hesaplanan <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="F" displayMode={false} /></span> değeri o kadar büyür ve grup ortalamalarının eşit olduğu hipotezi reddedilir.
            </>
          ) : (
            <>
              The larger the between-group variance relative to within-group noise, the larger the <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="F" displayMode={false} /></span> statistic, leading to rejection of equal means.
            </>
          )}
        </p>
      </div>
    );
  }

  // 10. Markov Chain State Transition Diagram (Module 12)
  if (activeType === 'markov_chain') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'STOKASTİK SÜREÇ ŞEMASI' : 'STOCHASTIC PROCESS DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Markov Zinciri: Durum Geçişleri & Geçiş Matrisi (P)' : 'Markov Chain State Transitions'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="\boldsymbol{\pi} P = \boldsymbol{\pi}" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 170" className="w-full max-w-lg h-auto overflow-visible">
            {/* State 1 */}
            <circle cx="180" cy="85" r="40" fill="#ff7a00" fillOpacity="0.25" stroke="#ff7a00" strokeWidth="3" />
            <text x="180" y="90" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">S1 (Aktif)</text>

            {/* State 2 */}
            <circle cx="420" cy="85" r="40" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="3" />
            <text x="420" y="90" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">S2 (Churn)</text>

            {/* Transition 1 -> 2 */}
            <path d="M 215 65 Q 300 25 385 65" fill="none" stroke="#ff7a00" strokeWidth="2.5" markerEnd="url(#arrow)" />
            <text x="300" y="40" fill="#ff7a00" fontSize="11" fontWeight="bold" textAnchor="middle">p12 = 0.20</text>

            {/* Transition 2 -> 1 */}
            <path d="M 385 105 Q 300 145 215 105" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="300" y="145" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">p21 = 0.05</text>

            {/* Self Loops */}
            <text x="110" y="90" fill="#ff7a00" fontSize="11" fontWeight="bold">p11=0.80</text>
            <text x="470" y="90" fill="#38bdf8" fontSize="11" fontWeight="bold">p22=0.95</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Markov özelliğinde gelecek durum geçmişten bağımsız olarak sadece şimdiki duruma bağlıdır: <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(X_{n+1} \mid X_n)" displayMode={false} /></span>.
            </>
          ) : (
            <>
              Memoryless property: Next state depends solely on current state: <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(X_{n+1} \mid X_n)" displayMode={false} /></span>.
            </>
          )}
        </p>
      </div>
    );
  }

  // 11. Bayes Tree / Probability Tree (Module 14)
  if (activeType === 'bayes_tree') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'BAYES OĞAÇ ŞEMASI' : 'BAYESIAN PROBABILITY TREE'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Bayes Karar Ağacı: Prior Olasılık → Olabilirlik → Posterior' : 'Bayesian Decision Tree'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="P(A \mid B)" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 170" className="w-full max-w-lg h-auto overflow-visible">
            {/* Root */}
            <circle cx="80" cy="85" r="8" fill="#ffffff" />
            <text x="50" y="90" fill="#ffffff" fontSize="12" fontWeight="bold">Başlangıç</text>

            {/* Branch 1 */}
            <line x1="88" y1="80" x2="240" y2="40" stroke="#ff7a00" strokeWidth="2.5" />
            <text x="150" y="50" fill="#ff7a00" fontSize="11" fontWeight="bold">P(H) [Hasta]</text>
            <circle cx="240" cy="40" r="6" fill="#ff7a00" />

            {/* Branch 2 */}
            <line x1="88" y1="90" x2="240" y2="130" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="150" y="125" fill="#38bdf8" fontSize="11" fontWeight="bold">P(H') [Sağlıklı]</text>
            <circle cx="240" cy="130" r="6" fill="#38bdf8" />

            {/* Sub branches */}
            <line x1="246" y1="35" x2="420" y2="20" stroke="#22c55e" strokeWidth="2" />
            <text x="440" y="25" fill="#22c55e" fontSize="11" fontWeight="bold">P(+ | H) = %90 (Gerçek Pozitif)</text>

            <line x1="246" y1="135" x2="420" y2="150" stroke="#ef4444" strokeWidth="2" />
            <text x="440" y="155" fill="#ef4444" fontSize="11" fontWeight="bold">P(+ | H') = %10 (Yanlış Pozitif)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Bayes kuralı, yeni kanıt geldiğinde başlangıç inancımızı <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(A)" displayMode={false} /></span> güncellenmiş güven derecesine <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(A \mid B)" displayMode={false} /></span> dönüştürür.
            </>
          ) : (
            <>
              Bayes' rule transforms prior belief <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(A)" displayMode={false} /></span> into posterior confidence <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(A \mid B)" displayMode={false} /></span>.
            </>
          )}
        </p>
      </div>
    );
  }

  // 12. Combinatorics & Counting (Module 13)
  if (activeType === 'combinatorics') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'KOMBİNATORİK & SAYMA ŞEMASI' : 'COMBINATORICS & COUNTING'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Permütasyon (Sıralı) vs. Kombinasyon (Sırasız Küme)' : 'Permutations (Ordered) vs. Combinations (Unordered)'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="\binom{n}{k} = \frac{n!}{k!(n-k)!}" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 160" className="w-full max-w-lg h-auto overflow-visible">
            {/* Permutation Box */}
            <rect x="60" y="30" width="220" height="90" rx="12" fill="#ff7a00" fillOpacity="0.15" stroke="#ff7a00" strokeWidth="2" />
            <text x="170" y="55" fill="#ff7a00" fontSize="13" fontWeight="900" textAnchor="middle">Permütasyon P(n, k)</text>
            <text x="170" y="80" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Sıralama Önemli: (A, B) ≠ (B, A)</text>
            <text x="170" y="102" fill="#94a3b8" fontSize="11" textAnchor="middle">P(n, k) = n! / (n-k)!</text>

            {/* Combination Box */}
            <rect x="320" y="30" width="220" height="90" rx="12" fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="2" />
            <text x="430" y="55" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">Kombinasyon C(n, k)</text>
            <text x="430" y="80" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Grup Seçimi: {'{A, B}'} = {'{B, A}'}</text>
            <text x="430" y="102" fill="#94a3b8" fontSize="11" textAnchor="middle">C(n, k) = n! / [k!(n-k)!]</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Sıranın önemli olduğu durumlarda <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(n, k)" displayMode={false} /></span>, sıranın önemsiz olduğu alt küme seçimlerinde <span className="text-sky-300 font-semibold mx-1"><KatexFormula formula="\binom{n}{k}" displayMode={false} /></span> kullanılır.
            </>
          ) : (
            <>
              Use <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="P(n, k)" displayMode={false} /></span> when order matters, and <span className="text-sky-300 font-semibold mx-1"><KatexFormula formula="\binom{n}{k}" displayMode={false} /></span> for unordered subsets.
            </>
          )}
        </p>
      </div>
    );
  }

  // 13. Poisson Process Timeline (Module 15 & discrete Poisson)
  if (activeType === 'poisson_timeline') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'POISSON SÜRECİ & GELİŞ ZAMANLARI' : 'POISSON PROCESS TIMELINE'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Nadir Olaylar (λ Hızı) & Bekleme Süresi Dağılımı' : 'Poisson Event Arrivals & Waiting Times'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="P(N(t) = k) = \frac{(\lambda t)^k e^{-\lambda t}}{k!}" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 150" className="w-full max-w-lg h-auto overflow-visible">
            <line x1="50" y1="80" x2="550" y2="80" stroke="#475569" strokeWidth="3" markerEnd="url(#arrow)" />
            <text x="560" y="85" fill="#94a3b8" fontSize="12" fontWeight="bold">Zaman (t)</text>

            {/* Event arrival markers */}
            <line x1="120" y1="50" x2="120" y2="110" stroke="#ff7a00" strokeWidth="3" />
            <circle cx="120" cy="80" r="6" fill="#ff7a00" />
            <text x="120" y="40" fill="#ff7a00" fontSize="11" fontWeight="bold" textAnchor="middle">1. Olay</text>

            <line x1="220" y1="50" x2="220" y2="110" stroke="#ff7a00" strokeWidth="3" />
            <circle cx="220" cy="80" r="6" fill="#ff7a00" />
            <text x="220" y="40" fill="#ff7a00" fontSize="11" fontWeight="bold" textAnchor="middle">2. Olay</text>

            <line x1="390" y1="50" x2="390" y2="110" stroke="#ff7a00" strokeWidth="3" />
            <circle cx="390" cy="80" r="6" fill="#ff7a00" />
            <text x="390" y="40" fill="#ff7a00" fontSize="11" fontWeight="bold" textAnchor="middle">3. Olay</text>

            <line x1="470" y1="50" x2="470" y2="110" stroke="#ff7a00" strokeWidth="3" />
            <circle cx="470" cy="80" r="6" fill="#ff7a00" />
            <text x="470" y="40" fill="#ff7a00" fontSize="11" fontWeight="bold" textAnchor="middle">4. Olay</text>

            {/* Intervals */}
            <text x="170" y="115" fill="#38bdf8" fontSize="10" textAnchor="middle">T1 ~ Exp(λ)</text>
            <text x="305" y="115" fill="#38bdf8" fontSize="10" textAnchor="middle">T2 ~ Exp(λ)</text>
            <text x="430" y="115" fill="#38bdf8" fontSize="10" textAnchor="middle">T3 ~ Exp(λ)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Sabit bir zaman aralığındaki toplam olay sayısı <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{Poisson}(\lambda t)" displayMode={false} /></span>, olaylar arasındaki bekleme süreleri ise <span className="text-sky-300 font-semibold mx-1"><KatexFormula formula="\text{Üstel}(\lambda)" displayMode={false} /></span> dağılımına uyar.
            </>
          ) : (
            <>
              Total event counts follow <span className="text-amber-300 font-semibold mx-1"><KatexFormula formula="\text{Poisson}(\lambda t)" displayMode={false} /></span>, while inter-arrival times follow <span className="text-sky-300 font-semibold mx-1"><KatexFormula formula="\text{Exponential}(\lambda)" displayMode={false} /></span>.
            </>
          )}
        </p>
      </div>
    );
  }

  // 14. Time Series Trend & Seasonality (Module 10)
  if (activeType === 'timeseries_trend') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'ZAMAN SERİSİ AYRIŞTIRMA' : 'TIME SERIES DECOMPOSITION'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Trend (Tt) + Mevsimsellik (St) + Rastgele Gürültü (et)' : 'Trend + Seasonality + Noise'}
            </h4>
          </div>
          <span className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0">
            <KatexFormula formula="Y_t = T_t + S_t + \epsilon_t" displayMode={false} />
          </span>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 160" className="w-full max-w-lg h-auto overflow-visible">
            <line x1="50" y1="130" x2="550" y2="130" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="20" x2="50" y2="130" stroke="#475569" strokeWidth="2" />

            {/* Linear Trend */}
            <line x1="60" y1="110" x2="520" y2="35" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 5" />
            <text x="470" y="30" fill="#f59e0b" fontSize="11" fontWeight="bold">Trend (Tt)</text>

            {/* Seasonal Oscillating Line */}
            <path
              d="M 60 115 Q 100 80 140 100 T 220 85 T 300 70 T 380 55 T 460 40 T 520 25"
              fill="none"
              stroke="#ff7a00"
              strokeWidth="3.5"
            />
            <text x="260" y="105" fill="#ff7a00" fontSize="12" fontWeight="bold">Gözlemlenen Zaman Serisi (Yt)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Zaman serisi analizinde temel amaç uzun vadeli <span className="text-amber-300 font-semibold mx-1">Trendi</span>, periyodik <span className="text-sky-300 font-semibold mx-1">Mevsimselliği</span> ve <span className="text-slate-400 font-semibold mx-1">Gürültüyü</span> birbirinden ayrıştırarak güvenilir tahmin üretmektir.
            </>
          ) : (
            <>
              Time series decomposition isolates long-term <span className="text-amber-300 font-semibold mx-1">Trend</span>, periodic <span className="text-sky-300 font-semibold mx-1">Seasonality</span>, and irregular noise.
            </>
          )}
        </p>
      </div>
    );
  }

  // 15. End-to-End Analytics Pipeline (Module 11)
  if (activeType === 'full_pipeline') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'UÇTAN UCA ANALİTİK PİPELİNE' : 'DATA ANALYTICS PIPELINE'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Keşifsel Analiz (EDA) → Hipotez Testi → Regresyon → Karar' : 'EDA → Hypothesis Testing → Modeling → Decision'}
            </h4>
          </div>
        </div>

        <div className="w-full my-2 flex justify-center">
          <svg viewBox="0 0 600 140" className="w-full max-w-lg h-auto overflow-visible">
            {/* Step 1 */}
            <rect x="30" y="45" width="110" height="50" rx="10" fill="#ff7a00" fillOpacity="0.2" stroke="#ff7a00" strokeWidth="2" />
            <text x="85" y="75" fill="#ff7a00" fontSize="12" fontWeight="bold" textAnchor="middle">1. EDA & Özet</text>

            {/* Step 2 */}
            <rect x="170" y="45" width="110" height="50" rx="10" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2" />
            <text x="225" y="75" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">2. A/B Testi</text>

            {/* Step 3 */}
            <rect x="310" y="45" width="110" height="50" rx="10" fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="2" />
            <text x="365" y="75" fill="#a855f7" fontSize="12" fontWeight="bold" textAnchor="middle">3. Regresyon</text>

            {/* Step 4 */}
            <rect x="450" y="45" width="120" height="50" rx="10" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="2" />
            <text x="510" y="75" fill="#22c55e" fontSize="12" fontWeight="bold" textAnchor="middle">4. Karar & ROI</text>

            {/* Connectors */}
            <line x1="140" y1="70" x2="170" y2="70" stroke="#94a3b8" strokeWidth="2" />
            <line x1="280" y1="70" x2="310" y2="70" stroke="#94a3b8" strokeWidth="2" />
            <line x1="420" y1="70" x2="450" y2="70" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr' ? (
            <>
              Gerçek dünya analitik projelerinde tanımlayıcı istatistik, çıkarımsal hipotez testi ve tahmin modelleri birleştirilerek iş kararı üretilir.
            </>
          ) : (
            <>
              End-to-end data analytics seamlessly combines EDA, inferential tests, and predictive modeling for business decisions.
            </>
          )}
        </p>
      </div>
    );
  }

  // 16. Fallback Default Diagram
  return (
    <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
            {language === 'tr' ? 'GÖRSEL KAVRAM ŞEMASI' : 'CONCEPT DIAGRAM'}
          </span>
          <h4 className="text-base font-extrabold text-white tracking-tight">
            {language === 'tr' ? 'Olasılık & İstatistik Kavram Modeli' : 'Probability & Statistics Visual Model'}
          </h4>
        </div>
      </div>
      <div className="w-full my-2 flex justify-center">
        <svg viewBox="0 0 600 120" className="w-full max-w-lg h-auto overflow-visible">
          <circle cx="150" cy="60" r="35" fill="#ff7a00" fillOpacity="0.3" stroke="#ff7a00" strokeWidth="2" />
          <circle cx="450" cy="60" r="35" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
          <line x1="185" y1="60" x2="415" y2="60" stroke="#f59e0b" strokeWidth="3" />
          <text x="150" y="65" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Teori</text>
          <text x="450" y="65" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Uygulama</text>
          <text x="300" y="50" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">Veri & Karar Modeli</text>
        </svg>
      </div>
    </div>
  );
};

