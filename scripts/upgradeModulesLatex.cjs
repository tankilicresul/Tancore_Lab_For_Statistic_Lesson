// scripts/upgradeModulesLatex.cjs
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

function updateModule(fileName, updater) {
  const filePath = path.join(dataDir, fileName);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  updater(data);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${fileName} successfully.`);
}

function setStepTr(caseObj, stepIndex, trText, enText) {
  if (!caseObj.guidedSteps) caseObj.guidedSteps = [];
  if (!caseObj.guidedSteps[stepIndex]) {
    caseObj.guidedSteps[stepIndex] = { tr: trText, en: enText || trText };
  } else {
    caseObj.guidedSteps[stepIndex].tr = trText;
    if (enText) caseObj.guidedSteps[stepIndex].en = enText;
  }
}

// ----------------------------------------------------
// MODULE 1: Descriptive Statistics
// ----------------------------------------------------
updateModule('module1.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm1-l1') {
      l.conceptCard.tr = "Aritmetik ortalama (\\bar{x}), bir veri kümesindeki tüm gözlem değerlerinin toplamının toplam gözlem sayısına ($n$) bölünmesiyle hesaplanan merkezi eğilim ölçüsüdür:\n\n$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i$$\n\nAnakütle (popülasyon) ortalaması ise $\\mu = \\frac{1}{N}\\sum_{i=1}^{N} X_i$ formülü ile gösterilir. Aşırı uç değerlerden (outlier) oldukça etkilenir.";
      l.conceptCard.en = "The sample arithmetic mean (\\bar{x}) is a measure of central tendency calculated by dividing the sum of all observed values by the total sample size ($n$):\n\n$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i$$\n\nPopulation mean is denoted as $\\mu = \\frac{1}{N}\\sum_{i=1}^{N} X_i$. It is sensitive to extreme outliers.";
      l.companyExample.tr = "NovaMarket e-ticaret platformunun son 6 çeyrekteki kârları sırasıyla $x = [10, 12, 12, 15, 9, 50]$ milyon $'dır. Ortalama kâr:\n\n$$\\bar{x} = \\frac{10 + 12 + 12 + 15 + 9 + 50}{6} = \\frac{108}{6} = 18 \\text{ M\\$}$$";
      l.questions[0].prompt.tr = "Bir veri setinde $n = 5$ gözlem için değerler toplamı $\\sum x_i = 125$ ise aritmetik ortalama $\\bar{x}$ kaçtır?";
      l.questions[0].prompt.en = "If the sum of values $\\sum x_i = 125$ for $n = 5$ observations in a dataset, what is the arithmetic mean $\\bar{x}$?";
      l.questions[0].explanation.tr = "$$\\bar{x} = \\frac{\\sum x_i}{n} = \\frac{125}{5} = 25$$";
      l.questions[0].explanation.en = "$$\\bar{x} = \\frac{\\sum x_i}{n} = \\frac{125}{5} = 25$$";
    }
    if (l.id === 'm1-l2') {
      l.conceptCard.tr = "Medyan ($Q_2$), küçükten büyüğe sıralanmış bir veri setini tam ortadan iki eşit yarıya (%50 alt, %50 üst) ayıran değerdir. Veri sayısı $n$ tek ise medyan $\\frac{n+1}{2}$. sıradaki değer; $n$ çift ise ortadaki iki değerin aritmetik ortalamasıdır:\n\n$$x_{\\text{medyan}} = \\begin{cases} x_{\\left(\\frac{n+1}{2}\\right)}, & n \\text{ tek} \\\\[6pt] \\frac{x_{\\left(\\frac{n}{2}\\right)} + x_{\\left(\\frac{n}{2} + 1\\right)}}{2}, & n \\text{ çift} \\end{cases}$$\n\nUç değerlere (outlier) karşı dayanıklıdır (robust).";
      l.conceptCard.en = "The median ($Q_2$) splits ordered data into two equal halves (50% below, 50% above). For odd $n$, it is the $\\frac{n+1}{2}$-th observation; for even $n$, it is the average of the two middle observations:\n\n$$x_{\\text{median}} = \\begin{cases} x_{\\left(\\frac{n+1}{2}\\right)}, & n \\text{ odd} \\\\[6pt] \\frac{x_{\\left(\\frac{n}{2}\\right)} + x_{\\left(\\frac{n}{2} + 1\\right)}}{2}, & n \\text{ even} \\end{cases}$$\n\nIt is resistant (robust) to outliers.";
      l.companyExample.tr = "NovaMarket kârları sıralandığında: $x_{(i)} = [9, 10, 12, 12, 15, 50]$ milyon $'dır. $n = 6$ (çift) olduğundan medyan ortadaki 3. ve 4. değerlerin ortalamasıdır:\n\n$$x_{\\text{medyan}} = \\frac{12 + 12}{2} = 12 \\text{ M\\$}$$";
      l.questions[0].prompt.tr = "Sıralı veri seti $x = [4, 7, 10, 14, 18, 22]$ için medyan değeri kaçtır?";
      l.questions[0].prompt.en = "For ordered dataset $x = [4, 7, 10, 14, 18, 22]$, what is the median value?";
      l.questions[0].explanation.tr = "$n = 6$ (çift) olduğu için ortadaki 3. ($10$) ve 4. ($14$) elemanların ortalaması alınır: $$\\text{Medyan} = \\frac{10 + 14}{2} = 12$$";
      l.questions[0].explanation.en = "Since $n = 6$ (even), we take the average of the 3rd ($10$) and 4th ($14$) elements: $$\\text{Median} = \\frac{10 + 14}{2} = 12$$";
    }
    if (l.id === 'm1-l3') {
      l.conceptCard.tr = "Mod (Tepe Değer), bir veri setinde en yüksek frekansa sahip olan (en çok tekrar eden) gözlem değeridir. Bir veri setinde hiç mod olmayabileceği gibi birden fazla mod da (bimodal / multimodal) bulunabilir.\n\n$$\\text{Mod} = \\arg\\max_x \\{ f(x) \\}$$";
      l.conceptCard.en = "The mode is the value that appears with the highest frequency in a dataset. A dataset may have no mode, one mode (unimodal), or multiple modes (bimodal / multimodal):\n\n$$\\text{Mode} = \\arg\\max_x \\{ f(x) \\}$$";
      l.questions[0].prompt.tr = "Gözlem değerleri $x = [3, 8, 8, 8, 12, 14, 14, 20]$ olan veri setinin modu kaçtır?";
      l.questions[0].prompt.en = "What is the mode of the dataset $x = [3, 8, 8, 8, 12, 14, 14, 20]$?";
      l.questions[0].explanation.tr = "$8$ sayısı $3$ kez tekrar ederek en yüksek frekansa sahiptir. Dolayısıyla $\\text{Mod} = 8$'dir.";
      l.questions[0].explanation.en = "The number $8$ appears $3$ times, having the highest frequency. Thus, $\\text{Mode} = 8$.";
    }
    if (l.id === 'm1-l4') {
      l.conceptCard.tr = "Örneklem varyansı ($s^2$) ve standart sapma ($s$), verilerin aritmetik ortalamadan ne kadar saçıldığını ölçen yayılım ölçüleridir:\n\n$$s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2, \\qquad s = \\sqrt{s^2} = \\sqrt{\\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n - 1}}$$\n\nBölendeki $n-1$ serbestlik derecesi (Bessel düzeltmesi), örneklem varyansının anakütle varyansına ($\\sigma^2$) yansız bir tahminci (unbiased estimator) olmasını sağlar.";
      l.conceptCard.en = "Sample variance ($s^2$) and standard deviation ($s$) measure the dispersion of data points around the arithmetic mean:\n\n$$s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2, \\qquad s = \\sqrt{s^2} = \\sqrt{\\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n - 1}}$$\n\nThe $n-1$ degrees of freedom in the denominator (Bessel's correction) ensures that sample variance is an unbiased estimator of population variance $\\sigma^2$.";
      l.questions[0].prompt.tr = "Örneklem varyansı $s^2 = 36$ olarak hesaplanan bir lojistik teslimat süresinin standart sapması $s$ kaçtır?";
      l.questions[0].prompt.en = "If the sample variance of delivery times is $s^2 = 36$, what is the sample standard deviation $s$?";
      l.questions[0].explanation.tr = "$$s = \\sqrt{s^2} = \\sqrt{36} = 6$$";
      l.questions[0].explanation.en = "$$s = \\sqrt{s^2} = \\sqrt{36} = 6$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm1-case-1') {
      c.businessQuestion.tr = "NovaMarket son 6 çeyrekteki kâr verilerini analiz etmektedir ($n = 6$, değerler M\\$ cinsinden: $10, 12, 12, 15, 9, 50$). Şirketin çeyreklik kâr performansını özetlemek için ortalama ($\\bar{x}$), medyan ($Q_2$), mod ve yayılım ölçülerini hesaplayınız.";
      setStepTr(c, 0, "1. Adım: Aritmetik Ortalama Hesabı: $$\\bar{x} = \\frac{\\sum x_i}{n} = \\frac{10 + 12 + 12 + 15 + 9 + 50}{6} = \\frac{108}{6} = 18 \\text{ M\\$}$$");
      setStepTr(c, 1, "2. Adım: Medyan Hesabı: Sıralı veri $[9, 10, 12, 12, 15, 50]$ için ortadaki iki elemanın ortalaması: $$x_{\\text{medyan}} = \\frac{12 + 12}{2} = 12 \\text{ M\\$}$$");
      setStepTr(c, 2, "3. Adım: Mod ve Değerlendirme: En sık tekrar eden değer $\\text{Mod} = 12$'dir. $\\bar{x} = 18$ iken $\\text{Medyan} = 12$ olması, 50 M$'lık aşırı değerin (outlier) ortalamayı yukarı çektiğini gösterir.");
      c.solutionQuestions[0].prompt.tr = "NovaMarket veri setinin aritmetik ortalaması $\\bar{x}$ kaçtır (M\\$)?";
      c.solutionQuestions[0].explanation.tr = "$$\\bar{x} = \\frac{108}{6} = 18 \\text{ M\\$}$$";
    }
    if (c.id === 'm1-case-2') {
      c.businessQuestion.tr = "DataPulse e-ticaret platformunda müşteri sepet tutarlarının yayılımı incelenmektedir. Veri setinde $Q_1 = 40 \\text{ TL}$ ve $Q_3 = 100 \\text{ TL}$ olarak tespit edilmiştir. Çeyrekler Açıklığı ($\\text{IQR}$) ve Tukey yöntemine göre üst aykırı değer (outlier) sınırını hesaplayınız.";
      setStepTr(c, 0, "1. Adım: Çeyrekler Açıklığı: $$\\text{IQR} = Q_3 - Q_1 = 100 - 40 = 60 \\text{ TL}$$");
      setStepTr(c, 1, "2. Adım: Üst Aykırı Değer Sınırı: $$\\text{Üst Sınır} = Q_3 + 1.5 \\cdot \\text{IQR} = 100 + 1.5 \\times 60 = 100 + 90 = 190 \\text{ TL}$$");
      c.solutionQuestions[0].prompt.tr = "Tukey çit yöntemine göre üst aykırı değer eşik sınırı ($Q_3 + 1.5 \\cdot \\text{IQR}$) kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$\\text{Üst Sınır} = 100 + 1.5(60) = 190$$";
    }
    if (c.id === 'm1-case-3') {
      c.businessQuestion.tr = "VoltLogistics kargo teslimat süreleri için $s^2 = 64 \\text{ dk}^2$ ve ortalama $\\bar{x} = 40 \\text{ dk}$ bulmuştur. Teslimat süresinin standart sapmasını ($s$) ve Değişim Katsayısını ($\\text{CV} = \\frac{s}{\\bar{x}} \\times 100$) hesaplayınız.";
      setStepTr(c, 0, "1. Adım: Standart Sapma: $$s = \\sqrt{s^2} = \\sqrt{64} = 8 \\text{ dk}$$");
      setStepTr(c, 1, "2. Adım: Değişim Katsayısı (CV): $$\\text{CV} = \\frac{s}{\\bar{x}} \\times 100 = \\frac{8}{40} \\times 100 = \\%20$$");
      c.solutionQuestions[0].prompt.tr = "Teslimat sürelerinin standart sapması $s$ (dakika) kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$s = \\sqrt{64} = 8 \\text{ dk}$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 2: Probability Fundamentals
// ----------------------------------------------------
updateModule('module2.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm2-l1') {
      l.conceptCard.tr = "Olasılık, bir olayın gerçekleşme şansını $0 \\le P(A) \\le 1$ aralığında ölçer. İki bağımsız olayın aynı anda gerçekleşme olasılığı (Kesişim) Çarpma Kuralı ile hesaplanır:\n\n$$P(A \\cap B) = P(A) \\cdot P(B)$$\n\nHerhangi iki olay için Birleşim Kuralı (Toplam Olasılık):\n\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$";
      l.conceptCard.en = "Probability quantifies the likelihood of an event: $0 \\le P(A) \\le 1$. For two independent events, the probability of their intersection is calculated via the Multiplication Rule:\n\n$$P(A \\cap B) = P(A) \\cdot P(B)$$\n\nFor any two events, the Addition Rule is:\n\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$";
      l.companyExample.tr = "PaySafe ödeme sisteminde bir işlemin yüksek tutarlı olma olasılığı $P(A) = 0.20$ ve gece saatinde yapılma olasılığı $P(B) = 0.10$'dur. Olaylar bağımsız olduğunda her iki durumun aynı anda gerçekleşme olasılığı:\n\n$$P(A \\cap B) = P(A) \\cdot P(B) = 0.20 \\times 0.10 = 0.02 \\quad (\\%2)$$";
      l.questions[0].prompt.tr = "$P(A) = 0.40$ ve $P(B) = 0.50$ bağımsız iki olay ise, $P(A \\cap B)$ kesişim olasılığı kaçtır?";
      l.questions[0].prompt.en = "If $P(A) = 0.40$ and $P(B) = 0.50$ are independent events, what is $P(A \\cap B)$?";
      l.questions[0].explanation.tr = "$$P(A \\cap B) = P(A) \\cdot P(B) = 0.40 \\times 0.50 = 0.20$$";
      l.questions[0].explanation.en = "$$P(A \\cap B) = P(A) \\cdot P(B) = 0.40 \\times 0.50 = 0.20$$";
    }
    if (l.id === 'm2-l2') {
      l.conceptCard.tr = "Koşullu Olasılık, $B$ olayının gerçekleştiği bilindiğinde $A$ olayının meydana gelme olasılığıdır:\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\qquad P(B) > 0$$\n\nBuradan Zincir Kuralı türetilir: $P(A \\cap B) = P(A \\mid B) \\cdot P(B) = P(B \\mid A) \\cdot P(A)$.";
      l.conceptCard.en = "Conditional probability measures the probability of event $A$ given that event $B$ has already occurred:\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\qquad P(B) > 0$$\n\nFrom which the Chain Rule follows: $P(A \\cap B) = P(A \\mid B) \\cdot P(B)$.";
      l.companyExample.tr = "PaySafe dolandırıcılık modelinde, gece yapılan işlemlerin oranı $P(B) = 0.40$ ve hem gece yapılan hem de dolandırıcılık olan işlem oranı $P(A \\cap B) = 0.12$'dir. Gece yapılan bir işlemin dolandırıcılık olma koşullu olasılığı:\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0.12}{0.40} = 0.30 \\quad (\\%30)$$";
      l.questions[0].prompt.tr = "$P(A \\cap B) = 0.12$ ve $P(B) = 0.40$ ise koşullu olasılık $P(A \\mid B)$ kaçtır?";
      l.questions[0].prompt.en = "If $P(A \\cap B) = 0.12$ and $P(B) = 0.40$, what is the conditional probability $P(A \\mid B)$?";
      l.questions[0].explanation.tr = "$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0.12}{0.40} = 0.30$$";
      l.questions[0].explanation.en = "$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0.12}{0.40} = 0.30$$";
    }
    if (l.id === 'm2-l3') {
      l.conceptCard.tr = "Bayes Teoremi, gözlemlenen yeni bir kanıt ($B$) ışığında bir hipotezin ($A$) önsel olasılığını (prior) güncelleyerek sonsal olasılığa (posterior) dönüştürür:\n\n$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)} = \\frac{P(B \\mid A) \\cdot P(A)}{\\sum_{i=1}^{n} P(B \\mid A_i) \\cdot P(A_i)}$$";
      l.conceptCard.en = "Bayes' Theorem updates the prior probability of hypothesis $A$ in light of new evidence $B$ to yield the posterior probability:\n\n$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)} = \\frac{P(B \\mid A) \\cdot P(A)}{\\sum_{i=1}^{n} P(B \\mid A_i) \\cdot P(A_i)}$$";
      l.companyExample.tr = "Sistemde genel dolandırıcılık oranı $P(Fraud) = 0.05$'tir. Bir işlem fraud ise riskli IP alarmı verme hassasiyeti $P(Alarm \\mid Fraud) = 0.80$, genel alarm oranı $P(Alarm) = 0.10$'dur. Riskli IP alarmı veren bir işlemin gerçekten fraud olma olasılığı:\n\n$$P(Fraud \\mid Alarm) = \\frac{P(Alarm \\mid Fraud) \\cdot P(Fraud)}{P(Alarm)} = \\frac{0.80 \\times 0.05}{0.10} = \\frac{0.04}{0.10} = 0.40 \\quad (\\%40)$$";
      l.questions[0].prompt.tr = "$P(A) = 0.05$, $P(B \\mid A) = 0.80$ ve $P(B) = 0.10$ ise Bayes Teoremi ile $P(A \\mid B)$ kaçtır?";
      l.questions[0].prompt.en = "If $P(A) = 0.05$, $P(B \\mid A) = 0.80$, and $P(B) = 0.10$, what is $P(A \\mid B)$ via Bayes' Theorem?";
      l.questions[0].explanation.tr = "$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)} = \\frac{0.80 \\times 0.05}{0.10} = 0.40$$";
      l.questions[0].explanation.en = "$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)} = \\frac{0.80 \\times 0.05}{0.10} = 0.40$$";
    }
    if (l.id === 'm2-l4') {
      l.conceptCard.tr = "Kombinatorik, olası durum sayısını hesaplar. Sıranın önemli olduğu seçimler Permütasyon, sıranın önemsiz olduğu alt küme seçimleri Kombinasyon ile ifade edilir:\n\n$$P(n, k) = \\frac{n!}{(n-k)!}, \\qquad \\binom{n}{k} = C(n, k) = \\frac{n!}{k!(n-k)!}$$";
      l.conceptCard.en = "Combinatorics counts sample spaces. Ordered selections are Permutations, while unordered selections are Combinations:\n\n$$P(n, k) = \\frac{n!}{(n-k)!}, \\qquad \\binom{n}{k} = C(n, k) = \\frac{n!}{k!(n-k)!}$$";
      l.questions[0].prompt.tr = "$5$ elemanlı bir kümeden seçilecek $2$ elemanlı farklı grup sayısı $\\binom{5}{2}$ kaçtır?";
      l.questions[0].prompt.en = "What is the number of distinct 2-element subsets from a set of 5 elements $\\binom{5}{2}$?";
      l.questions[0].explanation.tr = "$$\\binom{5}{2} = \\frac{5!}{2!(5-2)!} = \\frac{5 \\times 4}{2 \\times 1} = 10$$";
      l.questions[0].explanation.en = "$$\\binom{5}{2} = \\frac{5!}{2!(5-2)!} = \\frac{5 \\times 4}{2 \\times 1} = 10$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm2-case-1') {
      c.businessQuestion.tr = "PaySafe ödeme sisteminde işlemler iki kanaldan gelmektedir: Mobil ($P(M) = 0.70$) ve Web ($P(W) = 0.30$). Mobil işlemlerde dolandırıcılık olasılığı $P(F \\mid M) = 0.02$, Web işlemlerinde ise $P(F \\mid W) = 0.06$'dır. Toplam dolandırıcılık olasılığı $P(F)$ ve dolandırıcılık olduğu bilinen bir işlemin web kaynaklı olma olasılığı $P(W \\mid F)$ hesaplanmalıdır.";
      setStepTr(c, 0, "1. Adım: Toplam Dolandırıcılık Olasılığı: $$P(F) = P(F \\mid M)P(M) + P(F \\mid W)P(W) = (0.02)(0.70) + (0.06)(0.30) = 0.014 + 0.018 = 0.032$$");
      setStepTr(c, 1, "2. Adım: Bayes Teoremi ile $P(W \\mid F)$: $$P(W \\mid F) = \\frac{P(F \\mid W)P(W)}{P(F)} = \\frac{0.018}{0.032} = 0.5625 \\quad (\\%56.25)$$");
      c.solutionQuestions[0].prompt.tr = "Sistemdeki toplam dolandırıcılık olasılığı $P(F)$ kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$P(F) = 0.014 + 0.018 = 0.032$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 3: Probability Distributions
// ----------------------------------------------------
updateModule('module3.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm3-l1') {
      l.conceptCard.tr = "Rastgele değişken $X$, bir deneyin sayısal sonuçlarını temsil eder. Kesikli değişkenlerde Olasılık Kütle Fonksiyonu (PMF) $P(X=x) = p(x)$ ve Kümülatif Dağılım Fonksiyonu (CDF) $F(x) = P(X \\le x)$ kullanılır. Beklenen Değer ve Varyans:\n\n$$\\mathbb{E}[X] = \\sum_{i} x_i \\cdot P(X=x_i), \\qquad \\text{Var}(X) = \\mathbb{E}[(X - \\mu)^2] = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2$$";
      l.conceptCard.en = "A random variable $X$ assigns numerical outcomes to events. For discrete variables, the PMF is $P(X=x)$ and CDF is $F(x) = P(X \\le x)$. Expected value and variance are:\n\n$$\\mathbb{E}[X] = \\sum_{i} x_i P(X=x_i), \\qquad \\text{Var}(X) = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2$$";
      l.questions[0].prompt.tr = "$X$ kesikli rastgele değişkeni için $\\sum_{i} P(X = x_i)$ toplamı her zaman kaça eşit olmalıdır?";
      l.questions[0].prompt.en = "For a discrete random variable $X$, what must the sum $\\sum_{i} P(X = x_i)$ always equal?";
      l.questions[0].explanation.tr = "Olasılık aksiyomlarına göre tüm olası durumların olasılıkları toplamı tam olarak $1$'e (yani $\\%100$) eşittir: $$\\sum_{i} P(X = x_i) = 1$$";
      l.questions[0].explanation.en = "By probability axioms, the sum of probabilities over all outcomes equals $1$: $$\\sum_{i} P(X = x_i) = 1$$";
    }
    if (l.id === 'm3-l2') {
      l.conceptCard.tr = "Binom Dağılımı $X \\sim \\text{Bin}(n, p)$, bağımsız $n$ adet Bernoulli denemesinde elde edilen toplam başarı sayısını modeller:\n\n$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\qquad k = 0, 1, \\dots, n$$\n\nBeklenen değer $\\mathbb{E}[X] = n p$, varyans $\\text{Var}(X) = n p (1-p)$ ve standart sapma $\\sigma = \\sqrt{n p (1-p)}$ olarak hesaplanır.";
      l.conceptCard.en = "The Binomial distribution $X \\sim \\text{Bin}(n, p)$ models the number of successes in $n$ independent Bernoulli trials:\n\n$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\qquad k = 0, 1, \\dots, n$$\n\nExpected value is $\\mathbb{E}[X] = n p$, variance is $\\text{Var}(X) = n p (1-p)$.";
      l.companyExample.tr = "Çağrı merkezinde $n = 5$ müşteri aramasının her birinde satış gerçekleşme olasılığı $p = 0.20$'dir. Tam $k = 2$ satış gerçekleşme olasılığı:\n\n$$P(X = 2) = \\binom{5}{2} (0.20)^2 (0.80)^3 = 10 \\times 0.04 \\times 0.512 = 0.2048 \\quad (\\%20.48)$$";
      l.questions[0].prompt.tr = "$n = 4$ bağımsız denemede her bir denemenin başarı olasılığı $p = 0.50$ ise, tam $k = 0$ başarı olasılığı $P(X=0)$ kaçtır?";
      l.questions[0].prompt.en = "In $n = 4$ independent trials with success probability $p = 0.50$, what is $P(X = 0)$?";
      l.questions[0].explanation.tr = "$$P(X = 0) = \\binom{4}{0} (0.50)^0 (0.50)^4 = 1 \\times 1 \\times 0.0625 = 0.0625$$";
      l.questions[0].explanation.en = "$$P(X = 0) = \\binom{4}{0} (0.50)^0 (0.50)^4 = 0.0625$$";
    }
    if (l.id === 'm3-l3') {
      l.conceptCard.tr = "Poisson Dağılımı $X \\sim \\text{Poisson}(\\lambda)$, belirli bir zaman veya alan diliminde nadir olayların meydana gelme sayısını modeller:\n\n$$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\qquad k = 0, 1, 2, \\dots$$\n\nEn önemli teorik özelliği: $\\mathbb{E}[X] = \\text{Var}(X) = \\lambda$ olmasıdır.";
      l.conceptCard.en = "The Poisson distribution $X \\sim \\text{Poisson}(\\lambda)$ models the occurrence of rare events in a fixed time/space interval:\n\n$$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\qquad k = 0, 1, 2, \\dots$$\n\nKey property: $\\mathbb{E}[X] = \\text{Var}(X) = \\lambda$.";
      l.questions[0].prompt.tr = "Ortalaması $\\lambda = 3$ olan bir Poisson sürecinde $k = 0$ olay gerçekleşme olasılığı $P(X=0)$ kaçtır ($e^{-3} \\approx 0.05$)?";
      l.questions[0].prompt.en = "In a Poisson process with rate $\\lambda = 3$, what is $P(X=0)$ ($e^{-3} \\approx 0.05$)?";
      l.questions[0].explanation.tr = "$$P(X = 0) = \\frac{3^0 e^{-3}}{0!} = \\frac{1 \\cdot e^{-3}}{1} = e^{-3} \\approx 0.05$$";
      l.questions[0].explanation.en = "$$P(X = 0) = \\frac{3^0 e^{-3}}{0!} = e^{-3} \\approx 0.05$$";
    }
    if (l.id === 'm3-l4') {
      l.conceptCard.tr = "Normal Dağılım $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, simetrik ve çan eğrisi formunda sürekli bir olasılık dağılımıdır. Olasılık Yoğunluk Fonksiyonu (PDF):\n\n$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}, \\qquad -\\infty < x < \\infty$$\n\nHerhangi bir normal değişken standart normal $Z \\sim \\mathcal{N}(0, 1)$ değişkenine dönüştürülür: $$Z = \\frac{X - \\mu}{\\sigma}$$";
      l.conceptCard.en = "The Normal distribution $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$ is a continuous symmetric bell-shaped distribution. Its PDF is:\n\n$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}, \\qquad -\\infty < x < \\infty$$\n\nStandardized via $Z = \\frac{X - \\mu}{\\sigma}$.";
      l.questions[0].prompt.tr = "Ortalaması $\\mu = 100$ ve standart sapması $\\sigma = 15$ olan bir dağılımda $X = 130$ değerinin Z-skoru kaçtır?";
      l.questions[0].prompt.en = "In a distribution with $\\mu = 100$ and $\\sigma = 15$, what is the Z-score for $X = 130$?";
      l.questions[0].explanation.tr = "$$Z = \\frac{X - \\mu}{\\sigma} = \\frac{130 - 100}{15} = \\frac{30}{15} = 2.0$$";
      l.questions[0].explanation.en = "$$Z = \\frac{X - \\mu}{\\sigma} = \\frac{130 - 100}{15} = 2.0$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm3-case-1') {
      c.businessQuestion.tr = "VoltLogistics çağrı merkezine saatte ortalama $\\lambda = 4$ arıza bildirimi gelmektedir. Süreç Poisson dağılımına uymaktadır ($X \\sim \\text{Poisson}(4)$). Bir saatte hiç arıza gelmeme ($P(X=0)$) ve 2 arıza gelme ($P(X=2)$) olasılıklarını hesaplayınız ($e^{-4} \\approx 0.0183$).";
      setStepTr(c, 0, "1. Adım: $P(X=0)$ hesabı: $$P(X = 0) = \\frac{4^0 e^{-4}}{0!} = e^{-4} \\approx 0.0183 \\quad (\\%1.83)$$");
      setStepTr(c, 1, "2. Adım: $P(X=2)$ hesabı: $$P(X = 2) = \\frac{4^2 e^{-4}}{2!} = \\frac{16 \\times 0.0183}{2} = 8 \\times 0.0183 = 0.1464 \\quad (\\%14.64)$$");
      c.solutionQuestions[0].prompt.tr = "Poisson dağılımında varyans $\\text{Var}(X)$ kaçtır ($\\lambda = 4$)?";
      c.solutionQuestions[0].explanation.tr = "$$\\text{Var}(X) = \\lambda = 4$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 4: Sampling & Central Limit Theorem
// ----------------------------------------------------
updateModule('module4.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm4-l1') {
      l.conceptCard.tr = "Anakütleden çekilen $n$ birimlik rastgele örneklemlerin ortalaması ($\\bar{X}$) bir rastgele değişkendir ve bir Örnekleme Dağılımı oluşturur. Örneklem ortalamasının beklenen değeri anakütle ortalamasına eşittir:\n\n$$\\mathbb{E}[\\bar{X}] = \\mu_{\\bar{X}} = \\mu, \\qquad \\sigma_{\\bar{X}} = \\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$$\n\nBurada $\\text{SE}$ (Standard Error - Standart Hata), örneklem ortalamasının anakütle ortalaması etrafındaki değişkenliğini ifade eder.";
      l.questions[0].prompt.tr = "Standart sapması $\\sigma = 20$ olan bir anakütleden $n = 100$ büyüklüğünde bir örneklem çekildiğinde Standart Hata ($\\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$) kaçtır?";
      l.questions[0].explanation.tr = "$$\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{20}{\\sqrt{100}} = \\frac{20}{10} = 2$$";
    }
    if (l.id === 'm4-l2') {
      l.conceptCard.tr = "Merkezi Limit Teoremi (CLT), ana kütlenin dağılımı ne olursa olsun (çarpık, düzgün veya bimodal), örneklem hacmi $n \\ge 30$ olduğunda örneklem ortalamaları dağılımının yaklaşık olarak Normal Dağılıma yakınsayacağını garanti eder:\n\n$$\\bar{X} \\xrightarrow{d} \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right), \\qquad Z = \\frac{\\bar{X} - \\mu}{\\frac{\\sigma}{\\sqrt{n}}} \\sim \\mathcal{N}(0, 1)$$";
      l.questions[0].prompt.tr = "Merkezi Limit Teoremi'nin (CLT) geçerli olması için literatürde genel kabul gören minimum örneklem hacmi ($n$) kaçtır?";
      l.questions[0].explanation.tr = "İstatistikte örneklem ortalamasının normale yaklaşması için genellikle $n \\ge 30$ eşiği yeterli kabul edilir.";
    }
    if (l.id === 'm4-l3') {
      l.conceptCard.tr = "Büyük Sayılar Yasası (LLN), örneklem büyüklüğü $n \\to \\infty$ arttıkça, örneklem ortalamasının $\\bar{X}_n$ anakütle ortalaması $\\mu$'ye olasılıkta yakınsayacağını ifade eder:\n\n$$P\\left(\\lim_{n \\to \\infty} |\\bar{X}_n - \\mu| < \\epsilon\\right) = 1$$";
    }
    if (l.id === 'm4-l4') {
      l.conceptCard.tr = "Örneklem hacmi $n$ arttıkça standart hata $\\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$ küçülür. Standart hatayı yarıya düşürmek için örneklem hacmi $4$ katına çıkarılmalıdır:\n\n$$\\text{SE}_{\\text{yeni}} = \\frac{\\sigma}{\\sqrt{4n}} = \\frac{1}{2} \\frac{\\sigma}{\\sqrt{n}} = \\frac{1}{2} \\text{SE}$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm4-case-1') {
      c.businessQuestion.tr = "CloudTech veri merkezinde sunucu yanıt sürelerinin ortalaması $\\mu = 150 \\text{ ms}$ ve standart sapması $\\sigma = 40 \\text{ ms}$'dir. $n = 64$ büyüklüğünde bir örneklem çekildiğinde standart hata $\\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$ ve $\\bar{X} = 160 \\text{ ms}$ için Z-istatistiğini hesaplayınız.";
      setStepTr(c, 0, "1. Adım: Standart Hata: $$\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{40}{\\sqrt{64}} = \\frac{40}{8} = 5 \\text{ ms}$$");
      setStepTr(c, 1, "2. Adım: Z-Skoru: $$Z = \\frac{\\bar{X} - \\mu}{\\text{SE}} = \\frac{160 - 150}{5} = \\frac{10}{5} = 2.0$$");
      c.solutionQuestions[0].prompt.tr = "Örneklem ortalaması dağılımının standart hatası $\\text{SE}$ kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$\\text{SE} = \\frac{40}{\\sqrt{64}} = 5$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 5: Confidence Intervals
// ----------------------------------------------------
updateModule('module5.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm5-l1') {
      l.conceptCard.tr = "Güven Aralığı (CI), bilinmeyen anakütle parametresini ($\\mu$ veya $p$) belirli bir $(1-\\alpha)$ güven düzeyinde içeren aralıktır:\n\n$$\\text{Güven Aralığı} = \\text{Nokta Tahmini} \\pm \\text{Hata Payı (Margin of Error)}$$\n\n$$\\bar{X} \\pm Z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}$$\n\n$\\%95$ güven düzeyi için kritik $Z$-değeri $Z_{0.025} = 1.96$'dır.";
      l.questions[0].prompt.tr = "$\\%95$ güven düzeyi için iki kuyruklu standart normal kritik $Z$-değeri ($Z_{\\alpha/2}$) kaçtır?";
      l.questions[0].explanation.tr = "$$1 - \\alpha = 0.95 \\implies \\alpha = 0.05 \\implies Z_{0.025} = 1.96$$";
    }
    if (l.id === 'm5-l2') {
      l.conceptCard.tr = "Anakütle standart sapması $\\sigma$ bilinmediğinde ve örneklemden $s$ hesaplandığında Student's $t$ dağılımı kullanılır ($df = n-1$ serbestlik derecesi):\n\n$$\\bar{X} \\pm t_{\\alpha/2, \\, n-1} \\cdot \\frac{s}{\\sqrt{n}}$$\n\nÖrneklem büyüklüğü $n \\to \\infty$ arttıkça $t$ dağılımı Standart Normal $Z$ dağılımına yakınsar.";
      l.questions[0].prompt.tr = "$n = 16$ gözlemden oluşan bir örneklem için Student's t dağılımının serbestlik derecesi ($df = n - 1$) kaçtır?";
      l.questions[0].explanation.tr = "$$df = n - 1 = 16 - 1 = 15$$";
    }
    if (l.id === 'm5-l3') {
      l.conceptCard.tr = "Anakütle oranı ($p$) için $(1-\\alpha)$ Güven Aralığı:\n\n$$\\hat{p} \\pm Z_{\\alpha/2} \\cdot \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}$$\n\nBurada $\\hat{p} = \\frac{x}{n}$ örneklem oranı, $\\text{SE}(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}$ ise standart hatadır.";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm5-case-1') {
      c.businessQuestion.tr = "FinLab müşteri memnuniyet skoru için $n = 100$, $\\bar{X} = 80$ puan ve $\\sigma = 10$ bulmuştur. $\\%95$ güven düzeyinde ($Z_{0.025} = 1.96$) anakütle ortalaması için Güven Aralığını $[\\text{Alt}, \\text{Üst}]$ hesaplayınız.";
      setStepTr(c, 0, "1. Adım: Standart Hata: $$\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{10}{\\sqrt{100}} = 1.0$$");
      setStepTr(c, 1, "2. Adım: Hata Payı (ME) ve Güven Aralığı: $$\\text{ME} = 1.96 \\times 1.0 = 1.96 \\implies [80 - 1.96, \\, 80 + 1.96] = [78.04, \\, 81.96]$$");
      c.solutionQuestions[0].prompt.tr = "$\\%95$ Güven Aralığı Hata Payı (ME) kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$\\text{ME} = 1.96 \\times 1.0 = 1.96$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 6: Hypothesis Testing
// ----------------------------------------------------
updateModule('module6.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm6-l1') {
      l.conceptCard.tr = "Hipotez testi, bir popülasyon parametresi hakkında kurulan iddiayı verilerle test eder:\n\n$$H_0: \\mu = \\mu_0 \\quad (\\text{Sıfır Hipotezi - Değişim Yok})$$\n$$H_1: \\mu \\ne \\mu_0 \\quad \\text{veya} \\quad H_1: \\mu > \\mu_0 \\quad (\\text{Alternatif Hipotez})$$\n\nTip I Hata ($\\alpha$): $H_0$ doğruyken reddetme olasılığı. Tip II Hata ($\\beta$): $H_0$ yanlışken reddedememe olasılığı. Testin Gücü: $1 - \\beta$.";
      l.questions[0].prompt.tr = "Sıfır hipotezi ($H_0$) gerçekte doğru olduğu halde reddedilirse hangi tür hata yapılmış olur?";
      l.questions[0].explanation.tr = "Gerçekte doğru olan $H_0$'ın reddedilmesi Tip I Hata ($\\alpha$, Type I Error / Yalancı Pozitif) olarak adlandırılır.";
    }
    if (l.id === 'm6-l2') {
      l.conceptCard.tr = "Tek örneklem Z-testi istatistiği:\n\n$$Z_{\\text{hesap}} = \\frac{\\bar{X} - \\mu_0}{\\frac{\\sigma}{\\sqrt{n}}}$$\n\np-Değeri Kuralı: Eğer $p\\text{-değeri} \\le \\alpha$ ise $H_0$ reddedilir; aksi halde $H_0$ reddedilemez.";
      l.questions[0].prompt.tr = "Bir hipotez testinde hesaplanan $p\\text{-değeri} = 0.015$ ve anlamlılık düzeyi $\\alpha = 0.05$ ise karar ne olmalıdır?";
      l.questions[0].explanation.tr = "$p = 0.015 \\le \\alpha = 0.05$ olduğundan $H_0$ reddedilir (istatistiksel olarak anlamlı fark vardır).";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm6-case-1') {
      c.businessQuestion.tr = "OptiCorp yeni algoritmasının sunucu bekleme süresini düşürdüğünü iddia etmektedir ($H_0: \\mu = 50 \\text{ ms}$, $H_1: \\mu < 50 \\text{ ms}$). $n = 64$ testte $\\bar{X} = 47 \\text{ ms}$ ve $\\sigma = 12 \\text{ ms}$ ölçülmüştür. $\\alpha = 0.05$ düzeyinde Z-test istatistiğini ve kararı belirleyiniz.";
      setStepTr(c, 0, "1. Adım: Standart Hata: $$\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{12}{\\sqrt{64}} = 1.5$$");
      setStepTr(c, 1, "2. Adım: Z Test İstatistiği: $$Z = \\frac{\\bar{X} - \\mu_0}{\\text{SE}} = \\frac{47 - 50}{1.5} = \\frac{-3}{1.5} = -2.0$$");
      c.solutionQuestions[0].prompt.tr = "Hesaplanan test istatistiği $Z_{\\text{hesap}}$ kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$Z = \\frac{47 - 50}{1.5} = -2.0$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 7: Simple Linear Regression & Correlation
// ----------------------------------------------------
updateModule('module7.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm7-l1') {
      l.conceptCard.tr = "Pearson Korelasyon Katsayısı ($r$), iki sürekli değişken arasındaki doğrusal ilişkinin yönünü ve kuvvetini $-1 \\le r \\le +1$ aralığında ölçer:\n\n$$r = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^{n} (x_i - \\bar{x})^2 \\sum_{i=1}^{n} (y_i - \\bar{y})^2}} = \\frac{\\text{Cov}(X, Y)}{s_x s_y}$$";
      l.questions[0].prompt.tr = "$r = -0.92$ çıkan bir korelasyon katsayısı değişkenler arasında nasıl bir ilişki olduğunu gösterir?";
      l.questions[0].explanation.tr = "$-1$'e çok yakın olduğu için güçlü ve ters yönlü (negatif) doğrusal bir ilişkiyi gösterir.";
    }
    if (l.id === 'm7-l2') {
      l.conceptCard.tr = "Basit Doğrusal Regresyon Modeli, En Küçük Kareler (OLS) yöntemi ile hata kareleri toplamını ($\\text{SSE} = \\sum e_i^2$) minimize eder:\n\n$$\\hat{y} = \\beta_0 + \\beta_1 x$$\n\nEğim ($\\beta_1$) ve Kesişim ($\\beta_0$):\n\n$$\\beta_1 = \\frac{\\text{Cov}(X, Y)}{\\text{Var}(X)} = r \\frac{s_y}{s_x}, \\qquad \\beta_0 = \\bar{y} - \\beta_1 \\bar{x}$$";
      l.questions[0].prompt.tr = "Doğrusal regresyon denklemi $\\hat{y} = 15 + 3x$ olan bir modelde $x = 10$ için tahmin edilen $\\hat{y}$ değeri kaçtır?";
      l.questions[0].explanation.tr = "$$\\hat{y} = 15 + 3(10) = 15 + 30 = 45$$";
    }
    if (l.id === 'm7-l3') {
      l.conceptCard.tr = "Belirleme Katsayısı ($R^2$), bağımlı değişkendeki ($Y$) toplam değişkenliğin ne kadarının bağımsız değişken ($X$) tarafından açıklandığını gösterir:\n\n$$R^2 = 1 - \\frac{\\text{SSE}}{\\text{SST}} = \\frac{\\text{SSR}}{\\text{SST}} = r^2, \\qquad 0 \\le R^2 \\le 1$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm7-case-1') {
      c.businessQuestion.tr = "AdPulse dijital reklam harcaması ($X$, Bin TL) ile elde edilen satış geliri ($Y$, Bin TL) arasındaki ilişkiyi modellemektedir. Veri analizinde $\\bar{x} = 20$, $\\bar{y} = 100$, eğim $\\beta_1 = 4.0$ bulunmuştur. Kesişim noktası $\\beta_0$ ve $X = 30$ için tahmin edilen geliri hesaplayınız.";
      setStepTr(c, 0, "1. Adım: Kesişim Noktası: $$\\beta_0 = \\bar{y} - \\beta_1 \\bar{x} = 100 - 4(20) = 100 - 80 = 20$$");
      setStepTr(c, 1, "2. Adım: $x = 30$ için Tahmin: $$\\hat{y} = 20 + 4(30) = 20 + 120 = 140 \\text{ Bin TL}$$");
      c.solutionQuestions[0].prompt.tr = "Model kesişim parametresi $\\beta_0$ kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$\\beta_0 = 100 - 4(20) = 20$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 8: Multiple Regression & Model Evaluation
// ----------------------------------------------------
updateModule('module8.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm8-l1') {
      l.conceptCard.tr = "Çoklu Doğrusal Regresyon, bir bağımlı değişkeni ($Y$) birden fazla açıklayıcı değişken ($X_1, X_2, \\dots, X_k$) ile modeller:\n\n$$Y = \\beta_0 + \\beta_1 X_1 + \\beta_2 X_2 + \\dots + \\beta_k X_k + \\epsilon, \\qquad \\epsilon \\sim \\mathcal{N}(0, \\sigma^2)$$\n\nDüzeltilmiş $R^2$ ($R_{\\text{adj}}^2$), modele eklenen değişken sayısının serbestlik derecesi üzerindeki cezasını hesaba katar:\n\n$$R_{\\text{adj}}^2 = 1 - \\left[ \\frac{(1 - R^2)(n - 1)}{n - k - 1} \\right]$$";
      l.questions[0].prompt.tr = "Çoklu regresyonda modele anlamsız yeni değişkenler eklendikçe standart $R^2$ ve Düzeltilmiş $R^2_{\\text{adj}}$ nasıl davranır?";
      l.questions[0].explanation.tr = "Standart $R^2$ asla azalmaz (şişer); Düzeltilmiş $R^2_{\\text{adj}}$ ise ceza katsayısı sebebiyle düşebilir.";
    }
    if (l.id === 'm8-l2') {
      l.conceptCard.tr = "Çoklu Doğrusallık (Multicollinearity), bağımsız değişkenlerin kendi aralarında yüksek korelasyona sahip olmasıdır. Varyans Şişirme Faktörü ($\\text{VIF}$) ile tespit edilir:\n\n$$\\text{VIF}_j = \\frac{1}{1 - R_j^2}$$\n\nGenel kural olarak $\\text{VIF} > 5$ veya $\\text{VIF} > 10$ ciddi çoklu doğrusallık riskine işaret eder.";
      l.questions[0].prompt.tr = "Bir bağımsız değişkenin diğer değişkenlerle regresyonunda $R_j^2 = 0.80$ ise bu değişkenin $\\text{VIF}$ değeri kaçtır?";
      l.questions[0].explanation.tr = "$$\\text{VIF} = \\frac{1}{1 - 0.80} = \\frac{1}{0.20} = 5$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm8-case-1') {
      c.businessQuestion.tr = "PropTech konut fiyat tahmin modelinde $\\hat{Y} = 500 + 15 X_1 + 80 X_2$ denklemini kurmuştur ($X_1$: Metrekare $\\text{m}^2$, $X_2$: Oda Sayısı). $100 \\text{ m}^2$ ve $3$ odalı bir evin tahmini fiyatını hesaplayınız.";
      setStepTr(c, 0, "1. Adım: Denklemde Yerine Koyma: $$\\hat{Y} = 500 + 15(100) + 80(3) = 500 + 1500 + 240 = 2240 \\text{ Bin TL}$$");
      c.solutionQuestions[0].prompt.tr = "Tahmin edilen konut fiyatı (Bin TL) kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$\\hat{Y} = 500 + 1500 + 240 = 2240$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 9: ANOVA & Categorical Data Analysis
// ----------------------------------------------------
updateModule('module9.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm9-l1' || l.id === 'm9-l2') {
      l.conceptCard.tr = "Tek Yönlü ANOVA (One-Way ANOVA), $k \\ge 3$ bağımsız grubun anakütle ortalamalarının eşitliğini test eder:\n\n$$H_0: \\mu_1 = \\mu_2 = \\dots = \\mu_k, \\qquad H_1: \\text{En az bir ortalama farklıdır}$$\n\n$F$-Test İstatistiği, Gruplar Arası Varyansın ($\\text{MSB}$) Grup İçi Varyansa ($\\text{MSW}$) oranıdır:\n\n$$F = \\frac{\\text{MSB}}{\\text{MSW}} = \\frac{\\text{SSB} / (k - 1)}{\\text{SSW} / (N - k)}$$";
      l.questions[0].prompt.tr = "3 veya daha fazla grup ortalamasını karşılaştırırken ikili t-testleri yerine neden ANOVA tercih edilir?";
      l.questions[0].explanation.tr = "Çoklu ikili test yapmak kümülatif Tip I Hata (Family-wise Error Rate) oranını $\\alpha_{\\text{toplam}} = 1 - (1-\\alpha)^m$ formülü ile aşırı şişirir.";
    }
    if (l.id === 'm9-l3') {
      l.conceptCard.tr = "Ki-Kare ($\\chi^2$) Bağımsızlık Testi, iki kategorik değişken arasındaki ilişkinin anlamlılığını test eder:\n\n$$\\chi^2 = \\sum_{i=1}^{r} \\sum_{j=1}^{c} \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}, \\qquad E_{ij} = \\frac{R_i \\cdot C_j}{N}$$\n\nSerbestlik derecesi: $df = (r - 1)(c - 1)$.";
      l.questions[0].prompt.tr = "$2 \\times 3$ boyutlu bir kontenjans tablosunda Ki-Kare testinin serbestlik derecesi ($df = (r-1)(c-1)$) kaçtır?";
      l.questions[0].explanation.tr = "$$df = (2 - 1)(3 - 1) = 1 \\times 2 = 2$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm9-case-1') {
      c.businessQuestion.tr = "MediaImpact 3 farklı pazarlama kampanyasının ($k = 3$) dönüşüm oranlarını incelemektedir ($N = 30$). ANOVA tablosunda $\\text{SSB} = 120$ ($df = 2$) ve $\\text{SSW} = 135$ ($df = 27$) hesaplanmıştır. $F$-istatistiğini bulunuz.";
      setStepTr(c, 0, "1. Adım: $\\text{MSB} = \\frac{120}{2} = 60$. $\\text{MSW} = \\frac{135}{27} = 5$.");
      setStepTr(c, 1, "2. Adım: $F$-İstatistiği: $$F = \\frac{\\text{MSB}}{\\text{MSW}} = \\frac{60}{5} = 12.0$$");
      c.solutionQuestions[0].prompt.tr = "Hesaplanan ANOVA $F$-istatistiği kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$F = \\frac{60}{5} = 12$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 10: Time Series Fundamentals
// ----------------------------------------------------
updateModule('module10.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm1-l2' || l.id === 'm10-l2') {
      l.conceptCard.tr = "Zaman Serisi, kronolojik sıra ile toplanmış gözlemler kümesidir. $k$-Dönemlik Basit Hareketli Ortalama (SMA):\n\n$$\\text{SMA}_t = \\frac{1}{k} \\sum_{i=0}^{k-1} Y_{t-i} = \\frac{Y_t + Y_{t-1} + \\dots + Y_{t-k+1}}{k}$$";
      l.questions[0].prompt.tr = "Son 3 ayın satış değerleri $10, 20, 30$ Bin TL ise 3 aylık Hareketli Ortalama tahmini kaçtır?";
      l.questions[0].explanation.tr = "$$\\text{SMA} = \\frac{10 + 20 + 30}{3} = \\frac{60}{3} = 20$$";
    }
    if (l.id === 'm10-l3') {
      l.conceptCard.tr = "Basit Üstel Düzleştirme (Single Exponential Smoothing), geçmiş gözlemlere üssel olarak azalan ağırlıklar verir:\n\n$$\\hat{Y}_{t+1} = \\alpha Y_t + (1 - \\alpha) \\hat{Y}_t, \\qquad 0 \\le \\alpha \\le 1$$\n\nDüzleştirme parametresi $\\alpha$ büyüdükçe model en son gözleme daha yüksek ağırlık verir.";
      l.questions[0].prompt.tr = "Üstel düzleştirmede $\\alpha = 1.0$ seçilirse bir sonraki dönem tahmini $\\hat{Y}_{t+1}$ neye eşit olur?";
      l.questions[0].explanation.tr = "$$\\hat{Y}_{t+1} = 1.0(Y_t) + 0(\\hat{Y}_t) = Y_t \\quad (\\text{Naive / En son gerçekleşen değer})$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm10-case-1') {
      c.businessQuestion.tr = "RetailCo son 3 aylık satışları sırasıyla $400, 500, 600$ Bin TL olarak kaydetmiştir. 3 aylık Basit Hareketli Ortalama ile bir sonraki dönemin tahminini hesaplayınız.";
      setStepTr(c, 0, "1. Adım: $$\\text{SMA}_4 = \\frac{400 + 500 + 600}{3} = \\frac{1500}{3} = 500 \\text{ Bin TL}$$");
      c.solutionQuestions[0].prompt.tr = "Nisan ayı tahmini (Bin TL) kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$\\text{SMA} = \\frac{1500}{3} = 500$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 11: Capstone Project
// ----------------------------------------------------
updateModule('module11.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm11-l4') {
      l.conceptCard.tr = "Uçtan uca analitik modelleme; Keşifsel Veri Analizi (EDA), Dağılım Uyumu, Hipotez Testi ve Doğrusal Regresyon adımlarının sentezidir:\n\n$$\\hat{Y} = \\beta_0 + \\beta_1 X$$\n\nKarar vericilere sunulan güven aralıkları ve etki katsayıları iş stratejilerini yönlendirir.";
      l.questions[0].prompt.tr = "Regresyon denklemi $\\hat{Y} = 100 + 4X$ olan bir modelde $X = 25$ için tahmin edilen $\\hat{Y}$ değeri kaçtır?";
      l.questions[0].explanation.tr = "$$\\hat{Y} = 100 + 4(25) = 100 + 100 = 200$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm11-case-1') {
      c.solutionQuestions[0].prompt.tr = "$X = 25$ birim reklam harcaması için $\\hat{Y} = 100 + 4X$ modeliyle tahmin edilen ciro kaçtır ($)?";
      c.solutionQuestions[0].explanation.tr = "$$\\hat{Y} = 100 + 4(25) = 200$$";
    }
    if (c.id === 'm11-case-2') {
      c.businessQuestion.tr = "VoltPower iki bağımsız üretim hattının varyanslarının eşitliğini test etmektedir ($H_0: \\sigma_1^2 = \\sigma_2^2$, $H_1: \\sigma_1^2 \\ne \\sigma_2^2$). Örneklem varyansları $s_1^2 = 75$ ve $s_2^2 = 25$ olduğuna göre $F$-testi istatistiğini ($F = \\frac{s_1^2}{s_2^2}$) hesaplayınız.";
      setStepTr(c, 0, "1. Adım: $$F = \\frac{s_1^2}{s_2^2} = \\frac{75}{25} = 3.0$$");
      c.solutionQuestions[0].prompt.tr = "Hesaplanan $F$ test istatistiği kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$F = \\frac{75}{25} = 3$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 12: Markov Chains & Stochastic Processes
// ----------------------------------------------------
updateModule('module12.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm12-l1') {
      l.conceptCard.tr = "Ayrık Zamanlı Markov Zinciri (DTMC), gelecekteki durumun geçmişten bağımsız olarak yalnızca mevcut duruma bağlı olduğu stokastik bir süreçtir (Markovian Özelliği):\n\n$$P(X_{n+1} = j \\mid X_n = i, X_{n-1} = i_{n-1}, \\dots, X_0 = i_0) = P(X_{n+1} = j \\mid X_n = i) = p_{ij}$$\n\nTek Adımlı Geçiş Olasılıkları Matrisi $P = [p_{ij}]$ olup her satır toplamı $1$'e eşittir:\n\n$$\\sum_{j} p_{ij} = 1, \\qquad \\forall i$$";
      l.conceptCard.en = "A Discrete-Time Markov Chain (DTMC) satisfies the Markov property, where the next state depends only on the current state:\n\n$$P(X_{n+1} = j \\mid X_n = i, X_{n-1} = i_{n-1}, \\dots, X_0 = i_0) = P(X_{n+1} = j \\mid X_n = i) = p_{ij}$$\n\nTransition Matrix $P = [p_{ij}]$ with row stochasticity: $\\sum_{j} p_{ij} = 1$.";
      l.companyExample.tr = "CloudPulse sunucu izleme sisteminde sunucunun iki durumu vardır: Sağlıklı ($S_1$) ve Arızalı ($S_2$). Sağlıklı bir sunucunun bir sonraki saatte sağlıklı kalma olasılığı $p_{11} = 0.90$, arızaya geçme olasılığı $p_{12} = 0.10$'dur. Geçiş matrisi:\n\n$$P = \\begin{bmatrix} 0.90 & 0.10 \\\\ 0.40 & 0.60 \\end{bmatrix}$$";
      l.questions[0].prompt.tr = "Bir stokastik geçiş matrisinde $p_{11} = 0.70$ ise, satır toplamı $1$ kuralına göre $p_{12}$ geçiş olasılığı kaçtır?";
      l.questions[0].prompt.en = "In a stochastic transition matrix, if $p_{11} = 0.70$, what is $p_{12}$ by the row sum rule?";
      l.questions[0].explanation.tr = "$$p_{12} = 1 - p_{11} = 1 - 0.70 = 0.30$$";
      l.questions[0].explanation.en = "$$p_{12} = 1 - p_{11} = 1 - 0.70 = 0.30$$";
    }
    if (l.id === 'm12-l2') {
      l.conceptCard.tr = "Chapman-Kolmogorov Denklemleri, $n$-adım sonraki durum geçiş olasılıklarını hesaplar. $n$-adım geçiş matrisi $P^{(n)}$, tek adımlık geçiş matrisinin $n$. kuvvetine eşittir:\n\n$$P^{(n+m)} = P^{(n)} \\cdot P^{(m)} \\implies P^{(n)} = P^n$$\n\nBaşlangıç durum olasılık vektörü $\\mathbf{v}^{(0)}$ ise $n$ adım sonraki durum dağılımı $\\mathbf{v}^{(n)} = \\mathbf{v}^{(0)} P^n$ formülü ile bulunur.";
      l.conceptCard.en = "Chapman-Kolmogorov Equations establish that $n$-step transition probabilities equal matrix powers:\n\n$$P^{(n)} = P^n, \\qquad \\mathbf{v}^{(n)} = \\mathbf{v}^{(0)} P^n$$";
      l.questions[0].prompt.tr = "$2$ adım sonraki durum geçiş olasılıkları matrisi $P^{(2)}$ nasıl hesaplanır?";
      l.questions[0].prompt.en = "How is the 2-step transition probability matrix $P^{(2)}$ calculated?";
      l.questions[0].explanation.tr = "Chapman-Kolmogorov teoremine göre $P^{(2)} = P \\cdot P = P^2$ matris çarpımı ile hesaplanır.";
      l.questions[0].explanation.en = "By the Chapman-Kolmogorov theorem, $P^{(2)} = P \\cdot P = P^2$.";
    }
    if (l.id === 'm12-l3') {
      l.conceptCard.tr = "İndirgenemez (irreducible) ve aperiyodik bir Markov zincirinde, zaman $n \\to \\infty$ sonsuza giderken sistem bir Durağan Denge Dağılımına ($\\boldsymbol{\\pi}^*$) ulaşır. Bu durağan denge vektörü şu lineer denklem sistemi ile çözülür:\n\n$$\\boldsymbol{\\pi} P = \\boldsymbol{\\pi} \\qquad \\text{ve} \\qquad \\sum_{i} \\pi_i = 1$$\n\nBurada $\\pi_i$, sistemin uzun vadede $i$. durumda bulunma olasılığını gösterir.";
      l.conceptCard.en = "An irreducible, aperiodic Markov chain converges to a unique stationary steady-state distribution $\\boldsymbol{\\pi}^*$:\n\n$$\\boldsymbol{\\pi} P = \\boldsymbol{\\pi} \\qquad \\text{and} \\qquad \\sum_{i} \\pi_i = 1$$";
      l.companyExample.tr = "Müşteri tutma matrisi $P = \\begin{bmatrix} 0.80 & 0.20 \\\\ 0.30 & 0.70 \\end{bmatrix}$ için $\\pi_1(0.80) + \\pi_2(0.30) = \\pi_1$ ve $\\pi_1 + \\pi_2 = 1$ denklem sistemi çözülür:\n\n$$-0.20 \\pi_1 + 0.30 \\pi_2 = 0 \\implies 2 \\pi_1 = 3 \\pi_2 \\implies \\pi_1 = 0.60, \\quad \\pi_2 = 0.40$$";
      l.questions[0].prompt.tr = "$P = \\begin{bmatrix} 0.80 & 0.20 \\\\ 0.30 & 0.70 \\end{bmatrix}$ matrisinde 1. durumun durağan denge olasılığı $\\pi_1$ kaçtır?";
      l.questions[0].prompt.en = "In matrix $P = \\begin{bmatrix} 0.80 & 0.20 \\\\ 0.30 & 0.70 \\end{bmatrix}$, what is the stationary probability $\\pi_1$?";
      l.questions[0].explanation.tr = "$$\\boldsymbol{\\pi} P = \\boldsymbol{\\pi} \\implies 0.8 \\pi_1 + 0.3(1 - \\pi_1) = \\pi_1 \\implies 0.3 = 0.5 \\pi_1 \\implies \\pi_1 = 0.60$$";
      l.questions[0].explanation.en = "$$\\boldsymbol{\\pi} P = \\boldsymbol{\\pi} \\implies 0.8 \\pi_1 + 0.3(1 - \\pi_1) = \\pi_1 \\implies 0.3 = 0.5 \\pi_1 \\implies \\pi_1 = 0.60$$";
    }
    if (l.id === 'm12-l4') {
      l.conceptCard.tr = "Yutucu Durum (Absorbing State), bir kez girildiğinde bir daha çıkılamayan durumdur ($p_{ii} = 1$). Geçiş matrisi kanonik forma ayrıştırıldığında:\n\n$$P = \\begin{bmatrix} Q & R \\\\ 0 & I \\end{bmatrix}$$\n\nTemel Matris (Fundamental Matrix): $N = (I - Q)^{-1}$. Yutulmaya kadar geçen ortalama adım sayısı vektörü $\\mathbf{t} = N \\mathbf{1}$ formülü ile elde edilir.";
      l.conceptCard.en = "An absorbing state has $p_{ii} = 1$. The transition matrix in canonical form is $P = \\begin{bmatrix} Q & R \\\\ 0 & I \\end{bmatrix}$. Fundamental matrix is $N = (I - Q)^{-1}$ and mean absorption time is $\\mathbf{t} = N \\mathbf{1}$.";
      l.questions[0].prompt.tr = "Yutucu durumun (absorbing state) matematiksel temel koşulu nedir?";
      l.questions[0].prompt.en = "What is the defining condition of an absorbing state?";
      l.questions[0].explanation.tr = "Durumdan çıkış olasılığı $0$, durumun kendi içinde kalma olasılığı $p_{ii} = 1$'dir.";
      l.questions[0].explanation.en = "The probability of transitioning to itself is $p_{ii} = 1$.";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm12-case-1') {
      c.businessQuestion.tr = "CloudPulse $100,000$ aktif kullanıcı için müşteri sadakat modelini analiz etmektedir. Kullanıcıların her ay aktif kalma olasılığı $0.80$, inaktif olma olasılığı $0.20$'dir. İnaktif bir kullanıcının geri dönme olasılığı $0.05$'tir ($P = \\begin{bmatrix} 0.80 & 0.20 \\\\ 0.05 & 0.95 \\end{bmatrix}$). Uzun vadeli durağan denge olasılığı $\\pi_{\\text{aktif}} = 0.20$ olduğuna göre uzun vadede aktif kalacak kullanıcı sayısını hesaplayınız.";
      setStepTr(c, 0, "1. Adım: Durağan denge vektörü denklemi: $$\\boldsymbol{\\pi} P = \\boldsymbol{\\pi} \\implies 0.80 \\pi_1 + 0.05 \\pi_2 = \\pi_1 \\implies 0.05 \\pi_2 = 0.20 \\pi_1 \\implies \\pi_2 = 4 \\pi_1$$");
      setStepTr(c, 1, "2. Adım: $\\pi_1 + \\pi_2 = 1 \\implies 5 \\pi_1 = 1 \\implies \\pi_1 = 0.20 \\quad (\\%20)$");
      setStepTr(c, 2, "3. Adım: Toplam Aktif Kullanıcı: $$100,000 \\times 0.20 = 20,000 \\text{ kullanıcı}$$");
      c.solutionQuestions[0].prompt.tr = "Uzun vadede kalan aktif kullanıcı sayısı kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$100,000 \\times 0.20 = 20,000$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 13: Combinatorics & Counting Methods
// ----------------------------------------------------
updateModule('module13.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm13-l1') {
      l.conceptCard.tr = "Çarpma Kuralı (Temel Sayma İlkesi): $k$ aşamalı bir süreçte $i$. aşama $n_i$ farklı şekilde gerçekleşebiliyorsa toplam olası durum sayısı:\n\n$$N = n_1 \\times n_2 \\times \\dots \\times n_k$$\n\nFaktöriyel Fonksiyonu: $n$ elemanın yan yana dizilim sayısı $n! = n \\times (n-1) \\times \\dots \\times 2 \\times 1$'dir ($0! = 1$).";
      l.questions[0].prompt.tr = "$5$ kişinin yan yana düz bir sıraya dizilme olası farklı şekil sayısı ($5!$) kaçtır?";
      l.questions[0].explanation.tr = "$$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$$";
    }
    if (l.id === 'm13-l2') {
      l.conceptCard.tr = "Permütasyon $P(n, k)$, $n$ farklı eleman arasından $k$ elemanın sırası gözetilerek yapılan diziliş sayısıdır:\n\n$$P(n, k) = \\frac{n!}{(n-k)!} = n(n-1)\\dots(n-k+1)$$\n\nTekrarlı Permütasyon: $n$ elemandan $n_1, n_2, \\dots, n_k$ tanesi özdeş ise dizilim sayısı $\\frac{n!}{n_1! n_2! \\dots n_k!}$'dir.";
      l.questions[0].prompt.tr = "$P(6, 2) = \\frac{6!}{(6-2)!}$ permütasyon değeri kaçtır?";
      l.questions[0].explanation.tr = "$$P(6, 2) = \\frac{6!}{4!} = 6 \\times 5 = 30$$";
    }
    if (l.id === 'm13-l3') {
      l.conceptCard.tr = "Kombinasyon $\\binom{n}{k}$, $n$ elemanlı bir kümeden seçilecek $k$ elemanlı sırasız alt kümelerin sayısıdır:\n\n$$\\binom{n}{k} = C(n, k) = \\frac{n!}{k!(n-k)!}$$\n\nSimetri Özelliği: $\\binom{n}{k} = \\binom{n}{n-k}$ ve Toplam Özelliği: $\\sum_{k=0}^{n} \\binom{n}{k} = 2^n$.";
      l.questions[0].prompt.tr = "$\\binom{5}{2} = C(5, 2)$ kombinasyon değeri kaçtır?";
      l.questions[0].explanation.tr = "$$\\binom{5}{2} = \\frac{5 \\times 4}{2 \\times 1} = 10$$";
    }
    if (l.id === 'm13-l4') {
      l.conceptCard.tr = "Binom Teoremi ve Pascal Özelliği:\n\n$$(x+y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k$$\n\nPascal Özdeşliği: $$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$$";
      l.questions[0].prompt.tr = "$\\binom{4}{2} + \\binom{4}{1}$ toplamı Pascal özdeşliğine göre kaça eşittir?";
      l.questions[0].explanation.tr = "$$\\binom{4}{2} + \\binom{4}{1} = 6 + 4 = 10 \\quad \\left(=\\binom{5}{2}\\right)$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm13-case-1') {
      c.solutionQuestions[0].prompt.tr = "$4$ elemanlı bir kümeden seçilecek $2$ elemanlı alt küme sayısı $\\binom{4}{2}$ kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$\\binom{4}{2} = \\frac{4 \\times 3}{2 \\times 1} = 6$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 14: Conditional Probability & Bayes Theorem
// ----------------------------------------------------
updateModule('module14.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm14-l1') {
      l.conceptCard.tr = "Koşullu Olasılık ve Olayların Bağımsızlığı:\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\qquad P(B) > 0$$\n\n$A$ ve $B$ bağımsız ise $P(A \\mid B) = P(A)$ ve $P(A \\cap B) = P(A) \\cdot P(B)$ sağlanır.";
      l.questions[0].prompt.tr = "$P(A \\cap B) = 0.12$ ve $P(B) = 0.40$ ise koşullu olasılık $P(A \\mid B)$ kaçtır?";
      l.questions[0].explanation.tr = "$$P(A \\mid B) = \\frac{0.12}{0.40} = 0.30$$";
    }
    if (l.id === 'm14-l2') {
      l.conceptCard.tr = "Toplam Olasılık Yasası, örneklem uzayını bölen $B_1, \\dots, B_n$ ayrık olaylar ailesi için marjinal olasılığı ağırlıklandırır:\n\n$$P(A) = \\sum_{i=1}^{n} P(A \\mid B_i) \\cdot P(B_i)$$";
      l.questions[0].prompt.tr = "İki grubun ağırlıkları $\\%70$ ($0.70$) ve $\\%30$ ($0.30$), başarı oranları ise $\\%80$ ($0.80$) ve $\\%50$ ($0.50$) ise toplam başarı oranı yüzde kaçtır?";
      l.questions[0].explanation.tr = "$$P(A) = (0.70)(0.80) + (0.30)(0.50) = 0.56 + 0.15 = 0.71 \\quad (\\%71)$$";
    }
    if (l.id === 'm14-l3') {
      l.conceptCard.tr = "Bayes Teoremi, önsel olasılığı (prior) kanıt ile güncelleyerek sonsal olasılığı (posterior) verir:\n\n$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)} = \\frac{P(B \\mid A) \\cdot P(A)}{\\sum P(B \\mid A_i) P(A_i)}$$";
      l.questions[0].prompt.tr = "$P(A) = 0.10$, $P(B \\mid A) = 0.80$ ve $P(B) = 0.20$ ise $P(A \\mid B)$ kaçtır?";
      l.questions[0].explanation.tr = "$$P(A \\mid B) = \\frac{0.80 \\times 0.10}{0.20} = \\frac{0.08}{0.20} = 0.40$$";
    }
    if (l.id === 'm14-l4') {
      l.conceptCard.tr = "Taban Oran Yanılsaması (Base Rate Fallacy): Önsel yaygınlığı çok düşük olan ($P(D) \\ll 1$) nadir durumlarda, testin hassasiyeti yüksek olsa dahi pozitif test sonucunun gerçek pozitif olma olasılığı (PPV) düşük çıkabilir:\n\n$$\\text{PPV} = P(D \\mid +) = \\frac{P(+ \\mid D)P(D)}{P(+ \\mid D)P(D) + P(+ \\mid D^c)P(D^c)}$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm14-case-1') {
      setStepTr(c, 0, "1. Adım: Toplam Alarm Olasılığı: $$P(\\text{Alarm}) = (0.90)(0.01) + (0.10)(0.99) = 0.009 + 0.099 = 0.108$$");
      setStepTr(c, 1, "2. Adım: Bayes Formülü: $$P(\\text{Sızma} \\mid \\text{Alarm}) = \\frac{0.009}{0.108} = 0.0833 \\quad (\\%8.33)$$");
      c.solutionQuestions[0].prompt.tr = "$P(\\text{Sızma} \\mid \\text{Alarm})$ yüzde kaçtır (en yakın tam sayı)?";
      c.solutionQuestions[0].explanation.tr = "$$\\frac{0.009}{0.108} \\approx \\%8.33 \\implies 8$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 15: Poisson Processes & Rare Events
// ----------------------------------------------------
updateModule('module15.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm15-l1') {
      l.conceptCard.tr = "Poisson Dağılımı $X \\sim \\text{Poisson}(\\lambda)$, belirli bir zaman veya alan diliminde meydana gelen bağımsız nadir olayları modeller:\n\n$$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\qquad k = 0, 1, 2, \\dots$$\n\nEn önemli teorik özelliği: $\\mathbb{E}[X] = \\text{Var}(X) = \\lambda$ olmasıdır.";
      l.questions[0].prompt.tr = "Ortalaması $\\lambda = 5$ olan bir Poisson dağılımının varyansı $\\text{Var}(X)$ kaçtır?";
      l.questions[0].explanation.tr = "$$\\text{Var}(X) = \\lambda = 5$$";
    }
    if (l.id === 'm15-l2') {
      l.conceptCard.tr = "Poisson sürecinde ardışık iki olay arasındaki bekleme süresi $T$, $\\lambda$ parametreli Üstel Dağılıma ($T \\sim \\text{Exp}(\\lambda)$) uyar:\n\n$$f(t) = \\lambda e^{-\\lambda t}, \\qquad \\mathbb{E}[T] = \\frac{1}{\\lambda}$$\n\nÜstel dağılımın en belirgin özelliği Hafızasızlık (Memorylessness) özelliğidir: $P(T > s + t \\mid T > s) = P(T > t)$.";
      l.questions[0].prompt.tr = "Dakikada ortalama $\\lambda = 2$ çağrı gelen bir çağrı merkezinde ortalama bekleme süresi $\\mathbb{E}[T] = \\frac{1}{\\lambda}$ kaç saniyedir?";
      l.questions[0].explanation.tr = "$$\\mathbb{E}[T] = \\frac{1}{2} \\text{ dk} = 30 \\text{ saniye}$$";
    }
    if (l.id === 'm15-l3') {
      l.conceptCard.tr = "Binom-Poisson Yaklaşımı: $n \\ge 20$ büyük ve $p \\le 0.05$ küçük olduğunda $\\text{Bin}(n, p)$ dağılımı $\\lambda = n p$ olan $\\text{Poisson}(\\lambda)$ dağılımı ile modellenir:\n\n$$\\lim_{n \\to \\infty, np=\\lambda} \\binom{n}{k} p^k (1-p)^{n-k} = \\frac{\\lambda^k e^{-\\lambda}}{k!}$$";
      l.questions[0].prompt.tr = "$n = 1000$ ve $p = 0.004$ için Poisson yaklaşım parametresi $\\lambda = n p$ kaçtır?";
      l.questions[0].explanation.tr = "$$\\lambda = 1000 \\times 0.004 = 4$$";
    }
    if (l.id === 'm15-l4') {
      l.conceptCard.tr = "Poisson Süreçlerinde Toplanabilirlik: İki bağımsız Poisson süreci (oranları $\\lambda_1$ ve $\\lambda_2$) birleştiğinde toplam olay süreci de $\\lambda = \\lambda_1 + \\lambda_2$ olan bir Poisson sürecidir:\n\n$$N(t) = N_1(t) + N_2(t) \\sim \\text{Poisson}((\\lambda_1 + \\lambda_2)t)$$";
      l.questions[0].prompt.tr = "$\\lambda_1 = 3/\\text{sn}$ ve $\\lambda_2 = 4/\\text{sn}$ olan iki bağımsız Poisson sürecinin birleşik varış oranı $\\lambda$ kaçtır?";
      l.questions[0].explanation.tr = "$$\\lambda = 3 + 4 = 7$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm15-case-1') {
      setStepTr(c, 0, "1. Adım: $P(X = 0) = \\frac{2^0 e^{-2}}{0!} = e^{-2} \\approx 0.1353 \\quad (\\%13.53)$");
      setStepTr(c, 1, "2. Adım: $P(X \\ge 1) = 1 - P(X = 0) = 1 - 0.1353 = 0.8647 \\quad (\\%86.47)$");
      c.solutionQuestions[0].prompt.tr = "$P(X \\ge 1)$ yüzdesi en yakın tam sayı olarak kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$1 - 0.1353 = 0.8647 \\approx \\%87 \\implies 87$$";
    }
  });
});

// ----------------------------------------------------
// MODULE 16: Continuous Probability Distributions
// ----------------------------------------------------
updateModule('module16.json', (data) => {
  data.lessons.forEach(l => {
    if (l.id === 'm16-l1') {
      l.conceptCard.tr = "Sürekli rastgele değişkenlerde tek bir noktanın olasılığı $P(X = x) = 0$'dır; olasılık belirli bir aralıktaki yoğunluk fonksiyonunun integrali ile hesaplanır:\n\n$$P(a \\le X \\le b) = \\int_{a}^{b} f(x)\\,dx, \\qquad \\int_{-\\infty}^{\\infty} f(x)\\,dx = 1$$\n\nSürekli Düzgün Dağılım $X \\sim \\mathcal{U}(a, b)$ için Yoğunluk Fonksiyonu (PDF):\n\n$$f(x) = \\begin{cases} \\frac{1}{b - a}, & a \\le x \\le b \\\\[4pt] 0, & \\text{diğer} \\end{cases}$$\n\nBeklenen değer $\\mathbb{E}[X] = \\frac{a + b}{2}$ ve varyans $\\text{Var}(X) = \\frac{(b - a)^2}{12}$'dir.";
      l.conceptCard.en = "For continuous random variables, point probability is $P(X=x) = 0$; probability is an integral:\n\n$$P(a \\le X \\le b) = \\int_{a}^{b} f(x)\\,dx$$\n\nContinuous Uniform $\\mathcal{U}(a, b)$ has $f(x) = \\frac{1}{b - a}, \\mathbb{E}[X] = \\frac{a+b}{2}, \\text{Var}(X) = \\frac{(b-a)^2}{12}$.";
      l.questions[0].prompt.tr = "$\\mathcal{U}(0, 20)$ sürekli düzgün dağılımında $P(5 \\le X \\le 15)$ olasılığı $\\int_{5}^{15} \\frac{1}{20}\\,dx$ kaçtır?";
      l.questions[0].prompt.en = "In uniform distribution $\\mathcal{U}(0, 20)$, what is $P(5 \\le X \\le 15)$?";
      l.questions[0].explanation.tr = "$$P(5 \\le X \\le 15) = \\int_{5}^{15} \\frac{1}{20}\\,dx = \\frac{15 - 5}{20 - 0} = \\frac{10}{20} = 0.50$$";
      l.questions[0].explanation.en = "$$P(5 \\le X \\le 15) = \\frac{15 - 5}{20} = 0.50$$";
    }
    if (l.id === 'm16-l2') {
      l.conceptCard.tr = "Normal Dağılım $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, ortalama $\\mu$ etrafında simetrik çan eğrisi formunda sürekli bir olasılık dağılımıdır:\n\n$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$\n\nEmpirik Kural (68-95-99.7):\n\n$$\\begin{aligned} P(\\mu - \\sigma \\le X \\le \\mu + \\sigma) &\\approx \\%68.27 \\\\[4pt] P(\\mu - 2\\sigma \\le X \\le \\mu + 2\\sigma) &\\approx \\%95.45 \\\\[4pt] P(\\mu - 3\\sigma \\le X \\le \\mu + 3\\sigma) &\\approx \\%99.73 \\end{aligned}$$";
      l.questions[0].prompt.tr = "$\\mathcal{N}(100, 15^2)$ dağılımında verilerin yaklaşık $\\%68$'inin bulunduğu $\\mu \\pm \\sigma$ aralığının alt sınırı ($\\mu - \\sigma$) kaçtır?";
      l.questions[0].explanation.tr = "$$\\text{Alt Sınır} = \\mu - \\sigma = 100 - 15 = 85$$";
    }
    if (l.id === 'm16-l3') {
      l.conceptCard.tr = "Standart Normal Dağılım $Z \\sim \\mathcal{N}(0, 1)$:\n\n$$Z = \\frac{X - \\mu}{\\sigma}$$\n\nZ-skoru, bir gözlemin ortalamadan kaç standart sapma ($\\sigma$) uzakta olduğunu standartlaştırır.";
      l.questions[0].prompt.tr = "$\\mu = 50$, $\\sigma = 10$ olan bir dağılımda $X = 75$ için Z-skoru ($Z = \\frac{X - \\mu}{\\sigma}$) kaçtır?";
      l.questions[0].explanation.tr = "$$Z = \\frac{75 - 50}{10} = \\frac{25}{10} = 2.5$$";
    }
    if (l.id === 'm16-l4') {
      l.conceptCard.tr = "Kümülatif Dağılım Fonksiyonu (CDF), $X$'in belirli bir $x$ değerine kadar biriken toplam olasılığıdır:\n\n$$F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(t)\\,dt, \\qquad f(x) = \\frac{d}{dx}F(x)$$\n\nİki nokta arasındaki alan: $$P(a \\le X \\le b) = F(b) - F(a)$$";
      l.questions[0].prompt.tr = "$F(50) = 0.85$ ve $F(20) = 0.15$ ise $P(20 \\le X \\le 50) = F(50) - F(20)$ kaçtır?";
      l.questions[0].explanation.tr = "$$P(20 \\le X \\le 50) = 0.85 - 0.15 = 0.70$$";
    }
  });

  data.caseExams.forEach(c => {
    if (c.id === 'm16-case-1') {
      setStepTr(c, 0, "1. Adım: Z-Skoru: $$Z = \\frac{160 - 100}{20} = \\frac{60}{20} = 3.0$$");
      setStepTr(c, 1, "2. Adım: Değerlendirme: $Z = +3.0$ değeri $\\%99.7$ empirik güven aralığının sınırında olup anomali (brute force siber saldırı) alarmı üretir.");
      c.solutionQuestions[0].prompt.tr = "Tespit edilen IP adresi için Z-skoru kaçtır?";
      c.solutionQuestions[0].explanation.tr = "$$Z = \\frac{160 - 100}{20} = 3.0$$";
    }
  });
});

console.log('ALL MODULES 1 to 16 SUCCESSFULLY UPGRADED WITH ACADEMIC LATEX & KATEX!');
