const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '../src/data');

// ==========================================
// MODULE 1: Tanımlayıcı İstatistik (13 Lessons)
// ==========================================
const m1 = JSON.parse(fs.readFileSync(path.join(modulesDir, 'module1.json'), 'utf8'));
m1.lessons = [
  {
    id: "m1-l0",
    moduleId: "module-1",
    order: 1,
    difficulty: "basit",
    title: { tr: "Ders Tanıtımı & Yol Haritası", en: "Course Introduction & Roadmap" },
    conceptCard: {
      tr: "İstatistiğin amacı, ham veriyi anlamlı içgörülere dönüştürerek belirsizlik altında doğru kararlar almayı sağlamaktır.\n\n**İki Temel Kol:**\n1. **Tanımlayıcı İstatistik:** Mevcut veriyi özetler, görselleştirir ve temel kalıpları ortaya çıkarır.\n2. **Çıkarımsal İstatistik:** Örneklemden hareketle popülasyon hakkında genellemeler yapar.",
      en: "Statistics transforms raw data into actionable insights for decision making under uncertainty.\n\n**Two Pillars:**\n1. **Descriptive:** Summarizes and visualizes data patterns.\n2. **Inferential:** Draws conclusions about populations from samples."
    },
    companyExample: {
      tr: "**Örnek Senaryo:** Bir e-ticaret platformu günlük 50.000 sipariş verisini analiz ederek ortalama sepet tutarını hesaplar ve teslimat sürelerini optimize eder.",
      en: "**Example Scenario:** An e-commerce platform analyzes 50,000 daily orders to compute average basket size and optimize delivery times."
    },
    vocabTerms: [
      {
        term_en: "population vs. sample",
        explanation_tr: "Popülasyon incelenen tüm kitle, örneklem ise bu kitleden seçilen alt gruptur.",
        explanation_en: "Population is the entire group, sample is the subset selected for analysis.",
        exampleSentence_en: "We took a sample of 500 customers from the whole population."
      }
    ],
    questions: [
      {
        id: "m1-l0-q1",
        type: "multiple-choice",
        prompt: {
          tr: "Tüm kitleyi incelemek yerine rastgele seçilen temsilci gruba ne ad verilir?",
          en: "What is the term for a representative subset selected from the entire population?"
        },
        options: [
          { tr: "Örneklem (Sample)", en: "Sample" },
          { tr: "Popülasyon (Population)", en: "Population" },
          { tr: "Parametre (Parameter)", en: "Parameter" },
          { tr: "Varyans (Variance)", en: "Variance" }
        ],
        correctAnswer: 0,
        explanation: {
          tr: "Örneklem (Sample), popülasyondan seçilen ve analize tabi tutulan temsilci alt kümedir.",
          en: "A sample is a representative subset drawn from the whole population."
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=BAĞ_DEĞ_DOLU_SAY(A:A)",
      pythonCode: "import pandas as pd\ndf = pd.read_csv('orders.csv')\nprint(df.describe())",
      powerBiNote: { tr: "Tanımlayıcı istatistikler KPI kartlarında özetlenir.", en: "Descriptive metrics are summarized in KPI cards." }
    }
  },
  {
    id: "m1-l1",
    moduleId: "module-1",
    order: 2,
    difficulty: "basit",
    title: { tr: "Veri Türleri (Kategorik vs. Sayısal)", en: "Data Types (Categorical vs. Numerical)" },
    conceptCard: {
      tr: "Doğru analiz yöntemi verinin ölçek türüne göre belirlenir:\n\n1. **Kategorik (Nitel) Veriler:**\n- **Nominal:** Sıralama yok (Örn: Cinsiyet, Şehir, Kan Grubu).\n- **Ordinal:** Doğal sıralama var (Örn: Memnuniyet düzeyi: Düşük < Orta < Yüksek).\n\n2. **Sayısal (Nicel) Veriler:**\n- **Aralık (Interval):** Mutlak sıfır yok, farklar anlamlı (Örn: Sıcaklık °C).\n- **Oran (Ratio):** Mutlak gerçek sıfır var (Örn: Gelir, Yaş, Sipariş Tutarı).",
      en: "Data scale dictates valid statistical methods:\n\n1. **Categorical:**\n- **Nominal:** Unordered labels (City, Gender).\n- **Ordinal:** Ordered ranks (Low < Med < High).\n\n2. **Numerical:**\n- **Interval:** Arbitrary zero (°C temperature).\n- **Ratio:** True absolute zero (Income, Age)."
    },
    companyExample: {
      tr: "**Örnek Soru:** Müşteri memnuniyet anketi (1: Çok Memnuniyetsiz ... 5: Çok Memnun) hangi veri türüdür?\n\n**Çözüm:** Seçenekler arasında hiyerarşik bir sıralama bulunduğu için bu veri **Ordinal (Sıralı Kategorik)** türdedir.",
      en: "**Worked Example:** Customer satisfaction score (1 to 5) belongs to which data type?\n\n**Solution:** Because categories follow a natural order, it is an **Ordinal** variable."
    },
    vocabTerms: [
      {
        term_en: "ratio scale",
        explanation_tr: "Mutlak sıfır noktasına sahip, oranlama yapılabilen en güçlü sayısal ölçektir.",
        explanation_en: "Measurement scale with a true zero point, allowing ratio comparisons.",
        exampleSentence_en: "Income is measured on a ratio scale because zero means absence of income."
      }
    ],
    questions: [
      {
        id: "m1-l1-q1",
        type: "multiple-choice",
        prompt: {
          tr: "Bir depodaki aylık stok miktarı (adet) hangi ölçek türüne girer?",
          en: "Monthly warehouse stock count belongs to which scale?"
        },
        options: [
          { tr: "Oran Ölçeği (Ratio)", en: "Ratio Scale" },
          { tr: "Nominal Ölçek", en: "Nominal Scale" },
          { tr: "Ordinal Ölçek", en: "Ordinal Scale" },
          { tr: "Aralık Ölçeği (Interval)", en: "Interval Scale" }
        ],
        correctAnswer: 0,
        explanation: {
          tr: "Adet sayılabilir ve 0 adet hiç ürün olmaması anlamına gelir (mutlak sıfır). Dolayısıyla Oran (Ratio) ölçeğidir.",
          en: "Stock count has a true zero (0 items = none), making it a Ratio scale."
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=EĞER(ESAYIYSA(A2), \"Sayısal\", \"Kategorik\")",
      pythonCode: "df.dtypes\ncat_cols = df.select_dtypes(include=['object', 'category']).columns",
      powerBiNote: { tr: "Sütun veri türünü Modeling sekmesinden ayarlayabilirsiniz.", en: "Adjust column data types in Modeling tab." }
    }
  },
  {
    id: "m1-l2",
    moduleId: "module-1",
    order: 3,
    difficulty: "basit",
    title: { tr: "Aritmetik Ortalama (Mean)", en: "Arithmetic Mean" },
    conceptCard: {
      tr: "Aritmetik ortalama, tüm gözlem değerlerinin toplanıp toplam gözlem sayısına bölünmesiyle elde edilen merkezi eğilim ölçüsüdür:\n\n$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i$$\n\n**Önemli Özellik:** Aşırı uç (aykırı) değerlere karşı oldukça duyarlıdır.",
      en: "The arithmetic mean sums all observations and divides by total count:\n\n$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i$$\n\n**Key Trait:** Highly sensitive to extreme outliers."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir çağrı merkezinde 5 temsilcinin çözdüğü çağrı sayıları: 12, 18, 15, 25, 30. Ortalama çağrı sayısı kaçtır?\n\n**Çözüm:**\n$$\\bar{x} = \\frac{12 + 18 + 15 + 25 + 30}{5} = \\frac{100}{5} = 20$$",
      en: "**Worked Example:** Calls handled: 12, 18, 15, 25, 30. Calculate the mean.\n\n**Solution:**\n$$\\bar{x} = \\frac{100}{5} = 20$$"
    },
    vocabTerms: [
      {
        term_en: "arithmetic mean",
        explanation_tr: "Tüm değerlerin toplamının gözlem sayısına oranıdır.",
        explanation_en: "Sum of values divided by number of values.",
        exampleSentence_en: "The mean response time was 20 milliseconds."
      }
    ],
    questions: [
      {
        id: "m1-l2-q1",
        type: "numeric",
        prompt: {
          tr: "Veri seti: 10, 20, 30, 40, 50. Bu verilerin aritmetik ortalaması kaçtır?",
          en: "Dataset: 10, 20, 30, 40, 50. What is the arithmetic mean?"
        },
        correctAnswer: 30,
        explanation: {
          tr: "$$\\bar{x} = \\frac{10+20+30+40+50}{5} = \\frac{150}{5} = 30$$",
          en: "$$\\bar{x} = \\frac{150}{5} = 30$$"
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=ORTALAMA(A1:A50)",
      pythonCode: "import numpy as np\nmean_val = np.mean([10, 20, 30, 40, 50])",
      powerBiNote: { tr: "DAX: AVERAGE(Sales[Amount])", en: "DAX: AVERAGE(Sales[Amount])" }
    }
  },
  {
    id: "m1-l3",
    moduleId: "module-1",
    order: 4,
    difficulty: "basit",
    title: { tr: "Medyan (Median / Ortanca)", en: "Median" },
    conceptCard: {
      tr: "Medyan, küçükten büyüğe sıralanmış bir veri setinde tam ortada yer alan değerdir.\n\n- Gözlem sayısı $n$ tek ise: $\\frac{n+1}{2}$. sıradaki değerdir.\n- Gözlem sayısı $n$ çift ise: Ortadaki iki değerin aritmetik ortalamasıdır.\n\n**Avantajı:** Aykırı değerlerden etkilenmez (sağlam/robust ölçü).",
      en: "The median is the middle value in a sorted dataset.\n\n- If $n$ is odd: value at index $\\frac{n+1}{2}$.\n- If $n$ is even: average of the two middle values.\n\n**Advantage:** Robust to extreme outliers."
    },
    companyExample: {
      tr: "**Örnek Soru:** 6 çalışanın maaşları (bin TL): 20, 25, 30, 35, 40, 300. Medyan maaş kaçtır?\n\n**Çözüm:** Sıralı dizide ortadaki iki değer 30 ve 35'tir:\n$$\\text{Medyan} = \\frac{30 + 35}{2} = 32.5 \\text{ bin TL}$$",
      en: "**Worked Example:** Salaries in kTL: 20, 25, 30, 35, 40, 300. Find median.\n\n**Solution:** Middle two numbers are 30 and 35:\n$$\\text{Median} = \\frac{30 + 35}{2} = 32.5$$"
    },
    vocabTerms: [
      {
        term_en: "median",
        explanation_tr: "Sıralanmış veriyi tam %50 - %50 ikiye bölen ortanca değer.",
        explanation_en: "The middle score that divides ranked data into two equal halves.",
        exampleSentence_en: "Median income is preferred when data is highly skewed."
      }
    ],
    questions: [
      {
        id: "m1-l3-q1",
        type: "numeric",
        prompt: {
          tr: "Sıralı veri seti: 4, 7, 9, 12, 18. Bu verilerin medyanı kaçtır?",
          en: "Sorted dataset: 4, 7, 9, 12, 18. What is the median?"
        },
        correctAnswer: 9,
        explanation: {
          tr: "5 gözlemli tek sayılı dizide ortadaki 3. eleman 9'dur.",
          en: "For 5 elements, the 3rd element is 9."
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=ORTANCA(A1:A50)",
      pythonCode: "import numpy as np\nmed = np.median([4, 7, 9, 12, 18])",
      powerBiNote: { tr: "DAX: MEDIAN(Sales[Amount])", en: "DAX: MEDIAN(Sales[Amount])" }
    }
  },
  {
    id: "m1-l4",
    moduleId: "module-1",
    order: 5,
    difficulty: "basit",
    title: { tr: "Mod (Mode / Tepe Değer)", en: "Mode" },
    conceptCard: {
      tr: "Mod (Tepe Değer), bir veri setinde en sık (en yüksek frekansla) tekrar eden değerdir.\n\n- Bir veride tek bir mod olabilir (Unimodal).\n- İki farklı mod olabilir (Bimodal).\n- Hiçbir tekrar yoksa mod bulunmayabilir.\n\n**Kullanım Alanı:** Kategorik verilerde merkezi eğilimi ölçmek için en uygun metriktir.",
      en: "The mode is the value that appears most frequently in a dataset.\n\n- Can be unimodal, bimodal, or multimodal.\n- Uniquely applicable to categorical nominal data."
    },
    companyExample: {
      tr: "**Örnek Soru:** Mağazada satılan tişört bedenleri: M, L, S, M, XL, M, L. Mod nedir?\n\n**Çözüm:** 'M' bedeni 3 kez tekrar ederek en yüksek frekansa ulaştığı için Mod = 'M'dir.",
      en: "**Worked Example:** T-shirt sizes sold: M, L, S, M, XL, M, L. What is the mode?\n\n**Solution:** 'M' appears 3 times, so Mode = 'M'."
    },
    vocabTerms: [
      {
        term_en: "mode",
        explanation_tr: "Veri kümesinde en çok tekrar eden değer veya kategori.",
        explanation_en: "The most frequently occurring value in a data set.",
        exampleSentence_en: "The modal category of product defect was packaging."
      }
    ],
    questions: [
      {
        id: "m1-l4-q1",
        type: "numeric",
        prompt: {
          tr: "Veri seti: 3, 5, 8, 8, 8, 12, 15. Bu veri setinin modu kaçtır?",
          en: "Dataset: 3, 5, 8, 8, 8, 12, 15. What is the mode?"
        },
        correctAnswer: 8,
        explanation: {
          tr: "8 sayısı 3 kez tekrarlayarak en yüksek frekansa sahiptir, mod = 8'dir.",
          en: "8 occurs 3 times (highest frequency), so mode = 8."
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=ENÇOK_OLAN.TEK(A1:A50)",
      pythonCode: "from scipy import stats\nmode_val = stats.mode([3, 5, 8, 8, 8, 12, 15])",
      powerBiNote: { tr: "DAX: TOPN(1, VALUES(Sales[Product]), [Count], DESC)", en: "DAX: TOPN for highest frequency category" }
    }
  },
  {
    id: "m1-l5",
    moduleId: "module-1",
    order: 6,
    difficulty: "basit",
    title: { tr: "Ranj (Range / Açıklık)", en: "Range" },
    conceptCard: {
      tr: "Ranj, bir veri kümesindeki en büyük (maksimum) değer ile en küçük (minimum) değer arasındaki farktır:\n\n$$\\text{Ranj} = x_{\\max} - x_{\\min}$$\n\n**Kullanımı:** Yayılımı hesaplamanın en hızlı yoludur ancak aradaki değerlerin nasıl dağıldığı hakkında bilgi vermez.",
      en: "Range is the difference between maximum and minimum values:\n\n$$\\text{Range} = x_{\\max} - x_{\\min}$$\n\n**Usage:** Quickest measure of dispersion, but relies only on extremes."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir kargo teslimat süresi verileri (dakika): 15, 22, 18, 45, 12. Ranj kaçtır?\n\n**Çözüm:**\n$$\\text{Ranj} = 45 - 12 = 33 \\text{ dakika}$$",
      en: "**Worked Example:** Delivery times: 15, 22, 18, 45, 12. Compute range.\n\n**Solution:**\n$$\\text{Range} = 45 - 12 = 33$$"
    },
    vocabTerms: [
      {
        term_en: "range",
        explanation_tr: "Maksimum ve minimum gözlemler arasındaki toplam açıklık.",
        explanation_en: "The distance between the largest and smallest measurements.",
        exampleSentence_en: "The price range spans from 12 to 45 dollars."
      }
    ],
    questions: [
      {
        id: "m1-l5-q1",
        type: "numeric",
        prompt: {
          tr: "Veri seti: 50, 62, 75, 95, 30. Bu veri setinin ranjı kaçtır?",
          en: "Dataset: 50, 62, 75, 95, 30. What is the range?"
        },
        correctAnswer: 65,
        explanation: {
          tr: "$$\\text{Ranj} = x_{\\max} - x_{\\min} = 95 - 30 = 65$$",
          en: "$$\\text{Range} = 95 - 30 = 65$$"
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=MAK(A1:A50) - MİN(A1:A50)",
      pythonCode: "r = np.ptp([50, 62, 75, 95, 30])  # peak-to-peak",
      powerBiNote: { tr: "DAX: MAX(Table[Col]) - MIN(Table[Col])", en: "DAX: MAX(Table[Col]) - MIN(Table[Col])" }
    }
  },
  {
    id: "m1-l6",
    moduleId: "module-1",
    order: 7,
    difficulty: "orta",
    title: { tr: "Çeyreklikler ($Q_1, Q_2, Q_3$) & IQR", en: "Quartiles & Interquartile Range (IQR)" },
    conceptCard: {
      tr: "Çeyreklikler, sıralı veriyi 4 eşit parçaya bölen 3 noktadır:\n\n- **$Q_1$ (1. Çeyreklik):** Verinin %25'inin altında kaldığı değer.\n- **$Q_2$ (2. Çeyreklik):** Medyan (%50).\n- **$Q_3$ (3. Çeyreklik):** Verinin %75'inin altında kaldığı değer.\n- **Çeyrekler Açıklığı (IQR):** Ortadaki %50'lik ana kütlenin yayılımıdır:\n\n$$\\text{IQR} = Q_3 - Q_1$$",
      en: "Quartiles partition ordered data into 4 quarters:\n\n- $Q_1$: 25th percentile.\n- $Q_2$: 50th percentile (Median).\n- $Q_3$: 75th percentile.\n- $\\text{IQR} = Q_3 - Q_1$ (spread of middle 50%)."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir web sitesi bekleme süresinde $Q_1 = 4$ sn, $Q_3 = 12$ sn olarak ölçülmüştür. IQR nedir?\n\n**Çözüm:**\n$$\\text{IQR} = Q_3 - Q_1 = 12 - 4 = 8 \\text{ sn}$$",
      en: "**Worked Example:** Latency quartiles: $Q_1 = 4$, $Q_3 = 12$. Calculate IQR.\n\n**Solution:**\n$$\\text{IQR} = 12 - 4 = 8$$"
    },
    vocabTerms: [
      {
        term_en: "interquartile range (IQR)",
        explanation_tr: "3. çeyreklik ile 1. çeyreklik arasındaki farktır, uç değerlere dirençlidir.",
        explanation_en: "The range of the central 50% of values: Q3 - Q1.",
        exampleSentence_en: "IQR is used to define boxplot whisker boundaries."
      }
    ],
    questions: [
      {
        id: "m1-l6-q1",
        type: "numeric",
        prompt: {
          tr: "Bir veri kümesinde $Q_1 = 15$ ve $Q_3 = 35$ olduğuna göre IQR değeri kaçtır?",
          en: "If $Q_1 = 15$ and $Q_3 = 35$, what is the IQR?"
        },
        correctAnswer: 20,
        explanation: {
          tr: "$$\\text{IQR} = Q_3 - Q_1 = 35 - 15 = 20$$",
          en: "$$\\text{IQR} = 35 - 15 = 20$$"
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=DÖRTTEBİRLİK.DAHİL(A1:A50, 3) - DÖRTTEBİRLİK.DAHİL(A1:A50, 1)",
      pythonCode: "from scipy.stats import iqr\nval = iqr(data)",
      powerBiNote: { tr: "Boxplot görselinde IQR otomatik hesaplanır.", en: "Boxplot visual auto-computes IQR." }
    }
  },
  {
    id: "m1-l7",
    moduleId: "module-1",
    order: 8,
    difficulty: "orta",
    title: { tr: "Varyans ve Serbestlik Derecesi ($n-1$)", en: "Variance & Degrees of Freedom ($n-1$)" },
    conceptCard: {
      tr: "Varyans, her bir veri noktasının ortalamadan olan uzaklıklarının karelerinin ortalamasıdır.\n\n**Örneklem Varyansı Formülü:**\n$$s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2$$\n\n**Neden $n-1$?** (Bessel Düzeltmesi): Örneklem varyansının popülasyon varyansını sapmasız (unbiased) tahmin etmesini sağlar.",
      en: "Variance measures average squared deviations from the mean.\n\n**Sample Variance:**\n$$s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2$$\n\n**Why $n-1$?** Bessel's correction removes sample estimation bias."
    },
    companyExample: {
      tr: "**Örnek Soru:** 3 gözlemli bir örneklem: 2, 4, 6 (Ortalama = 4). Örneklem varyansı $s^2$ kaçtır?\n\n**Çözüm:**\n$$(2-4)^2 + (4-4)^2 + (6-4)^2 = 4 + 0 + 4 = 8$$\n$$s^2 = \\frac{8}{3-1} = \\frac{8}{2} = 4$$",
      en: "**Worked Example:** Sample: 2, 4, 6 (Mean = 4). Calculate sample variance $s^2$.\n\n**Solution:**\n$$s^2 = \\frac{(2-4)^2 + 0 + (6-4)^2}{3-1} = \\frac{8}{2} = 4$$"
    },
    vocabTerms: [
      {
        term_en: "degrees of freedom (df)",
        explanation_tr: "Bir parametre tahmin edildikten sonra serbestçe değişebilen bağımsız gözlem sayısıdır ($n-1$).",
        explanation_en: "The number of independent values that are free to vary ($n-1$).",
        exampleSentence_en: "Estimating the sample mean consumes 1 degree of freedom."
      }
    ],
    questions: [
      {
        id: "m1-l7-q1",
        type: "numeric",
        prompt: {
          tr: "Gözlem değerleri 1, 3, 5 olan 3 elemanlı bir örneklemin varyansı ($s^2$) kaçtır?",
          en: "What is the sample variance ($s^2$) of 1, 3, 5?"
        },
        correctAnswer: 4,
        explanation: {
          tr: "Ortalama = 3. Sapmaların kareleri: $(1-3)^2 + (3-3)^2 + (5-3)^2 = 4 + 0 + 4 = 8$. $s^2 = \\frac{8}{3-1} = 4$.",
          en: "Mean = 3. Squared deviations sum = 8. $s^2 = \\frac{8}{2} = 4$."
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=VAR.S(A1:A50)",
      pythonCode: "import numpy as np\nvar = np.var([1, 3, 5], ddof=1)",
      powerBiNote: { tr: "DAX: VARX.S(Table, [Col])", en: "DAX: VARX.S(Table, [Col])" }
    }
  },
  {
    id: "m1-l8",
    moduleId: "module-1",
    order: 9,
    difficulty: "orta",
    title: { tr: "Standart Sapma ($s$)", en: "Standard Deviation ($s$)" },
    conceptCard: {
      tr: "Standart sapma, varyansın kareköküdür. En büyük avantajı, veri ile **aynı birime** sahip olmasıdır:\n\n$$s = \\sqrt{s^2} = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2}$$\n\nStandart sapma ne kadar küçükse, veriler ortalamanın etrafında o kadar sıkı toplanmıştır.",
      en: "Standard deviation is the square root of variance, restoring original data units:\n\n$$s = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2}$$"
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir üretim hattında varyans $s^2 = 16 \\text{ mm}^2$ bulunmuştur. Standart sapma $s$ kaç mm'dir?\n\n**Çözüm:**\n$$s = \\sqrt{16} = 4 \\text{ mm}$$",
      en: "**Worked Example:** Production line variance is $s^2 = 16$. Find standard deviation.\n\n**Solution:**\n$$s = \\sqrt{16} = 4$$"
    },
    vocabTerms: [
      {
        term_en: "standard deviation",
        explanation_tr: "Verilerin ortalamadan ortalama sapma miktarını özgün birimde gösteren yayılım ölçüsü.",
        explanation_en: "Square root of variance, measuring typical distance from the mean.",
        exampleSentence_en: "A standard deviation of 4 mm indicates tight quality tolerance."
      }
    ],
    questions: [
      {
        id: "m1-l8-q1",
        type: "numeric",
        prompt: {
          tr: "Varyansı $s^2 = 49$ olan bir veri setinin standart sapması ($s$) kaçtır?",
          en: "What is the standard deviation ($s$) for variance $s^2 = 49$?"
        },
        correctAnswer: 7,
        explanation: {
          tr: "$$s = \\sqrt{49} = 7$$",
          en: "$$s = \\sqrt{49} = 7$$"
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=STDSAPMA.S(A1:A50)",
      pythonCode: "import numpy as np\nstd = np.std(data, ddof=1)",
      powerBiNote: { tr: "DAX: STDEV.S(Sales[Amount])", en: "DAX: STDEV.S(Sales[Amount])" }
    }
  },
  {
    id: "m1-l9",
    moduleId: "module-1",
    order: 10,
    difficulty: "orta",
    title: { tr: "Değişim Katsayısı ($CV$)", en: "Coefficient of Variation ($CV$)" },
    conceptCard: {
      tr: "Değişim Katsayısı ($CV$), standart sapmanın ortalamaya oranlanmasıyla elde edilen **birimsiz** göreli değişkenlik ölçüsüdür:\n\n$$CV = \\frac{s}{\\bar{x}} \\times 100\\%$$\n\n**Kullanım Alanı:** Farklı birimlere veya çok farklı ölçeklere sahip iki farklı değişkenin risk/oynaklığını karşılaştırmak için kullanılır.",
      en: "Coefficient of variation ($CV$) is unitless relative dispersion:\n\n$$CV = \\frac{s}{\\bar{x}} \\times 100\\%$$\n\n**Purpose:** Compares variability across different units or scales."
    },
    companyExample: {
      tr: "**Örnek Soru:** A hissesinin ortalaması 100 TL, standart sapması 10 TL'dir. B hissesinin ortalaması 10 TL, standart sapması 2 TL'dir. Hangi hisse daha risklidir?\n\n**Çözüm:**\n$$CV_A = \\frac{10}{100} \\times 100 = 10\\%$$\n$$CV_B = \\frac{2}{10} \\times 100 = 20\\%$$\nB hissesi göreli olarak 2 kat daha yüksek oynaklığa ($CV$) sahiptir.",
      en: "**Worked Example:** Stock A: $\\bar{x}=100, s=10$. Stock B: $\\bar{x}=10, s=2$. Compare risks.\n\n**Solution:** $CV_A = 10\\%$, $CV_B = 20\\%$. Stock B is relatively twice as volatile."
    },
    vocabTerms: [
      {
        term_en: "coefficient of variation (CV)",
        explanation_tr: "Standart sapmanın ortalamaya yüzdelik oranı olan birimsiz risk metriği.",
        explanation_en: "Ratio of standard deviation to mean expressed as a percentage.",
        exampleSentence_en: "Financial analysts use CV to assess risk-to-reward ratio."
      }
    ],
    questions: [
      {
        id: "m1-l9-q1",
        type: "numeric",
        prompt: {
          tr: "Bir veri setinde $\\bar{x} = 50$ ve $s = 10$ olduğuna göre Değişim Katsayısı ($CV$) yüzde kaçtır?",
          en: "If $\\bar{x} = 50$ and $s = 10$, what is the percentage $CV$?"
        },
        correctAnswer: 20,
        explanation: {
          tr: "$$CV = \\frac{s}{\\bar{x}} \\times 100 = \\frac{10}{50} \\times 100 = 20\\%$$",
          en: "$$CV = \\frac{10}{50} \\times 100 = 20\\%$$"
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=(STDSAPMA.S(A1:A50)/ORTALAMA(A1:A50))*100",
      pythonCode: "cv = (np.std(data, ddof=1) / np.mean(data)) * 100",
      powerBiNote: { tr: "DAX: DIVIDE([StdDev], [Mean])", en: "DAX: DIVIDE([StdDev], [Mean])" }
    }
  },
  {
    id: "m1-l10",
    moduleId: "module-1",
    order: 11,
    difficulty: "orta",
    title: { tr: "Aykırı Değer (Outlier) ve Boxplot", en: "Outlier Detection & Boxplot" },
    conceptCard: {
      tr: "Tukey'in 1.5 IQR Kuralı ile aykırı değer sınırları hesaplanır:\n\n- **Alt Sınır:** $\\text{Alt} = Q_1 - 1.5 \\times \\text{IQR}$\n- **Üst Sınır:** $\\text{Üst} = Q_3 + 1.5 \\times \\text{IQR}$\n\nBu sınırların dışında kalan noktalar **aykırı değer (outlier)** olarak kabul edilir.",
      en: "Tukey's 1.5 IQR fences identify anomalies:\n\n- $\\text{Lower} = Q_1 - 1.5 \\times \\text{IQR}$\n- $\\text{Upper} = Q_3 + 1.5 \\times \\text{IQR}$"
    },
    companyExample: {
      tr: "**Örnek Soru:** $Q_1 = 20$, $Q_3 = 40$ ($\text{IQR} = 20$). Üst sınır nedir?\n\n**Çözüm:**\n$$\\text{Üst Sınır} = 40 + (1.5 \\times 20) = 40 + 30 = 70$$\n70'in üzerindeki tüm değerler aykırı değerdir.",
      en: "**Worked Example:** $Q_1 = 20, Q_3 = 40$ ($\\text{IQR}=20$). Calculate upper fence.\n\n**Solution:** $\\text{Upper} = 40 + 1.5(20) = 70$."
    },
    vocabTerms: [
      {
        term_en: "outlier",
        explanation_tr: "Genel veri örüntüsünden belirgin şekilde sapan aşırı uç gözlem.",
        explanation_en: "An observation that lies an abnormal distance from other values.",
        exampleSentence_en: "The transaction of 1M dollars was flagged as an outlier."
      }
    ],
    questions: [
      {
        id: "m1-l10-q1",
        type: "numeric",
        prompt: {
          tr: "$Q_1 = 10$ ve $\\text{IQR} = 4$ olan bir dağılımda alt aykırı değer sınırı kaçtır?",
          en: "If $Q_1 = 10$ and $\\text{IQR} = 4$, what is the lower fence?"
        },
        correctAnswer: 4,
        explanation: {
          tr: "$$\\text{Alt Sınır} = Q_1 - 1.5 \\times \\text{IQR} = 10 - 1.5 \\times 4 = 10 - 6 = 4$$",
          en: "$$\\text{Lower Fence} = 10 - 6 = 4$$"
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=Q1 - 1.5*IQR",
      pythonCode: "import seaborn as sns\nsns.boxplot(x=df['sales'])",
      powerBiNote: { tr: "Boxplot görselinde bıyık sınırları 1.5 IQR'dır.", en: "Boxplot whiskers are set at 1.5 IQR." }
    }
  },
  {
    id: "m1-l11",
    moduleId: "module-1",
    order: 12,
    difficulty: "ileri",
    title: { tr: "Çarpıklık ve Basıklık (Skewness & Kurtosis)", en: "Skewness & Kurtosis" },
    conceptCard: {
      tr: "1. **Çarpıklık (Skewness):** Dağılımın simetrisini ölçer.\n- **Simetrik:** $\\text{Skew} = 0$ (Ortalama = Medyan = Mod)\n- **Sağa Çarpık (Pozitif):** $\\text{Skew} > 0$ (Mod < Medyan < Ortalama)\n- **Sola Çarpık (Negatif):** $\\text{Skew} < 0$ (Ortalama < Medyan < Mod)\n\n2. **Basıklık (Kurtosis):** Kuyruk kalınlığını ve sivrilik derecesini ölçer.",
      en: "1. **Skewness:** Measures asymmetry (Right-skewed: Mean > Median; Left-skewed: Mean < Median).\n2. **Kurtosis:** Measures tail weight and peakedness relative to Normal."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir ülkede gelir dağılımında Ortalama = 45.000 TL, Medyan = 28.000 TL'dir. Dağılım ne tür bir çarpıklığa sahiptir?\n\n**Çözüm:** Ortalama > Medyan olduğu için dağılım **Sağa Çarpık (Pozitif Çarpık)** yapıdadır.",
      en: "**Worked Example:** Mean income is 45k, median is 28k. Describe skewness.\n\n**Solution:** Because Mean > Median, the distribution is **Right-Skewed (Positive)**."
    },
    vocabTerms: [
      {
        term_en: "skewness",
        explanation_tr: "Olasılık dağılımının simetriden ne kadar saptığının ölçüsüdür.",
        explanation_en: "A measure of the asymmetry of the probability distribution.",
        exampleSentence_en: "Income data typically exhibits high positive skewness."
      }
    ],
    questions: [
      {
        id: "m1-l11-q1",
        type: "multiple-choice",
        prompt: {
          tr: "Ortalamanın medyandan daha küçük olduğu (Ortalama < Medyan) bir dağılım nasıldır?",
          en: "What type of distribution has Mean < Median?"
        },
        options: [
          { tr: "Sola Çarpık (Negatif)", en: "Left-Skewed (Negative)" },
          { tr: "Sağa Çarpık (Pozitif)", en: "Right-Skewed (Positive)" },
          { tr: "Mükemmel Simetrik", en: "Perfect Symmetrical" },
          { tr: "Üniform Dağılım", en: "Uniform Distribution" }
        ],
        correctAnswer: 0,
        explanation: {
          tr: "Ortalama sol kuyruktaki aşırı küçük değerler tarafından aşağı çekildiği için dağılım Sola Çarpıktır.",
          en: "Extremely low values pull the mean left, creating a Left-Skewed distribution."
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=ÇARPIKLIK(A1:A50)",
      pythonCode: "from scipy.stats import skew, kurtosis\nprint(skew(data), kurtosis(data))",
      powerBiNote: { tr: "Dağılım şekli Histogram ile incelenir.", en: "Distribution shape is visually verified via Histogram." }
    }
  },
  {
    id: "m1-l12",
    moduleId: "module-1",
    order: 13,
    difficulty: "ileri",
    title: { tr: "Normallik Grafiği (Q-Q Plot)", en: "Normality Assessment & Q-Q Plot" },
    conceptCard: {
      tr: "Quantile-Quantile (Q-Q) Grafiği, örneklem çeyrekliklerini teorik normal dağılım çeyreklikleriyle karşılaştırır:\n\n- Noktalar $45^\\circ$'lik referans doğrusu üzerinde diziliyorsa veri **Normal Dağılım** gösterir.\n- Doğrudan sapan S-şekli veya yaylar çarpıklık ve ağır kuyruk varlığını gösterir.",
      en: "A Q-Q Plot compares sample quantiles against theoretical normal quantiles.\n\n- Points falling along the $45^\\circ$ line confirm normality."
    },
    companyExample: {
      tr: "**Örnek Soru:** Bir regülasyon analizinde 1000 pil ömrü verisinin Q-Q grafiğinde noktaların tümü $y=x$ doğrusuna tam oturmaktadır. Karar nedir?\n\n**Çözüm:** Veriler normal dağılım varsayımını mükemmel şekilde karşılamaktadır.",
      en: "**Worked Example:** Battery lifetime data falls directly on the 45-degree line. Conclusion?\n\n**Solution:** The data satisfies the normal distribution assumption."
    },
    vocabTerms: [
      {
        term_en: "Q-Q Plot",
        explanation_tr: "Verinin teorik bir dağılıma (özellikle Normal) uygunluğunu gösteren grafiksel tanı aracı.",
        explanation_en: "A visual tool to assess if a dataset follows a theoretical distribution.",
        exampleSentence_en: "The Q-Q plot showed mild deviations in the heavy tails."
      }
    ],
    questions: [
      {
        id: "m1-l12-q1",
        type: "multiple-choice",
        prompt: {
          tr: "Q-Q grafiğinde noktaların $45^\\circ$'lik düz doğru üzerinde toplanması neyi gösterir?",
          en: "What does alignment along the 45-degree line in a Q-Q plot indicate?"
        },
        options: [
          { tr: "Verinin Normal Dağılıma uyduğunu", en: "Data follows a Normal Distribution" },
          { tr: "Verinin iki modlu (bimodal) olduğunu", en: "Data is Bimodal" },
          { tr: "Çok fazla aykırı değer olduğunu", en: "High presence of outliers" },
          { tr: "Verinin kategorik olduğunu", en: "Data is categorical" }
        ],
        correctAnswer: 0,
        explanation: {
          tr: "45 derecelik doğruya uyum, verilerin teorik normal dağılım ile örtüştüğünü kanıtlar.",
          en: "Close alignment with the reference line indicates normal distribution fit."
        }
      }
    ],
    realWorldBox: {
      excelFormula: "=STANDARTLAŞTIRMA(x, ortalama, ss)",
      pythonCode: "import statsmodels.api as sm\nimport matplotlib.pyplot as plt\nsm.qqplot(data, line='45')\nplt.show()",
      powerBiNote: { tr: "R / Python visual eklentisiyle Q-Q grafiği çizdirilebilir.", en: "Render Q-Q plots using R/Python visual script." }
    }
  }
];

fs.writeFileSync(path.join(modulesDir, 'module1.json'), JSON.stringify(m1, null, 2), 'utf8');
console.log('✓ Module 1 updated with 13 isolated lessons.');
