const fs = require('fs');
const path = require('path');

function updateModule(filename, updaterFn) {
  const fpath = path.join('src', 'data', filename);
  if (!fs.existsSync(fpath)) {
    console.error(`File not found: ${fpath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const updated = updaterFn(data);
  fs.writeFileSync(fpath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`Updated ${filename}: ${updated.lessons.length} lessons, ${updated.caseExams ? updated.caseExams.length : 0} cases.`);
}

// -----------------------------------------------------------------
// 1. MODULE 1: Tanımlayıcı İstatistik & EDA (INDR 252)
// -----------------------------------------------------------------
updateModule('module1.json', (m) => {
  const orientation = m.lessons[0];
  const origMean = m.lessons.find(l => l.id === 'm1-l1') || m.lessons[1];
  const origMedian = m.lessons.find(l => l.id === 'm1-l2') || m.lessons[2];
  const origMode = m.lessons.find(l => l.id === 'm1-l3') || m.lessons[3];

  m.lessons = [
    orientation,
    {
      id: 'm1-l1',
      moduleId: 'module-1',
      order: 2,
      difficulty: 'basit',
      title: { tr: 'Veri Türleri (Kategorik vs. Sayısal)', en: 'Data Types (Categorical vs. Numerical)' },
      conceptCard: {
        tr: 'İstatistikte veriler temel olarak ikiye ayrılır:\n\n1. **Kategorik (Nitel) Veriler:**\n- **Nominal:** Sırasız etiketler (Cinsiyet, Departman, Kan grubu)\n- **Ordinal:** Doğal sıralı kategoriler (Memnuniyet derecesi 1-5, Eğitim seviyesi)\n\n2. **Sayısal (Nicel) Veriler:**\n- **Kesikli (Discrete):** Sayılabilir tam değerler (Kusurlu ürün sayısı, Çağrı adedi)\n- **Sürekli (Continuous):** Ölçülebilir reel değerler (Boy, Ağırlık, Ciro, Süre)',
        en: 'Data is classified into:\n\n1. **Categorical (Qualitative) Data:**\n- **Nominal:** Unordered labels (Gender, Department, Blood type)\n- **Ordinal:** Naturally ordered categories (Satisfaction rating 1-5, Education level)\n\n2. **Numerical (Quantitative) Data:**\n- **Discrete:** Countable integer values (Defect count, Call volume)\n- **Continuous:** Measurable real values (Height, Weight, Revenue, Duration)'
      },
      companyExample: {
        tr: 'NovaMarket veri tabanında: Müşteri Şehri = Nominal, Üyelik Statüsü (Bronz/Gümüş/Altın) = Ordinal, Sepetteki Ürün Sayısı = Kesikli Sayısal, Sepet Tutarı ($) = Sürekli Sayısal olarak modellenir.',
        en: 'In NovaMarket database: Customer City = Nominal, Membership Tier (Bronze/Silver/Gold) = Ordinal, Item Count = Discrete Numerical, Cart Value ($) = Continuous Numerical.'
      },
      vocabTerms: [
        { term_en: 'categorical data', explanation_tr: 'Nitelik ve grupları temsil eden veri türü.', explanation_en: 'Data representing qualitative attributes or groups.', exampleSentence_en: 'Customer segment is a categorical variable.' },
        { term_en: 'continuous variable', explanation_tr: 'Belirli bir aralıkta kesintisiz değerler alabilen sayısal değişken.', explanation_en: 'A numerical variable that can take infinite values within a range.', exampleSentence_en: 'Delivery duration is a continuous variable.' }
      ],
      questions: [
        {
          id: 'm1-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: "Bir çağrı merkezinde 'Müşteri Memnuniyet Derecesi (1: Çok Kötü ... 5: Çok İyi)' değişkeni hangi veri türüne girer?", en: "In a call center, what data type is 'Customer Satisfaction Rating (1: Very Poor ... 5: Excellent)'?" },
          options: [
            { tr: 'Nominal Kategorik', en: 'Nominal Categorical' },
            { tr: 'Ordinal (Sıralı) Kategorik', en: 'Ordinal Categorical' },
            { tr: 'Sürekli Sayısal', en: 'Continuous Numerical' },
            { tr: 'Rassal Süreç', en: 'Random Process' }
          ],
          correctAnswer: 'Ordinal (Sıralı) Kategorik',
          explanation: { tr: 'Kategoriler arasında hiyerarşik bir derece sıralaması olduğu için Ordinal kategorik değişkendir.', en: 'Because there is a natural hierarchical ordering, it is an Ordinal categorical variable.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=EĞER(ESAYIYSA(A2); "Sayısal"; "Kategorik")',
        pythonCode: 'import pandas as pd\ndf["tier"] = df["tier"].astype("category")',
        powerBiNote: { tr: 'Sütun tipini Text veya Whole Number olarak ayarlayın.', en: 'Set column data type to Text or Whole Number.' }
      }
    },
    { ...origMean, id: 'm1-l2', order: 3, title: { tr: 'Aritmetik Ortalama (Mean)', en: 'Arithmetic Mean' } },
    { ...origMedian, id: 'm1-l3', order: 4, title: { tr: 'Medyan (Median / Ortanca)', en: 'Median (Robust Center)' } },
    { ...origMode, id: 'm1-l4', order: 5, title: { tr: 'Mod (Mode / Tepe Değer)', en: 'Mode' } },
    {
      id: 'm1-l5',
      moduleId: 'module-1',
      order: 6,
      difficulty: 'orta',
      title: { tr: 'Çeyreklikler ($Q_1, Q_2, Q_3$) ve Ranj', en: 'Quartiles ($Q_1, Q_2, Q_3$) and Range' },
      conceptCard: {
        tr: 'Veri yayılımını özetleyen temel parçalanmalar:\n\n1. **Ranj (Açıklık):** $\\text{Ranj} = x_{max} - x_{min}$\n2. **Birinci Çeyreklik ($Q_1$):** Verilerin %25\'inin altında kaldığı 25. yüzdelik.\n3. **İkinci Çeyreklik ($Q_2$):** Medyan (50. yüzdelik).\n4. **Üçüncü Çeyreklik ($Q_3$):** Verilerin %75\'inin altında kaldığı 75. yüzdelik.\n5. **Çeyrekler Açıklığı ($IQR$):** $IQR = Q_3 - Q_1$ (Orta %50\'lik çekirdek yayılım).',
        en: 'Key partitioning metrics for data spread:\n\n1. **Range:** $\\text{Range} = x_{max} - x_{min}$\n2. **First Quartile ($Q_1$):** 25th percentile (25% below).\n3. **Second Quartile ($Q_2$):** Median (50th percentile).\n4. **Third Quartile ($Q_3$):** 75th percentile (75% below).\n5. **Interquartile Range ($IQR$):** $IQR = Q_3 - Q_1$ (Spread of middle 50%).'
      },
      companyExample: {
        tr: 'Sipariş tutarları sıralandığında $Q_1 = 40\\$$, $Q_3 = 120\\$$ bulunmuştur. Çeyrekler açıklığı $IQR = 120 - 40 = 80\\$$\'dır.',
        en: 'When orders are sorted, $Q_1 = \\$40$ and $Q_3 = \\$120$. Interquartile range $IQR = 120 - 40 = \\$80$.'
      },
      vocabTerms: [
        { term_en: 'interquartile range', explanation_tr: 'Üçüncü ve birinci çeyreklik arasındaki fark ($IQR$).', explanation_en: 'Difference between the 3rd and 1st quartiles ($IQR$).', exampleSentence_en: 'IQR represents the spread of the middle 50% of the dataset.' }
      ],
      questions: [
        {
          id: 'm1-l5-q1',
          type: 'numeric',
          prompt: { tr: '$Q_1 = 30$ ve $Q_3 = 95$ olan bir veri setinde $IQR$ kaçtır?', en: 'For a dataset with $Q_1 = 30$ and $Q_3 = 95$, what is $IQR$?' },
          correctAnswer: 65,
          explanation: { tr: '$$IQR = Q_3 - Q_1 = 95 - 30 = 65$$', en: '$$IQR = Q_3 - Q_1 = 95 - 30 = 65$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=DÖRTTEBİRLİK.DÂHİL(A1:A100; 3) - DÖRTTEBİRLİK.DÂHİL(A1:A100; 1)',
        pythonCode: 'import numpy as np\nq75, q25 = np.percentile(data, [75, 25])\niqr = q75 - q25',
        powerBiNote: { tr: 'Box & Whisker görselinde IQR otomatik gösterilir.', en: 'IQR is rendered automatically in Box & Whisker visuals.' }
      }
    },
    {
      id: 'm1-l6',
      moduleId: 'module-1',
      order: 7,
      difficulty: 'orta',
      title: { tr: 'Varyans ve Serbestlik Derecesi ($n-1$)', en: 'Variance and Degrees of Freedom ($n-1$)' },
      conceptCard: {
        tr: 'Varyans, gözlemlerin ortalamadan sapmalarının karelerinin ortalamasıdır:\n\n1. **Popülasyon Varyansı ($\\sigma^2$):** $\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^N (X_i - \\mu)^2$\n2. **Örneklem Varyansı ($s^2$):** $s^2 = \\frac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})^2$\n\n**Neden $n-1$ (Bessel Düzeltmesi)?**\nÖrneklem ortalaması $\\bar{x}$, anakütle $\\mu$\'ye göre örneklem verisine daha yakın olduğundan sapmayı underestimate eder. $n-1$ serbestlik derecesi kullanarak $s^2$\'nin **sapmasız (unbiased)** olması sağlanır ($E[s^2] = \\sigma^2$).',
        en: 'Variance measures average squared deviations from the mean:\n\n1. **Population Variance ($\\sigma^2$):** $\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^N (X_i - \\mu)^2$\n2. **Sample Variance ($s^2$):** $s^2 = \\frac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})^2$\n\n**Why $n-1$ (Bessel Correction)?**\nDividing by $n-1$ compensates for sample bias, ensuring $s^2$ is an **unbiased estimator** ($E[s^2] = \\sigma^2$).'
      },
      companyExample: {
        tr: 'İki sunucunun ortalama gecikmesi 50 ms iken, 1. sunucunun varyansı $s_1^2 = 4 \\text{ ms}^2$, 2. sunucunun varyansı $s_2^2 = 400 \\text{ ms}^2$ çıkmıştır. 2. sunucu kararsızdır.',
        en: 'Both servers average 50ms, but Server 1 has variance $4\\text{ ms}^2$ while Server 2 has $400\\text{ ms}^2$, revealing high instability.'
      },
      vocabTerms: [
        { term_en: 'degrees of freedom', explanation_tr: 'Bir istatistik hesabında bağımsızca değişebilen değer adedi ($n-1$).', explanation_en: 'Number of values free to vary in a final statistical calculation.', exampleSentence_en: 'Sample variance uses n-1 degrees of freedom.' }
      ],
      questions: [
        {
          id: 'm1-l6-q1',
          type: 'numeric',
          prompt: { tr: '$n = 6$ gözlemde kareler toplamı $\\sum (x_i - \\bar{x})^2 = 50$ ise örneklem varyansı $s^2$ kaçtır?', en: 'For $n = 6$, if sum of squared deviations $\\sum (x_i - \\bar{x})^2 = 50$, what is $s^2$?' },
          correctAnswer: 10,
          explanation: { tr: '$$s^2 = \\frac{50}{6-1} = \\frac{50}{5} = 10$$', en: '$$s^2 = \\frac{50}{6-1} = \\frac{50}{5} = 10$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=VAR.S(A1:A10)',
        pythonCode: 'import numpy as np\nnp.var(data, ddof=1)',
        powerBiNote: { tr: 'DAX: VAR.S(Tablo[Değer])', en: 'DAX: VAR.S(Table[Value])' }
      }
    },
    {
      id: 'm1-l7',
      moduleId: 'module-1',
      order: 8,
      difficulty: 'orta',
      title: { tr: 'Standart Sapma ve Değişim Katsayısı ($CV$)', en: 'Standard Deviation and Coefficient of Variation ($CV$)' },
      conceptCard: {
        tr: 'Varyansın karesel birimini orijinal birime çevirmek ve bağıl riski ölçmek için kullanılır:\n\n1. **Standart Sapma ($s$):** $s = \\sqrt{s^2}$\n2. **Değişim Katsayısı ($CV$):**\n$$CV = \\frac{s}{\\bar{x}} \\times 100\\%$$\nFarklı birim veya ölçekteki veri gruplarının nispi değişkenliğini kıyaslar.',
        en: 'Used to return variance to original units and evaluate relative risk:\n\n1. **Standard Deviation ($s$):** $s = \\sqrt{s^2}$\n2. **Coefficient of Variation ($CV$):**\n$$CV = \\frac{s}{\\bar{x}} \\times 100\\%$$\nCompares relative variation across datasets with different units or scales.'
      },
      companyExample: {
        tr: 'A hissesi $\\bar{x}=100\\$, s=10\\$ ($CV=10\\%$); B hissesi $\\bar{x}=1000\\$, s=50\\$ ($CV=5\\%$). B hissesi mutlak sapması yüksek olsa da bağıl olarak daha kararlıdır.',
        en: 'Stock A has mean $\\$100$, std dev $\\$10$ ($CV=10\\%$); Stock B has mean $\\$1000$, std dev $\\$50$ ($CV=5\\%$). Stock B is relatively more stable.'
      },
      vocabTerms: [
        { term_en: 'coefficient of variation', explanation_tr: 'Standart sapmanın ortalamaya bağıl oranı ($s/\\bar{x}$).', explanation_en: 'Ratio of standard deviation to mean ($s/\\bar{x}$).', exampleSentence_en: 'CV allows unit-independent risk comparison.' }
      ],
      questions: [
        {
          id: 'm1-l7-q1',
          type: 'numeric',
          prompt: { tr: 'Ortalaması $\\bar{x} = 80$ ve standart sapması $s = 8$ olan sürecin $CV$ yüzdesi kaçtır?', en: 'If mean $\\bar{x} = 80$ and $s = 8$, what is the percentage $CV$?' },
          correctAnswer: 10,
          explanation: { tr: '$$CV = (8 / 80) \\times 100 = 10\\%$$', en: '$$CV = (8 / 80) \\times 100 = 10\\%$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=STDSAPMA.S(A1:A10) / ORTALAMA(A1:A10)',
        pythonCode: 'import numpy as np\ncv = (np.std(data, ddof=1) / np.mean(data)) * 100',
        powerBiNote: { tr: 'KPI kartlarında volatilite metriği olarak gösterilir.', en: 'Rendered as a volatility metric in KPI cards.' }
      }
    },
    {
      id: 'm1-l8',
      moduleId: 'module-1',
      order: 9,
      difficulty: 'orta',
      title: { tr: 'Aykırı Değer (Outlier) Tespiti ve Boxplot', en: 'Outlier Detection and Boxplot Interpretation' },
      conceptCard: {
        tr: "Tukey'in $1.5 \\times IQR$ kuralı:\n\n1. **Alt Sınır:** $LF = Q_1 - 1.5 \\times IQR$\n2. **Üst Sınır:** $UF = Q_3 + 1.5 \\times IQR$\n\n$[LF, UF]$ aralığı dışındaki tüm değerler **Aykırı Değer (Outlier)** kabul edilir ve kutu grafiğinde tekil noktalar olarak gösterilir.",
        en: "Tukey's $1.5 \\times IQR$ rule:\n\n1. **Lower Fence:** $LF = Q_1 - 1.5 \\times IQR$\n2. **Upper Fence:** $UF = Q_3 + 1.5 \\times IQR$\n\nPoints outside $[LF, UF]$ are designated as **Outliers**."
      },
      companyExample: {
        tr: 'Siparişlerde $Q_1 = 40\\$, $Q_3 = 120\\$, $IQR = 80\\$. Üst sınır $UF = 120 + 1.5(80) = 240\\$. $300\\$\'lık işlem aykırı değerdir.',
        en: 'Orders: $Q_1 = \\$40, Q_3 = \\$120, IQR = \\$80$. $UF = 120 + 1.5(80) = \\$240$. A $\\$300$ order is flagged as an outlier.'
      },
      vocabTerms: [
        { term_en: 'outlier', explanation_tr: 'Genel dağılım paterninden belirgin şekilde sapan uç nokta.', explanation_en: 'A data point that differs significantly from other observations.', exampleSentence_en: 'Outliers can distort mean and variance.' }
      ],
      questions: [
        {
          id: 'm1-l8-q1',
          type: 'numeric',
          prompt: { tr: '$Q_1 = 20$ ve $Q_3 = 50$ ise Üst Sınır (Upper Fence) kaçtır?', en: 'If $Q_1 = 20$ and $Q_3 = 50$, what is the Upper Fence?' },
          correctAnswer: 95,
          explanation: { tr: '$$IQR = 30, UF = 50 + 1.5(30) = 95$$', en: '$$IQR = 30, UF = 50 + 1.5(30) = 95$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=EĞER(A2 > (Q3 + 1.5*IQR); "Outlier"; "Normal")',
        pythonCode: 'import seaborn as sns\nsns.boxplot(x=data)',
        powerBiNote: { tr: 'Box & Whisker görseli ile anomaliler incelenir.', en: 'Use Box & Whisker to inspect anomalies.' }
      }
    },
    {
      id: 'm1-l9',
      moduleId: 'module-1',
      order: 10,
      difficulty: 'orta-ustu',
      title: { tr: 'Normallik Olasılık Grafiği (Q-Q Plot) & Çarpıklık', en: 'Normal Probability Plot (Q-Q Plot) & Skewness' },
      conceptCard: {
        tr: 'Parametrik testlerden önce normallik ve çarpıklık doğrulanmalıdır (`INDR 252 Case Rules`):\n\n1. **Q-Q Plot:** Noktalar $45^\\circ$ köşegen doğru boyunca diziliyorsa veri normale uygundur.\n2. **Çarpıklık (Skewness):**\n- **Sağa Çarpık (Pozitif):** $\\text{Ortalama} > \\text{Medyan}$\n- **Sola Çarpık (Negatif):** $\\text{Ortalama} < \\text{Medyan}$\n\n> **Önemli Kural:** Normallik grafiği rassallığı (randomness) göstermez! Rassallık zaman serisi grafiğiyle bağımsız kontrol edilmelidir.',
        en: 'Normality and skewness verification (`INDR 252 Case Rules`):\n\n1. **Q-Q Plot:** If points follow the $45^\\circ$ reference diagonal line, normality holds.\n2. **Skewness:**\n- **Right Skewed:** $\\text{Mean} > \\text{Median}$\n- **Left Skewed:** $\\text{Mean} < \\text{Median}$\n\n> **Crucial Rule:** Normality plots do not check randomness! Randomness requires time-series inspection.'
      },
      companyExample: {
        tr: 'E-ticaret cirolarında Ortalama = 180 TL, Medyan = 70 TL çıkmıştır. Q-Q grafiğinde sağ üstte eğrilme görülür; veri sağa çarpıktır ve normal dağılmamaktadır.',
        en: 'Revenue data has Mean = $\\$180$, Median = $\\$70$. Q-Q plot curves upward on top right, indicating positive skewness and non-normality.'
      },
      vocabTerms: [
        { term_en: 'Q-Q plot', explanation_tr: 'Örneklem kuantilleri ile teorik dağılım kuantillerini kıyaslayan grafik.', explanation_en: 'Quantile-quantile probability plot verifying distribution assumptions.', exampleSentence_en: 'The Q-Q plot points closely follow the straight line.' }
      ],
      questions: [
        {
          id: 'm1-l9-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Ortalama = 120, Medyan = 75 ve Mod = 60 olan bir gelir dağılımının şekli nasıldır?', en: 'If Mean = 120, Median = 75, and Mode = 60, what is the shape of this income distribution?' },
          options: [
            { tr: 'Sağa Çarpık (Pozitif Çarpık)', en: 'Right-Skewed (Positive)' },
            { tr: 'Sola Çarpık (Negatif Çarpık)', en: 'Left-Skewed (Negative)' },
            { tr: 'Simetrik Normal', en: 'Symmetric Normal' },
            { tr: 'Tekdüze (Uniform)', en: 'Uniform' }
          ],
          correctAnswer: 'Sağa Çarpık (Pozitif Çarpık)',
          explanation: { tr: 'Ortalama > Medyan > Mod ilişkisi verinin sağa çarpık olduğunu kanıtlar.', en: 'Mean > Median > Mode indicates a right-skewed distribution with a long upper tail.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=ÇARPIKLIK(A1:A100)',
        pythonCode: 'import scipy.stats as stats\nstats.probplot(data, dist="norm", plot=plt)',
        powerBiNote: { tr: 'Python Visual ile probplot çizdirilir.', en: 'Render probplot via Python Visual in Power BI.' }
      }
    }
  ];
  return m;
});

// -----------------------------------------------------------------
// 5. MODULE 5: Nokta ve Aralık Tahmini (INDR 252)
// -----------------------------------------------------------------
updateModule('module5.json', (m) => {
  m.lessons = [
    {
      id: 'm5-l1',
      moduleId: 'module-5',
      order: 1,
      difficulty: 'orta',
      title: { tr: 'Nokta Tahmini ve Sapmasızlık (Unbiasedness)', en: 'Point Estimation and Unbiasedness' },
      conceptCard: {
        tr: 'Bilinmeyen bir anakütle parametresi $\\theta$ için örneklemden tek bir sayısal tahmin üreten fonksiyona **Nokta Tahmin Edici (Point Estimator $\\hat{\\Theta}$)** denir (`INDR 252 CEx4`).\n\n1. **Sapmasızlık (Unbiasedness):**\n$$E[\\hat{\\Theta}] = \\theta$$\nTahmin edicinin beklenen değeri tam olarak gerçek parametreye eşit olmalıdır. Örneklem ortalaması $E[\\bar{X}] = \\mu$ ve örneklem varyansı $E[s^2] = \\sigma^2$ sapmasızdır.\n2. **Sapma (Bias):** $\\text{Bias}(\\hat{\\Theta}) = E[\\hat{\\Theta}] - \\theta$',
        en: 'A single numerical value used to estimate an unknown population parameter $\\theta$ (`INDR 252 CEx4`):\n\n1. **Unbiasedness:**\n$$E[\\hat{\\Theta}] = \\theta$$\nThe expected value of the estimator equals the true parameter. $\\bar{X}$ and $s^2$ (with $n-1$) are unbiased estimators.\n2. **Bias:** $\\text{Bias}(\\hat{\\Theta}) = E[\\hat{\\Theta}] - \\theta$'
      },
      companyExample: {
        tr: 'VoltPower batarya fabrikasında 100 bataryanın ortalama ömrü $\\bar{x} = 48.5$ saat bulunmuştur. $48.5$ saat, tüm üretimin gerçek $\\mu$ değeri için sapmasız bir nokta tahminidir.',
        en: 'Battery batch sample mean $\\bar{x} = 48.5$ hours serves as an unbiased point estimate of true population mean $\\mu$.'
      },
      vocabTerms: [
        { term_en: 'unbiased estimator', explanation_tr: 'Beklenen değeri tahmin etmeye çalıştığı gerçek parametreye eşit olan istatistik.', explanation_en: 'An estimator whose expected value equals the true parameter being estimated.', exampleSentence_en: 'Sample mean is an unbiased estimator of population mean.' }
      ],
      questions: [
        {
          id: 'm5-l1-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Bir $\\hat{\\theta}$ tahmin edicisinin sapmasız (unbiased) olabilmesi için hangi koşul sağlanmalıdır?', en: 'What condition must hold for an estimator $\\hat{\\theta}$ to be unbiased?' },
          options: [
            { tr: 'E[θ̂] = θ', en: 'E[θ̂] = θ' },
            { tr: 'Var(θ̂) = 0', en: 'Var(θ̂) = 0' },
            { tr: 'θ̂ = 0', en: 'θ̂ = 0' },
            { tr: 'n > 100', en: 'n > 100' }
          ],
          correctAnswer: 'E[θ̂] = θ',
          explanation: { tr: 'Sapmasızlık kuralı gereği tahmin edicinin beklenen değeri hedef parametreye eşit olmalıdır.', en: 'By definition of unbiasedness, expected value must equal target parameter.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=ORTALAMA(A1:A100)',
        pythonCode: 'theta_hat = np.mean(sample_data)',
        powerBiNote: { tr: 'Nokta tahminleri tekil KPI kartlarında gösterilir.', en: 'Point estimates are displayed on KPI cards.' }
      }
    },
    {
      id: 'm5-l2',
      moduleId: 'module-5',
      order: 2,
      difficulty: 'zor',
      title: { tr: 'En Çok Olabilirlik Tahmini (MLE)', en: 'Maximum Likelihood Estimation (MLE)' },
      conceptCard: {
        tr: 'Verilen gözlem verilerini en olası kılan parametre değerini bulma yöntemi (`INDR 252 CEx5`):\n\n1. **Olabilirlik Fonksiyonu (Likelihood):** $L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$\n2. **Log-Olabilirlik:** $\\ln L(\\theta) = \\sum_{i=1}^n \\ln f(x_i; \\theta)$\n3. **Türev Alıp Sıfıra Eşitleme:** $\\frac{d \\ln L(\\theta)}{d\\theta} = 0$\n\n**Örnek (Üstel Dağılım):** $f(x) = \\lambda e^{-\\lambda x} \\implies \\hat{\\lambda}_{MLE} = \\frac{n}{\\sum x_i} = \\frac{1}{\\bar{x}}$',
        en: 'Finding parameter values that maximize the likelihood of observing the given sample (`INDR 252 CEx5`):\n\n1. **Likelihood Function:** $L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$\n2. **Log-Likelihood:** $\\ln L(\\theta) = \\sum_{i=1}^n \\ln f(x_i; \\theta)$\n3. **First Derivative:** $\\frac{d \\ln L(\\theta)}{d\\theta} = 0$\n\n**Exponential Distribution MLE:** $\\hat{\\lambda}_{MLE} = \\frac{n}{\\sum x_i} = \\frac{1}{\\bar{x}}$'
      },
      companyExample: {
        tr: '5 sunucunun arızalanma süreleri $x = [2, 4, 6, 8, 10]$ saat ölçülmüştür. $\\bar{x} = 6$. MLE formülünden $\\hat{\\lambda}_{MLE} = 1/6 = 0.167$ arıza/saat bulunur.',
        en: '5 server failures observed at $x = [2, 4, 6, 8, 10]$ hours (mean $\\bar{x}=6$). $\\hat{\\lambda}_{MLE} = 1/6 = 0.167$ failures per hour.'
      },
      vocabTerms: [
        { term_en: 'maximum likelihood estimation', explanation_tr: 'Gözlenen verinin ortaya çıkma olasılığını maksimize eden parametreyi bulma yöntemi (MLE).', explanation_en: 'A method of estimating parameters of a probability distribution by maximizing a likelihood function.', exampleSentence_en: 'MLE estimators are asymptotically efficient and normally distributed.' }
      ],
      questions: [
        {
          id: 'm5-l2-q1',
          type: 'numeric',
          prompt: { tr: 'Üstel dağılıma sahip bir örneklemde $n=4$ gözlem toplamı $\\sum x_i = 20$ ise $\\hat{\\lambda}_{MLE}$ kaçtır?', en: 'For an exponential sample with $n=4$ and sum $\\sum x_i = 20$, what is $\\hat{\\lambda}_{MLE}$?' },
          correctAnswer: 0.2,
          explanation: { tr: '$$\\hat{\\lambda}_{MLE} = \\frac{n}{\\sum x_i} = \\frac{4}{20} = 0.2$$', en: '$$\\hat{\\lambda}_{MLE} = \\frac{n}{\\sum x_i} = \\frac{4}{20} = 0.2$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=BAĞ_DEĞ_SAY(A1:A10) / TOPLA(A1:A10)',
        pythonCode: 'from scipy.stats import expon\nloc, scale = expon.fit(data, floc=0)\nlambda_mle = 1.0 / scale',
        powerBiNote: { tr: 'Güvenilirlik mühendisliği dağılım modellerinde MLE kullanılır.', en: 'MLE fits parameters in reliability engineering.' }
      }
    },
    {
      id: 'm5-l3',
      moduleId: 'module-5',
      order: 3,
      difficulty: 'orta',
      title: { tr: 'Ortalama İçin Güven Aralığı ($\sigma$ Bilinen / $Z$)', en: 'Confidence Interval for Mean ($\sigma$ Known / $Z$)' },
      conceptCard: {
        tr: 'Anakütle standart sapması $\\sigma$ bilindiğinde veya $n \\ge 30$ iken %$100(1-\\alpha)$ Güven Aralığı:\n\n$$\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$$\n\n1. **%95 Güven Düzeyi:** $z_{0.025} = 1.96$\n2. **%99 Güven Düzeyi:** $z_{0.005} = 2.576$\n3. **Hata Payı:** $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$',
        en: 'Confidence interval for population mean $\\mu$ when $\\sigma$ is known (`INDR 252 Lecture 7`):\n\n$$\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$$\n\n1. **95% Confidence:** $z_{0.025} = 1.96$\n2. **99% Confidence:** $z_{0.005} = 2.576$\n3. **Margin of Error:** $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$'
      },
      companyExample: {
        tr: '$\\sigma = 10$ TL bilinen bir süreçte $n=100$ müşteri için $\\bar{x} = 150$ TL ölçülmüştür. %95 Güven Aralığı: $150 \\pm 1.96 (10/10) = 150 \\pm 1.96 = [148.04, 151.96]$ TL.',
        en: '$\\sigma=10, n=100, \\bar{x}=150$. 95% CI: $150 \\pm 1.96(10/10) = [148.04, 151.96]$.'
      },
      vocabTerms: [
        { term_en: 'confidence interval', explanation_tr: 'Bilinmeyen anakütle parametresini belirli bir olasılıkla (%95, %99) kapsayan aralık.', explanation_en: 'An estimated range of values likely to include an unknown population parameter.', exampleSentence_en: 'We are 95% confident that the true population mean lies in this interval.' }
      ],
      questions: [
        {
          id: 'm5-l3-q1',
          type: 'numeric',
          prompt: { tr: '$\\bar{x} = 100$, $\\sigma = 20$, $n = 64$ ve $z_{\\alpha/2} = 2$ ise Güven Aralığının Üst Sınırı kaçtır?', en: 'If $\\bar{x} = 100$, $\\sigma = 20$, $n = 64$, and $z_{\\alpha/2} = 2$, what is the Upper Bound?' },
          correctAnswer: 105,
          explanation: { tr: '$$E = 2 \\times \\frac{20}{\\sqrt{64}} = 2 \\times \\frac{20}{8} = 5 \\implies \\text{Üst Sınır} = 100 + 5 = 105$$', en: '$$E = 2 \\times \\frac{20}{\\sqrt{64}} = 5 \\implies 100 + 5 = 105$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=GÜVENİRLİK.NORM(0.05; sigma; n)',
        pythonCode: 'import scipy.stats as stats\nstats.norm.interval(0.95, loc=x_bar, scale=sigma/np.sqrt(n))',
        powerBiNote: { tr: 'Hata çubukları (Error Bars) ile grafiğe eklenir.', en: 'Added as Error Bars on charts.' }
      }
    },
    {
      id: 'm5-l4',
      moduleId: 'module-5',
      order: 4,
      difficulty: 'orta',
      title: { tr: 't-Dağılımı ile Güven Aralığı ($\sigma$ Bilinmeyen)', en: 'Confidence Interval with t-Distribution ($\sigma$ Unknown)' },
      conceptCard: {
        tr: 'Anakütle varyansı bilinmediğinde ve popülasyon yaklaşık normal olduğunda Student\'s $t$-dağılımı kullanılır (`INDR 252 Lecture 8`):\n\n$$\\bar{x} \\pm t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}}$$\n\n- $df = n - 1$ (Serbestlik Derecesi)\n- Örneklem boyutu $n$ büyüdükçe $t$-dağılımı $Z$-dağılımına yakınsar.',
        en: 'When $\\sigma$ is unknown and population is roughly normal (`INDR 252 Lecture 8`):\n\n$$\\bar{x} \\pm t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}}$$\n\n- $df = n - 1$ (Degrees of Freedom)\n- As $n \\to \\infty$, $t$-distribution converges to $Z$.'
      },
      companyExample: {
        tr: 'BioLab $n=16$ hasta üzerinde ilaç denemiştir. $\\bar{x} = 24$ saat, $s = 4$ saat. $df = 15$ için $t_{0.025, 15} = 2.131$. %95 CI: $24 \\pm 2.131 (4 / 4) = 24 \\pm 2.131 = [21.87, 26.13]$ saat.',
        en: 'BioLab trial ($n=16$): $\\bar{x}=24$h, $s=4$h. $t_{0.025, 15}=2.131$. 95% CI: $24 \\pm 2.131 = [21.87, 26.13]$h.'
      },
      vocabTerms: [
        { term_en: 'Student t distribution', explanation_tr: 'Küçük örneklemlerde ve bilinmeyen varyansta kalın kuyruklu çan eğrisi dağılımı.', explanation_en: 'A symmetric probability distribution used when estimating the mean with unknown variance.', exampleSentence_en: 'The t-distribution accounts for extra uncertainty from using sample standard deviation s.' }
      ],
      questions: [
        {
          id: 'm5-l4-q1',
          type: 'numeric',
          prompt: { tr: '$n = 10$ kişilik bir örneklem için $t$-dağılımı serbestlik derecesi ($df$) kaçtır?', en: 'For sample size $n = 10$, what is the degrees of freedom ($df$) for t-distribution?' },
          correctAnswer: 9,
          explanation: { tr: '$$df = n - 1 = 10 - 1 = 9$$', en: '$$df = n - 1 = 10 - 1 = 9$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=GÜVENİRLİK.T(0.05; s; n)',
        pythonCode: 'import scipy.stats as stats\nstats.t.interval(0.95, df=n-1, loc=x_bar, scale=s/np.sqrt(n))',
        powerBiNote: { tr: 'Küçük örneklem metriklerinde t-dağılımı esas alınır.', en: 'Used for small sample metric interval bounds.' }
      }
    },
    {
      id: 'm5-l5',
      moduleId: 'module-5',
      order: 5,
      difficulty: 'orta-ustu',
      title: { tr: 'Oranlar İçin Güven Aralığı ve Agresti-Coull', en: 'Confidence Interval for Proportions and Agresti-Coull' },
      conceptCard: {
        tr: '1. **Klasik Wald Oran Güven Aralığı:**\n$$\\hat{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}$$\n2. **Agresti-Coull Düzeltmesi (`INDR 252 Lecture 9`):**\nKüçük $n$ veya uç $p$ değerlerinde klasik formül hatalı sonuç verir. 2 başarı ve 2 başarısızlık eklenerek düzeltilir:\n$$\\tilde{n} = n + 4, \\quad \\tilde{p} = \\frac{x + 2}{n + 4}$$\n$$\\tilde{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\tilde{p}(1-\\tilde{p})}{\\tilde{n}}}$$',
        en: '1. **Wald Proportion CI:**\n$$\\hat{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}$$\n2. **Agresti-Coull "Plus Four" Interval (`INDR 252 Lecture 9`):**\nAdds 2 successes and 2 failures for robust coverage in small samples:\n$$\\tilde{n} = n + 4, \\quad \\tilde{p} = \\frac{x + 2}{n + 4}$$\n$$\\tilde{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\tilde{p}(1-\\tilde{p})}{\\tilde{n}}}$$'
      },
      companyExample: {
        tr: 'DataPulse 20 müşteriden 1\'inin ürünü iade ettiğini görmüştür ($x=1, n=20$). Agresti-Coull ile $\\tilde{n} = 24, \\tilde{p} = 3/24 = 0.125$ alınarak güvenilir aralık hesaplanır.',
        en: 'DataPulse sample: 1 return out of 20 ($x=1, n=20$). Agresti-Coull uses $\\tilde{n}=24, \\tilde{p}=3/24=0.125$ for reliable bounds.'
      },
      vocabTerms: [
        { term_en: 'Agresti-Coull interval', explanation_tr: 'Küçük örneklemlerde oran güven aralığını düzeltmek için 4 gözlem ekleyen yöntem.', explanation_en: 'An adjusted confidence interval for binomial proportions providing superior coverage.', exampleSentence_en: 'Agresti-Coull interval avoids zero-width errors when p is near 0 or 1.' }
      ],
      questions: [
        {
          id: 'm5-l5-q1',
          type: 'numeric',
          prompt: { tr: '$n=20$ denemede $x=2$ başarı elde edilirse Agresti-Coull düzeltilmiş oranı $\\tilde{p}$ kaçtır?', en: 'If $x=2$ successes in $n=20$ trials, what is Agresti-Coull $\\tilde{p}$?' },
          correctAnswer: 0.167,
          explanation: { tr: '$$\\tilde{p} = \\frac{2 + 2}{20 + 4} = \\frac{4}{24} \\approx 0.167$$', en: '$$\\tilde{p} = \\frac{2 + 2}{20 + 4} = \\frac{4}{24} \\approx 0.167$$' }
        }
      ],
      realWorldBox: {
        excelFormula: '=(x+2)/(n+4)',
        pythonCode: 'from statsmodels.stats.proportion import proportion_confint\nproportion_confint(count=2, nobs=20, method="agresti_coull")',
        powerBiNote: { tr: 'Müşteri memnuniyet anket oranlarında kullanılır.', en: 'Applied in customer satisfaction proportion analytics.' }
      }
    },
    {
      id: 'm5-l6',
      moduleId: 'module-5',
      order: 6,
      difficulty: 'zor',
      title: { tr: 'Tek Popülasyon Varyansı İçin Güven Aralığı ($\chi^2$)', en: 'Confidence Interval for Population Variance ($\chi^2$)' },
      conceptCard: {
        tr: 'Normal dağılan bir popülasyonun varyansı $\\sigma^2$ için %$100(1-\\alpha)$ Güven Aralığı (`INDR 252 FormulaSheet`):\n\n$$\\left[ \\frac{(n-1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\quad \\frac{(n-1)s^2}{\\chi^2_{1-\\alpha/2, n-1}} \\right]$$\n\n- Ki-kare ($\\chi^2$) dağılımı simetrik değildir ($[0, \\infty)$ aralığında sağa çarpıktır).\n- Standart sapma için bu sınırların karekökü alınır.',
        en: 'Confidence interval for population variance $\\sigma^2$ (`INDR 252 FormulaSheet`):\n\n$$\\left[ \\frac{(n-1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\quad \\frac{(n-1)s^2}{\\chi^2_{1-\\alpha/2, n-1}} \\right]$$\n\n- Chi-square distribution is asymmetric and strictly positive.\n- Take square roots for standard deviation limits.'
      },
      companyExample: {
        tr: 'Fabrikada parça kalınlıklarının varyansı $s^2 = 0.04 \\text{ mm}^2$ ($n=21$). $\\chi^2$ tablosu kullanılarak gerçek popülasyon varyansının sınırları güvenle belirlenir.',
        en: 'Part thickness variance $s^2 = 0.04\\text{ mm}^2$ with $n=21$. $\\chi^2$ critical values yield exact bounds for process variance $\\sigma^2$.'
      },
      vocabTerms: [
        { term_en: 'chi-square distribution', explanation_tr: 'Standart normal değişkenlerin karelerinin toplamı olan asimetrik dağılım.', explanation_en: 'A continuous probability distribution of the sum of squared independent standard normal variables.', exampleSentence_en: 'Chi-square distribution is used to construct confidence intervals for variance.' }
      ],
      questions: [
        {
          id: 'm5-l6-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Popülasyon varyansı $\\sigma^2$ için güven aralığı hesaplanırken hangi dağılım kullanılır?', en: 'Which distribution is used to construct confidence intervals for population variance $\\sigma^2$?' },
          options: [
            { tr: 'Ki-Kare (Chi-Square) Dağılımı', en: 'Chi-Square Distribution' },
            { tr: 'Standart Normal (Z) Dağılımı', en: 'Standard Normal (Z) Distribution' },
            { tr: 'Binom Dağılımı', en: 'Binomial Distribution' },
            { tr: 'Üstel Dağılım', en: 'Exponential Distribution' }
          ],
          correctAnswer: 'Ki-Kare (Chi-Square) Dağılımı',
          explanation: { tr: '$(n-1)s^2 / \\sigma^2$ oranı serbestlik derecesi $n-1$ olan Ki-Kare dağılımına uyar.', en: '$(n-1)s^2 / \\sigma^2$ follows a Chi-square distribution with $df = n-1$.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=(n-1)*s^2 / KİKARE.TERS.SAĞ(0.025; n-1)',
        pythonCode: 'from scipy.stats import chi2\nlower = (n-1)*s2 / chi2.ppf(1-alpha/2, df=n-1)',
        powerBiNote: { tr: 'Üretim kalite kontrol sapma analizinde kullanılır.', en: 'Applied in manufacturing quality variance limits.' }
      }
    },
    {
      id: 'm5-l7',
      moduleId: 'module-5',
      order: 7,
      difficulty: 'zor',
      title: { tr: 'Tahmin Aralığı (PI) vs. Tolerans Aralığı (TI)', en: 'Prediction Interval (PI) vs. Tolerance Interval (TI)' },
      conceptCard: {
        tr: 'Üç kritik aralığın farkı (`INDR 252 Lecture 10`, `CEx10`):\n\n1. **Güven Aralığı (CI):** Ortalama $\\mu$\'yü kapsar: $\\bar{x} \\pm t s \\sqrt{\\frac{1}{n}}$\n2. **Tahmin Aralığı (Prediction Interval - PI):** Gelecekteki **tek bir $X_0$ gözlemini** kapsar (daha geniştir):\n$$\\bar{x} \\pm t_{\\alpha/2, n-1} s \\sqrt{1 + \\frac{1}{n}}$$\n3. **Tolerans Aralığı (Tolerance Interval - TI):** Popülasyonun en az $\%k$\'sını $\%100(1-\\alpha)$ güvenle kapsayan aralıktır: $\\bar{x} \\pm k_2 s$.',
        en: 'Comparison of three statistical intervals (`INDR 252 Lecture 10`, `CEx10`):\n\n1. **Confidence Interval (CI):** Captures mean $\\mu$: $\\bar{x} \\pm t s \\sqrt{1/n}$\n2. **Prediction Interval (PI):** Captures a single future observation $X_0$ (wider):\n$$\\bar{x} \\pm t_{\\alpha/2, n-1} s \\sqrt{1 + 1/n}$$\n3. **Tolerance Interval (TI):** Captures at least $k\\%$ of the entire population with $100(1-\\alpha)\\%$ confidence: $\\bar{x} \\pm k_2 s$.'
      },
      companyExample: {
        tr: 'VoltPower batarya üretiminde: Ortalama ömür için CI: $[48, 52]$ saat; müşteriye satılacak tek bir bataryanın ömrü için PI: $[40, 60]$ saat; tüm üretimin %90\'ı için TI: $[38, 62]$ saattir (`CEx10`).',
        en: 'VoltPower battery: CI for mean: $[48, 52]$h; PI for next single customer unit: $[40, 60]$h; TI for $90\\%$ of population: $[38, 62]$h (`CEx10`).'
      },
      vocabTerms: [
        { term_en: 'prediction interval', explanation_tr: 'Gelecekteki tekil bir gözlemin düşeceği beklenen aralık (PI).', explanation_en: 'An estimate of an interval in which a future observation will fall.', exampleSentence_en: 'Prediction interval is always wider than the confidence interval for the mean.' }
      ],
      questions: [
        {
          id: 'm5-l7-q1',
          type: 'multiple_choice',
          prompt: { tr: 'Aynı veri setinde %95 Güven Aralığı (CI) ile %95 Tahmin Aralığı (PI) genişliği kıyaslandığında hangisi DOĞRUDUR?', en: 'Comparing the widths of 95% CI vs 95% PI for the same dataset, which is TRUE?' },
          options: [
            { tr: 'Tahmin Aralığı (PI) her zaman Güven Aralığından (CI) daha geniştir', en: 'Prediction Interval (PI) is always wider than Confidence Interval (CI)' },
            { tr: 'Güven Aralığı (CI) her zaman daha geniştir', en: 'Confidence Interval (CI) is always wider' },
            { tr: 'İki aralık tamamen eşittir', en: 'Both intervals are identical' },
            { tr: 'PI yalnızca n > 100 iken hesaplanabilir', en: 'PI can only be computed when n > 100' }
          ],
          correctAnswer: 'Tahmin Aralığı (PI) her zaman Güven Aralığından (CI) daha geniştir',
          explanation: { tr: 'PI tek bir yeni gözlemin bireysel değişkenliğini de ($s^2$) içerdiği için formülde $\\sqrt{1 + 1/n}$ çarpanı vardır ve her zaman daha geniştir.', en: 'PI includes individual variance with $\\sqrt{1 + 1/n}$, making it strictly wider than CI.' }
        }
      ],
      realWorldBox: {
        excelFormula: '=t * s * KAREKÖK(1 + 1/n)',
        pythonCode: 'pi_lower = x_bar - t_crit * s * np.sqrt(1 + 1/n)',
        powerBiNote: { tr: 'Garanti süreleri ve SLA taahhütlerinde PI ve TI kullanılır.', en: 'Used for SLA guarantees and warranty policy definition.' }
      }
    }
  ];
  return m;
});

console.log('Finished updating Modules 1 to 5.');
