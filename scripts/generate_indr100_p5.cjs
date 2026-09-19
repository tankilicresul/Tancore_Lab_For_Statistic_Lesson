const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '../src/data');

function saveModule(modData) {
  const file = path.join(dataDir, `${modData.id.replace('-', '')}.json`);
  fs.writeFileSync(file, JSON.stringify(modData, null, 2), 'utf8');
  console.log(`✓ Saved ${modData.id} (${modData.title.tr}) with ${modData.lessons.length} lessons & ${modData.caseExams.length} cases.`);
}

// =========================================================================
// MODULE 23: Verimlilik & İş Etüdü & İş Örneklemesi (Productivity, Standard Time)
// =========================================================================
const module23 = {
  id: "module-23",
  order: 23,
  title: {
    tr: "Modül 23: Verimlilik & İş Etüdü & İş Örneklemesi",
    en: "Module 23: Productivity, Work Study & Work Sampling"
  },
  description: {
    tr: "Tek ve çok faktörlü verimlilik, kronometreli zaman etüdü, performans derecelendirme, standart süre ve iş örneklemesi.",
    en: "Single and multi-factor productivity, stopwatch time study, rating factors, allowances, standard time, and statistical work sampling."
  },
  iconName: "Timer",
  lessons: [
    {
      id: "m23-l1", moduleId: "module-23", order: 1, difficulty: "basit",
      title: { tr: "Verimlilik (Productivity) ve Tek Faktörlü Ölçüm", en: "Productivity Concept & Single-Factor Productivity" },
      conceptCard: {
        tr: "**Verimlilik (Productivity):** Çıktıların bu çıktıları üretmek için kullanılan girdilere oranıdır:\n\n$$\\mathbf{\\text{Verimlilik} = \\frac{\\text{Çıktılar (Outputs)}}{\\text{Girdiler (Inputs)}}}$$\n\n**Tek Faktörlü Verimlilik (Single-Factor Productivity):** Çıktının tek bir girdi kaynağına (işgücü, makine saati veya malzeme) bölünmesidir:\n- **İşgücü Verimliliği:** $\\frac{\\text{Üretilen Adet}}{\\text{İşgücü Saati}}$\n- **Makine Verimliliği:** $\\frac{\\text{Üretilen Adet}}{\\text{Makine Saati}}$",
        en: "Productivity = Outputs / Inputs. Single-factor productivity measures output relative to a single resource: Labor Productivity = Units / Labor Hours."
      },
      companyExample: {
        tr: "**Örnek Soru:** 4 işçi 8 saat çalışarak toplam 320 adet gömlek dikmiştir. Toplam işgücü saati $4 \\times 8 = 32$ saattir. İşgücü verimliliği nedir?\n\n**Çözüm:**\n$$\\text{İşgücü Verimliliği} = \\frac{320 \\text{ adet}}{32 \\text{ saat}} = 10 \\text{ adet/saat}$$",
        en: "**Worked Example:** 4 workers working 8 hrs (32 man-hours) produce 320 shirts. Labor productivity = $320 / 32 = 10$ shirts/hour."
      },
      vocabTerms: [
        { term_en: "single-factor productivity", explanation_tr: "Çıktının tek bir girdi kaynağına (işçi-saati, makine-saati vb.) oranı.", explanation_en: "Ratio of total output to a single category of input resource.", exampleSentence_en: "Labor productivity increased to 10 units per worker-hour." }
      ],
      questions: [{
        id: "m23-l1-q1", type: "numeric",
        prompt: { tr: "5 işçi günde 8 saat çalışarak (toplam 40 saat) 200 adet motor üretmektedir. İşgücü verimliliği (adet/işçi-saati) kaçtır?", en: "5 workers working 8 hrs produce 200 units. What is labor productivity (units/hr)?" },
        correctAnswer: 5,
        explanation: { tr: "$$\\text{Verimlilik} = \\frac{200 \\text{ adet}}{5 \\times 8 \\text{ saat}} = \\frac{200}{40} = 5 \\text{ adet/saat}$$", en: "$$\\text{Productivity} = 200 / 40 = 5$$" }
      }],
      realWorldBox: { excelFormula: "=Çıktı_Adet / (İşçi_Sayısı * Saat)", pythonCode: "labor_prod = units / (workers * hours)", powerBiNote: { tr: "Vardiya bazlı işgücü verimlilik KPI'ı", en: "Worker shift productivity gauge" } }
    },
    {
      id: "m23-l2", moduleId: "module-23", order: 2, difficulty: "orta",
      title: { tr: "Çok Faktörlü Verimlilik (Multi-Factor Productivity)", en: "Multi-Factor Productivity (MFP)" },
      conceptCard: {
        tr: "**Çok Faktörlü Verimlilik (MFP):** Çıktının, üretimde kullanılan birden fazla girdinin (işgücü, malzeme, enerji, sermaye) ortak parasal değerine bölünmesidir:\n\n$$\\mathbf{\\text{MFP} = \\frac{\\text{Toplam Çıktı Değeri}}{\\text{İşgücü} + \\text{Malzeme} + \\text{Enerji} + \\text{Sermaye/Genel Gider}}}$$\n\n- Tüm girdiler TL veya USD gibi ortak bir para birimine dönüştürülerek toplanır.",
        en: "Multi-Factor Productivity (MFP) measures output value against the combined cost of labor, materials, energy, and capital: $\\text{MFP} = \\frac{\\text{Output Value}}{\\text{Labor} + \\text{Material} + \\text{Overhead}}$."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir mobilya atölyesi 50.000 TL değerinde masa üretmiştir. Girdiler: İşçilik 10.000 TL, Ahşap Malzeme 20.000 TL, Enerji 5.000 TL ve Genel Gider 5.000 TL'dir. Çok faktörlü verimlilik oranı nedir?\n\n**Çözüm:**\n$$\\text{Toplam Girdi} = 10k + 20k + 5k + 5k = 40.000 \\text{ TL}$$\n$$\\text{MFP} = \\frac{50.000}{40.000} = 1.25$$\nHer 1 TL'lik girdiye karşılık 1.25 TL çıktı elde edilmiştir.",
        en: "**Worked Example:** Output value = $50k. Costs: Labor $10k, Material $20k, Energy $5k, Overhead $5k (Total = $40k). $\\text{MFP} = 50k/40k = 1.25$."
      },
      vocabTerms: [
        { term_en: "Multi-Factor Productivity (MFP)", explanation_tr: "Çıktı değerinin işgücü, malzeme ve enerji gibi çoklu girdi maliyetlerine oranı.", explanation_en: "Measure of economic productivity comparing output to a composite of multiple input costs.", exampleSentence_en: "The multi-factor productivity ratio of 1.25 indicated a 25% value-added margin." }
      ],
      questions: [{
        id: "m23-l2-q1", type: "numeric",
        prompt: { tr: "Toplam çıktı değeri 100.000 TL olan bir süreçte işçilik maliyeti 30.000 TL, malzeme 40.000 TL ve enerji 10.000 TL ise MFP oranı kaçtır (virgülden sonra 2 basamak: örn 1.25)?", en: "Output = $100k. Labor = $30k, Material = $40k, Energy = $10k. What is MFP?" },
        correctAnswer: 1.25,
        explanation: { tr: "$$\\text{Girdi} = 30k + 40k + 10k = 80.000 \\text{ TL}$$\n$$\\text{MFP} = \\frac{100.000}{80.000} = 1.25$$", en: "$$\\text{MFP} = 100k / 80k = 1.25$$" }
      }],
      realWorldBox: { excelFormula: "=Çıktı_TL / TOPLA(Girdi_TL_Aralığı)", pythonCode: "mfp = output_value / sum(input_costs)", powerBiNote: { tr: "Fabrika toplam katma değer verimlilik endeksi", en: "Plant multi-factor productivity index" } }
    },
    {
      id: "m23-l3", moduleId: "module-23", order: 3, difficulty: "orta",
      title: { tr: "Zaman Etüdü ve Normal Süre (Observed vs Normal Time)", en: "Time Study: Observed Time & Rating Factor" },
      conceptCard: {
        tr: "**Kronometreli Zaman Etüdü:** Bir operasyonun ortalama süresini ölçmek ve adil bir standart belirlemek için uygulanır.\n\n1. **Gözlenen Süre (Observed Time - $OT$):** Kronometre ile yapılan $n$ adet ölçümün aritmetik ortalamasıdır:\n$$OT = \\frac{\\sum t_i}{n}$$\n\n2. **Performans Derecelendirme Faktörü (Performance Rating - $PR$):** Ortalama/normal çalışan temposu %100 ($1.0$) kabul edilir. Hızlı çalışan %120 ($1.20$), yavaş çalışan %80 ($0.80$) ile puanlanır.\n\n3. **Normal Süre (Normal Time - $NT$):** Normal tempodaki çalışanın operasyonu bitirme süresidir:\n$$\\mathbf{NT = OT \\times PR}$$",
        en: "Observed Time $OT = \\sum t / n$. Normal Time $NT = OT \\times PR$, where $PR$ is the performance rating factor (e.g. 1.15 for a worker 15% faster than standard pace)."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir operatörün montaj süresi ortalama $OT = 50$ saniye ölçülmüştür. Mühendis operatörün normalden %20 daha hızlı çalıştığını derecelendirmiştir ($PR = 1.20$). Normal Süre ($NT$) nedir?\n\n**Çözüm:**\n$$NT = OT \\times PR = 50 \\times 1.20 = 60 \\text{ saniye}$$",
        en: "**Worked Example:** $OT = 50$s, $PR = 1.20$. Normal Time $NT = 50 \\times 1.20 = 60$ seconds."
      },
      vocabTerms: [
        { term_en: "observed time (OT)", explanation_tr: "Operatörün kronometreyle ölçülen ham sürelerinin ortalaması.", explanation_en: "The average time recorded during direct stopwatch observations.", exampleSentence_en: "Observed time across 20 cycles was 50 seconds." },
        { term_en: "normal time (NT)", explanation_tr: "Gözlenen sürenin performans derecesi ile çarpılmasıyla bulunan standart tempo süresi.", explanation_en: "The time required by a qualified operator working at standard pace: OT * PR.", exampleSentence_en: "Normal time adjusts for fast or slow worker pacing." }
      ],
      questions: [{
        id: "m23-l3-q1", type: "numeric",
        prompt: { tr: "Gözlenen ortalama süre $OT = 40$ saniye ve operatör performans puanı $PR = 1.10$ ise Normal Süre ($NT$) kaç saniyedir?", en: "Observed time OT = 40s, PR = 1.10. What is Normal Time NT (in seconds)?" },
        correctAnswer: 44,
        explanation: { tr: "$$NT = OT \\times PR = 40 \\times 1.10 = 44 \\text{ saniye}$$", en: "$$NT = 40 \\times 1.10 = 44$$" }
      }],
      realWorldBox: { excelFormula: "=OT * PR", pythonCode: "normal_time = observed_time * performance_rating", powerBiNote: { tr: "Operatör tempo ve normal süre matrisi", en: "Work study rating factor calculation" } }
    },
    {
      id: "m23-l4", moduleId: "module-23", order: 4, difficulty: "orta",
      title: { tr: "Tolerans Payları ve Standart Süre (Standard Time)", en: "Allowances & Standard Time Formulation" },
      conceptCard: {
        tr: "**Tolerans Payları (Allowances):** İnsanlar robot değildir; kişisel ihtiyaçlar (su, tuvalet), yorgunluk dinlenmesi ve önlenemeyen operasyonel gecikmeler için Normal Süreye eklenen paydır ($AF$ - Allowance Fraction).\n\n**Standart Süre Formülü (İş Zamanı Bazında):**\n$$\\mathbf{ST = NT \\times (1 + AF)}$$\n\n- $ST$: Standart Süre (Standard Time)\n- $NT$: Normal Süre\n- $AF$: Tolerans Payı Oranı (Örn: %15 $\\implies AF = 0.15$)\n\n*(Eğer tolerans toplam iş günü bazında tanımlanırsa: $ST = \\frac{NT}{1 - AF_{\\text{gün}}}$)*",
        en: "Standard Time includes personal, fatigue, and delay allowances: $ST = NT \\times (1 + AF)$ where $AF$ is the total allowance percentage added to normal time."
      },
      companyExample: {
        tr: "**Örnek Soru:** Normal süresi $NT = 60$ saniye olan bir işleme %15 tolerans payı ($AF = 0.15$) eklenecektir. Standart Süre ($ST$) kaç saniyedir?\n\n**Çözüm:**\n$$ST = NT \\times (1 + AF) = 60 \\times (1 + 0.15) = 60 \\times 1.15 = 69 \\text{ saniye}$$",
        en: "**Worked Example:** $NT = 60$s, $AF = 15\\%$. $ST = 60 \\times 1.15 = 69$ seconds."
      },
      vocabTerms: [
        { term_en: "standard time (ST)", explanation_tr: "Normal süreye kişisel ve yorgunluk toleransları eklenmiş adil hedef iş süresi.", explanation_en: "The time required by a qualified operator at normal pace including allowances.", exampleSentence_en: "Piece-rate wages are calculated based on the official standard time." },
        { term_en: "allowances", explanation_tr: "Kişisel ihtiyaçlar, yorgunluk ve kaçınılmaz gecikmeler için tanınan ek dinlenme yüzdesi.", explanation_en: "Percentage adjustments added to normal time for personal needs, fatigue, and unavoidable delays.", exampleSentence_en: "Heavy lifting operations received a 15% fatigue allowance." }
      ],
      questions: [{
        id: "m23-l4-q1", type: "numeric",
        prompt: { tr: "Normal süresi $NT = 80$ saniye olan bir paketleme operasyonuna %10 tolerans ($AF = 0.10$) verilirse Standart Süre ($ST$) kaç saniyedir?", en: "Normal time NT = 80s, allowance AF = 10%. What is Standard Time ST (in seconds)?" },
        correctAnswer: 88,
        explanation: { tr: "$$ST = 80 \\times (1 + 0.10) = 80 \\times 1.10 = 88 \\text{ saniye}$$", en: "$$ST = 80 \\times 1.10 = 88$$" }
      }],
      realWorldBox: { excelFormula: "=NT * (1 + AF)", pythonCode: "standard_time = normal_time * (1 + allowance_fraction)", powerBiNote: { tr: "Standart iş süresi ve prim hesaplama modeli", en: "Standard time and wage incentive basis" } }
    },
    {
      id: "m23-l5", moduleId: "module-23", order: 5, difficulty: "ileri",
      title: { tr: "İş Örneklemesi ve Örneklem Büyüklüğü (Work Sampling)", en: "Statistical Work Sampling & Sample Size" },
      conceptCard: {
        tr: "**İş Örneklemesi (Work Sampling):** Sürekli kronometre tutmak yerine, rastgele zamanlarda yapılan anlık gözlemlerle makinelerin veya çalışanların belirli bir faaliyette (örn: çalışma vs boş bekleme) geçirdiği zaman yüzdesini ($\hat{p}$) istatistiksel olarak tahmin etme tekniğidir.\n\n$$\\hat{p} = \\frac{\\text{Gözlenen Durum Sayısı}}{\\text{Toplam Gözlem Sayısı } (n)}$$\n\n**Gereken Örneklem Büyüklüğü Formülü:**\n$$\\mathbf{n = \\frac{z^2 \\cdot \\hat{p}(1 - \\hat{p})}{e^2}}$$\n\n- $z$: Güven düzeyine karşılık gelen $z$-değeri (%95 için $z = 1.96$ veya $z \\approx 2$)\n- $\\hat{p}$: Tahmini gerçekleşme oranı\n- $e$: İzin verilen mutlak hata payı (Absolute acceptable error)",
        en: "Work Sampling statistically estimates the proportion of time spent on activities via random instantaneous observations: sample size $n = \\frac{z^2 \\hat{p}(1-\\hat{p})}{e^2}$."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir forklift filosunun boşta bekleme oranının $\\hat{p} = 0.20$ civarında olduğu tahmin edilmektedir. %95 güven düzeyinde ($z = 2$) ve en fazla $e = 0.04$ (%4) hata payı ile oranı tahmin etmek için kaç anlık gözlem ($n$) yapılmalıdır?\n\n**Çözüm:**\n$$n = \\frac{2^2 \\times 0.20 \\times (1 - 0.20)}{0.04^2} = \\frac{4 \\times 0.20 \\times 0.80}{0.0016} = \\frac{0.64}{0.0016} = 400 \\text{ gözlem}$$",
        en: "**Worked Example:** $\\hat{p} = 0.20, z = 2, e = 0.04$. Required observations: $n = (4 \\times 0.20 \\times 0.80) / 0.0016 = 400$ observations."
      },
      vocabTerms: [
        { term_en: "work sampling", explanation_tr: "Rastgele zamanlı anlık gözlemlerle faaliyet oranlarını tahmin eden istatistiksel metot.", explanation_en: "Statistical technique analyzing the proportions of time spent on various activity categories.", exampleSentence_en: "Work sampling revealed machines spent 22% of time waiting for setup." }
      ],
      questions: [{
        id: "m23-l5-q1", type: "numeric",
        prompt: { tr: "$z = 2$, $\\hat{p} = 0.25$ ve $e = 0.05$ için gereken İş Örneklemesi gözlem sayısı $n = \\frac{z^2 \\hat{p}(1-\\hat{p})}{e^2}$ kaçtır?", en: "For z = 2, p = 0.25, e = 0.05, what is required sample size n?" },
        correctAnswer: 300,
        explanation: { tr: "$$n = \\frac{4 \\times 0.25 \\times 0.75}{0.0025} = \\frac{0.75}{0.0025} = 300$$", en: "$$n = (4 \\times 0.25 \\times 0.75) / 0.0025 = 300$$" }
      }],
      realWorldBox: { excelFormula: "=(Z^2 * p * (1-p)) / (e^2)", pythonCode: "n_obs = (z**2 * p_hat * (1 - p_hat)) / (error_margin**2)", powerBiNote: { tr: "İş örneklemesi güven aralığı paneli", en: "Work sampling confidence interval dashboard" } }
    }
  ],
  caseExams: [
    {
      id: "m23-c1",
      moduleId: "module-23",
      difficulty: "orta",
      title: { tr: "Vaka Sınavı: LC Waikiki Lojistik Merkezi Paketleme Standart Süre & Verimlilik", en: "Case Exam: LC Waikiki Fulfillment Packing Standard Time & Work Study" },
      businessQuestion: {
        tr: "LC Waikiki e-ticaret dağıtım merkezinde sipariş paketleme istasyonunda zaman etüdü yapılmıştır. 50 döngü boyunca ölçülen ortalama gözlenen süre $OT = 45$ saniyedir. Zaman etüdü uzmanı operatörün hızını standarttan %10 hızlı olarak derecelendirmiştir ($PR = 1.10$). Şirket kişisel ihtiyaçlar, yorgunluk ve etiket bekleme gecikmeleri için toplam %15 tolerans payı ($AF = 0.15$) tanımlamıştır. 1) Paketin Normal Süresini ($NT$), 2) Paketin Standart Süresini ($ST$) hesaplayınız. 3) Günde 8 saat çalışan bir paketleme operatörünün günlük standart üretim kotası kaç paket olmalıdır?",
        en: "LC Waikiki fulfillment center conducted packing time studies: $OT = 45$ sec across 50 cycles, rating factor $PR = 1.10$, and allowance $AF = 15\\%$. Compute: 1) Normal time $NT$, 2) Standard time $ST$, and 3) Daily 8-hr standard package quota."
      },
      dataset: {
        columns: ["Metrik", "Formül", "Hesaplanan_Değer", "Birim"],
        rows: [
          ["Gözlenen Süre (OT)", "Ölçüm Ortalaması", 45, "saniye"],
          ["Performans Derecesi (PR)", "Derecelendirme", 1.10, "çarpan"],
          ["Normal Süre (NT)", "45 * 1.10", 49.5, "saniye"],
          ["Tolerans Payı (AF)", "Yorgunluk/Kişisel", 0.15, "%15"],
          ["Standart Süre (ST)", "49.5 * 1.15", 56.925, "saniye"],
          ["Günlük Çalışma Süresi", "8 saat", 28800, "saniye"],
          ["Günlük Standart Kota", "28800 / 56.925", 505.9, "paket/gün"]
        ]
      },
      guidedSteps: [
        { tr: "1. Adım: Normal Süre: $NT = 45 \\times 1.10 = 49.5$ saniye.", en: "Step 1: Normal Time $NT = 45 \\times 1.10 = 49.5$ sec." },
        { tr: "2. Adım: Standart Süre: $ST = 49.5 \\times 1.15 = 56.925$ saniye.", en: "Step 2: Standard Time $ST = 49.5 \\times 1.15 = 56.925$ sec." },
        { tr: "3. Adım: Günlük Kota: $28.800 / 56.925 \\approx 506$ paket/gün.", en: "Step 3: Daily quota = 506 packs/day." }
      ],
      expectedApproach: {
        tr: "Zaman etüdü adımlarıyla gözlenen süreden standart süreye geçip günlük üretim kotasını belirleme.",
        en: "Translating stopwatch observations into allowances-adjusted standard times and production targets."
      },
      solutionQuestions: [{
        id: "m23-c1-q1", type: "numeric",
        prompt: { tr: "Paketleme operasyonunun Normal Süresi ($NT = OT \\times PR$) kaç saniyedir?", en: "What is the Normal Time NT (in seconds)?" },
        correctAnswer: 49.5,
        explanation: { tr: "$$NT = 45 \\times 1.10 = 49.5 \\text{ saniye}$$", en: "$$NT = 45 \\times 1.10 = 49.5$$" }
      }]
    }
  ]
};

