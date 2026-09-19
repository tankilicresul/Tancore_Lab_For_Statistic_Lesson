const fs = require('fs');
const path = require('path');

// Helper to write updated module json
function updateModule(filename, updaterFn) {
  const fpath = path.join('src', 'data', filename);
  const data = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const updated = updaterFn(data);
  fs.writeFileSync(fpath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`Updated ${filename}: ${updated.lessons.length} lessons, ${updated.caseExams.length} cases.`);
}

// -------------------------------------------------------------
// MODULE 1: Tanımlayıcı İstatistik & EDA
// -------------------------------------------------------------
updateModule('module1.json', (m) => {
  const origOrientation = m.lessons[0];
  const origMean = m.lessons.find(l => l.id === 'm1-l1') || m.lessons[1];
  const origMedian = m.lessons.find(l => l.id === 'm1-l2') || m.lessons[2];
  const origMode = m.lessons.find(l => l.id === 'm1-l3') || m.lessons[3];

  m.lessons = [
    origOrientation,
    {
      id: 'm1-l1',
      moduleId: 'module-1',
      order: 2,
      difficulty: 'basit',
      title: {
        tr: 'Veri Türleri (Kategorik vs. Sayısal)',
        en: 'Data Types (Categorical vs. Numerical)'
      },
      conceptCard: {
        tr: 'İstatistikte veriler temel olarak ikiye ayrılır:\n\n1. **Kategorik (Nitel) Veriler:**\n- **Nominal:** Sırasız etiketler (Cinsiyet, Departman, Kan grubu)\n- **Ordinal:** Doğal sıralı kategoriler (Memnuniyet derecesi 1-5, Eğitim seviyesi)\n\n2. **Sayısal (Nicel) Veriler:**\n- **Kesikli (Discrete):** Sayılabilir tam değerler (Kusurlu ürün sayısı, Çağrı adedi)\n- **Sürekli (Continuous):** Ölçülebilir reel değerler (Boy, Ağırlık, Ciro, Süre)',
        en: 'Data is primarily classified into:\n\n1. **Categorical (Qualitative) Data:**\n- **Nominal:** Unordered labels (Gender, Department, Blood type)\n- **Ordinal:** Naturally ordered categories (Satisfaction rating 1-5, Education level)\n\n2. **Numerical (Quantitative) Data:**\n- **Discrete:** Countable integer values (Defect count, Call volume)\n- **Continuous:** Measurable real values (Height, Weight, Revenue, Duration)'
      },
      companyExample: {
        tr: 'NovaMarket veri tabanında: Müşteri Şehri = Nominal, Üyelik Statüsü (Bronz/Gümüş/Altın) = Ordinal, Sepetteki Ürün Sayısı = Kesikli Sayısal, Sepet Tutarı ($) = Sürekli Sayısal olarak modellenir.',
        en: 'In NovaMarket database: Customer City = Nominal, Membership Tier (Bronze/Silver/Gold) = Ordinal, Item Count = Discrete Numerical, Cart Value ($) = Continuous Numerical.'
      },
      vocabTerms: [
        {
          term_en: 'categorical data',
          explanation_tr: 'Nitelik ve grupları temsil eden veri türü.',
          explanation_en: 'Data representing qualitative attributes or groups.',
          exampleSentence_en: 'Customer segment is a categorical variable.'
        },
        {
          term_en: 'continuous variable',
          explanation_tr: 'Belirli bir aralıkta kesintisiz değerler alabilen sayısal değişken.',
          explanation_en: 'A numerical variable that can take infinite values within a range.',
          exampleSentence_en: 'Delivery duration is a continuous variable.'
        }
      ],
      questions: [
        {
          id: 'm1-l1-q1',
          type: 'multiple_choice',
          prompt: {
            tr: "Bir çağrı merkezinde 'Müşteri Memnuniyet Derecesi (1: Çok Kötü ... 5: Çok İyi)' değişkeni hangi veri türüne girer?",
            en: "In a call center, what data type is 'Customer Satisfaction Rating (1: Very Poor ... 5: Excellent)'?"
          },
          options: [
            { tr: 'Nominal Kategorik', en: 'Nominal Categorical' },
            { tr: 'Ordinal (Sıralı) Kategorik', en: 'Ordinal Categorical' },
            { tr: 'Sürekli Sayısal', en: 'Continuous Numerical' },
            { tr: 'Rassal Süreç', en: 'Random Process' }
          ],
          correctAnswer: 'Ordinal (Sıralı) Kategorik',
          explanation: {
            tr: 'Kategoriler arasında hiyerarşik bir derece sıralaması olduğu için Ordinal kategorik değişkendir.',
            en: 'Because there is a natural hierarchical ordering, it is an Ordinal categorical variable.'
          }
        }
      ],
      realWorldBox: {
        excelFormula: '=EĞER(ESAYIYSA(A2); "Sayısal"; "Kategorik")',
        pythonCode: 'import pandas as pd\ndf["tier"] = df["tier"].astype("category")',
        powerBiNote: {
          tr: 'Sütun tipini Text veya Whole Number olarak ayarlayın.',
          en: 'Set column data type to Text or Whole Number.'
        }
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
      title: {
        tr: 'Çeyreklikler ($Q_1, Q_2, Q_3$) ve Ranj',
        en: 'Quartiles ($Q_1, Q_2, Q_3$) and Range'
      },
      conceptCard: {
        tr: 'Veri yayılımını özetleyen temel parçalanmalar:\n\n1. **Ranj (Açıklık):** $\\text{Ranj} = x_{max} - x_{min}$\n2. **Birinci Çeyreklik ($Q_1$):** Verilerin %25\'inin altında kaldığı 25. yüzdelik.\n3. **İkinci Çeyreklik ($Q_2$):** Medyan (50. yüzdelik).\n4. **Üçüncü Çeyreklik ($Q_3$):** Verilerin %75\'inin altında kaldığı 75. yüzdelik.\n5. **Çeyrekler Açıklığı ($IQR$):** $IQR = Q_3 - Q_1$ (Orta %50\'lik çekirdek yayılım).',
        en: 'Key partitioning metrics for data spread:\n\n1. **Range:** $\\text{Range} = x_{max} - x_{min}$\n2. **First Quartile ($Q_1$):** 25th percentile (25% below).\n3. **Second Quartile ($Q_2$):** Median (50th percentile).\n4. **Third Quartile ($Q_3$):** 75th percentile (75% below).\n5. **Interquartile Range ($IQR$):** $IQR = Q_3 - Q_1$ (Spread of middle 50%).'
      },
      companyExample: {
        tr: 'Sipariş tutarları sıralandığında $Q_1 = 40\\$$, $Q_3 = 120\\$$ bulunmuştur. Çeyrekler açıklığı $IQR = 120 - 40 = 80\\$$\'dır.',
        en: 'When orders are sorted, $Q_1 = \\$40$ and $Q_3 = \\$120$. Interquartile range $IQR = 120 - 40 = \\$80$.'
      },
      vocabTerms: [
        {
          term_en: 'interquartile range',
          explanation_tr: 'Üçüncü ve birinci çeyreklik arasındaki fark ($IQR$).',
          explanation_en: 'Difference between the 3rd and 1st quartiles ($IQR$).',
          exampleSentence_en: 'IQR represents the spread of the middle 50% of the dataset.'
        }
      ],
      questions: [
        {
          id: 'm1-l5-q1',
          type: 'numeric',
          prompt: {
            tr: '$Q_1 = 30$ ve $Q_3 = 95$ olan bir veri setinde $IQR$ kaçtır?',
            en: 'For a dataset with $Q_1 = 30$ and $Q_3 = 95$, what is $IQR$?'
          },
          correctAnswer: 65,
          explanation: {
            tr: '$$IQR = Q_3 - Q_1 = 95 - 30 = 65$$',
            en: '$$IQR = Q_3 - Q_1 = 95 - 30 = 65$$'
          }
        }
      ],
      realWorldBox: {
        excelFormula: '=DÖRTTEBİRLİK.DÂHİL(A1:A100; 3) - DÖRTTEBİRLİK.DÂHİL(A1:A100; 1)',
        pythonCode: 'import numpy as np\nq75, q25 = np.percentile(data, [75, 25])\niqr = q75 - q25',
        powerBiNote: {
          tr: 'Box & Whisker görselinde IQR otomatik gösterilir.',
          en: 'IQR is rendered automatically in Box & Whisker visuals.'
        }
      }
    },
    {
      id: 'm1-l6',
      moduleId: 'module-1',
      order: 7,
      difficulty: 'orta',
      title: {
        tr: 'Varyans ve Serbestlik Derecesi ($n-1$)',
        en: 'Variance and Degrees of Freedom ($n-1$)'
      },
      conceptCard: {
        tr: 'Varyans, gözlemlerin ortalamadan sapmalarının karelerinin ortalamasıdır:\n\n1. **Popülasyon Varyansı ($\\sigma^2$):** $\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^N (X_i - \\mu)^2$\n2. **Örneklem Varyansı ($s^2$):** $s^2 = \\frac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})^2$\n\n**Neden $n-1$ (Bessel Düzeltmesi)?**\nÖrneklem ortalaması $\\bar{x}$, anakütle $\\mu$\'ye göre örneklem verisine daha yakın olduğundan sapmayı underestimate eder. $n-1$ serbestlik derecesi kullanarak $s^2$\'nin **sapmasız (unbiased)** olması sağlanır ($E[s^2] = \\sigma^2$).',
        en: 'Variance measures average squared deviations from the mean:\n\n1. **Population Variance ($\\sigma^2$):** $\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^N (X_i - \\mu)^2$\n2. **Sample Variance ($s^2$):** $s^2 = \\frac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})^2$\n\n**Why $n-1$ (Bessel Correction)?**\nDividing by $n-1$ compensates for sample bias, ensuring $s^2$ is an **unbiased estimator** ($E[s^2] = \\sigma^2$).'
      },
      companyExample: {
        tr: 'İki sunucunun ortalama gecikmesi 50 ms iken, 1. sunucunun varyansı $s_1^2 = 4 \\text{ ms}^2$, 2. sunucunun varyansı $s_2^2 = 400 \\text{ ms}^2$ çıkmıştır. 2. sunucu kararsızdır.',
        en: 'Both servers average 50ms, but Server 1 has variance $4\\text{ ms}^2$ while Server 2 has $400\\text{ ms}^2$, revealing high instability.'
      },
      vocabTerms: [
        {
          term_en: 'degrees of freedom',
          explanation_tr: 'Bir istatistik hesabında bağımsızca değişebilen değer adedi ($n-1$).',
          explanation_en: 'Number of values free to vary in a final statistical calculation.',
          exampleSentence_en: 'Sample variance uses n-1 degrees of freedom.'
        }
      ],
      questions: [
        {
          id: 'm1-l6-q1',
          type: 'numeric',
          prompt: {
            tr: '$n = 6$ gözlemde kareler toplamı $\\sum (x_i - \\bar{x})^2 = 50$ ise örneklem varyansı $s^2$ kaçtır?',
            en: 'For $n = 6$, if sum of squared deviations $\\sum (x_i - \\bar{x})^2 = 50$, what is $s^2$?'
          },
          correctAnswer: 10,
          explanation: {
            tr: '$$s^2 = \\frac{50}{6-1} = \\frac{50}{5} = 10$$',
            en: '$$s^2 = \\frac{50}{6-1} = \\frac{50}{5} = 10$$'
          }
        }
      ],
      realWorldBox: {
        excelFormula: '=VAR.S(A1:A10)',
        pythonCode: 'import numpy as np\nnp.var(data, ddof=1)',
        powerBiNote: {
          tr: 'DAX: VAR.S(Tablo[Değer])',
          en: 'DAX: VAR.S(Table[Value])'
        }
      }
    },
    {
      id: 'm1-l7',
      moduleId: 'module-1',
      order: 8,
      difficulty: 'orta',
      title: {
        tr: 'Standart Sapma ve Değişim Katsayısı ($CV$)',
        en: 'Standard Deviation and Coefficient of Variation ($CV$)'
      },
      conceptCard: {
        tr: 'Varyansın karesel birimini orijinal birime çevirmek ve bağıl riski ölçmek için kullanılır:\n\n1. **Standart Sapma ($s$):** $s = \\sqrt{s^2}$\n2. **Değişim Katsayısı ($CV$):**\n$$CV = \\frac{s}{\\bar{x}} \\times 100\\%$$\nFarklı birim veya ölçekteki veri gruplarının nispi değişkenliğini kıyaslar.',
        en: 'Used to return variance to original units and evaluate relative risk:\n\n1. **Standard Deviation ($s$):** $s = \\sqrt{s^2}$\n2. **Coefficient of Variation ($CV$):**\n$$CV = \\frac{s}{\\bar{x}} \\times 100\\%$$\nCompares relative variation across datasets with different units or scales.'
      },
      companyExample: {
        tr: 'A hissesi $\\bar{x}=100\\$, s=10\\$ ($CV=10\\%$); B hissesi $\\bar{x}=1000\\$, s=50\\$ ($CV=5\\%$). B hissesi mutlak sapması yüksek olsa da bağıl olarak daha kararlıdır.',
        en: 'Stock A has mean $\\$100$, std dev $\\$10$ ($CV=10\\%$); Stock B has mean $\\$1000$, std dev $\\$50$ ($CV=5\\%$). Stock B is relatively more stable.'
      },
      vocabTerms: [
        {
          term_en: 'coefficient of variation',
          explanation_tr: 'Standart sapmanın ortalamaya bağıl oranı ($s/\\bar{x}$).',
          explanation_en: 'Ratio of standard deviation to mean ($s/\\bar{x}$).',
          exampleSentence_en: 'CV allows unit-independent risk comparison.'
        }
      ],
      questions: [
        {
          id: 'm1-l7-q1',
          type: 'numeric',
          prompt: {
            tr: 'Ortalaması $\\bar{x} = 80$ ve standart sapması $s = 8$ olan sürecin $CV$ yüzdesi kaçtır?',
            en: 'If mean $\\bar{x} = 80$ and $s = 8$, what is the percentage $CV$?'
          },
          correctAnswer: 10,
          explanation: {
            tr: '$$CV = (8 / 80) \\times 100 = 10\\%$$',
            en: '$$CV = (8 / 80) \\times 100 = 10\\%$$'
          }
        }
      ],
      realWorldBox: {
        excelFormula: '=STDSAPMA.S(A1:A10) / ORTALAMA(A1:A10)',
        pythonCode: 'import numpy as np\ncv = (np.std(data, ddof=1) / np.mean(data)) * 100',
        powerBiNote: {
          tr: 'KPI kartlarında volatilite metriği olarak gösterilir.',
          en: 'Rendered as a volatility metric in KPI cards.'
        }
      }
    },
    {
      id: 'm1-l8',
      moduleId: 'module-1',
      order: 9,
      difficulty: 'orta',
      title: {
        tr: 'Aykırı Değer (Outlier) Tespiti ve Boxplot',
        en: 'Outlier Detection and Boxplot Interpretation'
      },
      conceptCard: {
        tr: "Tukey'in $1.5 \\times IQR$ kuralı:\n\n1. **Alt Sınır:** $LF = Q_1 - 1.5 \\times IQR$\n2. **Üst Sınır:** $UF = Q_3 + 1.5 \\times IQR$\n\n$[LF, UF]$ aralığı dışındaki tüm değerler **Aykırı Değer (Outlier)** kabul edilir ve kutu grafiğinde tekil noktalar olarak gösterilir.",
        en: "Tukey's $1.5 \\times IQR$ rule:\n\n1. **Lower Fence:** $LF = Q_1 - 1.5 \\times IQR$\n2. **Upper Fence:** $UF = Q_3 + 1.5 \\times IQR$\n\nPoints outside $[LF, UF]$ are designated as **Outliers**."
      },
      companyExample: {
        tr: 'Siparişlerde $Q_1 = 40\\$, $Q_3 = 120\\$, $IQR = 80\\$. Üst sınır $UF = 120 + 1.5(80) = 240\\$. $300\\$\'lık işlem aykırı değerdir.',
        en: 'Orders: $Q_1 = \\$40, Q_3 = \\$120, IQR = \\$80$. $UF = 120 + 1.5(80) = \\$240$. A $\\$300$ order is flagged as an outlier.'
      },
      vocabTerms: [
        {
          term_en: 'outlier',
          explanation_tr: 'Genel dağılım paterninden belirgin şekilde sapan uç nokta.',
          explanation_en: 'A data point that differs significantly from other observations.',
          exampleSentence_en: 'Outliers can distort mean and variance.'
        }
      ],
      questions: [
        {
          id: 'm1-l8-q1',
          type: 'numeric',
          prompt: {
            tr: '$Q_1 = 20$ ve $Q_3 = 50$ ise Üst Sınır (Upper Fence) kaçtır?',
            en: 'If $Q_1 = 20$ and $Q_3 = 50$, what is the Upper Fence?'
          },
          correctAnswer: 95,
          explanation: {
            tr: '$$IQR = 30, UF = 50 + 1.5(30) = 95$$',
            en: '$$IQR = 30, UF = 50 + 1.5(30) = 95$$'
          }
        }
      ],
      realWorldBox: {
        excelFormula: '=EĞER(A2 > (Q3 + 1.5*IQR); "Outlier"; "Normal")',
        pythonCode: 'import seaborn as sns\nsns.boxplot(x=data)',
        powerBiNote: {
          tr: 'Box & Whisker görseli ile anomaliler incelenir.',
          en: 'Use Box & Whisker to inspect anomalies.'
        }
      }
    },
    {
      id: 'm1-l9',
      moduleId: 'module-1',
      order: 10,
      difficulty: 'orta-ustu',
      title: {
        tr: 'Normallik Olasılık Grafiği (Q-Q Plot) & Çarpıklık',
        en: 'Normal Probability Plot (Q-Q Plot) & Skewness'
      },
      conceptCard: {
        tr: 'Parametrik testlerden önce normallik ve çarpıklık doğrulanmalıdır (`INDR 252 Case Rules`):\n\n1. **Q-Q Plot:** Noktalar $45^\\circ$ köşegen doğru boyunca diziliyorsa veri normale uygundur.\n2. **Çarpıklık (Skewness):**\n- **Sağa Çarpık (Pozitif):** $\\text{Ortalama} > \\text{Medyan}$\n- **Sola Çarpık (Negatif):** $\\text{Ortalama} < \\text{Medyan}$\n\n> **Önemli Kural:** Normallik grafiği rassallığı (randomness) göstermez! Rassallık zaman serisi grafiğiyle bağımsız kontrol edilmelidir.',
        en: 'Normality and skewness verification (`INDR 252 Case Rules`):\n\n1. **Q-Q Plot:** If points follow the $45^\\circ$ reference diagonal line, normality holds.\n2. **Skewness:**\n- **Right Skewed:** $\\text{Mean} > \\text{Median}$\n- **Left Skewed:** $\\text{Mean} < \\text{Median}$\n\n> **Crucial Rule:** Normality plots do not check randomness! Randomness requires time-series inspection.'
      },
      companyExample: {
        tr: 'E-ticaret cirolarında Ortalama = 180 TL, Medyan = 70 TL çıkmıştır. Q-Q grafiğinde sağ üstte eğrilme görülür; veri sağa çarpıktır ve normal dağılmamaktadır.',
        en: 'Revenue data has Mean = $\\$180$, Median = $\\$70$. Q-Q plot curves upward on top right, indicating positive skewness and non-normality.'
      },
      vocabTerms: [
        {
          term_en: 'Q-Q plot',
          explanation_tr: 'Örneklem kuantilleri ile teorik dağılım kuantillerini kıyaslayan grafik.',
          explanation_en: 'Quantile-quantile probability plot verifying distribution assumptions.',
          exampleSentence_en: 'The Q-Q plot points closely follow the straight line.'
        }
      ],
      questions: [
        {
          id: 'm1-l9-q1',
          type: 'multiple_choice',
          prompt: {
            tr: 'Ortalama = 120, Medyan = 75 ve Mod = 60 olan bir gelir dağılımının şekli nasıldır?',
            en: 'If Mean = 120, Median = 75, and Mode = 60, what is the shape of this income distribution?'
          },
          options: [
            { tr: 'Sağa Çarpık (Pozitif Çarpık)', en: 'Right-Skewed (Positive)' },
            { tr: 'Sola Çarpık (Negatif Çarpık)', en: 'Left-Skewed (Negative)' },
            { tr: 'Simetrik Normal', en: 'Symmetric Normal' },
            { tr: 'Tekdüze (Uniform)', en: 'Uniform' }
          ],
          correctAnswer: 'Sağa Çarpık (Pozitif Çarpık)',
          explanation: {
            tr: 'Ortalama > Medyan > Mod ilişkisi verinin sağa çarpık olduğunu kanıtlar.',
            en: 'Mean > Median > Mode indicates a right-skewed distribution with a long upper tail.'
          }
        }
      ],
      realWorldBox: {
        excelFormula: '=ÇARPIKLIK(A1:A100)',
        pythonCode: 'import scipy.stats as stats\nstats.probplot(data, dist="norm", plot=plt)',
        powerBiNote: {
          tr: 'Python Visual ile probplot çizdirilir.',
          en: 'Render probplot via Python Visual in Power BI.'
        }
      }
    }
  ];

  return m;
});
