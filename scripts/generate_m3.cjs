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

// 1. Run M1, M2, M13
require('./generate_m1.cjs');
require('./generate_m2.cjs');
require('./generate_m3_m4_m13.cjs');

// ==========================================
// MODULE 3: Kesikli Olasılık Dağılımları (10 Lessons)
// ==========================================
updateModule(3, [
  {
    id: "m3-l1", moduleId: "module-3", order: 1, difficulty: "basit",
    title: { tr: "Kesikli Rastgele Değişken ve PMF", en: "Discrete Random Variables & PMF" },
    conceptCard: {
      tr: "Kesikli rastgele değişken ($X$), sayılabilir değerler alan niceliktir.\n\n**Olasılık Kütle Fonksiyonu (PMF):**\n$$P(X = x) = p(x)$$\n\n**PMF Koşulları:**\n1. $p(x) \\ge 0$\n2. $\\sum_{x} p(x) = 1$",
      en: "A discrete random variable takes countable values. PMF properties:\n1. $p(x) \\ge 0$\n2. $\\sum_{x} p(x) = 1$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir web sayfasındaki günlük hata sayısı $X$ olsun: $P(X=0)=0.60, P(X=1)=0.30$. $P(X=2)$ nedir?\n\n**Çözüm:** $P(X=2) = 1 - (0.60 + 0.30) = 0.10$ (%10).",
      en: "**Worked Example:** For errors $X$: $P(0)=0.6, P(1)=0.3$. Find $P(2) = 1 - 0.9 = 0.1$."
    },
    vocabTerms: [{ term_en: "probability mass function (PMF)", explanation_tr: "Kesikli bir değişkenin her bir olası değere atanmış olasılığını veren fonksiyon.", explanation_en: "Function giving the probability that a discrete random variable is exactly equal to some value.", exampleSentence_en: "The PMF assigns 0.6 probability to zero defects." }],
    questions: [{
      id: "m3-l1-q1", type: "numeric",
      prompt: { tr: "Bir kesikli değişkende $P(X=1) = 0.40, P(X=2) = 0.35$ olduğuna göre $P(X=3)$ kaçtır (Toplam = 1)?", en: "If $P(X=1)=0.4, P(X=2)=0.35$, what is $P(X=3)$?" },
      correctAnswer: 0.25,
      explanation: { tr: "$$P(X=3) = 1 - (0.40 + 0.35) = 0.25$$", en: "$$1 - 0.75 = 0.25$$" }
    }],
    realWorldBox: { excelFormula: "=1 - TOPLA(A1:A2)", pythonCode: "pmf = {0: 0.6, 1: 0.3, 2: 0.1}", powerBiNote: { tr: "Frekans sütun grafikleri", en: "Discrete PMF bar visual" } }
  },
  {
    id: "m3-l2", moduleId: "module-3", order: 2, difficulty: "basit",
    title: { tr: "Kümülatif Dağılım Fonksiyonu (CDF)", en: "Cumulative Distribution Function (CDF)" },
    conceptCard: {
      tr: "CDF ($F(x)$), rastgele değişkenin belirli bir $x$ değerine eşit ya da daha küçük olma olasılığıdır:\n\n$$F(x) = P(X \\le x) = \\sum_{t \\le x} p(t)$$\n\n**Özellik:** $F(x)$ monoton artandır; $x \\to -\\infty$ iken 0, $x \\to +\\infty$ iken 1 olur.",
      en: "CDF gives the cumulative probability up to $x$:\n$$F(x) = P(X \\le x) = \\sum_{t \\le x} p(t)$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** $P(X=0)=0.5, P(X=1)=0.3, P(X=2)=0.2$. $F(1) = P(X \\le 1)$ nedir?\n\n**Çözüm:** $F(1) = P(X=0) + P(X=1) = 0.5 + 0.3 = 0.8$.",
      en: "**Worked Example:** $F(1) = P(0) + P(1) = 0.5 + 0.3 = 0.8$."
    },
    vocabTerms: [{ term_en: "cumulative distribution function (CDF)", explanation_tr: "Değişkenin x'e kadar birikimli toplam olasılığını gösteren fonksiyon.", explanation_en: "Function expressing probability of observing a value less than or equal to $x$.", exampleSentence_en: "The CDF reaches 0.95 at 3 days of delay." }],
    questions: [{
      id: "m3-l2-q1", type: "numeric",
      prompt: { tr: "$P(X=0)=0.2, P(X=1)=0.5, P(X=2)=0.3$ için $F(1) = P(X \\le 1)$ kaçtır?", en: "Find $F(1) = P(X \\le 1)$ for $P(0)=0.2, P(1)=0.5, P(2)=0.3$." },
      correctAnswer: 0.7,
      explanation: { tr: "$$F(1) = 0.2 + 0.5 = 0.7$$", en: "$$F(1) = 0.2 + 0.5 = 0.7$$" }
    }],
    realWorldBox: { excelFormula: "=TOPLA(A$1:A2)", pythonCode: "import numpy as np\ncdf = np.cumsum(pmf_values)", powerBiNote: { tr: "Birikimli alan grafiği (Cumulative Area)", en: "Cumulative area chart" } }
  },
  {
    id: "m3-l3", moduleId: "module-3", order: 3, difficulty: "orta",
    title: { tr: "Beklenen Değer ($E[X]$)", en: "Expected Value ($E[X]$)" },
    conceptCard: {
      tr: "Beklenen değer (matematiksel beklenti / uzun vadeli ortalama), olası değerlerin olasılıklarıyla ağırlıklandırılmış toplamıdır:\n\n$$\\mu = E[X] = \\sum_{x} x \\cdot p(x)$$\n\n**Doğrusallık Özelliği:**\n$$E[aX + b] = a E[X] + b$$",
      en: "Expected value is the probability-weighted average:\n$$E[X] = \\sum_{x} x \\cdot p(x)$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir oyun %80 ihtimalle 0 TL, %20 ihtimalle 50 TL kazandırıyor. Beklenen kazanç nedir?\n\n**Çözüm:**\n$$E[X] = (0 \\times 0.80) + (50 \\times 0.20) = 0 + 10 = 10 \\text{ TL}$$",
      en: "**Worked Example:** 80% chance 0 TL, 20% chance 50 TL. $E[X] = 50 \\times 0.2 = 10$ TL."
    },
    vocabTerms: [{ term_en: "expected value", explanation_tr: "Bir deney sonsuz kez tekrarlandığında elde edilecek uzun vadeli ortalama sonuç.", explanation_en: "The long-run average outcome of a random variable.", exampleSentence_en: "The expected lifetime of the disk is 50,000 hours." }],
    questions: [{
      id: "m3-l3-q1", type: "numeric",
      prompt: { tr: "$X$ değişkeni %40 olasılıkla 10, %60 olasılıkla 20 değerini alıyor. $E[X]$ kaçtır?", en: "If $X$ takes 10 with 40% and 20 with 60%, what is $E[X]$?" },
      correctAnswer: 16,
      explanation: { tr: "$$E[X] = (10 \\times 0.40) + (20 \\times 0.60) = 4 + 12 = 16$$", en: "$$E[X] = 4 + 12 = 16$$" }
    }],
    realWorldBox: { excelFormula: "=TOPLA.ÇARPIM(A1:A2, B1:B2)", pythonCode: "import numpy as np\nnp.dot(values, probs)", powerBiNote: { tr: "Ağırlıklı beklenen değer DAX hesabı", en: "Expected value DAX calculation" } }
  },
  {
    id: "m3-l4", moduleId: "module-3", order: 4, difficulty: "orta",
    title: { tr: "Kesikli Varyans & Standart Sapma", en: "Discrete Variance & Standard Deviation" },
    conceptCard: {
      tr: "Kesikli rastgele değişkenin varyansı:\n\n$$\\sigma^2 = \\text{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2$$\n\n**Standart Sapma:**\n$$\\sigma = \\sqrt{\\text{Var}(X)}$$\n\n**Özellik:** $\\text{Var}(aX + b) = a^2 \\text{Var}(X)$.",
      en: "Discrete variance formula:\n$$\\text{Var}(X) = E[X^2] - (E[X])^2, \\quad \\sigma = \\sqrt{\\text{Var}(X)}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** $E[X] = 5$ ve $E[X^2] = 29$ olan bir değişkenin varyansı nedir?\n\n**Çözüm:**\n$$\\text{Var}(X) = 29 - 5^2 = 29 - 25 = 4 \\implies \\sigma = 2$$",
      en: "**Worked Example:** $E[X]=5, E[X^2]=29 \\implies \\text{Var}(X) = 29 - 25 = 4$."
    },
    vocabTerms: [{ term_en: "variance of random variable", explanation_tr: "Rastgele değişkenin beklenen değer etrafındaki karesel saçılım ölçüsü.", explanation_en: "Expected value of the squared deviation from the mean.", exampleSentence_en: "Higher variance translates to higher financial volatility." }],
    questions: [{
      id: "m3-l4-q1", type: "numeric",
      prompt: { tr: "$E[X] = 4$ ve $E[X^2] = 25$ olduğuna göre $\\text{Var}(X)$ kaçtır?", en: "If $E[X] = 4$ and $E[X^2] = 25$, what is $\\text{Var}(X)$?" },
      correctAnswer: 9,
      explanation: { tr: "$$\\text{Var}(X) = 25 - 4^2 = 25 - 16 = 9$$", en: "$$\\text{Var}(X) = 25 - 16 = 9$$" }
    }],
    realWorldBox: { excelFormula: "=E_X2 - (E_X)^2", pythonCode: "var_x = np.dot(x**2, p) - (np.dot(x, p))**2", powerBiNote: { tr: "Volatilite risk metrikleri", en: "Volatility KPI card" } }
  },
  {
    id: "m3-l5", moduleId: "module-3", order: 5, difficulty: "basit",
    title: { tr: "Bernoulli Dağılımı", en: "Bernoulli Distribution" },
    conceptCard: {
      tr: "Sadece iki olası çıktısı (1: Başarı, 0: Başarısızlık) olan tek bir deney **Bernoulli Dağılımı**'dır:\n\n$$P(X=1) = p, \\quad P(X=0) = 1-p = q$$\n\n- **Ortalama:** $E[X] = p$\n- **Varyans:** $\\text{Var}(X) = p(1-p)$",
      en: "Bernoulli models a single binary trial ($X \\in \\{0, 1\\}$):\n$$E[X] = p, \\quad \\text{Var}(X) = p(1-p)$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir reklam tıklama olasılığı $p = 0.05$ ise bu denemenin varyansı nedir?\n\n**Çözüm:** $\\text{Var}(X) = 0.05 \\times (1 - 0.05) = 0.05 \\times 0.95 = 0.0475$.",
      en: "**Worked Example:** Click rate $p=0.05 \\implies \\text{Var}(X) = 0.05 \\times 0.95 = 0.0475$."
    },
    vocabTerms: [{ term_en: "Bernoulli trial", explanation_tr: "Yalnızca başarı (1) veya başarısızlık (0) sonucu üreten tek bir rastgele deney.", explanation_en: "A single trial with exactly two possible outcomes.", exampleSentence_en: "Each user visit is treated as a Bernoulli trial." }],
    questions: [{
      id: "m3-l5-q1", type: "numeric",
      prompt: { tr: "Başarı olasılığı $p = 0.5$ olan bir Bernoulli denemesinin varyansı kaçtır?", en: "What is the variance of a Bernoulli trial with $p = 0.5$?" },
      correctAnswer: 0.25,
      explanation: { tr: "$$\\text{Var}(X) = 0.5 \\times (1 - 0.5) = 0.25$$", en: "$$0.5 \\times 0.5 = 0.25$$" }
    }],
    realWorldBox: { excelFormula: "=p*(1-p)", pythonCode: "from scipy.stats import bernoulli\nbernoulli.var(0.5)", powerBiNote: { tr: "İkili dönüşüm (Conversion) oranları", en: "Binary conversion KPI" } }
  },
  {
    id: "m3-l6", moduleId: "module-3", order: 6, difficulty: "orta",
    title: { tr: "Binom Dağılımı ($n, p$)", en: "Binomial Distribution" },
    conceptCard: {
      tr: "$n$ adet bağımsız ve özdeş Bernoulli denemesinde elde edilen toplam başarı sayısı $X$'in dağılımıdır:\n\n$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$$\n\n- **Ortalama:** $E[X] = n \\cdot p$\n- **Varyans:** $\\text{Var}(X) = n \\cdot p \\cdot (1-p)$",
      en: "Binomial counts successes in $n$ independent trials:\n$$P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\quad E[X]=np, \\quad \\text{Var}(X)=np(1-p)$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Kusur oranı $p = 0.10$ olan bir üretimden 10 parça seçiliyor. Beklenen kusurlu sayısı nedir?\n\n**Çözüm:** $E[X] = n \\cdot p = 10 \\times 0.10 = 1$ kusurlu parça.",
      en: "**Worked Example:** $n=10, p=0.10 \\implies E[X] = 10 \\times 0.10 = 1$."
    },
    vocabTerms: [{ term_en: "binomial distribution", explanation_tr: "Sabit başarı olasılığına sahip n bağımsız denemedeki toplam başarı sayısı dağılımı.", explanation_en: "Distribution of the number of successes in $n$ independent Bernoulli trials.", exampleSentence_en: "We modeled defect counts with a Binomial(100, 0.02) distribution." }],
    questions: [{
      id: "m3-l6-q1", type: "numeric",
      prompt: { tr: "$n = 20$ ve $p = 0.30$ olan bir Binom dağılımının beklenen değeri ($E[X]$) kaçtır?", en: "What is $E[X]$ for a Binomial distribution with $n=20$ and $p=0.30$?" },
      correctAnswer: 6,
      explanation: { tr: "$$E[X] = n \\cdot p = 20 \\times 0.30 = 6$$", en: "$$E[X] = 20 \\times 0.30 = 6$$" }
    }],
    realWorldBox: { excelFormula: "=BİNOM.DAĞ(k, n, p, YANLIŞ)", pythonCode: "from scipy.stats import binom\nbinom.pmf(k, n, p)", powerBiNote: { tr: "Kalite kontrol tolerans grafikleri", en: "Quality control binomial tolerance" } }
  },
  {
    id: "m3-l7", moduleId: "module-3", order: 7, difficulty: "orta",
    title: { tr: "Geometrik Dağılım", en: "Geometric Distribution" },
    conceptCard: {
      tr: "İlk başarıyı elde edene kadar geçen bağımsız deneme sayısı $X$'in dağılımıdır:\n\n$$P(X = k) = (1-p)^{k-1} p, \\quad k = 1, 2, 3, \\dots$$\n\n- **Ortalama:** $E[X] = \\frac{1}{p}$\n- **Varyans:** $\\text{Var}(X) = \\frac{1-p}{p^2}$",
      en: "Geometric distribution counts trials until first success:\n$$P(X=k) = (1-p)^{k-1} p, \\quad E[X] = \\frac{1}{p}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir satış temsilcisinin her aramada satış yapma olasılığı $p = 0.20$'dir. İlk satışı yapmak için ortalama kaç arama yapması gerekir?\n\n**Çözüm:**\n$$E[X] = \\frac{1}{0.20} = 5 \\text{ arama}$$",
      en: "**Worked Example:** Conversion rate $p=0.20$. Expected calls to first sale: $E[X] = 1/0.20 = 5$."
    },
    vocabTerms: [{ term_en: "geometric distribution", explanation_tr: "İlk başarıya ulaşana kadar yapılması gereken deneme sayısını modelleyen kesikli dağılım.", explanation_en: "Probability distribution of the number of trials needed to get the first success.", exampleSentence_en: "Geometric distribution determines average customer acquisition attempts." }],
    questions: [{
      id: "m3-l7-q1", type: "numeric",
      prompt: { tr: "Başarı olasılığı $p = 0.25$ olan bir süreçte ilk başarıya ulaşmak için beklenen deneme sayısı ($E[X]$) kaçtır?", en: "If $p=0.25$, what is expected trials to first success ($E[X]$)?" },
      correctAnswer: 4,
      explanation: { tr: "$$E[X] = \\frac{1}{0.25} = 4$$", en: "$$E[X] = 1 / 0.25 = 4$$" }
    }],
    realWorldBox: { excelFormula: "=NEGBİNOM.DAĞ(k-1, 1, p, YANLIŞ)", pythonCode: "from scipy.stats import geom\ngeom.pmf(k, p)", powerBiNote: { tr: "İlk dönüşüm süresi metrikleri", en: "First time to convert analytics" } }
  },
  {
    id: "m3-l8", moduleId: "module-3", order: 8, difficulty: "ileri",
    title: { tr: "Negatif Binom Dağılımı", en: "Negative Binomial Distribution" },
    conceptCard: {
      tr: "$r$. başarıyı elde edene kadar gereken toplam deneme sayısı veya başarısızlık sayısı dağılımıdır:\n\n$$P(X = k) = \\binom{k-1}{r-1} p^r (1-p)^{k-r}$$\n\n- **Ortalama:** $E[X] = \\frac{r}{p}$",
      en: "Negative Binomial models trials until $r$-th success:\n$$P(X=k) = \\binom{k-1}{r-1} p^r (1-p)^{k-r}, \\quad E[X] = \\frac{r}{p}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Başarı oranı $p = 0.50$ olan bir testte 3. başarıyı ($r=3$) elde etmek için beklenen deneme sayısı nedir?\n\n**Çözüm:**\n$$E[X] = \\frac{3}{0.50} = 6 \\text{ deneme}$$",
      en: "**Worked Example:** $r=3, p=0.50 \\implies E[X] = 3 / 0.50 = 6$."
    },
    vocabTerms: [{ term_en: "negative binomial", explanation_tr: "Belirli bir sayıda (r) başarıya ulaşana kadar geçen deneme sayısını modelleyen dağılım.", explanation_en: "Discrete probability distribution of the number of trials to achieve $r$ successes.", exampleSentence_en: "Overdispersed count data is often fitted with Negative Binomial." }],
    questions: [{
      id: "m3-l8-q1", type: "numeric",
      prompt: { tr: "$p = 0.20$ olan bir süreçte 2. başarıyı ($r=2$) elde etmek için beklenen deneme sayısı kaçtır?", en: "For $p=0.20$, what is expected trials to get $r=2$ successes?" },
      correctAnswer: 10,
      explanation: { tr: "$$E[X] = \\frac{r}{p} = \\frac{2}{0.20} = 10$$", en: "$$E[X] = 2 / 0.20 = 10$$" }
    }],
    realWorldBox: { excelFormula: "=NEGBİNOM.DAĞ(k-r, r, p, YANLIŞ)", pythonCode: "from scipy.stats import nbinom", powerBiNote: { tr: "Müşteri tutma analitiği", en: "Customer retention count models" } }
  },
  {
    id: "m3-l9", moduleId: "module-3", order: 9, difficulty: "ileri",
    title: { tr: "Hipergeometrik Dağılım (İadesiz Seçim)", en: "Hypergeometric Distribution" },
    conceptCard: {
      tr: "Sonlu $N$ elemanlı bir popülasyondan **iadesiz (without replacement)** yapılan $n$ adetlik seçimde $k$ adet başarı elde etme olasılığıdır:\n\n$$P(X = k) = \\frac{\\binom{K}{k} \\binom{N-K}{n-k}}{\\binom{N}{n}}$$\n\n- **Ortalama:** $E[X] = n \\cdot \\frac{K}{N}$",
      en: "Hypergeometric models sampling without replacement from finite population $N$ containing $K$ successes:\n$$P(X=k) = \\frac{\\binom{K}{k} \\binom{N-K}{n-k}}{\\binom{N}{n}}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** 20 parçalık bir partide 4 kusurlu ($K=4$) vardır. Rastgele seçilen 5 parçada beklenen kusurlu sayısı nedir?\n\n**Çözüm:**\n$$E[X] = 5 \\times \\frac{4}{20} = 5 \\times 0.20 = 1$$",
      en: "**Worked Example:** $N=20, K=4, n=5 \\implies E[X] = 5 \\times (4/20) = 1$."
    },
    vocabTerms: [{ term_en: "hypergeometric distribution", explanation_tr: "İadesiz seçim yapıldığında denemelerin bağımlı olduğu kesikli dağılım.", explanation_en: "Discrete probability distribution describing successes in draws without replacement.", exampleSentence_en: "Lottery odds and auditing sampling use hypergeometric distribution." }],
    questions: [{
      id: "m3-l9-q1", type: "numeric",
      prompt: { tr: "50 parçalık bir partide 10 kusurlu vardır. İadesiz seçilen 10 parçada beklenen kusurlu sayısı ($E[X]$) kaçtır?", en: "In 50 items with 10 defects, what is expected defects in a sample of 10 without replacement?" },
      correctAnswer: 2,
      explanation: { tr: "$$E[X] = 10 \\times \\frac{10}{50} = 10 \\times 0.20 = 2$$", en: "$$E[X] = 10 \\times 0.20 = 2$$" }
    }],
    realWorldBox: { excelFormula: "=HİPERGEOM.DAĞ(k, n, K, N, YANLIŞ)", pythonCode: "from scipy.stats import hypergeom", powerBiNote: { tr: "Denetim örneklemesi (Audit Sampling)", en: "Audit batch sampling" } }
  },
  {
    id: "m3-l10", moduleId: "module-3", order: 10, difficulty: "orta",
    title: { tr: "Poisson Dağılımı ($\\lambda$)", en: "Poisson Distribution" },
    conceptCard: {
      tr: "Sabit bir zaman aralığında veya alanda meydana gelen nadir olayların sayısının dağılımıdır:\n\n$$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad k = 0, 1, 2, \\dots$$\n\n- **Ortalama:** $E[X] = \\lambda$\n- **Varyans:** $\\text{Var}(X) = \\lambda$\n\n(Ortalama ile varyans birbirine eşittir).",
      en: "Poisson models event occurrences in a fixed interval:\n$$P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad E[X] = \\text{Var}(X) = \\lambda$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir web sitesine dakikada ortalama $\\lambda = 3$ istek gelmektedir. Bu dağılımın varyansı kaçtır?\n\n**Çözüm:** Poisson dağılımında $\\text{Var}(X) = \\lambda = 3$'tür.",
      en: "**Worked Example:** Rate $\\lambda=3 \\implies \\text{Var}(X) = 3$."
    },
    vocabTerms: [{ term_en: "Poisson distribution", explanation_tr: "Zaman veya mekan biriminde gerçekleşen bağımsız olay sayılarını modelleyen dağılım.", explanation_en: "Probability distribution expressing occurrences within a fixed time/space interval.", exampleSentence_en: "Server request rates fit a Poisson distribution." }],
    questions: [{
      id: "m3-l10-q1", type: "numeric",
      prompt: { tr: "Saatlik ortalama çağrı sayısı $\\lambda = 9$ olan bir çağrı merkezinde bu dağılımın standart sapması ($\\sqrt{\\lambda}$) kaçtır?", en: "If $\\lambda = 9$ for a Poisson distribution, what is standard deviation ($\\sqrt{\\lambda}$)?" },
      correctAnswer: 3,
      explanation: { tr: "$$\\sigma = \\sqrt{\\lambda} = \\sqrt{9} = 3$$", en: "$$\\sigma = \\sqrt{9} = 3$$" }
    }],
    realWorldBox: { excelFormula: "=POISSON.DAĞ(k, lambda, YANLIŞ)", pythonCode: "from scipy.stats import poisson\npoisson.pmf(k, mu=lambda_val)", powerBiNote: { tr: "Kuyruk teorisi ve çağrı merkezi analitiği", en: "Queueing and server traffic" } }
  }
]);

console.log('Finished Module 3.');
