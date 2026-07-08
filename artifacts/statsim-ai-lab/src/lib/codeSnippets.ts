export const codeSnippets = {
  logistic: {
    python: (params: any) => `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix

np.random.seed(42)
n_samples = ${params.n ?? 100}

X = np.linspace(-20, 20, n_samples).reshape(-1, 1)
# Sigmoid eğimi (Slope): ${params.slope ?? -0.25}
probability = 1 / (1 + np.exp(-(${params.slope ?? -0.25}) * X))

y = np.random.binomial(1, probability.ravel())

model = LogisticRegression()
model.fit(X, y)

# Karar eşiği (Threshold): ${params.threshold ?? 0.5}
predictions = (model.predict_proba(X)[:, 1] >= ${params.threshold ?? 0.5}).astype(int)
accuracy = accuracy_score(y, predictions)

print("Model Katsayısı (Slope):", model.coef_[0][0])
print("Doğruluk (Accuracy):", accuracy)
print("Karışıklık Matrisi (Confusion Matrix):\\n", confusion_matrix(y, predictions))`,
    r: (params: any) => `set.seed(42)
n_samples <- ${params.n ?? 100}
x <- seq(-20, 20, length.out = n_samples)
# Eğim katsayısı: ${params.slope ?? -0.25}
p <- 1 / (1 + exp(-(${params.slope ?? -0.25}) * x))
y <- rbinom(n_samples, 1, p)

df <- data.frame(x, y)
model <- glm(y ~ x, family = binomial, data = df)
summary(model)

# Eşik değeri: ${params.threshold ?? 0.5}
predictions <- as.integer(predict(model, type = "response") >= ${params.threshold ?? 0.5})`,
    sql: (params: any) => `SELECT
  x,
  y,
  prediction,
  ABS(y - prediction) AS error,
  probability
FROM simulation_data
-- Lojistik regresyon parametreleri
WHERE model_type = 'logistic_regression'
  AND threshold = ${params.threshold ?? 0.5}
  AND slope = ${params.slope ?? -0.25}
ORDER BY x ASC;`,
    javascript: (params: any) => `// Sigmoid fonksiyonu: slope = ${params.slope ?? -0.25}
const sigmoid = x => 1 / (1 + Math.exp(-(${params.slope ?? -0.25}) * x));
const X = Array.from({length: ${params.n ?? 100}}, (_, i) => -20 + i * 0.4);
const probs = X.map(sigmoid);
const y = probs.map(p => Math.random() < p ? 1 : 0);

// Karar eşiği: ${params.threshold ?? 0.5}
const threshold = ${params.threshold ?? 0.5};
const predictions = probs.map(p => p >= threshold ? 1 : 0);
const accuracy = y.filter((v, i) => v === predictions[i]).length / y.length;
console.log('JS Accuracy:', accuracy.toFixed(4));`
  },
  linear: {
    python: (params: any) => `import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

np.random.seed(42)
n_samples = ${params.n ?? 200}
# Model Parametreleri: slope = ${params.slope ?? 0.5}, intercept = ${params.intercept ?? 2}, noise = ${params.noise ?? 1.5}
X = np.linspace(-10, 10, n_samples).reshape(-1, 1)
y = ${params.slope ?? 0.5} * X.ravel() + ${params.intercept ?? 2} + np.random.normal(0, ${params.noise ?? 1.5}, n_samples)

model = LinearRegression()
model.fit(X, y)

predictions = model.predict(X)
print("Eğilen Katsayı (Slope):", model.coef_[0])
print("Kesişim Noktası (Intercept):", model.intercept_)
print("R^2 Açıklayıcılık Skoru:", model.score(X, y))`,
    r: (params: any) => `set.seed(42)
n <- ${params.n ?? 200}
# Parametreler: slope = ${params.slope ?? 0.5}, intercept = ${params.intercept ?? 2}, noise = ${params.noise ?? 1.5}
x <- seq(-10, 10, length.out=n)
y <- ${params.slope ?? 0.5} * x + ${params.intercept ?? 2} + rnorm(n, 0, ${params.noise ?? 1.5})

model <- lm(y ~ x)
summary(model)
plot(x, y)
abline(model, col="red")`,
    sql: (params: any) => `SELECT
  x, y,
  (${params.slope ?? 0.5} * x + ${params.intercept ?? 2}) AS prediction,
  POWER(y - (${params.slope ?? 0.5} * x + ${params.intercept ?? 2}), 2) AS squared_error
FROM simulation_data
-- Lineer regresyon parametreleri (Gürültü payı: ${params.noise ?? 1.5})
WHERE model_type = 'linear_regression';`,
    javascript: (params: any) => `const X = Array.from({length: ${params.n ?? 200}}, (_, i) => -10 + i * 0.1);
const noise = () => (Math.random() - 0.5) * 2 * ${params.noise ?? 1.5};
// Formül: Y = ${params.slope ?? 0.5} * X + ${params.intercept ?? 2} + gürültü
const y = X.map(x => ${params.slope ?? 0.5} * x + ${params.intercept ?? 2} + noise());
console.log('Lineer veri seti hazır. Gözlem sayısı:', y.length);`
  },
  normal: {
    python: (params: any) => {
      const zVal = params.confidence === 0.99 ? 2.576 : params.confidence === 0.90 ? 1.645 : 1.960;
      return `import numpy as np
import scipy.stats as stats

# Normal Dağılım Girdileri: mean = ${params.mean ?? 0}, std = ${params.std ?? 1.5}, n = ${params.n ?? 100}
mean, std, n, conf = ${params.mean ?? 0}, ${params.std ?? 1.5}, ${params.n ?? 100}, ${params.confidence ?? 0.95}
data = np.random.normal(loc=mean, scale=std, size=n)

x_bar = np.mean(data)
z_val = stats.norm.ppf(1 - (1 - conf)/2) # Kritik Z Değeri: ${zVal}
margin_of_error = z_val * (std / np.sqrt(n))

ci_lower = x_bar - margin_of_error
ci_upper = x_bar + margin_of_error

print(f"Örneklem Ortalaması (X̄): {x_bar:.3f}")
print(f"%${Math.round((params.confidence ?? 0.95) * 100)} Güven Aralığı (CI): [{ci_lower:.3f}, {ci_upper:.3f}]");`;
    },
    r: (params: any) => {
      const zVal = params.confidence === 0.99 ? 2.576 : params.confidence === 0.90 ? 1.645 : 1.960;
      return `mean <- ${params.mean ?? 0}; std <- ${params.std ?? 1.5}; n <- ${params.n ?? 100}; conf <- ${params.confidence ?? 0.95}
data <- rnorm(n, mean=mean, sd=std)

x_bar <- mean(data)
z_val <- qnorm(1 - (1 - conf)/2) # Kritik Z: ${zVal}
margin_of_error <- z_val * (std / sqrt(n))

ci_lower <- x_bar - margin_of_error
ci_upper <- x_bar + margin_of_error

print(paste("Mean:", round(x_bar, 3)))
print(paste("Confidence Interval:", round(ci_lower, 3), "to", round(ci_upper, 3)))`;
    },
    sql: (params: any) => {
      const zVal = params.confidence === 0.99 ? 2.576 : params.confidence === 0.90 ? 1.645 : 1.960;
      return `-- Güven Aralığı Hesaplama (CI: %${Math.round((params.confidence ?? 0.95) * 100)})
-- Bilinen standart sapma (std): ${params.std ?? 1.5}
SELECT
  AVG(value) AS x_bar,
  COUNT(value) AS n,
  AVG(value) - ${zVal} * (${params.std ?? 1.5} / SQRT(COUNT(value))) AS ci_lower,
  AVG(value) + ${zVal} * (${params.std ?? 1.5} / SQRT(COUNT(value))) AS ci_upper
FROM normal_distribution_samples;`;
    },
    javascript: (params: any) => {
      const zVal = params.confidence === 0.99 ? 2.576 : params.confidence === 0.90 ? 1.645 : 1.960;
      return `// Box-Muller normal dağılım simülasyonu
const mean = ${params.mean ?? 0}, std = ${params.std ?? 1.5}, n = ${params.n ?? 100};
let sum = 0;
for(let i=0; i<n; i++) {
  const u = Math.random(), v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  sum += z * std + mean;
}
const xBar = sum / n;
const zAlpha = ${zVal}; // %${Math.round((params.confidence ?? 0.95) * 100)} Kritik Z değeri
const me = zAlpha * (std / Math.sqrt(n));
console.log('JS CI:', (xBar - me).toFixed(3), 'to', (xBar + me).toFixed(3));`;
    }
  },
  hypothesis: {
    python: (params: any) => `import numpy as np
from scipy import stats

np.random.seed(42)
# Grup A (Kontrol) ve Grup B (Deney)
# Beklenen Fark (Diff): ${params.meanDiff ?? 1.0}, Anlamlılık Eşiği (Alpha): ${params.alpha ?? 0.05}
group_a = np.random.normal(0, 1, 100)
group_b = np.random.normal(${params.meanDiff ?? 1.0}, 1, 100)

t_stat, p_val = stats.ttest_ind(group_a, group_b)
print(f"T-İstatistiği: {t_stat:.3f}")
print(f"P-Değeri (p-value): {p_val:.4f}")
print("Karar:", "H0 Red (Anlamlı Fark)" if p_val < ${params.alpha ?? 0.05} else "H0 Reddedilemez (Anlamsız Fark)")`,
    r: (params: any) => `set.seed(42)
# Grup B ortalaması: ${params.meanDiff ?? 1.0}
group_a <- rnorm(100, mean=0, sd=1)
group_b <- rnorm(100, mean=${params.meanDiff ?? 1.0}, sd=1)

# Bağımsız iki örneklem t-testi (Alpha: ${params.alpha ?? 0.05})
result <- t.test(group_a, group_b, conf.level = ${1 - (params.alpha ?? 0.05)})
print(result)`,
    sql: (params: any) => `-- İki Örneklem T-Testi için grup istatistikleri
-- Anlamlılık düzeyi (Alpha): ${params.alpha ?? 0.05}
SELECT
  group_name,
  AVG(value) as group_mean,
  VARIANCE(value) as group_var,
  COUNT(value) as n
FROM experiment_data
GROUP BY group_name;`,
    javascript: (params: any) => `// Hipotez Testi Simülasyonu
const meanA = 0.05, meanB = ${params.meanDiff ?? 1.0};
const varA = 0.98, varB = 1.05;
const n = 100;
const se = Math.sqrt(varA/n + varB/n);
const zStat = (meanA - meanB) / se;
const pVal = 2 * (1 - 0.8413); // Yaklaşık z-skor olasılık hesabı
console.log('Z-İstatistiği:', zStat.toFixed(3));
console.log('P-Değeri:', pVal.toFixed(4));
console.log('Karar:', pVal < ${params.alpha ?? 0.05} ? 'Anlamlı Fark var (H0 Red)' : 'Anlamlı Fark Yok');`
  },
  error_propagation: {
    python: (params: any) => `import numpy as np

# Hedef koordinatı (0,0) olan atış simülasyonu
# Bias ve varyans yayılımı ölçümü
target = np.array([0, 0])
bias = np.array([1.2, 1.2]) # Hedef sapması
std = 0.3                   # Varyans standart sapması

shots = np.random.normal(loc=bias, scale=std, size=(40, 2))
distances_sq = np.sum((shots - target)**2, axis=1)

sample_bias = np.linalg.norm(np.mean(shots, axis=0))
sample_mse = np.mean(distances_sq)
sample_var = sample_mse - sample_bias**2

print(f"Bias (Sapma): {sample_bias:.3f}")
print(f"Variance (Varyans): {sample_var:.3f}")
print(f"MSE (Ortalama Karesel Hata): {sample_mse:.3f}")`,
    r: (params: any) => `# Varyans & Sapma analizi
bias_x <- 1.2; bias_y <- 1.2; std <- 0.3
shots_x <- rnorm(40, mean=bias_x, sd=std)
shots_y <- rnorm(40, mean=bias_y, sd=std)

mean_x <- mean(shots_x); mean_y <- mean(shots_y)
bias_val <- sqrt(mean_x^2 + mean_y^2)
mse_val <- mean(shots_x^2 + shots_y^2)
var_val <- mse_val - bias_val^2

print(paste("MSE:", round(mse_val, 3), "Bias:", round(bias_val, 3), "Variance:", round(var_val, 3)))`,
    sql: (params: any) => `-- Shooter Hata Yayılım Analizi
SELECT
  AVG(x) AS mean_x,
  AVG(y) AS mean_y,
  SQRT(POWER(AVG(x), 2) + POWER(AVG(y), 2)) AS bias_estimation,
  AVG(POWER(x, 2) + POWER(y, 2)) AS mean_square_error
FROM shooter_shots
WHERE shooter = 'Shooter 1';`,
    javascript: (params: any) => `// Atıcı hata analizi
const shots = Array.from({length: 40}, () => ({
  x: 1.2 + (Math.random() - 0.5) * 0.4,
  y: 1.2 + (Math.random() - 0.5) * 0.4
}));
const meanX = shots.reduce((s, d) => s + d.x, 0) / shots.length;
const meanY = shots.reduce((s, d) => s + d.y, 0) / shots.length;
const bias = Math.sqrt(meanX*meanX + meanY*meanY);
const mse = shots.reduce((s, d) => s + (d.x*d.x + d.y*d.y), 0) / shots.length;
console.log('MSE:', mse.toFixed(3), 'Bias (Sapma):', bias.toFixed(3));`
  },
  clt: {
    python: (params: any) => `import numpy as np
import scipy.stats as stats

# Merkezi Limit Teoremi
# Kaynak Dağılım: ${params.cltSource ?? 'uniform'}
n = ${params.cltSampleSize ?? 30} # Alt örneklem boyutu
m = ${params.cltSamplesCount ?? 200} # Simülasyon adedi (M)

sample_means = []
for _ in range(m):
    # n adet bağımsız gözlem çek ve ortalamasını al
    if '${params.cltSource ?? 'uniform'}' == 'uniform':
        sample = np.random.uniform(low=10, high=70, size=n)
    elif '${params.cltSource ?? 'uniform'}' == 'binomial':
        sample = np.random.binomial(n=100, p=0.5, size=n)
    else:
        sample = np.random.poisson(lam=27, size=n)
    sample_means.append(np.mean(sample))

# CLT uyarınca X̄ ~ Normal(Teorik_Ortalama, Teorik_Hata / sqrt(n))
print(f"Simüle Ortalamaların Ortalaması: {np.mean(sample_means):.3f}")
print(f"Standart Hata (Simüle): {np.std(sample_means):.3f}")`,
    r: (params: any) => `n <- ${params.cltSampleSize ?? 30}; m <- ${params.cltSamplesCount ?? 200}
# Dağılım: ${params.cltSource ?? 'uniform'}
if ('${params.cltSource ?? 'uniform'}' == 'uniform') {
  sample_means <- replicate(m, mean(runif(n, min=10, max=70)))
} else if ('${params.cltSource ?? 'uniform'}' == 'binomial') {
  sample_means <- replicate(m, mean(rbinom(n, 100, 0.5)))
} else {
  sample_means <- replicate(m, mean(rpois(n, 27)))
}

print(paste("Simulated Mean of Means:", round(mean(sample_means), 3)))
print(paste("Simulated SE (Standard Error):", round(sd(sample_means), 3)))`,
    sql: (params: any) => `-- CLT: M adet alt örneklemin gruplanarak ortalamalarının hesaplanması
-- Örneklem adedi: ${params.cltSamplesCount ?? 200}, Örneklem Boyutu: ${params.cltSampleSize ?? 30}
SELECT
  sample_id,
  AVG(value) AS sample_mean
FROM clt_simulation_runs
GROUP BY sample_id
ORDER BY sample_id;`,
    javascript: (params: any) => `const n = ${params.cltSampleSize ?? 30}, m = ${params.cltSamplesCount ?? 200};
const sampleMeans = [];
for (let s=0; s<m; s++) {
  let sum = 0;
  for (let i=0; i<n; i++) {
    // Dağılım: ${params.cltSource ?? 'uniform'}
    sum += 10 + Math.random() * 60;
  }
  sampleMeans.push(sum / n);
}
const avgOfMeans = sampleMeans.reduce((a,b)=>a+b, 0) / m;
console.log('JS CLT Mean of Means:', avgOfMeans.toFixed(3));`
  },
  qq_plot: {
    python: (params: any) => `import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt

n = ${params.n ?? 100}
# Dağılım Tipi: ${params.qqDistribution ?? 'normal'}
if '${params.qqDistribution ?? 'normal'}' == 'normal':
    sample = np.random.normal(loc=0, scale=1.5, size=n)
elif '${params.qqDistribution ?? 'normal'}' == 'skewed':
    sample = np.random.exponential(scale=1.5, size=n)
else:
    sample = np.random.logistic(loc=0, scale=1.5, size=n)

sample.sort()

# Yüzdelikler ve Teorik Z Çeyreklikleri: p = (j - 0.5) / n
p = (np.arange(1, n + 1) - 0.5) / n
z_theoretical = stats.norm.ppf(p)

plt.scatter(z_theoretical, sample)
plt.plot(z_theoretical, z_theoretical * 1.5, color='red') # referans çizgisi
plt.show()`,
    r: (params: any) => `n <- ${params.n ?? 100}
# Çizdirilen dağılım: ${params.qqDistribution ?? 'normal'}
if ('${params.qqDistribution ?? 'normal'}' == 'normal') {
  sample_data <- rnorm(n, mean=0, sd=1.5)
} else {
  sample_data <- rexp(n, rate=1/1.5)
}
qqnorm(sample_data)
qqline(sample_data, col="red")`,
    sql: (params: any) => `-- Q-Q Plot: Örnekleri sıralayıp teorik normal z-skorlarıyla eşleştirme
-- Toplam Gözlem (n): ${params.n ?? 100}, Kaynak Dağılımı: ${params.qqDistribution ?? 'normal'}
WITH OrderedSamples AS (
  SELECT
    value,
    ROW_NUMBER() OVER(ORDER BY value) AS j,
    COUNT(*) OVER() AS n
  FROM raw_samples
)
SELECT
  value AS sample_quantile,
  (j - 0.5)/n AS probability_level
FROM OrderedSamples;`,
    javascript: (params: any) => `const n = ${params.n ?? 100};
// Dağılım: ${params.qqDistribution ?? 'normal'}
const sample = Array.from({length: n}, () => Math.random() * 1.5).sort((a,b)=>a-b);
const points = sample.map((val, idx) => {
  const p = (idx + 1 - 0.5) / n;
  const t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1-p));
  const z = t - (2.515517) / (1 + 1.432788*t);
  return { z: p < 0.5 ? -z : z, value: val };
});
console.log('JS Q-Q Points calculated. Count:', points.length);`
  }
};