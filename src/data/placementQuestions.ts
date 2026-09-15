import { Question, LocalizedText } from '../types/stats';

export interface PlacementQuestion extends Question {
  targetModuleId: string;
  targetModuleOrder: number;
  topicTitle: LocalizedText;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'pq-1',
    targetModuleId: 'module-1',
    targetModuleOrder: 1,
    topicTitle: {
      tr: 'Temel İstatistik & Merkezi Eğilim',
      en: 'Descriptive Stats & Central Tendency',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Bir veri kümesinde aşırı uç değerlerden (outliers) EN AZ etkilenen merkezi eğilim ölçüsü hangisidir?',
      en: 'Which measure of central tendency is LEAST affected by extreme outliers in a dataset?',
    },
    options: [
      { tr: 'Aritmetik Ortalama (Mean)', en: 'Arithmetic Mean' },
      { tr: 'Medyan (Ortanca)', en: 'Median' },
      { tr: 'Varyans (Variance)', en: 'Variance' },
      { tr: 'Standart Sapma (Standard Deviation)', en: 'Standard Deviation' },
    ],
    correctAnswer: 'Medyan (Ortanca)',
    explanation: {
      tr: 'Medyan, verileri sıraladığımızda tam ortadaki değerdir ve aşırı uç değerlerden etkilenmez.',
      en: 'Median is the middle value when sorted and is robust against extreme outliers.',
    },
  },
  {
    id: 'pq-2',
    targetModuleId: 'module-2',
    targetModuleOrder: 2,
    topicTitle: {
      tr: 'Olasılık Temelleri & Bağımsız Olaylar',
      en: 'Probability Fundamentals & Independent Events',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'İki bağımsız olay olan A ve B için P(A) = 0.4 ve P(B) = 0.5 ise, ikisinin de aynı anda gerçekleşme olasılığı P(A ∩ B) nedir?',
      en: 'If A and B are independent events with P(A) = 0.4 and P(B) = 0.5, what is P(A ∩ B)?',
    },
    options: [
      { tr: '0.90', en: '0.90' },
      { tr: '0.20', en: '0.20' },
      { tr: '0.10', en: '0.10' },
      { tr: '0.50', en: '0.50' },
    ],
    correctAnswer: '0.20',
    explanation: {
      tr: 'Bağımsız olaylarda P(A ∩ B) = P(A) × P(B) = 0.4 × 0.5 = 0.20 bağıntısı geçerlidir.',
      en: 'For independent events, P(A ∩ B) = P(A) × P(B) = 0.4 × 0.5 = 0.20.',
    },
  },
  {
    id: 'pq-3',
    targetModuleId: 'module-3',
    targetModuleOrder: 3,
    topicTitle: {
      tr: 'Olasılık Dağılımları & Normal Dağılım',
      en: 'Probability Distributions & Normal Distribution',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Standart Normal Dağılımda (Z Dağılımı) ortalama (μ) ve standart sapma (σ) değerleri sırasıyla kaçtır?',
      en: 'In a Standard Normal Distribution (Z distribution), what are the mean (μ) and standard deviation (σ)?',
    },
    options: [
      { tr: 'μ = 0, σ = 1', en: 'μ = 0, σ = 1' },
      { tr: 'μ = 1, σ = 0', en: 'μ = 1, σ = 0' },
      { tr: 'μ = 100, σ = 15', en: 'μ = 100, σ = 15' },
      { tr: 'μ = 0.5, σ = 0.5', en: 'μ = 0.5, σ = 0.5' },
    ],
    correctAnswer: 'μ = 0, σ = 1',
    explanation: {
      tr: 'Standart normal dağılımın ortalaması 0, standart sapması ise tam olarak 1 kabul edilir.',
      en: 'Standard normal distribution has a mean of 0 and standard deviation of 1.',
    },
  },
  {
    id: 'pq-4',
    targetModuleId: 'module-4',
    targetModuleOrder: 4,
    topicTitle: {
      tr: 'Örnekleme & Merkezi Limit Teoremi',
      en: 'Sampling & Central Limit Theorem',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Merkezi Limit Teoremi (CLT) uyarınca, örneklem büyüklüğü (n) yeterince büyüdükçe (genellikle n ≥ 30) örneklem ortalamalarının dağılımı neye yaklaşır?',
      en: 'According to the Central Limit Theorem (CLT), as sample size (n) increases (n ≥ 30), what distribution does the sample mean approach?',
    },
    options: [
      { tr: 'Binom Dağılımı', en: 'Binomial Distribution' },
      { tr: 'Normal Dağılım', en: 'Normal Distribution' },
      { tr: 'Düzgün (Uniform) Dağılım', en: 'Uniform Distribution' },
      { tr: 'Poisson Dağılımı', en: 'Poisson Distribution' },
    ],
    correctAnswer: 'Normal Dağılım',
    explanation: {
      tr: 'CLT, ana kütle dağılımı ne olursa olsun, n arttıkça örneklem ortalamalarının Normal Dağılıma yaklaşacağını söyler.',
      en: 'CLT states sample means approach a Normal Distribution as n grows, regardless of population shape.',
    },
  },
  {
    id: 'pq-5',
    targetModuleId: 'module-5',
    targetModuleOrder: 5,
    topicTitle: {
      tr: 'Güven Aralıkları (Confidence Intervals)',
      en: 'Confidence Intervals',
    },
    type: 'multiple_choice',
    prompt: {
      tr: '%95 Güven Aralığı hesaplanırken kullanılan Z kritik değeri (z*) kaçtır?',
      en: 'What is the critical Z-value (z*) used for a 95% Confidence Interval?',
    },
    options: [
      { tr: '1.645', en: '1.645' },
      { tr: '1.96', en: '1.96' },
      { tr: '2.58', en: '2.58' },
      { tr: '3.00', en: '3.00' },
    ],
    correctAnswer: '1.96',
    explanation: {
      tr: 'Standart normal tablosunda %95 güven düzeyi için iki yönlü z kritik değeri 1.96’dır.',
      en: 'The two-tailed critical z-value for a 95% confidence interval is 1.96.',
    },
  },
  {
    id: 'pq-6',
    targetModuleId: 'module-6',
    targetModuleOrder: 6,
    topicTitle: {
      tr: 'Hipotez Testleri & p-Değeri',
      en: 'Hypothesis Testing & p-Value',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Bir A/B testinde hesaplanan p-değeri = 0.02 çıktıysa ve anlamlılık düzeyi α = 0.05 ise hangi karar verilir?',
      en: 'In an A/B test, if calculated p-value = 0.02 and significance level α = 0.05, what decision is made?',
    },
    options: [
      { tr: 'H0 (Sıfır Hipotezi) reddedilir, değişim istatistiksel olarak anlamlıdır.', en: 'Reject H0; difference is statistically significant.' },
      { tr: 'H0 reddedilemez, hiçbir fark yoktur.', en: 'Fail to reject H0; no difference.' },
      { tr: 'Test geçersiz sayılır.', en: 'Test is invalid.' },
      { tr: 'Örneklem sayısı artırılmalıdır.', en: 'Sample size must be increased.' },
    ],
    correctAnswer: 'H0 (Sıfır Hipotezi) reddedilir, değişim istatistiksel olarak anlamlıdır.',
    explanation: {
      tr: 'p-değeri (0.02) < α (0.05) olduğu için H0 reddedilir, sonuç istatistiksel olarak anlamlıdır.',
      en: 'Since p-value (0.02) < α (0.05), we reject H0; the result is statistically significant.',
    },
  },
  {
    id: 'pq-7',
    targetModuleId: 'module-7',
    targetModuleOrder: 7,
    topicTitle: {
      tr: 'Korelasyon & Doğrusal Regresyon',
      en: 'Correlation & Linear Regression',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Pearson korelasyon katsayısı r = -0.85 ise bu iki değişken arasında nasıl bir ilişki vardır?',
      en: 'If Pearson correlation r = -0.85, what is the relationship between the two variables?',
    },
    options: [
      { tr: 'Güçlü ters (negatif) yönlü doğrusal ilişki', en: 'Strong inverse (negative) linear relationship' },
      { tr: 'Zayıf pozitif yönlü ilişki', en: 'Weak positive relationship' },
      { tr: 'İlişki kesinlikle yoktur', en: 'No relationship at all' },
      { tr: 'Mükemmel pozitif ilişki', en: 'Perfect positive relationship' },
    ],
    correctAnswer: 'Güçlü ters (negatif) yönlü doğrusal ilişki',
    explanation: {
      tr: 'r -1\'e yakın olduğu için değişkenler arasında güçlü bir negatif doğrusal ilişki vardır.',
      en: 'Since r is close to -1, there is a strong negative linear relationship.',
    },
  },
  {
    id: 'pq-8',
    targetModuleId: 'module-8',
    targetModuleOrder: 8,
    topicTitle: {
      tr: 'Çoklu Regresyon & Belirtme Katsayısı (R²)',
      en: 'Multiple Regression & R-squared',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Bir regresyon modelinde R² (Belirtme Katsayısı) = 0.82 olarak bulunduğunda bu ne anlama gelir?',
      en: 'What does R² = 0.82 mean in a regression model?',
    },
    options: [
      { tr: 'Bağımlı değişkendeki varyansın %82\'si bağımsız değişkenler tarafından açıklanmaktadır.', en: '82% of the variance in the dependent variable is explained by the independent variables.' },
      { tr: 'Modelin hata oranı %82\'dir.', en: 'Model error rate is 82%.' },
      { tr: 'Tahminlerin %82\'si yanlıştır.', en: '82% of predictions are wrong.' },
      { tr: 'Verilerde %82 oranında kayıp vardır.', en: '82% of data is missing.' },
    ],
    correctAnswer: 'Bağımlı değişkendeki varyansın %82\'si bağımsız değişkenler tarafından açıklanmaktadır.',
    explanation: {
      tr: 'R² (R-kare), bağımlı değişkendeki değişimin yüzde kaçının modeldeki bağımsız değişkenlerce açıklandığını gösterir.',
      en: 'R-squared represents the proportion of variance in the dependent variable explained by the model.',
    },
  },
  {
    id: 'pq-9',
    targetModuleId: 'module-9',
    targetModuleOrder: 9,
    topicTitle: {
      tr: 'ANOVA (Varyans Analizi)',
      en: 'ANOVA (Analysis of Variance)',
    },
    type: 'multiple_choice',
    prompt: {
      tr: '3 veya daha fazla bağımsız grubun ortalamalarını aynı anda karşılaştırmak için hangi istatistiksel test kullanılır?',
      en: 'Which statistical test is used to compare the means of 3 or more independent groups simultaneously?',
    },
    options: [
      { tr: 'Tek Örneklem t-Testi', en: 'One-Sample t-Test' },
      { tr: 'ANOVA (Tek Yönlü Varyans Analizi)', en: 'ANOVA (One-Way Analysis of Variance)' },
      { tr: 'Ki-Kare Testi', en: 'Chi-Square Test' },
      { tr: 'Z-Testi', en: 'Z-Test' },
    ],
    correctAnswer: 'ANOVA (Tek Yönlü Varyans Analizi)',
    explanation: {
      tr: 'ANOVA, 3 veya daha fazla grup ortalamasını Tip 1 hata oranını şişirmeden tek seferde karşılaştırır.',
      en: 'ANOVA compares means across 3+ groups simultaneously without inflating Type 1 error.',
    },
  },
  {
    id: 'pq-10',
    targetModuleId: 'module-10',
    targetModuleOrder: 10,
    topicTitle: {
      tr: 'Zaman Serileri Analizi & Trend',
      en: 'Time Series Analysis & Trend',
    },
    type: 'multiple_choice',
    prompt: {
      tr: 'Bir zaman serisinde belirli zaman periyotlarında (örneğin her yaz veya her Aralık ayı) tekrarlayan düzenli dalgalanmalara ne ad verilir?',
      en: 'In a time series, what are regular repeating fluctuations at specific time intervals (e.g., every summer or December) called?',
    },
    options: [
      { tr: 'Mevsimsellik (Seasonality)', en: 'Seasonality' },
      { tr: 'Rastgele Gürültü (Noise)', en: 'Random Noise' },
      { tr: 'Uzun Vadeli Trend (Trend)', en: 'Long-term Trend' },
      { tr: 'Durağanlık (Stationarity)', en: 'Stationarity' },
    ],
    correctAnswer: 'Mevsimsellik (Seasonality)',
    explanation: {
      tr: 'Belirli dönemlerde tekrarlayan periyodik hareketler zaman serisinde Mevsimsellik (Seasonality) olarak adlandırılır.',
      en: 'Periodic repeating patterns at specific intervals are known as Seasonality in time series.',
    },
  },
];