// =========================================================================
// MODULE 24: Modelleme Kavramları & Doğrusal Programlama (LP)
// =========================================================================
const module24 = {
  id: "module-24",
  order: 24,
  title: {
    tr: "Modül 24: Modelleme Kavramları & Doğrusal Programlama",
    en: "Module 24: Modeling Concepts & Linear Programming"
  },
  description: {
    tr: "Optimizasyon modeli bileşenleri, LP formülasyonu, grafik çözüm, köşe noktaları yöntemi, artık/bağlayıcı kısıtlar ve ağ modelleri.",
    en: "Optimization model elements, LP formulation, graphical solution method, corner point theorem, slack/surplus analysis, and network models."
  },
  iconName: "TrendingUp",
  lessons: [
    {
      id: "m24-l1", moduleId: "module-24", order: 1, difficulty: "basit",
      title: { tr: "Matematiksel Modellemenin 3 Temel Bileşeni", en: "3 Core Elements of Mathematical Modeling" },
      conceptCard: {
        tr: "Tüm optimizasyon modelleri 3 temel yapıtaşından oluşur:\n\n1. **Karar Değişkenleri (Decision Variables - $x_1, x_2, \\dots, x_n$):** Karar vericinin kontrol edebildiği, değeri bulunmak istenen bilinmeyenlerdir (Örn: Üretilecek A ve B ürünü miktarları).\n2. **Amaç Fonksiyonu (Objective Function - $Z$):** Maksimize (kâr, verim) veya minimize (maliyet, süre, fire) edilmek istenen matematiksel hedef fonksiyonudur:\n$$\\max Z = c_1 x_1 + c_2 x_2$$\n3. **Kısıtlar (Constraints):** Hammadde, işgücü kapasitesi veya talep gibi kaynak sınırlarını belirten eşitlik veya eşitsizliklerdir ($ax_1 + bx_2 \\le b_i$).\n4. **Negatif Olmama Koşulu (Non-negativity):** Fiziksel değişkenler negatif olamaz ($x_1 \\ge 0, x_2 \\ge 0$).",
        en: "The 3 foundational optimization pillars: Decision variables $x_j$, Objective function $\\max/\\min Z = \\sum c_j x_j$, Constraints $\\sum a_{ij} x_j \\le b_i$, and Non-negativity $x_j \\ge 0$."
      },
      companyExample: {
        tr: "**Örnek Soru:** Bir marangoz sandalye ($x_1$) ve masa ($x_2$) üretmektedir. Sandalye kârı 50 TL, masa kârı 120 TL'dir. Amaç fonksiyonu nasıl yazılır?\n\n**Çözüm:**\n$$\\max Z = 50 x_1 + 120 x_2$$",
        en: "**Worked Example:** Chair profit $50, table profit $120. Objective: $\\max Z = 50 x_1 + 120 x_2$."
      },
      vocabTerms: [
        { term_en: "decision variables", explanation_tr: "Optimizasyon modelinde değeri çözülerek bulunacak kontrol edilebilir değişkenler.", explanation_en: "Variables within a model that the decision maker can control.", exampleSentence_en: "Decision variables represent daily production quantities." },
        { term_en: "objective function", explanation_tr: "Modelin maksimize veya minimize etmeyi hedeflediği matematiksel denklem.", explanation_en: "The mathematical expression to be optimized (maximized or minimized).", exampleSentence_en: "The objective function maximizes net operating margin." }
      ],
      questions: [{
        id: "m24-l1-q1", type: "multiple-choice",
        prompt: { tr: "Bir optimizasyon modelinde kâr maksimizasyonunu veya maliyet minimizasyonunu belirten matematiksel ifadeye ne ad verilir?", en: "What is the mathematical equation to be maximized or minimized called?" },
        options: [
          { tr: "Amaç Fonksiyonu (Objective Function)", en: "Objective Function" },
          { tr: "Karar Değişkeni", en: "Decision Variable" },
          { tr: "Kapasite Kısıtı", en: "Capacity Constraint" },
          { tr: "Negatif Olmama Koşulu", en: "Non-negativity Condition" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Amaç fonksiyonu maksimize veya minimize edilmek istenen hedef denklemidir.", en: "The objective function defines the performance target." }
      }],
      realWorldBox: { excelFormula: "=TOPLA.ÇARPIM(Katsayılar; Değişkenler)", pythonCode: "from scipy.optimize import linprog\n# c = [-50, -120] (for max)", powerBiNote: { tr: "Optimizasyon hedef kâr paneli", en: "Optimization target profit visual" } }
    },
    {
      id: "m24-l2", moduleId: "module-24", order: 2, difficulty: "orta",
      title: { tr: "Doğrusal Programlama (LP) Temel Varsayımları", en: "Linear Programming (LP) Core Assumptions" },
      conceptCard: {
        tr: "Bir problemin Doğrusal Programlama (LP) ile çözülebilmesi için 4 temel varsayım sağlanmalıdır:\n\n1. **Doğrusallık / Oransallık (Proportionality):** Her değişkenin katkısı seviyesiyle doğru orantılıdır (Toptan indirim veya ölçek kâr artışı yoktur).\n2. **Toplanabilirlik (Additivity):** Toplam etki, her bir değişkenin bireysel etkilerinin toplamına eşittir (Çapraz etkileşim terimleri $x_1 x_2$ bulunmaz).\n3. **Bölünebilirlik (Divisibility):** Karar değişkenleri kesirli/ondalıklı değerler alabilir (Örn: $x_1 = 3.75$ litre).\n4. **Belirlilik (Certainty):** Model parametreleri ($c_j, a_{ij}, b_i$) kesin ve sabit olarak bilinmektedir.",
        en: "The 4 LP assumptions: Proportionality (linear contribution), Additivity (no interaction terms), Divisibility (fractional solutions allowed), and Certainty (known deterministic coefficients)."
      },
      companyExample: {
        tr: "**Örnek Soru:** Amaç fonksiyonunda $Z = 5 x_1^2 + 3 x_1 x_2$ terimi bulunursa bu model Doğrusal Programlama (LP) midir?\n\n**Çözüm:** Hayır! $x_1^2$ ve $x_1 x_2$ terimleri doğrusal değildir ve toplanabilirlik/oransallık varsayımını bozar (Doğrusal Olmayan Programlama / NLP olur).",
        en: "**Worked Example:** Terms like $x_1^2$ or $x_1 x_2$ violate linearity and proportionality."
      },
      vocabTerms: [
        { term_en: "proportionality assumption", explanation_tr: "Maliyet ve katkıların karar değişkeninin büyüklüğüyle doğrusal orantılı olması varsayımı.", explanation_en: "Assumption that the contribution of each variable is directly proportional to its value.", exampleSentence_en: "Proportionality excludes non-linear quantity discounts from pure LP." }
      ],
      questions: [{
        id: "m24-l2-q1", type: "multiple-choice",
        prompt: { tr: "Aşağıdakilerden hangisi Doğrusal Programlamanın (LP) temel 4 varsayımından biri DEĞİLDİR?", en: "Which of the following is NOT a core LP assumption?" },
        options: [
          { tr: "Rastgelelik ve Belirsizlik (Stokastiklik)", en: "Randomness & Stochastic Uncertainty" },
          { tr: "Oransallık (Proportionality)", en: "Proportionality" },
          { tr: "Toplanabilirlik (Additivity)", en: "Additivity" },
          { tr: "Bölünebilirlik (Divisibility)", en: "Divisibility" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Standart LP deterministiktir ve Belirlilik (Certainty) varsayar; stokastiklik LP'nin varsayımı değildir.", en: "Standard LP assumes certainty, not stochastic randomness." }
      }],
      realWorldBox: { excelFormula: "=EĞER(Üslü_Terim_Var; \"Doğrusal Değil\"; \"LP Geçerli\")", pythonCode: "is_linear = all(degree == 1 for degree in term_degrees)", powerBiNote: { tr: "Model doğrusallık kontrol mekanizması", en: "Model linearity audit" } }
    },
    {
      id: "m24-l3", moduleId: "module-24", order: 3, difficulty: "orta",
      title: { tr: "Grafik Çözüm ve Uygun Çözüm Bölgesi", en: "Graphical Solution & Feasible Region" },
      conceptCard: {
        tr: "2 karar değişkenli ($x_1, x_2$) LP problemlerinde grafik yöntem adımları:\n\n1. Her kısıt eşitsizliğini eşitlik doğrusu ($ax_1 + bx_2 = b_i$) olarak $x_1-x_2$ koordinat sisteminde çiz.\n2. Eşitsizliğin yönüne göre ($\le$ için orijin yönü, $\ge$ için dış yön) geçerli yarı düzlemi belirle.\n3. Tüm kısıtların ve $x_1 \\ge 0, x_2 \\ge 0$ bölgesinin kesişimi **Uygun Çözüm Bölgesi (Feasible Region)** oluşturur.\n4. Eş-Kâr (Iso-Profit) doğrusunu kâr artış yönünde uygun bölgenin en uç noktasına kadar ötele.",
        en: "The graphical method graphs constraint lines to identify the convex Feasible Region satisfying all constraints simultaneously, then sweeps the iso-profit line to the optimal point."
      },
      companyExample: {
        tr: "**Örnek Soru:** $x_1 + x_2 \\le 10$, $x_1 \\ge 0, x_2 \\ge 0$ kısıtının eksenleri kestiği noktalar nelerdir?\n\n**Çözüm:**\n- $x_1 = 0 \\implies x_2 = 10 \\implies (0, 10)$\n- $x_2 = 0 \\implies x_1 = 10 \\implies (10, 0)$",
        en: "**Worked Example:** Line $x_1 + x_2 = 10$ intercepts the axes at $(0, 10)$ and $(10, 0)$."
      },
      vocabTerms: [
        { term_en: "feasible region", explanation_tr: "Modeldeki tüm kısıtları ve negatif olmama koşullarını aynı anda sağlayan çözüm kümesi.", explanation_en: "The set of all points satisfying all constraints and non-negativity restrictions.", exampleSentence_en: "The optimal solution always lies on the boundary of the feasible region." }
      ],
      questions: [{
        id: "m24-l3-q1", type: "multiple-choice",
        prompt: { tr: "Bir LP probleminde tüm kısıtları ve negatif olmama koşullarını aynı anda sağlayan noktalar kümesine ne ad verilir?", en: "What is the set of points satisfying all constraints simultaneously called?" },
        options: [
          { tr: "Uygun Çözüm Bölgesi (Feasible Region)", en: "Feasible Region" },
          { tr: "Sınırsız Bölge", en: "Unbounded Area" },
          { tr: "Boş Küme", en: "Null Set" },
          { tr: "Negatif Düzlem", en: "Negative Plane" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Tüm kısıtları sağlayan ortak alan Uygun Çözüm Bölgesi'dir.", en: "The feasible region contains all candidate points meeting all constraints." }
      }],
      realWorldBox: { excelFormula: "=EĞER(VE(Kısıt1; Kısıt2; x1>=0; x2>=0); \"Uygun\"; \"Uygunsuz\")", pythonCode: "import matplotlib.pyplot as plt\n# Plotting constraint boundaries", powerBiNote: { tr: "2D Uygun Çözüm Alanı Görseli", en: "Feasible region 2D poly visual" } }
    },
    {
      id: "m24-l4", moduleId: "module-24", order: 4, difficulty: "orta",
      title: { tr: "Köşe Noktaları Teoremi ve Optimal Çözüm", en: "Corner Point Theorem & Optimal Solution" },
      conceptCard: {
        tr: "**Köşe Noktaları Teoremi (Extreme Point Theorem):**\nBir Doğrusal Programlama probleminin optimal çözümü varsa, bu çözüm kesinlikle **Uygun Çözüm Bölgesinin en az bir KÖŞE NOKTASINDA (Corner Point / Extreme Point)** yer alır.\n\n**Çözüm Adımları:**\n1. Uygun bölgenin tüm köşe noktalarının koordinatlarını ($x_1, x_2$) kısıt doğrularının kesişiminden hesapla.\n2. Her köşe noktasının koordinatlarını Amaç Fonksiyonunda ($Z$) yerine koy.\n3. Maksimizasyon için en büyük $Z$, Minimizasyon için en küçük $Z$ değerini veren köşe **Optimal Çözümdür**.",
        en: "The Corner Point Theorem proves that an optimal LP solution always occurs at one of the extreme (corner) vertices of the convex feasible region."
      },
      companyExample: {
        tr: "**Örnek Soru:** $\\max Z = 3x_1 + 5x_2$ modelinde uygun bölgenin köşe noktaları $A(0,0)$, $B(4,0)$, $C(2,3)$ ve $D(0,4)$'tür. Optimal çözüm ve maksimum $Z$ nedir?\n\n**Çözüm:**\n- $Z(A) = 3(0) + 5(0) = 0$\n- $Z(B) = 3(4) + 5(0) = 12$\n- $Z(C) = 3(2) + 5(3) = 6 + 15 = 21$\n- $Z(D) = 3(0) + 5(4) = 20$\nOptimal Çözüm: $C(2,3)$ noktasında $Z^* = 21$.",
        en: "**Worked Example:** Vertices: A(0,0)->0, B(4,0)->12, C(2,3)->21, D(0,4)->20. Optimal vertex is C(2,3) with $Z^* = 21$."
      },
      vocabTerms: [
        { term_en: "corner point method", explanation_tr: "Tüm köşe noktalarındaki Z değerlerini hesaplayarak optimumu bulan kesin yöntem.", explanation_en: "Method evaluating the objective function at every vertex of the feasible polygon.", exampleSentence_en: "The corner point method identified vertex C as the global optimum." }
      ],
      questions: [{
        id: "m24-l4-q1", type: "numeric",
        prompt: { tr: "$\\max Z = 10x_1 + 20x_2$ için köşe noktaları $A(0,0)$, $B(5,0)$ ve $C(3,4)$ olduğuna göre maksimum $Z$ değeri kaçtır?", en: "For max Z = 10x1 + 20x2, vertices are A(0,0), B(5,0), C(3,4). Max Z?" },
        correctAnswer: 110,
        explanation: { tr: "$$Z(A)=0, Z(B)=50, Z(C) = 10(3) + 20(4) = 30 + 80 = 110$$", en: "$$Z(C) = 30 + 80 = 110$$" }
      }],
      realWorldBox: { excelFormula: "=MAK(Z_Köşe1; Z_Köşe2; Z_Köşe3)", pythonCode: "z_values = [c1*x1 + c2*x2 for x1, x2 in corner_points]\noptimal_z = max(z_values)", powerBiNote: { tr: "Köşe noktaları kâr karşılaştırma kartı", en: "Corner point comparative evaluator" } }
    },
    {
      id: "m24-l5", moduleId: "module-24", order: 5, difficulty: "orta",
      title: { tr: "Artık ve Fazlalık Değişkenleri (Slack & Surplus)", en: "Slack & Surplus Variables & Binding Constraints" },
      conceptCard: {
        tr: "**1. Artık Değişken (Slack Variable - $s_i \\ge 0$):** $\\le$ tipi kısıtlarda kullanılmayan atıl kaynak miktarını gösterir:\n$$ax_1 + bx_2 + s_i = b_i$$\n\n**2. Fazlalık Değişken (Surplus Variable - $e_i \\ge 0$):** $\\ge$ tipi kısıtlarda asgari gereksinimin ne kadar aşıldığını gösterir:\n$$ax_1 + bx_2 - e_i = b_i$$\n\n**3. Bağlayıcı Kısıt (Binding Constraint):** Optimal çözümde kaynağın tamamının kullanıldığı ($s_i = 0$ veya $e_i = 0$), tam sınırda olan kısıttır. Eşitliğin sağ tarafı $b_i$ artarsa optimal $Z$ değişir (Gölge Fiyat $> 0$).\n**4. Bağlayıcı Olmayan Kısıt (Non-binding):** Optimal çözümde atıl kaynak kalan kısıttır ($s_i > 0$).",
        en: "Slack $s_i = b_i - \\sum a_{ij} x_j \\ge 0$ measures unused resource in $\\le$ constraints. Binding constraints have zero slack ($s_i = 0$); non-binding constraints have positive slack."
      },
      companyExample: {
        tr: "**Örnek Soru:** 100 saatlik işgücü kısıtında ($2x_1 + 4x_2 \\le 100$) optimal çözümde $x_1^* = 20, x_2^* = 10$ üretilmiştir. Artık (Slack) miktarı nedir?\n\n**Çözüm:**\n$$\\text{Kullanılan İşgücü} = 2(20) + 4(10) = 40 + 40 = 80 \\text{ saat}$$\n$$\\text{Slack } (s) = 100 - 80 = 20 \\text{ saat atıl işgücü}$$\nKısıt bağlayıcı değildir (Non-binding).",
        en: "**Worked Example:** Used = $2(20) + 4(10) = 80$ hrs vs 100 hr capacity. Slack $s = 100 - 80 = 20$ hrs."
      },
      vocabTerms: [
        { term_en: "slack variable", explanation_tr: "Küçük-eşittir kısıtlarında sol taraf ile sağ taraf arasındaki atıl/kullanılmayan fark.", explanation_en: "Variable representing unused capacity in a less-than-or-equal-to constraint.", exampleSentence_en: "The steel constraint had zero slack, proving it was a binding bottleneck." },
        { term_en: "binding constraint", explanation_tr: "Optimal noktada eşitlik olarak sağlanan, hiç atıl kaynak bırakmayan kısıt.", explanation_en: "A constraint that holds with strict equality at the optimal solution point.", exampleSentence_en: "Adding capacity to a binding constraint immediately increases maximum profit." }
      ],
      questions: [{
        id: "m24-l5-q1", type: "numeric",
        prompt: { tr: "Kapasite sınırı 50 saat olan bir makinede optimal üretim $3x_1 + 2x_2 \\le 50$ için $x_1=10, x_2=5$ ise atıl kalan Artık (Slack) süre kaç saattir?", en: "Capacity = 50. Used = 3(10) + 2(5) = 40. What is the Slack value?" },
        correctAnswer: 10,
        explanation: { tr: "$$\\text{Slack} = 50 - [3(10) + 2(5)] = 50 - 40 = 10 \\text{ saat}$$", en: "$$\\text{Slack} = 50 - 40 = 10$$" }
      }],
      realWorldBox: { excelFormula: "=Kapasite - Gerçek_Kullanım", pythonCode: "slack = rhs_value - sum(a * x for a, x in zip(coeffs, sol))", powerBiNote: { tr: "Kapasite darboğaz ve slack analiz tablosu", en: "Resource slack and bottleneck indicator" } }
    },
    {
      id: "m24-l6", moduleId: "module-24", order: 6, difficulty: "orta",
      title: { tr: "LP'de Özel Durumlar: Sınırsız, Uygunsuz ve Çoklu Çözüm", en: "Special LP Cases: Alternative Optima, Infeasible & Unbounded" },
      conceptCard: {
        tr: "Doğrusal Programlamada karşılaşılan 3 özel durum:\n\n1. **Çoklu / Alternatif Optimal Çözümler (Multiple / Alternative Optima):** Amaç fonksiyonu doğrusunun eğimi, bağlayıcı bir kısıt doğrusunun eğimine tam paralel olduğunda oluşur. İki köşe noktası ve aralarındaki tüm doğru parçası aynı maksimum $Z$ değerini verir (Sonsuz sayıda optimal çözüm).\n2. **Uygun Olmayan Çözüm (Infeasibility):** Kısıtlar birbiriyle çelişir ve uygun çözüm bölgesi boştur ($x_1 \\le 2$ VE $x_1 \\ge 5$).\n3. **Sınırsız Çözüm (Unboundedness):** Kısıtlar amaç yönünde açık bırakılmıştır ve $Z \\rightarrow \\infty$ sonsuza gider (Gerçekçi olmayan modelleme hatası).",
        en: "Special LP conditions: 1) Multiple optima (iso-profit line parallel to a binding constraint segment), 2) Infeasible (empty region due to conflicting constraints), 3) Unbounded ($Z \\rightarrow \\infty$ due to missing boundary constraints)."
      },
      companyExample: {
        tr: "**Örnek Soru:** $\\max Z = 2x_1 + 4x_2$ amaç fonksiyonunun eğimi ile $x_1 + 2x_2 \\le 10$ kısıtının eğimi her ikisi de $-\\frac{1}{2}$'dir. Bu modelde kaç optimal çözüm vardır?\n\n**Çözüm:** Eğimler birebir aynı olduğu için kısıt doğrusu üzerindeki tüm noktalarda aynı maksimum $Z = 20$ elde edilir $\\implies$ **Sonsuz sayıda alternatif optimal çözüm** vardır.",
        en: "**Worked Example:** Objective and constraint have identical slope -1/2. Infinitely many alternative optima exist along the boundary segment."
      },
      vocabTerms: [
        { term_en: "alternative optimal solutions", explanation_tr: "Aynı maksimum amaç fonksiyonu değerini veren birden çok geçerli çözüm noktası.", explanation_en: "Condition where more than one solution vector yields the same optimal objective value.", exampleSentence_en: "Alternative optima give managers flexibility to choose based on secondary criteria." }
      ],
      questions: [{
        id: "m24-l6-q1", type: "multiple-choice",
        prompt: { tr: "Amaç fonksiyonu doğrusu, bağlayıcı bir kısıt doğrusuna tam paralel olduğunda ne tür bir özel durum ortaya çıkar?", en: "When the objective line is exactly parallel to a binding constraint line, what condition occurs?" },
        options: [
          { tr: "Çoklu / Alternatif Optimal Çözümler (Multiple Optima)", en: "Multiple / Alternative Optimal Solutions" },
          { tr: "Uygun Olmayan Çözüm (Infeasible)", en: "Infeasible Solution" },
          { tr: "Sınırsız Çözüm (Unbounded)", en: "Unbounded Solution" },
          { tr: "Sıfır Kâr", en: "Zero Profit" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Paralel eğim durumunda doğru parçası üzerindeki sonsuz nokta aynı maksimum kârı verir (Çoklu Optima).", en: "Parallel slope results in infinite alternative optimal solutions along the constraint face." }
      }],
      realWorldBox: { excelFormula: "=EĞER(Eğim_Z = Eğim_Kısıt; \"Çoklu Optima\"; \"Tekil Çözüm\")", pythonCode: "is_multiple_optima = abs(slope_z - slope_constraint) < 1e-6", powerBiNote: { tr: "Alternatif operasyonel strateji esneklik haritası", en: "Alternative optima strategy selector" } }
    },
    {
      id: "m24-l7", moduleId: "module-24", order: 7, difficulty: "ileri",
      title: { tr: "Ağ Modelleri, Ulaştırma ve Simülasyon", en: "Network Models, Transportation & Simulation" },
      conceptCard: {
        tr: "**1. Ulaştırma Modeli (Transportation Problem):** $m$ adet fabrikadan $n$ adet depoya minimum maliyetle ürün sevk etme LP modelidir:\n$$\\min \\sum_{i=1}^{m} \\sum_{j=1}^{n} c_{ij} x_{ij} \\quad \\text{kısıtlar: } \\sum_{j} x_{ij} \\le S_i, \\quad \\sum_{i} x_{ij} \\ge D_j$$\n\n**2. Ayrık Olay Simülasyonu (Discrete-Event Simulation):** Matematiksel olarak kapalı formülle çözülemeyen karmaşık ve rastgele değişkenli kuyruk/üretim sistemlerinin bilgisayarda zaman adımlarıyla taklit edilmesidir (Örn: Arena, Simio, AnyLogic).\n\n**3. Ekonometrik & Tahmin Modelleri:** Geçmiş zaman serisi ve korelasyon verilerini kullanarak gelecek talebi öngören istatistiksel modellerdir.",
        en: "Transportation LP models minimize distribution costs across supply nodes $S_i$ and demand nodes $D_j$. Discrete-Event Simulation mimics complex stochastic dynamic systems over time."
      },
      companyExample: {
        tr: "**Örnek Soru:** A fabrikasından B deposuna 100 birim ürün taşınacaktır. Birim taşıma maliyeti $c_{AB} = 4$ TL ise toplam taşıma maliyeti nedir?\n\n**Çözüm:**\n$$\\text{Maliyet} = 100 \\times 4 = 400 \\text{ TL}$$",
        en: "**Worked Example:** Shipping 100 units from Plant A to Depot B at $4/unit costs $100 \\times 4 = 400$ TL."
      },
      vocabTerms: [
        { term_en: "transportation problem", explanation_tr: "Arz noktalarından talep noktalarına toplam taşıma maliyetini minimize eden özel LP ağ modeli.", explanation_en: "Specialized linear program minimizing distribution costs from origins to destinations.", exampleSentence_en: "The transportation model reduced national freight shipping expenses by 14%." },
        { term_en: "discrete-event simulation", explanation_tr: "Zamanın olaydan olaya sıçradığı stokastik sistem davranışını modelleyen bilgisayar simülasyonu.", explanation_en: "Modeling approach where system state changes at discrete chronological event points.", exampleSentence_en: "Simulation revealed unexpected bottlenecks in the baggage handling conveyor." }
      ],
      questions: [{
        id: "m24-l7-q1", type: "multiple-choice",
        prompt: { tr: "Fabrikalardan bölge depolarına yapılan sevkiyatlarda toplam nakliye maliyetini en aza indiren özel Doğrusal Programlama modeline ne ad verilir?", en: "What specialized LP model minimizes freight shipping costs from supply origins to demand destinations?" },
        options: [
          { tr: "Ulaştırma / Dağıtım Modeli (Transportation Problem)", en: "Transportation Problem" },
          { tr: "Kuyruk Modeli", en: "Queueing Model" },
          { tr: "Çok Kriterli Karar Verme", en: "MCDM Model" },
          { tr: "Kritik Yol Yöntemi (CPM)", en: "Critical Path Method" }
        ],
        correctAnswer: 0,
        explanation: { tr: "Ulaştırma problemi, arz ve talep dengesi altında en düşük maliyetli rotalamayı yapan LP modelidir.", en: "The transportation problem optimizes flow from supply origins to demand destinations." }
      }],
      realWorldBox: { excelFormula: "=ÇÖZÜCÜ(Hedef; Değişkenler; Kısıtlar; \"Doğrusal LP\")", pythonCode: "import pulp\nprob = pulp.LpProblem('Transportation', pulp.LpMinimize)", powerBiNote: { tr: "Tedarik zinciri lojistik ağ optimizasyon haritası", en: "Supply chain network distribution map" } }
    }
  ],
  caseExams: [
    {
      id: "m24-c1",
      moduleId: "module-24",
      difficulty: "zor",
      title: { tr: "Vaka Sınavı: Şişecam Optimum Üretim Karması & Kâr Maksimizasyonu LP Modeli", en: "Case Exam: Şişecam Optimal Product Mix & Profit Maximization LP" },
      businessQuestion: {
        tr: "Şişecam fabrikasında 2 ana ürün üretilmektedir: Cam Şişe ($x_1$) ve Cam Bardak ($x_2$). Şişe başına net kâr 40 TL, bardak başına kâr 60 TL'dir (Amaç: $\\max Z = 40x_1 + 60x_2$). Üretim için 2 kısıt vardır: 1) Fırın Eritme Kapasitesi: $x_1 + 2x_2 \\le 80$ ton/gün, 2) Şekillendirme Makinesi Kapasitesi: $2x_1 + x_2 \\le 100$ saat/gün. Negatif olmama: $x_1 \\ge 0, x_2 \\ge 0$. 1) Uygun çözüm bölgesinin 4 köşe noktasını bulunuz ($A(0,0)$, $B(50,0)$, $C(x_1, x_2)$, $D(0,40)$). 2) İki kısıtın kesiştiği $C$ köşe noktasının koordinatlarını hesaplayınız. 3) Maksimum kârı veren optimal üretim karmasını ($x_1^*, x_2^*$) ve maksimum günlük kârı ($Z^*$) bulunuz.",
        en: "Şişecam produces Glass Bottles ($x_1$, profit $40) and Glass Cups ($x_2$, profit $60). Model: $\\max Z = 40x_1 + 60x_2$ subject to: 1) Furnace: $x_1 + 2x_2 \\le 80$, 2) Forming: $2x_1 + x_2 \\le 100$, $x_1, x_2 \\ge 0$. Compute the intersection vertex C, evaluate all corner points, and find optimal daily profit Z*."
      },
      dataset: {
        columns: ["Köşe_Noktası", "x1_Şişe", "x2_Bardak", "Fırın_Kullanım", "Şekillendirme_Kullanım", "Kâr_Z_TL"],
        rows: [
          ["A (Orijin)", 0, 0, 0, 0, 0],
          ["B", 50, 0, 50, 100, 2000],
          ["C (Optimal)", 40, 20, 80, 100, 2800],
          ["D", 0, 40, 80, 40, 2400]
        ]
      },
      guidedSteps: [
        { tr: "1. Adım: Kesişim noktası C için 2 kısıt denklemini çöz:\n$$x_1 + 2x_2 = 80 \\implies x_1 = 80 - 2x_2$$\n$$2(80 - 2x_2) + x_2 = 100 \\implies 160 - 4x_2 + x_2 = 100 \\implies 3x_2 = 60 \\implies x_2 = 20$$\n$$x_1 = 80 - 2(20) = 40$$. Kesişim: $C(40, 20)$.", en: "Step 1: Solve intersection: $x_1 = 40, x_2 = 20$." },
        { tr: "2. Adım: Köşelerde Z değerlerini hesapla:\n$Z(A) = 0$\n$Z(B) = 40(50) + 0 = 2000$\n$Z(C) = 40(40) + 60(20) = 1600 + 1200 = 2800$\n$Z(D) = 40(0) + 60(40) = 2400$.", en: "Step 2: Z values: A: 0, B: 2000, C: 2800, D: 2400." },
        { tr: "3. Adım: Maksimum kâr $C(40, 20)$ noktasında $Z^* = 2.800$ TL olarak bulunur.", en: "Step 3: Optimal product mix is 40 bottles and 20 cups yielding $2,800 TL." }
      ],
      expectedApproach: {
        tr: "Köşe noktaları teoremi ve eşzamanlı denklem çözümü ile 2 boyutlu LP modelinin optimal çözümünü bulma.",
        en: "Applying extreme point theorem and linear algebra to compute optimal product mix and maximum profit."
      },
      solutionQuestions: [{
        id: "m24-c1-q1", type: "numeric",
        prompt: { tr: "Şişecam'ın günlük maksimum kârı ($Z^*$) kaç TL'dir?", en: "What is Şişecam's maximum daily profit Z* in TL?" },
        correctAnswer: 2800,
        explanation: { tr: "$$Z^* = 40(40) + 60(20) = 1.600 + 1.200 = 2.800 \\text{ TL}$$", en: "$$Z^* = 40(40) + 60(20) = 2,800$$" }
      }]
    }
  ]
};

saveModule(module23);
saveModule(module24);
console.log('Indr100 modules 23 & 24 created.');
