import { Question, LocalizedText } from '../types/stats';

export interface PlacementQuestion extends Question {
  targetModuleId: string;
  targetModuleOrder: number;
  topicTitle: LocalizedText;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'pq-1',
    targetModuleId: 'module-13',
    targetModuleOrder: 1,
    topicTitle: {
      tr: 'Kombinatorik & Temel Sayma Yöntemleri',
      en: 'Combinatorics & Counting Principles',
    },
    type: 'multiple_choice',
    prompt: {
      tr: '5 farklı mühendislik öğrencisi bir sırada yan yana oturacaktır. Belirli iki öğrencinin daima yan yana oturması istendiğinde kaç farklı sıralama yapılabilir?',
      en: '5 distinct engineering students are to sit side by side in a row. If two specific students must always sit together, how many different arrangements are possible?',
    },
    options: [
      { tr: '48', en: '48' },
      { tr: '120', en: '120' },
      { tr: '24', en: '24' },
      { tr: '60', en: '60' },
    ],
    correctAnswer: '48',
    explanation: {
      tr: 'Birlikte oturacak iki öğrenci tek bir blok kabul edilirse toplam 4 eleman 4! = 24 şekilde sıralanır. İki öğrenci de kendi içinde 2! = 2 şekilde yer değiştirebileceğinden 24 × 2 = 48 farklı dizilim elde edilir.',
      en: 'Grouping the two students as a single entity gives 4 entities to arrange in 4! = 24 ways. The two students can swap seats in 2! = 2 ways, yielding 24 × 2 = 48 total arrangements.',
    },
  },
  {
    id: 'pq-2',
    targetModuleId: 'module-2',
    targetModuleOrder: 2,
    topicTitle: {
      tr: 'Olasılık Aksiyomları & Bağımsız Olaylar',
      en: 'Probability Axioms & Independence',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Bir kalite kontrol hattında üretilen parçaların elektriksel arızalı olma olasılığı $P(A) = 0.30$, mekanik arızalı olma olasılığı $P(B) = 0.20$\'dir. İki arıza bağımsız olduğuna göre, bir parçanın en az bir arızaya sahip olma olasılığı $P(A \\cup B)$ nedir?',
      en: 'On a production line, the probability of an electrical defect is $P(A) = 0.30$ and mechanical defect is $P(B) = 0.20$. If the two defects are independent, what is the probability of having at least one defect $P(A \\cup B)$?',
    },
    options: [
      { tr: '0.44', en: '0.44' },
      { tr: '0.50', en: '0.50' },
      { tr: '0.06', en: '0.06' },
      { tr: '0.56', en: '0.56' },
    ],
    correctAnswer: '0.44',
    explanation: {
      tr: 'Bağımsız olaylarda kesişim $P(A \\cap B) = P(A) \\times P(B) = 0.30 \\times 0.20 = 0.06$\'dır. Toplam kuralı: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.30 + 0.20 - 0.06 = 0.44$.',
      en: 'For independent events, $P(A \\cap B) = P(A) \\times P(B) = 0.30 \\times 0.20 = 0.06$. Inclusion-Exclusion formula: $P(A \\cup B) = 0.30 + 0.20 - 0.06 = 0.44$.',
    },
  },
  {
    id: 'pq-3',
    targetModuleId: 'module-14',
    targetModuleOrder: 3,
    topicTitle: {
      tr: 'Koşullu Olasılık & Bayes Teoremi',
      en: 'Conditional Probability & Bayes Theorem',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Bir üretim partisinde kusurlu parça oranı %1\'dir ($P(D) = 0.01$). Test cihazı bozuk parçalara %90 doğrulukla pozitif sinyal vermekte ($P(+|D) = 0.90$), sağlam parçalarda ise %5 oranında yalancı pozitif alarm üretmektedir ($P(+|D\') = 0.05$). Cihaz pozitif alarm verdiğinde parçanın gerçekten kusurlu olma olasılığı $P(D|+)$ yaklaşık kaçtır?',
      en: 'In a component lot, 1% of units are defective ($P(D) = 0.01$). A test sensor correctly triggers positive on defective items with 90% sensitivity ($P(+|D) = 0.90$) and has a 5% false positive rate on intact units ($P(+|D\') = 0.05$). Given a positive alarm, what is the posterior probability $P(D|+)$ that the component is truly defective?',
    },
    options: [
      { tr: 'Yaklaşık %15.4', en: 'Approx. 15.4%' },
      { tr: 'Yaklaşık %90.0', en: 'Approx. 90.0%' },
      { tr: 'Yaklaşık %50.0', en: 'Approx. 50.0%' },
      { tr: 'Yaklaşık %1.0', en: 'Approx. 1.0%' },
    ],
    correctAnswer: 'Yaklaşık %15.4',
    explanation: {
      tr: 'Bayes Teoremi: $P(D|+) = \\frac{0.01 \\times 0.90}{(0.01 \\times 0.90) + (0.99 \\times 0.05)} = \\frac{0.009}{0.009 + 0.0495} = \\frac{0.009}{0.0585} \\approx 0.1538$ (%15.4).',
      en: 'Bayes\' Theorem: $P(D|+) = \\frac{0.01 \\times 0.90}{(0.01 \\times 0.90) + (0.99 \\times 0.05)} = \\frac{0.009}{0.0585} \\approx 15.4%$.',
    },
  },
  {
    id: 'pq-4',
    targetModuleId: 'module-3',
    targetModuleOrder: 4,
    topicTitle: {
      tr: 'Kesikli Dağılımlar & Binom Modeli',
      en: 'Discrete Distributions & Binomial Model',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Her bir denemede başarı olasılığı $p = 0.10$ olan $n = 3$ bağımsız Bernoulli denemesinde tam olarak 1 başarı elde etme olasılığı $P(X = 1)$ nedir?',
      en: 'In $n = 3$ independent Bernoulli trials with single-trial success probability $p = 0.10$, what is the probability of getting exactly 1 success $P(X = 1)$?',
    },
    options: [
      { tr: '0.243', en: '0.243' },
      { tr: '0.081', en: '0.081' },
      { tr: '0.300', en: '0.300' },
      { tr: '0.729', en: '0.729' },
    ],
    correctAnswer: '0.243',
    explanation: {
      tr: 'Binom dağılımı formülü: $P(X = 1) = \\binom{3}{1} (0.10)^1 (0.90)^2 = 3 \\times 0.10 \\times 0.81 = 0.243$.',
      en: 'Binomial formula: $P(X = 1) = \\binom{3}{1} (0.10)^1 (0.90)^2 = 3 \\times 0.10 \\times 0.81 = 0.243$.',
    },
  },
  {
    id: 'pq-5',
    targetModuleId: 'module-15',
    targetModuleOrder: 5,
    topicTitle: {
      tr: 'Poisson Süreci & Üstel Bekleme Süresi',
      en: 'Poisson Process & Exponential Waiting Times',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Bir müşteri hizmetleri santraline dakikada ortalama $\\lambda = 2$ çağrı gelmektedir (Poisson süreci). Bir çağrı geldikten sonra bir sonraki çağrının 1 dakikadan daha uzun süre sonra gelme olasılığı $P(T > 1)$ nedir?',
      en: 'A customer support line receives incoming calls at rate $\\lambda = 2$ per minute according to a Poisson process. What is the probability that the interarrival time until the next call exceeds 1 minute $P(T > 1)$?',
    },
    options: [
      { tr: 'e⁻²', en: 'e⁻²' },
      { tr: '1 - e⁻²', en: '1 - e⁻²' },
      { tr: '2 e⁻²', en: '2 e⁻²' },
      { tr: 'e⁻¹', en: 'e⁻¹' },
    ],
    correctAnswer: 'e⁻²',
    explanation: {
      tr: 'Poisson sürecinde olaylar arasındaki bekleme süresi $T \\sim \\text{Exp}(\\lambda)$ dağılımına uyar ve $P(T > t) = e^{-\\lambda t}$ formülüyle hesaplanır. $t = 1$ için $P(T > 1) = e^{-2 \\times 1} = e^{-2}$.',
      en: 'For a Poisson process, interarrival time follows an Exponential distribution $T \\sim \\text{Exp}(\\lambda)$, so $P(T > t) = e^{-\\lambda t}$. For $t = 1$, $P(T > 1) = e^{-2 \\times 1} = e^{-2}$.',
    },
  },
  {
    id: 'pq-6',
    targetModuleId: 'module-4',
    targetModuleOrder: 6,
    topicTitle: {
      tr: 'Beklenen Değer, Varyans & Doğrusal Dönüşüm',
      en: 'Expected Value, Variance & Linear Transformation',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Bir rastgele değişken $X$ için $E[X] = 5$ ve $Var(X) = 4$ olarak hesaplanmıştır. $Y = 3X - 2$ yeni değişkeni tanımlandığında $Var(Y)$ değeri ne olur?',
      en: 'For a random variable $X$, $E[X] = 5$ and $Var(X) = 4$. If we define $Y = 3X - 2$, what is the variance $Var(Y)$?',
    },
    options: [
      { tr: '36', en: '36' },
      { tr: '12', en: '12' },
      { tr: '10', en: '10' },
      { tr: '34', en: '34' },
    ],
    correctAnswer: '36',
    explanation: {
      tr: 'Varyans dönüşüm kuralı $Var(aX + b) = a^2 Var(X)$\'tir. Sabit kaydırma varyansı değiştirmez: $Var(3X - 2) = 3^2 \\times 4 = 9 \\times 4 = 36$.',
      en: 'Variance scaling rule states $Var(aX + b) = a^2 Var(X)$. Constants do not affect variance: $Var(3X - 2) = 3^2 \\times 4 = 9 \\times 4 = 36$.',
    },
  },
  {
    id: 'pq-7',
    targetModuleId: 'module-16',
    targetModuleOrder: 7,
    topicTitle: {
      tr: 'Sürekli Dağılımlar & Olasılık Yoğunluk Fonksiyonu (PDF)',
      en: 'Continuous Distributions & PDF Normalization',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Sürekli bir $X$ rastgele değişkeninin PDF\'i $0 \\le x \\le 2$ aralığında $f(x) = c \\cdot x$ olarak verilmiştir. $f(x)$\'in geçerli bir olasılık yoğunluk fonksiyonu olabilmesi için $c$ katsayısı kaç olmalıdır?',
      en: 'The PDF of a continuous random variable $X$ is defined as $f(x) = c \\cdot x$ over the interval $0 \\le x \\le 2$. For $f(x)$ to be a valid probability density function, what must constant $c$ be?',
    },
    options: [
      { tr: '0.5', en: '0.5' },
      { tr: '1.0', en: '1.0' },
      { tr: '0.25', en: '0.25' },
      { tr: '2.0', en: '2.0' },
    ],
    correctAnswer: '0.5',
    explanation: {
      tr: 'PDF altındaki toplam alan 1\'e eşit olmalıdır: $\\int_0^2 c x \\, dx = c \\left[ \\frac{x^2}{2} \\right]_0^2 = c \\times 2 = 1 \\implies c = 0.5$.',
      en: 'Total area under the PDF must equal 1: $\\int_0^2 c x \\, dx = c [x^2/2]_0^2 = 2c = 1 \\implies c = 0.5$.',
    },
  },
  {
    id: 'pq-8',
    targetModuleId: 'module-3',
    targetModuleOrder: 8,
    topicTitle: {
      tr: 'Normal Dağılım & Ampirik Kural (Empirical Rule)',
      en: 'Normal Distribution & Empirical Rule',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Ortalaması $\\mu = 100$ ve standart sapması $\\sigma = 15$ olan normal dağılıma sahip bir süreçte, rastgele bir gözlemin 70 ile 130 arasında yer alma olasılığı $P(70 \\le X \\le 130)$ yaklaşık yüzde kaçtır?',
      en: 'In a process following a normal distribution with mean $\\mu = 100$ and standard deviation $\\sigma = 15$, what is the approximate probability $P(70 \\le X \\le 130)$ according to the Empirical Rule?',
    },
    options: [
      { tr: '%95.4', en: '95.4%' },
      { tr: '%68.3', en: '68.3%' },
      { tr: '%99.7', en: '99.7%' },
      { tr: '%50.0', en: '50.0%' },
    ],
    correctAnswer: '%95.4',
    explanation: {
      tr: 'Aralık $\\mu \\pm 2\\sigma = 100 \\pm 30 = [70, 130]$ şeklindedir. Normal dağılımda ortalamadan 2 standart sapma aralığı verilerin yaklaşık %95.4\'ünü kapsar.',
      en: 'The interval is $\\mu \\pm 2\\sigma = 100 \\pm 30 = [70, 130]$. The 2-sigma interval under a normal curve encompasses approx. 95.4% of probability mass.',
    },
  },
  {
    id: 'pq-9',
    targetModuleId: 'module-12',
    targetModuleOrder: 9,
    topicTitle: {
      tr: 'Markov Zincirleri & 2-Adımlı Geçiş Olasılığı',
      en: 'Markov Chains & 2-Step Transition Probability',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'İki durumlu (1: Güneşli, 2: Yağmurlu) bir Markov zincirinde geçiş matrisi verilmiştir: Güneşli günden Güneşli güne geçiş $0.80$, Yağmurlu günden Güneşli güne geçiş $0.40$\'tır. Bugün hava Yağmurlu olduğuna göre 2 gün sonra havanın Güneşli olma olasılığı nedir?',
      en: 'In a 2-state Markov chain (1: Sunny, 2: Rainy), transition probabilities to Sunny are: $P(\\text{Sun} \\to \\text{Sun}) = 0.80$ and $P(\\text{Rain} \\to \\text{Sun}) = 0.40$. If today is Rainy, what is the probability that it is Sunny 2 days later?',
    },
    options: [
      { tr: '0.56', en: '0.56' },
      { tr: '0.48', en: '0.48' },
      { tr: '0.64', en: '0.64' },
      { tr: '0.32', en: '0.32' },
    ],
    correctAnswer: '0.56',
    explanation: {
      tr: 'Chapman-Kolmogorov / Toplam olasılık: Yağmur -> Güneş -> Güneş ($0.40 \\times 0.80 = 0.32$) + Yağmur -> Yağmur -> Güneş ($0.60 \\times 0.40 = 0.24$). Toplam = $0.32 + 0.24 = 0.56$.',
      en: 'Total probability across 2 paths: Rain -> Sun -> Sun ($0.40 \\times 0.80 = 0.32$) + Rain -> Rain -> Sun ($0.60 \\times 0.40 = 0.24$). Total = $0.32 + 0.24 = 0.56$.',
    },
  },
  {
    id: 'pq-10',
    targetModuleId: 'module-2',
    targetModuleOrder: 10,
    topicTitle: {
      tr: 'Ortak Dağılımlar & Kovaryans Özellikleri',
      en: 'Joint Distributions & Covariance Properties',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'İki rastgele değişken $X$ ve $Y$ bağımsız ise, kovaryansları $Cov(X, Y)$ ve korelasyon katsayıları $\\rho_{X,Y}$ için hangisi daima doğrudur?',
      en: 'If two random variables $X$ and $Y$ are statistically independent, which of the following is always true regarding their covariance $Cov(X, Y)$ and correlation $\\rho_{X,Y}$?',
    },
    options: [
      { tr: 'Cov(X, Y) = 0 ve ρ = 0', en: 'Cov(X, Y) = 0 and ρ = 0' },
      { tr: 'Cov(X, Y) = 1 ve ρ = 1', en: 'Cov(X, Y) = 1 and ρ = 1' },
      { tr: 'Cov(X, Y) = E[X] × E[Y]', en: 'Cov(X, Y) = E[X] × E[Y]' },
      { tr: 'Cov(X, Y) = Var(X) + Var(Y)', en: 'Cov(X, Y) = Var(X) + Var(Y)' },
    ],
    correctAnswer: 'Cov(X, Y) = 0 ve ρ = 0',
    explanation: {
      tr: 'Bağımsız değişkenlerde $E[XY] = E[X]E[Y]$ olduğundan $Cov(X, Y) = E[XY] - E[X]E[Y] = 0$\'dır. Dolayısıyla korelasyon katsayısı $\\rho_{X,Y} = 0$\'dır.',
      en: 'Since independence implies $E[XY] = E[X]E[Y]$, covariance $Cov(X, Y) = E[XY] - E[X]E[Y] = 0$, leading to correlation $\\rho_{X,Y} = 0$.',
    },
  },
];
