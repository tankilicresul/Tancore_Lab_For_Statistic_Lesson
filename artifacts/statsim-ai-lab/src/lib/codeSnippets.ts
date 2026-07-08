export const codeSnippets = {
  logistic: {
    python: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix

np.random.seed(42)

X = np.linspace(-20, 20, 500).reshape(-1, 1)
probability = 1 / (1 + np.exp(-0.25 * X))

y = np.random.binomial(1, probability.ravel())

model = LogisticRegression()
model.fit(X, y)

predictions = model.predict(X)
accuracy = accuracy_score(y, predictions)

print("Accuracy:", accuracy)
print(confusion_matrix(y, predictions))`,
    r: `set.seed(42)
x <- seq(-20, 20, length.out = 500)
p <- 1 / (1 + exp(-0.25 * x))
y <- rbinom(500, 1, p)
df <- data.frame(x, y)
model <- glm(y ~ x, family = binomial, data = df)
summary(model)
predictions <- predict(model, type = "response")`,
    sql: `SELECT
  x,
  y,
  prediction,
  ABS(y - prediction) AS error,
  probability
FROM simulation_data
WHERE model_type = 'logistic_regression'
ORDER BY x ASC;`,
    javascript: `const sigmoid = x => 1 / (1 + Math.exp(-0.25 * x));
const X = Array.from({length: 500}, (_, i) => -20 + i * 0.08);
const probs = X.map(sigmoid);
const y = probs.map(p => Math.random() < p ? 1 : 0);
const accuracy = y.filter((v, i) => v === Math.round(probs[i])).length / y.length;
console.log('Accuracy:', accuracy.toFixed(4));`
  },
  linear: {
    python: `import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

np.random.seed(42)
X = np.linspace(-10, 10, 200).reshape(-1, 1)
y = 0.5 * X.ravel() + 2 + np.random.normal(0, 1.5, 200)

model = LinearRegression()
model.fit(X, y)

predictions = model.predict(X)
print("R^2 Score:", model.score(X, y))`,
    r: `set.seed(42)
x <- seq(-10, 10, length.out=200)
y <- 0.5 * x + 2 + rnorm(200, 0, 1.5)
model <- lm(y ~ x)
summary(model)
plot(x, y)
abline(model, col="red")`,
    sql: `SELECT
  x, y,
  (0.5 * x + 2) AS prediction,
  POWER(y - (0.5 * x + 2), 2) AS squared_error
FROM simulation_data
WHERE model_type = 'linear_regression';`,
    javascript: `const X = Array.from({length: 200}, (_, i) => -10 + i * 0.1);
const noise = () => (Math.random() - 0.5) * 3;
const y = X.map(x => 0.5 * x + 2 + noise());
// OLS implementation omitted for brevity
console.log('Data generated. Ready for OLS.');`
  },
  normal: {
    python: `import numpy as np
import scipy.stats as stats

# Normal Distribution & Confidence Intervals
mean, std, n, conf = 0, 1.5, 100, 0.95
data = np.random.normal(loc=mean, scale=std, size=n)

x_bar = np.mean(data)
z_val = stats.norm.ppf(1 - (1 - conf)/2) # critical z-value (1.96)
margin_of_error = z_val * (std / np.sqrt(n))

ci_lower = x_bar - margin_of_error
ci_upper = x_bar + margin_of_error

print(f"Sample Mean: {x_bar:.3f}")
print(f"95% CI: [{ci_lower:.3f}, {ci_upper:.3f}]")`,
    r: `# Normal Distribution & Confidence Intervals
mean <- 0; std <- 1.5; n <- 100; conf <- 0.95
data <- rnorm(n, mean=mean, sd=std)

x_bar <- mean(data)
z_val <- qnorm(1 - (1 - conf)/2) # 1.96
margin_of_error <- z_val * (std / sqrt(n))

ci_lower <- x_bar - margin_of_error
ci_upper <- x_bar + margin_of_error

print(paste("Mean:", round(x_bar, 3)))
print(paste("95% CI:", round(ci_lower, 3), "to", round(ci_upper, 3)))`,
    sql: `-- Calculation of 95% Confidence Interval for mean
-- standard deviation (std) is assumed known as 1.5
SELECT
  AVG(value) AS x_bar,
  COUNT(value) AS n,
  AVG(value) - 1.960 * (1.5 / SQRT(COUNT(value))) AS ci_lower,
  AVG(value) + 1.960 * (1.5 / SQRT(COUNT(value))) AS ci_upper
FROM normal_distribution_data;`,
    javascript: `// Box-Muller normal samples and confidence intervals
const mean = 0, std = 1.5, n = 100, conf = 0.95;
let sum = 0;
for(let i=0; i<n; i++) {
  const u = Math.random(), v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  sum += z * std + mean;
}
const xBar = sum / n;
const zAlpha = 1.960; // 95% critical Z
const me = zAlpha * (std / Math.sqrt(n));
console.log(\`Mean: \${xBar.toFixed(3)}\`);
console.log(\`CI: [\${(xBar-me).toFixed(3)}, \${(xBar+me).toFixed(3)}]\`);`
  },
  hypothesis: {
    python: `import numpy as np
from scipy import stats

np.random.seed(42)
group_a = np.random.normal(0, 1, 100)
group_b = np.random.normal(1.0, 1, 100) # meanDiff=1

t_stat, p_val = stats.ttest_ind(group_a, group_b)
print(f"T-statistic: {t_stat:.3f}, P-value: {p_val:.4f}")`,
    r: `set.seed(42)
group_a <- rnorm(100, mean=0, sd=1)
group_b <- rnorm(100, mean=1.0, sd=1)

result <- t.test(group_a, group_b)
print(result)`,
    sql: `-- Two-sample T-test representation in SQL
SELECT
  group_name,
  AVG(value) as group_mean,
  VARIANCE(value) as group_var,
  COUNT(value) as n
FROM test_data
GROUP BY group_name;`,
    javascript: `// Two-sample t-test mock statistics
const meanA = 0.05, meanB = 1.02;
const varA = 0.98, varB = 1.05;
const n = 100;
const se = Math.sqrt(varA/n + varB/n);
const zStat = (meanA - meanB) / se;
console.log('Z-stat:', zStat.toFixed(3));`
  },
  error_propagation: {
    python: `import numpy as np

# Shooter target simulations (Point Estimators: Bias, Variance, MSE)
# Target is (0,0)
bias = np.array([1.2, 1.2]) # Shooter 1 high bias
std = 0.3                   # Low uncertainty

shots = np.random.normal(loc=bias, scale=std, size=(40, 2))
distances_sq = np.sum(shots**2, axis=1)

sample_bias = np.linalg.norm(np.mean(shots, axis=0))
sample_mse = np.mean(distances_sq)
sample_var = sample_mse - sample_bias**2

print(f"Bias: {sample_bias:.3f}")
print(f"Variance: {sample_var:.3f}")
print(f"Mean Square Error (MSE): {sample_mse:.3f}")`,
    r: `# Shooter simulation to measure Bias, Variance, and MSE
target_x <- 0; target_y <- 0
bias_x <- 1.2; bias_y <- 1.2; std <- 0.3

shots_x <- rnorm(40, mean=bias_x, sd=std)
shots_y <- rnorm(40, mean=bias_y, sd=std)

mean_x <- mean(shots_x); mean_y <- mean(shots_y)
bias_val <- sqrt((mean_x - target_x)^2 + (mean_y - target_y)^2)

dist_sq <- (shots_x - target_x)^2 + (shots_y - target_y)^2
mse_val <- mean(dist_sq)
var_val <- mse_val - bias_val^2

print(paste("Bias:", round(bias_val, 3), "Var:", round(var_val, 3), "MSE:", round(mse_val, 3)))`,
    sql: `-- Compute bias, variance and MSE of shots against coordinate (0,0)
SELECT
  AVG(x) AS mean_x,
  AVG(y) AS mean_y,
  SQRT(POWER(AVG(x), 2) + POWER(AVG(y), 2)) AS bias_estimation,
  AVG(POWER(x, 2) + POWER(y, 2)) AS mean_square_error
FROM shots_data
WHERE shooter = 'Shooter 1';`,
    javascript: `// Calculate Bias, Variance and MSE on generated shots coordinate pairs
const shots = Array.from({length: 40}, () => ({
  x: 1.2 + (Math.random() - 0.5) * 0.6,
  y: 1.2 + (Math.random() - 0.5) * 0.6
}));
const meanX = shots.reduce((s, d) => s + d.x, 0) / shots.length;
const meanY = shots.reduce((s, d) => s + d.y, 0) / shots.length;
const bias = Math.sqrt(meanX*meanX + meanY*meanY);
const mse = shots.reduce((s, d) => s + (d.x*d.x + d.y*d.y), 0) / shots.length;
const variance = mse - bias*bias;
console.log('MSE:', mse.toFixed(3), 'Bias:', bias.toFixed(3), 'Var:', variance.toFixed(3));`
  },
  clt: {
    python: `import numpy as np
import scipy.stats as stats

# Central Limit Theorem (CLT)
# Source: Uniform(10, 70) => mu = 40, sigma = 17.3205
n = 30 # Sample size
m = 200 # Number of simulations

sample_means = []
for _ in range(m):
    sample = np.random.uniform(low=10, high=70, size=n)
    sample_means.append(np.mean(sample))

# CLT states X_bar ~ Normal(mu, sigma / sqrt(n))
expected_mean = 40
expected_se = 17.3205 / np.sqrt(n)

print(f"Simulated Mean of Means: {np.mean(sample_means):.3f} (Expected: {expected_mean})")
print(f"Simulated SE: {np.std(sample_means):.3f} (Expected: {expected_se:.3f})")`,
    r: `# Central Limit Theorem Simulation
n <- 30; m <- 200
sample_means <- replicate(m, mean(runif(n, min=10, max=70)))

expected_mean <- 40
expected_se <- 17.3205 / sqrt(n)

print(paste("Simulated Mean:", round(mean(sample_means), 3)))
print(paste("Simulated SE:", round(sd(sample_means), 3)))`,
    sql: `-- CLT: Aggregating samples to calculate sample means
SELECT
  sample_id,
  AVG(value) AS sample_mean
FROM uniform_samples
GROUP BY sample_id
ORDER BY sample_id;`,
    javascript: `// CLT Uniform(10,70) simulator
const n = 30, m = 200;
const sampleMeans = [];
for (let s=0; s<m; s++) {
  let sum = 0;
  for (let i=0; i<n; i++) {
    sum += 10 + Math.random() * 60;
  }
  sampleMeans.push(sum / n);
}
const avgOfMeans = sampleMeans.reduce((a,b)=>a+b, 0) / m;
console.log('CLT Mean:', avgOfMeans.toFixed(3));`
  },
  qq_plot: {
    python: `import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt

# Q-Q Probability Plotting
n = 100
sample = np.random.normal(loc=0, scale=1.5, size=n)
sample.sort()

# Quantiles logic: p = (j - 0.5) / n
p = (np.arange(1, n + 1) - 0.5) / n
z_theoretical = stats.norm.ppf(p)

plt.scatter(z_theoretical, sample)
plt.xlabel("Theoretical Standard Normal Quantiles")
plt.ylabel("Sample Quantiles")
plt.title("Normal Probability Plot (Q-Q Plot)")
plt.show()`,
    r: `# Q-Q plot in R
n <- 100
sample_data <- rnorm(n, mean=0, sd=1.5)
qqnorm(sample_data)
qqline(sample_data, col="red")`,
    sql: `-- Ordering sample data to calculate percentiles (j - 0.5)/n
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
    javascript: `// Q-Q probability plotting helper
const n = 100;
const sample = Array.from({length: n}, () => Math.random() * 1.5).sort((a,b)=>a-b);
const points = sample.map((val, idx) => {
  const p = (idx + 1 - 0.5) / n;
  // standard normal inverse CDF approx
  const t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1-p));
  const z = t - (2.515517) / (1 + 1.432788*t);
  return { z: p < 0.5 ? -z : z, value: val };
});
console.log('Q-Q points count:', points.length);`
  }
};