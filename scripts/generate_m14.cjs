const fs = require('fs');
const path = require('path');
const modulesDir = path.join(__dirname, '../src/data');

function updateModule(num, newLessons) {
  const file = path.join(modulesDir, `module${num}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.lessons = newLessons;
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Module ${num} written with ${newLessons.length} separated lessons.`);
}

// ==========================================
// MODULE 14: Koşullu Olasılık & Bayes (9 Lessons)
// ==========================================
updateModule(14, [
  {
    id: "m14-l1", moduleId: "module-14", order: 1, difficulty: "basit",
    title: { tr: "Koşullu Olasılık Tanımı ($P(A|B)$)", en: "Conditional Probability Definition" },
    conceptCard: {
      tr: "Bir olayın gerçekleştiği bilgisi altında diğerinin gerçekleşme olasılığıdır:\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$$",
      en: "Conditional probability formula: $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $P(A \\cap B) = 0.18$, $P(B) = 0.60$. $P(A|B)$ nedir?\n\n**Çözüm:** $P(A|B) = \\frac{0.18}{0.60} = 0.30$ (%30).",
      en: "**Worked Example:** $0.18 / 0.60 = 0.30$."
    },
    vocabTerms: [{ term_en: "conditioning", explanation_tr: "Olasılık uzayını bilinen bir alt kümeye daraltma işlemi.", explanation_en: "Restricting sample space to a known condition.", exampleSentence_en: "Conditioning on mobile users increased conversion rate." }],
    questions: [{
      id: "m14-l1-q1", type: "numeric",
      prompt: { tr: "$P(A \\cap B) = 0.24$ ve $P(B) = 0.80$ olduğuna göre $P(A \\mid B)$ kaçtır?", en: "If $P(A \\cap B) = 0.24$ and $P(B) = 0.80$, find $P(A \\mid B)$." },
      correctAnswer: 0.3,
      explanation: { tr: "$$P(A \\mid B) = \\frac{0.24}{0.80} = 0.30$$", en: "$$0.24 / 0.80 = 0.30$$" }
    }],
    realWorldBox: { excelFormula: "=A1/B1", pythonCode: "p_cond = p_joint / p_b", powerBiNote: { tr: "Koşullu dönüşüm DAX", en: "Conditional conversion DAX" } }
  },
  {
    id: "m14-l2", moduleId: "module-14", order: 2, difficulty: "basit",
    title: { tr: "İki Olayın Bağımsızlığı", en: "Independence of Two Events" },
    conceptCard: {
      tr: "İki olay bağımsızsa koşul bilgisi olasılığı etkilemez:\n\n$$P(A \\mid B) = P(A) \\iff P(A \\cap B) = P(A) \\times P(B)$$",
      en: "Independence equivalence: $P(A \\mid B) = P(A) \\iff P(A \\cap B) = P(A) P(B)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $P(A)=0.4, P(B)=0.5$. $A$ ve $B$ bağımsız ise $P(A \\cap B)$ nedir?\n\n**Çözüm:** $P(A \\cap B) = 0.4 \\times 0.5 = 0.20$.",
      en: "**Worked Example:** $0.4 \\times 0.5 = 0.20$."
    },
    vocabTerms: [{ term_en: "independent events", explanation_tr: "Birlikte gerçekleşme olasılığı tek tek olasılıkların çarpımına eşit olan olaylar.", explanation_en: "Events where joint probability equals the product of marginals.", exampleSentence_en: "A and B are verified to be independent." }],
    questions: [{
      id: "m14-l2-q1", type: "numeric",
      prompt: { tr: "$P(A) = 0.6$ ve $P(B) = 0.3$ olan bağımsız iki olayın kesişim olasılığı ($P(A \\cap B)$) kaçtır?", en: "If $P(A)=0.6, P(B)=0.3$ are independent, what is $P(A \\cap B)$?" },
      correctAnswer: 0.18,
      explanation: { tr: "$$P(A \\cap B) = 0.6 \\times 0.3 = 0.18$$", en: "$$0.6 \\times 0.3 = 0.18$$" }
    }],
    realWorldBox: { excelFormula: "=A1*B1", pythonCode: "p_ind = p_a * p_b", powerBiNote: { tr: "Bağımsızlık testleri", en: "Independence testing" } }
  },
  {
    id: "m14-l3", moduleId: "module-14", order: 3, difficulty: "orta",
    title: { tr: "Genel Çarpım Kuralı ve Zincir Kuralı", en: "General Multiplication & Chain Rule" },
    conceptCard: {
      tr: "Birden fazla olayın ardışık gerçekleşme olasılığı zincir kuralıyla hesaplanır:\n\n$$P(A_1 \\cap A_2 \\cap A_3) = P(A_1) \\times P(A_2 \\mid A_1) \\times P(A_3 \\mid A_1 \\cap A_2)$$",
      en: "Chain rule decomposes multi-stage joint probability into conditionals."
    },
    companyExample: {
      tr: "**Örnek Soru:** 10 parçalık kutuda 3 bozuk parça vardır. İadesiz çekilen art arda 2 parçanın ikisinin de sağlam olma olasılığı nedir?\n\n**Çözüm:**\n$$P(S_1 \\cap S_2) = \\frac{7}{10} \\times \\frac{6}{9} = \\frac{42}{90} = \\frac{7}{15} \\approx 0.467$$",
      en: "**Worked Example:** $(7/10) \\times (6/9) = 42/90 = 0.467$."
    },
    vocabTerms: [{ term_en: "chain rule", explanation_tr: "Birleşik olasılığı ardışık koşullu olasılıkların çarpımına ayıran kural.", explanation_en: "Rule factoring joint probabilities into sequential conditionals.", exampleSentence_en: "Language models predict next tokens via the probability chain rule." }],
    questions: [{
      id: "m14-l3-q1", type: "numeric",
      prompt: { tr: "5 toptan 2'si kırmızıdır. İadesiz çekilen 2 topun da kırmızı olma olasılığı nedir ($2/5 \\times 1/4$)?", en: "Probability of drawing 2 red balls from 5 (2 red) without replacement?" },
      correctAnswer: 0.1,
      explanation: { tr: "$$\\frac{2}{5} \\times \\frac{1}{4} = \\frac{2}{20} = 0.10$$", en: "$$2/20 = 0.10$$" }
    }],
    realWorldBox: { excelFormula: "=(2/5)*(1/4)", pythonCode: "(2/5)*(1/4)", powerBiNote: { tr: "Çok aşamalı funnel olasılıkları", en: "Multi-stage conversion path" } }
  },
  {
    id: "m14-l4", moduleId: "module-14", order: 4, difficulty: "orta",
    title: { tr: "Örneklem Uzayının Bölünüşü (Partition)", en: "Partition of Sample Space" },
    conceptCard: {
      tr: "$B_1, B_2, \\dots, B_k$ olayları birbirini dışlayan (ayrık) ve birleşimleri tüm örneklem uzayı $S$'yi oluşturan alt kümelerse bu kümeler bir **bölünüş (partition)** oluşturur:\n\n1. $B_i \\cap B_j = \\emptyset \\quad (i \\ne j)$\n2. $\\bigcup_{i=1}^{k} B_i = S$\n3. $\\sum_{i=1}^{k} P(B_i) = 1$",
      en: "A partition divides $S$ into mutually exclusive and exhaustive subsets."
    },
    companyExample: {
      tr: "**Örnek Soru:** Kullanıcılar 'Mobil' (%70) ve 'Masaüstü' (%30) olarak ikiye ayrılmıştır. Bu iki küme örneklem uzayını böler mi?\n\n**Çözüm:** Kümeler ayrık ve toplamları %100 ($1.0$) olduğu için geçerli bir bölünüş oluştururlar.",
      en: "**Worked Example:** Mobile 70% and Desktop 30% partition total site traffic."
    },
    vocabTerms: [{ term_en: "partition", explanation_tr: "Örneklem uzayının ayrık ve tamamlayıcı parçalara bölünmesi.", explanation_en: "A collection of disjoint sets whose union equals the entire sample space.", exampleSentence_en: "Customer segmentation creates a complete partition of active accounts." }],
    questions: [{
      id: "m14-l4-q1", type: "multiple-choice",
      prompt: { tr: "Bir örneklem uzayı bölünüşü için $P(B_1) + P(B_2) + \\dots + P(B_k)$ toplamı kaç olmalıdır?", en: "What must the sum of partition probabilities equal?" },
      options: [
        { tr: "1", en: "1" },
        { tr: "0", en: "0" },
        { tr: "0.5", en: "0.5" },
        { tr: "Sonsuz", en: "Infinity" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Bölünüş kümelerinin birleşimi evrensel uzay $S$ olduğundan toplamları daima 1'dir.", en: "Union of partition sets equals $S$, so sum of probabilities is 1." }
    }],
    realWorldBox: { excelFormula: "=TOPLA(B1:B3)=1", pythonCode: "assert sum(segment_weights) == 1.0", powerBiNote: { tr: "Eksiksiz segmentasyon modelleri", en: "Complete customer segmentation" } }
  },
  {
    id: "m14-l5", moduleId: "module-14", order: 5, difficulty: "orta",
    title: { tr: "Toplam Olasılık Yasası (Law of Total Probability)", en: "Law of Total Probability" },
    conceptCard: {
      tr: "Bölünüş $B_1..B_k$ üzerinden herhangi bir $A$ olayının toplam olasılığı:\n\n$$P(A) = \\sum_{i=1}^{k} P(B_i) \\times P(A \\mid B_i)$$",
      en: "Total probability theorem: $P(A) = \\sum_{i=1}^{k} P(B_i) P(A \\mid B_i)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** %80 standart kullanıcı (%2 churn), %20 premium kullanıcı (%0.5 churn). Toplam churn oranı nedir?\n\n**Çözüm:**\n$$P(\\text{Churn}) = (0.80 \\times 0.02) + (0.20 \\times 0.005) = 0.016 + 0.001 = 0.017 \\quad (\\%1.7)$$",
      en: "**Worked Example:** $(0.80 \\times 0.02) + (0.20 \\times 0.005) = 0.017$ (1.7%)."
    },
    vocabTerms: [{ term_en: "total probability", explanation_tr: "Farklı segmentlerin ağırlıklı risk veya dönüşüm toplamı.", explanation_en: "Weighted average of conditional probabilities across all scenarios.", exampleSentence_en: "Total default rate is computed across credit tiers." }],
    questions: [{
      id: "m14-l5-q1", type: "numeric",
      prompt: { tr: "%50 A grubu (%4 hata) ve %50 B grubu (%6 hata) için genel hata oranı kaçtır?", en: "50% group A (4% error) and 50% group B (6% error). Total error rate?" },
      correctAnswer: 0.05,
      explanation: { tr: "$$(0.50 \\times 0.04) + (0.50 \\times 0.06) = 0.02 + 0.03 = 0.05$$", en: "$$0.02 + 0.03 = 0.05$$" }
    }],
    realWorldBox: { excelFormula: "=0.5*0.04 + 0.5*0.06", pythonCode: "0.5*0.04 + 0.5*0.06", powerBiNote: { tr: "Ağırlıklı risk ölçümleri", en: "Weighted risk KPI" } }
  },
  {
    id: "m14-l6", moduleId: "module-14", order: 6, difficulty: "ileri",
    title: { tr: "Bayes Teoremi (Prior ve Posterior Analizi)", en: "Bayes' Theorem" },
    conceptCard: {
      tr: "Kanıt $A$ gözlemlendiğinde öncül olasılığı soncul olasılığa günceller:\n\n$$P(B_j \\mid A) = \\frac{P(A \\mid B_j) P(B_j)}{\\sum_{i=1}^{k} P(A \\mid B_i) P(B_i)}$$",
      en: "Bayes' Rule: $P(B_j \\mid A) = \\frac{P(A \\mid B_j) P(B_j)}{P(A)}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Genel churn $P(A)=0.017$, standart kullanıcı oranı $P(B_1)=0.80$, standart kullanıcının churn olasılığı $P(A|B_1)=0.02$. Churn eden bir kullanıcının standart kullanıcı olma olasılığı $P(B_1|A)$ nedir?\n\n**Çözüm:**\n$$P(B_1 \\mid A) = \\frac{0.02 \\times 0.80}{0.017} = \\frac{0.016}{0.017} \\approx 0.941 \\quad (\\%94.1)$$",
      en: "**Worked Example:** $P(B_1|A) = (0.02 \\times 0.80) / 0.017 = 0.941$."
    },
    vocabTerms: [{ term_en: "Bayes' rule", explanation_tr: "Ters olasılıkları (sebep-sonuç ilişkisini) hesaplayan temel kural.", explanation_en: "Formula for calculating inverse conditional probabilities.", exampleSentence_en: "Bayes' rule updates beliefs after observing experimental data." }],
    questions: [{
      id: "m14-l6-q1", type: "numeric",
      prompt: { tr: "$P(B) = 0.10$, $P(A \\mid B) = 0.90$ ve $P(A) = 0.18$ olduğuna göre $P(B \\mid A)$ kaçtır?", en: "If $P(B) = 0.10, P(A \\mid B) = 0.90, P(A) = 0.18$, find $P(B \\mid A)$." },
      correctAnswer: 0.5,
      explanation: { tr: "$$P(B \\mid A) = \\frac{0.90 \\times 0.10}{0.18} = \\frac{0.09}{0.18} = 0.50$$", en: "$$0.09 / 0.18 = 0.50$$" }
    }],
    realWorldBox: { excelFormula: "=(0.9*0.1)/0.18", pythonCode: "(0.9 * 0.1) / 0.18", powerBiNote: { tr: "Bayesian olasılık hesaplamaları", en: "Bayesian updating measure" } }
  },
  {
    id: "m14-l7", moduleId: "module-14", order: 7, difficulty: "ileri",
    title: { tr: "Tanı Testlerinde Duyarlılık (Sensitivity)", en: "Medical / Diagnostic Sensitivity" },
    conceptCard: {
      tr: "**Duyarlılık (Sensitivity / True Positive Rate):** Gerçekte pozitif olan bir durumun test tarafından doğru şekilde tespit edilme olasılığıdır:\n\n$$\\text{Duyarlılık} = P(\\text{Test Pozitif} \\mid \\text{Durum Var}) = \\frac{TP}{TP + FN}$$",
      en: "Sensitivity is the True Positive Rate: $P(T^+ \\mid D^+) = \\frac{TP}{TP + FN}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** 100 dolandırıcılık vakasından 95'ini doğru yakalayan bir yapay zeka fraud modelinin duyarlılığı nedir?\n\n**Çözüm:** Duyarlılık = $95 / 100 = 0.95$ (%95).",
      en: "**Worked Example:** 95 caught out of 100 fraud cases gives Sensitivity = 0.95 (95%)."
    },
    vocabTerms: [{ term_en: "sensitivity (recall)", explanation_tr: "Gerçek pozitiflerin test tarafından yakalanma oranı (Recall).", explanation_en: "Proportion of actual positives correctly identified by a test.", exampleSentence_en: "High sensitivity minimizes false negatives." }],
    questions: [{
      id: "m14-l7-q1", type: "numeric",
      prompt: { tr: "200 hasta bireyden 180'ine test pozitif sonuç veriyorsa testin duyarlılığı kaçtır?", en: "If 180 out of 200 sick patients test positive, what is sensitivity?" },
      correctAnswer: 0.9,
      explanation: { tr: "$$\\text{Duyarlılık} = \\frac{180}{200} = 0.90$$", en: "$$180 / 200 = 0.90$$" }
    }],
    realWorldBox: { excelFormula: "=TP / (TP + FN)", pythonCode: "recall = tp / (tp + fn)", powerBiNote: { tr: "Karışıklık Matrisi (Confusion Matrix)", en: "Confusion matrix dashboard" } }
  },
  {
    id: "m14-l8", moduleId: "module-14", order: 8, difficulty: "ileri",
    title: { tr: "Tanı Testlerinde Özgüllük (Specificity)", en: "Diagnostic Specificity" },
    conceptCard: {
      tr: "**Özgüllük (Specificity / True Negative Rate):** Gerçekte negatif olan (sağlıklı / temiz) bir durumun test tarafından doğru şekilde 'Negatif' olarak tanımlanma olasılığıdır:\n\n$$\\text{Özgüllük} = P(\\text{Test Negatif} \\mid \\text{Durum Yok}) = \\frac{TN}{TN + FP}$$",
      en: "Specificity is the True Negative Rate: $P(T^- \\mid D^-) = \\frac{TN}{TN + FP}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** 10.000 meşru işlemden 9.800'ünü doğru tanıyan spam filtresinin özgüllüğü nedir?\n\n**Çözüm:** Özgüllük = $9800 / 10000 = 0.98$ (%98).",
      en: "**Worked Example:** $9800 / 10000 = 0.98$ (98%)."
    },
    vocabTerms: [{ term_en: "specificity", explanation_tr: "Gerçek negatiflerin doğru tespit edilme oranı (False Positive düşüklüğü).", explanation_en: "Proportion of actual negatives correctly identified.", exampleSentence_en: "High specificity prevents false alarms." }],
    questions: [{
      id: "m14-l8-q1", type: "numeric",
      prompt: { tr: "1000 sağlıklı bireyden 950'sinde test negatif çıkmıştır. Özgüllük kaçtır?", en: "If 950 out of 1000 healthy individuals test negative, what is specificity?" },
      correctAnswer: 0.95,
      explanation: { tr: "$$\\text{Özgüllük} = \\frac{950}{1000} = 0.95$$", en: "$$950 / 1000 = 0.95$$" }
    }],
    realWorldBox: { excelFormula: "=TN / (TN + FP)", pythonCode: "specificity = tn / (tn + fp)", powerBiNote: { tr: "Model değerlendirme eğrileri (ROC / AUC)", en: "ROC Curve specificity axis" } }
  },
  {
    id: "m14-l9", moduleId: "module-14", order: 9, difficulty: "ileri",
    title: { tr: "Taban Oran Yanılsaması ve PPV", en: "Base Rate Fallacy & Positive Predictive Value" },
    conceptCard: {
      tr: "**Pozitif Tahmin Değeri (PPV / Precision):** Testi pozitif çıkan birinin gerçekten hasta olma olasılığıdır:\n\n$$\\text{PPV} = P(D^+ \\mid T^+) = \\frac{\\text{Duyarlılık} \\times \\text{Prevalans}}{P(T^+)}$$\n\n**Taban Oran Yanılsaması:** Bir hastalığın toplumda görülme sıklığı (Prevalans) çok düşükse (%0.1), %99 duyarlılığa sahip testte bile pozitif çıkan birinin gerçekten hasta olma olasılığı şaşırtıcı derecede düşük çıkabilir.",
      en: "Base rate fallacy shows how rare prevalence drastically reduces PPV even for highly sensitive tests."
    },
    companyExample: {
      tr: "**Örnek Soru:** Prevalans = %0.1 ($0.001$), Duyarlılık = %99, Özgüllük = %99. Test pozitif çıkarsa gerçek hasta olma olasılığı nedir?\n\n**Çözüm:**\n$$P(T^+) = (0.001 \\times 0.99) + (0.999 \\times 0.01) = 0.00099 + 0.00999 = 0.01098$$\n$$\\text{PPV} = \\frac{0.00099}{0.01098} \\approx 0.090 \\quad (\\%9.0!)$$",
      en: "**Worked Example:** For 0.1% prevalence and 99% accuracy, PPV is only ~9% due to base rate fallacy."
    },
    vocabTerms: [{ term_en: "base rate fallacy", explanation_tr: "Nadir olaylarda taban oranın (prior) dikkate alınmaması sonucu yapılan yanılgı.", explanation_en: "Error in reasoning that ignores the prior probability when evaluating evidence.", exampleSentence_en: "The base rate fallacy explains why rare disease screenings produce many false alarms." }],
    questions: [{
      id: "m14-l9-q1", type: "multiple-choice",
      prompt: { tr: "Toplumda çok nadir görülen bir hastalık için test pozitif çıktığında gerçek hasta olma ihtimalinin düşük kalmasının ana nedeni nedir?", en: "Why does PPV remain low for rare conditions despite high test accuracy?" },
      options: [
        { tr: "Taban oranın (Prevalans) çok düşük olması", en: "Extremely low base rate prevalence" },
        { tr: "Testin bozuk olması", en: "Defective test" },
        { tr: "Özgüllüğün çok yüksek olması", en: "High specificity" },
        { tr: "Örneklem büyüklüğünün sıfır olması", en: "Zero sample size" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Toplumdaki sağlıklı insan sayısı çok fazla olduğu için az sayıdaki yanlış pozitifler gerçek pozitifleri sayıca aşar.", en: "Massive healthy population generates more false positives than rare true cases." }
    }],
    realWorldBox: { excelFormula: "=(Sens*Prev)/(Sens*Prev + (1-Spec)*(1-Prev))", pythonCode: "ppv = (sens*prev) / (sens*prev + (1-spec)*(1-prev))", powerBiNote: { tr: "Precision-Recall eğrisi metrikleri", en: "Precision-Recall curves" } }
  }
]);

console.log('Finished Module 14.');
