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

// First, run M1
require('./generate_m1.cjs');

// ==========================================
// MODULE 2: Olasılık Temelleri (10 Lessons)
// ==========================================
updateModule(2, [
  {
    id: "m2-l0", moduleId: "module-2", order: 1, difficulty: "basit",
    title: { tr: "Ders Tanıtımı & Olasılık Mantığı", en: "Introduction & Logic of Probability" },
    conceptCard: {
      tr: "Olasılık kuramı, rastgelelik ve belirsizlik içeren olayların matematiksel modellemesidir.\n\nBir $A$ olayının olasılığı her zaman 0 ile 1 arasındadır:\n$$0 \\le P(A) \\le 1$$\n- $P(A) = 0$: İmkansız Olay\n- $P(A) = 1$: Kesin Olay",
      en: "Probability models randomness and uncertainty mathematically. For any event $A$: $0 \\le P(A) \\le 1$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir sunucunun 24 saat içinde çökme olasılığı $0.02$ olarak verilmiştir. Çökmeme olasılığı nedir?\n\n**Çözüm:** $P(\\text{Çökmeme}) = 1 - 0.02 = 0.98$ (%98).",
      en: "**Worked Example:** Server crash probability is 0.02. Probability of no crash?\n\n**Solution:** $1 - 0.02 = 0.98$ (98%)."
    },
    vocabTerms: [{ term_en: "probability", explanation_tr: "Bir olayın gerçekleşme olasılığının 0 ile 1 arasındaki sayısal ölçüsüdür.", explanation_en: "A numerical measure of the likelihood that an event will occur.", exampleSentence_en: "The probability of failure is 0.02." }],
    questions: [{
      id: "m2-l0-q1", type: "numeric",
      prompt: { tr: "Bir sistemin başarı olasılığı 0.85 ise başarısızlık olasılığı kaçtır?", en: "If success probability is 0.85, what is failure probability?" },
      correctAnswer: 0.15,
      explanation: { tr: "$$P(\\text{Başarısızlık}) = 1 - 0.85 = 0.15$$", en: "$$1 - 0.85 = 0.15$$" }
    }],
    realWorldBox: { excelFormula: "=1 - A1", pythonCode: "p_fail = 1.0 - 0.85", powerBiNote: { tr: "Olasılık oranları yüzde kartlarında gösterilir.", en: "Probabilities are shown as percentage cards." } }
  },
  {
    id: "m2-l1", moduleId: "module-2", order: 2, difficulty: "basit",
    title: { tr: "Örneklem Uzayı ($S$) ve Olaylar", en: "Sample Space ($S$) and Events" },
    conceptCard: {
      tr: "1. **Örneklem Uzayı ($S$):** Bir rastgele deneyin tüm olası çıktılarının oluşturduğu evrensel kümedir.\n2. **Olay ($A$):** Örneklem uzayının herhangi bir alt kümesidir ($A \\subseteq S$).\n\n**Klasik Olasılık Tanımı:**\n$$P(A) = \\frac{n(A)}{n(S)} = \\frac{\\text{İstenen Çıktı Sayısı}}{\\text{Tüm Çıktı Sayısı}}$$",
      en: "Sample space ($S$) is the set of all possible outcomes. An event $A$ is a subset ($A \\subseteq S$). Classical probability: $P(A) = \\frac{n(A)}{n(S)}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Düzgün bir zar atıldığında çift sayı gelme olasılığı kaçtır?\n\n**Çözüm:** $S = \\{1, 2, 3, 4, 5, 6\\} \\implies n(S) = 6$. Çift sayılar: $A = \\{2, 4, 6\\} \\implies n(A) = 3$.\n$$P(A) = \\frac{3}{6} = 0.5$$",
      en: "**Worked Example:** Probability of rolling an even number on a 6-sided die?\n\n**Solution:** $S=\\{1..6\\}, A=\\{2,4,6\\} \\implies P(A) = 3/6 = 0.5$."
    },
    vocabTerms: [{ term_en: "sample space", explanation_tr: "Rastgele bir deneyin tüm olası sonuçlarının kümesi ($S$).", explanation_en: "The set of all possible outcomes of a random experiment.", exampleSentence_en: "The sample space of a coin toss is {Heads, Tails}." }],
    questions: [{
      id: "m2-l1-q1", type: "numeric",
      prompt: { tr: "1'den 10'a kadar numaralandırılmış kartlardan rastgele çekilen bir kartın asal sayı (2, 3, 5, 7) olma olasılığı kaçtır?", en: "Probability of picking a prime (2, 3, 5, 7) from cards 1 to 10?" },
      correctAnswer: 0.4,
      explanation: { tr: "$$P(A) = \\frac{4}{10} = 0.4$$", en: "$$P(A) = 4/10 = 0.4$$" }
    }],
    realWorldBox: { excelFormula: "=4/10", pythonCode: "len(prime_set) / len(total_set)", powerBiNote: { tr: "Boyutlar örneklem uzayı kategorilerini temsil eder.", en: "Dimensions define sample space categories." } }
  },
  {
    id: "m2-l2", moduleId: "module-2", order: 3, difficulty: "basit",
    title: { tr: "Olaylar Cebiri (Kesişim, Birleşim, Tümleyen)", en: "Algebra of Events" },
    conceptCard: {
      tr: "Olaylar arasındaki mantıksal ilişkiler küme işlemleriyle ifade edilir:\n\n1. **Tümleyen ($A'$ veya $A^c$):** $A$ olayının gerçekleşmeme durumudur ($P(A') = 1 - P(A)$).\n2. **Kesişim ($A \\cap B$):** Hem $A$ hem $B$'nin birlikte gerçekleşmesi ($A \\text{ VE } B$).\n3. **Birleşim ($A \\cup B$):** $A$ veya $B$'den en az birinin gerçekleşmesi ($A \\text{ VEYA } B$).",
      en: "Event operations:\n1. Complement: $P(A') = 1 - P(A)$\n2. Intersection: $A \\cap B$ (Both occur)\n3. Union: $A \\cup B$ (At least one occurs)"
    },
    companyExample: {
      tr: "**Örnek Soru:** Müşterilerin %60'ı e-posta bültenine, %40'ı SMS bültenine, %20'si ise her ikisine de üyedir. En az birine üye olma oranı nedir?\n\n**Çözüm:** $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.60 + 0.40 - 0.20 = 0.80$ (%80).",
      en: "**Worked Example:** Email: 60%, SMS: 40%, Both: 20%. Find union.\n\n**Solution:** $0.60 + 0.40 - 0.20 = 0.80$."
    },
    vocabTerms: [{ term_en: "union and intersection", explanation_tr: "Birleşim (Veya) iki olayın toplamını, kesişim (Ve) ortak gerçekleşmeyi ifade eder.", explanation_en: "Union is either/or; intersection is both simultaneously.", exampleSentence_en: "The intersection represents active users across both platforms." }],
    questions: [{
      id: "m2-l2-q1", type: "numeric",
      prompt: { tr: "Bir fabrikada parça kusurlu olma olasılığı $P(A) = 0.08$ olduğuna göre, parçanın kusursuz ($A'$) olma olasılığı kaçtır?", en: "If defect probability $P(A) = 0.08$, what is $P(A')$?" },
      correctAnswer: 0.92,
      explanation: { tr: "$$P(A') = 1 - 0.08 = 0.92$$", en: "$$P(A') = 1 - 0.08 = 0.92$$" }
    }],
    realWorldBox: { excelFormula: "=1 - A2", pythonCode: "p_clean = 1.0 - p_defect", powerBiNote: { tr: "Venn şemaları kesişim analizlerinde kullanılır.", en: "Venn diagrams display intersections." } }
  },
  {
    id: "m2-l3", moduleId: "module-2", order: 4, difficulty: "orta",
    title: { tr: "Kolmogorov Olasılık Aksiyomları", en: "Kolmogorov Probability Axioms" },
    conceptCard: {
      tr: "Modern olasılık teorisi 3 temel aksiyom üzerine kuruludur:\n\n1. **Aksiyom 1 (Negatif Olmama):** Herhangi bir $A$ olayı için $P(A) \\ge 0$.\n2. **Aksiyom 2 (Evrensel Küme):** Tüm örneklem uzayının olasılığı $P(S) = 1$.\n3. **Aksiyom 3 (Ayrık Toplanabilirlik):** Ayrık ($A \\cap B = \\emptyset$) olaylar için:\n$$P(A \\cup B) = P(A) + P(B)$$",
      en: "Three Kolmogorov Axioms:\n1. $P(A) \\ge 0$\n2. $P(S) = 1$\n3. If disjoint: $P(A \\cup B) = P(A) + P(B)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir web sayfasında kullanıcı ya 'Satın Alır' ($P=0.05$), ya 'Sepete Ekle' der ($P=0.15$), ya da 'Terk Eder' ($P=0.80$). Bu olasılıkların toplamı kaçtır?\n\n**Çözüm:** $0.05 + 0.15 + 0.80 = 1.00$ (Aksiyom 2 gereği tam $1$'dir).",
      en: "**Worked Example:** Conversion paths sum to $0.05 + 0.15 + 0.80 = 1.00$."
    },
    vocabTerms: [{ term_en: "mutually exclusive (disjoint)", explanation_tr: "Aynı anda gerçekleşmesi imkansız olan ($A \\cap B = \\emptyset$) ayrık olaylar.", explanation_en: "Events that cannot happen at the same time.", exampleSentence_en: "A coin landing Heads and Tails are mutually exclusive events." }],
    questions: [{
      id: "m2-l3-q1", type: "multiple-choice",
      prompt: { tr: "Ayrık iki olay ($A \\cap B = \\emptyset$) için $P(A \\cup B)$ eşitliği nedir?", en: "For disjoint events, what is $P(A \\cup B)$?" },
      options: [
        { tr: "P(A) + P(B)", en: "P(A) + P(B)" },
        { tr: "P(A) * P(B)", en: "P(A) * P(B)" },
        { tr: "P(A) / P(B)", en: "P(A) / P(B)" },
        { tr: "P(A) - P(B)", en: "P(A) - P(B)" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Ayrık olaylarda kesişim sıfır olduğu için birleşim doğrudan toplamlarına eşittir.", en: "For disjoint events, $P(A \\cup B) = P(A) + P(B)$." }
    }],
    realWorldBox: { excelFormula: "=TOPLA(A1:A3)", pythonCode: "assert sum(probabilities) == 1.0", powerBiNote: { tr: "Dağılım toplamları 100%'e eşitlenmelidir.", en: "Distribution totals must equal 100%." } }
  },
  {
    id: "m2-l4", moduleId: "module-2", order: 5, difficulty: "orta",
    title: { tr: "Olasılıkta Toplam Kuralı", en: "General Addition Rule" },
    conceptCard: {
      tr: "Herhangi iki olay $A$ ve $B$ için genel toplam kuralı:\n\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$\n\n**Mantık:** $P(A)$ ve $P(B)$ toplandığında ortak kesişim bölgesi ($A \\cap B$) iki kez sayılmış olur. Bu yüzden fazladan sayılan bir kesişim çıkarılır.",
      en: "General Addition Rule for any events:\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** $P(A) = 0.50$, $P(B) = 0.40$ ve $P(A \\cap B) = 0.15$. $P(A \\cup B)$ nedir?\n\n**Çözüm:**\n$$P(A \\cup B) = 0.50 + 0.40 - 0.15 = 0.75$$",
      en: "**Worked Example:** $P(A)=0.5, P(B)=0.4, P(A \\cap B)=0.15$. Find $P(A \\cup B)$.\n\n**Solution:** $0.5 + 0.4 - 0.15 = 0.75$."
    },
    vocabTerms: [{ term_en: "addition rule", explanation_tr: "İki olayın birleşim olasılığını hesaplayan temel formül.", explanation_en: "Formula to compute the probability of the union of events.", exampleSentence_en: "We applied the addition rule subtracting double-counted overlap." }],
    questions: [{
      id: "m2-l4-q1", type: "numeric",
      prompt: { tr: "$P(A) = 0.30$, $P(B) = 0.40$ ve $P(A \\cap B) = 0.10$ olduğuna göre $P(A \\cup B)$ kaçtır?", en: "If $P(A) = 0.3, P(B) = 0.4, P(A \\cap B) = 0.1$, find $P(A \\cup B)$." },
      correctAnswer: 0.6,
      explanation: { tr: "$$P(A \\cup B) = 0.30 + 0.40 - 0.10 = 0.60$$", en: "$$0.30 + 0.40 - 0.10 = 0.60$$" }
    }],
    realWorldBox: { excelFormula: "=A2 + B2 - C2", pythonCode: "p_union = p_a + p_b - p_ab", powerBiNote: { tr: "DAX: CALCULATE([Metric], FILTER(...))", en: "DAX: Union filtering" } }
  },
  {
    id: "m2-l5", moduleId: "module-2", order: 6, difficulty: "orta",
    title: { tr: "Koşullu Olasılık ($P(A|B)$)", en: "Conditional Probability" },
    conceptCard: {
      tr: "$B$ olayının gerçekleştiği bilindiğinde, $A$ olayının gerçekleşme olasılığına **koşullu olasılık** denir:\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad (P(B) > 0)$$\n\n**Etkisi:** Örneklem uzayı $S$'den $B$'ye daraltılmış olur.",
      en: "Probability of $A$ given $B$ occurred:\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Müşterilerin %30'u sepetine ürün eklemekte ($B$), %12'si ise hem sepete ekleyip hem satın almaktadır ($A \\cap B$). Sepete ekleyen birinin satın alma olasılığı $P(A|B)$ nedir?\n\n**Çözüm:**\n$$P(A \\mid B) = \\frac{0.12}{0.30} = 0.40 \\quad (\\%40)$$",
      en: "**Worked Example:** Added to cart $P(B)=0.30$, both added and bought $P(A \\cap B)=0.12$. Find $P(A|B)$.\n\n**Solution:** $0.12 / 0.30 = 0.40$ (40%)."
    },
    vocabTerms: [{ term_en: "conditional probability", explanation_tr: "Önceden bir koşul veya olayın gerçekleştiği bilgisi altında hesaplanan olasılık.", explanation_en: "Probability of an event occurring given that another event has already occurred.", exampleSentence_en: "Conditional probability models conversion after clicking an ad." }],
    questions: [{
      id: "m2-l5-q1", type: "numeric",
      prompt: { tr: "$P(A \\cap B) = 0.15$ ve $P(B) = 0.50$ olduğuna göre $P(A \\mid B)$ kaçtır?", en: "If $P(A \\cap B) = 0.15$ and $P(B) = 0.50$, what is $P(A \\mid B)$?" },
      correctAnswer: 0.3,
      explanation: { tr: "$$P(A \\mid B) = \\frac{0.15}{0.50} = 0.30$$", en: "$$0.15 / 0.50 = 0.30$$" }
    }],
    realWorldBox: { excelFormula: "=A2 / B2", pythonCode: "p_a_given_b = p_ab / p_b", powerBiNote: { tr: "Segment filtreleri altında koşullu oranlar incelenir.", en: "Evaluate conditional rates under segment filters." } }
  },
  {
    id: "m2-l6", moduleId: "module-2", order: 7, difficulty: "orta",
    title: { tr: "Olasılıkta Çarpım Kuralı", en: "General Multiplication Rule" },
    conceptCard: {
      tr: "İki olayın birlikte gerçekleşme olasılığı ($P(A \\cap B)$), çarpım kuralı ile hesaplanır:\n\n$$P(A \\cap B) = P(B) \\times P(A \\mid B) = P(A) \\times P(B \\mid A)$$\n\nBu kural karar ağaçları ve çok adımlı süreçlerin modellenmesinde kullanılır.",
      en: "Multiplication rule for joint occurrence:\n$$P(A \\cap B) = P(B) \\times P(A \\mid B)$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir kullanıcının siteye kaydolma olasılığı $P(B) = 0.20$'dir. Kaydolan bir kullanıcının ilk gün alışveriş yapma olasılığı $P(A|B) = 0.35$'tir. Rastgele seçilen bir kullanıcının hem kaydolup hem alışveriş yapma olasılığı nedir?\n\n**Çözüm:**\n$$P(A \\cap B) = 0.20 \\times 0.35 = 0.07 \\quad (\\%7)$$",
      en: "**Worked Example:** Sign up $P(B)=0.20$, buy given sign up $P(A|B)=0.35$. Find joint probability.\n\n**Solution:** $0.20 \\times 0.35 = 0.07$ (7%)."
    },
    vocabTerms: [{ term_en: "multiplication rule", explanation_tr: "Kesişim olasılığını marjinal ve koşullu olasılıkların çarpımı olarak hesaplayan kural.", explanation_en: "Rule expressing joint probability as the product of marginal and conditional probabilities.", exampleSentence_en: "The multiplication rule traces the probability along tree branches." }],
    questions: [{
      id: "m2-l6-q1", type: "numeric",
      prompt: { tr: "$P(B) = 0.40$ ve $P(A \\mid B) = 0.25$ olduğuna göre $P(A \\cap B)$ kaçtır?", en: "If $P(B) = 0.40$ and $P(A \\mid B) = 0.25$, find $P(A \\cap B)$." },
      correctAnswer: 0.1,
      explanation: { tr: "$$P(A \\cap B) = 0.40 \\times 0.25 = 0.10$$", en: "$$0.40 \\times 0.25 = 0.10$$" }
    }],
    realWorldBox: { excelFormula: "=A2 * B2", pythonCode: "p_joint = p_b * p_a_given_b", powerBiNote: { tr: "Funnel analizi aşama geçişlerinde çarpım kuralı geçerlidir.", en: "Funnel analysis uses the multiplication rule." } }
  },
  {
    id: "m2-l7", moduleId: "module-2", order: 8, difficulty: "orta",
    title: { tr: "Bağımsız Olaylar (Independence)", en: "Independent Events" },
    conceptCard: {
      tr: "İki olaydan birinin gerçekleşmesi diğerinin gerçekleşme olasılığını değiştirmiyorsa bu olaylar **bağımsızdır**.\n\n**Bağımsızlık Koşulları (Herhangi biri yeterlidir):**\n1. $P(A \\mid B) = P(A)$\n2. $P(B \\mid A) = P(B)$\n3. $$P(A \\cap B) = P(A) \\times P(B)$$",
      en: "Events $A$ and $B$ are independent if one occurring does not affect the other:\n$$P(A \\cap B) = P(A) \\times P(B)$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** İki bağımsız sunucunun arızalanma olasılıkları $P(A) = 0.05$ ve $P(B) = 0.02$'dir. Her iki sunucunun aynı anda arızalanma olasılığı nedir?\n\n**Çözüm:**\n$$P(A \\cap B) = 0.05 \\times 0.02 = 0.001 \\quad (\\%0.1)$$",
      en: "**Worked Example:** Independent servers fail with $P(A)=0.05, P(B)=0.02$. Joint failure?\n\n**Solution:** $0.05 \\times 0.02 = 0.001$ (0.1%)."
    },
    vocabTerms: [{ term_en: "statistical independence", explanation_tr: "Bir olayın bilgisinin diğerinin gerçekleşme ihtimalini hiçbir şekilde etkilememesi durumu.", explanation_en: "Condition where the occurrence of one event does not change the probability of another.", exampleSentence_en: "Independent servers provide redundant backup reliability." }],
    questions: [{
      id: "m2-l7-q1", type: "numeric",
      prompt: { tr: "$A$ ve $B$ bağımsız iki olaydır. $P(A) = 0.50$ ve $P(B) = 0.30$ olduğuna göre $P(A \\cap B)$ kaçtır?", en: "If $A$ and $B$ are independent with $P(A) = 0.50, P(B) = 0.30$, find $P(A \\cap B)$." },
      correctAnswer: 0.15,
      explanation: { tr: "$$P(A \\cap B) = 0.50 \\times 0.30 = 0.15$$", en: "$$0.50 \\times 0.30 = 0.15$$" }
    }],
    realWorldBox: { excelFormula: "=A2 * B2", pythonCode: "p_indep = p_a * p_b", powerBiNote: { tr: "Bağımsızlık hipotezleri Ki-Kare testleriyle doğrulanır.", en: "Verify independence via Chi-Square tests." } }
  },
  {
    id: "m2-l8", moduleId: "module-2", order: 9, difficulty: "ileri",
    title: { tr: "Toplam Olasılık Yasası", en: "Law of Total Probability" },
    conceptCard: {
      tr: "Örneklem uzayı $B_1, B_2, \\dots, B_k$ ayrık alt kümelere bölünmüşse, herhangi bir $A$ olayının toplam olasılığı:\n\n$$P(A) = \\sum_{i=1}^{k} P(B_i) \\times P(A \\mid B_i)$$\n\nHer bir yolun olasılığı ile o yoldaki koşullu olasılığın çarpımlarının toplamıdır.",
      en: "Law of Total Probability partitions sample space into $B_1..B_k$:\n$$P(A) = \\sum_{i=1}^{k} P(B_i) P(A \\mid B_i)$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir fabrikanın %60 üretimini Makine 1 ($B_1$), %40'ını Makine 2 ($B_2$) yapmaktadır. Makine 1'in fire oranı %2, Makine 2'nin fire oranı %5'tir. Toplam fire olasılığı $P(A)$ nedir?\n\n**Çözüm:**\n$$P(A) = (0.60 \\times 0.02) + (0.40 \\times 0.05) = 0.012 + 0.020 = 0.032 \\quad (\\%3.2)$$",
      en: "**Worked Example:** Machine 1 makes 60% with 2% defect; Machine 2 makes 40% with 5% defect. Total defect rate?\n\n**Solution:** $(0.60 \\times 0.02) + (0.40 \\times 0.05) = 0.032$ (3.2%)."
    },
    vocabTerms: [{ term_en: "law of total probability", explanation_tr: "Bir olayın marjinal olasılığını tüm olası koşulların ağırlıklı toplamı olarak hesaplayan teorem.", explanation_en: "Theorem relating marginal probabilities to conditional probabilities across a partition.", exampleSentence_en: "Total defect rate was computed using the law of total probability." }],
    questions: [{
      id: "m2-l8-q1", type: "numeric",
      prompt: { tr: "Üretimin %70'i A hattında (%1 kusur), %30'u B hattında (%3 kusur) üretilmektedir. Toplam kusur oranı kaçtır?", en: "70% from line A (1% defect), 30% from line B (3% defect). Total defect rate?" },
      correctAnswer: 0.016,
      explanation: { tr: "$$P(\\text{Kusur}) = (0.70 \\times 0.01) + (0.30 \\times 0.03) = 0.007 + 0.009 = 0.016$$", en: "$$(0.70 \\times 0.01) + (0.30 \\times 0.03) = 0.016$$" }
    }],
    realWorldBox: { excelFormula: "=TOPLA.ÇARPIM(A1:A2, B1:B2)", pythonCode: "total_p = np.dot(weights, rates)", powerBiNote: { tr: "Ağırlıklı ortalama DAX: SUMX(Table, [Weight] * [Rate])", en: "Weighted average DAX calculation." } }
  },
  {
    id: "m2-l9", moduleId: "module-2", order: 10, difficulty: "ileri",
    title: { tr: "Bayes Teoremi (Prior / Posterior Analizi)", en: "Bayes' Theorem" },
    conceptCard: {
      tr: "Bayes Teoremi, yeni bir kanıt ($A$) gözlemlendiğinde başlangıç inancımızı / öncül olasılığı ($P(B)$) güncelleyerek soncul olasılığı ($P(B|A)$) hesaplamamızı sağlar:\n\n$$P(B \\mid A) = \\frac{P(A \\mid B) \\times P(B)}{P(A)}$$\n\n**Bileşenler:**\n- $P(B)$: Prior (Öncül Olasılık)\n- $P(A|B)$: Likelihood (Olabilirlik)\n- $P(A)$: Evidence (Toplam Kanıt Olasılığı)\n- $P(B|A)$: Posterior (Soncul Olasılık)",
      en: "Bayes' theorem updates prior probability $P(B)$ given evidence $A$:\n$$P(B \\mid A) = \\frac{P(A \\mid B) P(B)}{P(A)}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Kusurlu parça oranı $P(A) = 0.032$'dir. Makine 2'den çıkma olasılığı $P(B_2)=0.40$ ve Makine 2'nin fire verme oranı $P(A|B_2)=0.05$'tir. Kusurlu bulunan bir parçanın Makine 2 tarafından üretilmiş olma olasılığı $P(B_2|A)$ nedir?\n\n**Çözüm:**\n$$P(B_2 \\mid A) = \\frac{0.05 \\times 0.40}{0.032} = \\frac{0.020}{0.032} = 0.625 \\quad (\\%62.5)$$",
      en: "**Worked Example:** Find posterior probability of defect coming from Machine 2:\n\n**Solution:** $\\frac{0.05 \\times 0.40}{0.032} = 0.625$ (62.5%)."
    },
    vocabTerms: [{ term_en: "posterior probability", explanation_tr: "Yeni veriler ve kanıtlar ışığında güncellenmiş soncul olasılık.", explanation_en: "The revised probability of an event occurring after taking into consideration new information.", exampleSentence_en: "Bayesian spam filters calculate the posterior probability that an email is spam." }],
    questions: [{
      id: "m2-l9-q1", type: "numeric",
      prompt: { tr: "$P(B) = 0.20$, $P(A \\mid B) = 0.80$ ve $P(A) = 0.40$ olduğuna göre $P(B \\mid A)$ kaçtır?", en: "If $P(B) = 0.20, P(A \\mid B) = 0.80, P(A) = 0.40$, find $P(B \\mid A)$." },
      correctAnswer: 0.4,
      explanation: { tr: "$$P(B \\mid A) = \\frac{0.80 \\times 0.20}{0.40} = \\frac{0.16}{0.40} = 0.40$$", en: "$$(0.80 \\times 0.20) / 0.40 = 0.40$$" }
    }],
    realWorldBox: { excelFormula: "=(A2 * B2) / C2", pythonCode: "posterior = (likelihood * prior) / evidence", powerBiNote: { tr: "A/B testi Bayesian analizlerinde posterior karşılaştırılır.", en: "Bayesian A/B testing monitors posterior distributions." } }
  }
]);

console.log('Finished Module 2.');
