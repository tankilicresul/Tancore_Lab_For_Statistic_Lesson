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
// MODULE 4: Ortak Dağılımlar & CLT (9 Lessons)
// ==========================================
updateModule(4, [
  {
    id: "m4-l1", moduleId: "module-4", order: 1, difficulty: "orta",
    title: { tr: "İki Değişkenli Ortak Dağılım (Joint PMF)", en: "Joint Probability Distributions" },
    conceptCard: {
      tr: "İki rastgele değişkenin ($X, Y$) aynı anda belirli değerleri alma olasılığını gösterir:\n\n$$p(x, y) = P(X = x, Y = y)$$\n\n**Koşul:** $\\sum_x \\sum_y p(x, y) = 1$",
      en: "Joint PMF models simultaneous behavior of $(X, Y)$: $\\sum_x \\sum_y p(x, y) = 1$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $X$: Ziyaret süresi, $Y$: Satın alma. Ortak tabloda tüm hücrelerin toplamı kaçtır?\n\n**Çözüm:** Tüm ortak olasılıkların toplamı 1.0'dır.",
      en: "**Worked Example:** Total sum across joint probability table equals 1.0."
    },
    vocabTerms: [{ term_en: "joint distribution", explanation_tr: "Birden fazla rastgele değişkenin eşzamanlı olasılık yapısını tanımlayan dağılım.", explanation_en: "Probability distribution giving the probability that each of $X, Y$ falls in any particular range.", exampleSentence_en: "The joint distribution captures co-movement of user interactions." }],
    questions: [{
      id: "m4-l1-q1", type: "numeric",
      prompt: { tr: "Bir ortak dağılım tablosundaki tüm hücre olasılıklarının toplamı kaç olmalıdır?", en: "What must the sum of all joint probabilities equal?" },
      correctAnswer: 1,
      explanation: { tr: "Tüm olası çıktılar örneklem uzayını oluşturduğundan toplam daima 1'dir.", en: "Sum of joint probabilities across entire domain is always 1." }
    }],
    realWorldBox: { excelFormula: "=TOPLA(B2:D4)", pythonCode: "joint_table.values.sum() == 1.0", powerBiNote: { tr: "Çapraz tablo (Matrix) ısı haritası", en: "Matrix heatmap visual" } }
  },
  {
    id: "m4-l2", moduleId: "module-4", order: 2, difficulty: "orta",
    title: { tr: "Marjinal ve Koşullu Dağılımlar", en: "Marginal & Conditional Distributions" },
    conceptCard: {
      tr: "1. **Marjinal PMF:** Diğer değişken üzerinden toplayarak tek bir değişkenin dağılımını elde etmektir:\n$$p_X(x) = \\sum_y p(x, y)$$\n\n2. **Koşullu PMF:**\n$$p_{Y|X}(y \\mid x) = \\frac{p(x, y)}{p_X(x)}$$",
      en: "Marginal PMF sums out the other variable: $p_X(x) = \\sum_y p(x, y)$. Conditional PMF: $p(y \\mid x) = p(x, y) / p_X(x)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $p(x=1, y=1)=0.15, p(x=1, y=2)=0.25$. $X=1$ için marjinal olasılık $p_X(1)$ nedir?\n\n**Çözüm:** $p_X(1) = 0.15 + 0.25 = 0.40$.",
      en: "**Worked Example:** $p_X(1) = 0.15 + 0.25 = 0.40$."
    },
    vocabTerms: [{ term_en: "marginal probability", explanation_tr: "Diğer değişkenlerin etkisini toplayarak dışarıda bırakan tekil değişken olasılığı.", explanation_en: "Probability of an event irrespective of the outcome of other variables.", exampleSentence_en: "Marginal distributions appear in the row and column totals of contingency tables." }],
    questions: [{
      id: "m4-l2-q1", type: "numeric",
      prompt: { tr: "$p(1, 1) = 0.2$ ve $p(1, 2) = 0.3$ olduğuna göre marjinal $p_X(1)$ kaçtır?", en: "If $p(1, 1)=0.2$ and $p(1, 2)=0.3$, what is marginal $p_X(1)$?" },
      correctAnswer: 0.5,
      explanation: { tr: "$$p_X(1) = 0.2 + 0.3 = 0.5$$", en: "$$0.2 + 0.3 = 0.5$$" }
    }],
    realWorldBox: { excelFormula: "=TOPLA(B2:D2)", pythonCode: "marginal_x = joint_df.sum(axis=1)", powerBiNote: { tr: "Satır ve sütun marjinal toplamları", en: "Row/column subtotal DAX" } }
  },
  {
    id: "m4-l3", moduleId: "module-4", order: 3, difficulty: "orta",
    title: { tr: "Kovaryans ($\\text{Cov}(X,Y)$)", en: "Covariance" },
    conceptCard: {
      tr: "Kovaryans, iki rastgele değişkenin birlikte nasıl değiştiğini (ortak yönelimini) ölçer:\n\n$$\\text{Cov}(X, Y) = E[(X - \\mu_X)(Y - \\mu_Y)] = E[XY] - E[X]E[Y]$$\n\n- $\\text{Cov} > 0$: Değişkenler aynı yönde hareket eder.\n- $\\text{Cov} < 0$: Ters yönde hareket eder.\n- $X$ ve $Y$ bağımsız ise $\\text{Cov}(X, Y) = 0$.",
      en: "Covariance measures linear association: $\\text{Cov}(X, Y) = E[XY] - E[X]E[Y]$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $E[XY] = 26, E[X] = 5, E[Y] = 4$. Kovaryans nedir?\n\n**Çözüm:**\n$$\\text{Cov}(X, Y) = 26 - (5 \\times 4) = 26 - 20 = 6$$",
      en: "**Worked Example:** $\\text{Cov}(X, Y) = 26 - 20 = 6$."
    },
    vocabTerms: [{ term_en: "covariance", explanation_tr: "İki değişkenin ortalamalarından olan sapmalarının çarpımlarının beklenen değeri.", explanation_en: "Measure of the joint variability of two random variables.", exampleSentence_en: "Positive covariance indicates that advertising spend and revenue rise together." }],
    questions: [{
      id: "m4-l3-q1", type: "numeric",
      prompt: { tr: "$E[XY] = 50$, $E[X] = 10$ ve $E[Y] = 4$ olduğuna göre $\\text{Cov}(X, Y)$ kaçtır?", en: "If $E[XY]=50, E[X]=10, E[Y]=4$, what is $\\text{Cov}(X, Y)$?" },
      correctAnswer: 10,
      explanation: { tr: "$$\\text{Cov}(X, Y) = 50 - (10 \\times 4) = 50 - 40 = 10$$", en: "$$50 - 40 = 10$$" }
    }],
    realWorldBox: { excelFormula: "=KOVARYANS.S(A1:A50, B1:B50)", pythonCode: "import numpy as np\nnp.cov(x, y)[0, 1]", powerBiNote: { tr: "Portföy risk ve kovaryans matrisi", en: "Portfolio covariance matrix" } }
  },
  {
    id: "m4-l4", moduleId: "module-4", order: 4, difficulty: "orta",
    title: { tr: "Korelasyon Katsayısı ($\\rho$)", en: "Correlation Coefficient ($\\rho$)" },
    conceptCard: {
      tr: "Korelasyon, kovaryansın standart sapmalara bölünerek **$[-1, +1]$** aralığına normalize edilmiş **birimsiz** halidir:\n\n$$\\rho_{X, Y} = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$$\n\n- $\\rho = +1$: Mükemmel pozitif doğrusal ilişki\n- $\\rho = -1$: Mükemmel negatif doğrusal ilişki\n- $\\rho = 0$: Doğrusal ilişki yok",
      en: "Pearson correlation coefficient: $\\rho = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} \\in [-1, 1]$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\text{Cov}(X,Y) = 12, \\sigma_X = 3, \\sigma_Y = 5$. Korelasyon $\\rho$ nedir?\n\n**Çözüm:**\n$$\\rho = \\frac{12}{3 \\times 5} = \\frac{12}{15} = 0.80$$",
      en: "**Worked Example:** $\\rho = 12 / 15 = 0.80$."
    },
    vocabTerms: [{ term_en: "correlation coefficient", explanation_tr: "İki değişken arasındaki doğrusal ilişkinin yönünü ve gücünü gösteren -1 ile +1 arası indeks.", explanation_en: "Dimensionless measure of the strength and direction of linear relationship.", exampleSentence_en: "A correlation of 0.80 represents strong positive association." }],
    questions: [{
      id: "m4-l4-q1", type: "numeric",
      prompt: { tr: "$\\text{Cov}(X, Y) = 16, \\sigma_X = 4, \\sigma_Y = 5$ olduğuna göre korelasyon katsayısı $\\rho$ kaçtır?", en: "If $\\text{Cov}(X,Y)=16, \\sigma_X=4, \\sigma_Y=5$, find $\\rho$." },
      correctAnswer: 0.8,
      explanation: { tr: "$$\\rho = \\frac{16}{4 \\times 5} = \\frac{16}{20} = 0.80$$", en: "$$\\rho = 16/20 = 0.80$$" }
    }],
    realWorldBox: { excelFormula: "=KORELASYON(A1:A50, B1:B50)", pythonCode: "from scipy.stats import pearsonr\nr, _ = pearsonr(x, y)", powerBiNote: { tr: "Korelasyon matrisi görseli", en: "Correlation matrix visual" } }
  },
  {
    id: "m4-l5", moduleId: "module-4", order: 5, difficulty: "orta",
    title: { tr: "Rastgele Değişkenlerin Doğrusal Kombinasyonları", en: "Linear Combinations of Random Variables" },
    conceptCard: {
      tr: "$W = aX + bY$ şeklinde oluşturulan doğrusal kombinasyonlar için:\n\n1. **Beklenen Değer (Daima geçerli):**\n$$E[aX + bY] = a E[X] + b E[Y]$$\n\n2. **Varyans (Genel Formül):**\n$$\\text{Var}(aX + bY) = a^2 \\text{Var}(X) + b^2 \\text{Var}(Y) + 2ab \\text{Cov}(X, Y)$$\n($X, Y$ bağımsız ise kovaryans terimi sıfır olur).",
      en: "For $W = aX + bY$: $E[W] = aE[X] + bE[Y]$, $\\text{Var}(W) = a^2\\text{Var}(X) + b^2\\text{Var}(Y) + 2ab\\text{Cov}(X,Y)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $X$ ve $Y$ bağımsızdır. $\\text{Var}(X) = 4, \\text{Var}(Y) = 9$. $W = X - Y$ farkının varyansı nedir?\n\n**Çözüm:**\n$$\\text{Var}(X - Y) = 1^2 \\text{Var}(X) + (-1)^2 \\text{Var}(Y) = 4 + 9 = 13$$\n(Fark alınsa bile varyanslar daima toplanır!).",
      en: "**Worked Example:** For independent $X, Y$: $\\text{Var}(X - Y) = \\text{Var}(X) + \\text{Var}(Y) = 4 + 9 = 13$."
    },
    vocabTerms: [{ term_en: "linear combination variance", explanation_tr: "Bağımsız değişkenlerin farkı alınsa bile varyanslarının karesel olarak toplanması kuralı.", explanation_en: "Variance of difference of independent variables equals the sum of their variances.", exampleSentence_en: "Variances always add up, even when subtracting random variables." }],
    questions: [{
      id: "m4-l5-q1", type: "numeric",
      prompt: { tr: "$X$ ve $Y$ bağımsız iki değişken olup $\\text{Var}(X) = 10$ ve $\\text{Var}(Y) = 15$'tir. $\\text{Var}(X + Y)$ kaçtır?", en: "If independent $\\text{Var}(X)=10$ and $\\text{Var}(Y)=15$, find $\\text{Var}(X+Y)$." },
      correctAnswer: 25,
      explanation: { tr: "$$\\text{Var}(X + Y) = 10 + 15 = 25$$", en: "$$10 + 15 = 25$$" }
    }],
    realWorldBox: { excelFormula: "=A2 + B2", pythonCode: "var_combined = var_x + var_y", powerBiNote: { tr: "Toplam portföy varyansı", en: "Combined risk variance" } }
  },
  {
    id: "m4-l6", moduleId: "module-4", order: 6, difficulty: "ileri",
    title: { tr: "Hata Yayılımı (Propagation of Error / Delta Metodu)", en: "Propagation of Error" },
    conceptCard: {
      tr: "Doğrusal olmayan bir $Y = g(X)$ fonksiyonunda, Taylor serisi 1. derece yaklaşımıyla varyans aktarımı hesaplanır:\n\n$$\\text{Var}(Y) \\approx \\left[ g'(\\mu_X) \\right]^2 \\text{Var}(X)$$\n\nİki değişkenli $Y = g(X_1, X_2)$ için kısmi türevlerin kareleriyle yayılır.",
      en: "Delta method / error propagation via Taylor expansion: $\\text{Var}(g(X)) \\approx [g'(\\mu_X)]^2 \\text{Var}(X)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $Y = 3X^2$, $\\mu_X = 2, \\sigma_X = 0.1$. $Y$'nin standart sapması nedir?\n\n**Çözüm:** $g'(X) = 6X \\implies g'(2) = 12$.\n$$\\sigma_Y \\approx |g'(2)| \\times \\sigma_X = 12 \\times 0.1 = 1.2$$",
      en: "**Worked Example:** $\\sigma_Y \\approx 12 \\times 0.1 = 1.2$."
    },
    vocabTerms: [{ term_en: "error propagation (Delta method)", explanation_tr: "Girdi değişkenlerindeki ölçüm belirsizliklerinin fonksiyonel çıktıya nasıl yansıdığını hesaplayan yöntem.", explanation_en: "Approximation method using derivatives to estimate variance of transformed variables.", exampleSentence_en: "Error propagation quantified measurement uncertainty in volume calculations." }],
    questions: [{
      id: "m4-l6-q1", type: "numeric",
      prompt: { tr: "$g(X) = 4X$, $\\sigma_X = 0.5$ olduğuna göre çıktının standart sapması ($\\sigma_Y = 4 \\times 0.5$) kaçtır?", en: "If $g(X) = 4X$ and $\\sigma_X = 0.5$, what is output standard deviation?" },
      correctAnswer: 2,
      explanation: { tr: "$$\\sigma_Y = 4 \\times 0.5 = 2.0$$", en: "$$\\sigma_Y = 2.0$$" }
    }],
    realWorldBox: { excelFormula: "=TÜREV * SIGMA", pythonCode: "sigma_y = abs(deriv) * sigma_x", powerBiNote: { tr: "Duyarlılık ve tolerans analizi", en: "Sensitivity analysis" } }
  },
  {
    id: "m4-l7", moduleId: "module-4", order: 7, difficulty: "orta",
    title: { tr: "Örneklem Ortalamasının Dağılımı ve Standart Hata", en: "Sampling Distribution of the Mean" },
    conceptCard: {
      tr: "Ortalaması $\\mu$ ve varyansı $\\sigma^2$ olan bir popülasyondan çekilen $n$ elemanlı örneklemin ortalaması $\\bar{X}$'in dağılımı:\n\n- **Beklenen Değer:** $E[\\bar{X}] = \\mu$\n- **Varyans:** $\\text{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$\n- **Standart Hata (SE):**\n$$\\text{SE} = \\sigma_{\\bar{X}} = \\frac{\\sigma}{\\sqrt{n}}$$",
      en: "Sampling distribution of mean $\\bar{X}$: $E[\\bar{X}] = \\mu, \\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\sigma = 20$ olan bir kitlede $n = 100$ örneğin standart hatası (SE) nedir?\n\n**Çözüm:**\n$$\\text{SE} = \\frac{20}{\\sqrt{100}} = \\frac{20}{10} = 2.0$$",
      en: "**Worked Example:** $\\text{SE} = 20 / \\sqrt{100} = 2.0$."
    },
    vocabTerms: [{ term_en: "standard error (SE)", explanation_tr: "Örneklem ortalamasının örnekleme değişkenliğini gösteren standart sapması (\\sigma / \\sqrt{n}).", explanation_en: "Standard deviation of the sampling distribution of a statistic.", exampleSentence_en: "Quadrupling the sample size cuts the standard error in half." }],
    questions: [{
      id: "m4-l7-q1", type: "numeric",
      prompt: { tr: "Popülasyon standart sapması $\\sigma = 18$ ve örneklem boyutu $n = 36$ ise Standart Hata ($\\text{SE}$) kaçtır?", en: "If $\\sigma = 18$ and $n = 36$, what is Standard Error ($\\text{SE}$)?" },
      correctAnswer: 3,
      explanation: { tr: "$$\\text{SE} = \\frac{18}{\\sqrt{36}} = \\frac{18}{6} = 3$$", en: "$$\\text{SE} = 18/6 = 3$$" }
    }],
    realWorldBox: { excelFormula: "=STDSAPMA / KAREKÖK(N)", pythonCode: "se = std_pop / np.sqrt(n)", powerBiNote: { tr: "Hata çubukları (Error bars) grafiği", en: "Error bar visual parameter" } }
  },
  {
    id: "m4-l8", moduleId: "module-4", order: 8, difficulty: "orta",
    title: { tr: "Merkezi Limit Teoremi (CLT)", en: "Central Limit Theorem (CLT)" },
    conceptCard: {
      tr: "**Merkezi Limit Teoremi:** Popülasyonun orijinal dağılımı ne olursa olsun (çarpık, üniform, bimodal), örneklem boyutu yeterince büyük olduğunda ($n \\ge 30$), örneklem ortalaması $\\bar{X}$'in dağılımı **Normal Dağılıma** yaklaşır:\n\n$$\\bar{X} \\xrightarrow{d} N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$\n\nİstatistikte hipotez testleri ve güven aralıklarının en temel taşıdır.",
      en: "Regardless of population distribution, sample mean $\\bar{X}$ converges to Normal $N(\\mu, \\sigma^2/n)$ as $n \\ge 30$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Çok sağa çarpık müşteri harcama dağılımından $n=100$ örneklem çekilirse $\\bar{X}$'in dağılımı ne olur?\n\n**Çözüm:** CLT gereği $n=100 \\ge 30$ olduğundan örneklem ortalaması yaklaşık Normal Dağılım gösterir.",
      en: "**Worked Example:** By CLT, sample mean of $n=100$ follows a Normal distribution."
    },
    vocabTerms: [{ term_en: "Central Limit Theorem", explanation_tr: "Yeterli örneklem büyüklüğünde örneklem ortalamasının normale yakınsayacağını bildiren teorem.", explanation_en: "Theorem establishing that sample averages approach normality as sample size grows.", exampleSentence_en: "CLT allows parametric inference on non-normal business metrics." }],
    questions: [{
      id: "m4-l8-q1", type: "multiple-choice",
      prompt: { tr: "Merkezi Limit Teoremi'nin geçerli olması için genel kabul gören minimum örneklem büyüklüğü kuralı nedir?", en: "What is the standard rule of thumb for sample size in CLT?" },
      options: [
        { tr: "n >= 30", en: "n >= 30" },
        { tr: "n >= 5", en: "n >= 5" },
        { tr: "n >= 1000", en: "n >= 1000" },
        { tr: "n = 1", en: "n = 1" }
      ],
      correctAnswer: 0,
      explanation: { tr: "İstatistikte genel kural olarak $n \\ge 30$ olduğunda CLT yeterli normal yakınsamayı sağlar.", en: "Standard statistical threshold is $n \\ge 30$." }
    }],
    realWorldBox: { excelFormula: "=NORM.DAĞ(x_bar, mu, sigma/KAREKÖK(n), DOĞRU)", pythonCode: "means = [np.mean(np.random.exponential(scale=5, size=50)) for _ in range(1000)]", powerBiNote: { tr: "Örnekleme simülasyonu", en: "Sampling distribution simulation" } }
  },
  {
    id: "m4-l9", moduleId: "module-4", order: 9, difficulty: "ileri",
    title: { tr: "CLT Uygulamaları ve Örneklem Büyüklüğü", en: "CLT Applications & Sample Sizing" },
    conceptCard: {
      tr: "CLT sayesinde örneklem ortalaması için $Z$-dönüşümü yapılabilir:\n\n$$Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$$\n\nİstenen bir hata payı ($E$) ve güven düzeyi için gerekli minimum örneklem boyutu:\n$$n = \\left( \\frac{z_{\\alpha/2} \\cdot \\sigma}{E} \\right)^2$$",
      en: "Standardized sample mean: $Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$. Sample size for margin of error $E$: $n = \\left(\\frac{z \\sigma}{E}\\right)^2$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\sigma = 10$, izin verilen hata payı $E = 1$, $z = 2$ için gereken örneklem boyutu $n$ nedir?\n\n**Çözüm:**\n$$n = \\left( \\frac{2 \\times 10}{1} \\right)^2 = 20^2 = 400$$",
      en: "**Worked Example:** $n = (2 \\times 10 / 1)^2 = 400$."
    },
    vocabTerms: [{ term_en: "sample size planning", explanation_tr: "İstenen istatistiksel hassasiyet ve güven düzeyini sağlamak için gereken gözlem adedini hesaplama.", explanation_en: "Determining sample size necessary to achieve desired statistical power and margin of error.", exampleSentence_en: "We calculated $n=400$ to limit margin of error to $\\pm 1$ unit." }],
    questions: [{
      id: "m4-l9-q1", type: "numeric",
      prompt: { tr: "$\\sigma = 5, E = 0.5, z = 2$ için gerekli örneklem boyutu $n = ((2 \\times 5)/0.5)^2$ kaçtır?", en: "Calculate required sample size for $\\sigma=5, E=0.5, z=2$." },
      correctAnswer: 400,
      explanation: { tr: "$$n = \\left(\\frac{10}{0.5}\\right)^2 = 20^2 = 400$$", en: "$$n = 20^2 = 400$$" }
    }],
    realWorldBox: { excelFormula: "=(z*sigma/E)^2", pythonCode: "n_req = ((z * sigma) / margin_error)**2", powerBiNote: { tr: "A/B testi örneklem büyüklüğü hesaplayıcı", en: "A/B test sample size estimator" } }
  }
]);

