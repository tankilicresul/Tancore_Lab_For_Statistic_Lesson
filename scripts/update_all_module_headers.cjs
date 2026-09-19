const fs = require('fs');

const moduleUpdates = {
  1: {
    title: {
      tr: "Tanımlayıcı İstatistik & Keşifçi Veri Analizi",
      en: "Descriptive Statistics & Exploratory Data Analysis"
    },
    description: {
      tr: "Merkezi eğilim, varyans, kutu grafiği, aykırı değer tespiti ve Q-Q normallik grafiği. E-ticaret müşteri sepet verisi vaka analizi.",
      en: "Measures of central tendency, spread, boxplots, outlier detection, and Q-Q normality plots. E-commerce transaction analysis case."
    }
  },
  2: {
    title: {
      tr: "Olasılık Temelleri & Olaylar Cebiri",
      en: "Probability Foundations & Algebra of Events"
    },
    description: {
      tr: "Örneklem uzayı, Kolmogorov aksiyomları, toplam ve çarpım kuralı ile bağımsız olaylar. Fintech fraud risk analizi.",
      en: "Sample spaces, Kolmogorov axioms, addition/multiplication rules, and statistical independence. Fintech fraud risk analysis."
    }
  },
  3: {
    title: {
      tr: "Kesikli Olasılık Dağılımları",
      en: "Discrete Probability Distributions"
    },
    description: {
      tr: "PMF, CDF, beklenen değer, varyans, Binom, Geometrik ve Poisson dağılımları. Çip üretim kalite kontrol vakası.",
      en: "PMF, CDF, expected value, variance, Binomial, Geometric, and Poisson models. Chip manufacturing QC case."
    }
  },
  4: {
    title: {
      tr: "Ortak Dağılımlar, Hata Yayılımı & CLT",
      en: "Joint Distributions, Error Propagation & CLT"
    },
    description: {
      tr: "Kovaryans, değişken kombinasyonları, Taylor hata yayılımı ve Merkezi Limit Teoremi. Anket güvenilirlik analizi.",
      en: "Covariance, linear combinations, Taylor error propagation, and Central Limit Theorem. Survey reliability case."
    }
  },
  5: {
    title: {
      tr: "Nokta Tahmini & Güven Aralıkları",
      en: "Point Estimation & Confidence Intervals"
    },
    description: {
      tr: "Sapmasızlık, En Çok Olabilirlik (MLE), Z/t güven aralıkları, Agresti-Coull, Ki-kare varyans ve PI/TI aralıkları.",
      en: "Unbiasedness, MLE, Z/t confidence intervals, Agresti-Coull, Chi-square variance, and PI/TI intervals."
    }
  },
  6: {
    title: {
      tr: "Tek Popülasyon Hipotez Testleri",
      en: "One-Sample Hypothesis Testing"
    },
    description: {
      tr: "Sıfır ve alternatif hipotezler, Tip 1/2 hataları, test gücü, Z-testi, t-testi ve tek varyans Ki-kare testi.",
      en: "Null/alternative hypotheses, Type 1/2 errors, power, Z-test, t-test, and one-variance Chi-square test."
    }
  },
  7: {
    title: {
      tr: "İki Popülasyon Karşılaştırmaları & Basit Regresyon",
      en: "Two-Population Inference & Simple Regression"
    },
    description: {
      tr: "Welch t-testi, varyans F-testi, eşleştirilmiş t-testi, oran farkları ve En Küçük Kareler (OLS) basit regresyonu.",
      en: "Welch t-test, variance F-test, paired t-test, difference in proportions, and Ordinary Least Squares (OLS) simple regression."
    }
  },
  8: {
    title: {
      tr: "Çoklu Doğrusal Regresyon & Model Tanılama",
      en: "Multiple Linear Regression & Diagnostics"
    },
    description: {
      tr: "Kısmi eğimler, Düzeltilmiş R², ANOVA F-testi, kalıntı eşvaryanslığı, Durbin-Watson, VIF ve Cook mesafesi.",
      en: "Partial slopes, Adjusted R², ANOVA F-test, homoskedasticity, Durbin-Watson, VIF, and Cook's Distance."
    }
  },
  9: {
    title: {
      tr: "ANOVA, Model Seçimi & Ki-Kare Testleri",
      en: "ANOVA, Model Selection & Chi-Square Tests"
    },
    description: {
      tr: "Tek yönlü ANOVA, Tukey HSD, Levene testi, Ki-kare bağımsızlık/uyum, Kısmi F-testi ve Mallows' Cp kriteri.",
      en: "One-way ANOVA, Tukey HSD, Levene test, Chi-square independence/goodness-of-fit, Partial F, and Mallows' Cp."
    }
  },
  10: {
    title: {
      tr: "Zaman Serisi Analitiği & İleri Testler",
      en: "Time Series Analytics & Advanced Tests"
    },
    description: {
      tr: "Trend, mevsimsellik, hareketli ortalamalar (SMA/WMA), üstel düzleştirme ve parametrik olmayan testler [Bonus].",
      en: "Trend, seasonality, moving averages (SMA/WMA), exponential smoothing, and non-parametric tests [Bonus]."
    }
  },
  11: {
    title: {
      tr: "Kapstone: Uçtan Uca Endüstriyel Karar Analitiği",
      en: "Capstone: Industrial Decision Analytics"
    },
    description: {
      tr: "Veri temizleme, A/B testi, regresyon modelleme, kalıntı denetimi ve C-Level sayısal karar raporlaması.",
      en: "Data cleaning, A/B testing, regression modeling, residual validation, and C-Level decision reporting."
    }
  },
  12: {
    title: {
      tr: "Markov Zincirleri & Stokastik Süreçler",
      en: "Markov Chains & Stochastic Processes"
    },
    description: {
      tr: "Durum uzayı, geçiş matrisi (P), Chapman-Kolmogorov, durağan denge vektörü ve yutucu durumlar.",
      en: "State space, transition matrix (P), Chapman-Kolmogorov, stationary distribution, and absorbing states."
    }
  },
  13: {
    title: {
      tr: "Kombinatorik & Sayma Yöntemleri",
      en: "Combinatorics & Counting Principles"
    },
    description: {
      tr: "Temel sayma ilkesi, faktöriyel, permütasyon, kombinasyon ve Binom katsayıları.",
      en: "Fundamental counting principle, factorials, permutations, combinations, and Binomial theorem."
    }
  },
  14: {
    title: {
      tr: "Koşullu Olasılık & Bayes Teoremi",
      en: "Conditional Probability & Bayes' Rule"
    },
    description: {
      tr: "Koşullu olasılık, olay bağımsızlığı, Toplam Olasılık Yasası ve Bayesian sonsal çıkarım.",
      en: "Conditional probability, independence, Law of Total Probability, and Bayesian posterior inference."
    }
  },
  15: {
    title: {
      tr: "Poisson Süreci & Nadir Olaylar",
      en: "Poisson Processes & Rare Events"
    },
    description: {
      tr: "Homojen Poisson süreçleri, varışlar arası üstel dağılım, hafızasızlık ve süreç birleştirme/bölme.",
      en: "Homogeneous Poisson processes, interarrival exponential distribution, memorylessness, and superposition/thinning."
    }
  },
  16: {
    title: {
      tr: "Sürekli Olasılık Dağılımları",
      en: "Continuous Probability Distributions"
    },
    description: {
      tr: "PDF, CDF eğrileri, Sürekli Düzgün (Uniform), Normal Dağılım ve Z-tablosu dönüşümleri.",
      en: "PDF, CDF curves, Continuous Uniform, Normal Distribution, and Z-table lookups."
    }
  }
};

for (let i = 1; i <= 16; i++) {
  const filePath = `src/data/module${i}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (moduleUpdates[i]) {
    data.title = moduleUpdates[i].title;
    data.description = moduleUpdates[i].description;
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}
console.log('All 16 module titles and descriptions updated successfully.');
