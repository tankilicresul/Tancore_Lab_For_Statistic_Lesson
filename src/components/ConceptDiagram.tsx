import React from 'react';
import { useAppStore } from '../store/useAppStore';

interface ConceptDiagramProps {
  type?: string;
  moduleId?: string;
  lessonId?: string;
}

export const ConceptDiagram: React.FC<ConceptDiagramProps> = ({ type, moduleId }) => {
  const { language } = useAppStore();

  // Infer diagram type if not directly provided
  let activeType = type;
  if (!activeType && moduleId) {
    switch (moduleId) {
      case 'module-1':
        activeType = 'boxplot_histogram';
        break;
      case 'module-2':
        activeType = 'probability_venn';
        break;
      case 'module-3':
        activeType = 'normal_curve';
        break;
      case 'module-4':
        activeType = 'sample_clt';
        break;
      case 'module-5':
        activeType = 'confidence_interval';
        break;
      case 'module-6':
      case 'module-7':
        activeType = 'hypothesis_test';
        break;
      case 'module-8':
      case 'module-9':
        activeType = 'regression_scatter';
        break;
      case 'module-10':
      case 'module-11':
        activeType = 'chi_square_anova';
        break;
      default:
        activeType = 'normal_curve';
    }
  }

  // 1. Normal Distribution Bell Curve Diagram
  if (activeType === 'normal_curve') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'GÖRSEL KAVRAM ŞEMASI' : 'VISUAL CONCEPT DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Normal Dağılım (Çan Eğrisi) & Ampirik Kural (%68 - %95 - %99.7)' : 'Normal Distribution (Bell Curve) & Empirical Rule'}
            </h4>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold">
            N(µ, σ²)
          </span>
        </div>

        {/* SVG Bell Curve Render */}
        <div className="w-full h-48 sm:h-56 my-2">
          <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible">
            {/* Background Grid Lines */}
            <line x1="50" y1="180" x2="550" y2="180" stroke="#334155" strokeWidth="2" />
            <line x1="300" y1="20" x2="300" y2="180" stroke="#ff7a00" strokeWidth="2" strokeDasharray="4 4" />

            {/* Shaded Area ±1σ (%68.3) */}
            <path
              d="M 216 180 Q 258 120 300 35 Q 342 120 384 180 Z"
              fill="#ff7a00"
              fillOpacity="0.35"
            />
            {/* Shaded Area ±2σ (%95.4) */}
            <path
              d="M 132 180 Q 216 170 216 180 L 384 180 Q 384 170 468 180 Z"
              fill="#ff7a00"
              fillOpacity="0.18"
            />

            {/* Bell Curve Smooth Path */}
            <path
              d="M 50 178 Q 132 178 216 140 T 300 30 T 384 140 Q 468 178 550 178"
              fill="none"
              stroke="#ff7a00"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Tick Marks and Labels */}
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
          {language === 'tr'
            ? 'Simetrik çan eğrisinde verilerin %68.3\'ü ±1σ, %95.4\'ü ±2σ ve %99.7\'si ±3σ aralığında yer alır.'
            : 'In a symmetric bell curve, 68.3% of data lies within ±1σ, 95.4% within ±2σ, and 99.7% within ±3σ.'}
        </p>
      </div>
    );
  }

  // 2. Boxplot & Histogram Diagram
  if (activeType === 'boxplot_histogram') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'GÖRSEL KAVRAM ŞEMASI' : 'VISUAL CONCEPT DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Kutu Grafiği (Boxplot) & Çeyreklikler (Q1, Q2-Medyan, Q3)' : 'Boxplot Diagram & Quartiles (Q1, Median, Q3)'}
            </h4>
          </div>
        </div>

        <div className="w-full h-44 my-2">
          <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
            <line x1="60" y1="140" x2="540" y2="140" stroke="#475569" strokeWidth="2" />
            <line x1="100" y1="70" x2="200" y2="70" stroke="#ff7a00" strokeWidth="3" />
            <line x1="400" y1="70" x2="500" y2="70" stroke="#ff7a00" strokeWidth="3" />
            <line x1="100" y1="50" x2="100" y2="90" stroke="#ff7a00" strokeWidth="3" />
            <line x1="500" y1="50" x2="500" y2="90" stroke="#ff7a00" strokeWidth="3" />

            <rect x="200" y="40" width="200" height="60" fill="#ff7a00" fillOpacity="0.25" stroke="#ff7a00" strokeWidth="3" rx="6" />
            <line x1="290" y1="40" x2="290" y2="100" stroke="#ffffff" strokeWidth="4" />
            <circle cx="530" cy="70" r="5" fill="#ef4444" />

            <text x="100" y="120" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Min (Q1 - 1.5·IQR)</text>
            <text x="200" y="120" fill="#ff7a00" fontSize="12" textAnchor="middle" fontWeight="bold">Q1 (%25)</text>
            <text x="290" y="125" fill="#ffffff" fontSize="13" textAnchor="middle" fontWeight="900">Q2 (Medyan)</text>
            <text x="400" y="120" fill="#ff7a00" fontSize="12" textAnchor="middle" fontWeight="bold">Q3 (%75)</text>
            <text x="500" y="120" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Max (Q3 + 1.5·IQR)</text>
            <text x="530" y="120" fill="#ef4444" fontSize="11" textAnchor="middle" fontWeight="bold">Aykırı (Outlier)</text>
          </svg>
        </div>

        <p className="text-xs text-slate-300 font-medium text-center">
          {language === 'tr'
            ? 'Kutu genişliği IQR = Q3 - Q1 çeyreklikler arası genişliği gösterir. Çizginin ortasındaki dikey beyaz hat Medyan değeridir.'
            : 'Box width is IQR = Q3 - Q1. The white vertical line inside represents the Median (Q2).'}
        </p>
      </div>
    );
  }

  // 3. Confidence vs Prediction Interval Diagram
  if (activeType === 'confidence_interval') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'MÜHENDİSLİK & İSTATİSTİK ŞEMASI' : 'ENGINEERING & STATISTICS DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'CI (Ortalama) vs. PI (Tekil Ürün) vs. TI (Tolerans Kapsamı)' : 'CI vs PI vs TI Comparison Diagram'}
            </h4>
          </div>
        </div>

        <div className="w-full h-44 my-2">
          <svg viewBox="0 0 600 170" className="w-full h-full overflow-visible">
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
          {language === 'tr'
            ? 'CI sadece kitle ortalamasını kapsar (en dar). PI tekil bir sonraki ürünü kapsar. TI ise üretimin %90\'ını kapsama garantisi verir (en geniş).'
            : 'CI covers population mean (narrowest). PI covers a single future product. TI guarantees coverage for 90% of population (widest).'}
        </p>
      </div>
    );
  }

  // 4. Hypothesis Testing Rejection Region Diagram
  if (activeType === 'hypothesis_test') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'GÖRSEL HIPOTEZ ŞEMASI' : 'HYPOTHESIS VISUAL DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'Kabul Bölgesi (1 - α) vs. Kritik Red Bölgesi (α & P-Değeri)' : 'Acceptance Region (1 - α) vs. Rejection Region (α)'}
            </h4>
          </div>
        </div>

        <div className="w-full h-44 my-2">
          <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
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
          {language === 'tr'
            ? 'Hesaplanan test istatistiği z0 > z_α ise kırmızı kritik bölgeye düşer ve H0 hipotezi reddedilir.'
            : 'If calculated test statistic z0 > z_α, it falls into the red rejection region and H0 is rejected.'}
        </p>
      </div>
    );
  }

  // 5. Regression Scatterplot Diagram
  if (activeType === 'regression_scatter') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
              {language === 'tr' ? 'REGRESYON ŞEMASI' : 'REGRESSION DIAGRAM'}
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {language === 'tr' ? 'En Küçük Kareler Doğrusu (ŷ = b0 + b1·x) & Kalıntılar (e_i)' : 'Least Squares Line & Residuals (e_i)'}
            </h4>
          </div>
        </div>

        <div className="w-full h-44 my-2">
          <svg viewBox="0 0 600 170" className="w-full h-full overflow-visible">
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
          {language === 'tr'
            ? 'En Küçük Kareler Yöntemi, gözlenen noktalar ile doğru arasındaki dikey hata kareleri toplamını (SSE) en aza indirir.'
            : 'Ordinary Least Squares minimizes the sum of squared vertical residual distances (SSE).'}
        </p>
      </div>
    );
  }

  // Fallback / Default Diagram: Probability / Central Limit Theorem
  return (
    <div className="my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden font-sans border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
            {language === 'tr' ? 'MÜHENDİSLİK ŞEMASI' : 'ENGINEERING DIAGRAM'}
          </span>
          <h4 className="text-base font-extrabold text-white tracking-tight">
            {language === 'tr' ? 'Merkezi Limit Teoremi (CLT) & Standart Hata Daralması' : 'Central Limit Theorem (CLT) Shrinkage'}
          </h4>
        </div>
      </div>

      <div className="w-full h-44 my-2">
        <svg viewBox="0 0 600 170" className="w-full h-full overflow-visible">
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
        {language === 'tr'
          ? 'Örneklem büyüklüğü n arttıkça Standart Hata SE = σ / √n küçülür ve örneklem ortalamaları µ etrafında sıkıca kümelenir.'
          : 'As sample size n increases, SE = σ / √n shrinks and sample means tightly cluster around true mean µ.'}
      </p>
    </div>
  );
};