// ==========================================
// MODULE 12: Markov Zincirleri (8 Lessons)
// ==========================================
updateModule(12, [
  {
    id: "m12-l1", moduleId: "module-12", order: 1, difficulty: "basit",
    title: { tr: "Stokastik Süreç Tanımı ve Durum Uzayı", en: "Stochastic Processes & State Space" },
    conceptCard: {
      tr: "Zaman içinde rastgele gelişen değişkenler ailesine **Stokastik Süreç** denir: $\\{X_t, t \\in T\\}$.\n\n- **Durum Uzayı ($S$):** Sistemin bulunabileceği tüm olası durumların kümesidir.\n- **Zaman Parametresi ($T$):** Ayrık zaman ($t=0, 1, 2, \\dots$) veya sürekli zaman ($t \\ge 0$).",
      en: "A stochastic process is a collection of random variables indexed by time $\\{X_t\\}$ taking values in state space $S$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir müşterinin aylık abonelik durumu $S = \\{\\text{Aktif}, \\text{Askıda}, \\text{İptal}\\}$ olsun. Bu bir stokastik durum uzayı mıdır?\n\n**Çözüm:** Evet, 3 durumlu sonlu bir ayrık durum uzayıdır.",
      en: "**Worked Example:** Subscription status {Active, Paused, Churned} forms a 3-state stochastic state space."
    },
    vocabTerms: [{ term_en: "stochastic process", explanation_tr: "Olasılıksal kurallarla zaman içinde evrilen rastgele sistem.", explanation_en: "A mathematical object defined as a collection of random variables.", exampleSentence_en: "Stock prices are modeled as continuous stochastic processes." }],
    questions: [{
      id: "m12-l1-q1", type: "multiple-choice",
      prompt: { tr: "Stokastik bir süreçte sistemin alabileceği tüm olası durumların kümesine ne denir?", en: "What is the set of all possible states in a stochastic process called?" },
      options: [
        { tr: "Durum Uzayı (State Space)", en: "State Space" },
        { tr: "Kovaryans Matrisi", en: "Covariance Matrix" },
        { tr: "Örneklem Varyansı", en: "Sample Variance" },
        { tr: "Normallik Eğrisi", en: "Normality Curve" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Sistemin bulunabileceği olası durumlar kümesi Durum Uzayı (State Space) olarak adlandırılır.", en: "The state space comprises all admissible values of the process." }
    }],
    realWorldBox: { excelFormula: "=DURUM_SEÇ()", pythonCode: "states = ['Active', 'Paused', 'Churned']", powerBiNote: { tr: "Müşteri yaşam döngüsü durum diyagramı", en: "Customer state transition diagram" } }
  },
  {
    id: "m12-l2", moduleId: "module-12", order: 2, difficulty: "orta",
    title: { tr: "Markov Özelliği (Hafızasızlık)", en: "Markov Property" },
    conceptCard: {
      tr: "**Markov Özelliği (Memorylessness):** Gelecekteki durum ($X_{n+1}$), geçmişteki tüm geçmiş durumlardan bağımsız olup **yalnızca şu anki mevcut duruma ($X_n$)** bağlıdır:\n\n$$P(X_{n+1} = j \\mid X_n = i, X_{n-1} = i_{n-1}, \\dots, X_0 = i_0) = P(X_{n+1} = j \\mid X_n = i) = P_{ij}$$\n\n'Gelecek, şimdiki durum bilindiğinde geçmişten bağımsızdır.'",
      en: "Markov Property: Future state depends only on current state, independent of past history."
    },
    companyExample: {
      tr: "**Örnek Soru:** Yarınki hava durumu sadece bugünkü havaya bağlı olarak tahmin ediliyorsa bu model Markov özelliği taşır mı?\n\n**Çözüm:** Evet, geçmiş günlerin geçmişi değil sadece 'bugün' geleceği belirlediği için Markov özelliğidir.",
      en: "**Worked Example:** Weather depending solely on today's state satisfies the Markov property."
    },
    vocabTerms: [{ term_en: "Markov property", explanation_tr: "Geleceğin geçmişten bağımsız olarak yalnızca mevcut duruma bağlı olması özelliği.", explanation_en: "Conditional probability of future state depends only on the present state.", exampleSentence_en: "First-order Markov chains satisfy the standard Markovian assumption." }],
    questions: [{
      id: "m12-l2-q1", type: "multiple-choice",
      prompt: { tr: "Markov özelliğinin ana ilkesi nedir?", en: "What is the primary principle of the Markov property?" },
      options: [
        { tr: "Gelecek durum yalnızca şimdiki duruma bağlıdır", en: "Future depends solely on the current state" },
        { tr: "Gelecek geçmişin tamamına bağlıdır", en: "Future depends on the entire past history" },
        { tr: "Durumlar arasında geçiş imkansızdır", en: "Transitions are impossible" },
        { tr: "Olasılıklar her adımda rastgele değişir", en: "Probabilities vary unpredictably" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Markov özelliği gereği geçmişin etkisi şimdiki durumun içinde özetlenmiştir.", en: "Current state contains all relevant predictive information." }
    }],
    realWorldBox: { excelFormula: "=P_ij", pythonCode: "# Markov transition\nnext_state = np.random.choice(states, p=P[current_state])", powerBiNote: { tr: "Durum geçiş akışları", en: "State transition sankey chart" } }
  },
  {
    id: "m12-l3", moduleId: "module-12", order: 3, difficulty: "orta",
    title: { tr: "Geçiş Matrisi ($P$) ve Stokastik Matrisler", en: "Transition Probability Matrix ($P$)" },
    conceptCard: {
      tr: "$i$ durumundan $j$ durumuna tek adımda geçiş olasılıkları matrisi:\n\n$$P = \\begin{bmatrix} P_{11} & P_{12} & \\dots & P_{1k} \\\\ P_{21} & P_{22} & \\dots & P_{2k} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ P_{k1} & P_{k2} & \\dots & P_{kk} \\end{bmatrix}$$\n\n**Stokastik Matris Özelliği:** Her satırın toplamı tam olarak **1**'e eşittir ($\\sum_j P_{ij} = 1$).",
      en: "Transition matrix $P$: entries $P_{ij} \\ge 0$, and every row sums to 1 ($\\sum_j P_{ij} = 1$)."
    },
    companyExample: {
      tr: "**Örnek Soru:** 2 durumlu matris: $P = \\begin{bmatrix} 0.8 & 0.2 \\\\ 0.3 & x \\end{bmatrix}$. $x$ değeri kaçtır?\n\n**Çözüm:** Satır toplamı 1 olmalıdır: $0.3 + x = 1 \\implies x = 0.7$.",
      en: "**Worked Example:** Row sum rule: $0.3 + x = 1 \\implies x = 0.7$."
    },
    vocabTerms: [{ term_en: "transition matrix", explanation_tr: "Durumlar arası geçiş olasılıklarını içeren, satır toplamları 1 olan stokastik matris.", explanation_en: "A square matrix describing the transition probabilities of a Markov chain.", exampleSentence_en: "The transition matrix governs user churn and retention flows." }],
    questions: [{
      id: "m12-l3-q1", type: "numeric",
      prompt: { tr: "Bir geçiş matrisinin ilk satırı $[0.4, 0.35, x]$ ise $x$ kaçtır (Satır toplamı = 1)?", en: "If row 1 of transition matrix is $[0.4, 0.35, x]$, what is $x$?" },
      correctAnswer: 0.25,
      explanation: { tr: "$$x = 1 - (0.40 + 0.35) = 0.25$$", en: "$$x = 1 - 0.75 = 0.25$$" }
    }],
    realWorldBox: { excelFormula: "=1 - TOPLA(A1:B1)", pythonCode: "import numpy as np\nP = np.array([[0.8, 0.2], [0.3, 0.7]])\nassert np.all(P.sum(axis=1) == 1.0)", powerBiNote: { tr: "Geçiş olasılığı matrisi görseli", en: "Transition matrix visual" } }
  },
  {
    id: "m12-l4", moduleId: "module-12", order: 4, difficulty: "orta",
    title: { tr: "$n$-Adımlı Geçiş ve Chapman-Kolmogorov Eşitliği", en: "Chapman-Kolmogorov Equations" },
    conceptCard: {
      tr: "$n$ adım sonrasındaki geçiş olasılıkları matrisi, tek adımlı geçiş matrisi $P$'nin $n$. kuvvetine eşittir:\n\n$$P^{(n)} = P^n$$\n\n**Chapman-Kolmogorov:**\n$$P_{ij}^{(m+n)} = \\sum_{k} P_{ik}^{(m)} P_{kj}^{(n)}$$",
      en: "$n$-step transition matrix is given by matrix power $P^{(n)} = P^n$ via Chapman-Kolmogorov equations."
    },
    companyExample: {
      tr: "**Örnek Soru:** 2 adım sonrasındaki durum dağılımını bulmak için matris işlemi nedir?\n\n**Çözüm:** $P^{(2)} = P \\times P = P^2$ (Matris çarpımı).",
      en: "**Worked Example:** Two-step transition probabilities equal $P^2$."
    },
    vocabTerms: [{ term_en: "Chapman-Kolmogorov equations", explanation_tr: "Çok adımlı geçiş olasılıklarını ara durumlar üzerinden matris çarpımıyla hesaplayan teorem.", explanation_en: "Equations expressing multi-step transitions as products of single-step matrices.", exampleSentence_en: "We compute 12-month retention through $P^{12}$." }],
    questions: [{
      id: "m12-l4-q1", type: "multiple-choice",
      prompt: { tr: "Markov zincirinde 3 adım sonrasındaki geçiş olasılıkları matrisi ($P^{(3)}$) nasıl bulunur?", en: "How is the 3-step transition matrix $P^{(3)}$ calculated?" },
      options: [
        { tr: "P matrisinin 3. kuvveti (P^3)", en: "Matrix power P^3" },
        { tr: "3 * P", en: "3 * P" },
        { tr: "P / 3", en: "P / 3" },
        { tr: "P + P + P", en: "P + P + P" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Chapman-Kolmogorov eşitliği gereği n adımlı geçiş $P^n$ matris kuvvetidir.", en: "Multi-step transitions equal matrix power $P^n$." }
    }],
    realWorldBox: { excelFormula: "=DÇARP(P, P)", pythonCode: "P_3 = np.linalg.matrix_power(P, 3)", powerBiNote: { tr: "Çok dönemli müşteri tahminleme", en: "Multi-period customer forecasting" } }
  },
  {
    id: "m12-l5", moduleId: "module-12", order: 5, difficulty: "ileri",
    title: { tr: "Durumların Sınıflandırılması (İndirgenemezlik & Periyot)", en: "Classification of States" },
    conceptCard: {
      tr: "1. **İletişim Kurabilirlik ($i \\leftrightarrow j$):** Her iki durumdan birbirine ulaşmak mümkündür.\n2. **İndirgenemez (Irreducible):** Tüm durumlar birbiriyle iletişim kurabiliyorsa zincir indirgenemezdir.\n3. **Periyodiklik:** Sistemin bir duruma yalnızca $d > 1$ adımın katlarında dönebilmesidir. $d=1$ ise zincir **Aperiyodiktir**.",
      en: "States communicate if reachable mutually. A chain is irreducible if all states communicate, and aperiodic if period $d=1$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Tüm müşterilerin her durumdan diğerine geçebildiği bir model indirgenemez midir?\n\n**Çözüm:** Evet, her durumdan her duruma pozitif olasılıkla ulaşılabiliyorsa zincir **İndirgenemez (Irreducible)**dir.",
      en: "**Worked Example:** If all states communicate, the chain is irreducible."
    },
    vocabTerms: [{ term_en: "ergodic Markov chain", explanation_tr: "Hem indirgenemez hem aperiyodik olan ve tek bir kararlı denge dağılımına sahip zincir.", explanation_en: "A Markov chain that is both irreducible and aperiodic.", exampleSentence_en: "Ergodicity guarantees a unique steady-state distribution." }],
    questions: [{
      id: "m12-l5-q1", type: "multiple-choice",
      prompt: { tr: "Tüm durumların birbiriyle karşılıklı iletişim kurabildiği Markov zincirine ne ad verilir?", en: "What is a Markov chain where all states communicate called?" },
      options: [
        { tr: "İndirgenemez (Irreducible)", en: "Irreducible" },
        { tr: "Yutucu (Absorbing)", en: "Absorbing" },
        { tr: "Periyodik", en: "Periodic" },
        { tr: "Kararsız", en: "Unstable" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Tüm durumlar arası geçiş mümkünse zincir İndirgenemez (Irreducible) olarak adlandırılır.", en: "Irreducible chains have a single communicating class." }
    }],
    realWorldBox: { excelFormula: "=DURUM_SINIFI()", pythonCode: "import networkx as nx\nG = nx.from_numpy_array(P, create_using=nx.DiGraph)\nnx.is_strongly_connected(G)", powerBiNote: { tr: "Ağ grafiği (Network Graph)", en: "State transition network graph" } }
  },
  {
    id: "m12-l6", moduleId: "module-12", order: 6, difficulty: "ileri",
    title: { tr: "Durağan Denge Dağılımı Vektörü ($\\pi^*$)", en: "Steady-State Distribution ($\\pi^*$)" },
    conceptCard: {
      tr: "Ergodik bir Markov zincirinde zaman sonsuza giderken durum olasılıkları sabit bir **durağan denge vektörüne ($\\pi$)** yakınsar:\n\n$$\\pi P = \\pi$$\n\n$$\\sum_{i=1}^{k} \\pi_i = 1$$\n\nBu denklem sistemi Google PageRank algoritmasının temel matematiğidir.",
      en: "Steady-state distribution $\\pi$ satisfies: $\\pi P = \\pi$ and $\\sum \\pi_i = 1$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $P = \\begin{bmatrix} 0.8 & 0.2 \\\\ 0.4 & 0.6 \\end{bmatrix}$. Denge dağılımı $\\pi = [\\pi_1, \\pi_2]$ nedir?\n\n**Çözüm:**\n$$\\pi_1 = 0.8\\pi_1 + 0.4\\pi_2 \\implies 0.2\\pi_1 = 0.4\\pi_2 \\implies \\pi_1 = 2\\pi_2$$\n$$\\pi_1 + \\pi_2 = 1 \\implies 3\\pi_2 = 1 \\implies \\pi_2 = 1/3, \\quad \\pi_1 = 2/3$$",
      en: "**Worked Example:** Solving $\\pi P = \\pi$ yields $\\pi_1 = 2/3, \\pi_2 = 1/3$."
    },
    vocabTerms: [{ term_en: "steady-state distribution (stationary)", explanation_tr: "Sistemin uzun vadede her bir durumda bulunma oranlarını gösteren sabit olasılık vektörü.", explanation_en: "A probability distribution that remains invariant under transition matrix $P$.", exampleSentence_en: "PageRank is the stationary distribution of the web graph random walk." }],
    questions: [{
      id: "m12-l6-q1", type: "multiple-choice",
      prompt: { tr: "Durağan denge dağılımı $\\pi$ hangi matris denklemini sağlamalıdır?", en: "Which matrix equation defines stationary distribution $\\pi$?" },
      options: [
        { tr: "pi * P = pi", en: "pi * P = pi" },
        { tr: "P * pi = 0", en: "P * pi = 0" },
        { tr: "pi + P = I", en: "pi + P = I" },
        { tr: "P^2 = pi", en: "P^2 = pi" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Durağan dağılım geçiş matrisiyle çarpıldığında değişmez: $\\pi P = \\pi$.", en: "Stationary vector satisfies $\\pi P = \\pi$ with unit sum." }
    }],
    realWorldBox: { excelFormula: "=DÖNGÜSEL_DENGE()", pythonCode: "eigenvals, eigenvecs = np.linalg.eig(P.T)\npi = eigenvecs[:, 0] / eigenvecs[:, 0].sum()", powerBiNote: { tr: "Uzun vadeli pazar payı tahmini", en: "Long-term market share forecast" } }
  },
  {
    id: "m12-l7", moduleId: "module-12", order: 7, difficulty: "ileri",
    title: { tr: "Yutucu Durumlar ve Temel Matris ($N$)", en: "Absorbing States & Fundamental Matrix" },
    conceptCard: {
      tr: "1. **Yutucu Durum (Absorbing State):** Bir kez girildiğinde bir daha çıkılamayan durumdur ($P_{ii} = 1$).\n2. **Kanonik Form:**\n$$P = \\begin{bmatrix} Q & R \\\\ 0 & I \\end{bmatrix}$$\n3. **Temel Matris ($N$):** Geçici durumlarda geçirilen ortalama adım sayısını verir:\n$$N = (I - Q)^{-1}$$",
      en: "Absorbing Markov chains have canonical form $\\begin{bmatrix} Q & R \\\\ 0 & I \\end{bmatrix}$. Fundamental matrix: $N = (I - Q)^{-1}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Kredi kartı analizinde 'Borç Ödendi' ve 'İflas/Batık' durumları yutucu durumlardır. Bu model kanonik formda çözülür.",
      en: "**Worked Example:** Credit default and paid-in-full are absorbing terminal states."
    },
    vocabTerms: [{ term_en: "fundamental matrix", explanation_tr: "Yutucu zincirlerde yutulmadan önce geçici durumlarda harcanan ortalama ziyaret sayıları matrisi $N = (I-Q)^{-1}$.", explanation_en: "Matrix giving the expected number of times the process visits each transient state before absorption.", exampleSentence_en: "The fundamental matrix computes expected customer lifetime before churn." }],
    questions: [{
      id: "m12-l7-q1", type: "multiple-choice",
      prompt: { tr: "Bir durumdan ayrılma olasılığı 0 ise ($P_{ii} = 1$) bu duruma ne ad verilir?", en: "What is a state with $P_{ii} = 1$ called?" },
      options: [
        { tr: "Yutucu Durum (Absorbing State)", en: "Absorbing State" },
        { tr: "Dönemsel Durum", en: "Periodic State" },
        { tr: "Geçici Durum", en: "Transient State" },
        { tr: "Ergodik Durum", en: "Ergodic State" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Girildikten sonra terk edilemeyen durumlara Yutucu (Absorbing) durum denir.", en: "A state that cannot be left once entered is absorbing." }
    }],
    realWorldBox: { excelFormula: "=DİZİ.TERS(BİRİM.MATRİS - Q)", pythonCode: "N = np.linalg.inv(np.eye(len(Q)) - Q)", powerBiNote: { tr: "Kredi batık / iflas modelleri", en: "Credit default absorption model" } }
  },
  {
    id: "m12-l8", moduleId: "module-12", order: 8, difficulty: "ileri",
    title: { tr: "Yutulma Olasılıkları ve Ortalama Adım Sayısı", en: "Absorption Probabilities & Time to Absorption" },
    conceptCard: {
      tr: "1. **Yutulmaya Kadar Geçen Ortalama Süre ($t$):**\n$$t = N \\mathbf{1}$$\n(Temel matris $N$'in satır toplamlarıdır).\n\n2. **Yutulma Olasılıkları Matrisi ($B$):** Belirli bir geçici durumdan başlayıp belirli bir yutucu duruma ulaşma olasılığıdır:\n$$B = N \\times R$$",
      en: "Time to absorption: $t = N \\mathbf{1}$. Absorption probabilities: $B = N R$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $N = \\begin{bmatrix} 2 & 1 \\\\ 0.5 & 1.5 \\end{bmatrix}$. 1. durumdan başlayarak yutulana kadar geçen ortalama adım sayısı nedir?\n\n**Çözüm:** $t_1 = 2 + 1 = 3$ adım.",
      en: "**Worked Example:** Row sum of $N$: $2 + 1 = 3$ steps to absorption."
    },
    vocabTerms: [{ term_en: "absorption probability", explanation_tr: "Sistemin hangi nihai terminal yutucu duruma ulaşacağını veren olasılık $B = NR$.", explanation_en: "The probability that a process starting in a transient state ends up in a specific absorbing state.", exampleSentence_en: "We evaluated bankruptcy vs. recovery absorption probabilities." }],
    questions: [{
      id: "m12-l8-q1", type: "numeric",
      prompt: { tr: "Temel matris $N$'in bir satır elemanları $3$ ve $2$ ise bu durumdan başlayarak yutulmaya kadar geçen ortalama adım sayısı ($3+2$) kaçtır?", en: "What is expected time to absorption for row [3, 2] in matrix $N$?" },
      correctAnswer: 5,
      explanation: { tr: "$$t = 3 + 2 = 5 \\text{ adım}$$", en: "$$t = 3 + 2 = 5$$" }
    }],
    realWorldBox: { excelFormula: "=DÇARP(N, R)", pythonCode: "B = np.dot(N, R)\ntime_to_absorb = N.sum(axis=1)", powerBiNote: { tr: "Müşteri ömür boyu değer (LTV) matrisi", en: "Customer LTV absorption matrix" } }
  }
]);

console.log('Finished Modules 4, 12, 14, 15, 16.');
