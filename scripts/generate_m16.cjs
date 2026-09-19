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
// MODULE 16: Sürekli Olasılık Dağılımları (9 Lessons)
// ==========================================
updateModule(16, [
  {
    id: "m16-l1", moduleId: "module-16", order: 1, difficulty: "basit",
    title: { tr: "Sürekli Değişken & Olasılık Yoğunluk Fonksiyonu (PDF)", en: "Continuous Variables & PDF" },
    conceptCard: {
      tr: "Sürekli bir değişken belirli bir aralıktaki sonsuz sayıda değeri alabilir. Olasılık eğri altındaki **alanla (integral)** hesaplanır:\n\n$$P(a \\le X \\le b) = \\int_{a}^{b} f(x) \\, dx$$\n\n**Önemli:** Sürekli dağılımlarda tek bir noktanın olasılığı daima sıfırdır ($P(X = c) = 0$).",
      en: "Continuous variables take uncountably infinite values. Probability is area under curve: $P(a \\le X \\le b) = \\int_{a}^{b} f(x) dx$. Point probability is zero: $P(X=c)=0$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir bataryanın ömrü $X$ sürekli değişkendir. Bataryanın tam 500.00000 saat dayanma olasılığı nedir?\n\n**Çözüm:** Sürekli dağılımda tek bir kesin noktanın genişliği sıfır olduğundan $P(X = 500) = 0$'dır. Ancak $P(499 \\le X \\le 501)$ pozitif bir alana sahiptir.",
      en: "**Worked Example:** Exact single point probability $P(X=500)=0$ in continuous distributions."
    },
    vocabTerms: [{ term_en: "probability density function (PDF)", explanation_tr: "Sürekli değişkenin değer yoğunluğunu gösteren, integrali 1'e eşit olan fonksiyon.", explanation_en: "Function whose integral over an interval gives the probability of falling within that interval.", exampleSentence_en: "The total area under the PDF equals 1." }],
    questions: [{
      id: "m16-l1-q1", type: "multiple-choice",
      prompt: { tr: "Sürekli bir rastgele değişken için tek bir tam noktadaki olasılık ($P(X = c)$) kaçtır?", en: "What is the probability of a single exact point ($P(X=c)$) for a continuous variable?" },
      options: [
        { tr: "0", en: "0" },
        { tr: "1", en: "1" },
        { tr: "0.5", en: "0.5" },
        { tr: "f(c) değerine eşittir", en: "Equals f(c)" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Sürekli dağılımlarda alan integralle hesaplanır, tek bir noktanın genişliği sıfır olduğundan olasılığı 0'dır.", en: "Single point width is zero, yielding zero integral area." }
    }],
    realWorldBox: { excelFormula: "=NORM.DAĞ(x, mu, sigma, YANLIŞ)", pythonCode: "from scipy.stats import norm\nnorm.pdf(x, loc=mu, scale=sigma)", powerBiNote: { tr: "Yoğunluk alanı grafikleri", en: "Density area chart" } }
  },
  {
    id: "m16-l2", moduleId: "module-16", order: 2, difficulty: "basit",
    title: { tr: "Sürekli CDF ve Alan Hesaplama", en: "Continuous CDF & Area Calculation" },
    conceptCard: {
      tr: "Sürekli Kümülatif Dağılım Fonksiyonu ($F(x)$):\n\n$$F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(t) \\, dt$$\n\nİki sınır arasındaki olasılık:\n$$P(a \\le X \\le b) = F(b) - F(a)$$",
      en: "Continuous CDF: $F(x) = \\int_{-\\infty}^{x} f(t) dt$. Interval probability: $P(a \\le X \\le b) = F(b) - F(a)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $F(10) = 0.85$ ve $F(5) = 0.30$ ise $P(5 \\le X \\le 10)$ nedir?\n\n**Çözüm:** $P(5 \\le X \\le 10) = F(10) - F(5) = 0.85 - 0.30 = 0.55$ (%55).",
      en: "**Worked Example:** $P(5 \\le X \\le 10) = F(10) - F(5) = 0.85 - 0.30 = 0.55$."
    },
    vocabTerms: [{ term_en: "continuous CDF", explanation_tr: "Sürekli bir değişkenin sol kuyruk birikimli alanını veren fonksiyon.", explanation_en: "Cumulative area function from negative infinity up to $x$.", exampleSentence_en: "Subtracting CDF values gives the interval probability." }],
    questions: [{
      id: "m16-l2-q1", type: "numeric",
      prompt: { tr: "$F(20) = 0.90$ ve $F(10) = 0.40$ olduğuna göre $P(10 \\le X \\le 20)$ kaçtır?", en: "If $F(20)=0.90$ and $F(10)=0.40$, what is $P(10 \\le X \\le 20)$?" },
      correctAnswer: 0.5,
      explanation: { tr: "$$P(10 \\le X \\le 20) = F(20) - F(10) = 0.90 - 0.40 = 0.50$$", en: "$$0.90 - 0.40 = 0.50$$" }
    }],
    realWorldBox: { excelFormula: "=NORM.DAĞ(b, mu, sigma, DOĞRU) - NORM.DAĞ(a, mu, sigma, DOĞRU)", pythonCode: "norm.cdf(b) - norm.cdf(a)", powerBiNote: { tr: "Birikimli percentile hesapları", en: "Cumulative percentile calculations" } }
  },
  {
    id: "m16-l3", moduleId: "module-16", order: 3, difficulty: "orta",
    title: { tr: "Sürekli Beklenen Değer ve Varyans", en: "Continuous Expectation & Variance" },
    conceptCard: {
      tr: "Sürekli değişkenlerde beklenen değer ve varyans integralle tanımlanır:\n\n$$E[X] = \\int_{-\\infty}^{\\infty} x f(x) \\, dx$$\n\n$$\\text{Var}(X) = E[X^2] - (E[X])^2 = \\int_{-\\infty}^{\\infty} x^2 f(x) \\, dx - \\mu^2$$",
      en: "Continuous expectation and variance are defined via integrals over domain."
    },
    companyExample: {
      tr: "**Örnek Soru:** $(0, 2)$ aralığında $f(x) = x/2$ olan dağılımın beklenen değeri nedir?\n\n**Çözüm:**\n$$E[X] = \\int_{0}^{2} x \\left(\\frac{x}{2}\\right) dx = \\left[ \\frac{x^3}{6} \\right]_0^2 = \\frac{8}{6} = \\frac{4}{3} \\approx 1.33$$",
      en: "**Worked Example:** $E[X] = \\int_0^2 (x^2/2) dx = 8/6 = 1.33$."
    },
    vocabTerms: [{ term_en: "continuous expectation", explanation_tr: "Sürekli dağılımın kütle merkezini veren integral değeri.", explanation_en: "Center of mass of continuous distribution computed by integration.", exampleSentence_en: "Continuous expectation represents the theoretical mean response time." }],
    questions: [{
      id: "m16-l3-q1", type: "multiple-choice",
      prompt: { tr: "Sürekli bir $X$ değişkeninde $E[X]$ hesabı kesikli toplam işaretinin yerine ne ile yapılır?", en: "In continuous variables, what replaces the summation symbol in calculating $E[X]$?" },
      options: [
        { tr: "İntegral ($\\int$)", en: "Integral ($\\int$)" },
        { tr: "Türev ($d/dx$)", en: "Derivative" },
        { tr: "Limit", en: "Limit" },
        { tr: "Faktöriyel (!)", en: "Factorial" }
      ],
      correctAnswer: 0,
      explanation: { tr: "Sürekli değişkenlerde toplam sembolü yerini integrale ($\\int$) bırakır.", en: "Summation across continuous domain becomes an integral." }
    }],
    realWorldBox: { excelFormula: "=ORTALAMA(A1:A1000)", pythonCode: "import scipy.integrate as integrate\nmean_val, _ = integrate.quad(lambda x: x*pdf(x), -np.inf, np.inf)", powerBiNote: { tr: "Sürekli dağılım parametreleri", en: "Distribution moment parameters" } }
  },
  {
    id: "m16-l4", moduleId: "module-16", order: 4, difficulty: "basit",
    title: { tr: "Sürekli Düzgün Dağılım (Uniform)", en: "Continuous Uniform Distribution" },
    conceptCard: {
      tr: "$[a, b]$ aralığında tüm değerlerin eşit olasılık yoğunluğuna sahip olduğu dağılımdır:\n\n$$f(x) = \\frac{1}{b - a}, \\quad a \\le x \\le b$$\n\n- **Ortalama:** $E[X] = \\frac{a + b}{2}$\n- **Varyans:** $\\text{Var}(X) = \\frac{(b - a)^2}{12}$",
      en: "Uniform distribution on $[a, b]$: $f(x) = 1/(b-a), E[X] = (a+b)/2, \\text{Var}(X) = (b-a)^2 / 12$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir otobüs 0 ile 20 dakika arasında rastgele bir zamanda gelmektedir. Beklenen bekleme süresi ve varyansı nedir?\n\n**Çözüm:**\n$$E[X] = \\frac{0 + 20}{2} = 10 \\text{ dk}, \\quad \\text{Var}(X) = \\frac{20^2}{12} = \\frac{400}{12} = 33.33$$",
      en: "**Worked Example:** Uniform(0, 20) has mean 10 and variance $400/12 = 33.33$."
    },
    vocabTerms: [{ term_en: "uniform distribution", explanation_tr: "Tanım aralığındaki her alt aralığın eşit olasılığa sahip olduğu dikdörtgen dağılım.", explanation_en: "Distribution where all intervals of the same length have equal probability.", exampleSentence_en: "Random number generators default to Uniform(0, 1)." }],
    questions: [{
      id: "m16-l4-q1", type: "numeric",
      prompt: { tr: "$[0, 10]$ aralığında düzgün (Uniform) dağılan bir değişkenin beklenen değeri kaçtır?", en: "What is the expected value of Uniform(0, 10)?" },
      correctAnswer: 5,
      explanation: { tr: "$$E[X] = \\frac{0 + 10}{2} = 5$$", en: "$$E[X] = (0+10)/2 = 5$$" }
    }],
    realWorldBox: { excelFormula: "=S_SAYI_ÜRET() * (b - a) + a", pythonCode: "np.random.uniform(a, b, size=1000)", powerBiNote: { tr: "Rastgele simülasyon modelleri", en: "Monte Carlo uniform seed" } }
  },
  {
    id: "m16-l5", moduleId: "module-16", order: 5, difficulty: "orta",
    title: { tr: "Normal Dağılım ($N(\\mu, \\sigma^2)$) & Çan Eğrisi", en: "Normal Distribution & Bell Curve" },
    conceptCard: {
      tr: "İstatistiğin en önemli simetrik çan eğrisi dağılımıdır:\n\n$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$\n\n- Tepe noktası tam ortalamadadır: $\\text{Mod} = \\text{Medyan} = \\text{Ortalama} = \\mu$\n- Büküm noktaları $\\mu \\pm \\sigma$ noktalarındadır.",
      en: "Normal distribution is the symmetric bell curve centered at $\\mu$ with spread $\\sigma$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir fabrikada üretilen vidaların çapı $\\mu = 10$ mm, $\\sigma = 0.2$ mm ile Normal dağılmaktadır. Dağılımın medyanı kaçtır?\n\n**Çözüm:** Normal dağılım kusursuz simetrik olduğundan Medyan = Ortalama = $10$ mm'dir.",
      en: "**Worked Example:** For $N(10, 0.2^2)$, Median = Mean = 10 mm."
    },
    vocabTerms: [{ term_en: "Gaussian (Normal) distribution", explanation_tr: "Doğadaki ve endüstrideki birçok değişkenin toplandığı simetrik çan eğrisi dağılımı.", explanation_en: "The continuous bell-shaped probability distribution fundamental to statistics.", exampleSentence_en: "Manufacturing tolerances strictly follow a Gaussian distribution." }],
    questions: [{
      id: "m16-l5-q1", type: "numeric",
      prompt: { tr: "Ortalaması $\\mu = 50$ ve standart sapması $\\sigma = 5$ olan bir Normal dağılımın medyanı kaçtır?", en: "What is the median of a Normal distribution with $\\mu = 50$?" },
      correctAnswer: 50,
      explanation: { tr: "Normal dağılımda ortalama, medyan ve mod birbirine eşittir (50).", en: "In a Normal distribution, Median = Mean = 50." }
    }],
    realWorldBox: { excelFormula: "=NORM.DAĞ(x, 50, 5, DOĞRU)", pythonCode: "from scipy.stats import norm\nnorm.rvs(loc=50, scale=5, size=1000)", powerBiNote: { tr: "Çan eğrisi görselleştirmesi", en: "Gaussian bell curve chart" } }
  },
  {
    id: "m16-l6", moduleId: "module-16", order: 6, difficulty: "orta",
    title: { tr: "68-95-99.7 Ampirik Kuralı", en: "68-95-99.7 Empirical Rule" },
    conceptCard: {
      tr: "Normal dağılımda verilerin yayılım alanları:\n\n- **$\\mu \\pm 1\\sigma$ aralığı:** Verilerin yaklaşık **%68.27**'sini kapsar.\n- **$\\mu \\pm 2\\sigma$ aralığı:** Verilerin yaklaşık **%95.45**'ini kapsar.\n- **$\\mu \\pm 3\\sigma$ aralığı:** Verilerin yaklaşık **%99.73**'ünü kapsar (Six Sigma temeli).",
      en: "Empirical Rule:\n- $\\mu \\pm 1\\sigma$: ~68.3%\n- $\\mu \\pm 2\\sigma$: ~95.5%\n- $\\mu \\pm 3\\sigma$: ~99.7%"
    },
    companyExample: {
      tr: "**Örnek Soru:** Ortalama teslimat $\\mu = 30$ dk, $\\sigma = 5$ dk'dır. Teslimatların %95'i hangi aralıkta gerçekleşir?\n\n**Çözüm:** $\\mu \\pm 2\\sigma = 30 \\pm (2 \\times 5) = [20, 40]$ dakika.",
      en: "**Worked Example:** $\\mu \\pm 2\\sigma = 30 \\pm 10 = [20, 40]$ minutes."
    },
    vocabTerms: [{ term_en: "empirical rule", explanation_tr: "Normal dağılımda 1, 2 ve 3 standart sapma aralıklarındaki sabit yüzdeleri belirten kural.", explanation_en: "Rule stating that 68%, 95%, and 99.7% of data lies within 1, 2, and 3 standard deviations of the mean.", exampleSentence_en: "Six Sigma quality limits rely on the 99.7% empirical boundary." }],
    questions: [{
      id: "m16-l6-q1", type: "numeric",
      prompt: { tr: "Ampirik kurala göre Normal dağılan bir verinin $\\mu \\pm 2\\sigma$ aralığına düşme olasılığı yaklaşık yüzde kaçtır?", en: "According to the Empirical Rule, what percentage lies within $\\mu \\pm 2\\sigma$?" },
      correctAnswer: 95,
      explanation: { tr: "$\\mu \\pm 2\\sigma$ aralığı verilerin yaklaşık %95'ini içerir.", en: "Approximately 95% lies within $\\mu \\pm 2\\sigma$." }
    }],
    realWorldBox: { excelFormula: "=NORM.S.DAĞ(2, DOĞRU) - NORM.S.DAĞ(-2, DOĞRU)", pythonCode: "norm.cdf(2) - norm.cdf(-2) # 0.9545", powerBiNote: { tr: "Kontrol sınırları (UCL/LCL) $\\pm 3\\sigma$", en: "Control chart $\\pm 3\\sigma$ limits" } }
  },
  {
    id: "m16-l7", moduleId: "module-16", order: 7, difficulty: "orta",
    title: { tr: "Standart Normal Dağılım ($Z$) & $Z$-Skoru", en: "Standard Normal Distribution ($Z$)" },
    conceptCard: {
      tr: "Herhangi bir $X \\sim N(\\mu, \\sigma^2)$ değişkeni, ortalaması $\\mu = 0$ ve varyansı $\\sigma^2 = 1$ olan **Standart Normal Dağılıma ($Z$)** dönüştürülebilir:\n\n$$Z = \\frac{X - \\mu}{\\sigma}$$\n\n$Z$-skoru, bir gözlemin ortalamadan kaç standart sapma uzakta olduğunu gösterir.",
      en: "Standardization transforms any normal variable to $Z \\sim N(0, 1)$ via $Z = \\frac{X - \\mu}{\\sigma}$."
    },
    companyExample: {
      tr: "**Örnek Soru:** $\\mu = 100$, $\\sigma = 15$ olan bir IQ testinde 130 puan alan kişinin $Z$-skoru nedir?\n\n**Çözüm:**\n$$Z = \\frac{130 - 100}{15} = \\frac{30}{15} = 2.0$$",
      en: "**Worked Example:** $Z = (130 - 100) / 15 = 2.0$."
    },
    vocabTerms: [{ term_en: "Z-score (standard score)", explanation_tr: "Bir gözlemin ortalamadan olan uzaklığının standart sapma cinsinden ifadesi.", explanation_en: "Number of standard deviations a data point is from the mean.", exampleSentence_en: "A Z-score of +2.0 indicates an observation in the top 2.5% tail." }],
    questions: [{
      id: "m16-l7-q1", type: "numeric",
      prompt: { tr: "$\\mu = 80$ ve $\\sigma = 10$ olan bir sınavda 95 alan bir öğrencinin $Z$-skoru kaçtır?", en: "What is the Z-score of score 95 with $\\mu=80, \\sigma=10$?" },
      correctAnswer: 1.5,
      explanation: { tr: "$$Z = \\frac{95 - 80}{10} = \\frac{15}{10} = 1.5$$", en: "$$Z = 15/10 = 1.5$$" }
    }],
    realWorldBox: { excelFormula: "=STANDARTLAŞTIRMA(95, 80, 10)", pythonCode: "z = (95 - 80) / 10", powerBiNote: { tr: "Z-skoru ile aykırı değer filtreleme", en: "Z-score outlier detection measure" } }
  },
  {
    id: "m16-l8", moduleId: "module-16", order: 8, difficulty: "orta",
    title: { tr: "$Z$-Tablosu Okuma ve Alan Hesaplama", en: "Using the Standard Normal Z-Table" },
    conceptCard: {
      tr: "$Z$-Tablosu standart normal dağılımın kümülatif sol alanını ($\\Phi(z) = P(Z \\le z)$) verir:\n\n- **Sol Kuyruk:** $P(Z \\le z) = \\Phi(z)$\n- **Sağ Kuyruk:** $P(Z > z) = 1 - \\Phi(z)$\n- **İki Değer Arası:** $P(z_1 \\le Z \\le z_2) = \\Phi(z_2) - \\Phi(z_1)$",
      en: "Z-Table yields cumulative probabilities: $P(Z \\le z) = \\Phi(z)$, $P(Z > z) = 1 - \\Phi(z)$."
    },
    companyExample: {
      tr: "**Örnek Soru:** Tablodan $\\Phi(1.96) = 0.975$ okunmuştur. $P(Z > 1.96)$ sağ kuyruk olasılığı nedir?\n\n**Çözüm:** $P(Z > 1.96) = 1 - 0.975 = 0.025$ (%2.5).",
      en: "**Worked Example:** $P(Z > 1.96) = 1 - 0.975 = 0.025$ (2.5%)."
    },
    vocabTerms: [{ term_en: "cumulative standard normal (Phi)", explanation_tr: "Standart normal dağılımın -sonsuzdan z değerine kadar olan kümülatif alanı (\\Phi(z)).", explanation_en: "The cumulative distribution function of the standard normal distribution.", exampleSentence_en: "Phi(0) equals exactly 0.5." }],
    questions: [{
      id: "m16-l8-q1", type: "numeric",
      prompt: { tr: "$\\Phi(0)$ değeri (standart normal dağılımın tam ortasındaki sol alan) kaçtır?", en: "What is the value of $\\Phi(0)$?" },
      correctAnswer: 0.5,
      explanation: { tr: "Standart normal dağılım 0 etrafında simetrik olduğundan sol yarısının alanı 0.5'tir.", en: "By symmetry around 0, $\\Phi(0) = 0.5$." }
    }],
    realWorldBox: { excelFormula: "=NORM.S.DAĞ(1.96, DOĞRU)", pythonCode: "from scipy.stats import norm\nnorm.cdf(1.96)", powerBiNote: { tr: "P-değeri ve kritik Z değerleri", en: "Z critical values" } }
  },
  {
    id: "m16-l9", moduleId: "module-16", order: 9, difficulty: "ileri",
    title: { tr: "Süreklilik Düzeltmesi (Continuity Correction)", en: "Continuity Correction" },
    conceptCard: {
      tr: "Kesikli bir Binom dağılımı sürekli Normal dağılımla yaklaştırıldığında kesikli adımların yarım birim ($0.5$) genişletilmesine **Süreklilik Düzeltmesi** denir:\n\n- $P(X = k) \\approx P(k - 0.5 \\le Y \\le k + 0.5)$\n- $P(X \\ge k) \\approx P(Y \\ge k - 0.5)$\n- $P(X \\le k) \\approx P(Y \\le k + 0.5)$",
      en: "Continuity correction adjusts discrete steps by $\\pm 0.5$ when approximating Binomial with Normal."
    },
    companyExample: {
      tr: "**Örnek Soru:** $X \\sim \\text{Binom}(100, 0.5)$ için $P(X \\ge 50)$ olasılığı Normal yaklaşımda hangi sınırdan başlar?\n\n**Çözüm:** Süreklilik düzeltmesiyle $P(Y \\ge 50 - 0.5) = P(Y \\ge 49.5)$ alanına dönüştürülür.",
      en: "**Worked Example:** $P(X \\ge 50) \\approx P(Y \\ge 49.5)$."
    },
    vocabTerms: [{ term_en: "continuity correction", explanation_tr: "Kesikli dağılımları sürekli dağılımlarla yaklaştırırken yapılan $\\pm 0.5$ birimlik alan düzeltmesi.", explanation_en: "An adjustment made when a discrete distribution is approximated by a continuous distribution.", exampleSentence_en: "Continuity correction significantly improves normal approximation accuracy for small n." }],
    questions: [{
      id: "m16-l9-q1", type: "numeric",
      prompt: { tr: "$P(X = 20)$ kesikli olasılığı için süreklilik düzeltmesi alt sınırı kaçtır ($20 - 0.5$)?", en: "What is the lower bound for continuity correction on $P(X=20)$?" },
      correctAnswer: 19.5,
      explanation: { tr: "$$20 - 0.5 = 19.5$$", en: "$$20 - 0.5 = 19.5$$" }
    }],
    realWorldBox: { excelFormula: "=NORM.DAĞ(k+0.5, mu, sigma, TRUE) - NORM.DAĞ(k-0.5, mu, sigma, TRUE)", pythonCode: "norm.cdf(k+0.5, mu, sig) - norm.cdf(k-0.5, mu, sig)", powerBiNote: { tr: "Binom-Normal dönüşüm modelleri", en: "Binomial normal approximation" } }
  }
]);

console.log('Finished Module 16.');
