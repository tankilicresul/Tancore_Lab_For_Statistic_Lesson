const fs = require('fs');

console.log('Enriching all 16 modules with exact Koç INDR 252 & ENGR 200 lecture notes & exam guidelines...');

// Function to update modules safely
function updateModule(modNum, updater) {
  const file = `src/data/module${modNum}.json`;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  updater(data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Module ${modNum} updated successfully.`);
}

// === MODULE 2: ENGR 200 Probability Foundations ===
updateModule(2, (m) => {
  m.lessons.forEach(l => {
    if (l.id === 'm2-l1') {
      l.conceptCard.tr = "Bir rassal deneyin tüm olası sonuçlarının kümesine **Örneklem Uzayı ($S$)**, bu kümenin herhangi bir alt kümesine ise **Olay ($A \\subseteq S$)** denir (`ENGR 200 Lecture 1`).\n\n- **Birleşim ($A \\cup B$):** $A$ veya $B$'den en az birinin gerçekleşmesi.\n- **Kesişim ($A \\cap B$):** Hem $A$ hem $B$'nin aynı anda gerçekleşmesi.\n- **Tümleyen ($A^c$ veya $A'$):** $A$'nın gerçekleşmeme olayı.\n- **Ayrık Olaylar (Mutually Exclusive):** $A \\cap B = \\emptyset$ ise iki olay aynı anda gerçekleşemez.";
    } else if (l.id === 'm2-l2') {
      l.conceptCard.tr = "**Kolmogorov Olasılık Aksiyomları (`ENGR 200`):**\n1. Her olay $A$ için $0 \\le P(A) \\le 1$.\n2. Örneklem uzayı için kesin olay: $P(S) = 1$.\n3. Ayrık olaylar dizisi için: $P(A_1 \\cup A_2 \\cup \\dots) = \\sum P(A_i)$.\n\n**Genel Toplam Kuralı (Inclusion-Exclusion Principle):**\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$\nÜçlü olaylar için:\n$$P(A \\cup B \\cup C) = P(A)+P(B)+P(C) - P(AB) - P(AC) - P(BC) + P(ABC)$$";
    } else if (l.id === 'm2-l3') {
      l.conceptCard.tr = "$B$ olayının gerçekleştiği bilindiğinde $A$ olayının koşullu olasılığı ($P(B) > 0$ olmak üzere):\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$$\n\n**Çarpım Kuralı (Multiplication Rule):**\n$$P(A \\cap B) = P(B) \\cdot P(A \\mid B) = P(A) \\cdot P(B \\mid A)$$\n\n**Zincir Kuralı (Chain Rule):**\n$$P(A_1 \\cap A_2 \\cap \\dots \\cap A_n) = P(A_1) P(A_2 \\mid A_1) P(A_3 \\mid A_1 \\cap A_2) \\dots P(A_n \\mid A_1 \\cap \\dots \\cap A_{n-1})$$";
    } else if (l.id === 'm2-l4') {
      l.conceptCard.tr = "İki olay $A$ ve $B$ için, birinin gerçekleşmesi diğerinin olasılığını değiştirmiyorsa bu olaylar **İstatistiksel Olarak Bağımsızdır (Independent)** (`ENGR 200`):\n\n$$P(A \\mid B) = P(A) \\iff P(A \\cap B) = P(A) \\cdot P(B)$$\n\n> **Kritik Üniversite Sınav Kuralı:** Ayrık olaylar ($A \\cap B = \\emptyset$) ile Bağımsız olaylar ($P(A \\cap B) = P(A)P(B)$) tamamen farklıdır! Pozitif olasılıklı iki ayrık olay asla bağımsız olamaz, çünkü biri olduğunda diğeri imkansız hale gelir ($P(A|B)=0$).";
    } else if (l.id === 'm2-l5') {
      l.conceptCard.tr = "Örneklem uzayı $B_1, B_2, \\dots, B_k$ şeklinde ayrık parçalara bölünmüşse (Partition: $\\bigcup B_i = S, B_i \\cap B_j = \\emptyset$):\n\n**1. Toplam Olasılık Yasası (Law of Total Probability):**\n$$P(A) = \\sum_{i=1}^k P(A \\mid B_i) P(B_i)$$\n\n**2. Bayes Teoremi (Posterior Probability / Sonsal Olasılık):**\n$$P(B_j \\mid A) = \\frac{P(A \\mid B_j) P(B_j)}{\\sum_{i=1}^k P(A \\mid B_i) P(B_i)}$$";
    }
  });
});

// === MODULE 3: ENGR 200 Discrete Probability Distributions ===
updateModule(3, (m) => {
  m.lessons.forEach(l => {
    if (l.id === 'm3-l1') {
      l.conceptCard.tr = "Kesikli bir rastgele değişken $X$, sayılabilir sayıda değer alabilen değişkendir (`ENGR 200`):\n\n1. **Olasılık Kütle Fonksiyonu (PMF):** $p(x) = P(X = x)$,\n   - $p(x) \\ge 0$\n   - $\\sum_x p(x) = 1$\n2. **Kümülatif Dağılım Fonksiyonu (CDF):**\n   $$F(x) = P(X \\le x) = \\sum_{t \\le x} p(t)$$\n   - $F(x)$ monoton artandır, sağdan süreklidir, $\\lim_{x \\to -\\infty} F(x) = 0$ ve $\\lim_{x \\to \\infty} F(x) = 1$.";
    } else if (l.id === 'm3-l2') {
      l.conceptCard.tr = "**Beklenen Değer (Ağırlıklı Ortalama):**\n$$\\mathbb{E}[X] = \\mu = \\sum_x x \\cdot p(x)$$\n- **Doğrusallık (Linearity of Expectation):** $\\mathbb{E}[aX + b] = a\\mathbb{E}[X] + b$\n\n**Varyans ve Standart Sapma:**\n$$\\text{Var}(X) = \\sigma^2 = \\mathbb{E}[(X - \\mu)^2] = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2$$\n- $\\text{Var}(aX + b) = a^2 \\text{Var}(X)$\n- Standart sapma: $\\sigma = \\sqrt{\\text{Var}(X)}$";
    } else if (l.id === 'm3-l3') {
      l.conceptCard.tr = "**1. Binom Dağılımı ($X \\sim \\text{Bin}(n, p)$):**\n$n$ bağımsız Bernoulli denemesinde $k$ başarı sayısı:\n$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\quad k = 0, 1, \\dots, n$$\n$$\\mathbb{E}[X] = np, \\qquad \\text{Var}(X) = np(1-p)$$\n\n**2. Geometrik Dağılım ($Y \\sim \\text{Geom}(p)$):**\nİlk başarıya kadar gereken bağımsız deneme sayısı:\n$$P(Y = k) = (1-p)^{k-1} p, \\quad k = 1, 2, \\dots$$\n$$\\mathbb{E}[Y] = \\frac{1}{p}, \\qquad \\text{Var}(Y) = \\frac{1-p}{p^2}$$";
    } else if (l.id === 'm3-l4') {
      l.conceptCard.tr = "**Poisson Dağılımı ($X \\sim \\text{Poisson}(\\lambda)$) (`ENGR 200`):**\nSabit bir zaman veya uzay aralığında gerçekleşen bağımsız nadir olay sayısı:\n\n$$P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}, \\quad k = 0, 1, 2, \\dots$$\n\n**Karakteristik Özellik:**\n$$\\mathbb{E}[X] = \\lambda, \\qquad \\text{Var}(X) = \\lambda$$\n\n**Binom-Poisson Yaklaşımı (Law of Rare Events):**\n$n \\ge 100$ ve $p \\le 0.05$ ise $X \\sim \\text{Bin}(n, p) \\approx \\text{Poisson}(\\lambda = np)$.";
    }
  });
});

// === MODULE 4: INDR 252 Lecture 2-3: Joint, Error Propagation & CLT ===
updateModule(4, (m) => {
  m.lessons.forEach(l => {
    if (l.id === 'm4-l1') {
      l.conceptCard.tr = "İki rastgele değişken $X$ ve $Y$ arasındaki ortak davranış Birleşik PMF $p(x, y) = P(X=x, Y=y)$ ile belirlenir (`INDR 252 Lecture 2`):\n\n**Kovaryans:**\n$$\\text{Cov}(X, Y) = \\sigma_{XY} = \\mathbb{E}[(X - \\mu_X)(Y - \\mu_Y)] = \\mathbb{E}[XY] - \\mathbb{E}[X]\\mathbb{E}[Y]$$\n\n**Pearson Korelasyon Katsayısı (Boyutsuz Ölçü):**\n$$\\rho_{XY} = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y}, \\qquad -1 \\le \\rho_{XY} \\le 1$$\n- $X$ ve $Y$ bağımsız ise $\\text{Cov}(X, Y) = 0$ ve $\\rho = 0$'dır.";
    } else if (l.id === 'm4-l2') {
      l.conceptCard.tr = "$X_1, X_2, \\dots, X_n$ rastgele değişkenlerinin doğrusal kombinasyonu $Y = \\sum a_i X_i$ için (`INDR 252 Lecture 2`):\n\n**1. Beklenen Değer (Her zaman geçerlidir):**\n$$\\mathbb{E}[Y] = \\sum_{i=1}^n a_i \\mathbb{E}[X_i]$$\n\n**2. Genel Varyans Formülü:**\n$$\\text{Var}(Y) = \\sum_{i=1}^n a_i^2 \\text{Var}(X_i) + 2 \\sum_{i < j} a_i a_j \\text{Cov}(X_i, X_j)$$\n\n**3. Bağımsız Değişkenler İçin:**\n$$\\text{Var}(X_1 - X_2) = (1)^2 \\text{Var}(X_1) + (-1)^2 \\text{Var}(X_2) = \\text{Var}(X_1) + \\text{Var}(X_2)$$";
    } else if (l.id === 'm4-l3') {
      l.conceptCard.tr = "**Hata Yayılımı (Propagation of Error / Taylor Yaklaşımı - `INDR 252 Lecture 3`, `CEx3`):**\n\nDoğrusal olmayan bir fonksiyon $Y = f(X_1, X_2, \\dots, X_k)$ verildiğinde, birinci derece çok değişkenli Taylor serisi açılımı ile yaklaşık varyans:\n\n$$\\sigma_Y^2 = \\text{Var}(Y) \\approx \\sum_{i=1}^k \\left( \\frac{\\partial f}{\\partial X_i} \\right)^2 \\sigma_{X_i}^2$$\n\nDeğişkenler arasında kovaryans varsa:\n$$\\text{Var}(Y) \\approx \\sum_{i=1}^k \\left( \\frac{\\partial f}{\\partial X_i} \\right)^2 \\sigma_{X_i}^2 + 2 \\sum_{i < j} \\left( \\frac{\\partial f}{\\partial X_i} \\right) \\left( \\frac{\\partial f}{\\partial X_j} \\right) \\text{Cov}(X_i, X_j)$$";
    } else if (l.id === 'm4-l4') {
      l.conceptCard.tr = "Anakütleden çekilen $n$ birimlik bağımsız örneklemlerin ortalaması $\\bar{X}$ bir rastgele değişkendir (`INDR 252 Lecture 3`):\n\n$$\\mathbb{E}[\\bar{X}] = \\mu_{\\bar{X}} = \\mu, \\qquad \\sigma_{\\bar{X}} = \\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$$\n\n**İki Bağımsız Örneklem Ortalamasının Farkı Dağılımı ($\\bar{X}_1 - \\bar{X}_2$):**\n$$\\mathbb{E}[\\bar{X}_1 - \\bar{X}_2] = \\mu_1 - \\mu_2, \\qquad \\sigma_{\\bar{X}_1 - \\bar{X}_2} = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$$";
    } else if (l.id === 'm4-l5') {
      l.conceptCard.tr = "**Merkezi Limit Teoremi (Central Limit Theorem - CLT) (`INDR 252 Lecture 3`):**\n\nAna kütlenin dağılımı ne olursa olsun (çarpık, düzgün, üstel), bağımsız ve özdeş dağılmış (i.i.d.) örneklemlerde $n \\ge 30$ olduğunda örneklem ortalamaları dağılımı yaklaşık olarak Normal Dağılıma yakınsar:\n\n$$\\bar{X} \\xrightarrow{d} \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right), \\qquad Z = \\frac{\\bar{X} - \\mu}{\\frac{\\sigma}{\\sqrt{n}}} \\sim \\mathcal{N}(0, 1)$$\n\n> **Büyük Sayılar Yasası (LLN):** $n \\to \\infty$ iken $\\bar{X} \\to \\mu$ olasılıkta yakınsar.";
    }
  });
});

// === MODULE 5: INDR 252 Lecture 4-5: Point Estimation & Confidence Intervals ===
updateModule(5, (m) => {
  m.lessons.forEach(l => {
    if (l.id === 'm5-l1') {
      l.conceptCard.tr = "Bilinmeyen parametre $\\theta$ için örneklemden tek bir sayısal değer üreten fonksiyona **Nokta Tahmin Edici (Point Estimator / $\\hat{\\theta}$)** denir (`INDR 252 Lecture 4`):\n\n1. **Sapmasızlık (Unbiasedness):** $\\mathbb{E}[\\hat{\\theta}] = \\theta$ ise $\\hat{\\theta}$ sapmasızdır.\n   - Sapma: $\\text{Bias}(\\hat{\\theta}) = \\mathbb{E}[\\hat{\\theta}] - \\theta$\n2. **Ortalama Hata Karesi (MSE):**\n   $$\\text{MSE}(\\hat{\\theta}) = \\mathbb{E}[(\\hat{\\theta} - \\theta)^2] = \\text{Var}(\\hat{\\theta}) + [\\text{Bias}(\\hat{\\theta})]^2$$\n   - Sapmasız tahmin ediciler için $\\text{MSE} = \\text{Var}(\\hat{\\theta})$ olur.";
    } else if (l.id === 'm5-l2') {
      l.conceptCard.tr = "**En Çok Olabilirlik Yöntemi (Maximum Likelihood Estimation - MLE) (`INDR 252 Lecture 4`, `CEx5`):**\n\nGözlemlenen verileri en olası kılan parametre değerini bulma prosedürü:\n\n1. **Likelihood Fonksiyonu:** $L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$\n2. **Log-Likelihood Fonksiyonu:** $\\ln L(\\theta) = \\sum_{i=1}^n \\ln f(x_i; \\theta)$\n3. **Türev ve Sıfıra Eşitleme:** $\\frac{d \\ln L(\\theta)}{d\\theta} = 0 \\implies \\hat{\\theta}_{\\text{MLE}}$\n4. **İkinci Türev Testi:** $\\frac{d^2 \\ln L(\\theta)}{d\\theta^2} < 0$ (Maksimum olduğunu kanıtlar).";
    } else if (l.id === 'm5-l5') {
      l.conceptCard.tr = "**Oranlar İçin Güven Aralığı (`INDR 252 Lecture 5`, `FormulaSheet`):**\n\n1. **Klasik Wald Aralığı ($n\\hat{p} \\ge 5, n(1-\\hat{p}) \\ge 5$):**\n$$\\hat{p} \\pm Z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}$$\n\n2. **Agresti-Coull Düzeltmesi (Küçük $n$ veya uç $p$ için `INDR 252`):**\n$$\\tilde{n} = n + 4, \\qquad \\tilde{p} = \\frac{X + 2}{n + 4}$$\n$$\\tilde{p} \\pm Z_{\\alpha/2} \\sqrt{\\frac{\\tilde{p}(1-\\tilde{p})}{\\tilde{n}}}$$";
    } else if (l.id === 'm5-l6') {
      l.conceptCard.tr = "**Tek Popülasyon Varyansı İçin Güven Aralığı ($\chi^2$ Dağılımı - `INDR 252 Lecture 5`):**\n\nNormal dağılan bir popülasyondan çekilen $n$ gözlem için varyans $\\sigma^2$ güven aralığı:\n\n$$\\frac{(n-1)s^2}{\\chi^2_{\\alpha/2, n-1}} \\le \\sigma^2 \\le \\frac{(n-1)s^2}{\\chi^2_{1-\\alpha/2, n-1}}$$\n\n- $\\chi^2$ dağılımı simetrik değildir ($0$ ile $+\\infty$ arası), bu yüzden alt ve üst kritik değerler tablodan ayrı ayrı okunur.";
    } else if (l.id === 'm5-l7') {
      l.conceptCard.tr = "**Aralık Türlerinin Kıyaslaması (`INDR 252 Lecture 5`, `CEx7`):**\n\n1. **Güven Aralığı (Confidence Interval - CI):** Popülasyon ortalaması $\\mu$'yü kapsar (En dar aralık: $\\bar{X} \\pm t s/\\sqrt{n}$).\n2. **Tahmin Aralığı (Prediction Interval - PI):** Gelecekteki tek bir yeni gözlemi ($X_{n+1}$) kapsar (Daha geniştir):\n$$\\bar{X} \\pm t_{\\alpha/2, n-1} s \\sqrt{1 + \\frac{1}{n}}$$\n3. **Tolerans Aralığı (Tolerance Interval - TI):** Popülasyonun en az $\%\\gamma$'sını $\%100(1-\\alpha)$ güvenle kapsar: $\\bar{X} \\pm k s$.";
    }
  });
});

console.log('Modules 2, 3, 4, 5 successfully enriched with Koç Lecture notes and CEx formats.');
